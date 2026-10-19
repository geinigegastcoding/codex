# Luna — first-launch readiness and marketing research

Research date: **15 October 2026**. Scope: current Android project, existing test evidence, current official platform/provider guidance, and independent product/business assessment.

**Recommendation:** start building an interested beta audience now, then run a small, properly prepared Play beta. A public paid launch is premature. The main work is dependable everyday logging, durable data, production release setup, privacy/account controls, and proving repeat use. Public AI scanning adds a separate commercial and provider-readiness gate.

Working assumptions: Android first; adults 18+; Netherlands/EU first; existing pixel identity; free local diary with optional Pro. These are recommendations where the owner has not made a final decision. Automatic cloud synchronization is explicitly deferred by the owner and is not a launch requirement for this version.

## 1. What is already in place

- Personalized onboarding, editable calorie targets, coherent macro targets, maintenance goals, units, and an initial 18+/pregnancy-breastfeeding eligibility screen.
- Manual food entry, barcode lookup, portions, meals, edits/deletion, favorites, recent foods, reusable meals, and history.
- A clear home dashboard, readable pixel number font, visual insights, and five widget styles with the requested evening streak-risk variant.
- Nutrition source/error handling, local JSON export/import, recovery safeguards, and confirmed local-data deletion.
- Optional account and Pro integrations, bounded photo requests, server-side authorization/quota mechanisms, and an AI kill switch.
- Bundled font licenses and generated-art provenance for the recent angry sprites.
- Recorded debug verification on 14 October: **98 unit tests**, lint with **0 errors / 60 warnings**, and **18 distinct native checks** across targeted reruns on API 35. This is useful prototype evidence, not production, physical-device, purchase, retention, or clinical validation.

Sources: [feature audit](C:/Users/Daniël/Desktop/Codex/Kennis/company/calorie-tracker-feature-audit-2026-10-13.md), [verification record](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/design/pixel-ui/verification/2026-10-14-feedback.json).

## 2. Findings that change the launch plan

### A. Food coverage is the largest immediate adoption risk

Current text search combines saved foods, recent foods, bundled dishes, and sample foods. It is not a broad live food-name database. A new user searching ordinary foods in Dutch may encounter an almost empty experience even though barcode lookup works.

Before advertising a general calorie counter, test actual breakfasts, supermarket products, home cooking, and restaurant meals. Use a representative Dutch set across several supermarkets, not only Jumbo. Measure successful matching, serving clarity, and correction effort. If coverage fails, add an appropriate licensed search source or narrow the first promise to a barcode/manual diary with repeat meals.

The dish catalog is precomputed Food entries with stock photographs. Saved ingredient collections provide meal-building functionality, but marketing should not imply that every pictured dish has a fully specified, weighed recipe and yield.

Evidence: [search composition in LunaApp.kt](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/java/com/magisdata/luna/ui/LunaApp.kt:1287), [dish catalog](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/java/com/magisdata/luna/data/RecipeCatalog.kt).

### B. The diary has a plausible long-term capacity failure

The 1,000,000-byte limit named MAX_IMPORT_BYTES also applies to loading, saving, and exporting the entire diary. A synthetic logs-only JSON document with **2,920 entries — eight per day for one year — measured 1,086,250 bytes** using the source field names and compact integral values. Profile, saved foods/meals, water, and target history were excluded.

This was a serialized-size estimate using repeated sample-food records, not an Android runtime failure or performance benchmark. The source nevertheless establishes a real persistence ceiling that ordinary sustained use can approach.

Required action: run Android save/load/export/import tests with realistic one- and three-year datasets, choose a suitable bounded storage design/capacity, and verify recovery and upgrade behavior. Do not make long-term users delete their history to keep logging. Measure before deciding whether a larger safe bound or structured storage is necessary.

Evidence: [size limit](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/java/com/magisdata/luna/data/AppRepository.kt:25), [save validation](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/java/com/magisdata/luna/data/AppRepository.kt:233), [serialization](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/java/com/magisdata/luna/data/AppRepository.kt:388).

### C. The free testing scanner configuration is not an EEA production plan

Gemini's current terms require eligible paid services for API clients offered in the EEA/UK/Switzerland and restrict clients directed at or likely to be accessed by under-18s. The present scanner guide specifies billing-unlinked free-tier testing. Resolve the provider setup and age/branding implications before offering this feature publicly, or keep AI outside the first public feature set. [Gemini terms](https://ai.google.dev/gemini-api/terms).

Adult confirmation is already in onboarding. Review actual acquisition audiences and access; a checkbox alone does not establish the provider's complete eligibility assessment.

Production scanning is disabled in the checked-in Worker configuration. Development is allowlisted and capped at 20 scans/day and 100/month globally. Release Firebase, scanner URL, Integrity project, and RevenueCat public-key properties were unset in this laptop's checked user-level configuration; no Firebase JSON configuration was present in this checkout. CI or another computer may supply different values.

Evidence: [scanner setup](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/server/README.md), [Worker configuration](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/server/wrangler.jsonc), [release configuration](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/build.gradle.kts).

### D. Pro needs a credible service and unit economics

The planned monthly/yearly/lifetime offering needs actual Play products, consumer prices, entitlements, and purchase lifecycle verification. The code's Test Store key does not establish this.

Production scanner defaults are 200 scans/day and 3,000/month for the whole deployment, plus account limits. At two scans/day for a 30-day month, the monthly global allowance covers about **50 daily scanners**. Capacity must match the offer and expected cohort. Failed admitted requests can consume quota; explain or improve that experience before selling credits or promising availability.

A lifetime purchase attached to the same Pro entitlement can create ongoing AI/support costs after revenue stops. Recommend monthly/yearly AI access, or an explicitly bounded lifetime offer whose continuing costs are funded. Any existing customer commitments must be preserved.

Calculate contribution from the actual tax/store arrangement and usage:
**net receipts after taxes/store fees/refunds − RevenueCat/platform costs − AI usage − hosting − support.**
Measure cost per successful reviewed scan, including unsuccessful requests and provider changes. Budgets/alerts and enforced request limits are separate controls; test the actual stopping behavior.

[Play service fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en), [current model pricing](https://ai.google.dev/gemini-api/docs/pricing), [quota implementation](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/server/src/quota.mjs).

### E. Local deletion does not satisfy account-deletion readiness

The implemented delete action resets the on-device diary and photos. AccountAuth offers registration, sign-in, verification, password reset, and sign-out, but no account-deletion operation was found.

For account creation, Google requires an in-app deletion path and an external web resource for requesting deletion of the account and associated data. Build a real request/verification/follow-through process covering Firebase, relevant service records, and disclosed retention exceptions. Explain subscription cancellation and local diary behavior separately. [Google account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en).

Do not label a local reset as account deletion. If accounts are excluded from the first public release, remove the account creation paths from that release and reassess its actual scope.

Evidence: [account implementation](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/java/com/magisdata/luna/data/AccountAuth.kt), [local deletion](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/java/com/magisdata/luna/data/AppRepository.kt:199).

### F. Privacy needs a verified data flow, not a broad “private app” claim

The code starts PostHog opted out and globally masks text/images when enabled. I checked the pinned 3.64.1 SDK source: despite its name, maskAllTextInputs covers text as well as text inputs. This audit does **not** establish exposed diary text.

However, replay is enabled in code, the pinned replay configuration defaults to capturing logcat, and the visible consent describes optional “usage events.” Before enabling analytics publicly:
- Prefer events-only analytics for the first release unless replay has a clear need and suitable disclosure/consent.
- Explicitly decide log capture, sanitize error content, and verify traffic before consent and after withdrawal.
- Allowlist event properties; “food logged” currently forwards the Food.source string.
- Choose the processing region deliberately: the current PostHog host is the US endpoint. Do not promise EU-only processing without verifying every relevant provider.

The checked user-level Gradle configuration has no PostHog key, so SDK wiring alone does not prove a working launch dashboard or a live privacy incident.

Evidence: [Analytics.kt](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/java/com/magisdata/luna/data/Analytics.kt), [consent wording](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/java/com/magisdata/luna/ui/LunaApp.kt:1980), [pinned SDK source archive](https://repo.maven.apache.org/maven2/com/posthog/posthog-android/3.64.1/posthog-android-3.64.1-sources.jar).

### G. “Luna” needs clearance and a stronger reason to switch

A [Luna fasting app](https://play.google.com/store/apps/details?id=com.luna.fastingpro) already advertises AI food scanning and calorie counting. This creates a naming/search-discovery concern; it does not prove a trademark violation. Search relevant registries, related names, domains, and social handles before investing in promotion. [BOIP name checker](https://namechecker.boip.int/).

[Cronometer's free barcode offer](https://cronometer.com/) and [YAZIO's AI/manual/barcode offer](https://www.yazio.com/en) also show that those features alone are not a distinctive pitch. My working recommendation is a cozy Android diary with an appealing widget and easy portion correction. Validate that the companion improves repeat use after its initial novelty.

### H. Test users need a deliberate path into the real app

Luna (Test) uses com.magisdata.luna.debug; production uses com.magisdata.luna. They are separate Android applications. Sharing a debug key between PCs fixes a development-signing issue, but does not configure production signing or migrate Test data into production.

Use the production package and signing strategy for Play testing where practical. For existing debug users, document export/import and the missing-photo-file limitation. Verify app updates preserve diary, targets, saved foods, and photos.

Production Integrity checks need the **Play app-signing certificate**, not an assumed laptop debug or upload certificate. Test an actual Play-delivered build, including the review/test account path. [Android signing](https://developer.android.com/studio/publish/app-signing), [Integrity verdicts](https://developer.android.com/google/play/integrity/verdicts).

## 3. Mandatory and conditional launch work

“Observed” means supported by local source/artifacts. “Unverified” means evidence or external dashboard access was unavailable; it does not mean the owner has never done it.

| Work | Current status | Evidence needed to finish | When |
| --- | --- | --- | --- |
| Developer/seller identity | Play account type and verification unverified | Correct account for the business/health category; verified identity/contact/payment profile, organization details and D-U-N-S where applicable | Start now |
| Production access | Account-specific requirements unverified | If a personal account created after 13 November 2023 is used, at least 12 continuously opted-in testers for 14 days, then production-access approval; retain genuine testing feedback | Before production |
| Release identity and signing | Debug support present; release signing absent in Gradle | Reserve final package/name, Play App Signing/upload key, secure recoverable key custody on both machines/CI, increasing versionCode, signed AAB and clean build instructions | Before Play beta |
| API and native compatibility | Target 37/minimum 26 observed; current Play minimum is 36 | Test supported minimum and current target behaviors, merged permissions, native ABI/16 KB support, release build install/update | Before production |
| Health declaration and listing purpose | Adult onboarding safeguards present; Console declaration unverified | Accurate Nutrition and Weight Management declaration, intended users/purpose, required health disclosures and non-medical wording in app/listing | Before applicable Play tracks |
| Privacy and Data safety | Local controls present; public policy/Console answers unverified | Public accessible policy plus in-app link; truthful collected/shared/optional data answers covering all SDKs/providers; retention/deletion/security and contact details | Before external users |
| Account deletion | Local reset observed; full account path missing | In-app account deletion request, accessible named web request page, identity verification, associated-data handling and completion process | Before public accounts |
| Consent and third-party photo processing | Review flow exists; legal/vendor readiness unverified | Explain photo destination and processing before upload; separate optional analytics/marketing choices; verify opt-out and withdrawal | Before external use |
| EU privacy work | Unverified | Controller identity, lawful bases and health-data assessment, vendor agreements, transfer safeguards, rights handling, retention schedule, and DPIA screening | Before relevant processing |
| Billing | Test integration observed | Real Play products/base plans/prices/currency/tax disclosures, RC mapping, purchase/restore/pending/refund/renewal/expiry/grace/account-switch tests, cancellation/support route | If selling Pro |
| AI production | Disabled/default release configuration missing locally | Eligible provider plan; production Firebase, backend and Play Integrity; secure secrets; measured quality/cost/latency; quotas, access checks and outage behavior | If shipping AI |
| Reviewer access | Not verified | Stable review credentials/instructions for verified sign-in and gated Pro/AI features; no accidental owner-only allowlist or impossible verification flow | Before review |
| Nutrition quality and rights | Source labels and bounded parsing observed; full validation open | Correct per-100 g/per-serving/raw/cooked/liquid handling; unknown-data behavior; source attribution, license review and correction route; representative meal/label tests | Before production |
| Support and service terms | No app support/privacy/terms route found in the inspected UI | Working support inbox and in-app contact, FAQs, service limits, applicable paid contract/cancellation disclosures, issue triage owner | Before external users/paid offers |
| Security and release hygiene | Important safeguards exist; final review unverified | Review release components, authentication/authorization, imports, photos, network limits and dependencies; no private service keys in client; resolve material findings | Before production |
| Updates and recovery | Local recovery exists; production lifecycle unverified | Successful upgrade with real diary; durable export/import; recovery/hotfix procedure and versioning; storage capacity checks | Before production |
| Operations | Kill switch and quotas present; operating process unverified | Error/vitals view, request-failure and quota/cost visibility, alert destinations, support owner, incident/deletion process and provider outage drill | Before paid/public scale |

Current official guidance:
- Google says commercial/business and relevant health providers should choose an organization account; an organization account requires D-U-N-S. Check the actual Console category early. [Account type](https://support.google.com/googleplay/android-developer/answer/13634885?hl=en), [identity requirements](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en).
- New personal-account testing conditions are conditional, not a blanket 14-day rule for every developer. [Testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en).
- New apps/updates currently need API 36+; Luna's target 37 meets that minimum. Current 16 KB guidance also needs review of bundled native dependencies; its explicit update-enforcement date is 1 February 2027. [Target API](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en), [16 KB guidance](https://developer.android.com/guide/practices/page-sizes).
- Health declaration includes nutrition/weight management and applies to closed/open/production tracks. [Health declaration](https://support.google.com/googleplay/android-developer/answer/14738291?hl=en).
- Health policy requires appropriate privacy/disclosure and non-medical statements. [Health policy](https://support.google.com/googleplay/android-developer/answer/16679511?hl=en).
- Optional data and third-party SDK handling still belong in an accurate Data safety assessment. “Collected,” “shared,” and service-provider exceptions must follow Google's definitions. [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).
- Conduct a GDPR health-data and DPIA assessment based on the actual processing, not a blanket assumption that local storage or a small company removes obligations. A full DPIA depends on the risk assessment. [Dutch authority DPIA guidance](https://autoriteitpersoonsgegevens.nl/en/themes/basic-gdpr/gdpr-in-practice/data-protection-impact-assessment-dpia).
- Define the intended AI use and assess relevant EU AI/medical rules before expanding into medical advice or condition-specific recommendations. A general nutrition feature should not be casually labelled medically certified or automatically classified as a medical device. [European Commission AI framework](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai).

## 4. Product acceptance work before public promotion

### Data inventory to finish before privacy/store declarations

These are source-based intended flows when the corresponding service is configured, not a packet-capture result:

| Destination | Relevant information / launch question |
| --- | --- |
| Device storage and user-selected export destination | Profile, diary, targets, saved meals and private thumbnails. JSON carries nutrition/profile data and photo IDs, not image files. Verify retention, delete, recovery and phone-change behavior. |
| Firebase Authentication | Registration/sign-in credentials, user identity and authentication tokens. Establish account deletion and support; sign-in does not upload or synchronize the diary. |
| Google Play / RevenueCat | Purchases, entitlement state and app-user identity. Verify seller/SDK disclosures, retention, cancellation and how deletion interacts with transaction records. |
| Cloudflare / Gemini for submitted scans | Meal image, optional context/portion parameters and request/identity metadata. Backend documentation separates temporary processing/results from persisted quota/request-hash records; verify vendor retention and processing terms. |
| Open Food Facts / Jumbo / image CDNs | Barcode/product requests and remote image retrieval expose ordinary network/request metadata. Cover actual providers and image rights rather than assuming an on-device diary has no network data flows. |
| PostHog, only if configured and enabled | Event/device information and configured replay/log/error capture. Confirm allowlists, consent, sanitization, region, retention and deletion on the wire. |

Health-data classification depends on the processing and context. Have the completed inventory assessed; neither every food name nor every local-only operation should receive an unsupported blanket legal classification.

### Product acceptance checks

| Test area | Required outcome |
| --- | --- |
| Cold start and onboarding | A new adult understands Luna, its local storage, and the first action; setup does not require an account for ordinary logging. Observe where seven-step onboarding loses people before changing it. Consider manual-target quick start only if this friction is material. |
| Everyday food coverage | Test 50–100 representative packaged/fresh/home-cooked foods, including Dutch names and several supermarkets. Record exact match/correct portion rate, latency, and successful fallback. Do not silently fabricate missing nutrients. |
| Nutrition arithmetic | Check real labels and weighed portions; decimal comma/dot, g/oz, cooked/raw and per-100 g/per-serving distinctions; sensible target editing and historical targets. Have a qualified nutrition reviewer examine estimates and low-target messaging. |
| Repeated use and data growth | One-/three-year synthetic histories; repeated adds/edits/deletes; saved-meal limits; file size, responsiveness, photo growth/orphans; save/load/export/import after process death and app upgrade. |
| Device lifecycle | Offline and intermittent network, first barcode-module download, denied/cancelled camera/photo selection, rotation, duplicate taps, process death, reboot, date/time-zone/DST changes and widget recovery. |
| Hardware and accessibility | Real Pixel/Samsung or comparable devices, including a mid/low-range phone; supported API matrix; small screens, large text, TalkBack navigation, contrast and non-color-only graph meaning. API 35 emulator checks alone are insufficient evidence. |
| Widget and tone | Pin/resize/remove/re-add on real launchers; nutrition updates and actions; the evening mood remains about logging, including zero/over-target entries. State refresh may lag because Android updates are periodic. Test whether users experience the grumpy bunny as fun or pressure. |
| Local privacy and backups | Correct local export/import, explicit photo omission, account-switch/sign-out behavior, complete local delete, account-deletion path if present, and successful restoration on a second clean installation. |
| Pro and AI | Play-installed purchase/restore/refund/expiry/account-switch flow, review account, network/provider failures, quota resets and simultaneous requests, cancellation/timeouts, clear limits and reviewed estimates. |
| Store candidate | No Test features, development scanner, demo offers or owner-only paths in the consumer experience. Listings/screenshots show the actual release behavior. |

Open Food Facts requires compliant data reuse and attribution, a custom identifying User-Agent/contact, and attention to rate limits. Luna's current User-Agent lacks contact information. Review the Jumbo HTML fallback's permission/reliability and stock-photo rights/provenance; it is not a contracted data feed. [OFF API guidance](https://openfoodfacts.github.io/openfoodfacts-server/api/), [license guidance](https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/license-be-on-the-legal-side/).

Existing PostHog error-tracking hooks and Android vitals may cover initial monitoring needs; adding another crash SDK is not automatically necessary. Configure, sanitize, and test the chosen setup. [Android vitals](https://developer.android.com/google/play/vitals).

## 5. Marketing preparation

### Positioning to test

Working message: **A cozy Android food diary with a pixel companion on your home screen.**

Lead with a recognizable useful loop: log food, correct a portion, understand the day, return through the widget. The character attracts attention; dependable logging must earn continued use.

Target an initial adult cohort with food habits Luna actually supports. Dutch packaged-food/repeat-meal users are a more testable starting group than “everyone who wants to lose weight.” This is a recommendation, not proof of market demand.

Do not advertise complete food-name search, clinical accuracy, automated cloud sync, unlimited AI, or full photo backups unless the release actually provides them. Avoid weight-loss guarantees and shame-based messaging.

### Assets and touchpoints

| Item | What is needed |
| --- | --- |
| Cleared identity | Final app name/descriptor, consistent icon/bunny/colors, matching domain/handles, recognizable legal seller. |
| One landing page | Actual Android demo, concrete use cases, free/Pro limits, honest availability, FAQ, privacy/support/deletion links, one clear beta/store CTA. |
| Waitlist | Minimal email collection, clear purpose, separate marketing consent where needed, confirmation/unsubscribe and deliverability setup. Do not ask for weight/food history merely to join. |
| Store listing | Accurate title/short/full description, Health & Fitness category and appropriate declarations, support/privacy URLs, localized text consistent with the app's actual language. |
| Store images | 512×512 Play icon; 1024×500 feature graphic; at least two compliant screenshots. Recommend six real phone screenshots: Today, logging, portions, insights, widget, and trust/controls. Check all current image constraints before upload. |
| Short demo | Approximately 20–30 seconds of real app use, legible on a phone: add a food → correct the portion → see the day → see the widget. Show the production candidate, not developer controls. |
| Launch creative set | Three testable messages: practical editable logging; cozy widget/habit; day-to-day nutrition clarity. Reuse real product footage with appropriate media/music rights. |
| Trust/help material | Getting started, adding a widget, missing foods, portion correction, backup/phone change, Pro limits/cancellation, AI estimates and deletion requests. |
| Feedback and support | One easy feedback route, opt-in diagnostic/screenshot handling, documented response owner and issue triage. Collect external testimonials only with permission and accurate context. |
| Measurement | Consent-appropriate activation/retention funnel and campaign links; separate organic/beta/paid cohorts; document what optional analytics can and cannot represent. |

[Official Play asset requirements](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en-GB).

### Initial channel plan

1. **Owned:** one landing page and a small permission-based beta/update list.
2. **Discovery:** test real Android demos on one or two short-video channels, aimed at adults; compare the practical logging angle with the cozy-widget angle.
3. **Borrowed audience:** identify a small number of relevant adult Android/cozy-productivity/meal-prep creators or communities. Prepare tailored demonstrations and follow community rules. Confirm sponsorship disclosure, creative rights, and channel health-ad restrictions before any paid collaboration.
4. **Direct feedback:** recruit representative testers willing to use their normal foods for two weeks. A tester who returns is stronger evidence than likes on a bunny video.
5. **Paid acquisition:** begin only after the product and margin gates below. Use a small, predefined experiment budget and stopping rules rather than a broad “launch campaign.”

Health-related targeting has restrictions; do not build audiences from food/body data or assume weight-loss creative is acceptable on every platform. [Google personalized-advertising rules](https://support.google.com/adspolicy/answer/143465?hl=en). Meta/TikTok campaign-specific rules and actual creatives still need checking if those channels are selected.

Product Hunt, a large Discord community, affiliate infrastructure, daily SEO publishing, and multiple social channels are optional. They should not consume the time needed to establish a working consumer logging habit.

## 6. Proposed evidence gates before buying traffic

These are **internal starting targets**, not industry benchmarks, medical thresholds, or proof of product-market fit. Report counts alongside percentages; small beta cohorts are uncertain.

| Signal | Proposed starting target |
| --- | --- |
| First use | At least 9 of 10 representative adults can save a first food without help; aim for within 90 seconds after opening setup. |
| Repeat logging | Common repeat-food tasks are easy enough to finish in about 20 seconds; investigate misses rather than hiding manual-entry work. |
| Food coverage | Aim for at least 90% correct usable results on the agreed representative food set; every failure has an honest fallback. Narrow positioning if broad coverage is not achievable yet. |
| Habit | In a cohort of 20 activated testers, aim for at least 10 to log on three or more days in their first week. Track D1/D7 return separately and interview people who stop. Repeat with a fresh cohort after fixes. |
| Trust | No unresolved diary-loss, incorrect-serving, privacy, blocked-purchase or inaccessible-primary-flow issue in the release candidate. |
| Commercial viability | Measure scan cost and support burden; show a positive conservative contribution margin and a plausible acquisition-cost ceiling before scaling spend. |

Minimum funnel: beta/store visit → install/first open → setup complete → first food saved → another-day logging → Pro viewed → purchase/restore outcome.

Inspect technical failures and opt-in behavioral metrics without using food names, body measurements, photos, or account emails as marketing properties. Surveys and consented beta observation can fill gaps left by optional analytics. Do not treat opt-in users as an unbiased picture of everyone.

## 7. Recommended order of work

**Immediately, in parallel where practical**
- Confirm the intended business/account type and start verification/D-U-N-S work if needed.
- Run name/descriptor clearance and reserve suitable identity assets once cleared.
- Decide first-release feature scope: free core first; include paid AI only if its full production gate can be met.
- Prepare the food-coverage benchmark and durability dataset; assign privacy/support and release responsibilities.
- Prepare a truthful beta landing-page brief and demo using the existing interface.

**Before external beta**
- Fix or bound the diary-capacity issue, test food coverage, and resolve core data-loss/nutrition issues.
- Establish stable Play signing/package/versioning, a reproducible release candidate and reviewer access.
- Finish privacy/support/health declarations and account deletion if accounts are enabled.
- Confirm actual vendor eligibility and access/cost controls for any AI included.
- Recruit approximately 20–30 relevant adult testers; satisfy account-specific Play testing requirements with genuine participation.

**During beta**
- Observe first logging and real food coverage, especially Dutch searches and non-Jumbo products.
- Test real phones, accessibility, purchases and upgrade/backup recovery.
- Review return use and departures; correct the largest repeated failures.
- Validate the offer and scan limits before promising lifetime service or purchasing reach.

**First public release**
- Limit launch countries and marketing exposure to a supportable audience.
- Google's percentage-based staged rollout is for updates, **not the first publication**. Use test tracks and a limited initial market to reduce first-release exposure. [Staged-rollout rules](https://support.google.com/googleplay/android-developer/answer/6346149?hl=en).
- Have support coverage, monitoring, an AI kill switch, and a tested higher-version hotfix path. A “rollback” is not a promise to downgrade already-installed apps or reverse incompatible data changes.
- Expand acquisition after repeat use, correctness, availability, and margin evidence supports it. Use staged updates where applicable.

There is no defensible fixed public-launch date yet. External account verification, any required continuous testing period, production-access review, and remaining release work control the timeline.

### Budget and ownership

Google currently lists a **US$25 one-time developer registration fee**. Organization D-U-N-S registration itself is described as free. [Play registration](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en), [D-U-N-S information](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en).

Budget separately for domain/email, any required provider/service plan, AI usage, store/RevenueCat charges, hosting beyond quotas, device testing, suitable specialist reviews and optional creative/promotion. Check actual regional prices and tax handling before choosing an offer. A paid-service configuration does not by itself establish the cost of a successful scan.

The founder owns seller identity, final name, pricing, budget and consumer promises; engineering owns the release/data/service acceptance evidence; marketing owns truthful assets and experiments. Assign a named person to support, deletion requests, incidents and cost alerts before admitting paying users.

## 8. What can wait

Automatic cloud sync; iOS; Health Connect/wearables; a social feed; a generalized recipe/yield editor; micronutrient coaching; push notifications; AI chat/voice; a large content operation; referral systems; and many more widget skins.

For the first version, keep the owner's chosen local backup model and explain it clearly. JSON nutrition backups without photos are acceptable only when users are told what survives a phone change. R8/resource shrinking are worthwhile optimizations, not a substitute for the functional, privacy and production gates.

## 9. Decisions and external evidence still required

- Final brand clearance and seller/contact details.
- Actual Play Console account type, identity/production access, declarations and review status.
- Live production Firebase, RevenueCat/Play catalog and backend configuration; consumer prices/tax setup.
- Vendor agreements, processing/retention/transfer details and any specialist privacy/nutrition/regulatory review.
- Real device, Play purchase/Integrity, AI quality/latency/cost and long-history round-trip results.
- Audience response, retention, support demand and willingness to pay.
- Channel-specific ad/sponsorship review before paid creatives are approved.

Local source inspection establishes implementation state, not external account completion or regulatory certification. Research used official provider/platform material where available. Some regulator/ad-platform pages could not be fully retrieved; the corresponding final legal/campaign checks remain explicit work items.

The audit did not re-run the recorded October 14 UI suite or interrupt the user's active emulator. New empirical work was limited to the synthetic serialized-size estimate and inspection of the pinned replay SDK source.

Related: [working marketing context](C:/Users/Daniël/Desktop/Codex/Kennis/company/calorie-tracker-marketing-context.md), [APK signing guide](C:/Users/Daniël/Desktop/Codex/Kennis/company/calorie-tracker-apk-signing.md). The older production checklist is a historical starting list; this dated plan separates existing implementation, concrete gaps, conditional features, and unverified external setup.

