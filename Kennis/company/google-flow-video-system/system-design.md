---
title: Google Flow character video system - design
created: 2026-10-10
type: system-design
status: designed-not-implemented
tags: [google-flow, video, architecture, credits]
---

# Google Flow character video system

Turn a short reference clip and one or two character references into reviewed footage using Daniel's existing Google Flow credits. Daniel clicks Generate and reviews each clip. Keep the source soundtrack, make spending predictable, and export a local final MP4, targeting 1080p on the Flow route.

This is a system design and a diagram. The media pipeline has not been implemented or tested against Daniel's account. Browser automation is excluded by Daniel's preference.

## The decision that shapes the system

Assumption: use from the Netherlands / EEA. Google lists the Netherlands as a supported Flow country, but currently excludes editing uploaded videos and using Avatars in the EEA. The main route therefore generates new footage rather than relying on uploaded-video editing. It does not promise the source actor's exact movement or lip sync. Daniel prefers the closest useful result and accepts approximation when a practical free motion-transfer option is unavailable. [Google's availability and restrictions](https://support.google.com/flow/answer/16353544)

The capability check should first inspect whether Daniel's Flow UI exposes a video ingredient for new generation. Google's creation guide mentions video references under ingredients; that does not establish that this input is enabled for his account, nor that it performs exact motion transfer. If exposed, try one short shot with the source clip as a motion/reference ingredient. Otherwise use prepared first/last frames. Keep these as separate supported modes. [Flow input references](https://support.google.com/flow/answer/16353334?hl=en)

Google's documentation describes Omni editing an uploaded segment of up to 10 seconds in supported regions. That could support a closer editing route in a future version, after a live account capability check and a small quality test. It is not enabled in this Netherlands design. [Editing in Flow](https://support.google.com/flow/answer/16935718?hl=en)

The public documentation reviewed does not establish a supported API that spends this account's Flow credits. Daniel operates the ordinary Flow website in his signed-in browser; the system prepares files and prompts and records his results. Gemini API usage has its own Cloud billing setup; it is excluded from this design. [Flow credit management](https://support.google.com/flow/answer/16526234?hl=en), [Gemini API billing](https://ai.google.dev/gemini-api/docs/billing)

## Options considered

| Approach | What it delivers | Tradeoff | Decision |
| --- | --- | --- | --- |
| Local preparation + manual Flow generation | A similar scene with Daniel's characters, using the best supported references. | Human review is necessary; performance fidelity varies. | Default. Uses existing Flow credits in the EEA. |
| Flow uploaded-video editing | A closer source-video edit where the feature is enabled. | Region dependent; character and performance fidelity still need testing. | Future capability, unavailable for the assumed region. |
| Optional Wan Animate replacement | A candidate for closer source motion and expression transfer. | Free model weights do not guarantee free hosted inference or easy local execution. | Optional trial only when no-extra-charge execution is confirmed; otherwise skip. |

## Free motion-transfer research

Wan Animate accepts a character image and a driving video and supports animation and replacement. It is a closer technical fit for the tutorial's performance-transfer goal than unconditioned frame animation. This is a candidate, not a promise of exact motion or lip sync. [Wan's official project](https://humanaigc.github.io/wan-animate/)

Availability checked 2026-10-10:

- The official Hugging Face demo linked by the project returned a 404 in the live browser; its metadata request returned 401. Old search results showing it paused are not proof of present availability.
- A community copy, `neop3/Wan2.2-Animate-free`, reported a running frontend. Its public source delegates inference to a hosted API and does not establish a dependable free quota. A running UI is not a successful free-generation test. Do not make it a required provider.
- The local machine reports an NVIDIA RTX 5060 with 8,151 MiB of VRAM. Local Wan Animate inference was not installed or benchmarked. Its large model would need a suitable quantized/offloaded setup on this hardware; speed and quality are unverified. ComfyUI documents a native replacement workflow and FP8 weights. [ComfyUI's Wan Animate workflow](https://docs.comfy.org/tutorials/video/wan/wan2-2-animate)

The optional branch opens only after a usable runtime, no provider payment requirement, suitable input support, and Daniel's approval of any external uploads are established. Start with one short single-performer preview. If Daniel accepts its movement, identity, and timing, retain that footage and finish locally with the original audio. Do not regenerate it in Flow and lose the motion that was just preserved. If unavailable or poor, continue with the normal Flow route.

No VPN dependency is included. Google does not document VPN use as a supported way to unlock these features, and its help says VPNs do not enable access from unsupported regions. Account capabilities must be checked directly. [Google Flow access help](https://support.google.com/flow/answer/16353333?hl=en)

## Explicit assumptions and limits

- First version accepts MP4 or MOV reference clips up to 30 seconds and one or two self-owned or authorized character references. These are product scope choices, not claims about every Flow upload limit.
- Output can resemble the source scene while using a new performance. Background, identity, wardrobe, camera, and action fidelity are reviewed rather than guaranteed. Optional motion-transfer footage is evaluated against the source before accepting it.
- Daniel operates Flow manually. The system produces a shot card with copyable prompt, named references, required settings, cost estimate, and review checklist. Daniel enters the live quote, clicks Generate, downloads the result, and returns its file and decision.
- Each run needs a credit cap, allowed settings, and a maximum number of attempts per shot. No credit balance, plan, or spending authorization is inferred from this design.
- The source audio is kept for the final soundtrack. Restoring it does not make newly generated mouth movement match that recording.
- No queue server, cloud database, Replicate account, Seedance key, browser automation, or temporary public file host is required for the core Flow route. The optional free-model trial must not turn into a hidden paid API dependency.

## Four user stages

| Stage | Daniel sees and decides | Output |
| --- | --- | --- |
| Upload | Source clip, character references, desired replacement, and credit limit. | A validated local job. |
| Review | Shot plan and character frames; the approximation limit is explicit. | Approved inputs and an authorized spending envelope. |
| Draft | Generated shots played with the original audio. | An accepted asset for each shot, or a visible rejection. |
| Export | Final assembled playback and the remaining export/upscale cost. | Approved local MP4 and run record. |

## Smallest architecture

| Part | Responsibility | Interface / boundary |
| --- | --- | --- |
| Local job folder | Store originals, source audio, shot boundaries, attempts, accepted files, and a small manifest. | Files on Daniel's computer. One job writes its own folder. |
| Local media tools | Probe, split, extract frames/audio, normalize footage, stitch, and mux. | Deterministic FFmpeg / FFprobe operations. |
| Existing assistant | Describe the scene, map character references, draft prompts, and assist visual review. | Judgment only; no model-based budget math, retries, or status parsing. |
| Manual Flow workspace | Daniel prepares stills where needed, generates video, downloads results, and upscales accepted assets. | Shot cards hand off files, prompts, settings, and budget guidance to the ordinary Flow UI. |
| Optional free-model runtime | Trial a source-conditioned replacement and return accepted footage. | Candidate runtime with confirmed no-extra-charge access; skip when unavailable. |
| Daniel | Approve inputs, spending scope, successful drafts, and final playback. | Review gates persisted with the exact inputs/settings they approve. |

Existing assistant access covers planning and review. Flow credits cover only work performed inside Flow; this is not a claim that they pay for Codex, other model APIs, or local hardware.

## End-to-end flow

1. **Intake and preserve.** Probe the source, validate that it decodes, record frame rate and dimensions, and keep an immutable original. Extract the soundtrack without destructive edits. Silent sources stay silent; missing or corrupt media produces a visible error.
2. **Plan shots.** Mark source cuts and action beats. Map each source character to a reference explicitly. Select short supported generation lengths and record where each accepted shot belongs on the final timeline. A 24-second clip can become three 8-second shots. Preserve the exact source duration at assembly, including a short final remainder.
3. **Choose the best practical route.** Explain approximate performance transfer. If a genuinely usable free motion-transfer runtime is ready, Daniel may trial a short source-conditioned replacement. Accepted footage bypasses Flow regeneration and proceeds to local assembly. Otherwise continue with the Flow capability check. Exact motion is a preference, not a reason to block a useful approximation.
4. **Authorize the envelope.** Show the proposed reference-image work, video settings, attempt limit, and maximum total credits. Approval binds this job and these settings. Any higher price, different model/mode, or larger scope needs renewed approval.
5. **Prepare character frames.** Reuse supplied suitable images or prepare target first/last frames showing the approved characters, wardrobe, pose, room, and lighting. If image generation is needed, use Flow's image interface and the same cost checks as video generation. Do not silently substitute a paid image model. Daniel approves the frames before video generation.
6. **Lock one shot card.** Record a versioned prompt, input asset references, aspect ratio, supported duration, model, resolution, and one output. Prefer a video ingredient only when the UI exposes it and a test shot supports the intended use. Frames mode uses first/last images; ingredients mode uses the supported references. Select one mode rather than assuming both can be combined. A still image is not a motion-control video.
7. **Check the live quote.** Daniel reads the active model and displayed cost in Flow and enters or confirms it on the shot card. Include every output, image generation, retry, and upscale in the total. Check remaining job budget, pending reservations, and the balance Daniel observes. If any value is unknown, pause for inspection. Reserve the quoted cost in the local record before Daniel submits.
8. **Daniel clicks Generate.** He selects the shot's exact settings, attaches its approved inputs, and submits once. Record the Flow project, available asset identifier/link, attempt number, settings, and observed state. The system does not click, poll hidden endpoints, or claim the request was submitted without Daniel's confirmation.
9. **Reconcile and save.** Daniel confirms success or a definite failure from Flow and returns the downloaded result. Compare visible usage information where available. Failed generations may have delayed credit reconciliation; keep their reservation until the refund or non-charge is confirmed. A timeout or uncertain submission is a reason to inspect history before another click.
10. **Review the shot.** Download and validate the preview, then play it against its source-audio interval. Daniel checks the correct person, body/wardrobe, action timing, continuity, hands, framing, and mouth plausibility. A rejection records a reason and returns to the settings/cost check. Reuse accepted shots.
11. **Continue or finish.** Repeat for unaccepted shots only. When all Flow shots are accepted, Daniel selects each saved asset for supported upscaling, verifies its live cost again, and preserves the content. Changing from a preview model to a quality model creates a new generation, not a guaranteed refinement of the accepted take. Free-model footage bypasses this Flow operation.
12. **Assemble and approve.** Normalize dimensions/frame rate, trim approved clips to their planned intervals, and stitch in order. Discard generated audio and mux the complete original soundtrack once. Verify decoding, shot order, source duration, sync, joins, and final dimensions. Preserve native free-model resolution unless Daniel explicitly chooses a local resize; label resizing separately from a quality-enhancing upscale. Daniel approves full playback before the job is marked complete.

Flow documents text, frame, and ingredient generation with model-specific limits. Omni supports 4/6/8/10-second generation, while the listed Veo routes use 4/6/8 seconds; unsupported settings must be caught before submission. [Models and supported features](https://support.google.com/flow/answer/16352836?hl=en), [Creating videos](https://support.google.com/flow/answer/16353334?hl=en)

## Credit policy

Use the live UI as the authority. The following is an illustrative planning snapshot, checked 2026-10-10, not a quote for Daniel's account:

| Operation | Published credits per output |
| --- | --- |
| Omni 360p, 8-second new video | 6 |
| Omni 720p, 8-second new video | 12 |
| Veo 3.1 Lite | 10 non-Ultra / 5 Ultra |
| Veo 3.1 Fast | 20 non-Ultra / 10 Ultra |
| Veo 3.1 Quality | 100 |
| 1080p upscale | 0 for listed Plus/Pro/Ultra plans |

Published costs count outputs, not just requests. Image preparation, settings changes, and account eligibility must be checked separately. [Flow credit costs](https://support.google.com/flow/answer/16526234?hl=en)

Example: three 8-second Omni 360p shots, with at most two attempts per shot, reserve `3 * 2 * 6 = 36` credits for video generation. Add the actual UI quote for all image preparation and final operations. At 720p the equivalent video reserve is 72 credits. Choosing two outputs doubles the video reserve, so the first version sets one output explicitly.

For every attempted action:

`quoted_cost <= approved_cap - confirmed_spend - other_pending_reservations`

Also require sufficient observed account balance. One active run per Flow account keeps the local ledger useful; unexplained balance changes require reconciliation. This is a local planning and review limit: it cannot prevent Daniel from spending additional credits directly inside Flow outside the shot-card workflow. No auto top-up, automatic plan upgrade, unapproved model switch, or fallback to an independently billed API.

## Manual handoff and failure behavior

| Situation | Required behavior |
| --- | --- |
| Signed out | Pause at login; keep job files and attempt state. Never copy session tokens into the manifest. |
| CAPTCHA or unusual-activity notice | Daniel resolves it in his own browser. Keep the local job paused. |
| Cost, mode, or output count changed | Stop before submitting; obtain a new authorized quote/settings envelope. |
| Credit cap or available balance insufficient | Pause the job with the amount needed. Preserve all accepted footage. |
| Submitted request, then uncertain outcome | Daniel inspects project history and balance/usage first; avoid a duplicate paid click. |
| Clear technical failure | Record it and reconcile its cost. A bounded retry goes through the same budget check. |
| Content rejected | Record the visible reason and stop that request. Do not disguise rejected inputs to defeat the block. |
| UI changed or outcome uncertain | Update the shot-card instructions after inspection; never guess that Generate was not clicked. |
| Output corrupt, wrong duration, or missing shot | Reject it explicitly. Never silently skip it or label a partial sequence complete. |
| Upscaling unavailable or fails | Keep the accepted original and report its actual resolution. Never claim a 1080p render was produced. |

## Minimal job record

Store: job ID and state; original file fingerprint; source dimensions/FPS/duration; soundtrack path; character mapping; shot intervals; approved reference versions; prompt/settings versions; approved credit envelope; quoted and reconciled spending; per-attempt submission state and Flow asset reference; accepted local files; review decisions; final export path and measured metadata.

An attempt is identified locally by its job, shot, version, and number. These identifiers keep manual retries auditable; they do not imply that Flow provides an API idempotency key. Record submission intent before Daniel clicks Generate, then reconcile any uncertain state on resume.

The small state machine is: `intake -> planned -> awaiting_input_approval -> generating -> awaiting_shot_review -> awaiting_final_review -> complete`. Every step may enter `paused` with a visible reason; a rejected shot returns to an approved request version and budget check. Generation and finalization are sequential for the first version.

## Acceptance criteria for a future implementation

- A 24-second, three-shot Flow job preserves the original duration and soundtrack and exports a decodable 1920x1080 or 1080x1920 MP4, according to the selected aspect ratio. Optional free-model footage reports its actual resolution and any explicit local resizing.
- Every generation is a manual Daniel action, with a complete shot card and an explicit returned file/result; the system cannot silently spend Flow credits.
- A wrong character reference, unreadable source, silent clip, short last shot, and two-character brief each have an explicit supported result or rejection.
- A request with two outputs is priced as two outputs; any image operation is included in the same cap.
- An unknown manual submission cannot be marked ready for a new paid attempt before history reconciliation.
- Rejected previews never enter the final sequence, and accepted shots survive retry/resume.
- Budget exhaustion pauses with files intact; no separately billed API can run as a fallback.
- Restored audio is checked against the generated performance, with lip-sync mismatch reported instead of hidden.
- The exact approved Flow asset is upscaled where supported; a new generation is labeled as a new attempt. Accepted free-model footage skips Flow regeneration so its motion is preserved.

## Diagram and Figma delivery

`workflow-board.svg` is the designed vector board; `workflow-board.png` is its preview. Import the SVG onto a **Figma Design canvas** to edit the vector layers. It is not a native FigJam board: SVG arrows do not become live FigJam connectors, and imported labels may be vector outlines. Figma documents SVG conversion to editable vector layers. [Figma SVG import](https://help.figma.com/hc/en-us/articles/360040028034-Add-images-and-videos-to-designs), [Figma and FigJam interoperability](https://help.figma.com/hc/en-us/articles/1500005916661-Work-between-Figma-and-FigJam)

`workflow-board.drawio` preserves native shapes, editable labels, and attached connectors as an additional editable source. A hosted native Figma/FigJam board needs a confirmed Figma connection or a signed-in Figma browser; neither was confirmed at design time.

## Verification boundary

Research and diagram structure were checked. No credit-spending or free-model inference test was run, and no source clip was supplied for performance testing. Daniel's live Flow model/input availability and balance remain untested. Manual Generate, the optional free-motion branch, and the current regional limitation are represented in both the design and the diagram.
