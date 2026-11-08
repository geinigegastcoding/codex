---
title: Ollo launch and future-work backlog
updated: 2026-10-20
type: project
status: active
---

# Ollo backlog

One place for unfinished work. Completed work and detailed evidence remain in [[README]], [[CONTINUOUS-IMPROVEMENT]] and [[OLLO-WRAP-UP-2026-10-17]]. A proposal is not an implemented feature. Update status and evidence when work changes.

## Active work - 20 October

Today's full authorized objective and evidence checklist are in [[PRODUCT-WORK-2026-10-20]]. The target is a testable APK by approximately 22:00 Amsterdam, with a five-hour build/testing reserve. The overnight agreement below is historical.

The latest 0.4.2 test APK adds custom purposes/finish cues, improved check-in/return actions, contextual offline suggestions and opt-in local reminders to 0.4.0's personalized setup, Android-derived estimates, fixes, swipes, backup/restore and widget. 157 JVM tests, 150 native checks in 21 normal/200% cases, 13 package checks and 16 KB alignment pass; lint has zero errors. [[PRODUCT-WORK-2026-10-20]] records exact identity, failures, limits and cleanup. Five groups remain active: exercise/task unlocks, expanded/custom quizzes and optional recall, Shorts/Reels, website filtering and Pro cosmetics. The full goal remains active.

Parent USP/Pro direction is recorded in [[USP-ONBOARDING-RESEARCH-2026-10-20]]. No commit, push, production signing, live billing configuration or publication is authorized by the current work.

## Overnight agreement

- Stop the improvement loop **19 October 2026, 07:00 Europe/Amsterdam (05:00 UTC)**. Aim to finish the APK and handoff by 06:40. This replaces the unlimited loop for this run.
- Use two natural windows only. First reset confirmed 18 October 21:56 UTC; next reported reset **19 October 02:56:55 UTC / 04:56:55 Amsterdam (1792378615)**. First window closes at 10% remaining and reserves 5%; final window closes at 25% and stops substantive work at **20% remaining**. Never use reset credits. Weekly capacity also applies.
- Deliver the best verified downloadable APK, checksums, scope and Git handoff. Do not call a test APK production ready while blockers remain.
- Keep all current features free. Keep the native Pro/paywall preview, editable defaults, onboarding, USP/pricing/retention research and English store assets in scope. Gradle and the official Android Emulator only; Luna delegates only.

## Reported bugs: dedicated reliability follow-up

Owner reported these on 18 October; device, OS and exact APK have not yet been recorded. Daniel authorized the reliability follow-up on 19 October using Android Studio's emulator. Scoped reproductions, fixes and a debug APK are recorded in [[BLOCKING-RELIABILITY-2026-10-19]]. Physical-device confirmation remains open.

| ID | Priority / status | Report and next verification |
|---|---|---|
| BUG-01 | Scoped fix verified; physical launch blocker open | Foreground-media playback behind the quiz reproduced; hosting the opaque gate in Ollo pauses the target activity. Normal/200% text and rotation pass. Original sliver did not reproduce; owner-device geometry and apps with background playback still need acceptance. No silent/instant-launch guarantee. |
| BUG-02 | Reproduced and fixed on API36; physical confirmation open | SystemUI panel events incorrectly removed protection. Twelve shade cycles preserve the real 10-minute pause, original deadline and paused target; Android panels remain usable. Confirm on the reported device/OEM. |
| BUG-03 | Volume/Back fix verified; other hardware open | Volume controls preserve quiz progress and protection; Back goes Home without granting access. Normal/200% text and rotation pass. Confirm the owner's other hardware-button actions. |
| BUG-04 | Specific retrigger reproduced and fixed; owner confirmation open | SystemUI context loss stopped refreshing the active grant; a native in-app dialog after 132 quiet seconds retriggered the quiz on baseline. The final APK preserves the intended app and grant through this case. Other causes and the original app/device remain unverified. |

Acceptance for each fix: preserve the failure trace, identify the shared cause, implement the smallest change, and rerun the affected case plus Home, essentials, emergency access and hard-block precedence. Keep physical-device/OEM gaps explicit.

## Current delivery and launch gates

| ID | Status | Remaining work / source |
|---|---|---|
| BUILD-01 | Implemented and scoped native checks passed | Exact0.3.1 APK4ea8eec8…, source0bef8f6:44memory checks/fourviewed captures per font; explicit save/forget, DB read/export, isolation, quiz/hard-block guards. Debug grants cleared explicitly; no natural-expiry/physical claim. |
| BUILD-02 | Complete test APK delivered locally | `artifacts/Ollo-0.3.1-complete-free-testing-debug-2026-10-19.apk`, SHA4ea8eec82b63294c60f18d0bcdb1e6332507aa830fef4804a15089ac1f37ba93.91units,lint0/18,13packagechecks,16KBalignment. All22native captures reviewed. APK ignored byGit; download separately. |
| BUILD-03 | Open, owner inputs | Production signing/update continuity, actual Google Play key, Play app/catalog and real purchase track. Test Store is implemented; production release acceptance is not. See [[REVENUECAT-INTEGRATION]]. |
| BUILD-04 | Reliability debug APK delivered locally | `artifacts/Ollo-0.3.2-blocking-reliability-debug-2026-10-19.apk`, SHA `31ce4da88b4e624a6286e159f39ed8fedd48413bcac3f99ca317de86a61e7829`. 91 unit tests; 43 normal/45 large-text native checks; zero lint errors; 13 package checks; 16 KB alignment. This PC's debug signer differs from earlier APKs; separate test installation required. This frozen APK has an empty RevenueCat key; SDK-enabled startup was checked separately in [[STARTUP-INVESTIGATION-2026-10-19]]. See [[BLOCKING-RELIABILITY-2026-10-19]]. |
| BUILD-05 | 19 October accessibility debug APK | `artifacts/Ollo-0.3.2-accessibility-debug-2026-10-19.apk`, SHA `83ff217e660e772aec333f448e2af8ea9f6bc895444c06a5200d3d8518e56d89`. Countdown announcement fix; 29 scoped TalkBack checks, 91 unit tests, zero lint errors, 13 package checks and 16 KB alignment pass. Same PC debug signer as BUILD-04; earlier laptop installations cannot update in place. See [[ACCESSIBILITY-QA-2026-10-19]]. |
| BUILD-06 | Earlier 20 October test APK | `artifacts/Ollo-0.4.0-personal-plan-debug-2026-10-20.apk`, SHA `cfc37d3923b5771b89d4012e85c69fafbd164a94e011fe59f32d3053ddca9b0c`. 133 units, 76 scoped native checks normal/200%, zero lint errors, 13 package checks and 16 KB alignment. Preserved earlier checkpoint; BUILD-07 is latest. [[PRODUCT-WORK-2026-10-20]]. |
| BUILD-07 | Latest test APK ready, 20 October | `artifacts/Ollo-0.4.2-purpose-reminders-debug-2026-10-20.apk`, SHA `f73cd1b87c9d804aacbebcb609f9338f08c43e3aa4731a964a0b581957fe30ab`. 157 units, 150 native checks/21 normal/200% cases, zero lint errors, 13 package checks and 16 KB alignment. Verified source archive and installed hashes; same PC debug signer, uncommitted, no production publication. [[PRODUCT-WORK-2026-10-20]]. |
| BILL-01 | Dashboard owner-deferred | Configure `lifetime` as one-time/nonconsumable, attach `ollo_pro`, current lifetime-only offering, hosted paywall branding and actual price. Do not ask for browser login again now. Current sandbox catalog price is not the proposed €15 price. |
| BILL-02 | Test Store implemented; live pending | Keep customer-info/entitlement/restore/error/cancel handling and free exit. Verify the production purchase/update/refund lifecycle later; Customer Center only where useful. No real purchase in this run. |
| BILL-03 | Future proposal | Normal blocking, essentials, emergency access and basic stats stay free. Candidate Pro extras/customization need real value and implementation before sale. ~€15 lifetime Ultimate is a hypothesis; Pro Lite needs a provider/reward/privacy/economics decision. No ad SDK or fake rewarded access. See [[LAUNCH-PRICING-AND-PRO-LITE]]. |
| LEGAL-01 | Engineering acceptance passed; owner terms review open | Delivered APK `31ce4da8...`: fresh pinned-catalog check; all 42 Google notice assets plus three base license assets match source; 27 native checks pass at each normal/200% text size, including offline reading, sources, variants, rotation and Back. Scope/evidence: [[DEPENDENCY-NOTICE-ACCEPTANCE-2026-10-19]]. Separate Google SDK terms/authority/applicability review stays open; no blanket legal clearance. See [[GOOGLE-SDK-TERMS-REVIEW]]. |
| LEGAL-02 | Owner inputs / drafts | Actual privacy identity/contact/hosting, source-current Data safety and Accessibility declarations, reviewer video and store-console submission. RevenueCat uses network services; usage/rules remain local. See [[DATA-SAFETY-WORKSHEET]] and [[ACCESSIBILITY-REVIEW-DRAFT]]. |
| QA-STARTUP | Emulator investigation complete; historical cause open | Supplied Test Store key restored in ignored PC config. Separate diagnostic APK `dfd0d417...`: six SDK-enabled API36 startup checks pass, including ordinary/instrumented, offline/online and fresh installs; no ANR. 91 unit tests, zero lint errors, 13 package checks and 16 KB alignment pass. Original 13.741s failure lacks a main-thread stack; low-memory/original host and physical/release acceptance remain open. No speculative performance fix. See [[STARTUP-INVESTIGATION-2026-10-19]]. |
| QA-01 | Scoped TalkBack fix verified; device acceptance open | Official API36 emulator with TalkBack 16: quiet readable countdown, normal/200% exit controls, three-question quiz and large-text landscape pass. This is selected-flow acceptance, not an app-wide accessibility audit. Physical Pixel/Samsung/other OEM, real calls/alarms, battery/reboot/overnight and update lineage remain open. See [[ACCESSIBILITY-QA-2026-10-19]] and project `docs/DEVICE_CHECKLIST.md`. |
| HANDOFF-01 | In progress; Git changes only on request | Preserve reviewed source/evidence and knowledge notes, verify manifests and record hashes, commands, required local inputs and remaining work. Commit/push only when Daniel requests it. APKs/local backups are not automatically included by Git. |

## Product, onboarding and marketing

| ID | Status | Next step |
|---|---|---|
| ONBOARD-01 | Implemented and verified in scoped emulator cases | Exact-package installed suggestions, whole rows, persistent actions, English copy, optional permissions and no forced paywall. User deselections/zero optional selections survive Back/rotation/fresh activity; normal/200% font. Physical/TalkBack remain open. |
| ONBOARD-02 | Personalized setup implemented; user validation open | 0.4.0 has eleven default/twelve optional-history steps with a saved personal reason, counting preference, real settings, late permissions and summary. Native normal/200% default/history completion, Settings return, decline, recreation and persistence pass. No retention lift or app-wide TalkBack claim. [[PRODUCT-WORK-2026-10-20]]. |
| USP-01 | Research saved; experiments pending | Rank useful differentiators against current competitor overlap, not “first/only” claims. Purpose → gentle finish cue, optional remembered choices and context-aware offline alternatives are candidates. See [[LAUNCH-USP-RETENTION]] and [[FEATURE-RESEARCH]]. |
| RETAIN-01 | Research/validation pending | Test graceful re-entry, user-chosen routines and clear progress; avoid punitive streaks or time-in-app goals. Define tester questions and success criteria; do not invent user evidence. |
| STORE-01 | English drafts complete; owner submission pending | Current title/short/full fields and actual-feature/network boundaries saved. No absolute blocking/no-internet claims, unconfigured price or finished-Pro-extra claims. See [[ENGLISH-STORE-LISTING]]. |
| STORE-02 | Six screenshots and artwork prepared | Genuine4eaAPK1080×1920 rawcaptures, six reviewed opaqueRGB frames with outside captions, explicitfictional labels onstats/Today, alttexts and pixel-identity proof. English1024×500featuregraphic and512×512RGBA native-vector icon ready; no upload/approval. See [[STORE-ASSET-PRODUCTION]]. |
| ADS-01 | Scripts prepared; footage pending | Preserve English Google Flow UGC concepts and real recording slots/shot list. Wait for owner footage and authorization before generating video/AI people; do not publish or spend. See [[GLOBAL-UGC-SCRIPTS]] and [[RECORDING-SHOT-LIST]]. |
| USP-02 | Implemented; scoped native acceptance passes | Written reasons/finish cues, explicit remembered defaults, check-in reschedule/dismiss/Home/Ideas, and contextual offline suggestions are in 0.4.2. Real keyboard, system panels, saved text and personal/favorite/filter ordering pass at normal/200%. Completion is self-reported. See [[PRODUCT-WORK-2026-10-20]]. |
| DATA-01 | Implemented; scoped native acceptance passes | Strict settings backup/import has validation, preview, explicit apply, missing-app handling and installation-state preservation. Real picker preview/cancel/restore/save/re-read passes at normal/200%. Existing data exports remain a separate non-restorable format. |
| UX-02 | Widget and optional reminders implemented | 0.4.2 retains the verified mascot widget and adds opt-in local daily reminders. Android denial/allow, private test post/Ideas action, controlled warm background delivery, pending-schedule preservation and cancellation pass at normal/200%. Timing is approximate; physical/OEM/cold-boot/battery acceptance remains open. |
| UNLOCK-01 | Active 20 October scope; unimplemented | Unlock selected apps by a chosen exercise/task, such as push-ups. Completion mechanism, accessible alternatives, essentials/emergency access and earned-access duration are required. See [[PRODUCT-WORK-2026-10-20]]. |
| SCOPE-01 | Active 20 October scope; unimplemented | Selective Shorts/Reels and browser/website filtering require actual enforcement, tested app/browser/language scope and clear consent/privacy. No selective-content blocker or VPN is active. Research is saved; implementation remains open. |

## Explicitly later

- **PostHog:** vendor/workspace, event purpose, consent/privacy/deletion/retention contract and implementation/testing. No SDK added tonight. [[ANALYTICS-PLAN]].
- **Firebase:** decide whether any Firebase service is needed, then project/configuration/privacy and opt-in behavior where applicable. Existing transitive encoder libraries are not a Firebase service integration.
- **Rewarded-ad Pro Lite:** choose a provider and realistic reward contract, model costs, settle consent/age/region/store-policy implications, then implement genuine verified rewards. One minute of ads/day access is unvalidated.
- **Production operations:** store access/testing gates, signing custody, support contact, rollback, owner-approved policy publication, production billing and any selected crash reporting. [[PRODUCTION-READINESS]].
- **Demand and retention validation:** actual tester observations, willingness-to-pay and differentiation tests; Reddit comments and listing descriptions remain anecdotes/claims, not proof.

## Handoff rule

For every bounded milestone record: what changed, what passed with exact APK/source identity, what failed or remains unverified, owned operation cleanup, and the next step. Keep temporary backups, credentials and customer identifiers out of Git. The morning handoff must distinguish shipped code, source-only work, proposals and owner actions.
