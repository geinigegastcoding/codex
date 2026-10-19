package app.passcraft

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ImageDecoder
import android.net.Uri
import android.util.AtomicFile
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.UUID

data class Pass(
    val id: String = UUID.randomUUID().toString(),
    val title: String = "",
    val subtitle: String = "",
    val details: String = "",
    val qr: String = "",
    val link: String = "",
    val color: String = "#3154CA",
    val artwork: String = "",
) {
    fun json(): JSONObject = JSONObject().apply {
        put("id", id); put("title", title); put("subtitle", subtitle)
        put("details", details); put("qr", qr); put("link", link)
        put("color", color); put("artwork", artwork)
    }

    fun validationError(): String? = when {
        title.isBlank() -> "Give your pass a name."
        title.length > 46 -> "Keep the pass name under 47 characters."
        subtitle.length > 87 -> "Keep the subtitle under 88 characters."
        details.length > 1000 -> "Keep the notes under 1,001 characters."
        qr.toByteArray(Charsets.UTF_8).size > 512 -> "Keep QR data under 513 bytes."
        link.isNotBlank() && !isWebUrl(link) -> "Use a complete https:// or http:// link."
        !Regex("#[0-9A-Fa-f]{6}").matches(color) -> "Choose a valid pass color."
        else -> null
    }

    companion object {
        fun fromJson(value: JSONObject, validate: Boolean = true): Pass = Pass(
            id = value.getString("id"), title = value.getString("title"),
            subtitle = value.optString("subtitle"), details = value.optString("details"),
            qr = value.optString("qr"), link = value.optString("link"),
            color = value.optString("color", "#3154CA"), artwork = value.optString("artwork"),
        ).also {
            require(Regex("[a-zA-Z0-9_-]{1,80}").matches(it.id)) { "Invalid saved pass ID." }
            require(!validate || it.validationError() == null) { "A saved pass is invalid: ${it.validationError()}" }
            require(it.artwork.isBlank() || File(it.artwork).name == it.artwork) { "Invalid artwork path." }
        }
    }
}

fun isWebUrl(value: String, httpsOnly: Boolean = false): Boolean = runCatching {
    val uri = java.net.URI(value)
    uri.host?.isNotBlank() == true && uri.userInfo == null &&
        (uri.scheme.equals("https", true) || (!httpsOnly && uri.scheme.equals("http", true))) &&
        value.length <= 2048
}.getOrDefault(false)

class PassStore(private val context: Context) {
    private val file = AtomicFile(File(context.filesDir, "passes.json"))
    val artworkDir = File(context.filesDir, "artwork").apply { mkdirs() }

    fun load(): List<Pass> {
        if (!file.baseFile.exists() && !File(file.baseFile.path + ".bak").exists()) return emptyList()
        val values = JSONArray(file.openRead().bufferedReader().use { it.readText() })
        return List(values.length()) { Pass.fromJson(values.getJSONObject(it)) }.also { passes ->
            require(passes.map { it.id }.distinct().size == passes.size) { "Duplicate saved pass IDs." }
            require(passes.all { it.artwork.isBlank() || File(artworkDir, it.artwork).isFile }) {
                "Saved artwork is missing. Passes have been kept; restore the artwork before saving changes."
            }
        }
    }

    fun save(passes: List<Pass>) {
        val data = JSONArray().apply { passes.forEach { put(it.json()) } }.toString()
        val stream = file.startWrite()
        try {
            stream.write(data.toByteArray(Charsets.UTF_8))
            file.finishWrite(stream)
        } catch (error: Exception) {
            file.failWrite(stream)
            throw error
        }
    }

    fun importArtwork(uri: Uri, id: String): String {
        val decoded = ImageDecoder.decodeBitmap(ImageDecoder.createSource(context.contentResolver, uri)) { decoder, info, _ ->
            require(info.size.width in 1..20000 && info.size.height in 1..20000) { "Choose an image smaller than 20,000 pixels per side." }
            val scale = minOf(1.0, 1400.0 / maxOf(info.size.width, info.size.height))
            decoder.setTargetSize(maxOf(1, (info.size.width * scale).toInt()), maxOf(1, (info.size.height * scale).toInt()))
            decoder.allocator = ImageDecoder.ALLOCATOR_SOFTWARE
        }
        val image = Bitmap.createBitmap(decoded.width, decoded.height, Bitmap.Config.ARGB_8888)
        Canvas(image).apply { drawColor(Color.WHITE); drawBitmap(decoded, 0f, 0f, null) }
        decoded.recycle()
        val name = "$id-${UUID.randomUUID()}.jpg"
        val target = File(artworkDir, name)
        try {
            target.outputStream().use { check(image.compress(Bitmap.CompressFormat.JPEG, 92, it)) { "Could not save the image." } }
        } catch (error: Exception) {
            target.delete()
            throw error
        } finally { image.recycle() }
        return name
    }

    fun pruneArtwork(id: String, keep: String = "") {
        artworkDir.listFiles()?.filter { it.name.startsWith("$id-") && it.name != keep }?.forEach {
            check(it.delete()) { "Could not remove unused artwork: ${it.name}" }
        }
    }
}
