using Spreek.Core;
using Spreek.Services;

namespace Spreek.Tests;

[TestClass]
public sealed class StorageAndSecurityTests
{
    [TestMethod]
    public async Task Settings_and_libraries_round_trip_atomically()
    {
        using var area = new TemporaryArea();
        var paths = new AppPaths(area.Path);
        var store = new LocalStore(paths);
        var settings = new AppSettings
        {
            Language = LanguageMode.Dutch,
            MicrophoneDeviceNumber = 2,
            QuickNoteFolder = @"E:\MData\Kennis\personal\inbox",
        };
        var term = new DictionaryEntry(Guid.NewGuid(), "MagisData", "magic data", true, DateTimeOffset.UtcNow, DateTimeOffset.UtcNow);
        var snippet = new SnippetEntry(Guid.NewGuid(), "my link", "https://example.test", DateTimeOffset.UtcNow, DateTimeOffset.UtcNow);

        await store.SaveSettingsAsync(settings);
        await store.SaveDictionaryAsync([term]);
        await store.SaveSnippetsAsync([snippet]);

        var loadedSettings = await store.LoadSettingsAsync();
        var loadedDictionary = await store.LoadDictionaryAsync();
        var loadedSnippets = await store.LoadSnippetsAsync();
        Assert.AreEqual(LanguageMode.Dutch, loadedSettings.Language);
        Assert.AreEqual(2, loadedSettings.MicrophoneDeviceNumber);
        Assert.AreEqual(term, loadedDictionary.Single());
        Assert.AreEqual(snippet, loadedSnippets.Single());
        Assert.IsFalse(File.Exists(paths.SettingsFile + ".tmp"));
    }

    [TestMethod]
    public async Task History_append_edit_and_restart_preserve_records()
    {
        using var area = new TemporaryArea();
        var store = new LocalStore(new AppPaths(area.Path));
        var first = Entry("first");
        var second = Entry("second");
        await store.AppendHistoryAsync(first);
        await store.AppendHistoryAsync(second);

        await store.SaveHistoryAsync([first with { Text = "edited" }, second]);
        var restarted = new LocalStore(new AppPaths(area.Path));
        var result = await restarted.LoadHistoryAsync();

        Assert.AreEqual(2, result.Entries.Count);
        Assert.AreEqual("edited", result.Entries.Single(entry => entry.Id == first.Id).Text);
        Assert.AreEqual(0, result.Warnings.Count);
    }

    [TestMethod]
    public async Task Corrupt_history_line_is_reported_without_hiding_valid_rows()
    {
        using var area = new TemporaryArea();
        var paths = new AppPaths(area.Path);
        var store = new LocalStore(paths);
        await store.AppendHistoryAsync(Entry("safe"));
        await File.AppendAllTextAsync(paths.HistoryFile, "{not json}\n");

        var result = await store.LoadHistoryAsync();

        Assert.AreEqual(1, result.Entries.Count);
        Assert.AreEqual("safe", result.Entries[0].Text);
        Assert.AreEqual(1, result.Warnings.Count);
        StringAssert.Contains(result.Warnings[0], "line 2");
    }

    [TestMethod]
    public async Task Secret_store_round_trips_without_plaintext_on_disk()
    {
        using var area = new TemporaryArea();
        var sut = new SecretStore(area.Path);

        await sut.SaveAsync("dg-secret-value");

        Assert.AreEqual("dg-secret-value", await sut.LoadAsync());
        Assert.IsFalse((await File.ReadAllTextAsync(sut.FilePath)).Contains("dg-secret-value", StringComparison.Ordinal));
    }

    [TestMethod]
    public async Task Diagnostic_log_redacts_credentials()
    {
        using var area = new TemporaryArea();
        var paths = new AppPaths(area.Path);
        var log = new DiagnosticLog(paths);

        await log.WriteAsync("error", "Authorization: Token secret123 api_key=another password: third");
        var text = await File.ReadAllTextAsync(paths.LogFile);

        Assert.IsFalse(text.Contains("secret123", StringComparison.Ordinal));
        Assert.IsFalse(text.Contains("another", StringComparison.Ordinal));
        Assert.IsFalse(text.Contains("third", StringComparison.Ordinal));
        StringAssert.Contains(text, "[redacted]");
    }

    private static HistoryEntry Entry(string text) => new(
        Guid.NewGuid(), DateTimeOffset.UtcNow, text, text, 1.2, 0.9, "en", "Notepad",
        TranscriptStatus.Completed, null, "request", false);

    private sealed class TemporaryArea : IDisposable
    {
        public TemporaryArea()
        {
            Path = System.IO.Path.Combine(System.IO.Path.GetTempPath(), "Spreek.Tests", Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(Path);
        }

        public string Path { get; }

        public void Dispose()
        {
            if (Directory.Exists(Path))
            {
                Directory.Delete(Path, true);
            }
        }
    }
}
