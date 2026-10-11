# Luna calorie tracker — production checklist

Use this for release readiness. Items marked **release-only** can stay open during the first debug build; items marked **build-now** are foundations that should exist early.

## Build now

- [ ] **build-now** Choose and reserve the final package/application id.
- [x] **build-now** Add PostHog Android SDK behind a local consent gate; capture only safe product events and document the event taxonomy. The debug build stays opt-in and requires a locally supplied key.
- [ ] **build-now** Add crash reporting and a way to disable analytics in debug builds.
- [x] **build-now** Keep local data export/import working before cloud sync exists.
- [x] **build-now** Add clear source/estimate labels for Open Food Facts, manual entries, and future photo estimates.
- [x] **build-now** Collect age, height, weight, units, activity, and estimate preference locally; show the Mifflin–St Jeor starting estimate with explicit assumptions and an editable recalculation path.
- [x] **build-now** Add repository tests for portion scaling, daily totals, target calculations, import validation, and widget quick-add actions. The debug gate also includes an Open Food Facts serving-size instrumentation test.
- [x] **build-now** Add camera/barcode/network failure states and never silently drop a log.
- [x] **build-now** Keep automatic Android backup disabled for the local nutrition store until an explicit, reviewed migration policy exists.

## Privacy, health, and trust — release-only

- [ ] **release-only** Publish a privacy policy in-app and on a public URL.
- [ ] **release-only** Complete Google Play Data safety accurately, including PostHog, crash reporting, barcode requests, account data, photos, and any cloud/photo-AI vendor.
- [ ] **release-only** Decide whether account creation is needed. If it is, provide in-app account/data deletion and a public web deletion request path.
- [ ] **release-only** Obtain explicit consent before analytics/session replay and make the app useful when consent is declined.
- [ ] **release-only** Document retention, deletion, export, and vendor-processing behavior for food logs, body inputs, photos, and Health Connect data.
- [ ] **release-only** Add camera/photo disclosure and only request permissions at the action that needs them.
- [ ] **release-only** If Health Connect ships, declare the exact permissions, provide rationale screens, and validate Play policy approval.
- [ ] **release-only** Add non-medical disclaimers and a support/contact route; avoid claims about diagnosis, guaranteed accuracy, or guaranteed weight loss.
- [ ] **release-only** Have the calorie/macro estimation copy and safety boundaries reviewed by a qualified nutrition professional before public health-related claims are made.
- [ ] **release-only** Review Open Food Facts attribution, license, API limits, User-Agent, caching, and product-data correction links.
- [ ] **release-only** Complete a vendor security/DPA review before sending food photos to a hosted AI API.

## Release engineering — release-only

- [ ] Create/verify the Google Play developer account and identity details.
- [ ] Generate a release keystore and store it outside the repository; enable Play App Signing.
- [ ] Configure release signing, versioning, R8/minification, resource shrinking, and reproducible build notes.
- [ ] Target the current Play requirement: Android 16 / API 36 for new apps and updates as of 2026-08-31; re-check the official requirement before submission.
- [ ] Run dependency/license checks and remove debug endpoints, sample data, test keys, and verbose logging.
- [ ] Add CI for lint, unit tests, instrumentation tests, and a signed release bundle.
- [ ] Verify deep links, backup/restore, migrations, locale/units, time zones, offline behavior, and widget rehydration after reboot.
- [ ] Test on a supported emulator matrix plus at least one physical low/mid-range Android device.
- [ ] Test camera denial, no network, unknown barcode, malformed API response, duplicate taps, process death, rotation, font scaling, TalkBack, and dark/system contrast settings.
- [ ] Verify the widget on Android 12+ sizes, after app force-stop, after reboot, and after a quick-add from the launcher.
- [ ] Validate Play Billing purchase, restore, cancellation, grace period, expiry, and entitlement server verification if premium launches.

## Store and launch — release-only

- [ ] Prepare app icon, adaptive icon, feature graphic, screenshots, short/full descriptions, category, contact details, and support URL.
- [ ] Complete content rating, target audience, ads declaration, financial/health declarations, and app access instructions.
- [ ] Create internal testing, closed testing, and staged rollout tracks; keep a rollback build available.
- [ ] Confirm store listing claims match the actual barcode, widget, photo, and free/premium behavior.
- [ ] Set up PostHog dashboards for activation, first log, barcode success, edit-after-scan, day-7 retention, and crash-free sessions.
- [ ] Define a kill switch/feature flag for photo scanning and other network-dependent features.
- [ ] Add an in-app feedback route and a support runbook for wrong nutrition data, deletion requests, and billing issues.
- [ ] Do a final security/code review and resolve all high/critical findings before production rollout.

## Release gate

Do not ship until all release-only items are either checked or explicitly waived in a dated decision. The first debug build may ship to local testing with photo AI, billing, accounts, Health Connect, and cloud sync still absent, as long as the UI communicates that boundary clearly.

## Sources to re-check before submission

- [Google Play target API requirements](https://developer.android.com/google/play/requirements/target-sdk)
- [Google Play Data safety](https://support.google.com/googleplay/android-developer/answer/10787469)
- [Google Play account deletion](https://support.google.com/googleplay/android-developer/answer/13327111)
- [Google Play subscriptions](https://developer.android.com/google/play/billing/subscriptions)
- [PostHog Android SDK](https://github.com/PostHog/posthog-android)
