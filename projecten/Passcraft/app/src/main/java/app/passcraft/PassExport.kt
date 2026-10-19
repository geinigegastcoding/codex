package app.passcraft

import android.content.ClipData
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import androidx.core.content.FileProvider
import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import java.io.File

const val WALLET_PACKAGE = "com.google.android.apps.walletnfcrel"

fun renderQr(value: String, size: Int = 320): Bitmap {
    val matrix = QRCodeWriter().encode(value, BarcodeFormat.QR_CODE, size, size,
        mapOf(EncodeHintType.CHARACTER_SET to "UTF-8", EncodeHintType.MARGIN to 3))
    val pixels = IntArray(matrix.width * matrix.height) { index ->
        if (matrix[index % matrix.width, index / matrix.width]) Color.BLACK else Color.WHITE
    }
    return Bitmap.createBitmap(pixels, matrix.width, matrix.height, Bitmap.Config.RGB_565)
}

fun renderPass(pass: Pass, store: PassStore): Bitmap {
    require(pass.validationError() == null) { pass.validationError() ?: "Invalid pass." }
    val width = 1080
    val padding = 64
    val background = Color.parseColor(pass.color)
    val color = if (androidx.core.graphics.ColorUtils.calculateLuminance(background) > 0.45) Color.rgb(24, 32, 61) else Color.WHITE
    fun text(value: String, size: Float, bold: Boolean = false) = StaticLayout.Builder.obtain(value, 0, value.length,
        TextPaint(Paint.ANTI_ALIAS_FLAG).apply { this.textSize = size; this.color = color; typeface = android.graphics.Typeface.create("sans-serif", if (bold) android.graphics.Typeface.BOLD else android.graphics.Typeface.NORMAL) }, width - padding * 2)
        .setAlignment(Layout.Alignment.ALIGN_NORMAL).setIncludePad(false).setLineSpacing(5f, 1f).build()
    val title = text(pass.title, 64f, true)
    val subtitle = pass.subtitle.takeIf { it.isNotBlank() }?.let { text(it, 38f) }
    val details = pass.details.takeIf { it.isNotBlank() }?.let { text(it, 34f) }
    val link = pass.link.takeIf { it.isNotBlank() }?.let { text(it, 32f) }
    val artwork = if (pass.artwork.isNotBlank()) BitmapFactory.decodeFile(File(store.artworkDir, pass.artwork).path)
        ?: error("Your artwork could not be opened. Choose another picture.") else null
    val artworkHeight = artwork?.let { (width.toFloat() / it.width * it.height).toInt() } ?: 0
    val qr = if (pass.qr.isNotBlank()) renderQr(pass.qr, 520) else null
    val height = padding * 2 + title.height + (subtitle?.let { it.height + 20 } ?: 0) +
        (if (artwork != null) artworkHeight + 48 else 0) + (if (qr != null) 616 else 0) +
        (details?.let { it.height + 40 } ?: 0) + (link?.let { it.height + 32 } ?: 0)
    check(height <= 12000) { "This picture is too tall to export. Choose a less narrow picture." }
    val result = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
    try {
        val canvas = Canvas(result)
        canvas.drawColor(background)
        var y = padding.toFloat()
        fun draw(layout: StaticLayout) { canvas.save(); canvas.translate(padding.toFloat(), y); layout.draw(canvas); canvas.restore(); y += layout.height }
        draw(title)
        subtitle?.let { y += 20; draw(it) }
        artwork?.let {
            y += 48
            canvas.drawBitmap(it, null, RectF(0f, y, width.toFloat(), y + artworkHeight), Paint(Paint.FILTER_BITMAP_FLAG))
            y += artworkHeight
        }
        qr?.let { y += 48; canvas.drawBitmap(it, (width - it.width) / 2f, y, null); y += it.height + 48 }
        details?.let { y += 40; draw(it) }
        link?.let { y += 32; draw(it) }
        return result
    } catch (error: Exception) { result.recycle(); throw error }
    finally { artwork?.recycle(); qr?.recycle() }
}

fun exportPass(context: Context, pass: Pass, store: PassStore): File {
    val directory = File(context.cacheDir, "pass-exports").apply { mkdirs() }
    val target = File(directory, "${pass.id}-${System.nanoTime()}.png")
    val bitmap = renderPass(pass, store)
    try {
        target.outputStream().use { check(bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)) { "The image could not be exported." } }
        return target
    } catch (error: Exception) { target.delete(); throw error }
    finally { bitmap.recycle() }
}

fun walletImageIntent(context: Context, file: File): Intent {
    val uri = FileProvider.getUriForFile(context, "${context.packageName}.files", file)
    return Intent(Intent.ACTION_SEND).setPackage(WALLET_PACKAGE).setType("image/png")
        .putExtra(Intent.EXTRA_STREAM, uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        .apply { clipData = ClipData.newUri(context.contentResolver, "Pass image", uri) }
}

fun saveToPhotos(context: Context, file: File, name: String): Uri {
    check(Build.VERSION.SDK_INT >= 29) { "Use the file picker on Android 9." }
    val values = ContentValues().apply {
        put(MediaStore.Images.Media.DISPLAY_NAME, "$name.png")
        put(MediaStore.Images.Media.MIME_TYPE, "image/png")
        put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/Passcraft")
        put(MediaStore.Images.Media.IS_PENDING, 1)
    }
    val resolver = context.contentResolver
    val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values) ?: error("Could not create an image in Photos.")
    try {
        resolver.openOutputStream(uri)?.use { output -> file.inputStream().use { it.copyTo(output) } }
            ?: error("Could not write to Photos.")
        check(resolver.update(uri, ContentValues().apply { put(MediaStore.Images.Media.IS_PENDING, 0) }, null, null) == 1) { "Could not finish saving the image." }
        return uri
    } catch (error: Exception) { resolver.delete(uri, null, null); throw error }
}
