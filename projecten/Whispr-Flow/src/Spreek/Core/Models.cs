namespace Spreek.Core;

public enum DictationState
{
    Idle,
    Connecting,
    Listening,
    Finalizing,
    Processing,
    Inserting,
    RecoverableError,
    FatalError,
}

public enum TranscriptStatus
{
    Completed,
    Copied,
    NeedsRetry,
    Cancelled,
}

public enum LanguageMode
{
    Multilingual,
    Dutch,
    English,
}

public enum InsertionMode
{
    Auto,
    ControlV,
    ControlShiftV,
    Unicode,
}

public enum TargetSecurity
{
    Unknown,
    Normal,
    Password,
}

public sealed record TranscriptSegment(
    double Start,
    double Duration,
    string Text,
    bool IsFinal,
    bool FromFinalize,
    double Confidence);

public sealed record TransformResult(
    string Text,
    bool PressEnter,
    IReadOnlyList<string> Warnings);

public sealed record DictionaryEntry(
    Guid Id,
    string Term,
    string? HeardAs,
    bool Starred,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public sealed record SnippetEntry(
    Guid Id,
    string Name,
    string Text,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public sealed record HistoryEntry(
    Guid Id,
    DateTimeOffset CreatedAt,
    string Text,
    string RawText,
    double DurationSeconds,
    double Confidence,
    string Language,
    string TargetProcess,
    TranscriptStatus Status,
    string? AudioPath,
    string? RequestId,
    bool IsQuickNote);

public sealed class AppSettings
{
    public string RegionHost { get; set; } = "api.eu.deepgram.com";
    public LanguageMode Language { get; set; } = LanguageMode.Multilingual;
    public int EndpointingMs { get; set; } = 300;
    public bool PrivacyOptOut { get; set; } = true;
    public int MicrophoneDeviceNumber { get; set; }
    public string PushToTalkShortcut { get; set; } = "Ctrl+Win";
    public string HandsFreeShortcut { get; set; } = "Ctrl+Win+Space";
    public string PasteLastShortcut { get; set; } = "Shift+Alt+Z";
    public string QuickNoteShortcut { get; set; } = "Ctrl+Win+N";
    public InsertionMode InsertionMode { get; set; } = InsertionMode.Auto;
    public bool RetainSuccessfulAudio { get; set; }
    public bool ShowFlowBarWhenIdle { get; set; } = true;
    public bool StartWithWindows { get; set; }
    public bool EnablePressEnterCommand { get; set; } = true;
    public string? QuickNoteFolder { get; set; }
    public decimal MonolingualCostPerMinute { get; set; } = 0.0048m;
    public decimal MultilingualCostPerMinute { get; set; } = 0.0058m;
}

public sealed record HistoryLoadResult(
    IReadOnlyList<HistoryEntry> Entries,
    IReadOnlyList<string> Warnings);

public sealed record ImportIssue(int Row, string Message);

public sealed record ImportResult<T>(
    IReadOnlyList<T> Items,
    IReadOnlyList<ImportIssue> Issues);

public sealed record MicrophoneDevice(int DeviceNumber, string Name)
{
    public override string ToString() => Name;
}

public sealed record DeepgramOptions(
    string RegionHost,
    LanguageMode Language,
    int EndpointingMs,
    bool PrivacyOptOut);

public sealed record KeytermSelection(
    IReadOnlyList<string> Terms,
    int OmittedCount);

public sealed record LiveTranscriptResult(
    string Text,
    double Confidence,
    string? RequestId,
    string Language);

public sealed record CredentialCheckResult(bool Success, string Message);

public sealed record TargetWindow(
    nint Handle,
    string ProcessName,
    string ClassName,
    TargetSecurity Security);

public sealed record DictationSnapshot(
    DictationState State,
    string InterimText,
    TimeSpan Elapsed,
    double Level,
    string Message,
    bool CanRetry,
    int OmittedKeyterms)
{
    public static DictationSnapshot Idle { get; } =
        new(DictationState.Idle, string.Empty, TimeSpan.Zero, 0, "Ready", false, 0);
}
