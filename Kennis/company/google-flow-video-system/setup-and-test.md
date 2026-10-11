---
title: Google Flow video system - local setup and six-second test
created: 2026-10-10
type: implementation-record
status: test-in-progress
tags: [google-flow, facefusion, video, local-first]
---

# Local setup and test

Daniel approved creating `E:\MData\projecten\Google-Flow-Video-System`, submitting the source clip and both supplied character portraits to Google Flow, and accepting its upload-rights notice. He subsequently authorized one Flow test for up to 20 existing credits. The reusable workflow keeps Generate manual; this permission applies to the current test.

## Installed and implemented

- Node CLI: `workflow.mjs` prepares the requested interval, preserves character files, extracts original audio and review frames, and exports a generated result with the original soundtrack.
- Optional local face-only route: FaceFusion 3.9.1, pinned to commit `72470819a0373be3388b3929c8f8f311f418fc3c`, with a project-local Python 3.12 environment and CPU ONNX Runtime. The stock repository and content checks remain unchanged.
- `setup.ps1` installs that environment from the official FaceFusion repository and PyPI requirements. Existing Git, Node, uv and FFmpeg installations are reused. FaceFusion models download and verify on first use; this test downloaded about 1.4 GiB of model assets.
- Four media integration tests verify the selected time interval, reference preservation, prevention of overwrites, restored source audio, rejection of short results, and rejection of malformed images.

No Seedance, Replicate or paid hosted motion-transfer dependency is configured. The RTX 5060 has about 8 GiB VRAM; this installed route runs on CPU. Wan Animate and GPU inference were not installed or benchmarked.

## Commands

Run from the project folder in PowerShell:

```powershell
.\setup.ps1
node --test workflow.test.mjs
node workflow.mjs prepare --source 'E:\kon kin King Kong kink.mp4' --start 21 --duration 6 --character-1 'C:\Users\daniel\AppData\Local\Temp\codex-clipboard-c3b3dc12-dd12-4309-a0a0-2487af74d60f.png' --character-2 'C:\Users\daniel\AppData\Local\Temp\codex-clipboard-2d32c301-44fb-4e1e-902c-2901088093c6.png' --out 'jobs\NEW-TEST'
node workflow.mjs local --job 'jobs\NEW-TEST'
```

For a Flow result, prepare a fresh job and use its video and portraits as ingredients. Copy the prompt, verify the live model/settings and credit quote, generate within the approved limit, then download the video:

```powershell
node workflow.mjs finish --job 'jobs\NEW-FLOW-TEST' --video 'C:\path\to\downloaded-video.mp4'
```

Use a fresh job for each take; existing outputs are preserved. `finish` restores the original audio and validates the final duration and decoding. It does not guarantee that generated mouth movement matches that soundtrack.

## Test inputs and checks

Source: `E:\kon kin King Kong kink.mp4`; requested interval 21.000 to 27.000 seconds. The prepared clip is exactly six seconds: 144 frames at 24 fps, 1920 x 864, with stereo audio. Character mapping: first portrait to the left keyboard player; second portrait to the right expressive performer.

Test folder: `E:\MData\projecten\Google-Flow-Video-System\jobs\20261010-king-kong-21-27`.

The first local two-pass output decodes successfully and retains the six-second source soundtrack. It changes facial regions only. Hair, glasses, wardrobe, gestures and the background remain from the original. Its all-frame selection audit found 67 unmatched left-performer frames and one unmatched right-performer frame; it is retained as a provisional attempt, not an accepted result. The matching calibration is being investigated.

## Live Google Flow test

[Private Flow project](https://flow.google.com/project/57c39a41-5909-4af1-98c2-8688cdcef415), titled `King Kong 21-27 - Walter and Saul`.

The signed-in Pro account exposes uploaded-video ingredients in the live UI. This does not establish exact motion transfer or the availability of every uploaded-video editing tool. Actual settings: Omni 1.1 Flash, Video / Ingredients, source-based six-second length, 720p, 16:9, one output, Agent off.

The live quote was 10 credits before attaching the source video and 20 after attaching it. Daniel authorized the latter quote for one test. One generation was submitted; no automatic rerolls are authorized. The actual credit ledger and result remain to be checked.

The source clip and Saul portrait uploaded and attached successfully. Walter's portrait returned a generic Cannot upload notice through both the ingredient picker and direct project upload. PNG, JPEG and a larger copy were tested; no specific reason or policy explanation appeared. Do not infer a minimum resolution or a moderation reason from this error. The submitted prompt explicitly names and describes Walter instead; the missing portrait is a limitation of this attempt.

The exact submitted prompt is `flow-submitted-prompt.txt`; the quote screenshot is `flow-ready-settings.png`. Both are in the test folder. The source soundtrack will be restored locally after download.

## Existing design artifacts

[System design](system-design.md), [video notes](video-notes.md), [Figma-importable SVG board](workflow-board.svg), and [editable diagrams.net board](workflow-board.drawio). These design artifacts predate the implementation test and describe the proposed full workflow.
