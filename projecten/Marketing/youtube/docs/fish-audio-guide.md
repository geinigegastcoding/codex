# Fish Audio narration guide

## Official contract checked 3 August 2026

The implementation uses server-side `POST https://api.fish.audio/v1/tts` or timestamped SSE at `/v1/tts/stream/with-timestamp`. Required headers are `Authorization: Bearer â€¦`, `Content-Type: application/json`, and `model`. Current model options include `s1`, `s2-pro`, `s2.1-pro`, and `s2.1-pro-free`. Final quality defaults to `s2.1-pro`; the free variant is suitable for testing without production guarantees.

## Setup

Copy `.env.example` to `.env.local` and set:

```text
FISH_API_KEY=
FISH_REFERENCE_ID=
VOICE_PERMISSION_CONFIRMED=false
```

Never commit `.env.local`. Keys are not passed into Remotion props, browser code, reports or logs.

## Permission gate

Any configured `reference_id` is treated as cloned-voice use. Synthesis refuses to run unless `VOICE_PERMISSION_CONFIRMED=true` and `docs/voice-permission.md` documents explicit written permission. This is an operational guardrail, not legal advice.

## Generation

```powershell
npm run voice:generate -- --slug <slug>
npm run voice:regenerate -- --slug <slug> --scene <scene-id>
npm run voice:stitch -- --slug <slug>
npm run captions:build -- --slug <slug>
```

Each scene is hashed from normalized text, reference ID, model, prosody, temperature, top-p, output format and pipeline version. Cached audio lives in `.cache/voice/`. Unchanged lines are copied from cache.

Timestamp SSE chunks are ordered by `chunk_seq`; replacement alignments for the same sequence win; `chunk_audio_offset_sec` is added to segment time. If alignment is unavailable, captions are estimated from the script and marked uncertain rather than presented as precise ASR.

## Audio defaults

48 kHz mono scene audio, 280 ms configurable pauses, integrated loudness target around -16 LUFS, true-peak target -1.5 dB, conservative limiting, WAV master plus 192 kbps AAC derivative. Background music is optional and not bundled.

Without credentials, the pipeline creates documented silent fallback WAV files so Studio and render validation work without API spend.

## Chunking and delivery

For the Qwen3.8 rerun, Fish requests are capped at 10 seconds. The pipeline splits narration into small word-safe chunks, measures every response, fails if a chunk exceeds the cap, caches each chunk as MP3, and stitches chunks back into each scene. The production config records chunkSeconds: 10 and format: mp3. Subtitles are intentionally disabled for this export.
For exports without subtitles, prefer the complete TTS response endpoint instead of timestamp streaming; this avoids concatenating encoded MP3 fragments.
