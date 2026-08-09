# Script

## Editorial note

This is a release explainer recorded as of 2026-08-03. It distinguishes QwenCloud's documented model capabilities from vendor positioning and from independent evidence that is not available yet.

## Voice direction

Use the bracketed Fish Audio markers in `script.json`. Keep the hook energetic, the architecture explanation calm, the test instructions precise, and the verdict direct. Bracketed markers are removed from captions during the caption build.

## Visual direction

Use original light evidence surfaces, dark ink, indigo accents, green source labels, and no copied channel identity. Each scene has one primary message and one supporting visual.

## Rerun production notes

- Fish Audio is requested in MP3 chunks no longer than 10 seconds, then stitched per scene.
- Bracketed delivery markers are sent to Fish Audio; subtitles are intentionally disabled.
- Timestamp streaming is disabled for this no-subtitles export so each MP3 chunk remains a complete Fish response; timestamps are only needed for caption alignment.
