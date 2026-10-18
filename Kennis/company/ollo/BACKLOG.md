---
title: Ollo launch and future-work backlog
updated: 2026-10-18
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
| BUILD-01 | Memory native scope passed | Exact0.3.1 candidate `b35661d1…`, source `6f798f9`:44debug/native checks and4parent-viewed captures per font(normal/200%). Persistence read, export, isolation, explicit save/forget, quiz/hard-block guards pass. Debug grants cleared explicitly; no natural-expiry/physical claim. Seven/nine-step onboarding acceptance still pending. |
| BUILD-02 | In progress | Package the final tested APK with SHA-256, exact source commit, Gradle checks and scoped runtime results. Stable fallback is the editor-row APK `c2adee7f…`; never promote a failed or untested candidate. |
| BUILD-03 | Open, owner inputs | Production signing/update continuity, actual Google Play key, Play app/catalog and real purchase track. Test Store is implemented; production release acceptance is not. See [[REVENUECAT-INTEGRATION]]. |
| BILL-01 | Dashboard owner-deferred | Configure `lifetime` as one-time/nonconsumable, attach `ollo_pro`, current lifetime-only offering, hosted paywall branding and actual price. Do not ask for browser login again now. Current sandbox catalog price is not the proposed €15 price. |
| BILL-02 | Test Store implemented; live pending | Keep customer-info/entitlement/restore/error/cancel handling and free exit. Verify the production purchase/update/refund lifecycle later; Customer Center only where useful. No real purchase in this run. |
| BILL-03 | Future proposal | Normal blocking, essentials, emergency access and basic stats stay free. Candidate Pro extras/customization need real value and implementation before sale. ~€15 lifetime Ultimate is a hypothesis; Pro Lite needs a provider/reward/privacy/economics decision. No ad SDK or fake rewarded access. See [[LAUNCH-PRICING-AND-PRO-LITE]]. |
| LEGAL-01 | Evidence reviewed; final notice/owner review open | Five Google client AARs/primary terms and hashes reviewed; compare their embedded third-party catalogs with final runtime and bundled notices. Do not infer applicable notices or agreement authority from POM labels alone. All17missing primaryPOMs recovered. See [[GOOGLE-SDK-TERMS-REVIEW]] and [[LAUNCH-DEPENDENCY-LICENSES]]. |
| LEGAL-02 | Owner inputs / drafts | Actual privacy identity/contact/hosting, source-current Data safety and Accessibility declarations, reviewer video and store-console submission. RevenueCat uses network services; usage/rules remain local. See [[DATA-SAFETY-WORKSHEET]] and [[ACCESSIBILITY-REVIEW-DRAFT]]. |
| QA-STARTUP | Observed; investigation open | New API36debug/instrumented post-install startup ANR before feature results (13.741s display); a separate cold MainActivity launch completed in5.492s. Host had about1.3GiBfreeRAM. Resource/bytecode verification load observed, cause not established; reproduce outside instrumentation/on hardware before a performance claim. Evidence: project `docs/evidence/2026-10-19-opening-memory-native/confirmed/normal-startup-failed/`. |
| QA-01 | Open | Physical Pixel/Samsung/other OEM, TalkBack, real calls/alarms, battery/reboot/overnight and update-lineage acceptance; do not substitute the API36 emulator. See project `docs/DEVICE_CHECKLIST.md`. |
| HANDOFF-01 | In progress | Commit reviewed source/evidence and knowledge notes, verify manifests, push normal task branches if access permits; no force push or merge. Record hashes, commands, required local inputs and remaining work so PC pull is useful. APKs/local backups are not automatically included by Git. |

## Product, onboarding and marketing

| ID | Status | Next step |
|---|---|---|
| ONBOARD-01 | Implemented; continue scoped review | Exact-package installed-app defaults for distractions/essentials, editable whole rows, persistent actions, English copy and skippable permissions. Test that owner edits and zero selections survive; no forced paywall. |
| ONBOARD-02 | Implemented; native checks in progress | Seven-step app-choice-first path; optional nine-step usage-history route, Back/rotation/zero-selection/free-completion checks underway on exact0.3.1 candidate. Personal intention/retention experiments remain optional research, no telemetry added. |
| USP-01 | Research saved; experiments pending | Rank useful differentiators against current competitor overlap, not “first/only” claims. Purpose → gentle finish cue, optional remembered choices and context-aware offline alternatives are candidates. See [[LAUNCH-USP-RETENTION]] and [[FEATURE-RESEARCH]]. |
| RETAIN-01 | Research/validation pending | Test graceful re-entry, user-chosen routines and clear progress; avoid punitive streaks or time-in-app goals. Define tester questions and success criteria; do not invent user evidence. |
| STORE-01 | In progress | Refresh English Play text for actual 0.3.0 English UI and RevenueCat boundary; old Dutch/no-internet passages are historical. Verify field limits and avoid absolute blocking claims while BUG-01/02 remain. |
| STORE-02 | Open | Capture genuine clean app screens, prepare orange/pixel screenshot layouts and feature graphic, verify required sizes and readability, retain originals and sources. Label staged demo data; no fake app UI or unpublished extras. |
| ADS-01 | Scripts prepared; footage pending | Preserve English Google Flow UGC concepts and real recording slots/shot list. Wait for owner footage and authorization before generating video/AI people; do not publish or spend. See [[GLOBAL-UGC-SCRIPTS]] and [[RECORDING-SHOT-LIST]]. |

## Explicitly later

- **PostHog:** vendor/workspace, event purpose, consent/privacy/deletion/retention contract and implementation/testing. No SDK added tonight. [[ANALYTICS-PLAN]].
- **Firebase:** decide whether any Firebase service is needed, then project/configuration/privacy and opt-in behavior where applicable. Existing transitive encoder libraries are not a Firebase service integration.
- **Rewarded-ad Pro Lite:** choose a provider and realistic reward contract, model costs, settle consent/age/region/store-policy implications, then implement genuine verified rewards. One minute of ads/day access is unvalidated.
- **Production operations:** store access/testing gates, signing custody, support contact, rollback, owner-approved policy publication, production billing and any selected crash reporting. [[PRODUCTION-READINESS]].
- **Demand and retention validation:** actual tester observations, willingness-to-pay and differentiation tests; Reddit comments and listing descriptions remain anecdotes/claims, not proof.

## Handoff rule

For every bounded milestone record: what changed, what passed with exact APK/source identity, what failed or remains unverified, owned operation cleanup, and the next step. Keep temporary backups, credentials and customer identifiers out of Git. The morning handoff must distinguish shipped code, source-only work, proposals and owner actions.
