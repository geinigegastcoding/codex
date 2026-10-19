# Ollo — 15-minute Android test session

## Owner self-test: current overnight candidate

- Candidate: `0.3.2-preview` /versionCode6, source `2a10ebd`. Exact APK/native acceptance and current download identity are recorded in project `docs/OVERNIGHT_HANDOFF.md`; use that guide rather than an older artifact. All current features remain free.
- Over the next couple of days, try changing the suggested app choices, declining optional setup access, returning later, and remembering/editing/forgetting one app's opening purpose/time. Note confusing decisions as well as failures.
- Try the routines and usage views during ordinary use. Check that missing/partial measurements remain understandable. Keep real calls, alarms and Android recovery available; emulator checks do not establish physical-device reliability.
- If one of the four reported quiz problems occurs, record the Ollo/Android/device version, target-app version, the short action sequence, existing pause/grant state and whether audio played. The canonical issue list is [[BACKLOG]]; these reports are not claimed fixed.
- The Pro screen is a free-testing preview. Dashboard branding, real price and production purchase testing remain owner-deferred. Preserve an existing installation if Android rejects an update because the signer differs; JSON export is not a restore mechanism.

The participant session below remains a separate, unrun research protocol; do not count self-testing or emulator assertions as completed customer interviews.

**Status: not yet run.** This is a neutral usability/value session, not physical-device acceptance or evidence of product efficacy. Use an existing Ollo installation in a safe test environment. Do not uninstall, update, overwrite, or replace a participant’s installed test app. The 0.2.0-review APK has a different signing certificate from the earlier 0.1.1 build; if the right version is not already available, use a spare device/emulator rather than replacing an installation. Passing this session does not establish OEM/background, call/alarm, battery, or release-signing acceptance; see [DEVICE_CHECKLIST.md](../../../projecten/Ollo/docs/DEVICE_CHECKLIST.md) separately.

## Before the session

- Ask permission to observe and take brief notes. Say: “We’re testing the app, not you. Please think aloud. I’ll stay quiet unless you ask to stop or something urgent comes up.”
- Use dummy/test app content. The participant chooses one app privately; do not ask for their app inventory, messages, contacts, or usage export. Do not record app names, identifiers, screenshots, or full usage data.
- Let the participant use their own temporary test rule. Avoid changing persistent schedules or routines. Use the built-in 30-second practice block for the essential/recovery task.
- Stop immediately if the device becomes hard to recover, an actual call/alarm/emergency is needed, or the participant wants to stop. Do not enable/disable system permissions on their behalf.
- Do not mention prices or show price concepts. For later willingness-to-pay research, first establish value and use the separate [PRICING.md](PRICING.md) plan; do not duplicate or anchor prices here.

## Session plan (15 minutes)

**0:00–1:00 — Introduce and permission check**  
Explain that notes will not include personal app names, messages, or usage totals. Ask: “Is it okay if I take anonymous task notes?” If not, run without notes or stop. Ask which Android/Ollo build is already installed only if needed for safe setup; do not ask them to replace it.

Use the same neutral prompts throughout: **“What are you expecting?”**, **“What would you try next?”**, **“What makes you think that?”** Do not point to controls, explain features, or praise a particular choice. If a task stalls, wait briefly, then use one prompt; record any hint you gave. Intervene immediately for safety or recovery.

| Time | Task and exact prompt | Observe success / failure |
|---|---|---|
| 1:00–4:00 | **1. Understand and set up one selected app.** “Please set Ollo up so it can pause one app you choose. Think aloud as you go.” Let the participant select an app privately and proceed through relevant setup. | **Success:** selects only their chosen app, understands which Android access is being requested and why, and can tell whether protection is active. **Failure:** selects the wrong scope, cannot explain the permission, mistakes partial setup for active protection, or needs a hint. Record permission refusal as a valid choice; do not coax consent. |
| 4:00–6:00 | **2. Make an intentional opening.** “Please try opening the app you just selected, then do what you would normally do.” | **Success:** recognizes Ollo’s prompt (or optional quiz if already enabled), understands the choices, and either opens consciously or backs out by choice. **Failure:** believes opening is automatic, quiz is mandatory, a quiz overrides a fixed block, or cannot recover/continue. Do not turn the quiz on for them. |
| 6:00–9:00 | **3. Reach an essential and find recovery.** “During this short practice pause, show how you would reach something you need to keep available. Then show where you would check or change Ollo’s protection.” Use the 30-second practice block and a non-emergency essential route; do not place an actual call. | **Success:** reaches a configured essential or built-in dialer/alarm route and returns to Ollo; finds protection status or the Android permission route without believing the phone is locked. **Failure:** essential route is blocked, they cannot return, recovery is hidden, or they believe Ollo prevents Android Settings/uninstall. Stop and recover if needed. |
| 9:00–12:00 | **4. Interpret the usage view.** “Please open the usage view and tell me what you think these figures mean, and what you think they do not tell you.” | **Success:** distinguishes available Android history from Ollo’s focused-use measure, notices source/coverage labels or missing data, and does not infer a guaranteed saved-time result. **Failure:** treats unknown days as zero, assumes every figure is complete, confuses the two measures, or reads it as proof of improvement. Do not request an export or write down their actual totals. |
| 12:00–14:00 | **Debrief: ask these three questions without suggesting an answer.** (1) “What, if anything, felt useful or frustrating in those tasks?” (2) “How would this fit—or not fit—with what you currently do when you want to pause an app?” (3) “Which part, if any, feels meaningfully different from other options you know, and what makes it different?” | Capture only anonymous paraphrases unless the participant separately agrees to a short quote. Feature preference is not demand or willingness to pay. Keep any value conversation open-ended and before any price anchor. |
| 14:00–15:00 | Close: “What should I have asked but didn’t?” Thank the participant; confirm no personal data was captured. | Record remaining unknowns and any issue that needs safety/device follow-up. |

If the quiz is already enabled during Task2, use one short, neutral probe within that same time slot: “What do you expect will happen when you finish this?” Then ask “Where would you change this choice?” Do not supply the three-question answer, switch it on for the participant or imply that a quiz lifts a block. Note confusion without recording their answers to quiz content. The small store-review sample in [[FEATURE-RESEARCH]] motivates this question; it does not establish that Ollo users are confused.

## Blank observation record

**Session status: not yet run.** Leave blank until an actual session. Use a participant code, not a name. Note task behavior and hints, not personal app names, messages, contacts, or numerical usage history.

| Participant code / date | Task | Outcome (complete / partial / not completed / stopped) | First confusion or wrong turn (anonymous) | Hint needed? / count | Time / safety note |
|---|---|---|---|---|---|
|  | Setup one app |  |  |  |  |
|  | Intentional opening |  |  |  |  |
|  | Essential and recovery |  |  |  |  |
|  | Interpret usage view |  |  |  |  |

## Triage rules

- **P0 — stop and resolve before more user sessions:** any essential/call/alarm/Android recovery route is blocked or hard to reach; protection status misleads someone into thinking Ollo is active when it is not; personal data is exposed or captured; participant becomes distressed or asks to stop.
- **P1 — investigate promptly:** a task cannot be completed without coaching, permission purpose is misunderstood, or the same failure appears in two independent sessions. Separate product usability from a device/service defect; route hardware, OEM, timer, reboot and battery behavior to the physical-device checklist.
- **P2 — keep as a question:** one-off copy confusion, feature preference, or a request for something not implemented. Do not add it to a roadmap from one comment.
- Treat fewer than five independent sessions as individual observations, not a segment finding or persona. Report task completion and misunderstandings alongside preferences; do not turn stated interest into demand, saved-time claims, or pricing conclusions.

## Price boundary

Keep this session price-free. After users have described the job, current alternatives, and which implemented feature (if any) matters to them, a separate, unanchored willingness-to-pay exercise may follow the sequence in [PRICING.md](PRICING.md). Do not show a price card before that conversation or treat stated purchase intent as conversion.
