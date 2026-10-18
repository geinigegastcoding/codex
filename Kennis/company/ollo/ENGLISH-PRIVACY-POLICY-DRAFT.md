---
title: Ollo English privacy policy draft
created: 2026-10-18
updated: 2026-10-18
type: project
status: internal-draft-not-published
tags: [ollo, android, privacy, english, draft]
sources: [https://github.com/geinigegastcoding/Ollo]
---

# Ollo Privacy Policy — English draft

**Internal preparation only. This is factual draft copy, not legal or compliance approval. Do not publish until the owner details in the internal section are supplied and the exact release is rechecked.**

## Proposed public copy

# Privacy Policy for Ollo

Ollo is an Android app that lets you choose app rules and review available usage information. Ollo does not require an Ollo account. App rules and usage information are processed on your device. The current testing preview also uses RevenueCat for purchase services; those services communicate over the internet as described below. No advertising network, PostHog or Firebase is included. If you export a file, your chosen document provider may store or transmit it outside Ollo.

### Information Ollo processes

To let you select apps, Ollo reads the names and package identifiers of apps available to launch on your device. This list is used locally. The package identifiers for apps you select, and the rules you set for them, are saved in Ollo's private app storage.

If you enable Android Usage Access, Ollo can read Android's available daily usage summaries, including app package names and foreground-use totals. Ollo can display up to 30 previous days of available Android usage history. You can also choose to import the preceding seven days as a starting baseline. Android maintains its own usage history; Ollo cannot delete it.

If you enable Ollo's Accessibility service, Android sends Ollo app/window-change events. Ollo uses the foreground app's package identifier to apply your rules and measure app use. This includes foreground-use intervals for apps beyond only the apps you selected as distractions. Ollo saves eligible intervals locally with the package name, start and end times, duration, and time zone. The service does not retrieve screen contents. Ollo does not read or store message contents, typed text, or screenshots.

Ollo also stores your settings and app rules, schedules, goals, routine records, quiz preferences, favorites, an optional imported baseline, and daily results in private app storage. These records are used to run the features you configure and show your overview.

When you choose an opening plan, Ollo temporarily processes the selected app, the purpose you chose, and a 5-, 10-, or 20-minute period on your device. The current plan is held in memory for that opening flow. It is not written to Ollo's stored app data and is not included in CSV or JSON exports.

### Retention and deletion

When Ollo processes a new day, it removes its own detailed usage intervals older than 32 days. If Ollo has not processed a new day, cleanup waits until it processes one. Ollo keeps at most 370 daily-result records and at most 370 morning-start records. These are record limits, not fixed retention periods in days.

Ollo's measurement-data deletion action deletes its detailed usage intervals, imported baseline, daily results, and measurement counters. Ollo's app rules and settings remain, including morning-start records needed by routines. After deletion, Ollo may read Android's still-available usage history again. This action does not delete Android's history or files you previously exported.

You can turn off Usage Access or Accessibility access in Android settings; doing so stops Ollo from using that access but does not itself erase data Ollo already stored. Uninstalling Ollo removes its app-specific storage under Android's app-storage behavior. It does not delete Android's system usage history or files saved through another provider.

Ollo is configured to exclude its app data from Android cloud backup and device transfer. A JSON export is not a full app backup, and Ollo has no general settings restore/import feature. The optional baseline import reads available Android usage data; it does not restore app settings.

### Exporting and external providers

Export is a manual action. CSV contains daily app-use totals with package identifiers, dates, source/coverage labels, and a classification version. JSON contains configuration, an optional baseline, and daily results. You choose where Android saves the file. The chosen document provider may be local or cloud-backed; that provider controls its own security, storage, syncing, sharing, and deletion. Ollo cannot remove a file after it has been saved there. Ollo does not otherwise send these records to an Ollo server.

### Purchase services in the testing preview

This build configures RevenueCat when the app starts and refreshes purchase information when you return to it. RevenueCat processes a pseudonymous app user ID, purchase history, and app/device information needed for its service. Opening its paywall can also produce paywall interaction events. Ollo does not send selected apps, app rules, foreground-use history, quiz answers or exported files to RevenueCat. Ollo does not set email, phone, advertising attribution or other optional customer attributes. Purchase-related network activity is not limited to tapping the paywall.

The current preview uses RevenueCat Test Store simulations, with no real charge. Every current feature remains free. A future Google Play purchase uses the store's payment system and provider processing; real production billing is not enabled by this preview. RevenueCat describes its purchase-data practices in its [Google Play Data safety guidance](https://www.revenuecat.com/docs/platform-resources/google-platform-resources/google-plays-data-safety).

Deleting local measurements or uninstalling Ollo does not delete RevenueCat or store purchase records. Restore purchase checks access to a purchase; it does not recover local app settings or usage history. A provider-data deletion/support contact and retention procedure must be settled before publishing this policy. Do not publish this preparation sentence as finished public policy.

### Your choices

Usage Access and Accessibility access are optional Android settings that you enable yourself and can revoke in Android settings. Without the relevant access, the related usage-history or app-protection features may not work. Ollo is voluntary app control; Android settings remain available.

## Internal preparation — not part of proposed public copy

| Owner input / check | Status |
|---|---|
| Legal developer/controller name and identity matching the intended listing | Unknown; do not substitute “Ollo” as a legal entity. |
| Public privacy contact or inquiry mechanism | Unknown; no email or URL supplied. |
| Public policy-hosting URL and hosting owner | Unknown; this local Markdown draft is not a public policy URL. |
| Policy availability in Play Console and inside Ollo | No hosted policy URL is configured in the reviewed source. The current in-app Privacy screen is a summary and does not link to a hosted copy; owner must choose whether to include the complete policy text in-app or link to it. |
| Effective date | Unknown; drafting date is not an effective date. |
| Intended countries/jurisdictions and audience/age declaration | Unknown; no legal basis, age limit, or compliance conclusion is supplied. |
| Interface language shown in the current source build | English-first UI approved and implemented. Earlier native verification applies to the0.2.0English candidate; new0.3.0onboarding/paywall runtime acceptance remains pending. |
| Exact release/minified artifact and any changed dependencies or permissions | Source `b64c189`; minified releasef26ecf… passed34scoped native checks with a real five-minute cue. This is not a whole-package privacy certification; future changes must be rechecked. |

### Evidence checked

- [User data — Google Play Console Help](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en-GB), accessed **18 October 2026**. The official page says a policy must describe data access/use/sharing, identify the app or developer, provide a privacy point of contact, state retention/deletion, and be linked in Play Console, with a policy link or full text inside the app; the public URL must be active, accessible and non-PDF. This is preparation guidance, not legal approval.
- [Provide information for Google Play's Data safety section](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en-GB), accessed **18 October 2026**. Play requires a complete, current Data safety form consistent with the privacy policy; the developer is responsible for accurate declarations, including third-party library behavior. The form remains a separate decision.

Historical offline evidence at commit `b64c189` (network/SDK statements in this list are superseded by the0.3.0purchase-services section above):

- [`AndroidManifest.xml`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/AndroidManifest.xml) and [`app/build.gradle.kts`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/build.gradle.kts): Usage Stats special access, Accessibility service, no `INTERNET` permission, and no reviewed analytics/crash/billing SDK dependencies.
- [`PlatformAccess.kt`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/platform/PlatformAccess.kt): launcher-visible app selection and package labels.
- [`OlloAccessibilityService.kt`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/platform/OlloAccessibilityService.kt) and [`accessibility_service.xml`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/res/xml/accessibility_service.xml): `TYPE_WINDOW_STATE_CHANGED`, package-based handling, and `canRetrieveWindowContent=false`.
- [`AppController.kt`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/data/AppController.kt), [`UsageReader.kt`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/data/UsageReader.kt), [`OlloDatabase.kt`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/data/OlloDatabase.kt), and [`Models.kt`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/domain/Models.kt): locally recorded intervals, Android usage summaries, 32-day trim trigger, record caps, deletion scope, and CSV/JSON contents.
- [`OpeningPlan.kt`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/domain/OpeningPlan.kt) and `AppController.openingPlan`: temporary purpose/time plan is held in memory, not part of persisted `StoredState` or exports.
- [`OlloApp.kt`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/ui/OlloApp.kt), [`backup_rules.xml`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/res/xml/backup_rules.xml), and [`data_extraction_rules.xml`](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/res/xml/data_extraction_rules.xml): current privacy, permission, export and deletion wording/UI; configured exclusions for cloud backup and device transfer.
- Android Developers, [App-specific storage](https://developer.android.com/training/data-storage/app-specific): Android app-specific files are removed on uninstall; shared document exports and Android-owned UsageStats are separate.
- Existing vault evidence: [[PRIVACY-POLICY-DRAFT]] and [[DATA-SAFETY-WORKSHEET]]. These were reconciled with the source above; they remain separate historical/work documents and were not edited.

The Accessibility disclosure in the app is separate from this policy. The current implementation presents an in-app disclosure and affirmative acceptance before launching Accessibility settings, but this draft does not certify Play-policy compliance. Storage/backup wording describes the current configuration; OEM behavior and the final signed package are not verified here. Actual local CSV/JSON writes were checked in [[FACTS-EXPORT-IMPLEMENTATION]]; cloud-provider sync, sharing and deletion remain untested.

Parent review18October: current source, retention/export/deletion boundaries and the two Play primary sources were independently checked. Repository evidence links point to local files because b64c189 is an unpublished local commit. No hosted policy, owner identity or contact has been invented.

Owner decision18October: RevenueCat dashboard/catalog/entitlement/offering/hosted-paywall configuration will be completed later. No further web sign-in is requested now. Local code/build verification can continue; live store configuration and end-to-end purchases are not claimed verified. See [[REVENUECAT-INTEGRATION]] for the exact later checklist.
