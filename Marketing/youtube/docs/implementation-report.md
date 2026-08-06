# Implementation report

Date: 2026-08-03

## Created

A local-first practical-AI YouTube research and production system was created under `Marketing/youtube/`.

### Research

- `research/channel-sources.json` — supplied URLs, resolved identities, confidence, and 10 selected URLs per channel.
- `research/channels/devsplainer/` — metadata, captions, normalized transcripts, 10 frame manifests, and 10 contact sheets.
- `research/channels/kaiexplains/` — metadata, captions, normalized transcripts, 10 frame manifests, and 10 contact sheets.
- `research/analysis/gallery.html` — private evidence gallery containing 571 sampled frames.
- `research/analysis/evidence.csv` — 48 well-formed transcript, pacing, and visual evidence rows.
- `research/analysis/devsplainer-analysis.md` — observation/inference/unknown-separated analysis.
- `research/analysis/kaiexplains-analysis.md` — observation/inference/unknown-separated analysis.
- `research/analysis/comparison.md` — original synthesis and copying boundary.
- `research/analysis/pattern-dataset.json` — normalized analysis dataset.

### Strategy and operations

- `docs/channel-blueprint.md`
- `docs/content-pillars.md`
- `docs/script-style-guide.md`
- `docs/visual-style-guide.md`
- `docs/remotion-guidelines.md`
- `docs/fish-audio-guide.md`
- `docs/production-runbook.md`
- `docs/qa-checklist.md`
- `docs/youtube-policy-checklist.md`
- `docs/voice-permission.md`

### Production implementation

- `scripts/cli.ts` — command entry point.
- `scripts/research/` — channel collection, transcript normalization, frame extraction, and gallery generation.
- `scripts/voice/fish.ts` — Fish Audio generation, retries, cache, timestamp parsing, permission gate, silent fallback, and audio stitching.
- `scripts/captions/build.ts` — phrase-level caption generation with uncertain estimated timing when alignment is unavailable.
- `scripts/video/video.ts` — video creation, validation, storyboard generation, public sync, packaging, and unused-asset checks.
- `scripts/qa/qa.ts` — automated structural, editorial, asset, secret, audio, and still-render checks.
- `src/pipeline/schemas.ts` — Zod contracts.
- `src/remotion/` — reusable 1920×1080 composition, components, theme, sample props, dynamic metadata, local assets, captions, source labels, and progress.
- `tests/transcripts.test.ts` and `tests/schemas.test.ts` — intent-focused transcript and deterministic-asset tests.

### Samples

- `content/videos/ai-privacy-switch/` — complete original 75-second example with an original illustrative UI asset.
- `content/videos/full-length-template/` — complete six-minute production template with explicit TODOs rather than fabricated results.

## Verification completed

The following commands completed successfully:

```console
node Marketing/youtube/scripts/research/materialize-research.mjs
node Marketing/youtube/scripts/research/build-gallery.mjs
node --check Marketing/youtube/scripts/research/materialize-research.mjs
node --check Marketing/youtube/scripts/research/extract-frames.mjs
node --check Marketing/youtube/scripts/research/finalize-partial-frames.mjs
node --check Marketing/youtube/scripts/research/build-gallery.mjs
git diff --check -- Marketing/youtube
```

Additional deterministic checks completed successfully:

- Both sample folders contain parseable required JSON.
- Storyboard scene references and total durations are internally consistent.
- Referenced local sample assets exist.
- The research set contains 20 video records and 571 frame records.
- `evidence.csv` contains 48 well-formed evidence rows.
- No Fish API key or bearer-token pattern was found in project text files.
- No reference-channel YouTube URL was found in final sample content.

Research collection also successfully used `yt-dlp` and `ffmpeg` to collect metadata/captions and produce the frame/contact-sheet evidence now present in the project.

## Incomplete verification and reasons

Dependency installation was attempted with:

```console
npm --prefix "Marketing/youtube" install
```

The environment denied it because downloading and executing newly declared npm dependencies requires explicit user approval. Therefore these commands have **not** been run and no success is claimed:

- `npm run typecheck`
- `npm test`
- `npm run video:validate -- --slug ai-privacy-switch`
- `npm run voice:generate -- --slug ai-privacy-switch`
- `npm run voice:stitch -- --slug ai-privacy-switch`
- `npm run captions:build -- --slug ai-privacy-switch`
- `npm run storyboard:build -- --slug ai-privacy-switch`
- `npm run qa -- --slug ai-privacy-switch`
- `npm run smoke:still`
- `npm run smoke:render`
- `npm run studio`
- final Remotion render and package commands.

Consequently, TypeScript compilation, Vitest, CLI execution, generated silent narration, automated QA, Studio startup, and rendered-image/video inspection remain unverified.

## Known limitations

1. The requested Devsplainer handle returned HTTP 404. Exact-name YouTube search resolved `Devsplainers`, channel ID `UCf4sXk66VuWGlg4Nh0tuCdA`. This remains a likely inference, not a confirmed identity match.
2. Two Kai videos (`HPAh1uiE2z0` and `mtk8p8czzDU`) have dense opening and fixed-interval frames plus contact sheets, but no regenerated scene-change-only frames after transient YouTube 403 responses. This is recorded in `research/analysis/frame-extraction-warnings.json`.
3. When Fish timestamp alignment is unavailable, captions currently use proportional script timing marked uncertain. A true timestamped ASR fallback is not implemented.
4. Source labels are structurally placed above the caption zone, but automatic DOM-level collision/overflow detection still requires render verification.
5. Fish Audio was not called because no approved credentials/reference were configured. No API credits were used.

## Required environment variables

Copy `.env.example` to `.env.local` and configure only what is authorized:

```text
FISH_API_KEY=
FISH_REFERENCE_ID=
VOICE_PERMISSION_CONFIRMED=false
FISH_TTS_MODEL=s2.1-pro
FISH_OUTPUT_FORMAT=wav
```

A third-party reference voice remains blocked unless `VOICE_PERMISSION_CONFIRMED=true` and `docs/voice-permission.md` marks permission as confirmed with the voice owner, date, and evidence location completed.

## Next command

```console
npm --prefix "Marketing/youtube" install
```
