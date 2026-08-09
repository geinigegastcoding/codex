# Practical AI YouTube production system

Local-first research, narration, captioning, QA, and Remotion rendering for original English practical-AI explainers.

## Boundaries

- Reference-channel frames are private research evidence only. Never publish them.
- Use observed mechanisms, not another channel's wording, graphics, identity, or footage.
- Never claim a test, benchmark, cost saving, or product result that was not reproduced.
- Never place Fish Audio credentials in source, props, reports, logs, or Git.
- Third-party voice cloning is blocked unless `.env.local` sets `VOICE_PERMISSION_CONFIRMED=true` and [docs/voice-permission.md](docs/voice-permission.md) contains a completed written-permission record.

## Setup

```console
npm install
copy .env.example .env.local
```

Keep `FISH_API_KEY` and `FISH_REFERENCE_ID` only in `.env.local`. Without credentials or a reference ID, the voice command creates deterministic silent WAV files so the local pipeline can be tested without API usage.

## Core commands

```console
npm run research:channels -- --dry-run
npm run research:gallery
npm run video:new -- --slug my-video --template technical-concept
npm run video:validate -- --slug my-video
npm run voice:generate -- --slug my-video
npm run voice:regenerate -- --slug my-video --scene hook
npm run captions:build -- --slug my-video
npm run storyboard:build -- --slug my-video
npm run voice:stitch -- --slug my-video
npm run qa -- --slug my-video
npm run render -- --slug my-video
npm run package -- --slug my-video
npm run pipeline -- --slug my-video
```

Use `--force` with the pipeline to rerun completed stages and `--skip-render` to stop before the final render. Stage state is stored in each video's `.pipeline-state.json`.

## Verification

```console
npm run typecheck
npm test
npm run video:validate -- --slug ai-privacy-switch
npm run smoke:still
npm run smoke:render
```

Open Remotion Studio with:

```console
npm run studio
```

## Main locations

- `research/analysis/gallery.html` — private evidence gallery
- `research/analysis/*-analysis.md` — evidence-backed channel analyses
- `docs/` — strategy, editorial, production, QA, audio, and policy guidance
- `content/videos/ai-privacy-switch/` — original 75-second example
- `content/videos/full-length-template/` — complete six-minute production template
- `src/remotion/` — reusable composition system
- `scripts/` — research and production CLI

Start with [docs/production-runbook.md](docs/production-runbook.md) and [docs/youtube-policy-checklist.md](docs/youtube-policy-checklist.md).
