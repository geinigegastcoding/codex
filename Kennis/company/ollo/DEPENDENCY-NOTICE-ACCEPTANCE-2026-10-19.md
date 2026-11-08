---
title: Ollo dependency notice acceptance
updated: 2026-10-19
type: project
status: active
---

# Dependency notice acceptance - 19 October 2026

Completed the engineering acceptance portion of `LEGAL-01` on the delivered APK. The reader and notice assets already existed. The backlog had not recorded the earlier successful native run; this follow-up verifies the current delivered build and updates that status. SDK agreement authority/applicability and public-release approval remain open.

## Exact build and environment

- APK: `E:\MData\projecten\Ollo\artifacts\Ollo-0.3.2-blocking-reliability-debug-2026-10-19.apk`.
- SHA-256: `31ce4da88b4e624a6286e159f39ed8fedd48413bcac3f99ca317de86a61e7829`. The installed emulator APK matches this hash.
- `app.ollo`, version `0.3.2-preview`, version code `6`; the existing PC debug signature applies. This is a test build with the previously documented separate-installation requirement.
- Dedicated official Android Emulator AVD `ollo-reliability-api36`, serial `emulator-5580`, Android 16 / API 36. Real MainActivity and native touch, scrolling, rotation and hardware Back were used.
- Wi-Fi and mobile data were off; Android reported `Active default network: none`. Ollo's blocking service was disabled for this reader check.

## Results

| Check | Result |
|---|---|
| Pinned catalog generator `--check` | Pass: 12 source catalogs, 76 component names, 79 variants, 41 distinct texts / 607,210 bytes |
| Packaged Google notice assets | All 42 files, including the index, match source hashes |
| Base license/inventory/attribution assets | All three files match source hashes |
| Normal text native flow | 27 of 27 checks pass; nine PNG/XML captures |
| 200% text native flow | 27 of 27 checks pass; nine PNG/XML captures |
| Reader source comparison | `GoogleNotices.kt` and `OlloApp.kt` are unchanged since the earlier accepted reader runtime at `2a10ebd519a8ace71c9b568db2812f591db90ab5` |

The native flow opens Licenses and the component list, selects JSR 305, shows and hides its dependency sources, scrolls to the notice's actual end, switches Kotlin's two variants, checks the second variant's sources, preserves that variant across landscape/portrait and returns through the list and Licenses to Privacy using hardware Back. Representative screenshots were visually inspected, including the terminal notice text at both text sizes.

All packaged notice files were checked. Native navigation sampled JSR 305 and Kotlin; it did not manually read all 79 variants. This is engineering evidence for the bundled reader and preserved bytes, not a determination of every component's legal obligations or which code survives a production minifier.

## Evidence and repeatability

Evidence folder: `E:\MData\projecten\Ollo\artifacts\dependency-notice-acceptance-2026-10-19`.

- `asset-verification.json`: all asset hashes and reader-source comparison.
- `generator-check.log`: fresh check against the locally resolved pinned artifacts.
- `environment.json`: installed APK hash, device identity and offline state.
- `normal/results.json`, `large/results.json`: individual native checks and failure fields.
- `normal/`, `large/`: 18 screenshots with paired UI hierarchies and activity-start logs.
- `check-native-notices.ps1`: bounded native touch/scroll driver; it refuses an AVD with another name.
- `acceptance.json` and `cleanup.json`: final evidence identities and owned-emulator cleanup.

Run from `E:\MData\projecten\Ollo`, with the dedicated disposable AVD running and the exact APK installed:

```powershell
& 'C:\Python314\python.exe' scripts/generate-google-notices.py --check
& ./artifacts/dependency-notice-acceptance-2026-10-19/check-native-notices.ps1 -Phase normal
& ./artifacts/dependency-notice-acceptance-2026-10-19/check-native-notices.ps1 -Phase large
```

The native driver changes only the dedicated AVD's test app lifecycle, font scale, orientation and temporary screenshot/hierarchy files. Keep it away from an owner's normal installation. The local evidence is ignored by Git and must be copied separately when moving machines.

Cleanup completed: Ollo stopped, normal text and portrait restored, the two temporary device screen files removed, and the owned emulator stopped. ADB and the process list confirm the shutdown. No owner's device or installation was changed.

## Remaining work

Owner/licensor SDK terms review remains tracked in [[GOOGLE-SDK-TERMS-REVIEW]]. Physical devices, TalkBack, production/minified acceptance and hosted CI were not checked here. The historical startup/System UI ANR remains an open investigation; these successful ordinary launches do not establish a cause or a performance fix.

The next unblocked engineering item in [[BACKLOG]] is `QA-STARTUP`. No app source, dependency or APK change was needed for this acceptance step. Existing reliability changes remain local and uncommitted.
