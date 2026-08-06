# Production runbook

## 1. Install

From PowerShell:

```powershell
cd E:\MData\Marketing\youtube
npm install
```

Cross-platform scripts are the same after entering the project directory.

Install external tools:

```powershell
winget install Gyan.FFmpeg
winget install yt-dlp.yt-dlp
ffmpeg -version
yt-dlp --version
```

## 2. Resolve and analyze channels

```powershell
npm run research:channels
npm run research:channels -- --with-frames
npm run research:gallery
```

Review `research/channel-sources.json`, both `videos.json` files, `research/analysis/evidence.csv`, contact sheets and `gallery.html`. Reference media is private research only.

## 3. Create a video

```powershell
npm run video:new -- --slug my-video --template technical-concept
```

Templates: `tool-review`, `ai-news`, `technical-concept`, `workflow-build`, `model-comparison`.

## 4. Research claims

Fill `brief.md` and `sources.md`. Prefer primary documentation, papers, repositories and first-party announcements. Record the exact supported claim. Do not write narration around an unverified headline.

## 5. Script and storyboard

Edit `script.md` and `script.json`, then:

```powershell
npm run video:validate -- --slug my-video
npm run storyboard:build -- --slug my-video
```

Every scene needs a visual purpose. Put local assets in `assets/` and screen recordings there or in `public/videos/<slug>/assets/` after validation/sync.

## 6. Configure Fish Audio

```powershell
Copy-Item .env.example .env.local
```

Fill the key/reference locally. Complete `docs/voice-permission.md` before enabling a third-party voice clone.

## 7. Generate narration and captions

```powershell
npm run voice:generate -- --slug my-video
npm run voice:regenerate -- --slug my-video --scene scene-id
npm run voice:stitch -- --slug my-video
npm run captions:build -- --slug my-video
npm run storyboard:build -- --slug my-video
```

No credentials produces silent fallback audio without API cost.

## 8. Preview

```powershell
npm run studio
npm run smoke:still
```

Review opening, captions, UI/code collisions, source labels and pacing.

## 9. QA and render

```powershell
npm run qa -- --slug my-video
npm run render -- --slug my-video --scale 0.5 --frames 0-899
npm run render -- --slug my-video
```

The full render is H.264 with AAC audio. Run the limited preview first.

## 10. Package

```powershell
npm run package -- --slug my-video
```

Review title, description, chapters, sources, thumbnail brief and AI disclosure decision in `renders/package/`.

## 11. Resumable full pipeline

```powershell
npm run pipeline -- --slug my-video
npm run pipeline -- --slug my-video --dry-run
npm run pipeline -- --slug my-video --force
```

Completed stages are stored in `.pipeline-state.json` and skipped unless `--force` is supplied.

## 12. Upload and archive

Before upload, answer the policy checklist, record asset rights, decide YouTube altered-content disclosure, and confirm the voice owner is not implied to endorse the channel. Archive the complete content folder, source list, manifests and final render; exclude `.env.local`, cache and temporary reference video.
