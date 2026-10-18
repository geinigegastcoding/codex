---
title: Ollo English Google Play listing
created: 2026-10-18
updated: 2026-10-18
type: listing-draft
status: unpublished
tags: [ollo, google-play, english, global, listing]
---

# Ollo English Google Play listing

Recommended unpublished English listing, refreshed against source checkpoint `4db5eb2` and the stable emulator-verified 0.3.0 APK `c2adee7f`. This is listing copy for review, not a submission or an assertion of Play approval. The app’s English interface is present in the current build. Device/OEM behavior and the reported interruption defects remain unresolved, so the copy describes user-configured behavior without promising uninterrupted or tamper-proof blocking.

## Recommended fields

Google Play currently allows 30 characters for the app name, 80 for the short description and 4,000 for the full description. Counts below are Unicode code points, including spaces and punctuation; full-description count includes line breaks.

| Field | Exact copy | Count |
|---|---|---:|
| App name | `Ollo: Pause Apps You Choose` | 27 / 30 |
| Short description | `Choose apps to pause, set routines and browse offline activity ideas.` | 69 / 80 |
| Full description | See copy block below | 2,073 / 4,000 |

### Full description

```text
Choose the apps you want to pause, then set rules that fit your day.

Ollo lets you select installed apps and configure app pauses, schedules and routines. When a selected app opens, Ollo can show an opening decision prompt. You choose what works for you; behavior can vary by device.

You can also enable an optional three-question quiz in Settings. Choose chess, maths or facts. The quiz is off by default. After three correct answers, you still choose whether to continue. A quiz does not override a fixed time block.

With Ollo, you can:
• Select distraction apps and essentials from installed-app suggestions; edit the choices.
• Set app rules and schedules, including time blocks.
• Browse activity ideas by time or energy; the ideas are available offline.
• Review available Android usage history with coverage information. Missing history is shown as unknown, not zero.
• Export daily figures as CSV or Ollo settings and related data as JSON. You choose an export destination; the provider you choose may handle the file.
• Set an optional purpose and a 5-, 10- or 20-minute check-in for an opening. Ollo does not detect when you finish a task, and existing rules continue to apply.

Access and privacy

Usage Access lets Ollo read Android app-use history for usage views. The Accessibility service uses app and window change events to recognize the foreground app and apply your selected rules. Screen-content retrieval is off; Ollo does not store messages, typed text or screenshots. You enable these special accesses in Android and can revoke them there. Rules and usage history are stored on this device. Optional purchase services connect to RevenueCat for purchase-related functions. An Ollo account is not required, and the app contains no ads.

Ollo is voluntary app control. Android settings, disabling access and uninstalling remain available. App pauses may behave differently across devices, and Android usage history may be incomplete. Ollo pauses selected apps as a whole; it does not selectively block parts of apps or websites.

Android 10 or later.
```

The copy intentionally makes no claim that the entire app works without internet: purchase functionality uses RevenueCat network services. There is no published price, paid feature promise, Pro plan, hosted paywall claim, account, ad, Firebase or PostHog claim. Current features are free in testing and the native paywall is a non-gating Test Store preview. Remembered opening choices are present only in source and are omitted pending native acceptance.

## Submission boundaries and owner inputs

- The described build is a stable emulator-verified 0.3.0 APK, not a production-signed Play release. Signing continuity, Play account/catalog, production billing and hosted paywall configuration are owner-deferred.
- The owner has reported a quiz/audio sliver at startup, notification-shade bypass, volume-key quiz dismissal and spurious quiz retriggers. These are unresolved. Do not use “instant,” “always blocks,” “uncircumventable,” “silent,” “perfect,” “zero audio,” or similar claims. Captures cannot imply successful enforcement during affected transitions.
- Before submission, recheck every field against the exact production artifact and complete Play’s current special-access/Accessibility declaration and in-app disclosure/consent requirements. Provide the public privacy-policy URL and support contact. Accessibility access is not claimed to make Ollo an accessibility tool.
- Screenshots should show the English UI. Use only genuine captures from the exact reviewed build on a clean test setup. Mark any synthetic stats fixture visibly as **FICTIONAL DEMO DATA** on every stats image. No personal installed-app inventory, real usage history, feeds, notification content or account details.

## Official Google Play sources reviewed 18 October 2026

- [Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en-EN) — field limits: title 30, short description 80, full description 4,000 characters.
- [Add preview assets to showcase your app](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en-en) — screenshot count, dimensions, file formats, use of actual app experience, text-overlay recommendations, status-bar cleanup and alt text; feature graphic format and dimensions.
- [Use of the AccessibilityService API](https://support.google.com/googleplay/android-developer/answer/10964491?hl=en) — listing documentation, Play declaration, and prominent disclosure/affirmative consent expectations for services not eligible as accessibility tools.
- [Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en-en) — privacy-policy link in the listing and app for sensitive permissions/data.
- [Provide information for Google Play’s Data safety section](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en-GB) — developer responsibility for complete, accurate declarations, including third-party SDK handling.

Product facts checked against app source at `4db5eb2`, including `app/src/main/java/app/ollo/ui/OlloApp.kt`, `Onboarding.kt`, `ProScreen.kt`, `app/src/main/java/app/ollo/platform/OlloAccessibilityService.kt`, `app/src/main/java/app/ollo/domain/OpeningQuiz.kt`, `OpeningPlan.kt`, `app/src/main/AndroidManifest.xml` and `app/build.gradle.kts`. Runtime reliability reports remain owner-reported and unresolved; emulator verification does not establish physical-device or OEM behavior.

