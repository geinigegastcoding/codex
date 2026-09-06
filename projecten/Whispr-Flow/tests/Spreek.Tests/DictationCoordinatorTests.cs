using Spreek.Core;
using Spreek.Services;
using System.Security;

namespace Spreek.Tests;

[TestClass]
public sealed class DictationCoordinatorTests
{
    [TestMethod]
    public async Task Completed_dictation_is_saved_before_text_is_inserted()
    {
        using var area = new TemporaryArea();
        var calls = new List<string>();
        var audio = new FakeAudioRecorder(calls);
        var live = new FakeLiveSession(calls)
        {
            Result = new LiveTranscriptResult("Hello MagisData.", 0.94, "request-1", "en"),
        };
        var deepgram = new FakeDeepgramService(calls, live);
        var history = new FakeHistoryStore(calls);
        var insertion = new FakeInsertionService(calls);
        var configuration = new DictationConfiguration(
            new AppSettings(),
            [],
            [],
            area.Path);
        var sut = new DictationCoordinator(
            deepgram,
            () => audio,
            insertion,
            history,
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            new FakeNoteExporter(),
            TimeProvider.System);

        await sut.StartPushToTalkAsync();
        await sut.StopPushToTalkAsync();

        CollectionAssert.AreEqual(
            new[] { "deepgram.start", "audio.start", "audio.stop", "deepgram.complete", "history.append", "insertion.insert" },
            calls);
        Assert.AreEqual("Hello MagisData.", history.Entries.Single().Text);
    }

    [TestMethod]
    public async Task Transcription_failure_preserves_audio_as_a_retryable_history_entry()
    {
        using var area = new TemporaryArea();
        var calls = new List<string>();
        var audio = new FakeAudioRecorder(calls);
        var live = new FakeLiveSession(calls) { CompletionError = new IOException("connection lost") };
        var history = new FakeHistoryStore(calls);
        var insertion = new FakeInsertionService(calls);
        var configuration = new DictationConfiguration(new AppSettings(), [], [], area.Path);
        var sut = new DictationCoordinator(
            new FakeDeepgramService(calls, live),
            () => audio,
            insertion,
            history,
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            new FakeNoteExporter(),
            TimeProvider.System);
        DictationSnapshot? lastSnapshot = null;
        sut.SnapshotChanged += (_, snapshot) => lastSnapshot = snapshot;

        await sut.StartPushToTalkAsync();
        var recoveryPath = audio.FilePath;
        await sut.StopPushToTalkAsync();

        var entry = history.Entries.Single();
        Assert.AreEqual(TranscriptStatus.NeedsRetry, entry.Status);
        Assert.AreEqual(recoveryPath, entry.AudioPath);
        Assert.IsTrue(File.Exists(recoveryPath));
        Assert.AreEqual(DictationState.RecoverableError, lastSnapshot?.State);
        CollectionAssert.DoesNotContain(calls, "insertion.insert");
    }

    [TestMethod]
    public async Task Cancel_aborts_the_stream_and_deletes_only_the_current_recording()
    {
        using var area = new TemporaryArea();
        var unrelatedPath = Path.Combine(area.Path, "keep.wav");
        await File.WriteAllBytesAsync(unrelatedPath, new byte[100]);
        var calls = new List<string>();
        var audio = new FakeAudioRecorder(calls);
        var live = new FakeLiveSession(calls);
        var history = new FakeHistoryStore(calls);
        var configuration = new DictationConfiguration(new AppSettings(), [], [], area.Path);
        var sut = new DictationCoordinator(
            new FakeDeepgramService(calls, live),
            () => audio,
            new FakeInsertionService(calls),
            history,
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            new FakeNoteExporter(),
            TimeProvider.System);
        DictationSnapshot? lastSnapshot = null;
        sut.SnapshotChanged += (_, snapshot) => lastSnapshot = snapshot;

        await sut.StartPushToTalkAsync();
        var currentPath = audio.FilePath;
        await sut.CancelAsync();

        Assert.IsFalse(File.Exists(currentPath));
        Assert.IsTrue(File.Exists(unrelatedPath));
        Assert.IsTrue(live.AbortCalled);
        Assert.AreEqual(0, history.Entries.Count);
        Assert.AreEqual(DictationState.Idle, lastSnapshot?.State);
    }

    [TestMethod]
    public async Task Retry_updates_the_same_history_row_and_removes_recovery_audio_on_success()
    {
        using var area = new TemporaryArea();
        var recoveryPath = Path.Combine(area.Path, "retry.wav");
        await File.WriteAllBytesAsync(recoveryPath, new byte[100]);
        var calls = new List<string>();
        var live = new FakeLiveSession(calls);
        var deepgram = new FakeDeepgramService(calls, live)
        {
            FileResult = new LiveTranscriptResult("Recovered words.", 0.91, "request-retry", "en"),
        };
        var history = new FakeHistoryStore(calls);
        var original = new HistoryEntry(
            Guid.NewGuid(), DateTimeOffset.UtcNow, string.Empty, string.Empty, 2.5, 0, "en", "Notepad",
            TranscriptStatus.NeedsRetry, recoveryPath, null, false);
        history.Entries.Add(original);
        var insertion = new FakeInsertionService(calls);
        var configuration = new DictationConfiguration(new AppSettings(), [], [], area.Path);
        var sut = new DictationCoordinator(
            deepgram,
            () => new FakeAudioRecorder(calls),
            insertion,
            history,
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            new FakeNoteExporter(),
            TimeProvider.System);

        await sut.RetryAsync(original.Id);

        var updated = history.Entries.Single();
        Assert.AreEqual(original.Id, updated.Id);
        Assert.AreEqual("Recovered words.", updated.Text);
        Assert.AreEqual(TranscriptStatus.Completed, updated.Status);
        Assert.IsNull(updated.AudioPath);
        Assert.IsFalse(File.Exists(recoveryPath));
        CollectionAssert.Contains(calls, "history.update");
        CollectionAssert.Contains(calls, "insertion.copy");
        CollectionAssert.DoesNotContain(calls, "insertion.insert");
    }

    [TestMethod]
    public async Task Storage_failure_copies_final_text_without_inserting_and_keeps_audio()
    {
        using var area = new TemporaryArea();
        var calls = new List<string>();
        var audio = new FakeAudioRecorder(calls);
        var live = new FakeLiveSession(calls)
        {
            Result = new LiveTranscriptResult("Do not lose this.", 0.93, "request-storage", "en"),
        };
        var history = new FakeHistoryStore(calls)
        {
            AppendError = new IOException("history.test.jsonl is read-only"),
        };
        var insertion = new FakeInsertionService(calls);
        var configuration = new DictationConfiguration(new AppSettings(), [], [], area.Path);
        var sut = new DictationCoordinator(
            new FakeDeepgramService(calls, live),
            () => audio,
            insertion,
            history,
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            new FakeNoteExporter(),
            TimeProvider.System);
        DictationSnapshot? lastSnapshot = null;
        sut.SnapshotChanged += (_, snapshot) => lastSnapshot = snapshot;

        await sut.StartPushToTalkAsync();
        var recoveryPath = audio.FilePath;
        await sut.StopPushToTalkAsync();

        Assert.AreEqual("Do not lose this.", insertion.CopiedTexts.Single());
        Assert.AreEqual(0, insertion.InsertedTexts.Count);
        Assert.IsTrue(File.Exists(recoveryPath));
        Assert.AreEqual(DictationState.RecoverableError, lastSnapshot?.State);
        StringAssert.Contains(lastSnapshot?.Message, "history.test.jsonl");
    }

    [TestMethod]
    public async Task Paste_last_uses_the_newest_non_empty_transcript()
    {
        using var area = new TemporaryArea();
        var calls = new List<string>();
        var history = new FakeHistoryStore(calls);
        var now = DateTimeOffset.UtcNow;
        history.Entries.Add(new HistoryEntry(
            Guid.NewGuid(), now.AddMinutes(-5), "older", "older", 1, 0.9, "en", "Notepad",
            TranscriptStatus.Completed, null, null, false));
        history.Entries.Add(new HistoryEntry(
            Guid.NewGuid(), now.AddMinutes(-1), "latest usable", "latest usable", 1, 0.9, "en", "Notepad",
            TranscriptStatus.Completed, null, null, false));
        history.Entries.Add(new HistoryEntry(
            Guid.NewGuid(), now, string.Empty, string.Empty, 1, 0, "en", "Notepad",
            TranscriptStatus.NeedsRetry, "missing.wav", null, false));
        var insertion = new FakeInsertionService(calls);
        var configuration = new DictationConfiguration(new AppSettings(), [], [], area.Path);
        var sut = new DictationCoordinator(
            new FakeDeepgramService(calls, new FakeLiveSession(calls)),
            () => new FakeAudioRecorder(calls),
            insertion,
            history,
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            new FakeNoteExporter(),
            TimeProvider.System);

        await sut.PasteLastAsync();

        Assert.AreEqual("latest usable", insertion.InsertedTexts.Single());
    }

    [TestMethod]
    public async Task Quick_note_saves_history_and_exports_markdown_without_inserting()
    {
        using var area = new TemporaryArea();
        var calls = new List<string>();
        var history = new FakeHistoryStore(calls);
        var insertion = new FakeInsertionService(calls);
        var notes = new FakeNoteExporter();
        var settings = new AppSettings { QuickNoteFolder = Path.Combine(area.Path, "inbox") };
        var configuration = new DictationConfiguration(settings, [], [], area.Path);
        var sut = new DictationCoordinator(
            new FakeDeepgramService(calls, new FakeLiveSession(calls)
            {
                Result = new LiveTranscriptResult("A useful voice note.", 0.95, "note-request", "en"),
            }),
            () => new FakeAudioRecorder(calls),
            insertion,
            history,
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            notes,
            TimeProvider.System);

        await sut.QuickNoteAsync();
        await sut.ToggleHandsFreeAsync();

        var entry = history.Entries.Single();
        Assert.IsTrue(entry.IsQuickNote);
        Assert.AreEqual(entry.Id, notes.Exported.Single().Transcript.Id);
        Assert.AreEqual(settings.QuickNoteFolder, notes.Exported.Single().Folder);
        Assert.AreEqual(0, insertion.InsertedTexts.Count);
    }

    [TestMethod]
    public async Task Insertion_failure_keeps_one_saved_transcript_and_marks_it_copied()
    {
        using var area = new TemporaryArea();
        var calls = new List<string>();
        var history = new FakeHistoryStore(calls);
        var insertion = new FakeInsertionService(calls)
        {
            InsertError = new IOException("target disappeared"),
        };
        var configuration = new DictationConfiguration(new AppSettings(), [], [], area.Path);
        var sut = new DictationCoordinator(
            new FakeDeepgramService(calls, new FakeLiveSession(calls)
            {
                Result = new LiveTranscriptResult("Still safe.", 0.92, "insert-request", "en"),
            }),
            () => new FakeAudioRecorder(calls),
            insertion,
            history,
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            new FakeNoteExporter(),
            TimeProvider.System);

        await sut.StartPushToTalkAsync();
        await sut.StopPushToTalkAsync();

        var entry = history.Entries.Single();
        Assert.AreEqual(TranscriptStatus.Copied, entry.Status);
        Assert.AreEqual("Still safe.", insertion.CopiedTexts.Single());
        Assert.AreEqual(1, calls.Count(call => call == "history.append"));
        Assert.AreEqual(1, calls.Count(call => call == "history.update"));
    }

    [TestMethod]
    public async Task Starting_twice_is_rejected_without_opening_a_second_stream()
    {
        using var area = new TemporaryArea();
        var calls = new List<string>();
        var configuration = new DictationConfiguration(new AppSettings(), [], [], area.Path);
        var sut = new DictationCoordinator(
            new FakeDeepgramService(calls, new FakeLiveSession(calls)),
            () => new FakeAudioRecorder(calls),
            new FakeInsertionService(calls),
            new FakeHistoryStore(calls),
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            new FakeNoteExporter(),
            TimeProvider.System);

        await sut.StartPushToTalkAsync();
        var error = await Assert.ThrowsExceptionAsync<InvalidOperationException>(sut.StartPushToTalkAsync);

        StringAssert.Contains(error.Message, "already active");
        Assert.AreEqual(1, calls.Count(call => call == "deepgram.start"));
        await sut.CancelAsync();
    }

    [TestMethod]
    public async Task Password_target_is_rejected_before_opening_microphone_or_network()
    {
        using var area = new TemporaryArea();
        var calls = new List<string>();
        var insertion = new FakeInsertionService(calls)
        {
            Target = new TargetWindow(42, "PasswordManager", "Edit", TargetSecurity.Password),
        };
        var configuration = new DictationConfiguration(new AppSettings(), [], [], area.Path);
        var sut = new DictationCoordinator(
            new FakeDeepgramService(calls, new FakeLiveSession(calls)),
            () => new FakeAudioRecorder(calls),
            insertion,
            new FakeHistoryStore(calls),
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            new FakeNoteExporter(),
            TimeProvider.System);

        await Assert.ThrowsExceptionAsync<SecurityException>(sut.StartPushToTalkAsync);

        CollectionAssert.DoesNotContain(calls, "deepgram.start");
        CollectionAssert.DoesNotContain(calls, "audio.start");
    }

    [TestMethod]
    public async Task Retrying_a_quick_note_exports_it_instead_of_pasting_or_copying()
    {
        using var area = new TemporaryArea();
        var recoveryPath = Path.Combine(area.Path, "quick-retry.wav");
        await File.WriteAllBytesAsync(recoveryPath, new byte[100]);
        var calls = new List<string>();
        var history = new FakeHistoryStore(calls);
        var original = new HistoryEntry(
            Guid.NewGuid(), DateTimeOffset.UtcNow, string.Empty, string.Empty, 2, 0, "en", "Quick Note",
            TranscriptStatus.NeedsRetry, recoveryPath, null, true);
        history.Entries.Add(original);
        var insertion = new FakeInsertionService(calls);
        var notes = new FakeNoteExporter();
        var settings = new AppSettings { QuickNoteFolder = Path.Combine(area.Path, "inbox") };
        var configuration = new DictationConfiguration(settings, [], [], area.Path);
        var deepgram = new FakeDeepgramService(calls, new FakeLiveSession(calls))
        {
            FileResult = new LiveTranscriptResult("Recovered note.", 0.9, "quick-retry", "en"),
        };
        var sut = new DictationCoordinator(
            deepgram,
            () => new FakeAudioRecorder(calls),
            insertion,
            history,
            _ => Task.FromResult<string?>("test-key"),
            () => configuration,
            notes,
            TimeProvider.System);

        await sut.RetryAsync(original.Id);

        Assert.AreEqual(original.Id, notes.Exported.Single().Transcript.Id);
        Assert.AreEqual(0, insertion.CopiedTexts.Count);
        Assert.AreEqual(0, insertion.InsertedTexts.Count);
    }

    private sealed class FakeDeepgramService(List<string> calls, FakeLiveSession live) : IDeepgramService
    {
        public LiveTranscriptResult FileResult { get; init; } = new("file text", 0.9, "file-request", "en");

        public Task<ILiveTranscriptionSession> StartLiveAsync(
            string apiKey,
            DeepgramOptions options,
            IReadOnlyList<DictionaryEntry> dictionary,
            CancellationToken cancellationToken)
        {
            calls.Add("deepgram.start");
            return Task.FromResult<ILiveTranscriptionSession>(live);
        }

        public Task<LiveTranscriptResult> TranscribeFileAsync(
            string apiKey,
            string wavPath,
            DeepgramOptions options,
            IReadOnlyList<DictionaryEntry> dictionary,
            CancellationToken cancellationToken)
        {
            calls.Add("deepgram.file");
            return Task.FromResult(FileResult);
        }

        public Task<CredentialCheckResult> TestCredentialAsync(
            string apiKey,
            DeepgramOptions options,
            CancellationToken cancellationToken) => throw new NotSupportedException();
    }

    private sealed class FakeLiveSession(List<string> calls) : ILiveTranscriptionSession
    {
        public event EventHandler<string>? InterimChanged { add { } remove { } }
        public event EventHandler<TranscriptSegment>? FinalSegment { add { } remove { } }
        public event EventHandler<string>? Failed { add { } remove { } }

        public int OmittedKeyterms => 0;
        public string? RequestId => Result.RequestId;
        public LiveTranscriptResult Result { get; init; } = new("text", 0.9, "request", "en");
        public Exception? CompletionError { get; init; }
        public bool AbortCalled { get; private set; }

        public void QueueAudio(byte[] pcm)
        {
        }

        public Task<LiveTranscriptResult> CompleteAsync(CancellationToken cancellationToken)
        {
            calls.Add("deepgram.complete");
            return CompletionError is null
                ? Task.FromResult(Result)
                : Task.FromException<LiveTranscriptResult>(CompletionError);
        }

        public Task AbortAsync()
        {
            AbortCalled = true;
            return Task.CompletedTask;
        }
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;
    }

    private sealed class FakeAudioRecorder(List<string> calls) : IAudioRecorder
    {
        public event EventHandler<byte[]>? AudioAvailable { add { } remove { } }
        public event EventHandler<double>? LevelChanged { add { } remove { } }
        public event EventHandler<string>? Failed { add { } remove { } }

        public double DurationSeconds => 1.25;
        public string? FilePath { get; private set; }

        public Task StartAsync(string path, int deviceNumber, CancellationToken cancellationToken)
        {
            calls.Add("audio.start");
            FilePath = path;
            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            File.WriteAllBytes(path, new byte[100]);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            calls.Add("audio.stop");
            return Task.CompletedTask;
        }

        public Task CancelAsync()
        {
            if (FilePath is not null && File.Exists(FilePath))
            {
                File.Delete(FilePath);
            }

            return Task.CompletedTask;
        }

        public void Dispose()
        {
        }
    }

    private sealed class FakeHistoryStore(List<string> calls) : IHistoryStore
    {
        public List<HistoryEntry> Entries { get; } = [];
        public Exception? AppendError { get; init; }

        public Task AppendHistoryAsync(HistoryEntry entry, CancellationToken cancellationToken = default)
        {
            calls.Add("history.append");
            if (AppendError is not null)
            {
                return Task.FromException(AppendError);
            }

            Entries.Add(entry);
            return Task.CompletedTask;
        }

        public Task<HistoryLoadResult> LoadHistoryAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult(new HistoryLoadResult(Entries, []));

        public Task UpdateHistoryAsync(HistoryEntry entry, CancellationToken cancellationToken = default)
        {
            var index = Entries.FindIndex(item => item.Id == entry.Id);
            Entries[index] = entry;
            calls.Add("history.update");
            return Task.CompletedTask;
        }
    }

    private sealed class FakeInsertionService(List<string> calls) : ITextInsertionService
    {
        public List<string> CopiedTexts { get; } = [];
        public List<string> InsertedTexts { get; } = [];
        public Exception? InsertError { get; init; }
        public TargetWindow Target { get; init; } = new(42, "Notepad", "Notepad", TargetSecurity.Normal);

        public TargetWindow CaptureTarget() => Target;

        public Task CopyAsync(string text, CancellationToken cancellationToken)
        {
            calls.Add("insertion.copy");
            CopiedTexts.Add(text);
            return Task.CompletedTask;
        }

        public Task InsertAsync(
            TargetWindow target,
            string text,
            InsertionMode mode,
            bool pressEnter,
            CancellationToken cancellationToken)
        {
            calls.Add("insertion.insert");
            InsertedTexts.Add(text);
            return InsertError is null ? Task.CompletedTask : Task.FromException(InsertError);
        }
    }

    private sealed class FakeNoteExporter : INoteExporter
    {
        public List<(HistoryEntry Transcript, string Folder)> Exported { get; } = [];

        public Task<string> ExportAsync(HistoryEntry transcript, string folder, CancellationToken cancellationToken = default)
        {
            Exported.Add((transcript, folder));
            return Task.FromResult(Path.Combine(folder, "note.md"));
        }
    }

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
