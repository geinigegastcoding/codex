---
title: Spreek implementation plan
created: 2026-09-02
updated: 2026-09-02
type: plan
tags: [personal, project, windows, dictation, deepgram]
sources: [2026-09-02-spreek-desktop-design]
status: approved
---

# Spreek Native Desktop Dictation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished, native Windows dictation application that streams microphone audio to Deepgram Nova-3, inserts final text into the focused application, and locally manages dictionary terms, snippets, recovery recordings, and transcript history.

**Architecture:** A single WPF process constructs focused domain and platform services explicitly, with `DictationCoordinator` as the sole owner of recording state. Deepgram streaming uses `ClientWebSocket`; NAudio captures PCM and writes WAV recovery files; Windows APIs provide global key hooks, encryption, focus, clipboard insertion, startup, and tray behavior. Durable JSON/JSONL files under `%LOCALAPPDATA%\Spreek` keep all non-secret user data local.

**Tech Stack:** C# 12, .NET 8 WPF, NAudio 2.2.1, MSTest, Windows DPAPI/UI Automation/Win32 APIs, Deepgram Nova-3 WebSocket and prerecorded HTTP APIs.

---

## Execution constraints

- Work in the existing empty directory `E:\MData\projecten\Whispr-Flow`; do not touch unrelated dirty files in the parent repository.
- Use a portable .NET SDK under `E:\MData\.temp\dotnet8` because only the runtime is currently installed.
- Do not create commits unless Daniel explicitly asks; use test/build checkpoints instead.
- Do not create project Markdown outside the governed Kennis vault.
- Do not read or print secret values. Diagnostics may consume `DEEPGRAM_API_KEY` from process environment.
- Keep the app native: no HTML, browser window, WebView, Electron, or browser screenshots.

## File map

### Build and entry point

- Create `E:\MData\projecten\Whispr-Flow\Spreek.sln` — solution containing application and test projects.
- Create `E:\MData\projecten\Whispr-Flow\Directory.Build.props` — nullable, warnings, deterministic-build defaults.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Spreek.csproj` — WPF executable, WinForms tray support, NAudio dependency.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\App.xaml` — global theme resources and startup definition.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\App.xaml.cs` — composition root, tray lifecycle, command-line diagnostics.
- Create `E:\MData\projecten\Whispr-Flow\build.ps1` — restore, test, publish, and copy the self-contained artifact.
- Create `E:\MData\projecten\Whispr-Flow\run.cmd` — one-click development launcher using the published app when available.

### Core behavior

- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Core\Models.cs` — settings, dictionary, snippet, transcript, microphone, and state records/enums.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Core\DictationStateMachine.cs` — legal state transitions.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Core\TranscriptAssembler.cs` — unique ordered final segments plus interim preview.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Core\TranscriptTransformer.cs` — dictionary corrections, snippets, variables, whitespace, trailing Enter command.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Core\LibraryImporter.cs` — strict CSV dictionary and JSON snippet import.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Core\HotkeyChord.cs` — parse and validate configurable shortcut strings.

### Platform services

- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\AppPaths.cs` — `%LOCALAPPDATA%\Spreek` layout.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\LocalStore.cs` — atomic settings/libraries, JSONL history, recovery metadata.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\SecretStore.cs` — current-user DPAPI API-key storage.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\DiagnosticLog.cs` — bounded redacted local log.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\DeepgramUriBuilder.cs` — validated Nova-3 query construction and keyterm selection.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\DeepgramClient.cs` — WebSocket live session, Finalize/CloseStream, prerecorded retry, credential test.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\AudioRecorder.cs` — microphone enumeration, 16 kHz PCM capture, RMS levels, WAV durability.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\GlobalHotkeyService.cs` — low-level hook and PTT press/release semantics.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\TextInsertionService.cs` — foreground capture, password guard, clipboard and Unicode insertion.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\StartupService.cs` — current-user launch-at-login registry entry.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Services\MarkdownNoteExporter.cs` — idempotent quick-note files.

### Application and native UI

- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\Application\DictationCoordinator.cs` — orchestrates start, stop, cancel, retry, persistence, transform, and insert.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\UI\Theme.xaml` — colors, typography, cards, buttons, inputs, tabs, and focus states.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\UI\FlowBarWindow.xaml` and `.xaml.cs` — non-activating overlay with waveform and recovery actions.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\UI\MainWindow.xaml` and `.xaml.cs` — Home, History, Dictionary, Snippets, Settings.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek\UI\PromptDialog.xaml` and `.xaml.cs` — one reusable native input/confirmation dialog.

### Verification

- Create `E:\MData\projecten\Whispr-Flow\tests\Spreek.Tests\Spreek.Tests.csproj`.
- Create `E:\MData\projecten\Whispr-Flow\tests\Spreek.Tests\StateAndAssemblerTests.cs`.
- Create `E:\MData\projecten\Whispr-Flow\tests\Spreek.Tests\TransformerAndImporterTests.cs`.
- Create `E:\MData\projecten\Whispr-Flow\tests\Spreek.Tests\StorageAndSecurityTests.cs`.
- Create `E:\MData\projecten\Whispr-Flow\tests\Spreek.Tests\DeepgramConfigurationTests.cs`.
- Create `E:\MData\projecten\Whispr-Flow\tests\Spreek.Tests\HotkeyChordTests.cs`.
- Create `E:\MData\projecten\Whispr-Flow\src\Spreek.Diagnostics\Spreek.Diagnostics.csproj` and `Program.cs` — live API, microphone, and insertion smoke commands.

## Task 1: Install the portable SDK and scaffold the solution

- [x] **Step 1: Install .NET 8 SDK without modifying machine-wide configuration**

Run:

```powershell
$installer = 'E:\MData\.temp\dotnet-install.ps1'
Invoke-WebRequest 'https://dot.net/v1/dotnet-install.ps1' -OutFile $installer
& $installer -Channel 8.0 -Quality GA -InstallDir 'E:\MData\.temp\dotnet8'
& 'E:\MData\.temp\dotnet8\dotnet.exe' --info
```

Expected: one .NET 8 SDK is listed and the install base is `E:\MData\.temp\dotnet8`.

- [x] **Step 2: Create the solution and projects**

Run from `E:\MData\projecten\Whispr-Flow`:

```powershell
$dotnet = 'E:\MData\.temp\dotnet8\dotnet.exe'
& $dotnet new sln -n Spreek
& $dotnet new wpf -n Spreek -o src\Spreek --framework net8.0
& $dotnet new mstest -n Spreek.Tests -o tests\Spreek.Tests --framework net8.0
& $dotnet new console -n Spreek.Diagnostics -o src\Spreek.Diagnostics --framework net8.0
& $dotnet sln Spreek.sln add src\Spreek\Spreek.csproj tests\Spreek.Tests\Spreek.Tests.csproj src\Spreek.Diagnostics\Spreek.Diagnostics.csproj
& $dotnet add src\Spreek\Spreek.csproj package NAudio --version 2.2.1
& $dotnet add tests\Spreek.Tests\Spreek.Tests.csproj reference src\Spreek\Spreek.csproj
& $dotnet add src\Spreek.Diagnostics\Spreek.Diagnostics.csproj reference src\Spreek\Spreek.csproj
```

Expected: all templates restore successfully and the solution lists three projects.

- [x] **Step 3: Lock compiler and desktop settings**

Create `Directory.Build.props`:

```xml
<Project>
  <PropertyGroup>
    <LangVersion>12</LangVersion>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <Deterministic>true</Deterministic>
  </PropertyGroup>
</Project>
```

Set the app project properties:

```xml
<PropertyGroup>
  <OutputType>WinExe</OutputType>
  <TargetFramework>net8.0-windows</TargetFramework>
  <UseWPF>true</UseWPF>
  <UseWindowsForms>true</UseWindowsForms>
  <EnableWindowsTargeting>true</EnableWindowsTargeting>
  <AssemblyName>Spreek</AssemblyName>
  <RootNamespace>Spreek</RootNamespace>
</PropertyGroup>
```

- [x] **Step 4: Prove the untouched scaffold builds**

Run:

```powershell
& 'E:\MData\.temp\dotnet8\dotnet.exe' build Spreek.sln -warnaserror
```

Expected: `Build succeeded`, 0 warnings, 0 errors.

## Task 2: Define models, legal states, and transcript assembly test-first

- [x] **Step 1: Add failing state and assembler tests**

Tests must exercise these exact contracts:

```csharp
[TestMethod]
public void State_machine_rejects_a_second_start_while_listening()
{
    var machine = new DictationStateMachine();
    machine.MoveTo(DictationState.Connecting);
    machine.MoveTo(DictationState.Listening);
    Assert.ThrowsException<InvalidOperationException>(() => machine.MoveTo(DictationState.Connecting));
}

[TestMethod]
public void Assembler_orders_unique_final_segments_and_keeps_interim_separate()
{
    var sut = new TranscriptAssembler();
    sut.Accept(new TranscriptSegment(2.0, 1.0, "world.", true, false, 0.9));
    sut.Accept(new TranscriptSegment(0.0, 2.0, "Hello", true, false, 0.9));
    sut.Accept(new TranscriptSegment(0.0, 2.0, "Hello", true, false, 0.9));
    sut.Accept(new TranscriptSegment(3.0, 1.0, "temporary", false, false, 0.5));
    Assert.AreEqual("Hello world.", sut.FinalText);
    Assert.AreEqual("temporary", sut.InterimText);
}
```

- [x] **Step 2: Run the focused tests and verify failure**

Run:

```powershell
& 'E:\MData\.temp\dotnet8\dotnet.exe' test tests\Spreek.Tests --filter 'State|Assembler'
```

Expected: compilation fails because the core types do not exist.

- [x] **Step 3: Implement the domain records and transition table**

Use these stable public contracts in `Models.cs`:

```csharp
public enum DictationState { Idle, Connecting, Listening, Finalizing, Processing, Inserting, RecoverableError, FatalError }
public enum TranscriptStatus { Completed, Copied, NeedsRetry, Cancelled }
public enum LanguageMode { Multilingual, Dutch, English }
public enum InsertionMode { Auto, ControlV, ControlShiftV, Unicode }
public sealed record TranscriptSegment(double Start, double Duration, string Text, bool IsFinal, bool FromFinalize, double Confidence);
public sealed record TransformResult(string Text, bool PressEnter, IReadOnlyList<string> Warnings);
public sealed record DictionaryEntry(Guid Id, string Term, string? HeardAs, bool Starred, DateTimeOffset CreatedAt, DateTimeOffset UpdatedAt);
public sealed record SnippetEntry(Guid Id, string Name, string Text, DateTimeOffset CreatedAt, DateTimeOffset UpdatedAt);
public sealed record HistoryEntry(Guid Id, DateTimeOffset CreatedAt, string Text, string RawText, double DurationSeconds, double Confidence, string Language, string TargetProcess, TranscriptStatus Status, string? AudioPath, string? RequestId, bool IsQuickNote);
```

`DictationStateMachine.MoveTo` uses a static allowed-transition set and throws with both state names for illegal movement. `Reset` always returns to `Idle` after coordinator cleanup.

- [x] **Step 4: Implement unique ordered assembly**

`TranscriptAssembler.Accept` stores final segments by `(Start, Duration)` and replaces `InterimText` only for non-final segments. `FinalText` orders segments by start time and joins non-empty text with one space. `AverageConfidence` weights final segment confidence by duration.

- [x] **Step 5: Run tests**

Run:

```powershell
& 'E:\MData\.temp\dotnet8\dotnet.exe' test tests\Spreek.Tests --filter 'State|Assembler'
```

Expected: all focused tests pass.

## Task 3: Implement deterministic transformation and imports test-first

- [x] **Step 1: Add transformation tests**

Cover whole-phrase correction, longest-first snippets, date/time variables, unknown-variable warnings, whitespace, and trailing Enter:

```csharp
[TestMethod]
public void Transform_applies_corrections_then_snippets_and_trailing_enter()
{
    var dictionary = new[] { Entry("magic data", "MagisData") };
    var snippets = new[] { Snippet("my sign off", "Groet,\nDaniel — {date}") };
    var result = TranscriptTransformer.Transform(
        "Email magic data. My sign off. Press enter.", dictionary, snippets,
        new DateTimeOffset(2026, 9, 2, 18, 5, 0, TimeSpan.FromHours(2)));
    Assert.AreEqual("Email MagisData. Groet,\nDaniel — 2026-09-02", result.Text);
    Assert.IsTrue(result.PressEnter);
}
```

Import tests use CSV `magis data,MagisData` and JSON `[{"name":"my link","text":"https://example.test"}]`, and assert duplicate or malformed rows include their one-based row number.

- [x] **Step 2: Verify tests fail, then implement the minimum processors**

Run the transformer/importer filter before and after implementation. Use compiled, escaped, case-insensitive regex patterns with phrase boundaries and sort entries by source phrase length descending. Supported snippet variables are exactly:

```csharp
private static readonly IReadOnlyDictionary<string, Func<DateTimeOffset, string>> Variables =
    new Dictionary<string, Func<DateTimeOffset, string>>(StringComparer.OrdinalIgnoreCase)
    {
        ["date"] = now => now.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
        ["time"] = now => now.ToString("HH:mm", CultureInfo.InvariantCulture),
    };
```

Unknown `{identifier}` values stay in output and add one warning per distinct identifier.

The CSV parser must support quoted commas and doubled quotes with a small state machine. It returns valid entries and a list of row-specific errors rather than making the import all-or-nothing.

- [x] **Step 3: Run focused and full tests**

Run:

```powershell
& 'E:\MData\.temp\dotnet8\dotnet.exe' test tests\Spreek.Tests --filter 'Transformer|Importer'
& 'E:\MData\.temp\dotnet8\dotnet.exe' test Spreek.sln
```

Expected: all tests pass.

## Task 4: Add durable local storage and secret protection test-first

- [x] **Step 1: Add isolated temporary-directory tests**

Tests create their own directory below `Path.GetTempPath()`, prove settings and libraries round-trip, append two history records, rewrite one edited record, and verify a corrupt JSONL line is reported while valid rows still load.

Secret test contract:

```csharp
[TestMethod]
public async Task Secret_store_round_trips_without_plaintext_on_disk()
{
    using var area = new TemporaryArea();
    var sut = new SecretStore(area.Path);
    await sut.SaveAsync("dg-secret-value");
    Assert.AreEqual("dg-secret-value", await sut.LoadAsync());
    StringAssert.DoesNotContain(await File.ReadAllTextAsync(sut.FilePath), "dg-secret-value");
}
```

- [x] **Step 2: Implement paths and atomic JSON storage**

`AppPaths` creates `Root`, `Recordings`, and `Logs`. `LocalStore.SaveJsonAsync` serializes to a sibling `.tmp`, flushes it, and calls `File.Move(temp, target, true)`. `AppendHistoryAsync` opens with `FileOptions.WriteThrough`, writes one compact JSON object plus newline, and flushes before returning.

Use this result shape so corruption fails loudly without hiding valid data:

```csharp
public sealed record HistoryLoadResult(IReadOnlyList<HistoryEntry> Entries, IReadOnlyList<string> Warnings);
```

- [x] **Step 3: Implement user-scoped encryption**

Use `ProtectedData.Protect` and `ProtectedData.Unprotect` with `DataProtectionScope.CurrentUser`, UTF-8 bytes, and fixed application entropy `Spreek.Deepgram.ApiKey.v1`. If the reference assembly requires it, add `System.Security.Cryptography.ProtectedData` version `8.0.0` rather than implementing cryptography.

- [x] **Step 4: Add bounded redacted logging**

The logger replaces values following `Authorization`, `Token`, `api_key`, `apikey`, and `password` with `[redacted]`, truncates messages to 8,000 characters, and rolls `spreek.log` at 2 MB to one `.old` file.

- [x] **Step 5: Run storage/security tests**

Expected: all pass and the plaintext secret assertion succeeds.

## Task 5: Build Deepgram configuration, streaming, and retry

- [x] **Step 1: Add URI tests before implementation**

Assert that the default URI host is `api.eu.deepgram.com`; the query includes `model=nova-3`, `language=multi`, `encoding=linear16`, `sample_rate=16000`, `channels=1`, `smart_format=true`, `punctuate=true`, `interim_results=true`, `endpointing=300`, `numerals=true`, and `mip_opt_out=true`; and every selected keyterm is a separate encoded `keyterm` parameter.

Add a 500-token-budget test that prefers starred entries, then newer entries, and returns an omitted count.

- [x] **Step 2: Implement `DeepgramUriBuilder`**

Expose:

```csharp
public sealed record DeepgramOptions(string RegionHost, LanguageMode Language, int EndpointingMs, bool PrivacyOptOut);
public sealed record KeytermSelection(IReadOnlyList<string> Terms, int OmittedCount);
public static Uri BuildStreaming(DeepgramOptions options, IEnumerable<DictionaryEntry> entries, out KeytermSelection selection);
public static Uri BuildPrerecorded(DeepgramOptions options, IEnumerable<DictionaryEntry> entries, out KeytermSelection selection);
```

Count whitespace-delimited tokens conservatively, cap the aggregate at 500, and never put `HeardAs` values in the URL.

- [x] **Step 3: Implement one ordered WebSocket sender and receiver**

`DeepgramLiveSession` connects with header `Authorization: Token <key>`, owns an unbounded `Channel<byte[]>`, and exposes:

```csharp
public event EventHandler<string>? InterimChanged;
public event EventHandler<TranscriptSegment>? FinalSegment;
public string? RequestId { get; }
public void QueueAudio(ReadOnlySpan<byte> pcm);
public Task<LiveTranscriptResult> CompleteAsync(CancellationToken cancellationToken);
public Task AbortAsync();
```

Only the channel reader calls binary `SendAsync`. The receiver assembles fragmented text frames, accepts `Results`, captures `Metadata.request_id`, reports Deepgram `Error` messages, and never converts interim results into final text.

`CompleteAsync` completes and drains the channel, sends text frame `{"type":"Finalize"}`, waits for `from_finalize=true` or a bounded post-finalization quiet period, sends `{"type":"CloseStream"}`, and waits for metadata/close. A total finalization timeout preserves the WAV through coordinator error handling.

- [x] **Step 4: Implement prerecorded retry and credential check**

POST WAV bytes to the prerecorded URI with `Content-Type: audio/wav` and the same authorization header. Parse `results.channels[0].alternatives[0]` into text and confidence. The API-key check sends a short generated WAV; HTTP 401/403 returns an authentication-specific result, while transport failures remain distinct.

- [x] **Step 5: Run URI tests and a fake-WebSocket parser check**

Expected: configuration tests pass without network access. Keep live API verification for Task 10.

## Task 6: Capture microphone audio and recovery WAV files

- [ ] **Step 1: Implement microphone enumeration**

Return stable device numbers and NAudio product names:

```csharp
public sealed record MicrophoneDevice(int DeviceNumber, string Name);
public static IReadOnlyList<MicrophoneDevice> GetDevices();
```

An unavailable saved device falls back to device 0 with a visible warning; no-device state throws `MicrophoneUnavailableException` naming the selected value.

- [ ] **Step 2: Implement recorder lifecycle**

`AudioRecorder.StartAsync(path, deviceNumber)` creates `WaveInEvent` with `WaveFormat(16000, 16, 1)` and `BufferMilliseconds=100`, opens `WaveFileWriter`, and exposes copied PCM frames plus RMS:

```csharp
public event EventHandler<byte[]>? AudioAvailable;
public event EventHandler<double>? LevelChanged;
public double DurationSeconds { get; }
public Task StartAsync(string path, int deviceNumber, CancellationToken cancellationToken);
public Task StopAsync(CancellationToken cancellationToken);
public Task CancelAsync();
```

Stop waits for `RecordingStopped`, flushes and disposes the WAV, and verifies the file has more than a WAV header before returning. Cancel stops safely and deletes the partial file.

- [ ] **Step 3: Add diagnostic microphone command**

`Spreek.Diagnostics microphone --seconds 2 --output <path>` lists the chosen device, records exactly two seconds, validates PCM format and file length, and prints no audio contents.

- [ ] **Step 4: Run the physical capture smoke check**

Expected: a valid non-empty 16 kHz mono WAV and a reported RMS range.

## Task 7: Add Windows hotkeys, target safety, and insertion

- [ ] **Step 1: Test hotkey parsing**

Test `Ctrl+Win`, `Ctrl+Win+Space`, `Shift+Alt+Z`, `Ctrl+Win+N`, invalid duplicate modifiers, unknown keys, and collisions across configured actions.

- [ ] **Step 2: Implement chord parsing and low-level keyboard hook**

`HotkeyChord` stores modifier flags plus an optional virtual key. `GlobalHotkeyService` installs `WH_KEYBOARD_LL`, tracks only key-up/down state, never stores typed characters, and dispatches five events on the WPF dispatcher.

For the overlapping defaults, delay modifier-only PTT activation for 160 ms. If Space arrives while `Ctrl+Win` is held, cancel pending PTT and toggle hands-free. Releasing either PTT modifier emits release exactly once. Escape is suppressed only while dictation is active.

- [ ] **Step 3: Implement target capture and password guard**

Capture `GetForegroundWindow`, process name, class name, and focused `AutomationElement.IsPasswordProperty` at start. If a password field is detected, reject dictation before the microphone starts. UI Automation failures return `Unknown`, never surrounding text.

- [ ] **Step 4: Implement insertion modes**

On the WPF dispatcher, set clipboard text. Attempt `SetForegroundWindow` on the captured handle. Send exact modifier key-down/key-up pairs with `SendInput`; use `Ctrl+Shift+V` only for the Windows Terminal process in Auto mode and `Ctrl+V` otherwise. Unicode mode emits UTF-16 code units using `KEYEVENTF_UNICODE`. If `SendInput` inserts fewer events than requested, throw an insertion error while leaving clipboard contents intact.

- [ ] **Step 5: Add insertion diagnostic**

`Spreek.Diagnostics insert --text "Spreek insertion check" --delay 3` waits three seconds, captures the then-focused window, inserts, and reports dispatched event count without printing clipboard history.

## Task 8: Orchestrate complete dictation and recovery

- [ ] **Step 1: Define coordinator events and commands**

Use one coordinator with serialized public operations:

```csharp
public event EventHandler<DictationSnapshot>? SnapshotChanged;
public event EventHandler<HistoryEntry>? HistoryChanged;
public Task StartPushToTalkAsync();
public Task StopPushToTalkAsync();
public Task ToggleHandsFreeAsync();
public Task CancelAsync();
public Task PasteLastAsync();
public Task RetryAsync(Guid historyId);
public Task QuickNoteAsync();
```

`DictationSnapshot` contains state, interim text, elapsed time, level, message, recoverability, and omitted-keyterm count; it contains no secret.

- [ ] **Step 2: Implement start and stop transaction boundaries**

Start captures the target, transitions to Connecting, connects Deepgram, creates the recovery path, starts audio, subscribes audio to the live session, and transitions to Listening only after all steps succeed.

Stop transitions to Finalizing, stops audio, awaits `CompleteAsync`, transforms the final text, appends history, transitions through Processing and Inserting, performs insertion, updates status, optionally presses Enter, deletes successful audio when retention is off, then resets to Idle.

- [ ] **Step 3: Implement fail-loud recovery**

Errors before audio return to Idle with a setup message. Errors after WAV data exists append or update `NeedsRetry`, retain the WAV, and transition to RecoverableError. Storage failure copies final text before any insert attempt and names the failing path. Cancel aborts session, disposes audio, deletes only the current partial WAV, and returns Idle.

- [ ] **Step 4: Implement retry, paste-last, and quick note**

Retry transcribes the retained WAV through prerecorded Nova-3, applies transformations, updates the same history ID, and deletes audio only on success when retention is off. Paste-last uses the newest non-empty transcript. Quick note runs a hands-free session with `IsQuickNote=true`, saves history, exports one timestamped Markdown note with a transcript-ID marker, and skips application insertion.

- [ ] **Step 5: Add coordinator tests with fakes**

Use small hand-written fakes for audio, transcription, persistence, and insertion. Prove start/stop ordering, storage-before-insert, cancel cleanup, recovery preservation, retry updates the same row, and double-start rejection.

## Task 9: Build the polished native interface

- [ ] **Step 1: Create the theme before individual screens**

Define these exact design tokens in `Theme.xaml`:

```xml
<Color x:Key="CanvasColor">#0A0D12</Color>
<Color x:Key="SurfaceColor">#111722</Color>
<Color x:Key="RaisedColor">#18202D</Color>
<Color x:Key="BorderColor">#293446</Color>
<Color x:Key="TextColor">#F3F6FA</Color>
<Color x:Key="MutedColor">#96A2B5</Color>
<Color x:Key="AccentColor">#4D8DFF</Color>
<Color x:Key="SuccessColor">#42D392</Color>
<Color x:Key="DangerColor">#FF6375</Color>
```

Create native styles for card borders, primary/secondary/danger buttons, text inputs, combo boxes, tab items, list rows, and keyboard focus. Use Segoe UI Variable when available with Segoe UI fallback, 8/12/16/24 spacing, 10 px card radii, and 999 px pill radii. Do not add gradients, glass blur, decorative charts, or animation unrelated to dictation state.

- [ ] **Step 2: Implement the non-activating Flow Bar**

Use `WindowStyle=None`, `AllowsTransparency=True`, `Topmost=True`, `ShowInTaskbar=False`, and Win32 `WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE`. Center it above `SystemParameters.WorkArea.Bottom`.

The compact 420x58 idle pill expands to 560x82 while active. Bind five level bars to the current RMS with a 60 fps maximum UI update. Show only one concise status line, elapsed time, and an ellipsized interim preview. Hands-free exposes Stop and Cancel; recoverable error exposes Retry and Copy. Never activate the window on show.

- [ ] **Step 3: Implement the main shell and five pages**

Create a 1120x760 window with a 224 px left navigation rail and one content surface. Each page must have an explicit empty state, validation message, and keyboard-accessible primary action.

Home shows connection/microphone health, record control, shortcut cards, recent transcript, today's duration, and estimated cost. History uses a virtualized DataGrid with search/status filters and actions. Dictionary and Snippets use searchable lists plus one inline editor each. Settings uses grouped cards for API, transcription, microphone, shortcuts, insertion, privacy, startup, and data controls.

- [ ] **Step 4: Wire UI actions to real services**

No preview-only controls are allowed. API Test calls the credential check; microphone selection enumerates NAudio; all add/edit/delete/import/export actions persist immediately; history actions operate on stored records; startup toggles the registry service; hotkey Apply reparses, collision-checks, saves, and reinstalls the hook.

- [ ] **Step 5: Add tray behavior and first-run setup**

Use `NotifyIcon` with Open Spreek, Start hands-free, Paste last, and Exit. Closing the main window hides it unless Exit was chosen. First run opens Settings with API-key and microphone validation visible; configured starts show the Flow Bar and tray while leaving the main window available.

- [ ] **Step 6: Inspect actual WPF windows at 100% and 150% scaling**

Verify clipping, contrast, focus indicators, empty/error states, overlay position, and no focus theft. Make scoped XAML fixes only where the native render proves a problem.

## Task 10: Package and verify the end-to-end application

- [ ] **Step 1: Implement build scripts**

`build.ps1` accepts `-Configuration Release` and `-SkipTests`; by default it restores, builds with warnings as errors, runs all tests, then publishes:

```powershell
& $dotnet publish 'src\Spreek\Spreek.csproj' `
  -c $Configuration -r win-x64 --self-contained true `
  -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true `
  -o 'release'
```

It fails on any non-zero exit code and prints the absolute final executable path. `run.cmd` starts `release\Spreek.exe` or prints a single actionable build command when absent.

- [ ] **Step 2: Run the full automated gate**

Run:

```powershell
& 'E:\MData\.temp\dotnet8\dotnet.exe' format Spreek.sln --verify-no-changes
& 'E:\MData\.temp\dotnet8\dotnet.exe' build Spreek.sln -c Release -warnaserror
& 'E:\MData\.temp\dotnet8\dotnet.exe' test Spreek.sln -c Release --no-build
```

Expected: format clean, build success with 0 warnings/errors, all tests pass.

- [ ] **Step 3: Run authenticated Nova-3 integration without exposing the key**

Load a matching `DEEPGRAM_API_KEY` from the workspace environment or `.env` directly into the child process without printing it. Generate Windows TTS speech saying `Spreek verification MagisData`, stream the WAV through `Spreek.Diagnostics deepgram`, and assert the command reports `model=nova-3`, a request ID, final text containing at least two expected distinctive terms, and exit code 0.

If no key exists, leave this check explicitly unverified and make the app's API Test the first-run gate; do not substitute an unauthenticated HTTP check.

- [ ] **Step 4: Verify recovery and retry**

Run the app once with an invalid endpoint host, record generated speech through the diagnostic feed, verify `NeedsRetry` plus retained WAV, restore the EU host, retry the same history ID, and verify completed text plus recovery-file deletion.

- [ ] **Step 5: Verify real Windows insertion**

Launch Notepad, focus its editor, invoke `Spreek.Diagnostics insert`, and read the editor through Windows UI Automation to prove the exact inserted text. Repeat paste-last through the running app. Launch Windows Terminal if available and verify the configured terminal-paste path.

- [ ] **Step 6: Verify the physical microphone and native windows**

Record two seconds from the actual selected microphone and validate WAV metadata. Launch the published `Spreek.exe`, inspect the main window and every Flow Bar state as native Windows UI, and confirm no HTML/WebView process or browser tab is involved.

- [ ] **Step 7: Verify persistence across restart**

Add a unique dictionary term and a snippet containing `{date}` and `{time}`, create a history item, exit cleanly, relaunch the published artifact, and confirm all three reload. Delete the test records afterward through Spreek's own UI.

- [ ] **Step 8: Run final requirement audit**

Map every numbered success criterion in `E:\MData\Kennis\personal\inbox\2026-09-02-spreek-desktop-design.md` to command output, persisted data, or native UI evidence. Any missing or indirect item remains incomplete and must be fixed before the goal is marked complete.

## Plan self-review

- Spec coverage: all ten success criteria map to Tasks 2 through 10.
- Scope: one integrated executable; offline STT and semantic rewriting remain excluded as approved.
- Type consistency: the state, transcript, settings, URI, coordinator, and UI contracts use the same names throughout.
- Dependency check: NAudio is the sole non-test runtime package; ProtectedData is added only if required by the compiler.
- Security check: secrets never enter URLs, logs, settings JSON, diagnostics output, or plan commands.
- Repository check: checkpoint commands do not commit or modify unrelated existing work.
