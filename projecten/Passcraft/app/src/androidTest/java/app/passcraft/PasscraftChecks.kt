package app.passcraft

import android.content.ContextWrapper
import android.graphics.Bitmap
import android.net.Uri
import android.nfc.NdefRecord
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

@RunWith(AndroidJUnit4::class)
class PasscraftChecks {
    private val context get() = InstrumentationRegistry.getInstrumentation().targetContext

    @Test fun exportedImageContainsAScannableQrCodeWithoutAServer() {
        val store = PassStore(context)
        val bitmap = renderPass(Pass(title = "Weekend club", qr = "member-42"), store)
        try {
            val pixels = IntArray(bitmap.width * bitmap.height)
            bitmap.getPixels(pixels, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)
            val source = com.google.zxing.RGBLuminanceSource(bitmap.width, bitmap.height, pixels)
            val result = com.google.zxing.qrcode.QRCodeReader().decode(com.google.zxing.BinaryBitmap(com.google.zxing.common.HybridBinarizer(source)))
            assertEquals("member-42", result.text)
        } finally { bitmap.recycle() }
    }

    @Test fun imageHandoffGrantsOnlyReadAccessToWalletAndAppHasNoInternetPermission() {
        val image = exportPass(context, Pass(title = "Local pass"), PassStore(context))
        val intent = walletImageIntent(context, image)
        assertEquals("image/png", intent.type)
        assertEquals(WALLET_PACKAGE, intent.getPackage())
        assertTrue(intent.flags and android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION != 0)
        assertEquals(0, intent.flags and android.content.Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
        val uri = intent.clipData!!.getItemAt(0).uri
        assertEquals("content", uri.scheme)
        assertTrue(context.contentResolver.openInputStream(uri)!!.use { it.readBytes().isNotEmpty() })
        val permissions = context.packageManager.getPackageInfo(context.packageName, android.content.pm.PackageManager.GET_PERMISSIONS).requestedPermissions ?: emptyArray()
        assertFalse("A personal, local-only app must not upload anything.", permissions.contains(android.Manifest.permission.INTERNET))
    }

    @Test fun unsafeLinksAndOversizedQrDataCannotBeIssued() {
        assertNotNull(Pass(title = "Club", link = "javascript:alert(1)").validationError())
        assertNotNull(Pass(title = "Club", qr = "€".repeat(200)).validationError())
        assertNotNull(Pass(title = " ").validationError())
        assertFalse(isWebUrl("https://user:secret@example.com"))
        assertTrue(isWebUrl("https://example.com/membership?id=42"))
        assertThrows(IllegalArgumentException::class.java) { NfcTools.message("url", "javascript:alert(1)") }
    }

    @Test fun savedPassesAndImportedPicturesSurviveReloadAndCorruptionFailsLoudly() {
        val folder = File(context.cacheDir, "passcraft-check-${System.nanoTime()}").apply { mkdirs() }
        val isolated = object : ContextWrapper(context) { override fun getFilesDir(): File = folder }
        try {
            val store = PassStore(isolated)
            val source = File(folder, "source.png")
            Bitmap.createBitmap(2800, 1400, Bitmap.Config.RGB_565).also { bitmap ->
                bitmap.eraseColor(android.graphics.Color.BLUE)
                source.outputStream().use { bitmap.compress(Bitmap.CompressFormat.PNG, 100, it) }
                bitmap.recycle()
            }
            val pass = Pass(title = "Club")
            val artwork = store.importArtwork(Uri.fromFile(source), pass.id)
            store.save(listOf(pass.copy(artwork = artwork)))
            val reloaded = PassStore(isolated).load().single()
            assertEquals("Club", reloaded.title)
            val bounds = android.graphics.BitmapFactory.Options().apply { inJustDecodeBounds = true }
            android.graphics.BitmapFactory.decodeFile(File(store.artworkDir, artwork).path, bounds)
            assertEquals(1400, bounds.outWidth)
            assertEquals(700, bounds.outHeight)
            File(folder, "passes.json").writeText("broken JSON")
            assertThrows(Exception::class.java) { store.load() }
            assertEquals("broken JSON", File(folder, "passes.json").readText())
        } finally { folder.deleteRecursively() }
    }

    @Test fun nfcTextAndUrlDataRoundTripIncludingUnicodeAndMalformedRecordsAreRejected() {
        assertEquals("Text: café 🎫", NfcTools.decode(NfcTools.message("text", "café 🎫").records.single()))
        assertEquals("URL: https://example.com/member", NfcTools.decode(NfcTools.message("url", "https://example.com/member").records.single()))
        val utf16 = byteArrayOf(0x82.toByte(), 'e'.code.toByte(), 'n'.code.toByte()) + "Hello".toByteArray(Charsets.UTF_16)
        assertEquals("Text: Hello", NfcTools.decode(NdefRecord(NdefRecord.TNF_WELL_KNOWN, NdefRecord.RTD_TEXT, byteArrayOf(), utf16)))
        val malformed = NdefRecord(NdefRecord.TNF_WELL_KNOWN, NdefRecord.RTD_TEXT, byteArrayOf(), byteArrayOf(10))
        assertThrows(IllegalArgumentException::class.java) { NfcTools.decode(malformed) }
        assertThrows(IllegalArgumentException::class.java) { NfcTools.message("text", "a".repeat(2049)) }
    }
}
