using System.IO;
using System.Text.RegularExpressions;

namespace Spreek.Services;

public sealed partial class DiagnosticLog
{
    private const long MaximumBytes = 2 * 1024 * 1024;
    private readonly AppPaths paths;
    private readonly SemaphoreSlim gate = new(1, 1);

    public DiagnosticLog(AppPaths paths)
    {
        this.paths = paths;
    }

    public async Task WriteAsync(string level, string message, CancellationToken cancellationToken = default)
    {
        var safeLevel = string.IsNullOrWhiteSpace(level) ? "info" : level.Trim().ToLowerInvariant();
        var safeMessage = Redact(message).Replace('\r', ' ').Replace('\n', ' ');
        if (safeMessage.Length > 8000)
        {
            safeMessage = safeMessage[..8000];
        }

        await gate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (File.Exists(paths.LogFile) && new FileInfo(paths.LogFile).Length >= MaximumBytes)
            {
                File.Move(paths.LogFile, paths.LogFile + ".old", true);
            }

            var line = $"{DateTimeOffset.Now:O} [{safeLevel}] {safeMessage}{Environment.NewLine}";
            await File.AppendAllTextAsync(paths.LogFile, line, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            gate.Release();
        }
    }

    internal static string Redact(string value)
    {
        var redacted = AuthorizationRegex().Replace(value, "$1[redacted]");
        return CredentialRegex().Replace(redacted, "$1=[redacted]");
    }

    [GeneratedRegex(@"(?i)(Authorization\s*:\s*(?:Token|Bearer)\s+)\S+")]
    private static partial Regex AuthorizationRegex();

    [GeneratedRegex(@"(?i)\b(api[_-]?key|apikey|password|token)\s*[:=]\s*([^\s,;]+)")]
    private static partial Regex CredentialRegex();
}
