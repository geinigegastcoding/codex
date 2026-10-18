# Ollo — what has actually been done

**16–19 October 2026 · About 4 minutes to read**

- A complete **0.3.1 free-testing APK** is ready. It is a tested development build, with production blockers still recorded.
- The overnight loop stops **19 October at 07:00 Amsterdam**. The final capacity window reserves 20%. Nothing was published or installed on your phone; the old review emulator stays stopped.

## App improvements

- **English interface:** screens, onboarding, settings, quizzes, activities, overlays, dates and accessibility descriptions. Your existing names and data remain intact. No language switch yet.
- **Suggested apps:** installed TikTok, Instagram, YouTube and similar apps start as distractions; Maps and WhatsApp as essentials. Every suggested choice is editable. Your deselections survive reopening without being seeded again. YouTube/Maps were tested; WhatsApp was absent on the emulator.
- **Shorter onboarding:** seven steps, starting with app choices. Usage history is an optional nine-step route. Clear progress, persistent app-list actions, zero selections, Back and rotation support, optional permissions and a free exit. “Optional essentials” is now separate from protected calls, alarms and system settings.
- **Intentional opening:** choose a purpose and a 5/10/20-minute check-in. Finish/Home, continue and skip remain available; existing hard rules take precedence. You can now explicitly remember a purpose/time for one app, edit or forget it. It never opens automatically.
- **Statistics:** clearer averages, date ranges, orange charts, app comparisons and expandable details. Unknown and partly measured days remain distinct from zero.
- **Learning and Ideas:** 12 sourced fact cards instead of six, answer checks, simpler topic selection, named favorites and recovery from empty filters. A quiz still contains three questions.
- **Usability:** named full-width app-selection rows; Pro and unsaved routine name/day/app choices survive rotation. Clearer permission states, switches, locked days, privacy/deletion copy and offline licenses. The orange pixel character stays.
- **Reliability work:** export writing moved off the UI thread, accurate completion/retry feedback, neutral cancellation, stale Accessibility-event/Home corrections, usage-calculation improvements and clock-change handling. These earlier fixes do not resolve the newly reported quiz issues below.

## RevenueCat and pricing

- **RevenueCat 10.28.1** installed through Gradle: customer info, `ollo_pro`, one-time `lifetime`, purchase/restore, cancel/error/pending handling and official Paywall presentation. Complete Kotlin/setup guide: [[REVENUECAT-INTEGRATION]].
- Orange native Pro preview added. **Every current feature remains free while you test.** Future themes, learning packs and custom presets are labeled proposals.
- Android 16 Test Store checks covered paywall, cancellation, failure, simulated success, entitlement and restore. No real payment. Production billing remains unverified.
- The observed sandbox returned **$99.99** with generic hosted styling, clearly labeled **Test price**. Your roughly **€15 lifetime Ultimate** and final branding need the dashboard setup you deferred. No further login request.
- **Pro Lite remains research:** optional ad-earned access to future extras. No ad SDK, fake reward or fixed one-minute promise. Normal core features should stay free.

## Research and marketing

- Reviewed Reddit, primary/product sources and LockFeed. Quiz gates, offline storage and purpose prompts have competitors; no unsupported “first” or exclusive USP claim.
- Prioritized purpose → check-in → easy return, remembered choices and useful offline alternatives. Saved discovery questions and retention tests focused on user control, rather than guilt or compulsory streaks. Demand and willingness to pay remain unvalidated.
- Prepared positioning, a 30-day marketing plan, pricing/cost calculator, English support copy and **eight Google Flow UGC scripts with ten recording shots**. They have clearly marked genuine-footage slots; your recordings are still needed before new video/AI-person generation.
- Prepared English Play title/short/full copy, an English feature graphic, an icon rendered from the existing app vector, and **six genuine screenshot layouts**. Fictional stats are labeled. All six layouts were reviewed; nothing was uploaded.
- Earlier Dutch videos, illustrations and concept cards remain archived and unpublished; current marketing is English/global. Obsolete whole-app “no internet” claims are superseded by RevenueCat disclosure.

## Verification and handoff

- Latest build: **91 unit tests passed; lint 0 errors / 18 existing warnings; 13 package checks and 16 KB alignment**. On Android 16, remembered choices passed 44 checks per font and onboarding 40 per font, at normal/200% text; all 22 captures reviewed. Earlier suites retain separate scopes.
- Source and APK hashes, logs, failed attempts and exact limits are saved. The owned emulator’s original APK, nine private files, settings and display size were restored and it was stopped.
- Added owner-signing and production-key guards with no debug fallback. Recovered missing license records, reviewed Google SDK terms and traced the billing dependency chain. Final notices, privacy identity/contact, Play configuration, minified production billing and physical/OEM/TalkBack checks remain open.
- **Your four new reports are not fixed:** background app/audio during quiz, notification-shade bypass, hardware-button quiz exit and unexpected quiz retriggers. The first two block a public-ready claim. A debug/emulator startup ANR is also recorded; its cause is unresolved.
- [[BACKLOG]] is the single unfinished-work list, including PostHog, Firebase services, ads and owner decisions. Source and evidence are pushed on the Ollo branch; the knowledge repository carries the final report and assets. Pull both repositories. PC instructions: project `docs/OVERNIGHT_HANDOFF.md`.

**APK:** `projecten/Ollo/artifacts/Ollo-0.3.1-complete-free-testing-debug-2026-10-19.apk` — source `0bef8f6`, SHA-256 `4ea8eec82b63294c60f18d0bcdb1e6332507aa830fef4804a15089ac1f37ba93`.

Download the APK separately; Git ignores build artifacts. Preserve your existing installation until signing compatibility is checked. JSON exports cannot restore the app’s data.
