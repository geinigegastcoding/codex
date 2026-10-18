---
title: Ollo learning-topic setting
created: 2026-10-17
updated: 2026-10-17
type: project
status: verified-local
tags: [ollo, design, verification]
---

# Learning-topic setting

Local source/evidence milestone: `ad8ccb5` on `codex/ollo-improvement-loop-2026-10-16`.

Settings now shows one **Onderwerp** row with the current topic instead of three permanently visible topic descriptions. It opens a native single-choice dialog containing the same chess, math and facts choices and explanations. Selection saves immediately and closes the dialog; Sluiten, Back and outside dismissal leave the choice unchanged. The row remains available when the optional quiz is off. One extra tap for an infrequent change buys a shorter main Settings page.

The existing orange palette, native controls and mascot identity remain. A small book vector uses the existing icon helper; no external assets or dependencies were added. Configuration keys, default topic, enable flag, question content, rule precedence and storage format did not change. Impeccable and Ponytail guided one scoped source change after inspecting real normal/200% captures.

Two Mobbin **iOS** references informed only the selected-value and single-choice patterns: [Qantas](https://mobbin.com/screens/ff831570-5f8e-4897-904c-83d86af35d41) and [Notion](https://mobbin.com/screens/cc29c27b-0f54-4d02-bb5e-e95f51e81dbb). This is a native Android adaptation, not a clone; no reference assets shipped.

## Verified

Debug and minified release builds succeeded in 3m33s. All 75 existing unit tests passed; lint had 0 errors and 18 existing warnings. The current review guard and 16 KB alignment check passed. A separate Luna static review found no concrete regression, with runtime/accessibility limits explicitly retained.

Twelve emulator checks passed **across saved phases**, on the actual Settings screen rather than fictional review state:

- Eight normal-size checks cover the summary, three choices and descriptions, cancellation, every topic persisting across a process restart, unchanged other configuration, and the enable flag remaining independent.
- Two checks cover the fully visible dialog at 200% text in the normal viewport and Android Back dismissal.
- Two final checks cover actual scrolling at 200% text in a shorter 1080×1800 viewport and a changed topic persisting at enlarged text.

The original complete configuration, Accessibility grant list, font scale and viewport were restored. The owned test guest is Android 14/API34 OlloReview34, serial emulator-5568. The user's phone was not changed.

Evidence lives in the app's `screenshots/2026-10-17-topic/` and `docs/evidence/2026-10-17-topic/`. The final `confirmed/results.json` links to earlier passing phases. Failed harness attempts remain visible: an unnecessary scroll-required assertion, an off-screen gesture, a fling that skipped the target and failed its cleanup search, and a diagnostic-print error. Independent state verification confirmed restoration after the interrupted cleanup. Gesture and assertion corrections required no app source changes; only unresolved checks were rerun.

## Candidate and limits

Local APK: `artifacts/review/Ollo-0.2.0-topics-2026-10-17.apk`, SHA-256 `dcc60245bd8720831f5a9e48007b3ebf0a3d3e02d5f544f683ca8fa4b990f9a1`. Version remains 0.2.0-review (3), development signed, `productionSigningVerified=false`. It was built from the working tree before its milestone commit. No public release or phone update.

The exact minified candidate also rendered the selected-topic row and picker, preserved the choice after dismissal, and saved parseable local CSV/JSON exports. Parent independently checked hashes, payload structure and full configuration equality. Only the two exact device exports were removed; font, viewport and Accessibility grant list matched the original. The owned emulator was stopped afterward. See `docs/evidence/2026-10-17-topic/release-export-smoke.json`; raw exports remain ignored. A failed host pre-pull assertion is recorded; device filenames were explicitly absent before saving and the new host files have corroborating creation timestamps. TalkBack, physical/OEM behavior and Android16 runtime acceptance remain open. The Linux guard result in [[PRODUCTION-READINESS]] applies to the preceding privacy APK and the same guard source, not an unobserved hosted CI run.

## Follow-up: shared switch names

The shared `Toggle` now adds its existing title as the Switch's accessible name. Built-in state/action, callback, enabled behavior and visuals stay intact. On API34, native XML exposes **Drie vragen vóór openen** with checked true → false → true, and **Essential tijdens rust** as checked and disabled on the protected Android Settings app. Configuration was restored; parent independently parsed the states and inspected the screenshots. This is not a TalkBack test.

Build 3m06s, 75 existing unit tests, lint 0 errors/18 warnings, review guard and 16 KB alignment passed. Current candidate `artifacts/review/Ollo-0.2.0-switch-labels-2026-10-17.apk`, SHA-256 `9baadfb3feae151e9d33f4ce31112bf2b12966baaa9817117e9fb180a1c19c28`, still development signed. Evidence `screenshots/2026-10-17-switch-labels/results.json` keeps the non-applicable Chrome disabled-fixture attempt, query-marker correction and historical-baseline correction visible. The historical unnamed control belongs to the empty Settings review fixture, not onboarding.
