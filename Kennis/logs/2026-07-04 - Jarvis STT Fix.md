# 2026-07-04 - Jarvis STT Fix

- **Session ID**: c75cdca9-56cb-4692-8c26-a732e7ba7d06

## Summary
Resolved persistent browser-based network errors in Jarvis STT by migrating from `webkitSpeechRecognition` to a server-side Python script using `speech_recognition` (Google API) and `sounddevice`.

## Files Changed
- `C:\Users\Daniël\Desktop\Codex\Jarvis\public\app.js` (modified)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\public\index.html` (modified)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\server.js` (modified)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\stt.py` (created)
- `C:\Users\Daniël\Desktop\Codex\.agents\skills\voice-assistant\SKILL.md` (modified)

## Key Decisions & Assumptions
- Abandoned browser `webkitSpeechRecognition` due to reliability and network issues.
- Skipped local Whisper model installation to avoid high system requirements; bypassed UWP `Windows.Media.SpeechRecognition` due to PowerShell WinRT interop failures.
- Settled on a free, high-quality, keyless STT pipeline via Python `speech_recognition` package querying Google Web Speech API.
- Implemented basic RMS-based VAD (Voice Activity Detection) in Python to properly start/stop recording.

## Next Steps
- Consider replacing Google API with a free Groq API key in the Python script if transcription latency proves too slow for conversational pace.

## Related Notes
- [[voice-assistant]]
