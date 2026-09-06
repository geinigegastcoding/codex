---
title: Spreek native desktop dictation app design
created: 2026-09-02
updated: 2026-09-02
type: design
tags: [personal, project, windows, dictation, deepgram]
sources: [conversation-2026-09-02, deepgram-docs, wispr-flow-docs, user-feedback-research]
status: approved-design
---

# Spreek native desktop dictation app design

## Goal

Build **Spreek**, a native Windows desktop dictation app for Daniel that provides the important daily workflow of Wispr Flow without a subscription or browser-based interface. Spreek uses Daniel's own Deepgram API key with Nova-3, works in normal Windows applications, preserves every usable dictation locally, and remains recoverable when transcription or insertion fails.

The application itself is free and local-first. Deepgram usage is governed by Daniel's Deepgram account, credits, and current API pricing.

## Success criteria

The design is complete when the implementation can prove all of the following on Daniel's Windows 11 machine:

1. A self-contained `Spreek.exe` starts as a normal desktop application and can remain available from the system tray.
2. Holding the configured global push-to-talk shortcut records speech and releasing it produces a Nova-3 transcript in the application that had focus when dictation began.
3. Hands-free dictation, cancel, and paste-last shortcuts work outside Spreek.
4. A native, non-activating floating bar clearly shows connecting, listening, processing, success, and recoverable-error states without stealing focus.
5. Dutch, English, and mixed Dutch/English speech are transcribed without intentional translation.
6. Dictionary terms influence Nova-3 recognition; local correction rules and snippets transform completed transcripts deterministically.
7. Transcripts survive application restarts and can be searched, copied, edited, repasted, exported, or deleted.
8. Failed network or Deepgram sessions preserve their WAV recording and can be retried.
9. The API key is protected with Windows user-scoped encryption and never appears in settings files or logs.
10. Automated checks pass, a real Nova-3 integration check succeeds, the microphone can be recorded, and insertion is verified in a native Windows text editor.

## Chosen approach

Use C# with .NET 8 and WPF.

WPF provides a real Windows executable, native windows, transparent overlays, accessibility support, and direct access to Windows keyboard, focus, clipboard, and encryption APIs. It avoids a browser/WebView renderer. The build will be published self-contained for `win-x64`, so using Spreek will not require a separately installed SDK or runtime.

The only planned runtime library is NAudio for dependable microphone capture and WAV writing. Deepgram communication, persistence, networking, encryption, hotkeys, and text insertion use .NET and Windows APIs directly.

Rejected alternatives:

- Python/Tkinter would reduce initial code but makes global hooks, packaging, visual polish, and antivirus behavior less dependable.
- Electron would reuse familiar TypeScript tooling but is substantially larger and uses a browser renderer, contrary to the request.
- WinUI 3 is modern but adds Windows App SDK deployment complexity without improving the core dictation workflow.

## Product scope

### Included

- First-run Deepgram and microphone setup
- Push-to-talk and hands-free recording
- Customizable global shortcuts
- Nova-3 live streaming and final transcription
- Dutch, English, and multilingual modes
- Floating Flow Bar with live audio level and interim text
- Dictionary terms and explicit misspelling corrections
- Static snippets plus `{date}` and `{time}` variables
- Local transcript history and usage totals
- Reliable paste, paste-last, and manual-copy recovery
- Retained recovery audio and one-click transcription retry
- Optional quick-note export to a configured Markdown inbox
- System tray operation and launch-at-login setting
- Privacy controls and clear local-data deletion

### Deliberately excluded from version 1

- Offline Whisper transcription. Failed audio is retained and retried instead; an offline model can be added behind the transcription boundary later.
- Semantic rewriting, tone changes, summaries, or open-ended command mode. A speech-to-text API cannot safely provide those features, and the requested setup supplies no separate language-model provider.
- Screen capture, surrounding-text capture, clipboard ingestion, or keystroke-content logging.
- Mobile support, accounts, cloud synchronization, team libraries, and analytics collection.

## Research-informed improvements

The added features address current complaints and limitations found during research rather than cloning every surface feature:

- **No lost dictations:** each session is written to a local WAV while streaming. Network, API, or insertion failures leave a visible retryable record.
- **No missing final words:** recording shutdown sends Deepgram's `Finalize` control message, consumes remaining final results, then closes the stream.
- **Bilingual preservation:** Nova-3 uses `language=multi` for Daniel's Dutch/English workflow, with explicit single-language modes available. No post-processing model translates or paraphrases the result.
- **Privacy by default:** the EU Deepgram endpoint and `mip_opt_out=true` are defaults. Spreek never takes screenshots and stores history only on the machine.
- **Terminal recovery:** insertion has ordinary paste, terminal paste, and Unicode typing strategies. Regardless of insertion outcome, the transcript remains available through paste-last and history.
- **Useful bulk setup:** dictionary CSV and snippet JSON imports are included without a paid feature gate.
- **Dynamic snippets:** `{date}` and `{time}` cover a documented limitation of static-only Wispr snippets without adding a templating system.
- **Cost visibility:** history records billable audio duration and the dashboard shows usage totals plus a clearly labelled estimate based on configurable per-minute rates.

Research references:

- Deepgram Nova-3 multilingual: https://developers.deepgram.com/docs/multilingual-code-switching
- Deepgram keyterm prompting: https://developers.deepgram.com/docs/keyterm
- Deepgram finalization: https://developers.deepgram.com/docs/finalize
- Deepgram EU endpoints and privacy: https://developers.deepgram.com/reference/custom-endpoints
- Deepgram model-improvement opt-out: https://developers.deepgram.com/docs/the-deepgram-model-improvement-partnership-program
- Wispr Flow dictionary behavior: https://docs.wisprflow.ai/articles/4052411709-teach-flow-your-words-with-the-dictionary
- Wispr Flow snippets and static-variable limitation: https://docs.wisprflow.ai/articles/5784437944-create-and-use-snippets
- Wispr Flow hands-free behavior: https://docs.wisprflow.ai/articles/6391241694-use-flow-hands-free
- Windows terminal insertion failure example: https://github.com/anomalyco/opencode/issues/34499
- Reliability and missing-final-word reports: https://www.reddit.com/r/WisprFlow/comments/1u2i04b/june_10_2026_updates_reliability_and_localization/

## Application structure

Spreek is one process with four clear internal boundaries:

1. **Desktop shell** owns the WPF main window, system tray icon, floating bar, and application lifetime.
2. **Dictation coordinator** owns the recording state machine and is the only component allowed to start, stop, cancel, retry, or insert a dictation.
3. **Platform services** own microphone capture, Deepgram transport, global keyboard input, focused-window tracking, clipboard/text insertion, Windows encryption, and launch-at-login.
4. **Local store** owns settings, dictionary, snippets, history, recovery audio, and Markdown export.

The state machine is explicit:

`Idle -> Connecting -> Listening -> Finalizing -> Processing -> Inserting -> Idle`

Any operational failure moves to `RecoverableError` when audio or text exists, or `FatalError` when setup must be corrected. Cancel returns directly to `Idle` and deletes that session's temporary recording.

Only the coordinator changes state. UI controls and global shortcuts submit commands to it, preventing two recordings or overlapping WebSocket sends.

## Dictation data flow

1. On shortcut press, Spreek records the foreground window handle and verifies that an API key and microphone are available.
2. It opens an authenticated WebSocket to the configured Deepgram region using `model=nova-3`, the selected language, smart formatting, punctuation, interim results, numerals, endpointing, and selected dictionary keyterms.
3. The floating bar shows `Connecting`. The microphone starts only after the connection is ready, and a cue plus `Listening` state tells Daniel when speech can safely begin. This avoids silently dropping opening words.
4. NAudio supplies 16 kHz, mono, 16-bit PCM frames. A single ordered sender writes them to Deepgram while the same bytes are written to a temporary WAV file.
5. The receiver displays interim text but commits only unique `is_final=true` results. Final segments are ordered by their audio start time to prevent duplication.
6. On release or hands-free stop, microphone capture ends, queued audio drains, `Finalize` is sent, and remaining final results are consumed before `CloseStream`.
7. The completed text is processed in this order: dictionary corrections, snippet expansion, whitespace normalization, then the optional trailing `press enter` command.
8. History is durably appended before insertion is attempted.
9. Spreek restores the captured target window and inserts the text. It leaves the final transcript on the clipboard so paste-last remains reliable.
10. Successful sessions delete their WAV unless audio retention is enabled. Failed transcription sessions retain the WAV and receive `Needs retry` status.

## Deepgram configuration

Defaults:

- Endpoint: `wss://api.eu.deepgram.com/v1/listen`
- Model: `nova-3`
- Language: `multi`
- Encoding: `linear16`
- Sample rate: `16000`
- Channels: `1`
- `smart_format=true`
- `punctuate=true`
- `interim_results=true`
- `endpointing=300`
- `numerals=true`
- `mip_opt_out=true`

The dictionary contributes starred terms first, then the most recently used terms, while remaining below Deepgram's 500-token keyterm limit. If entries must be omitted, the UI reports the count; it never silently drops them. Corrections remain local and are not placed in the API URL.

The API key can be supplied in Settings or through `DEEPGRAM_API_KEY` for diagnostics. Environment-provided secrets are used only for that process and are not automatically persisted.

## Native interface

### Floating bar

The bar is a borderless, topmost WPF tool window centered just above the taskbar. It does not take keyboard focus. Its compact idle form expands during a session.

It shows:

- Idle: microphone mark and shortcut hint
- Connecting: progress indicator and `Connecting`
- Listening: animated level bars, elapsed time, and a short interim-transcript preview
- Processing: locked controls and `Finishing transcript`
- Success: brief confirmation
- Recoverable error: concise reason plus `Retry` or `Copy`

During hands-free recording it exposes Stop and Cancel buttons. Escape cancels from either recording mode. The overlay never displays an API key or hidden application content.

### Main window

The main native window contains five pages:

- **Home:** setup health, primary record button, recent transcript, today's minutes, and shortcut reminders.
- **History:** search, status filters, edit, copy, repaste, retry, Markdown/text export, and delete.
- **Dictionary:** search, add/edit/delete/star, explicit heard-as correction, and CSV import/export.
- **Snippets:** search, add/edit/delete, JSON import/export, trigger preview, and supported variables.
- **Settings:** protected API-key entry/test, endpoint region, language, microphone, hotkeys, insertion strategy, privacy, audio retention, quick-note folder, usage-rate estimate, startup, and local-data controls.

The visual style is compact and intentional: dark neutral surfaces, one blue accent, readable typography, restrained motion, keyboard navigation, visible focus, and no decorative dashboard clutter.

## Global shortcuts and insertion

Defaults:

- Push to talk: hold `Ctrl+Win`
- Hands free: `Ctrl+Win+Space`
- Paste last transcript: `Shift+Alt+Z`
- Quick note: `Ctrl+Win+N`
- Cancel active session: `Escape`

A low-level Windows keyboard hook is required for press-and-release push-to-talk. It suppresses only a recognized complete shortcut and otherwise passes input through unchanged. Shortcut registration conflicts produce a visible settings error.

Insertion captures the target before the overlay changes. `Auto` uses normal `Ctrl+V` for standard applications and terminal paste for recognized console/terminal windows. Settings also expose forced `Ctrl+V`, `Ctrl+Shift+V`, and Unicode typing. Spreek cannot prove every third-party control accepted synthetic input, so history is marked `Copied` after dispatch and the success state tells the user that paste-last is available.

Spreek checks the focused UI Automation element when possible and refuses automatic insertion into password fields. If detection is unavailable, it does not inspect surrounding content.

## Dictionary and snippets

A dictionary entry contains the desired term, an optional misheard form, starred state, and timestamps. Terms are unique case-insensitively. Local corrections use case-insensitive whole-phrase matching, longest phrase first, and preserve the dictionary entry's chosen output casing.

CSV import accepts either:

- one column: `term`
- two columns: `heard_as,term`

Invalid, duplicate, empty, oversized, or over-column rows are reported with row numbers. Valid rows are not discarded because other rows failed.

A snippet contains a unique spoken trigger and expansion of at most 4,000 characters. Matching is case-insensitive, whole-phrase, and longest-trigger first. `{date}` expands to the local ISO date and `{time}` to local 24-hour time. Unknown variables remain visible and produce a warning instead of disappearing.

JSON import accepts an array of `{ "name": "trigger", "text": "expansion" }` objects. Dictionary terms and snippet triggers cannot share the same phrase, preventing unpredictable transformations.

## Persistence and privacy

Runtime data lives under `%LOCALAPPDATA%\Spreek`:

- `settings.json` contains non-secret preferences.
- `secret.dat` contains the API key encrypted through Windows DPAPI for the current user.
- `dictionary.json` and `snippets.json` contain their respective libraries.
- `history.jsonl` is append-only transcript history.
- `recordings\` contains only retained or retryable WAV files.
- `logs\` contains bounded diagnostic logs with authorization data redacted.

Settings, dictionary, and snippet writes use a temporary file followed by atomic replacement. History is appended and flushed before insertion. Corrupt records are surfaced with their line number while valid history remains available.

Transcript history and retained WAV files are local but not separately encrypted; they rely on the Windows user profile's access controls. The Settings page can clear history and recordings independently after explicit confirmation.

Quick-note export is disabled until a directory is selected. On this computer, setup may offer `E:\MData\Kennis\personal\inbox` when it exists. A quick note uses a timestamped Markdown filename and records its source transcript ID so repeated export cannot silently create duplicates.

## Failure handling

- Missing or rejected API key: recording does not begin; the bar links to API-key setup.
- Missing microphone or denied access: recording does not begin; the selected device remains unchanged and the error names it.
- Network failure before speech: return to idle without a history entry.
- Failure after audio capture: finalize the WAV, append a `Needs retry` history entry, and expose retry.
- Deepgram timeout or malformed response: retain audio and request ID where available; never present an interim result as final.
- Empty speech result: retain no normal history row, show `No speech detected`, and keep audio only when diagnostics retention is enabled.
- Transformation warning: insert the safe untransformed portion, retain the original transcript, and show the warning in history.
- Insertion failure or uncertain insertion: keep text on the clipboard and expose paste-last; transcription is never deleted.
- Storage failure: do not attempt insertion until the transcript has been safely retained somewhere; show the exact failing path and leave text on the clipboard as emergency recovery.

## Verification plan

### Automated checks

- State machine rejects overlapping start/stop/retry commands.
- Transcript assembly ignores interim text, orders final segments, and prevents duplicate final segments.
- Finalization waits for queued audio and accepts the last final result.
- Dictionary correction uses whole phrases, longest-first ordering, and exact output casing.
- Snippets expand deterministically, support date/time, and warn on unknown variables.
- CSV/JSON imports report invalid rows without losing valid rows.
- Persistence survives restart and surfaces corrupt JSONL lines.
- API URLs contain Nova-3, selected language, encoded keyterms, EU host, and privacy parameters but never appear in logs with authorization.
- DPAPI round-trip works only in the current Windows user context.
- Usage duration and cost estimates are deterministic and labelled estimates.

### Live checks on this machine

1. Build Debug and Release configurations.
2. Run a generated speech WAV through a real authenticated Nova-3 streaming session and verify expected words plus final-segment handling.
3. Record from the selected physical microphone and verify a non-empty, valid PCM WAV.
4. Launch Spreek, exercise idle/listening/processing/error bar states, and inspect the actual WPF windows rather than a browser representation.
5. Dictate into Notepad using push-to-talk and hands-free modes.
6. Verify paste-last after changing focus and verify the terminal insertion strategy in Windows Terminal or the available terminal host.
7. Add a distinctive dictionary term and confirm it is sent as a keyterm and retained after restart.
8. Add a snippet with date/time variables and confirm expansion.
9. Force a network failure, confirm retained audio and `Needs retry`, restore connectivity, and retry successfully.
10. Restart Spreek and verify history, settings, dictionary, snippets, and usage totals.
11. Publish a self-contained `win-x64` executable and launch that published artifact on this machine.

Any live check requiring Daniel to speak is supplemented by automated microphone capture and synthetic-speech integration evidence; it is not reported as user-voice accuracy evidence unless Daniel actually performs it.

## Delivery

Source code lives in `E:\MData\projecten\Whispr-Flow`. The usable build is published under that project's `release` directory with a short non-Markdown launcher if required. Documentation remains in the governed Kennis vault.

No commit is created automatically because this workspace's repository rules require Daniel to request commits explicitly.

## Approval record

Daniel approved the proposed native WPF design on 2026-09-02. This written specification makes the earlier design concrete without expanding it into offline transcription, semantic rewriting, or browser UI.
