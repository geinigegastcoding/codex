---
title: Ollo blocking reliability follow-up
updated: 2026-10-19
type: project
status: active
---

# Blocking reliability follow-up - 19 October 2026

Daniel authorized this follow-up and requested Android Studio's emulator. Changes are implemented locally, with a downloadable debug APK. Physical-device acceptance remains open. No commit, push, production release or billing change was made.

## What changed

- Preserve the protected app and quiz progress across Android notification and volume panels. These temporary SystemUI windows previously replaced the foreground app with an allowed system package, removed protection and stopped refreshing the app's grant.
- Deliver window transitions without Android's previous 80 ms coalescing delay. A later run caught a real launch replaced by a delayed window event, leaving the target usable while Ollo still tracked Contacts. Preserve the same target through repeated events during the handoff into Ollo, and retry bringing Ollo forward when the target is reopened.
- Bring Ollo's existing MainActivity in front of a quiz or hard-blocked target, pausing the target activity. Use the existing gate view in that normal application window, with an opaque background and covered Compose content hidden from accessibility navigation.
- Keep Android's notification shade and volume controls above the gate. A temporary accessibility overlay covers the handoff into MainActivity.
- Reopen the intended app only after explicit conscious opening has created its grant. Back goes Home without granting access. Essentials, emergency routes and hard-block precedence remain available.
- Add a separate test APK with a local foreground-media activity, actual AudioTrack playback, lifecycle reports, a native in-app dialog and repeatable regression checks. It is not included in the delivered main APK.

No new runtime permission or content retrieval was enabled. Blocking decisions, persistent data formats and quiz content are unchanged.

## Build identity

| Item | Value |
|---|---|
| Base source | `0784877926e00fe790e5b832b737e854d10ec897` plus local working-tree changes |
| App | `app.ollo`, `0.3.2-preview`, version code `6`, min SDK `29`, target SDK `36` |
| Deliverable | `E:\MData\projecten\Ollo\artifacts\Ollo-0.3.2-blocking-reliability-debug-2026-10-19.apk` |
| SHA-256 | `31ce4da88b4e624a6286e159f39ed8fedd48413bcac3f99ca317de86a61e7829` |
| Separate test APK SHA-256 | `17f5a9f5964550f00423a3d6c37ee9721f04ec14f252937d94050b45814fb0b2` |
| Debug certificate SHA-256 | `d6a70e41d148f2e270057ba8ec34679d1cbe45c44155e9274ce5263b55856b82` |
| Device | Dedicated official Android Emulator AVD `ollo-reliability-api36`, serial `emulator-5580`, Android 16 / API 36 |
| Toolchain | Project Gradle wrapper 8.13; local JBR `21.0.11`; installed Android SDK |

The installed APK hash matches the deliverable. This PC's debug certificate differs from the earlier laptop/review APK certificate. Use a separate test installation; this APK cannot update those earlier installations in place. Do not uninstall an owner's app or erase its data to work around signing. Production signing is not verified.

## Verification

Evidence root: `E:\MData\projecten\Ollo\artifacts\blocking-reliability-2026-10-19`.

| Run | Result | Evidence |
|---|---|---|
| Unmodified baseline runtime | 19 of 33 checks fail, including foreground media behind quiz, volume/shade context loss and a dialog retrigger after 132 seconds | `baseline-full/results.json`, `baseline-full-native.log` |
| Final APK, normal text | 43 of 43 pass; includes four returns from Contacts and 132 seconds of quiet granted use before the in-app dialog | `final-normal/results.json`, `final-normal-native.log` |
| Final APK, 200% text | 45 of 45 pass; includes purposeful opening, four returns from Contacts, landscape and return to portrait; no two-minute wait in this run | `final-large/results.json`, `final-large-native.log` |
| Unit tests | 91 pass; zero failures, errors or skips | `app/build/test-results/testDebugUnitTest` |
| Android lint | Zero errors; 17 warnings and one hint remain | `app/build/reports/lint-results-debug.xml` |
| Package checks | 13 pass in explicit debug-test mode; signature verified; accessibility content retrieval remains disabled | `final-package-verification.json` |
| Packaging | 16 KB zip alignment passes; 123-library license inventory check passes | `final-zipalign.log`, `final-build.log` |

Native runs exercise six quiz shade cycles, twelve shade cycles during a real ten-minute pause, volume controls, quiz progress, fixed pause deadline, no automatic conscious bypass of the pause, Home, Android Settings, a selected essential app, four returns from that app and narrowly scoped emergency access. The large-text run also selects and opens with a purpose and ten-minute reminder. The driver submits quiz answers through the controller and uses native gate actions for opening and exit controls. Screenshots include the visible Android panels, opaque gate, portrait quiz, purpose form, essentials and emergency routes. Screenshots were visually inspected as well as checked through native state; rotation captures can include Android's transition animation.

The first candidate passed its initial state checks but covered Android panels with its accessibility window. Manual inspection caught this. The next candidate (`panel-candidate.apk`, SHA `83973b07...`) passed 38 normal/39 large checks before a later purpose-flow run exposed the missed Contacts-to-target launch (`purpose-local-reentry-failed`). Removing coalescing exposed the same-target handoff race (`final-initial-failed`). A subsequent test-driver timing failure while the purpose form redrew is retained in `final-action-failed`; waiting for the named control corrected that driver issue. These intermediate runs are excluded from final acceptance. Only `final-candidate.apk` / SHA `31ce4da8...` is delivered under the readable APK filename above.

An additional legacy purpose-flow run against Calendar was interrupted by Calendar's first-run Google sign-in. That run is preserved in `purpose-calendar-interrupted` and is excluded from the passing results.

### Reproduction commands

Run from `E:\MData\projecten\Ollo`, using the dedicated disposable AVD. The instrumentation resets Ollo's test configuration and accessibility binding; do not run it against an owner's normal installation.

```powershell
& ./scripts/build-windows.ps1 `
  -JavaHome 'C:\Users\daniel\.jdks\jbr-21.0.11' `
  -SdkRoot "$env:LOCALAPPDATA\Android\Sdk" `
  -Tasks @(':app:assembleDebug', ':app:assembleDebugAndroidTest', `
    ':app:testDebugUnitTest', ':app:lintDebug', ':app:verifyLicenseLibraryList')

$adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
& $adbPath -s emulator-5580 emu avd name
& $adbPath -s emulator-5580 install -r 'app/build/outputs/apk/debug/app-debug.apk'
& $adbPath -s emulator-5580 install -r 'app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk'
& $adbPath -s emulator-5580 shell settings put system font_scale 1.0
& $adbPath -s emulator-5580 shell am instrument -w -e activeUseMs 132000 `
  app.ollo.test/app.ollo.BlockingReliabilityInstrumentation
```

For the large-text/rotation case set `font_scale` to `2.0` and `activeUseMs` to `0`. The driver writes results and screenshots under Ollo's private `files/blocking-reliability` directory; preserve each run before starting another. `source-build.json` records final source file hashes, test APK identity and evidence references.

## Later SDK configuration finding

The subsequent [[STARTUP-INVESTIGATION-2026-10-19]] directly inspected the frozen APK above and confirmed its RevenueCat key is empty. Its blocking acceptance remains valid for that exact APK, while SDK-enabled startup and billing are outside this report's scope. Daniel then supplied the public Test Store key for ignored PC configuration. A separate diagnostic APK (`dfd0d417...`) passed six SDK-enabled startup checks; it is not the frozen APK validated here.

## Remaining acceptance and platform limits

- Original owner reports still lack the exact device, OS and APK. Recheck all four reports on the owner's device before closing them completely. Physical OEM behavior, TalkBack, calls/alarms and other hardware actions were not verified in this follow-up.
- The original visible sliver did not reproduce in the baseline's normal emulator geometry. The final gate's opaque background and normal/large-text geometry passed the scoped checks; the physical sliver report remains open.
- The local media fixture pauses on activity pause. Apps designed to keep playing in the background may continue audio; this does not establish universal audio suppression. Android starts the target before the accessibility event arrives, so no zero-frame or zero-audio launch promise is made.
- The 132-second case reproduces and fixes a specific stale-grant path through SystemUI. It does not establish that every possible in-app retrigger has the same cause.
- No production/minified build, update lineage, live purchase or universal blocking guarantee was verified.

Android platform references: [activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle), [audio focus](https://developer.android.com/media/optimize/audio-focus), [background activity starts](https://developer.android.com/guide/components/activities/secure-bal), [framework event-coalescing implementation](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/services/accessibility/java/com/android/server/accessibility/AbstractAccessibilityServiceConnection.java).

## Cleanup and handoff

Saved both final native runs (19 screenshots total), source/APK hashes, package verification and cleanup details. Stopped the local media fixture, restored normal text and portrait orientation, disabled the disposable AVD's test accessibility binding, and shut down only `ollo-reliability-api36`. ADB and the process list confirm it stopped. No owner's device or app data was changed. The dedicated AVD profile and ignored local evidence are retained for another run.

Source changes and the two vault notes remain uncommitted. APKs and `artifacts/` evidence are ignored by Git and must be copied separately when moving machines.

See [[BACKLOG]] for the remaining launch gates.
