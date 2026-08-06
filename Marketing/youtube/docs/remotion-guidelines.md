# Remotion engineering guidelines

- Render at 1920×1080, 30 fps by default; central schemas allow other dimensions and FPS.
- Derive duration from `storyboard.json`, which is rebuilt from narration durations when available.
- Validate composition props with Zod.
- Use `useCurrentFrame()`, `interpolate()`, `Sequence` and explicit timing. No CSS transitions, CSS keyframes or wall-clock state.
- Keep render assets local under `public/` and reference them with `staticFile()`.
- Do not fetch during render.
- Fail explicitly on missing scene or asset references.
- Keep data in `script.json`, `storyboard.json` and `captions.json`; presentation stays in components.
- Use deterministic decoration only. If randomness is ever needed, introduce a seeded generator.
- Avoid expensive per-frame parsing and network work.
- Keep scenes editable as named `Sequence` entries in Studio.
- Use `calculateMetadata()` for dynamic duration, dimensions, output name and codec.
- Run `npm run smoke:still` before a full render.

## Included components

`BrowserFrame`, `CodeBlock`, `KineticText`, `CaptionLayer`, `Diagram`, `Comparison`, `ScreenRecording`, `SourceLabel` and `ProgressBar`.
