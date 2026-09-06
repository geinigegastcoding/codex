using System.IO;
using System.Globalization;
using System.Text;
using Spreek.Core;

namespace Spreek.Services;

public interface INoteExporter
{
    Task<string> ExportAsync(HistoryEntry transcript, string folder, CancellationToken cancellationToken = default);
}

public sealed class MarkdownNoteExporter : INoteExporter
{
    public async Task<string> ExportAsync(
        HistoryEntry transcript,
        string folder,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(folder);
        var directory = Path.GetFullPath(folder);
        Directory.CreateDirectory(directory);
        var stamp = transcript.CreatedAt.ToLocalTime().ToString("yyyy-MM-dd-HHmmss", CultureInfo.InvariantCulture);
        var path = Path.Combine(directory, $"{stamp}-spreek-{transcript.Id.ToString("N")[..8]}.md");
        if (File.Exists(path))
        {
            return path;
        }

        var contents = $"""
            ---
            title: Spreek capture {stamp}
            created: {transcript.CreatedAt.ToLocalTime():yyyy-MM-dd}
            type: capture
            tags: [personal, inbox, voice]
            sources: [spreek:{transcript.Id:N}]
            status: needs-review
            ---

            # Spreek capture

            {transcript.Text}

            ## Capture

            - Captured at: {transcript.CreatedAt:O}
            - Duration: {transcript.DurationSeconds:F1} seconds
            - Transcript ID: `{transcript.Id:N}`
            """ + Environment.NewLine;
        await File.WriteAllTextAsync(path, contents, new UTF8Encoding(false), cancellationToken).ConfigureAwait(false);
        return path;
    }
}
