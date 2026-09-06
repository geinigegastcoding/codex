using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Windows.Threading;
using Spreek.Core;
using Spreek.Services;

namespace Spreek;

public sealed class AppRuntime : IDisposable
{
    private readonly Dispatcher dispatcher;
    private readonly DiagnosticLog log;
    private bool disposed;

    private AppRuntime(
        Dispatcher dispatcher,
        AppPaths paths,
        LocalStore store,
        SecretStore secrets,
        DeepgramClient deepgram,
        TextInsertionService insertion,
        GlobalHotkeyService hotkeys,
        StartupService startup,
        AppSettings settings,
        IEnumerable<DictionaryEntry> dictionary,
        IEnumerable<SnippetEntry> snippets,
        IEnumerable<HistoryEntry> history)
    {
        this.dispatcher = dispatcher;
        Paths = paths;
        Store = store;
        Secrets = secrets;
        Deepgram = deepgram;
        Insertion = insertion;
        Hotkeys = hotkeys;
        Startup = startup;
        Settings = settings;
        Dictionary = new ObservableCollection<DictionaryEntry>(dictionary);
        Snippets = new ObservableCollection<SnippetEntry>(snippets);
        History = new ObservableCollection<HistoryEntry>(history.OrderByDescending(entry => entry.CreatedAt));
        log = new DiagnosticLog(paths);
        Coordinator = new DictationCoordinator(
            deepgram,
            static () => new AudioRecorder(),
            insertion,
            store,
            LoadApiKeyAsync,
            () => new DictationConfiguration(Settings, Dictionary.ToArray(), Snippets.ToArray(), Paths.Recordings),
            new MarkdownNoteExporter(),
            TimeProvider.System);
        Coordinator.HistoryChanged += OnHistoryChanged;
        Coordinator.SnapshotChanged += (_, snapshot) =>
            Hotkeys.IsDictationActive = snapshot.State is not DictationState.Idle;
        WireHotkeys();
    }

    public event EventHandler? DataChanged;
    public event EventHandler<string>? Notice;

    public AppPaths Paths { get; }
    public LocalStore Store { get; }
    public SecretStore Secrets { get; }
    public DeepgramClient Deepgram { get; }
    public TextInsertionService Insertion { get; }
    public GlobalHotkeyService Hotkeys { get; }
    public StartupService Startup { get; }
    public DictationCoordinator Coordinator { get; }
    public AppSettings Settings { get; }
    public ObservableCollection<DictionaryEntry> Dictionary { get; }
    public ObservableCollection<SnippetEntry> Snippets { get; }
    public ObservableCollection<HistoryEntry> History { get; }
    public IReadOnlyList<MicrophoneDevice> Microphones => AudioRecorder.GetDevices();
    public bool HotkeysAvailable { get; private set; }

    public double TodayDurationSeconds => History
        .Where(entry => entry.CreatedAt.ToLocalTime().Date == DateTime.Today)
        .Sum(entry => entry.DurationSeconds);

    public decimal TodayEstimatedCost
    {
        get
        {
            var rate = Settings.Language == LanguageMode.Multilingual
                ? Settings.MultilingualCostPerMinute
                : Settings.MonolingualCostPerMinute;
            return (decimal)(TodayDurationSeconds / 60d) * rate;
        }
    }

    public static async Task<AppRuntime> CreateAsync(Dispatcher dispatcher)
    {
        var paths = AppPaths.ForCurrentUser();
        var store = new LocalStore(paths);
        var secrets = new SecretStore(paths.Root);
        var settings = await store.LoadSettingsAsync().ConfigureAwait(false);
        if (string.IsNullOrWhiteSpace(settings.QuickNoteFolder))
        {
            var knowledgeInbox = @"E:\MData\Kennis\personal\inbox";
            settings.QuickNoteFolder = Directory.Exists(knowledgeInbox)
                ? knowledgeInbox
                : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Spreek notes");
        }

        var dictionary = await store.LoadDictionaryAsync().ConfigureAwait(false);
        var snippets = await store.LoadSnippetsAsync().ConfigureAwait(false);
        var loadedHistory = await store.LoadHistoryAsync().ConfigureAwait(false);
        var runtime = new AppRuntime(
            dispatcher,
            paths,
            store,
            secrets,
            new DeepgramClient(),
            new TextInsertionService(dispatcher),
            new GlobalHotkeyService(dispatcher),
            new StartupService(),
            settings,
            dictionary,
            snippets,
            loadedHistory.Entries);
        foreach (var warning in loadedHistory.Warnings)
        {
            await runtime.log.WriteAsync("warning", warning).ConfigureAwait(false);
        }

        try
        {
            runtime.Hotkeys.Apply(runtime.Settings);
            runtime.Hotkeys.Start();
            runtime.HotkeysAvailable = true;
        }
        catch (Exception error)
        {
            await runtime.log.WriteAsync("error", error.Message).ConfigureAwait(false);
            runtime.HotkeysAvailable = false;
        }

        return runtime;
    }

    public async Task<bool> HasApiKeyAsync() =>
        !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("DEEPGRAM_API_KEY")) ||
        !string.IsNullOrWhiteSpace(await Secrets.LoadAsync().ConfigureAwait(false));

    public async Task<CredentialCheckResult> TestApiKeyAsync(string? candidate)
    {
        var key = !string.IsNullOrWhiteSpace(candidate)
            ? candidate.Trim()
            : await LoadApiKeyAsync(CancellationToken.None).ConfigureAwait(false);
        if (string.IsNullOrWhiteSpace(key))
        {
            return new CredentialCheckResult(false, "Enter a Deepgram API key first.");
        }

        return await Deepgram.TestCredentialAsync(key, CreateOptions(), CancellationToken.None).ConfigureAwait(false);
    }

    public async Task SaveSettingsAsync(string? newApiKey)
    {
        ValidateSettings();
        if (!string.IsNullOrWhiteSpace(newApiKey))
        {
            await Secrets.SaveAsync(newApiKey).ConfigureAwait(false);
        }

        Hotkeys.Apply(Settings);
        var executable = Environment.ProcessPath ?? throw new InvalidOperationException("Windows did not provide the Spreek executable path.");
        Startup.SetEnabled(Settings.StartWithWindows, executable);
        await Store.SaveSettingsAsync(Settings).ConfigureAwait(false);
        DataChanged?.Invoke(this, EventArgs.Empty);
    }

    public async Task AddOrUpdateDictionaryAsync(Guid? id, string term, string? heardAs, bool starred)
    {
        term = term.Trim();
        heardAs = string.IsNullOrWhiteSpace(heardAs) ? null : heardAs.Trim();
        if (term.Length is < 1 or > 60 || heardAs?.Length > 60)
        {
            throw new InvalidDataException("Dictionary terms and heard-as phrases must be 1-60 characters.");
        }

        if (Dictionary.Any(entry => entry.Id != id && entry.Term.Equals(term, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidDataException($"'{term}' is already in the dictionary.");
        }

        if (Snippets.Any(entry => entry.Name.Equals(term, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidDataException($"'{term}' conflicts with a snippet trigger.");
        }

        var now = DateTimeOffset.UtcNow;
        var existing = id.HasValue ? Dictionary.FirstOrDefault(entry => entry.Id == id) : null;
        var updated = existing is null
            ? new DictionaryEntry(Guid.NewGuid(), term, heardAs, starred, now, now)
            : existing with { Term = term, HeardAs = heardAs, Starred = starred, UpdatedAt = now };
        if (existing is null)
        {
            Dictionary.Insert(0, updated);
        }
        else
        {
            Dictionary[Dictionary.IndexOf(existing)] = updated;
        }

        await Store.SaveDictionaryAsync(Dictionary.ToArray()).ConfigureAwait(false);
        DataChanged?.Invoke(this, EventArgs.Empty);
    }

    public async Task DeleteDictionaryAsync(DictionaryEntry entry)
    {
        Dictionary.Remove(entry);
        await Store.SaveDictionaryAsync(Dictionary.ToArray()).ConfigureAwait(false);
        DataChanged?.Invoke(this, EventArgs.Empty);
    }

    public async Task AddOrUpdateSnippetAsync(Guid? id, string name, string text)
    {
        name = name.Trim();
        text = text.Trim();
        if (name.Length is < 1 or > 60 || text.Length is < 1 or > 4000)
        {
            throw new InvalidDataException("Snippet triggers must be 1-60 characters and content 1-4,000 characters.");
        }

        if (Snippets.Any(entry => entry.Id != id && entry.Name.Equals(name, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidDataException($"'{name}' is already a snippet trigger.");
        }

        if (Dictionary.Any(entry => entry.Term.Equals(name, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidDataException($"'{name}' conflicts with a dictionary term.");
        }

        var now = DateTimeOffset.UtcNow;
        var existing = id.HasValue ? Snippets.FirstOrDefault(entry => entry.Id == id) : null;
        var updated = existing is null
            ? new SnippetEntry(Guid.NewGuid(), name, text, now, now)
            : existing with { Name = name, Text = text, UpdatedAt = now };
        if (existing is null)
        {
            Snippets.Insert(0, updated);
        }
        else
        {
            Snippets[Snippets.IndexOf(existing)] = updated;
        }

        await Store.SaveSnippetsAsync(Snippets.ToArray()).ConfigureAwait(false);
        DataChanged?.Invoke(this, EventArgs.Empty);
    }

    public async Task DeleteSnippetAsync(SnippetEntry entry)
    {
        Snippets.Remove(entry);
        await Store.SaveSnippetsAsync(Snippets.ToArray()).ConfigureAwait(false);
        DataChanged?.Invoke(this, EventArgs.Empty);
    }

    public async Task<ImportResult<DictionaryEntry>> ImportDictionaryAsync(string path)
    {
        var contents = await File.ReadAllTextAsync(path).ConfigureAwait(false);
        var result = LibraryImporter.ImportDictionary(contents, Dictionary, Snippets, DateTimeOffset.UtcNow);
        foreach (var entry in result.Items)
        {
            Dictionary.Add(entry);
        }

        if (result.Items.Count > 0)
        {
            await Store.SaveDictionaryAsync(Dictionary.ToArray()).ConfigureAwait(false);
            DataChanged?.Invoke(this, EventArgs.Empty);
        }

        return result;
    }

    public async Task<ImportResult<SnippetEntry>> ImportSnippetsAsync(string path)
    {
        var contents = await File.ReadAllTextAsync(path).ConfigureAwait(false);
        var result = LibraryImporter.ImportSnippets(contents, Snippets, Dictionary, DateTimeOffset.UtcNow);
        foreach (var entry in result.Items)
        {
            Snippets.Add(entry);
        }

        if (result.Items.Count > 0)
        {
            await Store.SaveSnippetsAsync(Snippets.ToArray()).ConfigureAwait(false);
            DataChanged?.Invoke(this, EventArgs.Empty);
        }

        return result;
    }

    public async Task ExportDictionaryAsync(string path)
    {
        var builder = new StringBuilder("heard_as,term" + Environment.NewLine);
        foreach (var entry in Dictionary)
        {
            builder.Append(EscapeCsv(entry.HeardAs ?? string.Empty));
            builder.Append(',');
            builder.AppendLine(EscapeCsv(entry.Term));
        }

        await File.WriteAllTextAsync(path, builder.ToString(), new UTF8Encoding(false)).ConfigureAwait(false);
    }

    public Task ExportSnippetsAsync(string path) => File.WriteAllTextAsync(
        path,
        JsonSerializer.Serialize(Snippets.Select(entry => new { name = entry.Name, text = entry.Text }), new JsonSerializerOptions { WriteIndented = true }) + Environment.NewLine,
        new UTF8Encoding(false));

    public async Task UpdateHistoryTextAsync(HistoryEntry entry, string text)
    {
        var updated = entry with { Text = text.Trim() };
        await Store.UpdateHistoryAsync(updated).ConfigureAwait(false);
        ReplaceHistory(updated);
    }

    public Task CopyLastAsync()
    {
        var latest = History
            .Where(entry => !string.IsNullOrWhiteSpace(entry.Text))
            .OrderByDescending(entry => entry.CreatedAt)
            .FirstOrDefault()
            ?? throw new InvalidOperationException("There is no completed transcript to copy yet.");
        return Insertion.CopyAsync(latest.Text, CancellationToken.None);
    }

    public async Task DeleteHistoryAsync(HistoryEntry entry)
    {
        await Store.DeleteHistoryAsync(entry.Id).ConfigureAwait(false);
        History.Remove(entry);
        DataChanged?.Invoke(this, EventArgs.Empty);
    }

    public async Task ClearHistoryAsync()
    {
        await Store.ClearHistoryAsync(deleteRecordings: true).ConfigureAwait(false);
        History.Clear();
        DataChanged?.Invoke(this, EventArgs.Empty);
    }

    public async Task ExportHistoryAsync(string path)
    {
        var builder = new StringBuilder("# Spreek transcript export" + Environment.NewLine + Environment.NewLine);
        foreach (var entry in History.OrderByDescending(item => item.CreatedAt))
        {
            builder.AppendLine($"## {entry.CreatedAt.ToLocalTime():yyyy-MM-dd HH:mm}");
            builder.AppendLine();
            builder.AppendLine(entry.Text);
            builder.AppendLine();
            builder.AppendLine($"_Duration {entry.DurationSeconds:F1}s · {entry.Language} · {entry.Status}_");
            builder.AppendLine();
        }

        await File.WriteAllTextAsync(path, builder.ToString(), new UTF8Encoding(false)).ConfigureAwait(false);
    }

    public async Task RunUserOperationAsync(Func<Task> operation)
    {
        try
        {
            await operation().ConfigureAwait(false);
        }
        catch (Exception error)
        {
            await log.WriteAsync("error", error.ToString()).ConfigureAwait(false);
            RaiseNotice(error.Message);
        }
    }

    public void Dispose()
    {
        if (disposed)
        {
            return;
        }

        disposed = true;
        Coordinator.HistoryChanged -= OnHistoryChanged;
        Hotkeys.Dispose();
        Deepgram.Dispose();
    }

    private Task<string?> LoadApiKeyAsync(CancellationToken cancellationToken)
    {
        var environmentKey = Environment.GetEnvironmentVariable("DEEPGRAM_API_KEY");
        return !string.IsNullOrWhiteSpace(environmentKey)
            ? Task.FromResult<string?>(environmentKey.Trim())
            : Secrets.LoadAsync(cancellationToken);
    }

    private DeepgramOptions CreateOptions() => new(
        Settings.RegionHost,
        Settings.Language,
        Settings.EndpointingMs,
        Settings.PrivacyOptOut);

    private void ValidateSettings()
    {
        if (Settings.RegionHost is not ("api.deepgram.com" or "api.eu.deepgram.com"))
        {
            throw new InvalidDataException("Choose the Global or EU Deepgram endpoint.");
        }

        if (Settings.EndpointingMs is < 50 or > 5000)
        {
            throw new InvalidDataException("Endpointing must be between 50 and 5,000 ms.");
        }

        var shortcuts = new Dictionary<string, HotkeyChord>
        {
            ["Push to talk"] = HotkeyChord.Parse(Settings.PushToTalkShortcut),
            ["Hands free"] = HotkeyChord.Parse(Settings.HandsFreeShortcut),
            ["Paste last"] = HotkeyChord.Parse(Settings.PasteLastShortcut),
            ["Quick note"] = HotkeyChord.Parse(Settings.QuickNoteShortcut),
        };
        HotkeyChord.EnsureUnique(shortcuts);
        if (string.IsNullOrWhiteSpace(Settings.QuickNoteFolder))
        {
            throw new InvalidDataException("Choose a folder for Quick Notes.");
        }
    }

    private void WireHotkeys()
    {
        Hotkeys.PushToTalkPressed += (_, _) => FireAndForget(() => Coordinator.StartPushToTalkAsync());
        Hotkeys.PushToTalkReleased += (_, _) => FireAndForget(() => Coordinator.StopPushToTalkAsync());
        Hotkeys.HandsFreePressed += (_, _) => FireAndForget(() => Coordinator.ToggleHandsFreeAsync());
        Hotkeys.PasteLastPressed += (_, _) => FireAndForget(() => Coordinator.PasteLastAsync());
        Hotkeys.QuickNotePressed += (_, _) => FireAndForget(() => Coordinator.QuickNoteAsync());
        Hotkeys.CancelPressed += (_, _) => FireAndForget(() => Coordinator.CancelAsync());
    }

    private void FireAndForget(Func<Task> operation) => _ = RunUserOperationAsync(operation);

    private void OnHistoryChanged(object? sender, HistoryEntry entry) =>
        _ = dispatcher.InvokeAsync(() => ReplaceHistory(entry));

    private void ReplaceHistory(HistoryEntry entry)
    {
        var existing = History.FirstOrDefault(item => item.Id == entry.Id);
        if (existing is null)
        {
            History.Insert(0, entry);
        }
        else
        {
            History[History.IndexOf(existing)] = entry;
        }

        DataChanged?.Invoke(this, EventArgs.Empty);
    }

    private void RaiseNotice(string message) =>
        _ = dispatcher.InvokeAsync(() => Notice?.Invoke(this, message));

    private static string EscapeCsv(string value) =>
        value.IndexOfAny([',', '"', '\r', '\n']) >= 0
            ? $"\"{value.Replace("\"", "\"\"", StringComparison.Ordinal)}\""
            : value;
}
