using System.IO;
using System.Security;
using Spreek.Core;

namespace Spreek.Services;

public sealed record DictationConfiguration(
    AppSettings Settings,
    IReadOnlyList<DictionaryEntry> Dictionary,
    IReadOnlyList<SnippetEntry> Snippets,
    string RecordingsDirectory);

public sealed class DictationCoordinator
{
    private readonly IDeepgramService deepgram;
    private readonly Func<IAudioRecorder> audioRecorderFactory;
    private readonly ITextInsertionService insertion;
    private readonly IHistoryStore history;
    private readonly Func<CancellationToken, Task<string?>> apiKeyProvider;
    private readonly Func<DictationConfiguration> configurationProvider;
    private readonly INoteExporter noteExporter;
    private readonly TimeProvider timeProvider;
    private readonly SemaphoreSlim operationGate = new(1, 1);
    private readonly DictationStateMachine stateMachine = new();
    private IAudioRecorder? audio;
    private ILiveTranscriptionSession? live;
    private TargetWindow? target;
    private DictationConfiguration? activeConfiguration;
    private DateTimeOffset startedAt;
    private Guid? lastRetryableId;
    private bool handsFree;
    private bool quickNote;

    public DictationCoordinator(
        IDeepgramService deepgram,
        Func<IAudioRecorder> audioRecorderFactory,
        ITextInsertionService insertion,
        IHistoryStore history,
        Func<CancellationToken, Task<string?>> apiKeyProvider,
        Func<DictationConfiguration> configurationProvider,
        INoteExporter noteExporter,
        TimeProvider timeProvider)
    {
        this.deepgram = deepgram;
        this.audioRecorderFactory = audioRecorderFactory;
        this.insertion = insertion;
        this.history = history;
        this.apiKeyProvider = apiKeyProvider;
        this.configurationProvider = configurationProvider;
        this.noteExporter = noteExporter;
        this.timeProvider = timeProvider;
    }

    public event EventHandler<DictationSnapshot>? SnapshotChanged;
    public event EventHandler<HistoryEntry>? HistoryChanged;

    public DictationState CurrentState => stateMachine.Current;
    public Guid? LastRetryableId => lastRetryableId;
    public bool IsHandsFree => handsFree;
    public bool IsQuickNote => quickNote;

    public Task StartPushToTalkAsync() => StartSessionAsync(isHandsFree: false, isQuickNote: false);

    private async Task StartSessionAsync(bool isHandsFree, bool isQuickNote)
    {
        await operationGate.WaitAsync().ConfigureAwait(false);
        try
        {
            if (stateMachine.Current != DictationState.Idle)
            {
                throw new InvalidOperationException("A dictation session is already active.");
            }

            activeConfiguration = configurationProvider();
            if (isQuickNote && string.IsNullOrWhiteSpace(activeConfiguration.Settings.QuickNoteFolder))
            {
                throw new InvalidOperationException("Choose a Quick Note folder in Settings first.");
            }

            handsFree = isHandsFree;
            quickNote = isQuickNote;
            target = insertion.CaptureTarget();
            if (target.Security == TargetSecurity.Password)
            {
                throw new SecurityException("Spreek will not record for or insert into a password field.");
            }

            startedAt = timeProvider.GetUtcNow();
            MoveTo(DictationState.Connecting, "Connecting to Nova-3...");

            var apiKey = await apiKeyProvider(CancellationToken.None).ConfigureAwait(false);
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new InvalidOperationException("Add your Deepgram API key in Settings before dictating.");
            }

            var options = CreateOptions(activeConfiguration.Settings);
            live = await deepgram.StartLiveAsync(
                apiKey,
                options,
                activeConfiguration.Dictionary,
                CancellationToken.None).ConfigureAwait(false);
            audio = audioRecorderFactory();
            audio.AudioAvailable += OnAudioAvailable;
            audio.LevelChanged += OnLevelChanged;
            live.InterimChanged += OnInterimChanged;

            Directory.CreateDirectory(activeConfiguration.RecordingsDirectory);
            var recordingPath = Path.Combine(activeConfiguration.RecordingsDirectory, $"{Guid.NewGuid():N}.wav");
            await audio.StartAsync(
                recordingPath,
                activeConfiguration.Settings.MicrophoneDeviceNumber,
                CancellationToken.None).ConfigureAwait(false);
            MoveTo(DictationState.Listening, "Listening");
        }
        catch
        {
            await CleanupCurrentAsync(deleteAudio: true).ConfigureAwait(false);
            stateMachine.Reset();
            Publish(DictationSnapshot.Idle with { Message = "Could not start dictation." });
            throw;
        }
        finally
        {
            operationGate.Release();
        }
    }

    public Task StopPushToTalkAsync() => handsFree ? Task.CompletedTask : StopCurrentAsync();

    private async Task StopCurrentAsync()
    {
        await operationGate.WaitAsync().ConfigureAwait(false);
        string? finalText = null;
        var historySaved = false;
        HistoryEntry? savedEntry = null;
        try
        {
            if (stateMachine.Current != DictationState.Listening ||
                audio is null ||
                live is null ||
                target is null ||
                activeConfiguration is null)
            {
                return;
            }

            MoveTo(DictationState.Finalizing, "Finishing your last words...");
            await audio.StopAsync(CancellationToken.None).ConfigureAwait(false);
            var duration = audio.DurationSeconds;
            var recordingPath = audio.FilePath;
            var result = await live.CompleteAsync(CancellationToken.None).ConfigureAwait(false);

            MoveTo(DictationState.Processing, "Cleaning up transcript...");
            var transformed = TranscriptTransformer.Transform(
                result.Text,
                activeConfiguration.Dictionary,
                activeConfiguration.Snippets,
                timeProvider.GetLocalNow(),
                activeConfiguration.Settings.EnablePressEnterCommand);
            finalText = transformed.Text;
            var isQuickNote = quickNote;
            var entry = new HistoryEntry(
                Guid.NewGuid(),
                startedAt,
                transformed.Text,
                result.Text,
                duration,
                result.Confidence,
                result.Language,
                target.ProcessName,
                TranscriptStatus.Completed,
                activeConfiguration.Settings.RetainSuccessfulAudio ? recordingPath : null,
                result.RequestId,
                isQuickNote);

            await history.AppendHistoryAsync(entry).ConfigureAwait(false);
            historySaved = true;
            savedEntry = entry;
            HistoryChanged?.Invoke(this, entry);
            if (isQuickNote)
            {
                await noteExporter.ExportAsync(
                    entry,
                    activeConfiguration.Settings.QuickNoteFolder!,
                    CancellationToken.None).ConfigureAwait(false);
                await CleanupCurrentAsync(deleteAudio: !activeConfiguration.Settings.RetainSuccessfulAudio).ConfigureAwait(false);
                stateMachine.MoveTo(DictationState.Idle);
                Publish(DictationSnapshot.Idle with { Message = "Quick note saved" });
                return;
            }

            MoveTo(DictationState.Inserting, "Pasting...");
            await insertion.InsertAsync(
                target,
                transformed.Text,
                activeConfiguration.Settings.InsertionMode,
                transformed.PressEnter,
                CancellationToken.None).ConfigureAwait(false);

            await CleanupCurrentAsync(deleteAudio: !activeConfiguration.Settings.RetainSuccessfulAudio).ConfigureAwait(false);
            stateMachine.MoveTo(DictationState.Idle);
            Publish(DictationSnapshot.Idle with { Message = "Pasted" });
        }
        catch (Exception error) when (error is not OperationCanceledException)
        {
            if (!historySaved && !string.IsNullOrWhiteSpace(finalText))
            {
                await HandleStorageFailureAsync(finalText, error).ConfigureAwait(false);
            }
            else if (savedEntry is not null && stateMachine.Current == DictationState.Inserting)
            {
                await HandleInsertionFailureAsync(savedEntry, error).ConfigureAwait(false);
            }
            else
            {
                await PreserveRecoveryAsync(error).ConfigureAwait(false);
            }
        }
        finally
        {
            operationGate.Release();
        }
    }

    private async Task HandleInsertionFailureAsync(HistoryEntry entry, Exception error)
    {
        var message = $"Saved, but paste failed: {error.Message}";
        try
        {
            await insertion.CopyAsync(entry.Text, CancellationToken.None).ConfigureAwait(false);
            var copied = entry with { Status = TranscriptStatus.Copied };
            await history.UpdateHistoryAsync(copied).ConfigureAwait(false);
            HistoryChanged?.Invoke(this, copied);
            message += " Text is on the clipboard.";
        }
        catch (Exception fallbackError) when (fallbackError is not OperationCanceledException)
        {
            message += $" Clipboard fallback failed: {fallbackError.Message}";
        }

        var deleteAudio = activeConfiguration is not null && !activeConfiguration.Settings.RetainSuccessfulAudio;
        MoveTo(DictationState.RecoverableError, message);
        await CleanupCurrentAsync(deleteAudio).ConfigureAwait(false);
    }

    public async Task ToggleHandsFreeAsync()
    {
        if (stateMachine.Current == DictationState.Idle)
        {
            await StartSessionAsync(isHandsFree: true, isQuickNote: false).ConfigureAwait(false);
            return;
        }

        if (handsFree)
        {
            await StopCurrentAsync().ConfigureAwait(false);
            return;
        }

        handsFree = true;
        Publish(new DictationSnapshot(
            stateMachine.Current,
            string.Empty,
            timeProvider.GetUtcNow() - startedAt,
            0,
            "Hands-free listening",
            false,
            live?.OmittedKeyterms ?? 0));
    }

    public async Task QuickNoteAsync()
    {
        if (stateMachine.Current == DictationState.Idle)
        {
            await StartSessionAsync(isHandsFree: true, isQuickNote: true).ConfigureAwait(false);
            return;
        }

        if (quickNote)
        {
            await StopCurrentAsync().ConfigureAwait(false);
            return;
        }

        throw new InvalidOperationException("Finish the active dictation before starting a Quick Note.");
    }

    private async Task HandleStorageFailureAsync(string finalText, Exception error)
    {
        var recordingPath = audio?.FilePath;
        var copyMessage = string.Empty;
        try
        {
            await insertion.CopyAsync(finalText, CancellationToken.None).ConfigureAwait(false);
            copyMessage = " Final text was copied.";
        }
        catch (Exception copyError) when (copyError is not OperationCanceledException)
        {
            copyMessage = $" Copy also failed: {copyError.Message}";
        }

        MoveTo(
            DictationState.RecoverableError,
            $"Transcript storage failed: {error.Message}.{copyMessage} Audio kept at {recordingPath}");
        await CleanupCurrentAsync(deleteAudio: false).ConfigureAwait(false);
    }

    public async Task CancelAsync()
    {
        await operationGate.WaitAsync().ConfigureAwait(false);
        try
        {
            if (live is not null)
            {
                await live.AbortAsync().ConfigureAwait(false);
            }

            if (audio is not null)
            {
                await audio.CancelAsync().ConfigureAwait(false);
            }

            await CleanupCurrentAsync(deleteAudio: false).ConfigureAwait(false);
            stateMachine.Reset();
            Publish(DictationSnapshot.Idle with { Message = "Cancelled" });
        }
        finally
        {
            operationGate.Release();
        }
    }

    public async Task RetryAsync(Guid historyId)
    {
        await operationGate.WaitAsync().ConfigureAwait(false);
        try
        {
            if (stateMachine.Current is not (DictationState.Idle or DictationState.RecoverableError))
            {
                throw new InvalidOperationException("Finish the active dictation before retrying another transcript.");
            }

            var loaded = await history.LoadHistoryAsync().ConfigureAwait(false);
            var original = loaded.Entries.FirstOrDefault(entry => entry.Id == historyId)
                ?? throw new KeyNotFoundException($"Transcript {historyId} was not found.");
            if (original.Status != TranscriptStatus.NeedsRetry ||
                string.IsNullOrWhiteSpace(original.AudioPath) ||
                !File.Exists(original.AudioPath))
            {
                throw new InvalidOperationException("This transcript has no recovery audio to retry.");
            }

            var configuration = configurationProvider();
            if (original.IsQuickNote && string.IsNullOrWhiteSpace(configuration.Settings.QuickNoteFolder))
            {
                throw new InvalidOperationException("Choose a Quick Note folder in Settings before retrying this note.");
            }

            MoveTo(DictationState.Processing, "Retrying saved audio...");
            try
            {
                var apiKey = await apiKeyProvider(CancellationToken.None).ConfigureAwait(false);
                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    throw new InvalidOperationException("Add your Deepgram API key in Settings before retrying.");
                }

                var result = await deepgram.TranscribeFileAsync(
                    apiKey,
                    original.AudioPath,
                    CreateOptions(configuration.Settings),
                    configuration.Dictionary,
                    CancellationToken.None).ConfigureAwait(false);
                var transformed = TranscriptTransformer.Transform(
                    result.Text,
                    configuration.Dictionary,
                    configuration.Snippets,
                    timeProvider.GetLocalNow(),
                    configuration.Settings.EnablePressEnterCommand);
                var keepAudio = configuration.Settings.RetainSuccessfulAudio;
                var updated = original with
                {
                    Text = transformed.Text,
                    RawText = result.Text,
                    Confidence = result.Confidence,
                    Language = result.Language,
                    Status = TranscriptStatus.Completed,
                    AudioPath = keepAudio ? original.AudioPath : null,
                    RequestId = result.RequestId,
                };

                await history.UpdateHistoryAsync(updated).ConfigureAwait(false);
                HistoryChanged?.Invoke(this, updated);
                if (original.IsQuickNote)
                {
                    await noteExporter.ExportAsync(
                        updated,
                        configuration.Settings.QuickNoteFolder!,
                        CancellationToken.None).ConfigureAwait(false);
                }
                else
                {
                    await insertion.CopyAsync(updated.Text, CancellationToken.None).ConfigureAwait(false);
                }

                if (!keepAudio && File.Exists(original.AudioPath))
                {
                    File.Delete(original.AudioPath);
                }

                if (lastRetryableId == historyId)
                {
                    lastRetryableId = null;
                }

                stateMachine.MoveTo(DictationState.Idle);
                Publish(DictationSnapshot.Idle with { Message = "Recovered and copied" });
            }
            catch (Exception error) when (error is not OperationCanceledException)
            {
                lastRetryableId = historyId;
                MoveTo(DictationState.RecoverableError, $"Retry failed: {error.Message}");
            }
        }
        finally
        {
            operationGate.Release();
        }
    }

    public async Task PasteLastAsync()
    {
        await operationGate.WaitAsync().ConfigureAwait(false);
        try
        {
            if (stateMachine.Current == DictationState.RecoverableError)
            {
                stateMachine.MoveTo(DictationState.Idle);
            }

            if (stateMachine.Current != DictationState.Idle)
            {
                throw new InvalidOperationException("Finish the active dictation before pasting another transcript.");
            }

            var loaded = await history.LoadHistoryAsync().ConfigureAwait(false);
            var latest = loaded.Entries
                .Where(entry => !string.IsNullOrWhiteSpace(entry.Text))
                .OrderByDescending(entry => entry.CreatedAt)
                .FirstOrDefault()
                ?? throw new InvalidOperationException("There is no saved transcript to paste yet.");
            var configuration = configurationProvider();
            var currentTarget = insertion.CaptureTarget();
            startedAt = timeProvider.GetUtcNow();
            MoveTo(DictationState.Inserting, "Pasting last transcript...");
            try
            {
                await insertion.InsertAsync(
                    currentTarget,
                    latest.Text,
                    configuration.Settings.InsertionMode,
                    false,
                    CancellationToken.None).ConfigureAwait(false);
                stateMachine.MoveTo(DictationState.Idle);
                Publish(DictationSnapshot.Idle with { Message = "Pasted last transcript" });
            }
            catch (Exception error) when (error is not OperationCanceledException)
            {
                MoveTo(DictationState.RecoverableError, error.Message);
            }
        }
        finally
        {
            operationGate.Release();
        }
    }

    private async Task PreserveRecoveryAsync(Exception error)
    {
        var recordingPath = audio?.FilePath;
        var configuration = activeConfiguration;
        if (audio is null ||
            configuration is null ||
            string.IsNullOrWhiteSpace(recordingPath) ||
            !File.Exists(recordingPath))
        {
            await CleanupCurrentAsync(deleteAudio: true).ConfigureAwait(false);
            stateMachine.Reset();
            Publish(DictationSnapshot.Idle with { Message = error.Message });
            return;
        }

        var entry = new HistoryEntry(
            Guid.NewGuid(),
            startedAt,
            string.Empty,
            string.Empty,
            audio.DurationSeconds,
            0,
            configuration.Settings.Language.ToString(),
            target?.ProcessName ?? "Unknown",
            TranscriptStatus.NeedsRetry,
            recordingPath,
            live?.RequestId,
            false);
        await history.AppendHistoryAsync(entry).ConfigureAwait(false);
        lastRetryableId = entry.Id;
        HistoryChanged?.Invoke(this, entry);
        MoveTo(DictationState.RecoverableError, $"Saved audio for retry: {error.Message}");
        await CleanupCurrentAsync(deleteAudio: false).ConfigureAwait(false);
    }

    private static DeepgramOptions CreateOptions(AppSettings settings) => new(
        settings.RegionHost,
        settings.Language,
        settings.EndpointingMs,
        settings.PrivacyOptOut);

    private void OnAudioAvailable(object? sender, byte[] bytes) => live?.QueueAudio(bytes);

    private void OnLevelChanged(object? sender, double level) =>
        Publish(new DictationSnapshot(
            stateMachine.Current,
            string.Empty,
            timeProvider.GetUtcNow() - startedAt,
            level,
            "Listening",
            false,
            live?.OmittedKeyterms ?? 0));

    private void OnInterimChanged(object? sender, string interim) =>
        Publish(new DictationSnapshot(
            stateMachine.Current,
            interim,
            timeProvider.GetUtcNow() - startedAt,
            0,
            "Listening",
            false,
            live?.OmittedKeyterms ?? 0));

    private void MoveTo(DictationState state, string message)
    {
        stateMachine.MoveTo(state);
        Publish(new DictationSnapshot(
            state,
            string.Empty,
            state == DictationState.Idle ? TimeSpan.Zero : timeProvider.GetUtcNow() - startedAt,
            0,
            message,
            state == DictationState.RecoverableError && lastRetryableId.HasValue,
            live?.OmittedKeyterms ?? 0));
    }

    private void Publish(DictationSnapshot snapshot) => SnapshotChanged?.Invoke(this, snapshot);

    private async Task CleanupCurrentAsync(bool deleteAudio)
    {
        if (audio is not null)
        {
            audio.AudioAvailable -= OnAudioAvailable;
            audio.LevelChanged -= OnLevelChanged;
            if (deleteAudio)
            {
                await audio.CancelAsync().ConfigureAwait(false);
            }

            audio.Dispose();
            audio = null;
        }

        if (live is not null)
        {
            live.InterimChanged -= OnInterimChanged;
            await live.DisposeAsync().ConfigureAwait(false);
            live = null;
        }

        target = null;
        activeConfiguration = null;
        handsFree = false;
        quickNote = false;
    }
}
