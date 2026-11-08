---
title: Ollo product work and delivery plan
updated: 2026-10-20
status: active
---

# Product work - 20 October 2026

## APK handoff requested at 5% remaining - 20 October, 18:36 Amsterdam

Daniel requested an APK immediately. Delivered `E:/MData/projecten/Ollo/artifacts/Ollo-0.5.0-opening-extras-debug-2026-10-20.apk`, version 0.5.0-preview/code 10, 48,729,780 bytes, SHA-256 `980bb132b69da7a97ed7e6d96831a526b12dd6c5bdf1eb5848cc65add44d32c0`. Same PC debug signer; differently signed installations cannot update in place. No commit, push, publication or reset credit used.

Source adds opt-in proximity-cycle/task unlocking with fixed per-app access, configurable/custom quizzes and recall, accent/greeting/mascot customization, and experimental consent-gated visible-interface filters. Native Instagram is unsupported; Reels support is Chrome-path-only. Schema 4 settings backups import 1-4 and preserve installation-owned consent. Privacy drafts describe the new conditional screen-node access; production approval remains open.

199 JVM tests and 13 package checks pass; 16 KB alignment passes; lint has zero errors, 21 warnings and one hint. Real emulator proximity input passes normal/200% exercise cases (10 checks each); recall passes both sizes; customization passes normal. The final broader sweep is incomplete. A prior real YouTube run passed six consent/Home/Shorts pause checks, then failed its return/off check; a later run could not locate visible tabs. Treat content-filter acceptance as incomplete. Live Chrome testing was rejected by automatic approval review even after Daniel explicitly approved the public test page. One large-text cosmetics run was interrupted by accidental overlapping instrumentation; logcat explicitly records `start instr` killing the old runner. It is not product acceptance.

Evidence: `artifacts/product-pass-2026-10-20/remainder-*`; delivery metadata records limitations, and source inventory/ZIP preserve current files. The old fully verified 0.4.2 APK remains available. Remaining work is final emulator regression, filter return/compatibility and live Chrome acceptance, physical sensor calibration/OEM acceptance, and existing production/signing/store owner gates. The full objective is not marked complete.

Emulator handoff restores font/rotation, disables test Accessibility/Usage Access/notification grants, sets proximity far, stops the test package and syncs storage. The owned AVD remains available.

Daniel authorizes autonomous implementation and Luna research, with parent-owned product decisions. Deliver a testable APK by approximately 22:00 Europe/Amsterdam; aim to freeze a candidate by 21:30 or earlier and reserve at least 20% of the five-hour allowance for build, checks and handoff. Initial allowance: 3% used. No reset credits. Keep the full objective active until its requirements have evidence; an intermediate APK is a checkpoint.

## Latest verified APK checkpoint - 20 October, 16:40 Amsterdam

[Ollo 0.4.2 purpose and reminders test APK](E:/MData/projecten/Ollo/artifacts/Ollo-0.4.2-purpose-reminders-debug-2026-10-20.apk) is ready. Version `0.4.2-preview` / code 9, 48,988,984 bytes; SHA-256 `f73cd1b87c9d804aacbebcb609f9338f08c43e3aa4731a964a0b581957fe30ab`. Same PC debug signer as 0.4.0; differently signed installations cannot update in place. Production signing remains open.

**157 JVM tests, 150 native checks across 21 normal/200% cases, 13 package checks and 16 KB alignment pass.** Lint: zero errors, 19 warnings and one hint (two new stylistic SharedPreferences KTX suggestions). Final cases cover actual keyboard input, custom purpose/finish cues, explicit remembering, shade/brightness return, reschedule/dismiss/Home/Ideas, contextual order/filters, notification denial/allow/private preview/content intent, a real controlled inexact background alarm and cancellation, SAF custom-choice restore/save, and existing navigation/history/setup/usage/widget flows. Final `lastanr`: none since boot.

Evidence in app `artifacts/product-pass-2026-10-20/`: `reminder-accepted-source-build.json`, verified relative-path `reminder-accepted-source.zip`, `reminder-acceptance-*-result.json` and screenshots/logs, `reminder-accessible-validation/`, `reminder-accessible-package.json`, `reminder-accessible-zipalign.log`. At acceptance, all 129 source/build/harness hashes and installed APK hashes match. Test APK SHA-256: `75eb05363c4103f5da1dc1faf29a6056d04fd6ed11033654f974f955fbb8b803`. Earlier failed candidates and driver attempts remain separate. No commit, push or publication.

New features: bounded written reasons and finish cues, explicit saved defaults, gentle check-in return actions, offline suggestions using time/budget/energy/personal activity/favorites, and optional quiet local reminders. Backup schema 3 imports schemas 1/2/3. Permission recovery and politely announced feedback are beside the reminder toggle. Actual task completion is self-reported; Android can delay reminders.

Limits: one owned API36 emulator and selected normal/200% flows. Reminder evidence covers a warm-process controlled alarm; physical/OEM/cold-boot/battery acceptance and an app-wide TalkBack audit remain open. Calendar-day usage stays an estimate. **Five groups remain active:** exercise/task unlocking, expanded/custom quizzes and optional recall, Shorts/Reels, website filtering and Pro cosmetics. The full goal stays active.

`reminder-cleanup-settings.json` verifies font 1.0, portrait/auto-rotate, Accessibility/Usage Access/notification test grants off, no pending reminder alarm/metadata, widget host/binding and public QA file cleanup, test package stopped and storage synced. The owned official AVD remains running for continued work. At 16:40, the natural account window is 50% used and weekly 23%; neither reset credit was used. The test APK is available before 22:00.

## Earlier verified APK checkpoint - 20 October, before 13:00 Amsterdam

[Ollo 0.4.0 test APK](E:/MData/projecten/Ollo/artifacts/Ollo-0.4.0-personal-plan-debug-2026-10-20.apk) is ready. Version `0.4.0-preview` / code 7; SHA-256 `cfc37d3923b5771b89d4012e85c69fafbd164a94e011fe59f32d3053ddca9b0c`. Same PC debug signer as the recent 0.3.2 APKs; production signing is not verified.

The exact installed APK matches that hash. All 113 recorded source files remain unchanged from the candidate. **133 JVM tests, 76 native checks across 15 normal/200% cases, 13 package checks and 16 KB alignment pass.** Lint: zero errors, 17 warnings and one hint. Native coverage includes real Android document selection/save/re-read, restore preview/cancel/consent/timer preservation, minimum-size long-text widget rendering and live preference refresh, widget shortcuts, Android usage delta/revocation, SystemUI brightness/shade quiz progress, swipes/editor Back, activity recreation/rotation and default/history onboarding with partial permissions. Final `lastanr` reports none since boot.

Evidence is in app `artifacts/product-pass-2026-10-20/`: `delivery-source-build.json`, `delivery-package-verification.json`, `delivery-validation/`, `delivery-*-result.json`, screenshots/logs, installed APK hash and cleanup settings. Earlier candidates and failed attempts remain preserved. Final source is uncommitted; no push or production publication occurred.

Limits: one official API36 emulator and selected flows; no new physical/OEM or app-wide TalkBack acceptance. Populated history uses a saved-data fixture plus the real history route, rather than proof of every OEM's populated OS import. Android events are labelled estimates, with midnight/retention/multi-window limits; exact Digital Wellbeing parity is not claimed. Widget validation uses a real Android widget host, not every home launcher. Nine requested feature groups below remain unimplemented; the full goal stays active.

QA host IDs/temp files and binding grants were cleaned up. Font is back to 1.0, portrait/auto-rotate restored, Accessibility and Usage Access test grants are off, test package stopped and storage synced. The owned headless official AVD remains running for continued goal work. Latest allowance checkpoint: 82% used; final delivery/cleanup uses the remaining reserve. No reset credits used.

## Earlier afternoon implementation history - superseded by the latest checkpoint

The preserved 0.4.0 APK above remains the fully checked download while the next slice is verified. Current source has moved beyond that checkpoint; its old source-equality statement applies to the checkpoint only.

- A frozen 0.4.1 intermediate (`purpose-context-candidate.apk`, SHA-256 `fe531ca9ad3aac6304b4969f528c3dd5a03f7765aa1ae838c6d52e706109a8ce`) passes 147 JVM tests, 13 package checks and 40 native purpose/finish checks at normal/200% text. It supports bounded custom reasons/finish cues, explicit saved choices, real keyboard input, system-panel return, reschedule/dismiss/Home/Ideas actions, and contextual suggestions. The dedicated Ideas and updated SAF cases still need the next test build. The earlier failed traversal selected the covered Compose page because UiAutomation included hidden descendants; the driver now uses user-like flags and the protection subtree. Production accessibility suppression was retained.
- Current 0.4.2 source adds opt-in local daily reminders, Android notification permission handling, an inexact alarm, private notification content, settings preview and schema-3 settings backups with schema-1/2 migration. 157 JVM tests and the scoped build/lint pass; real Android permission, alarm delivery and cancellation acceptance is pending. Native test updates and a final rebuild are in progress. No completion claim for reminders yet.
- The account window reset naturally before the 15:51 Amsterdam checkpoint (0% used then); both reset credits remain unused. Keep the 22:00 test-APK target and the full requested feature list active.

## Scope and design decisions

- Preserve the current orange/white native design and free core. Use the existing codebase and official Android Studio emulator. Preserve existing uncommitted reliability/startup/accessibility work, user data and essentials behavior. Daniel confirms essentials and updates work on his installation; record that as owner feedback rather than a new device test.
- Fix the history onboarding exit and quiz/shade escape from reproductions. Do not infer a root cause from the symptom. Add swipe navigation between the four main pages, retaining tabs, nested routes and Back behavior.
- Prefer Android UsageStats totals for the main daily metric, refreshing on return/launch. Keep local focused details distinct; never add overlapping Android/local totals. Add an explicit choice to exclude essentials from selected-app daily time, reflected consistently in goals/history. Preserve frozen baseline definitions and unknown/provider-error states. Do not claim exact Digital Wellbeing parity.
- Meaningful onboarding: ask what the user wants time for, which apps count, whether essentials count, daily goal and preferred pause behavior; show the resulting choices before optional permissions and a practice step. Each answer affects a real editable setting. Add clear numbered permission instructions and the most specific supported Settings route, with fallback and explicit user consent. No automatic permission grants or invented retention benefit.
- USP research informs hypotheses rather than novelty claims. Current source examples already overlap exercise, quizzes and content filtering. Parent chooses a coherent useful experience; expanded customization can be evaluated as Pro value while all current features stay free during testing.

## Ordered implementation and evidence

### A. Reproduce, repair and stabilize

- [x] Capture baseline history-onboarding path and preserve crash evidence. Real empty-history path passes; a populated saved-history fixture reproduces the Long/Int comparator crash. Zero fallback changed to 0L; normal native regression passes. Large-text rerun remains below.
- [x] Capture quiz progress before/after notification shade and an actual SystemUI brightness activity. Shared context handling fixed; normal/200% native cases pass on the events candidate. Final candidate rerun remains below.
- [x] Add real main-page swipe navigation; tab taps, editor Back, recreation and landscape navigation pass at normal/200% text. Consumed launch routes no longer overwrite the saved page; the landscape navigation rail is wide enough and scrollable.
- [x] Add focused regression checks and run affected cases on the official emulator; preserve baseline, harness and actual product failures separately.

### B. Screen time and useful setup (important)

- [x] Android-preferred daily totals with event reconstruction for expanded buckets, fallback/source labels and no overlapping totals; controlled-use delta and permission revocation pass. Estimates remain explicit.
- [x] Essentials exclusion applied consistently and editable later; frozen baseline retains its saved definition. Legacy stored settings preserve their earlier counting rule.
- [x] Personalized reclaim activity, counting choice, goal/pause choices, setup summary and numbered permission guidance implemented.
- [x] Normal/200% default/history paths, declined permissions, actual Settings return, recreation and saved personal/counting/quiz choices pass in scoped native cases.

### C. Requested feature work (full scope retained)

Each item requires implemented behavior plus relevant source/runtime evidence before it can be checked. Research or a placeholder alone is insufficient.

- [ ] Exercise/task-based unlocking with a clear completion mechanism, earned-access duration, accessible alternatives and existing safety routes.
- [x] Free-text opening purposes and user-chosen finish conditions; bounded input, explicit remembering, legacy decoding and real SAF round-trip pass.
- [x] Better finish/check-in and graceful return flows; custom cue, reschedule, dismiss, Home and Ideas actions pass without fabricated completion outcomes.
- [x] Contextual offline alternatives tied to user preferences; personal activity/favorite order, time budget, energy and current context pass at normal/200% text.
- [ ] Expanded quiz content/customization and optional recall exercises.
- [x] Accountless settings backup/restore with strict validation, missing-app preview, explicit apply and installation-state preservation; actual picker/save/re-read and restore checks pass. Active fixed schedules prevent restore.
- [x] Mascot home-screen widget with a saved personal reminder and working Today/Ideas controls. Real host rendering at normal/200% text, long text at declared minimum size and preference refresh pass; no live protection claim.
- [x] Optional local daily reminders; explicit Android permission refusal/acceptance, private preview, Ideas action, pending-schedule preservation, controlled background delivery and cancellation pass. Timing is approximate; physical/cold-boot acceptance is open.
- [ ] Selective Shorts/Reels blocking with explicit scope, app/language compatibility and privacy disclosure.
- [ ] Browser/website filtering with a genuine supported enforcement mechanism and explicit scope.
- [ ] Cosmetic/customization extras for Pro; no sale of unfinished value.

### D. Delivery

- [x] Build this checkpoint with source manifest, exact APK hash and debug signing identity.
- [x] Run relevant checks and packaging validation; retain physical-device acceptance as open.
- [x] Save research, parent decisions, completed/open status and reproducible evidence links.
- [x] Restore owned emulator test settings, end QA/build operations and provide the APK before the deadline. The owned AVD is intentionally retained for the active goal.

## Research and status

[[USP-ONBOARDING-RESEARCH-2026-10-20]] and [[ANDROID-USAGE-PERMISSIONS-2026-10-20]] contain scoped Luna findings and parent decisions. No primary evidence established that onboarding length itself improves retention. Today now prefers Android-derived figures; local hourly detail stays separately labelled. The verified checkpoint above supersedes the intermediate status below.

The earlier overnight deadline is historical and superseded by today's request. Production signing, live billing and store publication remain separate owner-dependent release tasks; the present deliverable is a test APK. No commit or push is requested.

## Implementation checkpoint - 20 October, daytime

- Android DAILY totals on the owned API36 emulator start on 19 October at 17:46 and extend through today. Raw SDK records and lifecycle events are retained in app `artifacts/product-pass-2026-10-20/provider-diagnostic-normal-usage-native/usage-provider.json`. Treating the entire bucket as today's usage would be wrong. The new shared fallback reconstructs calendar-day activity from public Android events, clips known midnight carry, excludes screen-off/keyguard time, unions activities within a package and handles restart uncertainty. It is explicitly an estimate; no Digital Wellbeing parity or exclusive split-screen device total is claimed.
- The events candidate passes normal usage-source/revocation, quiz/SystemUI, swipes, populated-history and default/permission setup cases. At 200% text, quiz and swipes pass. History stopped at an off-screen welcome button because the driver did not scroll; screenshot/tree show a usable scrollable welcome page. Driver scrolling was corrected; final rerun is pending. Events candidate hashes are in `events-package-hashes.json`; earlier core d1ba8a5b candidate is superseded and has the known Android-totals failure.
- Onboarding now configures a saved reclaim activity, essentials counting, app/essential choices, goal, morning preference and optional quiz/topic, with optional late Usage Access, numbered instructions, Accessibility consent and plan summary. Swipes use the four existing main pages and retain tab controls.
- Accountless settings backup/restore has a strict schema, typed/bounded parser, duplicate-key/file/depth limits, missing-app preview, explicit apply and installation-owned consent/identity preservation. Active fixed schedules prevent restore. Existing data export remains separate. Real document-picker acceptance is pending.
- A real Android mascot widget provider is registered. It shows the personal reclaim activity and opens Today or Ideas; it makes no live protection/usage claim. The native widget-host fixture and 200% rendering/actions are pending.
- 133 JVM tests pass, including event counting, backup boundaries and document-read failures/cancellation. Lint/package/native checks for the expanded candidate are running; a test-host Java API error was found and corrected before any acceptance claim.
- Current allowance checkpoint: 57% used / 43% remaining. Reserve at least 20% for packaging, checks and delivery. The full feature list above remains active; the other nine requested feature groups have not been implemented by this checkpoint.
