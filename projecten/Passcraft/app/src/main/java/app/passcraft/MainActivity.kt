package app.passcraft

import android.content.Intent
import android.net.Uri
import android.nfc.NfcAdapter
import android.nfc.NdefMessage
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import java.io.File
import java.util.concurrent.Executors

class MainActivity : ComponentActivity() {
    lateinit var store: PassStore
        private set
    private val worker = Executors.newSingleThreadExecutor()
    private var resumed = false
    private var pendingWrite: NdefMessage? = null
    private var scanning = false
    private var pendingExport: File? = null
    private var pendingWallet = false
    var passes by mutableStateOf<List<Pass>>(emptyList())
        private set
    var storageError by mutableStateOf<String?>(null)
        private set
    var notice by mutableStateOf<String?>(null)
    var imageBusy by mutableStateOf(false)
        private set
    var exportBusy by mutableStateOf(false)
        private set
    var walletInstalled by mutableStateOf(false)
        private set
    var showWalletSteps by mutableStateOf(false)
    var nfcState by mutableStateOf("Checking NFC…")
        private set
    var nfcSupported by mutableStateOf(false)
        private set
    var nfcEnabled by mutableStateOf(false)
        private set
    var nfcResult by mutableStateOf("")
        private set
    var scanActive by mutableStateOf(false)
        private set

    private val saveDocument = registerForActivityResult(ActivityResultContracts.CreateDocument("image/png")) { uri ->
        val file = pendingExport
        if (uri != null && file != null) {
            exportBusy = true
            val openWallet = pendingWallet
            worker.execute {
                val result = runCatching {
                    contentResolver.openOutputStream(uri)?.use { output -> file.inputStream().use { it.copyTo(output) } }
                        ?: error("Could not write to the selected file.")
                }
                runOnUiThread { if (!isDestroyed) {
                    exportBusy = false
                    result.fold({ if (openWallet) showWalletSteps = true else notice = "Pass image saved." }, { notice = "Image could not be saved: ${it.message}" })
                } }
            }
        } else if (uri == null) notice = "Image save canceled. Your pass is still saved here."
        else notice = "The image export expired. Try saving the image again."
        pendingExport = null
        pendingWallet = false
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        store = PassStore(this)
        try { passes = store.load() } catch (error: Exception) {
            storageError = "Your saved passes could not be read. Nothing was overwritten. ${error.message}"
        }
        savedInstanceState?.getString("pending_export")?.let { name ->
            if (File(name).name == name) pendingExport = File(cacheDir, "pass-exports/$name")
        }
        pendingWallet = savedInstanceState?.getBoolean("pending_wallet") ?: false
        setContent { PasscraftApp(this) }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        pendingExport?.let { outState.putString("pending_export", it.name) }
        outState.putBoolean("pending_wallet", pendingWallet)
        super.onSaveInstanceState(outState)
    }

    fun save(pass: Pass): Boolean {
        pass.validationError()?.let { notice = it; return false }
        if (storageError != null) { notice = storageError; return false }
        return try {
            val values = if (passes.any { it.id == pass.id }) passes.map { if (it.id == pass.id) pass else it } else listOf(pass) + passes
            store.save(values)
            passes = values
            try { store.pruneArtwork(pass.id, pass.artwork) } catch (error: Exception) { notice = error.message }
            true
        } catch (error: Exception) { notice = "Pass could not be saved: ${error.message}"; false }
    }

    fun delete(pass: Pass): Boolean = try {
        check(storageError == null) { storageError ?: "Storage is unavailable." }
        val values = passes.filterNot { it.id == pass.id }
        store.save(values)
        passes = values
        try { store.pruneArtwork(pass.id) } catch (error: Exception) { notice = error.message }
        true
    } catch (error: Exception) { notice = "Pass could not be deleted: ${error.message}"; false }

    fun discard(pass: Pass) {
        try { store.pruneArtwork(pass.id, passes.find { it.id == pass.id }?.artwork ?: "") }
        catch (error: Exception) { notice = error.message }
    }

    fun importImage(uri: Uri, passId: String, onImported: (String) -> Unit) {
        imageBusy = true
        worker.execute {
            val result = runCatching { store.importArtwork(uri, passId) }
            runOnUiThread { if (!isDestroyed) {
                imageBusy = false
                result.fold(onImported) { notice = "Image could not be imported: ${it.message}" }
            } }
        }
    }

    fun prepareImage(pass: Pass, forWallet: Boolean) {
        if (exportBusy) return
        exportBusy = true
        worker.execute {
            val result = runCatching {
                val file = exportPass(this, pass, store)
                val intent = walletImageIntent(this, file)
                val canOpen = forWallet && intent.resolveActivity(packageManager) != null
                if (!canOpen && Build.VERSION.SDK_INT >= 29) saveToPhotos(this, file, pass.title.take(60).replace('/', '_'))
                Pair(file, if (canOpen) intent else null)
            }
            runOnUiThread { if (!isDestroyed) {
                exportBusy = false
                result.fold({ (file, intent) ->
                    when {
                        intent != null -> try {
                            startActivity(intent)
                            notice = "Continue adding your image in Google Wallet."
                        } catch (_: Exception) { notice = "Wallet couldn't open this image. Use Save image, then import it in Wallet." }
                        Build.VERSION.SDK_INT >= 29 -> if (forWallet) showWalletSteps = true else notice = "Saved to Pictures/Passcraft."
                        else -> {
                            pendingExport = file
                            pendingWallet = forWallet
                            saveDocument.launch("${pass.title.take(60).replace('/', '_')}.png")
                        }
                    }
                }, { notice = "Image export failed: ${it.message}" })
            } }
        }
    }

    fun openWallet() {
        val intent = packageManager.getLaunchIntentForPackage(WALLET_PACKAGE)
        if (intent != null) try { startActivity(intent) } catch (_: Exception) { notice = "Google Wallet could not open. Try opening it from your home screen." }
        else openUrl("https://play.google.com/store/apps/details?id=$WALLET_PACKAGE")
    }

    fun openUrl(url: String) {
        try { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) }
        catch (_: Exception) { notice = "No app is available to open this link." }
    }

    fun startScan(write: NdefMessage? = null) {
        val adapter = NfcAdapter.getDefaultAdapter(this)
        if (adapter?.isEnabled != true) { notice = nfcState; return }
        pendingWrite = write
        scanning = true
        scanActive = true
        nfcResult = ""
        enableReader()
    }

    fun stopScan() {
        scanning = false
        scanActive = false
        pendingWrite = null
        try { NfcAdapter.getDefaultAdapter(this)?.disableReaderMode(this) }
        catch (error: Exception) { notice = "NFC reader could not stop: ${error.message}" }
    }

    private fun enableReader() {
        if (!resumed || !scanning) return
        val write = pendingWrite
        try {
            NfcAdapter.getDefaultAdapter(this)?.enableReaderMode(this, { tag ->
                val result = runCatching { if (write == null) NfcTools.read(tag) else NfcTools.write(tag, write) }
                runOnUiThread {
                    result.fold({ nfcResult = it }, { nfcResult = "NFC failed: ${it.message}\nKeep the tag still and try again." })
                    stopScan()
                }
            }, NfcAdapter.FLAG_READER_NFC_A or NfcAdapter.FLAG_READER_NFC_B or NfcAdapter.FLAG_READER_NFC_F or NfcAdapter.FLAG_READER_NFC_V, null)
        } catch (error: Exception) { scanning = false; scanActive = false; notice = "NFC could not start: ${error.message}" }
    }

    override fun onResume() {
        super.onResume()
        resumed = true
        walletInstalled = runCatching { packageManager.getApplicationInfo(WALLET_PACKAGE, 0).enabled }.getOrDefault(false)
        val adapter = NfcAdapter.getDefaultAdapter(this)
        nfcSupported = adapter != null
        nfcEnabled = adapter?.isEnabled == true
        nfcState = when { adapter == null -> "This device has no NFC hardware."; !adapter.isEnabled -> "NFC is off. Turn it on in Android settings."; else -> "NFC is ready" }
        enableReader()
    }

    override fun onPause() {
        resumed = false
        if (scanning) NfcAdapter.getDefaultAdapter(this)?.disableReaderMode(this)
        super.onPause()
    }

    override fun onDestroy() { worker.shutdownNow(); super.onDestroy() }
}
