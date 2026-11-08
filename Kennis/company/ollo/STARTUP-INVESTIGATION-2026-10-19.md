---
title: Ollo startup ANR investigation
updated: 2026-10-19
type: project
status: active
---

# Startup ANR investigation - 19 October 2026

The bounded emulator investigation is complete. The saved startup ANR did not reproduce in six SDK-enabled runs on the official Android Studio emulator. Its historical root cause remains open. No startup performance fix or production acceptance is claimed.

## What changed

- Add debug-only `OlloStartup` phase logs around the existing controller and billing constructors in `OlloApplication.onCreate`. They contain numeric timings only. Initialization order is unchanged.
- Add `mode=startup` to the existing debug `ReviewInstrumentation`. It waits for controller readiness, launches the real MainActivity, requires onboarding or Today content, and saves a screenshot, launch output and billing configuration flags. It does not seed rules or complete onboarding.
- Store Daniel's supplied public RevenueCat Test Store key in ignored local `local.properties` under `olloRevenueCatDebugApiKey`. The key value is omitted from these notes and manifests.

No purchase logic, persistent data format, permission, dependency or product UI was changed in this investigation. Earlier blocking reliability changes remain in the working tree. No commit, push or release was made.

## Important configuration correction

Direct APK inspection confirms that the previously frozen PC reliability APK, SHA `31ce4da88b4e624a6286e159f39ed8fedd48413bcac3f99ca317de86a61e7829`, contains an empty RevenueCat key. It skipped SDK initialization. Its blocking and dependency-reader acceptance remains scoped to that exact APK; it does not verify SDK-enabled startup or billing.

The initial startup observations on this PC also used that empty-key path. They remain preserved but are excluded from the SDK-enabled results below. The new diagnostic APK embeds the supplied Test Store key, and all three instrumented runs report both `billingConfigured=true` and `billingTestStore=true`. Inspection records contain flags and APK hashes, not the key.

## Build and environment

| Item | Value |
|---|---|
| Source base | `0784877926e00fe790e5b832b737e854d10ec897` plus local uncommitted changes |
| Diagnostic APK | `E:/MData/projecten/Ollo/artifacts/startup-investigation-2026-10-19/configured-diagnostic.apk` |
| APK SHA-256 | `dfd0d4172480c76e60dc250f6051bf251fde96be8d05829824c3909b805c212d` |
| App | `app.ollo`, `0.3.2-preview`, version code `6`, min SDK `29`, target SDK `36` |
| Debug signer SHA-256 | `d6a70e41d148f2e270057ba8ec34679d1cbe45c44155e9274ce5263b55856b82` |
| Toolchain | Gradle wrapper 8.13; local JBR 21.0.11; installed Android SDK |
| Emulator | Dedicated fresh AVD `ollo-startup-api36`, serial `emulator-5582`; Android 16 / API 36, Play Store x86_64 image, 3072 MB guest RAM |
| Build fingerprint | `google/sdk_gphone64_x86_64/emu64xa:16/BE2A.250530.026.D1/13818094:user/release-keys` |
| Test conditions | Normal font, portrait, fresh onboarding, no accessibility or usage permission; online and Wi-Fi/mobile-data-disabled runs |

The installed base APK hash matches the diagnostic artifact. `source-build.json` records relevant source hashes and validation results. The only previously frozen reliability source whose hash changed is the debug review driver; `OlloApplication.kt` has the additional timing logs. This PC's debug signer cannot update the earlier laptop signer in place. Use a separate test installation without deleting an owner's app data.

## SDK-enabled startup results

Evidence root: `E:/MData/projecten/Ollo/artifacts/startup-investigation-2026-10-19`.

| Run directory | Setup | Activity launch | Application onCreate | Billing constructor | Result |
|---|---|---|---|---|---|
| `configured-ordinary-offline-1` | Ordinary launch after upgrade from the empty-key APK; radios disabled | COLD, 4614 ms | 1259 ms | 611 ms | Onboarding visible; no ANR |
| `configured-instrumented-offline-fresh` | Instrumentation after clearing only this owned QA app's data; radios disabled | WARM, 2526 ms | 908 ms | 629 ms | Probe passes; configured Test Store; no ANR |
| `configured-ordinary-offline-2` | Ordinary force-stopped launch; radios disabled | COLD, 3608 ms | 868 ms | 509 ms | Native Choose my apps action opens app choice; no ANR |
| `configured-instrumented-online-fresh` | Instrumentation after clearing owned QA app data; validated Wi-Fi | WARM, 5146 ms | 1446 ms | 947 ms | Probe passes; configured Test Store; no ANR |
| `configured-ordinary-online-reinstall` | First ordinary launch after uninstall/reinstall on this owned QA AVD | COLD, 4933 ms | 1111 ms | 639 ms | Fresh onboarding visible; no ANR |
| `configured-instrumented-online-reinstall` | First instrumented launch after uninstall/reinstall on this owned QA AVD | WARM, 2520 ms | 1171 ms | 835 ms | Probe passes; configured Test Store; no ANR |

`am start -W` supplies the launch state and activity time. Instrumentation has already started the app process, so its activity launch is WARM. Those times must not be presented as ordinary cold-start measurements. Probe content appeared 3919, 7623 and 3990 ms after the respective instrumentation probe began; this is a separate metric.

All six runs retain logcat and `dumpsys activity lastanr`; each ANR query reports no ANR since boot. All three configured probe screenshots were visually inspected and show the real onboarding screen. No Gradle build ran during these six checks. Recorded host free RAM was approximately 5.3-5.8 GiB. This differs materially from the original approximately 1.3 GiB condition, and is not a controlled memory-pressure comparison.

One brief ADB disconnect followed the first ordinary launch. The emulator remained running, and logs and the ANR query were recovered under `logcat-after-reconnect.txt` and `last-anr-after-reconnect.txt`. `offline-connectivity-audit/connectivity.txt` separately confirms that the same Wi-Fi/data disable commands leave no active default network; the original offline cases did not save a connectivity dump at launch time.

## Earlier observations retained with limits

- `first-install`: empty-key frozen APK ordinary first launch, COLD 5404 ms, onboarding responds, no ANR.
- `baseline-cold-summary.json`: empty-key ordinary COLD launches 4554/4192/5038 ms while Gradle was building. These are load observations, not controlled benchmarks.
- `diagnostic-cold`: the first empty-key diagnostic launch was actually WARM, 3488 ms. The directory name must not be used to classify it as cold.
- `no-key-instrumented`: empty-key startup probe passed. Its older `activityStart` field was `{}` because the old helper discarded command output; the retained current probe records the actual launch text.

## Validation

| Check | Result | Preserved evidence |
|---|---|---|
| Configured debug build | Successful | `configured-diagnostic-build.log` |
| Unit tests | 91 tests; zero failures, errors or skips | `validation/unit-tests/` |
| Android lint | Zero errors; 17 warnings and one hint remain | `validation/lint-results-debug.xml` |
| Library/notice inventory | 123-library inventory and bundled notice checks pass | `configured-diagnostic-build.log` |
| Package and signature | 13 checks pass in explicit debug-test mode; production signing unverified | `configured-package-verification.json` |
| APK packaging | 16 KB zip alignment passes | `configured-zipalign.log` |
| SDK configuration | Supplied Test Store key present in diagnostic APK; empty key in frozen reliability APK | `apk-sdk-configuration.json` |
| Installed identity | Diagnostic and installed base APK hashes match | `installed-apk.json` |
| Native startup | Six runs without ANR; three probe assertions pass with configured Test Store flags | `configured-run-summary.json`, per-run logs/JSON/PNGs |
| Cleanup | Owned app stopped; portrait/font restored; scratch XML removed; AVD stopped; zero matching emulator processes; profile retained | `cleanup.json` |

The first shutdown check still saw the departing ADB transport after the emulator process had stopped. A subsequent bounded check confirmed both transport and process removal; the first check is preserved in `cleanup-first-check.json`.

## Historical ANR and remaining work

The original saved failure is in project `docs/evidence/2026-10-19-opening-memory-native/confirmed/normal-startup-failed/`. Its 2506-byte trace excerpt records `Process ... failed to complete startup`, main-thread Google Play services verification warnings, a later 13.741-second activity display and the process being closed after the error. It does not contain the ANR main-thread stack. The full original log was local to the other computer and is unavailable here.

The evidence supports an intermittent debug/emulator startup failure. It does not establish a RevenueCat defect, a Room defect, memory pressure as the cause, or a production startup regression. The observed billing constructor interval measures synchronous construction only; it does not prove successful offering/customer-info network requests, purchases or restore. No speculative lazy-initialization or threading change was applied.

If the ANR recurs, retain full logcat, `dumpsys activity lastanr` and an `adb bugreport` before reinstalling, clearing data or rebooting. Inspect the actual main-thread stack before selecting a fix. Android's [ANR diagnosis guidance](https://developer.android.com/topic/performance/anrs/diagnose-and-fix-anrs) explains how startup stacks identify slow initialization and blocking dependencies.

Physical/OEM startup, the original low-memory environment, minified release performance and production billing remain unverified. The full blocking and dependency-reader suites were not rerun against this separate diagnostic APK. Their earlier exact-APK evidence remains in [[BLOCKING-RELIABILITY-2026-10-19]] and [[DEPENDENCY-NOTICE-ACCEPTANCE-2026-10-19]].

## Reproduce the focused probe

Build debug with JDK 21 using `scripts/build-windows.ps1`. Supply `olloRevenueCatDebugApiKey` through ignored local configuration, the documented environment variable or a Gradle property. The existing build checks reject Test Store keys for production releases. Launch the dedicated AVD and verify its identity before acting on it.

```powershell
$adbPath = "$env:LOCALAPPDATA/Android/Sdk/platform-tools/adb.exe"
& $adbPath -s emulator-5582 emu avd name
& $adbPath -s emulator-5582 shell am force-stop app.ollo
& $adbPath -s emulator-5582 logcat -b all -c
& $adbPath -s emulator-5582 shell am instrument -w -e mode startup app.ollo/.ReviewInstrumentation
& $adbPath -s emulator-5582 shell run-as app.ollo cat files/review-evidence/startup.json
```

Preserve `files/review-evidence/startup.json` and `startup-ready.png` before the next run. A passed startup result plus `billingConfigured=true` and `billingTestStore=true` is required for the configured debug case. Logs use tag `OlloStartup`. APKs and raw artifacts are ignored by Git and must be transferred separately if needed.
