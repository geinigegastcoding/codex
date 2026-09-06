using System.IO;
using System.Text.Json;
using Spreek.Core;

namespace Spreek.Services;

public enum DeepgramMessageKind
{
    Result,
    Metadata,
    Error,
    Other,
}

public sealed record DeepgramMessage(
    DeepgramMessageKind Kind,
    TranscriptSegment? Segment,
    string? RequestId,
    string? Language,
    string? ErrorMessage);

public static class DeepgramResponseParser
{
    public static DeepgramMessage Parse(string json)
    {
        try
        {
            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;
            var type = String(root, "type") ?? string.Empty;
            var requestId = String(root, "request_id") ??
                (root.TryGetProperty("metadata", out var metadata) ? String(metadata, "request_id") : null);

            if (type.Equals("Metadata", StringComparison.OrdinalIgnoreCase))
            {
                return new DeepgramMessage(DeepgramMessageKind.Metadata, null, requestId, null, null);
            }

            if (type.Equals("Error", StringComparison.OrdinalIgnoreCase))
            {
                var message = String(root, "description") ?? String(root, "message") ?? "Deepgram returned an error.";
                return new DeepgramMessage(DeepgramMessageKind.Error, null, requestId, null, message);
            }

            if (!type.Equals("Results", StringComparison.OrdinalIgnoreCase) ||
                !root.TryGetProperty("channel", out var channel) ||
                !channel.TryGetProperty("alternatives", out var alternatives) ||
                alternatives.ValueKind != JsonValueKind.Array ||
                alternatives.GetArrayLength() == 0)
            {
                return new DeepgramMessage(DeepgramMessageKind.Other, null, requestId, null, null);
            }

            var alternative = alternatives[0];
            var transcript = String(alternative, "transcript") ?? string.Empty;
            var confidence = Number(alternative, "confidence");
            var language = FirstString(alternative, "languages") ?? FirstWordLanguage(alternative);
            var segment = new TranscriptSegment(
                Number(root, "start"),
                Number(root, "duration"),
                transcript,
                Boolean(root, "is_final"),
                Boolean(root, "from_finalize"),
                confidence);
            return new DeepgramMessage(DeepgramMessageKind.Result, segment, requestId, language, null);
        }
        catch (JsonException error)
        {
            throw new InvalidDataException("Deepgram returned malformed JSON.", error);
        }
    }

    private static string? FirstWordLanguage(JsonElement alternative)
    {
        if (!alternative.TryGetProperty("words", out var words) ||
            words.ValueKind != JsonValueKind.Array ||
            words.GetArrayLength() == 0)
        {
            return null;
        }

        return String(words[0], "language");
    }

    private static string? FirstString(JsonElement element, string property)
    {
        if (!element.TryGetProperty(property, out var values) ||
            values.ValueKind != JsonValueKind.Array ||
            values.GetArrayLength() == 0)
        {
            return null;
        }

        return values[0].ValueKind == JsonValueKind.String ? values[0].GetString() : null;
    }

    private static string? String(JsonElement element, string property) =>
        element.TryGetProperty(property, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;

    private static double Number(JsonElement element, string property) =>
        element.TryGetProperty(property, out var value) && value.TryGetDouble(out var number) ? number : 0;

    private static bool Boolean(JsonElement element, string property) =>
        element.TryGetProperty(property, out var value) && value.ValueKind is JsonValueKind.True;
}
