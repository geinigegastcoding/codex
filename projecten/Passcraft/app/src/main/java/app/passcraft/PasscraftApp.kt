package app.passcraft

import android.content.Intent
import android.graphics.BitmapFactory
import android.provider.Settings
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.Saver
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat
import org.json.JSONObject
import java.io.File

private val Light = lightColorScheme(
    primary = Color(0xFF3154CA), onPrimary = Color.White,
    primaryContainer = Color(0xFFE5EAFF), onPrimaryContainer = Color(0xFF17295D),
    secondaryContainer = Color(0xFFE8EDFA), onSecondaryContainer = Color(0xFF1B315C),
    background = Color(0xFFF7F8FC), surface = Color(0xFFF7F8FC),
    surfaceContainer = Color.White, surfaceContainerHigh = Color(0xFFEDF0F7),
    onSurface = Color(0xFF1C2440), onSurfaceVariant = Color(0xFF515A70), outline = Color(0xFF747C91),
)
private val Dark = darkColorScheme(
    primary = Color(0xFFB8C4FF), onPrimary = Color(0xFF14296C),
    primaryContainer = Color(0xFF253D8A), onPrimaryContainer = Color(0xFFDDE3FF),
    secondaryContainer = Color(0xFF28334E), onSecondaryContainer = Color(0xFFDEE5FA),
    background = Color(0xFF11141E), surface = Color(0xFF11141E),
    surfaceContainer = Color(0xFF1C2130), surfaceContainerHigh = Color(0xFF262D3F),
    onSurface = Color(0xFFE7EBF7), onSurfaceVariant = Color(0xFFBFC6DB), outline = Color(0xFF909AB3),
)
private val PassSaver = Saver<Pass, String>(save = { it.json().toString() },
    restore = { Pass.fromJson(JSONObject(it), validate = false) })

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PasscraftApp(activity: MainActivity) {
    val darkTheme = isSystemInDarkTheme()
    SideEffect {
        WindowCompat.getInsetsController(activity.window, activity.window.decorView).apply {
            isAppearanceLightStatusBars = !darkTheme
            isAppearanceLightNavigationBars = !darkTheme
        }
    }
    MaterialTheme(colorScheme = if (darkTheme) Dark else Light) {
        var screen by rememberSaveable { mutableStateOf("passes") }
        var selectedId by rememberSaveable { mutableStateOf("") }
        var draft by rememberSaveable(stateSaver = PassSaver) { mutableStateOf(Pass()) }
        var discardDialog by remember { mutableStateOf(false) }
        var deleteDialog by remember { mutableStateOf(false) }
        val snackbar = remember { SnackbarHostState() }
        val selected = activity.passes.find { it.id == selectedId }
        val root = screen in listOf("passes", "nfc", "settings")
        val picker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
            if (uri != null) {
                val id = draft.id
                activity.importImage(uri, id) { filename -> if (draft.id == id) draft = draft.copy(artwork = filename) }
            }
        }
        fun edit(pass: Pass = Pass()) { draft = pass; screen = "edit" }
        fun back() {
            val original = selected ?: Pass(id = draft.id)
            if (screen == "edit" && draft.json().toString() != original.json().toString()) discardDialog = true
            else screen = "passes"
        }
        BackHandler(screen != "passes") { if (activity.imageBusy || activity.exportBusy) activity.notice = "Please wait for the current operation." else back() }
        LaunchedEffect(activity.notice) {
            activity.notice?.let { snackbar.showSnackbar(it); activity.notice = null }
        }
        DisposableEffect(screen) { onDispose { if (screen == "nfc") activity.stopScan() } }

        Scaffold(
            topBar = {
                TopAppBar(title = { Text(when(screen) { "edit" -> if (selectedId == draft.id) "Edit pass" else "Create pass"; "detail" -> "Your pass"; "nfc" -> "NFC tools"; "settings" -> "Settings"; else -> "Passcraft" }, fontWeight = FontWeight.SemiBold) },
                    navigationIcon = { if (!root) IconButton(onClick = { back() }, enabled = !activity.imageBusy && !activity.exportBusy) { Icon(Icons.AutoMirrored.Outlined.ArrowBack, "Back") } },
                    actions = { if (screen == "detail" && selected != null) IconButton(onClick = { deleteDialog = true }, enabled = !activity.exportBusy) { Icon(Icons.Outlined.DeleteOutline, "Delete pass") } })
            },
            snackbarHost = { SnackbarHost(snackbar) },
            bottomBar = {
                if (root) NavigationBar {
                    listOf(Triple("passes", "Passes", Icons.Outlined.Style), Triple("nfc", "NFC", Icons.Outlined.Nfc), Triple("settings", "Settings", Icons.Outlined.Tune)).forEach { (route, label, icon) ->
                        NavigationBarItem(selected = screen == route, onClick = { screen = route }, icon = { Icon(icon, null) }, label = { Text(label) })
                    }
                } else if (screen == "edit") Surface(shadowElevation = 2.dp) {
                    Button(onClick = {
                        val value = draft.copy(title = draft.title.trim(), subtitle = draft.subtitle.trim(), link = draft.link.trim())
                        if (activity.save(value)) { selectedId = value.id; screen = "detail"; activity.notice = "Pass saved on this phone." }
                    }, enabled = !activity.imageBusy && activity.storageError == null, modifier = Modifier.navigationBarsPadding().imePadding().padding(16.dp).fillMaxWidth().heightIn(min = 52.dp)) {
                        Icon(Icons.Outlined.Check, null); Spacer(Modifier.width(8.dp)); Text("Save pass")
                    }
                }
            },
            floatingActionButton = {
                if (screen == "passes" && activity.passes.isNotEmpty()) ExtendedFloatingActionButton(onClick = { selectedId = ""; edit() }, icon = { Icon(Icons.Outlined.Add, null) }, text = { Text("Create pass") })
            },
        ) { insets ->
            Box(Modifier.fillMaxSize().padding(insets).consumeWindowInsets(insets).imePadding(), contentAlignment = Alignment.TopCenter) {
                when (screen) {
                    "passes" -> Library(activity, onCreate = { selectedId = ""; edit() }, onSelect = { selectedId = it.id; screen = "detail" })
                    "edit" -> Editor(draft, activity, onChange = { draft = it }, onPick = { picker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) })
                    "detail" -> if (selected != null) PassDetails(selected, activity, onEdit = { edit(selected) })
                    "nfc" -> NfcScreen(activity)
                    "settings" -> SettingsScreen(activity)
                }
            }
        }
        if (discardDialog) AlertDialog(onDismissRequest = { discardDialog = false }, title = { Text("Discard unsaved changes?") },
            text = { Text("Save your pass first if you want to keep these changes.") },
            confirmButton = { TextButton(onClick = { activity.discard(draft); discardDialog = false; screen = if (selected != null) "detail" else "passes" }) { Text("Discard changes") } },
            dismissButton = { TextButton(onClick = { discardDialog = false }) { Text("Keep editing") } })
        if (deleteDialog && selected != null) AlertDialog(onDismissRequest = { deleteDialog = false }, title = { Text("Delete this local pass?") },
            text = { Text("This removes the copy in Passcraft. Exported images and Google Wallet copies stay where you saved them.") },
            confirmButton = { TextButton(onClick = { if (activity.delete(selected)) { deleteDialog = false; screen = "passes" } }) { Text("Delete pass") } },
            dismissButton = { TextButton(onClick = { deleteDialog = false }) { Text("Keep pass") } })
        if (activity.showWalletSteps) AlertDialog(onDismissRequest = { activity.showWalletSteps = false },
            title = { Text("Your pass image is saved") },
            text = { Text("In Google Wallet, choose Add to Wallet, then Everything else (or Photo). Select your exported image and confirm. Wallet controls its layout and security settings.") },
            confirmButton = { TextButton(onClick = { activity.showWalletSteps = false; activity.openWallet() }) { Text(if (activity.walletInstalled) "Open Google Wallet" else "Get Google Wallet") } },
            dismissButton = { TextButton(onClick = { activity.showWalletSteps = false }) { Text("Done") } })
    }
}

@Composable
private fun Library(activity: MainActivity, onCreate: () -> Unit, onSelect: (Pass) -> Unit) {
    LazyColumn(Modifier.widthIn(max = 680.dp).fillMaxSize(), contentPadding = PaddingValues(24.dp, 16.dp, 24.dp, 112.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        item {
            Text("Your passes", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(8.dp))
            Text(if (activity.passes.isEmpty()) "Your design. Your everyday carry." else "${activity.passes.size} saved on this phone", color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        activity.storageError?.let { error -> item { ErrorMessage(error) } }
        if (activity.passes.isEmpty()) item {
            Column(Modifier.fillMaxWidth().padding(top = 28.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Box(Modifier.fillMaxWidth().aspectRatio(1.35f).clip(RoundedCornerShape(24.dp)).background(MaterialTheme.colorScheme.secondaryContainer).clickable(enabled = activity.storageError == null, onClick = onCreate), contentAlignment = Alignment.Center) {
                    Icon(Icons.Outlined.AddPhotoAlternate, "Create your first pass", Modifier.size(76.dp), tint = MaterialTheme.colorScheme.onSecondaryContainer)
                }
                Spacer(Modifier.height(28.dp))
                Text("Make it yours", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(10.dp))
                Text("Start with a picture, add the details,\nand take your design to Google Wallet.", color = MaterialTheme.colorScheme.onSurfaceVariant, style = MaterialTheme.typography.bodyLarge, textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                Spacer(Modifier.height(24.dp))
                Button(onClick = onCreate, enabled = activity.storageError == null, modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp)) {
                    Icon(Icons.Outlined.Add, null); Spacer(Modifier.width(8.dp)); Text("Create a pass")
                }
                Spacer(Modifier.height(16.dp))
                Text("No account needed to create and save here.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        items(activity.passes, key = { it.id }) { pass ->
            Column(Modifier.clickable(onClick = { onSelect(pass) }).semantics { contentDescription = "Open ${pass.title}" }) {
                PassCard(pass, activity.store, compact = true)
                Row(Modifier.fillMaxWidth().padding(top = 10.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Outlined.PhoneAndroid, null, Modifier.size(16.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(Modifier.width(6.dp)); Text("Saved on this phone", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
    }
}

@Composable
private fun Editor(pass: Pass, activity: MainActivity, onChange: (Pass) -> Unit, onPick: () -> Unit) {
    Column(Modifier.widthIn(max = 680.dp).fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        PassCard(pass, activity.store, compact = true)
        OutlinedButton(onClick = onPick, enabled = !activity.imageBusy, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)) {
            if (activity.imageBusy) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp) else Icon(Icons.Outlined.AddPhotoAlternate, null)
            Spacer(Modifier.width(8.dp)); Text(if (activity.imageBusy) "Importing picture…" else if (pass.artwork.isBlank()) "Upload your design" else "Change picture")
        }
        Text("Your artwork stays on this phone. Wallet import is optional.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        SectionTitle("Pass details")
        Field(pass.title, { onChange(pass.copy(title = it.take(46))) }, "Pass name", "e.g. Weekend club")
        Field(pass.subtitle, { onChange(pass.copy(subtitle = it.take(87))) }, "Subtitle (optional)", "e.g. My membership")
        Field(pass.details, { onChange(pass.copy(details = it.take(1000))) }, "Notes (optional)", "Details to keep with your pass", singleLine = false)
        SectionTitle("Card color")
        Row(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("#3154CA" to "Cobalt", "#1A1A1A" to "Charcoal", "#1E7E3B" to "Forest", "#9A4627" to "Copper", "#677088" to "Slate", "#9147DF" to "Violet").forEach { (hex, name) ->
                val chosen = pass.color == hex
                Box(Modifier.size(48.dp).selectable(selected = chosen, role = Role.RadioButton, onClick = { onChange(pass.copy(color = hex)) }).semantics { contentDescription = "$name card color" }, contentAlignment = Alignment.Center) {
                    Box(Modifier.size(38.dp).clip(CircleShape).background(Color(android.graphics.Color.parseColor(hex))).then(if (chosen) Modifier.border(2.dp, MaterialTheme.colorScheme.onSurface, CircleShape) else Modifier), contentAlignment = Alignment.Center) {
                        if (chosen) Icon(Icons.Outlined.Check, null, Modifier.size(20.dp), tint = Color.White)
                    }
                }
            }
        }
        SectionTitle("Make it useful")
        Field(pass.qr, { onChange(pass.copy(qr = it.take(512))) }, "QR code data (optional)", "Membership number, text or link")
        Field(pass.link, { onChange(pass.copy(link = it.take(2048))) }, "Website link (optional)", "https://example.com", keyboard = KeyboardType.Uri)
        Spacer(Modifier.height(8.dp))
    }
}

@Composable
private fun PassDetails(pass: Pass, activity: MainActivity, onEdit: () -> Unit) {
    Column(Modifier.widthIn(max = 680.dp).fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        PassCard(pass, activity.store)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Outlined.PhoneAndroid, null, tint = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.width(10.dp)); Text("Saved on this phone", style = MaterialTheme.typography.titleSmall)
        }
        if (pass.details.isNotBlank()) { Text("Notes", style = MaterialTheme.typography.titleMedium); SelectionContainer { Text(pass.details, color = MaterialTheme.colorScheme.onSurfaceVariant) } }
        if (pass.link.isNotBlank()) TextButton(onClick = { activity.openUrl(pass.link) }) { Icon(Icons.Outlined.OpenInNew, null); Spacer(Modifier.width(8.dp)); Text("Open pass link") }
        HorizontalDivider()
        Text("Use in Google Wallet", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
        Text("Continue with a pass image. Wallet asks you to confirm and chooses the final layout. If image handoff isn't supported, we'll save the picture for you to import.", color = MaterialTheme.colorScheme.onSurfaceVariant)
        if (activity.exportBusy) Row(Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
            CircularProgressIndicator(Modifier.size(24.dp)); Spacer(Modifier.width(12.dp)); Text("Preparing your image…")
        } else {
            Button(onClick = { activity.prepareImage(pass, forWallet = true) }, modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp)) { Text("Continue in Google Wallet") }
            OutlinedButton(onClick = { activity.prepareImage(pass, forWallet = false) }, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)) { Icon(Icons.Outlined.SaveAlt, null); Spacer(Modifier.width(8.dp)); Text("Save image to phone") }
        }
        OutlinedButton(onClick = onEdit, enabled = !activity.exportBusy, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)) { Icon(Icons.Outlined.Edit, null); Spacer(Modifier.width(8.dp)); Text("Edit pass") }
    }
}

@Composable
private fun PassCard(pass: Pass, store: PassStore, compact: Boolean = false) {
    val background = Color(android.graphics.Color.parseColor(pass.color))
    val ink = if (background.luminance() > 0.45f) Color(0xFF18203D) else Color.White
    val image = remember(pass.artwork) { if (pass.artwork.isBlank()) null else BitmapFactory.decodeFile(File(store.artworkDir, pass.artwork).absolutePath)?.asImageBitmap() }
    Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(20.dp)).background(background)) {
        Column(Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) { Icon(Icons.Outlined.Style, null, Modifier.size(20.dp), tint = ink); Spacer(Modifier.width(8.dp)); Text("Passcraft", style = MaterialTheme.typography.labelLarge, color = ink) }
            Spacer(Modifier.height(4.dp))
            Text(pass.title.ifBlank { "Your pass" }, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold, color = ink)
            if (pass.subtitle.isNotBlank()) Text(pass.subtitle, style = MaterialTheme.typography.bodyMedium, color = ink)
        }
        if (image != null) Image(image, "Your uploaded artwork", Modifier.fillMaxWidth().heightIn(max = if (compact) 210.dp else 360.dp).aspectRatio(image.width.toFloat() / image.height), contentScale = ContentScale.Fit)
        if (!compact && pass.qr.isNotBlank()) {
            val qr = remember(pass.qr) { runCatching { renderQr(pass.qr) } }
            Box(Modifier.fillMaxWidth().padding(20.dp), contentAlignment = Alignment.Center) {
                qr.fold({ Image(it.asImageBitmap(), "QR code containing ${pass.qr}", Modifier.size(180.dp).clip(RoundedCornerShape(8.dp))) }, { Text("QR code could not be rendered: ${it.message}", color = ink) })
            }
        }
    }
}

@Composable
private fun SettingsScreen(activity: MainActivity) {
    Column(Modifier.widthIn(max = 680.dp).fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("Made for your phone", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.SemiBold)
        Text("Your pictures and passes stay in Passcraft until you choose to export an image or open it in Google Wallet.", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
        SectionTitle("No account. No server.")
        Text("Passcraft works offline and has no Internet permission. It uses the system photo picker, so it only sees pictures you choose.", color = MaterialTheme.colorScheme.onSurfaceVariant)
        HorizontalDivider()
        SectionTitle("Google Wallet")
        Text(if (activity.walletInstalled) "Google Wallet is installed." else "Google Wallet is not installed on this device.", style = MaterialTheme.typography.titleSmall)
        Text("Open a saved pass and choose Continue in Google Wallet. If your Wallet version accepts images, it opens the import screen. Otherwise, Passcraft saves your image for Photo or Everything else import.", color = MaterialTheme.colorScheme.onSurfaceVariant)
        OutlinedButton(onClick = { activity.openWallet() }, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)) { Text(if (activity.walletInstalled) "Open Google Wallet" else "Get Google Wallet") }
        Text("Google Wallet needs its own Google account. It controls sign-in, unlock requirements, pass layout, and any processing after import. Passcraft cannot override those settings.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        TextButton(onClick = { activity.openUrl("https://support.google.com/wallet/answer/14188766?hl=en") }) { Text("Google's photo import guide") }
        HorizontalDivider()
        SectionTitle("Your saved data")
        Text("Local passes survive app restarts. Uninstalling Passcraft removes them. Exported pictures and Wallet copies stay where you saved them.", color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text("Passcraft 0.1 · Android 9+", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun NfcScreen(activity: MainActivity) {
    var mode by rememberSaveable { mutableStateOf("read") }
    var kind by rememberSaveable { mutableStateOf("url") }
    var value by rememberSaveable { mutableStateOf("") }
    var confirmWrite by remember { mutableStateOf(false) }
    Column(Modifier.widthIn(max = 680.dp).fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Icon(Icons.Outlined.Nfc, null, Modifier.size(48.dp), tint = MaterialTheme.colorScheme.primary)
        Text("Small tag.\nUseful shortcut.", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.SemiBold)
        Text("Read NFC stickers and tags, or write a link or text to a writable tag.", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(activity.nfcState, style = MaterialTheme.typography.titleSmall)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            FilterChip(selected = mode == "read", onClick = { activity.stopScan(); mode = "read" }, label = { Text("Read tag") })
            FilterChip(selected = mode == "write", onClick = { activity.stopScan(); mode = "write" }, label = { Text("Write tag") })
        }
        if (mode == "write") {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                FilterChip(selected = kind == "url", onClick = { kind = "url"; value = "" }, label = { Text("Website link") }, enabled = !activity.scanActive)
                FilterChip(selected = kind == "text", onClick = { kind = "text"; value = "" }, label = { Text("Plain text") }, enabled = !activity.scanActive)
            }
            Field(value, { value = it.take(2048) }, if (kind == "url") "Website link" else "Text to write", if (kind == "url") "https://example.com" else "Your tag's text", keyboard = if (kind == "url") KeyboardType.Uri else KeyboardType.Text, singleLine = kind == "url", enabled = !activity.scanActive)
        }
        if (activity.scanActive) {
            LinearProgressIndicator(Modifier.fillMaxWidth())
            Text("Hold a tag against the back of your phone.", style = MaterialTheme.typography.titleMedium)
            OutlinedButton(onClick = { activity.stopScan() }, modifier = Modifier.fillMaxWidth()) { Text("Cancel scan") }
        } else Button(onClick = {
            if (mode == "read") activity.startScan() else try { NfcTools.message(kind, value); confirmWrite = true } catch (error: Exception) { activity.notice = error.message }
        }, enabled = activity.nfcEnabled, modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp)) { Text(if (mode == "read") "Scan a tag" else "Write to a tag") }
        if (activity.nfcSupported && !activity.nfcEnabled) TextButton(onClick = { try { activity.startActivity(Intent(Settings.ACTION_NFC_SETTINGS)) } catch (_: Exception) { activity.notice = "NFC settings are unavailable on this device." } }) { Text("Open Android NFC settings") }
        if (activity.nfcResult.isNotBlank()) { HorizontalDivider(); SelectionContainer { Text(activity.nfcResult, style = MaterialTheme.typography.bodyMedium) } }
        HorizontalDivider()
        Text("Wallet NFC uses Smart Tap with compatible readers and issuer setup. Reading a tag here does not turn it into a Wallet NFC pass.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
    if (confirmWrite) AlertDialog(onDismissRequest = { confirmWrite = false }, title = { Text("Replace the tag's contents?") }, text = { Text("Writing replaces the NDEF records on the next tag you tap. Use a tag you intend to overwrite.") },
        confirmButton = { TextButton(onClick = { confirmWrite = false; try { activity.startScan(NfcTools.message(kind, value)) } catch (error: Exception) { activity.notice = error.message } }) { Text("Ready to write") } },
        dismissButton = { TextButton(onClick = { confirmWrite = false }) { Text("Cancel") } })
}

@Composable
private fun SectionTitle(text: String) { Text(text, Modifier.padding(top = 10.dp), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold) }

@Composable
private fun Field(value: String, onChange: (String) -> Unit, label: String, placeholder: String, singleLine: Boolean = true, keyboard: KeyboardType = KeyboardType.Text, enabled: Boolean = true) {
    OutlinedTextField(value = value, onValueChange = onChange, label = { Text(label) }, placeholder = { Text(placeholder) }, singleLine = singleLine,
        minLines = if (singleLine) 1 else 3, maxLines = if (singleLine) 1 else 6, keyboardOptions = KeyboardOptions(keyboardType = keyboard), enabled = enabled, modifier = Modifier.fillMaxWidth())
}

@Composable
private fun ErrorMessage(text: String) { Surface(color = MaterialTheme.colorScheme.errorContainer, shape = RoundedCornerShape(12.dp)) { Text(text, Modifier.padding(16.dp), color = MaterialTheme.colorScheme.onErrorContainer) } }
