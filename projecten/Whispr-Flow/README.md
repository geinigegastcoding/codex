# Insidey Speak

Insidey Speak is a Windows voice-flow app inspired by the supplied Voca workspace: record from anywhere, stream interim words to Deepgram Nova-3, clean the result, and paste it back into the app that was active when dictation started. If live streaming is unavailable, the same recording is sent through Deepgram's reliable file transcription path.

## Run locally

Set the key for the current PowerShell session, then launch the WPF app:

```powershell
$env:DEEPGRAM_API_KEY = "your-key"
dotnet run --project .\InsideySpeak.csproj
```

The global shortcuts are:

- `Ctrl + Shift + Space` starts/stops normal dictation.
- `Ctrl + Shift + N` starts a quick-note dictation. Quick notes export to `Documents\Insidey Speak Notes` and are never pasted into another app.
- `Ctrl + Shift + V` pastes the newest saved non-empty transcript.
- `Escape` cancels the active recording or transcription.

The right panel also includes mouse-driven dictation, filler filtering, spoken punctuation, optional trailing “press enter,” protected local API-key save, dictionary CSV import, snippets, JSON snippet import, retryable failed recordings, replayable local audio, a microphone selector, a language selector, and “Start with Windows.” Closing the window hides it to the system tray; the tray menu can reopen or exit it. Recent transcripts and recordings persist in `%LOCALAPPDATA%\InsideySpeak`.

Dictionary entries are one per line. A plain line is sent to Deepgram as a keyterm; a line such as `spoken phrase => Preferred Phrase` is sent as a Deepgram replacement and applied locally as a fallback. Snippets use `name => text`; saying the trigger expands the saved text during dictation, and `{date}`/`{time}` are supported.

## Build a portable Windows app

```powershell
dotnet publish .\InsideySpeak.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o .\publish
```

The executable is `publish\InsideySpeak.exe`. User settings live outside the repository in `%LOCALAPPDATA%\InsideySpeak\settings.json`; the saved API key is protected with Windows user-level encryption.

## Checks

```powershell
dotnet run --project .\tests\Spreek.Tests.csproj
```

The check executable verifies filler filtering, replacements, keyterm parsing, snippets, trailing Enter commands, CSV/JSON imports, live microphone capture, Deepgram file transcription, and (when `INSIDEY_TEST_STREAM=1`) the live WebSocket path.
