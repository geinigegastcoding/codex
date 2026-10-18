# Ollo — Google Play Accessibility declaration and video draft

**Status: submission preparation only. Not a legal certification, policy determination, or Play approval.** Source description updated18October for the private English0.3.0-preview candidate; no new Play submission or policy approval. Its service manifest metadata sets `isAccessibilityTool=false`; this is intentional because Ollo is a voluntary self-control app, not a disability-support tool. Do not change the flag to claim an exemption.

## Proposed Play Console declaration text

### Why Ollo uses AccessibilityService

Ollo uses Android AccessibilityService only for the app-protection feature the user configures. When the user opens another app, Ollo receives a `TYPE_WINDOW_STATE_CHANGED` event and uses the foreground package name to check the user’s selected app rules. For events from Ollo itself, the service also checks Ollo’s own window class name so it can ignore its own overlay UI. If a selected app is paused or blocked, Ollo shows its own overlay with the reason, remaining time or opening choice. The user chooses the apps and rules and can turn the service off in Android settings.

Ollo does not retrieve the active window’s view hierarchy or screen content (`canRetrieveWindowContent=false`). It does not read messages, typed text, screenshots, photos, videos or browser content. Foreground package changes are processed on-device to evaluate the selected rules and Ollo’s local usage measurements; Ollo does not send this Accessibility event data to a server. There is no Ollo app account. The authorized RevenueCat purchase SDK now uses internet permission and pseudonymous purchase-service traffic; Ollo does not send foreground app events, selected-app rules or usage history to it. The purchase-service boundary is described separately in [[REVENUECAT-INTEGRATION]] and [[DATA-SAFETY-WORKSHEET]].

This API is not used to disable Android settings, prevent disabling/uninstalling Ollo, bypass platform controls, or make decisions outside the user-selected app-protection rules.

**Console form notes:** Choose “not an accessibility tool” and the closest current form option for user-enabled app functionality. Describe the package/window event use above accurately. Do not claim `isAccessibilityTool=true`. Recheck the live Play Console questions and current policy when the real release is submitted; this draft is not a substitute for the declaration form.

## In-app disclosure and consent: source review

The current implementation has a distinct disclosure before opening Android Accessibility Settings:

- Onboarding step 7 is titled **“Echte appbescherming”** and says Ollo needs an Accessibility service to recognize the foreground app and block selected apps; it says the user receives an explanation and chooses whether to enable it.
- **“Activeer appbescherming”** opens a separate dialog titled **“Toegankelijkheid”**. It explains foreground-app recognition, selected-app blocking and local active-usage measurement; processing of app/window changes on this device; no reading of screen content/messages/typed text/screenshots; no server transmission; and that the user can disable access in Android. The explanation has a native vertical scroll container.
- **“Akkoord, naar instellingen”** is an affirmative action. It saves `disclosureAccepted=true` and opens Android Accessibility Settings. **“Nu niet”** dismisses the dialog without recording consent.
- The Android system settings then asks the user to enable Ollo’s service. A refusal can be followed by **“Deze stap later”** in onboarding; Settings exposes the disclosure button again while protection is disconnected.
- Service metadata declares `canRetrieveWindowContent=false`, `isAccessibilityTool=false`, and only `typeWindowStateChanged`; the Kotlin service ignores other accessibility event types and forwards the foreground package to Ollo’s local rule controller.
- A separate Privacy screen describes local storage, package/window changes, disabled screen-content retrieval, data deletion/export and voluntary self-control.

**This source inspection does not establish compliance.** Before submission, verify on the target release and real device that the complete separate explanation is visible and understandable before the system prompt, the refusal path remains usable, the package/data description accurately matches runtime behavior, TalkBack and large text expose the dialog clearly, and the service never exceeds this declared purpose. Google’s policy requires declaration and disclosure; passing build/tests is not approval.

### Resolved source and emulator gaps — 17 October 2026

The earlier package-name-only claim was replaced with the accurate app/window-change description, preserving the necessary own-overlay filter. The disclosure now explicitly says data is not sent to a server. The baseline 200% text clipping was corrected with a scroll container. Eight confirmation checks passed on Android 14 at normal and 200% text: purpose/copy, refusal and re-entry at both sizes, the actual enlarged-text scroll container, and the affirmative route to Android settings without automatically granting access. Access grants were unchanged and font scale was restored. See [[CONSENT-REFINEMENT]] for PNG/XML evidence and the exact review APK hash.

### Remaining review gaps

1. Check the full explanation on smaller supported screens, actual landscape changes, TalkBack and physical devices. The emulator evidence covers normal and 200% text on one viewport; it is not a complete device matrix.
2. Verify the full real-service sequence after declining, returning later, toggling access off/on in Android and returning to Ollo. The consent check covers refusal/re-entry and the settings route, not all live protection status transitions.
3. Test the production-signed APK and supported physical Android devices. The current binary has development signing and does not qualify every OEM's settings or background behavior.
4. Submit the Play Console declaration and an up-to-date demonstration video for the exact binary/feature set. Confirm the live policy/form and distinguish local transient events, stored usage intervals and user-requested exports in the privacy policy. Store copy and passing tests cannot replace in-app disclosure or establish Play approval.

## Review-video shot list (target 1:45, hard cap under 2:00)

Record a continuous, legible capture from a real Android device using the exact release candidate; use a clean test profile and dummy app usage. Keep the disclosure fully readable. Use Dutch captions or voice-over because the relationship between system access and the feature should be unmistakable. Do not include personal messages, notifications, account details, a review APK download flow, or another person’s data.

| Time | Shot and action | What the reviewer should see/hear |
|---|---|---|
| 0:00–0:08 | Launch Ollo; show the actual version/build identifier in-app if available. | This is the real app on-device, not a mockup. Caption: “Ollo 0.2.0-review · Android · echte appbeelden” for a review capture; replace version for the submission build. |
| 0:08–0:18 | Start first-run onboarding. Show the first screen and continue through setup to “Echte appbescherming”; use the “Voorlopig zonder gebruiksdata” / skip controls where needed to keep the path short. | The disclosure is reached in normal use, without hiding it in a privacy page. |
| 0:18–0:38 | Tap “Activeer appbescherming”; hold on the entire Ollo dialog. Slowly scroll only if the device actually requires it. | Show full purpose, local app/window processing, no server transmission, what is not read, disable route and both response buttons. Voice-over: “Ollo ziet welke app vooraan staat om jouw eigen regels toe te passen; het leest geen scherminhoud.” |
| 0:38–0:58 | Consent branch: tap “Akkoord, naar instellingen”; show Android’s system Accessibility page and enable Ollo, including the platform confirmation. Return to Ollo. | The affirmative user action and separate Android system grant are visible. Do not edit/skip OS confirmations. |
| 0:58–1:13 | Show a preconfigured selected-app rule, open that test app, and show Ollo’s real block/decision overlay; explain the package-change trigger with a caption. | Core capability works. Caption: “Gebruikt alleen voor door jou gekozen appregels; geen inhoudsinspectie.” |
| 1:13–1:38 | Refusal branch from a fresh test profile: reach the same disclosure, tap “Nu niet”, return to the partial setup. Later open Ollo Settings → app protection and tap “Activeer appbescherming” to show the same dialog again. | Refusal does not grant access or strand the user; they can trigger the disclosure again. This branch can be a clearly indicated second test run in the same continuous video. |
| 1:38–1:45 | End on Ollo’s protection status after refusal (or neutral setup screen). | No claim that protection is active after declining. Caption: “Appbescherming blijft uit totdat je die zelf inschakelt.” |

If both branches cannot be shown legibly under two minutes, trim navigation time and explain that the refusal branch is a fresh test profile; do not remove the full disclosure or omit the system permission confirmation. Keep a separate unedited master in the owner-controlled review location and submit the requested video URL only through Play Console.

## Source locations checked

All paths below are under `C:\Users\Daniël\Desktop\Codex\projecten\Ollo`; initial inspection was on 16 October and the disclosure correction was verified on 17 October 2026:

- `app/src/main/java/app/ollo/ui/Onboarding.kt` — onboarding step titles, permission intro, partial setup and **“Deze stap later”**. Step 7 presents the route; step 8 is the practice block.
- `app/src/main/java/app/ollo/ui/OlloApp.kt:440–457` — Settings recovery button, `PermissionConsentButton`, dialog text/actions, and Privacy screen. The exact disclosure is at line 446.
- `app/src/main/java/app/ollo/platform/OlloAccessibilityService.kt:72–77` — filters for `TYPE_WINDOW_STATE_CHANGED`, obtains package name, and passes it to the local controller.
- `app/src/main/res/xml/accessibility_service.xml:1–8` — event type, `canRetrieveWindowContent=false`, `isAccessibilityTool=false`, and service description.
- `app/src/main/res/values/strings.xml:3` — Android service settings description.
- `app/src/main/AndroidManifest.xml:14–15` — service declaration and bind permission.

## Official policy references

Checked **16 October 2026**; exact current form wording may change. These references guide preparation only and do not certify compliance or guarantee approval.

- Google Play Console Help, [Use of the AccessibilityService API](https://support.google.com/googleplay/android-developer/answer/10964491?hl=en) — declaration and review-video requirements for apps that are not accessibility tools.
- Google Play Console Help, [Best practices for prominent disclosure and consent](https://support.google.com/googleplay/android-developer/answer/11150561?hl=en) — separate, in-app disclosure close to the permission request; video should show opening, disclosure, consent, refusal/re-entry, and core feature.
- Google Play Console Help, [Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en-EN) — listing limits used by the companion store-listing draft.
