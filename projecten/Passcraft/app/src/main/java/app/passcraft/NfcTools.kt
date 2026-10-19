package app.passcraft

import android.nfc.NdefMessage
import android.nfc.NdefRecord
import android.nfc.Tag
import android.nfc.tech.Ndef
import android.nfc.tech.NdefFormatable

object NfcTools {
    fun message(kind: String, value: String): NdefMessage {
        require(value.isNotBlank()) { "Enter something to write to the tag." }
        require(value.toByteArray(Charsets.UTF_8).size <= 2048) { "Keep tag data under 2,049 bytes." }
        val record = when (kind) {
            "url" -> {
                require(isWebUrl(value)) { "Enter a complete http:// or https:// link." }
                NdefRecord.createUri(value)
            }
            "text" -> NdefRecord.createTextRecord("en", value)
            else -> error("Choose a URL or a text record.")
        }
        return NdefMessage(arrayOf(record))
    }

    fun read(tag: Tag): String {
        val info = "Tag ID: ${tag.id.joinToString(":") { "%02X".format(it) }}\n" +
            "Technology: ${tag.techList.joinToString { it.substringAfterLast('.') }}"
        val ndef = Ndef.get(tag) ?: return "$info\n\nThis tag does not contain supported NDEF data."
        return ndef.use {
            it.connect()
            val message = it.ndefMessage
            val records = message?.records?.mapIndexed { index, record -> "Record ${index + 1}\n${decode(record)}" }
            "$info\nCapacity: ${it.maxSize} bytes\n${if (it.isWritable) "Writable" else "Read-only"}\n\n" +
                (records?.joinToString("\n\n") ?: "No NDEF records on this tag.")
        }
    }

    fun write(tag: Tag, message: NdefMessage): String {
        val ndef = Ndef.get(tag)
        if (ndef != null) {
            ndef.use {
                it.connect()
                check(it.isWritable) { "This tag is read-only. Choose a writable tag." }
                check(message.toByteArray().size <= it.maxSize) {
                    "This needs ${message.toByteArray().size} bytes; the tag holds ${it.maxSize}. Shorten the data or use a larger tag."
                }
                it.writeNdefMessage(message)
            }
        } else {
            val formatable = NdefFormatable.get(tag)
                ?: error("This tag cannot store NDEF records. Choose a compatible writable NFC tag.")
            formatable.use { it.connect(); it.format(message) }
        }
        return "Tag written successfully (${message.toByteArray().size} bytes)."
    }

    fun decode(record: NdefRecord): String {
        record.toUri()?.let { return "URL: $it" }
        if (record.tnf == NdefRecord.TNF_WELL_KNOWN && record.type.contentEquals(NdefRecord.RTD_TEXT)) {
            val payload = record.payload
            require(payload.isNotEmpty()) { "The tag contains an empty text record." }
            val status = payload[0].toInt() and 0xff
            val offset = 1 + (status and 0x3f)
            require(offset <= payload.size) { "The tag contains a malformed text record." }
            val encoding = if (status and 0x80 != 0) Charsets.UTF_16 else Charsets.UTF_8
            return "Text: ${String(payload, offset, payload.size - offset, encoding)}"
        }
        return "Unsupported record (${record.payload.size} bytes), type ${record.type.toString(Charsets.US_ASCII)}."
    }
}
