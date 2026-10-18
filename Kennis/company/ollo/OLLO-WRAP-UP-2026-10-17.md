# Ollo — what has actually been done

**16–18 October 2026 · Updated after the launch restart · About 3 minutes to read**

- The improvement loop is active, preserving the original goal/timer. Scheduled checks reserve capacity near the usage limit and resume after a confirmed reset. This laptop and Codex must be available.
- Everything is local work. Your phone and old stopped review emulator remain untouched; nothing was published.

## App improvements

- **English UI:** translated screens, onboarding, settings, quizzes, activities, overlays, dates and accessibility descriptions. Existing names/data remain intact; no language switch yet.
- **Editable setup defaults:** installed TikTok/Instagram/YouTube and similar apps are suggested as distractions; Maps/WhatsApp as essentials. Exact package IDs, editable choices, no later reseeding. YouTube/Maps were checked natively; WhatsApp was absent from that emulator.
- **Better onboarding:** clearer explanations, step progress and selected-app summaries. Continue buttons stay above the app list and keyboard, including at 200% text. Permissions can be deferred; calls, alarms and system controls remain protected.
- **Rotation fixes:** Pro stays open. Unsaved time-block names/day/app choices and morning days survive rotation at normal/200% text, while still requiring Save.
- **Statistics:** clearer averages, dates, coverage, orange charts, app comparisons and expandable detail. Unknown data stays distinct from zero.
- **Intentional opening:** optional purpose and a 5/10/20-minute check-in, with finish/Home, continue and skip choices. Existing rules still win. Optional remembered choices are now coded and unit-tested; native acceptance is pending.
- **Learning and Ideas:** facts expanded from 6 to 12 sourced cards, correct-answer checks, simpler topic selection, named favorites and filter recovery. Quizzes still ask three questions.
- **Reliability:** exports run off the UI thread with accurate completion/retry handling; canceled pickers stay neutral. Fixed stale Accessibility events that could block Home, repeated usage calculations and clock-change cases.
- **Controls and design:** tappable app rows, clearer permission states, named switches, locked weekday controls, privacy/deletion explanations and offline licenses. Orange pixel character preserved.

## RevenueCat and pricing

- Integrated **RevenueCat 10.28.1** through Gradle: customer info, active `ollo_pro`, one-time `lifetime`, purchase/restore, cancel/error/pending handling and official Paywall presentation. Full code/setup guide: [[REVENUECAT-INTEGRATION]].
- Added the orange Pro preview. **Every current feature stays free during testing.** Themes, extra learning packs and custom presets are clearly labeled ideas.
- Android 16 Test Store checks covered SDK paywall, cancel, failure, valid simulation, entitlement and restore. Access survived an APK update. No real payment.
- The sandbox currently returns **$99.99** and a generic pink hosted paywall. The native page labels it **Test price**. Your **roughly €15 lifetime Ultimate** proposal and final branding still need the dashboard setup you deferred. No further sign-in request.
- **Pro Lite is research only:** optional ad-earned access to future extras, without a fixed 60-second promise. No ad SDK or fake reward. Normal blocking, essentials, emergency access, routines and current statistics should remain free.

## Research and marketing

- Reviewed Reddit, research/product sources and LockFeed. Quizzes, offline storage and saved progress already exist elsewhere; no invented exclusive USP.
- Prioritized purpose → check-in → calm return and optional remembered choices. Other proposals: personal alternatives, recovery/import, recall practice, widget and selective-feed boundaries. Demand remains unvalidated.
- Retention guidance favors helpful return and user control over guilt, compulsory streaks or nagging. Saved usability/follow-up questions; no analytics installed.
- Prepared a 30-day marketing plan, positioning/store drafts, support replies and **8 English Google Flow UGC scripts with 10 recording shots**, using genuine-footage slots. No new videos or AI people generated.
- Earlier Dutch concepts include 2 short videos, 2 illustrations, 2 concept cards and a Play graphic. They remain unpublished. Obsolete no-internet claims are marked; current marketing is English/global.
- Built an offline pricing calculator and researched store/RevenueCat costs. Prices and paid demand remain hypotheses. See [[LAUNCH-USP-RETENTION]] and [[LAUNCH-PRICING-AND-PRO-LITE]].

## Verified, and still needed

- Current emulator-verified APK: **87 unit tests passed**, lint **0 errors / 18 existing warnings**, 13 debug-package checks and 16 KB alignment. Onboarding/rotation confirmation covers **30 reviewed captures**; the latest app-row patch has a separate **6-capture normal/200% check**. New remembered-choice source passes **91 unit tests** and lint 0/18; it awaits native checks and is not in the linked test APK. Earlier English acceptance separately covered 370 checks/90 captures; these scopes are not added together.
- Retrieved all 17 missing primary license records: 12 Apache declarations resolved; **5 Google SDK terms still need distribution review**. Updated packaged notices and privacy drafts. Usage/rules stay local; RevenueCat purchase services use the network.
- Remaining launch work: owner signing/Play setup, branded offer and real store testing, public privacy contact/policy, physical/OEM/TalkBack acceptance, minified RevenueCat release and SDK terms. PostHog, Firebase services and ads remain unconfigured.
- **Editor app selection:** app names and checkbox now form one named, full-width tap target. Six normal/200% captures verify off→on→off and correct counts; TalkBack itself is still pending. Old emulator restoration remains deferred; its backup is intact.

[Complete free-preview test APK](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/artifacts/Ollo-0.3.0-free-preview-accessible-debug-2026-10-18.apk): development-signed/Test Store. Preserve your existing installation until signing compatibility is checked; JSON exports cannot restore data.

Recordings: [[RECORDING-SHOT-LIST]], [[GLOBAL-UGC-SCRIPTS]]. Supporting documents: [[README]].
