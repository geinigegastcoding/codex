---
title: Ollo launch and future-work backlog
updated: 2026-10-19
type: project
status: active
---

# Ollo backlog

One place for unfinished work. Completed work and detailed evidence remain in [[README]], [[CONTINUOUS-IMPROVEMENT]] and [[OLLO-WRAP-UP-2026-10-17]]. A proposal is not an implemented feature. Update status and evidence when work changes.

## Overnight agreement

- Stop the improvement loop **19 October 2026, 07:00 Europe/Amsterdam (05:00 UTC)**. Aim to finish the APK and handoff by 06:40. This replaces the unlimited loop for this run.
- Use two natural windows only. First reset confirmed 18 October 21:56 UTC; next reported reset **19 October 02:56:55 UTC / 04:56:55 Amsterdam (1792378615)**. First window closes at 10% remaining and reserves 5%; final window closes at 25% and stops substantive work at **20% remaining**. Never use reset credits. Weekly capacity also applies.
- Deliver the best verified downloadable APK, checksums, scope and Git handoff. Do not call a test APK production ready while blockers remain.
- Keep all current features free. Keep the native Pro/paywall preview, editable defaults, onboarding, USP/pricing/retention research and English store assets in scope. Gradle and the official Android Emulator only; Luna delegates only.

## Reported bugs: dedicated follow-up, not silently fixed

Owner reported these on 18 October; device, OS and exact APK have not yet been recorded. No new reproduction or fix is claimed. Owner asked to retain these for later while preparing the build. Earlier scoped emulator passes do not disprove these reports.

| ID | Priority / status | Report and next verification |
|---|---|---|
| BUG-01 | Public-launch blocker; reported, deferred | App starts behind the quiz: a sliver is visible and audio already plays. Record the tested app/version, cold/warm start, media state and overlay geometry; assess what Android can actually prevent before promising silent/instant blocking. |
| BUG-02 | Public-launch blocker; reported, deferred | Pulling down notifications during a 10-minute pause exposes the blocked app for about a second; repeated use can keep it usable until another action triggers blocking. Reproduce shade open/close repeatedly with a real fixed pause, including playback and no-touch periods. |
| BUG-03 | High; reported, deferred | Volume-down or another hardware-button action exits the quiz. Verify volume panel/system-window transitions, quiz progress and whether access was granted. |
| BUG-04 | High; reported, deferred | An action inside an already opened app sometimes retriggers the quiz. Record foreground transitions, app activity, existing grant expiry and quiz state; distinguish an expired grant from an unintended new quiz. |

Acceptance for each fix: preserve the failure trace, identify the shared cause, implement the smallest change, and rerun the affected case plus Home, essentials, emergency access and hard-block precedence. Keep physical-device/OEM gaps explicit.

## Current delivery and launch gates

| ID | Status | Remaining work / source |
|---|---|---|
| BUILD-01 | Implemented and scoped native checks passed | Exact0.3.1 APK4ea8eec8…, source0bef8f6:44memory checks/fourviewed captures per font; explicit save/forget, DB read/export, isolation, quiz/hard-block guards. Debug grants cleared explicitly; no natural-expiry/physical claim. |
| BUILD-02 | Complete test APK delivered locally | `artifacts/Ollo-0.3.1-complete-free-testing-debug-2026-10-19.apk`, SHA4ea8eec82b63294c60f18d0bcdb1e6332507aa830fef4804a15089ac1f37ba93.91units,lint0/18,13packagechecks,16KBalignment. All22native captures reviewed. APK ignored byGit; download separately. |
| BUILD-03 | Open, owner inputs | Production signing/update continuity, actual Google Play key, Play app/catalog and real purchase track. Test Store is implemented; production release acceptance is not. See [[REVENUECAT-INTEGRATION]]. |
| BILL-01 | Dashboard owner-deferred | Configure `lifetime` as one-time/nonconsumable, attach `ollo_pro`, current lifetime-only offering, hosted paywall branding and actual price. Do not ask for browser login again now. Current sandbox catalog price is not the proposed €15 price. |
| BILL-02 | Test Store implemented; live pending | Keep customer-info/entitlement/restore/error/cancel handling and free exit. Verify the production purchase/update/refund lifecycle later; Customer Center only where useful. No real purchase in this run. |
| BILL-03 | Future proposal | Normal blocking, essentials, emergency access and basic stats stay free. Candidate Pro extras/customization need real value and implementation before sale. ~€15 lifetime Ultimate is a hypothesis; Pro Lite needs a provider/reward/privacy/economics decision. No ad SDK or fake rewarded access. See [[LAUNCH-PRICING-AND-PRO-LITE]]. |
| LEGAL-01 | Notice correction in progress; owner review open | Full123-coordinate scan:12embedded catalog pairs(3empty),76component names/79variants/41distinct exact notice texts. Generator/native viewer prepared; newerAPK build/native acceptance pending. Frozen4ea retained. Separate Google SDK terms/authority/applicability review stays open; no blanket legal clearance. See [[GOOGLE-SDK-TERMS-REVIEW]] and [[LAUNCH-DEPENDENCY-LICENSES]]. |
| LEGAL-02 | Owner inputs / drafts | Actual privacy identity/contact/hosting, source-current Data safety and Accessibility declarations, reviewer video and store-console submission. RevenueCat uses network services; usage/rules remain local. See [[DATA-SAFETY-WORKSHEET]] and [[ACCESSIBILITY-REVIEW-DRAFT]]. |
| QA-STARTUP | Observed; investigation open | New API36debug/instrumented post-install startup ANR before feature results (13.741s display); a separate cold MainActivity launch completed in5.492s. Host had about1.3GiBfreeRAM. Resource/bytecode verification load observed, cause not established; reproduce outside instrumentation/on hardware before a performance claim. Evidence: project `docs/evidence/2026-10-19-opening-memory-native/confirmed/normal-startup-failed/`. |
| QA-01 | Open | Physical Pixel/Samsung/other OEM, TalkBack, real calls/alarms, battery/reboot/overnight and update-lineage acceptance; do not substitute the API36 emulator. See project `docs/DEVICE_CHECKLIST.md`. |
| HANDOFF-01 | In progress | Commit reviewed source/evidence and knowledge notes, verify manifests, push normal task branches if access permits; no force push or merge. Record hashes, commands, required local inputs and remaining work so PC pull is useful. APKs/local backups are not automatically included by Git. |

## Product, onboarding and marketing

| ID | Status | Next step |
|---|---|---|
| ONBOARD-01 | Implemented and verified in scoped emulator cases | Exact-package installed suggestions, whole rows, persistent actions, English copy, optional permissions and no forced paywall. User deselections/zero optional selections survive Back/rotation/fresh activity; normal/200% font. Physical/TalkBack remain open. |
| ONBOARD-02 | Implemented; discovery still open | Seven-step app-choice-first route plus optional nine-step history. Exact4eaAPK passed40native checks/sevenviewed captures per font, including free completion with permissions declined. Optional intention/retention experiments remain research; no telemetry. |
| USP-01 | Research saved; experiments pending | Rank useful differentiators against current competitor overlap, not “first/only” claims. Purpose → gentle finish cue, optional remembered choices and context-aware offline alternatives are candidates. See [[LAUNCH-USP-RETENTION]] and [[FEATURE-RESEARCH]]. |
| RETAIN-01 | Research/validation pending | Test graceful re-entry, user-chosen routines and clear progress; avoid punitive streaks or time-in-app goals. Define tester questions and success criteria; do not invent user evidence. |
| STORE-01 | English drafts complete; owner submission pending | Current title/short/full fields and actual-feature/network boundaries saved. No absolute blocking/no-internet claims, unconfigured price or finished-Pro-extra claims. See [[ENGLISH-STORE-LISTING]]. |
| STORE-02 | Six screenshots and artwork prepared | Genuine4eaAPK1080×1920 rawcaptures, six reviewed opaqueRGB frames with outside captions, explicitfictional labels onstats/Today, alttexts and pixel-identity proof. English1024×500featuregraphic and512×512RGBA native-vector icon ready; no upload/approval. See [[STORE-ASSET-PRODUCTION]]. |
| ADS-01 | Scripts prepared; footage pending | Preserve English Google Flow UGC concepts and real recording slots/shot list. Wait for owner footage and authorization before generating video/AI people; do not publish or spend. See [[GLOBAL-UGC-SCRIPTS]] and [[RECORDING-SHOT-LIST]]. |
| USP-02 | Future discovery | Free-text purposes, user-chosen task-finish conditions and richer offline alternatives need discovery before implementation. Current preset/timed cue and remembered choices are built; no automatic detection of sent messages or task completion. See [[FEATURE-RESEARCH]]. |
| DATA-01 | Future proposal | Accountless settings backup/import with validation, migration and recovery. Current CSV/JSON exports are not an import or device-restore feature. |
| UX-02 | Future proposals | Mascot home-screen widget and optional background reminders. The Quick Settings tile already exists; no new notification permission or background reminder service was added. |
| SCOPE-01 | Deferred roadmap | Selective Shorts/Reels and browser/website filtering need app-version/language compatibility, consent/privacy and platform-policy decisions. No selective-content blocker or VPN is active. Retain these as proposals, not launch claims. |

## Explicitly later

- **PostHog:** vendor/workspace, event purpose, consent/privacy/deletion/retention contract and implementation/testing. No SDK added tonight. [[ANALYTICS-PLAN]].
- **Firebase:** decide whether any Firebase service is needed, then project/configuration/privacy and opt-in behavior where applicable. Existing transitive encoder libraries are not a Firebase service integration.
- **Rewarded-ad Pro Lite:** choose a provider and realistic reward contract, model costs, settle consent/age/region/store-policy implications, then implement genuine verified rewards. One minute of ads/day access is unvalidated.
- **Production operations:** store access/testing gates, signing custody, support contact, rollback, owner-approved policy publication, production billing and any selected crash reporting. [[PRODUCTION-READINESS]].
- **Demand and retention validation:** actual tester observations, willingness-to-pay and differentiation tests; Reddit comments and listing descriptions remain anecdotes/claims, not proof.

## Handoff rule

For every bounded milestone record: what changed, what passed with exact APK/source identity, what failed or remains unverified, owned operation cleanup, and the next step. Keep temporary backups, credentials and customer identifiers out of Git. The morning handoff must distinguish shipped code, source-only work, proposals and owner actions.
