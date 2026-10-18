---
title: Ollo English UI preparation
created: 2026-10-18
updated: 2026-10-18
type: project
status: local-review-candidate
tags: [ollo, english, ui, recording]
---

# English UI for your app recordings

- **Prepared:** English screens, onboarding, settings, permission explanations, blocking/opening overlays, purposes, quizzes, offline activity cards, chart labels and accessibility descriptions. The orange pixel theme and native controls remain.
- **Choice:** English-first in this candidate, following your approval. There is no language switch. Android system dialogs use the device language. Names you previously entered or saved remain as they were; old Dutch morning/evening defaults are still recognized.
- **Build checks:** 83 unit tests pass, lint has no errors and18existing warnings, and all12review-package checks pass. Three old Dutch expectations were translated without removing their assertions. No new network, account, billing or telemetry flow.
- **Native review:** 51minified-screen checks,43fresh fixture checks and276debug overlay checks passed, with90accepted captures inspected. This covers normal/200%core screens, selected onboarding/editor states, all three quiz topics, purpose/reminder actions, optional opening and hard-block priority. Earlier failed/partial runs are retained separately and excluded from accepted totals.
- **Cleanup:** original emulator APK,19persisted files, owners/modes/SELinux and settings were restored and cold-boot verified before app launch. The emulator was synced and stopped12:09:19UTC. Your test installation is untouched.
- **Recording plan:** use English footage from a separate compatible review setup. Your installed test app was not replaced. Keep the actual app controls in every take. Only older Dutch-build footage needs **APP SHOWN IN DUTCH**; fictional statistics always need **FICTIONAL DEMO DATA**. [[RECORDING-SHOT-LIST]] and all8[[GLOBAL-UGC-SCRIPTS]] now follow this choice. No footage or Flow generation has happened.
- **Limits:** review signing; unpublished. English wording still needs your reading/comprehension feedback. No physical/OEM/API36, TalkBack or keyboard acceptance. Live overlays were checked on the English debug APK with fixture configuration/answers and shortened cue deadlines. Natural5/10/20minute waits and minified-overlay behavior were not repeated; earlier Dutch artifact evidence remains separate.

Local source milestone: `f44d294` (unpublished).

Release candidate SHA-256: `0e57700bb2768ffe4421029d0d837152668117e1f8e31fc3a5b9a8036f172999`.

[Build, source patch and native evidence](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-english-ui/). [[ENGLISH-SUPPORT-COPY]] uses the current English menu labels and preserves the older-installation distinction.
