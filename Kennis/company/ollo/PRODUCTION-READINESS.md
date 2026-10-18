# Production readiness and launch gates

**Status date: 19 October 2026.** Current source checkpoint `6f798f9` builds versionCode 5 / versionName `0.3.1-preview`. This candidate passed91unit tests,lint0errors/18existing warnings and13debug-package checks. Remembered-choice native checks passed44/fourviewed captures at each normal/200%font; onboarding normal40checks passed,200%phase is finishing. A label-only optional-essentials clarification is pending rebuild/confirmation. Its default path is a seven-step, app-choice-first setup; the optional usage-history path retains nine steps. Do not treat source presence as candidate acceptance.

The previous stable `0.3.0` APK (`c2adee7f…`) has scoped emulator and RevenueCat Test Store evidence. Those checks do not establish `0.3.1` acceptance, production readiness, Play approval, or physical/OEM behavior. See the dated evidence sections below and the project [app README](../../../projecten/Ollo/README.md) for artifact identity.

## Current product and service boundary

All current features remain free during testing. The native paywall is a non-gating Test Store preview; there is no production catalog, real purchase or launched paid feature. RevenueCat 10.28.1 adds purchase-related network traffic. Core app rules and usage history remain local. No ad, PostHog or Firebase service is integrated; Firebase encoder libraries appearing transitively do not establish Firebase service use. See [[REVENUECAT-INTEGRATION]] and [[DATA-SAFETY-WORKSHEET]].

## Current release gates

- **Signing:** `app/build.gradle.kts` now uses `ownerRelease` only when all four owner values are supplied: `OLLO_RELEASE_STORE_FILE`, `OLLO_RELEASE_STORE_PASSWORD`, `OLLO_RELEASE_KEY_ALIAS`, and `OLLO_RELEASE_KEY_PASSWORD` (or matching Gradle properties). `preReleaseBuild` requires those values and an existing keystore. Release has no debug-signing fallback. Debug testing does not need owner production credentials. No positive owner-signed release has been built; owner key inputs and signing continuity remain open. See [[PRODUCTION-SIGNING]].
- **Purchases:** production RevenueCat Google Play SDK key, Play product/catalog, entitlement/offering and hosted-paywall setup are owner-deferred. No dashboard login is required for current local work. Real Play purchase/update/restore acceptance remains open.
- **Product and runtime:** four owner-reported quiz/enforcement defects remain unresolved; the startup quiz/audio sliver and notification-shade bypass are public-launch blockers. A separate API 36 debug/instrumented startup ANR is recorded with cause unestablished. Candidate acceptance must use the final exact-source/APK checks rather than aggregate previous phases; physical-device, OEM, TalkBack, lifecycle and update-lineage acceptance remain open.
- **Policy and release:** five Google client artifact terms were reviewed, with embedded-notice/runtime comparison and agreement applicability still open; see [[GOOGLE-SDK-TERMS-REVIEW]]; all 17 previously missing POMs were retrieved, but POM recovery is not a completed terms audit. Privacy/contact inputs and Play declarations/listing remain owner tasks. Recheck current Play Console eligibility, target-API, testing-track and submission requirements with the owner’s actual account immediately before submission; old dates/rules in historical source notes are not current verification.

[[BACKLOG]] is the canonical task list for blockers and next actions. This note keeps only release context and evidence provenance.

## Historical evidence and source notes

Sections below preserve dated investigations and checks. Each result applies only to its stated source, APK, device, date and test scope; none automatically transfers to `0.3.1-preview` or clears current launch gates. The linked [[BACKLOG]] controls current status.

## Android 16 / API 36 source audit

### Existing lint warnings, triaged 17 October

The saved Licenties build has **0 errors and 18 warnings**. Parent inspected every issue in `app/build/reports/lint-results-debug.xml` and the corresponding source; [the saved text report](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-17-licenses/lint.txt>) is the durable build evidence. This is triage, not a new lint run or dependency-security audit.

| Count | Warning group | Disposition |
|---:|---|---|
| 10 | Gradle/dependency version notices | Review pinned upgrades separately with compatibility and notice-list checks. These detector messages are not independently verified latest-version or vulnerability findings; no upgrade was made merely to remove warnings. |
| 5 | `UseKtx` suggestions for URI parsing | Style suggestions. Existing `Uri.parse` calls were left unchanged. |
| 1 | `ConfigurationScreenWidthHeight` | `OlloApp.kt` chooses navigation layout using `screenWidthDp`. Check actual app-window bounds around the 600dp breakpoint during the open Android16 resize/multiwindow acceptance; evaluate `LocalWindowInfo` with the pinned Compose version if this causes a concrete mismatch. No runtime failure was established by this warning alone. |
| 1 | `ViewConstructor` | `ChessBoardView(Context, fen)` is created programmatically with an explicit puzzle, not inflated from XML. No empty/default-puzzle constructor was added solely for editor tools. |
| 1 | `UnusedAttribute` | `isAccessibilityTool=false` is recognized from API31 while minSdk is29. Keep the explicit policy-relevant value for supported platforms; this warning does not establish a broken older-device flow. |

No warnings were suppressed and no production source changed in this pass. Physical-device/API36 checks remain open; the existing warning count should not be mistaken for eighteen observed user-facing defects.

Source review on 2026-10-17 found no concrete API 36 compatibility defect in the inspected paths. The app targets API 36, calls `enableEdgeToEdge`, uses Compose `BackHandler` rather than legacy back callbacks, has no orientation/resizability opt-out, and adapts tab navigation at 600dp. Its Quick Settings tile uses `startActivityAndCollapse(PendingIntent)` on API 34+, and the Accessibility service listens only for window-state changes without retrieving window content. These align with the target-36 edge-to-edge/predictive-back behavior, large-screen behavior, and TileService API guidance ([target-36 changes](https://developer.android.com/about/versions/16/behavior-changes-16), [TileService](https://developer.android.com/reference/android/service/quicksettings/TileService), [Compose insets](https://developer.android.com/develop/ui/compose/system/insets)).

Keep Android 16 runtime acceptance open: on an API 36 device, test predictive back from nested Settings/onboarding routes and modal dismissal; verify MainActivity and the accessibility overlay stay clear of status/navigation bars under gesture and three-button navigation, including keyboard visibility; exercise the Quick Settings tile; and rotate/resize at least one window of 600dp or wider. This source audit did not run an API 36 device. The earlier emulator startup failure occurred before Ollo ran and is not evidence of an app defect or pass.

### Foreground callback ordering corrected

A real API 34 emulator trace found an older Google Search widget callback replacing a newer Launcher event and sometimes leaving a block overlay over Home. Direct Ollo-service logging confirmed the order. A per-connection event-time watermark now rejects strictly older callbacks after existing filters; equal/newer events remain eligible. The 200% native run passed 149checks across three quiz topics, strict Home-Allow and Calendar-relaunch-Block, with three older callbacks explicitly rejected. Standard build:75 unit tests, lint 0 errors / 18 warnings; all 12 review packaging checks passed. No permission, dependency, billing or telemetry change. See [[QUIZ-200-REVIEW]] for exact APK/evidence/restoration and limitations. Physical/OEM/TalkBack/API 36 runtime acceptance remains separate.

### History hour allocation corrected

A disposable native Room measurement led to a small local-hour cache, capped at clock-offset transitions. This fixes a non-advancing Lord Howe half-hour boundary and a subsequent-hour split while preserving raw intervals, query/schema and unknown-hour conventions. Eight native expected/observed cases passed, including Amsterdam changes, gaps, overlaps, clipping and prorating. Existing 75 unit tests, lint 0/18, library-list validation and 12 review packaging checks passed. The two ordered emulator timing samples suggest lower local-read cost; they do not establish phone startup or battery improvements. Exact evidence and limits: [[USAGE-STORAGE-REVIEW]].

## Dependency notice inventory

On 2026-10-17, Gradle resolved `releaseRuntimeClasspath` offline for source milestone `ea55af1`: 64 unique selected artifact files are recorded in [runtime-dependencies.csv](assets/release/2026-10-17/runtime-dependencies.csv). An independent parent export matched every unique record; Gradle returned 65 entries because the same Core 1.16.0 AAR occurred twice. This is the resolved dependency graph, not an R8/Dex inventory of code retained in the APK. Compiler, KSP, BOM, test, lint and debug-only tooling are outside this runtime CSV.

License evidence was spot-checked, not audited for every transitive component: cached POMs for `androidx.core:core:1.16.0`, `org.jetbrains.kotlin:kotlin-stdlib:2.1.20` and `com.google.code.gson:gson:2.12.1` declare Apache-2.0 / Apache License 2.0. The cached Coroutines 1.10.2 artifacts had no POM in the inspected module cache; the exact upstream tag's LICENSE identifies Apache License 2.0. The review APK also contains six AndroidX `LICENSE.txt` resources, but their presence does not prove that every resolved component's notice is represented. AndroidX was checked through one cached POM and the packaged license resources, not every module or an exact upstream tag. The source root `NOTICE.md` names Android/Compose/Room, Kotlin, Coroutines and Gson at family level; it is not a component-by-component runtime inventory.

Parent extended the inventory with exact-version cached POM metadata: **40** records declare an Apache 2.0 license name; **24** have no cached POM. Absence from this cache does not establish a missing license. The CSV keeps upstream-text review separate from metadata extraction. [Metadata evidence](assets/release/2026-10-17/runtime-metadata-evidence.json) records each inspected POM's cache-relative path and SHA-256, duplicate resolution, and the six packaged notice-file hashes. This remains short of a full component/attribution audit.

The 24 missing POMs were then fetched from official Google Maven/Maven Central endpoints at their exact selected versions. Twenty-three declare licenses directly; `listenablefuture:1.0` inherits the declaration from its exact `guava-parent:26.0-android` parent, which was also fetched. **All 64 inventory records now have an Apache 2.0 license declaration traced to POM metadata.** [Upstream evidence](assets/release/2026-10-17/upstream-pom-evidence.json) retains URLs, original POMs and hashes. This does not resolve additional attribution/NOTICE requirements or prove that every embedded third-party file has the same terms.

An [archive scan](assets/release/2026-10-17/dependency-archive-notices.json) found filename-matched license/notice text in 41 selected JAR/AAR artifacts, including nested `classes.jar` and `libs/*.jar`; 23 had none under those filename patterns. All matches contained one identical 10,175-byte text, preserved once under `assets/release/2026-10-17/license-texts/` with per-artifact provenance and hashes. This is a review candidate for later packaging, not a shipped notice set or proof that absent files need no attribution. The app was not changed.

The inspected `Ollo-0.2.0-switch-labels-2026-10-17.apk` contains these notice/license entries and no root-level NOTICE/LICENSE/THIRD-PARTY entry in the archive-name scan:

- `META-INF/androidx/annotation/annotation/LICENSE.txt`
- `META-INF/androidx/collection/collection-ktx/LICENSE.txt`
- `META-INF/androidx/collection/collection/LICENSE.txt`
- `META-INF/androidx/lifecycle/lifecycle-common-java8/LICENSE.txt`
- `META-INF/androidx/lifecycle/lifecycle-common/LICENSE.txt`
- `META-INF/androidx/room/room-common/LICENSE.txt`

`app/build.gradle.kts` excludes `META-INF/{AL2.0,LGPL2.1}`. That is packaging configuration evidence only; it does not establish the license of any dependency or, by itself, a compliance result. Before external release, the release owner should reconcile the exact release artifact's resolved dependencies and bundled/native contents against each component's license and required notices, decide where the complete attribution text will ship or be made accessible to users, and verify the final signed artifact contains that selected notice set. No legal compliance approval or complete transitive-license verification is claimed here.

### Local delivery implemented

The local source branch now exposes **Instellingen → Privacy & systeemrechten → Licenties**: native offline text, an optional64-library list, conservative Kotlin/Guava source attribution and the common Apache terms. No network, WebView, new SDK or permission. The release build checks that the list matches the actual selected `releaseRuntimeClasspath`; a deliberate stale-list control was rejected and the original restored byte-for-byte.

Build3m03s,75 unit tests,lint0errors/18existing warnings,review guard and16KBalignment passed. Normal/200%emulator smoke covers visible text start/end, expand/collapse and page/system Back to Privacy. Parent independently matched all3packaged text assets to source and the installed APK to candidate SHA-256 `75ad7edc5cb0d3eb26d59f34830294bb8c43760093b993eb44de84e18345c0fe`. Font/viewport/grants unchanged at handback; no configuration actions performed. Evidence: app `docs/evidence/2026-10-17-licenses/` and `screenshots/2026-10-17-licenses/`. Development signing, TalkBack/physical/API36 and complete rights review remain open.

## Additional source attribution candidate

On 2026-10-17, six exact-version Maven Central source JARs were inspected for Kotlin stdlib 2.1.20, Coroutines 1.10.2, Serialization Core 1.7.3, Gson 2.12.1, Guava `listenablefuture` 1.0 and JetBrains annotations 23.0.0. None contains a separately named `LICENSE`, `NOTICE`, `COPYING` or `THIRD-PARTY` file. The source archive URLs and SHA-256 hashes are recorded in [source-archive-checks.json](assets/release/2026-10-17/additional-notices/source-archive-checks.json).

The Kotlin stdlib 2.1.20 source JAR does contain a concrete source-level attribution in `jvmMain/kotlin/util/UnsignedJVM.kt`: its comments say the division/remainder implementation is based on Guava's `UnsignedLongs` and name `The Guava Authors`, copyright 2011. The exact two comment lines are preserved in [kotlin-stdlib-2.1.20-UnsignedJVM-attribution.txt](assets/release/2026-10-17/additional-notices/kotlin-stdlib-2.1.20-UnsignedJVM-attribution.txt); the evidence JSON records both the source-JAR hash and source-file hash. This establishes source provenance only. It does not establish that R8 retains this implementation in Ollo's APK or that the source comment is legally required in the distributed object artifact. Including a concise attribution on the planned Licenties page is a conservative option. No equivalent additional attribution was established by the other five source-JAR checks. JSpecify 1.0.0 source archive was outside this six-artifact check.
## Primary sources

Original policy/SDK sources accessed 2026-10-16; Android 16 and dependency-license follow-ups checked 2026-10-17. Policy and SDK behavior should be checked again at implementation/submission. The AndroidX POM was inspected from the exact-version Gradle cache; its official URL could not be opened by the parent's web tool. The three pinned upstream license texts were independently opened.

- [Google Play: Use of the AccessibilityService API](https://support.google.com/googleplay/android-developer/answer/10964491?hl=en)
- [Android Developers: Google Play target API requirements](https://developer.android.com/google/play/requirements/target-sdk)
- [Google Play: Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en)
- [Android Developers: Test Google Play Billing](https://developer.android.com/google/play/billing/test)
- [Google Play: App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)
- [RevenueCat: Identifying customers](https://www.revenuecat.com/docs/customers/identifying-customers)
- [RevenueCat: Offline Entitlements](https://www.revenuecat.com/blog/engineering/introducing-offline-entitlements/)
- [RevenueCat: Caching](https://www.revenuecat.com/docs/test-and-launch/debugging/caching)
- [RevenueCat: Getting Subscription Status](https://www.revenuecat.com/docs/customers/customer-info)
- [RevenueCat: Android product setup](https://www.revenuecat.com/docs/getting-started/entitlements/android-products)
- [PostHog: Android event capture](https://posthog.com/docs/product-analytics/capture-events)
- [PostHog: Android error tracking](https://posthog.com/docs/error-tracking/installation/android)
- [Firebase: Customize Crashlytics reports and collection](https://firebase.google.com/docs/crashlytics/android/customize-crash-reports)
- [Firebase: Privacy and security](https://firebase.google.com/support/privacy)
- [Firebase: Crashlytics Cloud Logging schema](https://firebase.google.com/docs/crashlytics/cloud-logging-schema)
- [Firebase: Play data disclosure](https://firebase.google.com/docs/android/play-data-disclosure)
- [AndroidX Core 1.16.0 cached POM source](https://dl.google.com/dl/android/maven2/androidx/core/core/1.16.0/core-1.16.0.pom) (license metadata spot-check)
- [Kotlin v2.1.20 license text](https://raw.githubusercontent.com/JetBrains/kotlin/v2.1.20/license/LICENSE.txt)
- [kotlinx.coroutines 1.10.2 license text](https://raw.githubusercontent.com/Kotlin/kotlinx.coroutines/1.10.2/LICENSE.txt)
- [Gson 2.12.1 license text](https://raw.githubusercontent.com/google/gson/gson-parent-2.12.1/LICENSE)

## Next source triage: document-provider failures —17 October

Source-only finding at local commit `41e2e44`: both Settings CSV/JSON callbacks (`OlloApp.kt:404–405`) write through `ContentResolver.openOutputStream()` with a nullable safe call and no local error handling. Canceling the picker is a safe no-op. A null stream silently skips writing; exceptions from open/write/close can escape the launch coroutine. The controller export methods only generate strings, and no shared output helper was found. A Luna source review independently agreed. No provider-failure or app-crash reproduction was performed.

Android explicitly documents a nullable stream after a provider crash and `FileNotFoundException` for an unopenable URI. [ContentResolver reference](https://developer.android.com/reference/android/content/ContentResolver#openOutputStream(android.net.Uri))

Next useful work after reserve: verify actual successful CSV/JSON exports and picker cancellation, then exercise a controlled null/throwing writer or native test provider. Choose the smallest shared write path only after tracing that reproduction. Required outcome: Ollo stays open, failure has clear recovery, success is reported only after a complete closed write, cancellation stays neutral, and configuration/measurements are not deleted. Do not silently count null output as a saved file, swallow coroutine cancellation, add cloud SDKs, or delete user-selected external files as cleanup. Preserve the normal backup/restoration boundary. This is pending engineering work; the source risk is not a verified device crash.

**Resolved locally18October:** [[FACTS-EXPORT-IMPLEMENTATION]] records the shared I/O writer, success-after-close/result feedback and neutral cancellation. Actual CSV/JSON normal/200% paths and file/config checks pass; null/open/write/close/content failures and coroutine cancellation pass at the JVM writer boundary. No failing real document-provider UI or old app crash was reproduced, and cloud sync/process-death recovery remain unverified.80units,lint0/18,12review package checks and149native quiz checks pass; original emulator APK/19persistent files/settings restored. No provider SDK or network contract added.

## Later restoration finding —18October

The next cold boot after the facts/export run found the19restored private files zero-byte and the installed base.apk missing. The earlier record verified bytes before shutdown; it did not establish restart durability. Root cause is unknown. The intact host backup recovered the original APK/files, explicit device `sync` was added before VM shutdown, and recovery plus final opening-plan restoration each passed one cold stop/start check before app launch. The final original APK,19file contents/owners/modes/SELinux and settings matched; emulator stopped. This is owned-emulator recovery evidence, not an app/user-device durability guarantee. [Final cold-boot result](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-opening-plan/restoration-final-cold-boot.json).

## English policy and release cue —18October

[[ENGLISH-PRIVACY-POLICY-DRAFT]] now provides source-checked English copy and separate owner/contact/hosting inputs; unpublished, no invented entity or contact and no legal approval. The parent independently reopened current official Play User Data/Data safety guidance and checked raw retention, record caps, deletion exclusions and export boundaries. The unchanged minified release also passed34native checks with one actual five-minute cue and finish/Home; this closes that narrow release-runtime gap only. See [[OPENING-PLAN-IMPLEMENTATION]]. No SDK, network, account, publication or owner-installation change.

## Actual provider failure and recovery —18October

[[EXPORT-PROVIDER-REVIEW]] closes the earlier real-provider/UI gap for a controlled write-open failure on the unchanged current minified APK.30checks cover normal CSV/200%JSON failure, reachable feedback/actions, neutral cancellation and valid local retry files/full configuration equality. Exact original APK/19files/settings restoration survived cold boot; own provider/files removed and VM stopped. No old app crash, actual cloud provider, process-death, real provider write/close/null-stream or physical/OEM qualification follows. No production source, SDK, network or installation change.

## Native recovery routes —18October

[[RECOVERY-RELEASE-REVIEW]] records31native checks and12captures on the same minified APK at200%text: Essentials opens Dialer/Alarms, emergency cancel preserves blocking, Calendar-only access expires120,177ms after confirmation, and the underlying pause/Home still work. Exact original APK/19files/settings survived cold restart; own probe removed and emulator stopped. No app build/source change, actual call/alarm creation, all-rule-mode or physical/OEM/TalkBack/API36 qualification. This narrows the previous button-reachability gap without closing owner-device acceptance.

## Global price preparation —18October

The localized-pricing section in [[PRICING]] separates the English campaign from Play-country currency and offer availability. Its earlier source snapshot left catalog, region and checkout validation open; no Play account, price or real transaction was configured then. The RevenueCat SDK was integrated afterward; current purchase status is summarized above and in [[REVENUECAT-INTEGRATION]]. The Netherlands calculator is not a global tax/fee model, and currency conversion is not demand evidence.

## Minified permission recovery —18October

[[PERMISSION-RECOVERY-REVIEW]] records53native checks/17accepted captures at200%text on the unchanged current release. Real Android Deny/Allow/Stop/Allow controls, Ollo Settings/Today status and Calendar blocking agree; five failed driver attempts remain separate. Original APK/19files/settings survived cold restart; own probe removed and VM stopped. No production source/build change. This qualifies that API34flow only; physical/OEM/TalkBack/API36, Usage Access revocation, process death and first-disclosure behavior remain separate gates.

Owner decision18October: RevenueCat dashboard/catalog/entitlement/offering/hosted-paywall configuration will be completed later. No further web sign-in is requested now. Local code/build verification can continue; live store configuration and end-to-end purchases are not claimed verified. See [[REVENUECAT-INTEGRATION]] for the exact later checklist.




## Billing version maintenance check19October

The exact RevenueCat10.28.1 POM resolves BillingClient8.3.0. Google's current [Billing Library version timeline](https://developer.android.com/google/play/billing/deprecation-faq?hl=en) lists31August2027 as the version8 new-app/update deadline (extension1November2027). It is within that listed window on this review date; this is a version-maintenance check, not overall Play acceptance. Recheck the table when submitting. [Dependency path evidence](assets/release/billing-dependency-path-2026-10-19.json).
