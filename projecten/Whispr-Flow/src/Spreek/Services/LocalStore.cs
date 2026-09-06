using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Spreek.Core;

namespace Spreek.Services;

public interface IHistoryStore
{
    Task AppendHistoryAsync(HistoryEntry entry, CancellationToken cancellationToken = default);
    Task<HistoryLoadResult> LoadHistoryAsync(CancellationToken cancellationToken = default);
    Task UpdateHistoryAsync(HistoryEntry entry, CancellationToken cancellationToken = default);
}

public sealed class LocalStore : IHistoryStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true,
        Converters = { new JsonStringEnumConverter() },
    };

    private static readonly JsonSerializerOptions LineOptions = new(JsonOptions) { WriteIndented = false };
    private static readonly UTF8Encoding Utf8 = new(false);
    private readonly SemaphoreSlim gate = new(1, 1);

    public LocalStore(AppPaths paths)
    {
        Paths = paths;
    }

    public AppPaths Paths { get; }

    public Task<AppSettings> LoadSettingsAsync(CancellationToken cancellationToken = default) =>
        LoadJsonAsync(Paths.SettingsFile, static () => new AppSettings(), cancellationToken);

    public Task SaveSettingsAsync(AppSettings settings, CancellationToken cancellationToken = default) =>
        SaveJsonAsync(Paths.SettingsFile, settings, cancellationToken);

    public Task<IReadOnlyList<DictionaryEntry>> LoadDictionaryAsync(CancellationToken cancellationToken = default) =>
        LoadJsonAsync<IReadOnlyList<DictionaryEntry>>(Paths.DictionaryFile, static () => [], cancellationToken);

    public Task SaveDictionaryAsync(IReadOnlyList<DictionaryEntry> entries, CancellationToken cancellationToken = default) =>
        SaveJsonAsync(Paths.DictionaryFile, entries, cancellationToken);

    public Task<IReadOnlyList<SnippetEntry>> LoadSnippetsAsync(CancellationToken cancellationToken = default) =>
        LoadJsonAsync<IReadOnlyList<SnippetEntry>>(Paths.SnippetsFile, static () => [], cancellationToken);

    public Task SaveSnippetsAsync(IReadOnlyList<SnippetEntry> entries, CancellationToken cancellationToken = default) =>
        SaveJsonAsync(Paths.SnippetsFile, entries, cancellationToken);

    public async Task AppendHistoryAsync(HistoryEntry entry, CancellationToken cancellationToken = default)
    {
        await gate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            var json = JsonSerializer.Serialize(entry, LineOptions) + Environment.NewLine;
            await using var stream = new FileStream(
                Paths.HistoryFile,
                FileMode.Append,
                FileAccess.Write,
                FileShare.Read,
                4096,
                FileOptions.Asynchronous | FileOptions.WriteThrough);
            var bytes = Utf8.GetBytes(json);
            await stream.WriteAsync(bytes, cancellationToken).ConfigureAwait(false);
            await stream.FlushAsync(cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            gate.Release();
        }
    }

    public async Task<HistoryLoadResult> LoadHistoryAsync(CancellationToken cancellationToken = default)
    {
        await gate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            return await LoadHistoryUnlockedAsync(cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            gate.Release();
        }
    }

    public async Task SaveHistoryAsync(IReadOnlyList<HistoryEntry> entries, CancellationToken cancellationToken = default)
    {
        await gate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            var builder = new StringBuilder();
            foreach (var entry in entries)
            {
                builder.AppendLine(JsonSerializer.Serialize(entry, LineOptions));
            }

            await AtomicWriteAsync(Paths.HistoryFile, builder.ToString(), cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            gate.Release();
        }
    }

    public async Task UpdateHistoryAsync(HistoryEntry entry, CancellationToken cancellationToken = default)
    {
        await gate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            var loaded = await LoadHistoryUnlockedAsync(cancellationToken).ConfigureAwait(false);
            var entries = loaded.Entries.ToList();
            var index = entries.FindIndex(item => item.Id == entry.Id);
            if (index < 0)
            {
                throw new KeyNotFoundException($"Transcript {entry.Id} was not found.");
            }

            entries[index] = entry;
            var text = string.Join(Environment.NewLine, entries.Select(item => JsonSerializer.Serialize(item, LineOptions))) + Environment.NewLine;
            await AtomicWriteAsync(Paths.HistoryFile, text, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            gate.Release();
        }
    }

    public async Task DeleteHistoryAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await gate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            var loaded = await LoadHistoryUnlockedAsync(cancellationToken).ConfigureAwait(false);
            var deleted = loaded.Entries.FirstOrDefault(entry => entry.Id == id);
            var remaining = loaded.Entries.Where(entry => entry.Id != id).ToArray();
            var text = remaining.Length == 0
                ? string.Empty
                : string.Join(Environment.NewLine, remaining.Select(item => JsonSerializer.Serialize(item, LineOptions))) + Environment.NewLine;
            await AtomicWriteAsync(Paths.HistoryFile, text, cancellationToken).ConfigureAwait(false);
            if (deleted?.AudioPath is { Length: > 0 } audioPath && File.Exists(audioPath))
            {
                File.Delete(audioPath);
            }
        }
        finally
        {
            gate.Release();
        }
    }

    public async Task ClearHistoryAsync(bool deleteRecordings, CancellationToken cancellationToken = default)
    {
        await gate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            await AtomicWriteAsync(Paths.HistoryFile, string.Empty, cancellationToken).ConfigureAwait(false);
            if (deleteRecordings)
            {
                foreach (var file in Directory.EnumerateFiles(Paths.Recordings, "*.wav", SearchOption.TopDirectoryOnly))
                {
                    File.Delete(file);
                }
            }
        }
        finally
        {
            gate.Release();
        }
    }

    private async Task<T> LoadJsonAsync<T>(string path, Func<T> fallback, CancellationToken cancellationToken)
    {
        await gate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (!File.Exists(path))
            {
                return fallback();
            }

            await using var stream = File.OpenRead(path);
            return await JsonSerializer.DeserializeAsync<T>(stream, JsonOptions, cancellationToken).ConfigureAwait(false)
                ?? throw new InvalidDataException($"The file contains no usable data: {path}");
        }
        finally
        {
            gate.Release();
        }
    }

    private async Task SaveJsonAsync<T>(string path, T value, CancellationToken cancellationToken)
    {
        await gate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            var json = JsonSerializer.Serialize(value, JsonOptions) + Environment.NewLine;
            await AtomicWriteAsync(path, json, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            gate.Release();
        }
    }

    private async Task<HistoryLoadResult> LoadHistoryUnlockedAsync(CancellationToken cancellationToken)
    {
        if (!File.Exists(Paths.HistoryFile))
        {
            return new HistoryLoadResult([], []);
        }

        var lines = await File.ReadAllLinesAsync(Paths.HistoryFile, cancellationToken).ConfigureAwait(false);
        var entries = new List<HistoryEntry>();
        var warnings = new List<string>();
        for (var index = 0; index < lines.Length; index++)
        {
            if (string.IsNullOrWhiteSpace(lines[index]))
            {
                continue;
            }

            try
            {
                var entry = JsonSerializer.Deserialize<HistoryEntry>(lines[index], LineOptions);
                if (entry is null)
                {
                    warnings.Add($"History line {index + 1} is empty or invalid.");
                }
                else
                {
                    entries.Add(entry);
                }
            }
            catch (JsonException error)
            {
                warnings.Add($"History line {index + 1} is invalid: {error.Message}");
            }
        }

        return new HistoryLoadResult(entries.OrderByDescending(entry => entry.CreatedAt).ToArray(), warnings);
    }

    private static async Task AtomicWriteAsync(string path, string contents, CancellationToken cancellationToken)
    {
        var temporaryPath = path + ".tmp";
        try
        {
            await File.WriteAllTextAsync(temporaryPath, contents, Utf8, cancellationToken).ConfigureAwait(false);
            File.Move(temporaryPath, path, true);
        }
        finally
        {
            if (File.Exists(temporaryPath))
            {
                File.Delete(temporaryPath);
            }
        }
    }
}
