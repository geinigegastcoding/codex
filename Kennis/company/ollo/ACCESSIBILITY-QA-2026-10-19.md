---
title: Ollo scoped TalkBack acceptance
updated: 2026-10-19
type: project
status: active
---

# Scoped TalkBack acceptance - 19 October 2026

The selected pause and quiz flows pass on the official Android Studio emulator with real Google TalkBack enabled. A reproduced countdown announcement bug is fixed. QA-01 remains open for physical devices and the other device-checklist cases.

## Change and regression

`PixelTimerView.label` previously assigned `contentDescription` on each countdown tick. With the timer accessibility-focused, TalkBack repeatedly announced the changing time: six speech requests in a saved 12-second observation, with 12 content-change events in the final baseline regression.

The shared timer now supplies its current description through `onInitializeAccessibilityNodeInfo`, without sending a content-change event every tick. Visual timing and blocking deadlines are unchanged. The native accessibility regression and observation mode live in the separate Android test APK; no new dependency, permission or product feature was added.

The final regression was run against both APKs: the frozen baseline fails for repeated tick announcements; the candidate passes at normal and 200% font with retained focus, zero tick events and a current value on an explicit node refresh. A separate real TalkBack swipe-away/return reads a fresh value (`09:32` then `08:48`). The first test expected a cached node to update without a refresh; that test assumption was corrected before rerunning both baseline and candidate.

## Test artifact and source

| Item | Identity |
|---|---|
| Download | [Ollo accessibility debug APK](E:/MData/projecten/Ollo/artifacts/Ollo-0.3.2-accessibility-debug-2026-10-19.apk) |
| APK SHA-256 | `83ff217e660e772aec333f448e2af8ea9f6bc895444c06a5200d3d8518e56d89` |
| App | `app.ollo`, `0.3.2-preview`, code 6; min SDK 29, target 36 |
| Source base | `0784877926e00fe790e5b832b737e854d10ec897` plus local uncommitted changes |
| PC debug signer SHA-256 | `d6a70e41d148f2e270057ba8ec34679d1cbe45c44155e9274ce5263b55856b82` |
| Environment | Owned disposable AVD `ollo-startup-api36`, Android 16/API36; TalkBack `16.0.0.738667889` |
| Evidence | `E:/MData/projecten/Ollo/artifacts/accessibility-qa-2026-10-19/` |

The installed main APK hash matches the download. This includes earlier reliability/startup changes and the local Test Store configuration; no real purchase was tested. This is a debug test build. Its signer differs from earlier laptop APKs, so those installations cannot update in place. Use a separate test installation without deleting owner data. No commit or push was made.

## Acceptance

| Check | Result and scope |
|---|---|
| Final derived acceptance | 29 checks pass; see `acceptance.json` and `verify-acceptance.ps1` |
| Countdown, normal and 200% | Focus retained, zero tick events or tick speech requests; current time readable |
| Exit controls, both fonts | Real TalkBack swipes and double-taps activate Open essentials, I need an app and Go to Home; actual destination verified and original pause deadline preserved |
| Quiz, 200% | All three math questions answered through TalkBack; progress survives portrait-to-landscape rotation after question one |
| Opening after quiz | Completion remains a prompt until TalkBack explicitly activates Open app for the intended target |
| Service coexistence | TalkBack touch exploration and Ollo accessibility service remain enabled together in accepted sessions |
| Unit tests | 91; zero failures, errors or skips |
| Lint | Zero errors; 17 warnings and one hint remain |
| Dependencies/package | 123-library inventory and notice verification; 13 debug package checks; 16 KB zip alignment pass |
| ANR | None reported since this owned AVD boot; historical startup cause remains open |

Tests use a synthetic target in the separate test APK. Official emulator hardware input generates TalkBack gestures; ordinary ADB input swipes were not used as proof of screen-reader traversal. UiAutomation explicitly keeps real accessibility services enabled. This observes native focus, event and TalkBack speech-request logs; it is not listening-based speech-quality evaluation or testing with a person who uses a screen reader.

Early harness failures remain preserved: service rebinding, an answer-index interpretation error, and stale sampled focus/destination data. The final host runner waits for stable focus and actual destinations. Earlier incomplete snapshots are excluded from the final 29-check result. Selected captures were visually inspected; no claim is made that every saved image was viewed. Baseline `timer-final-red.json`, final `timer-final-normal/large.json`, `accepted-*-*.json`, and `final-quiz-large.json` identify the accepted cases. `source-build.json` records source and APK identities.

## Cleanup and remaining work

`cleanup.json` confirms original font, rotation and accessibility settings restored; owned test APK removed; synthetic Ollo data and QA-only TalkBack verbose preferences cleared; notification grant revoked; scratch PNG removed. The owned AVD was stopped, with no matching emulator processes or ADB transport left. Its profile and the installed main APK are retained.

Physical Pixel/Samsung/other OEM acceptance, real calls/alarms, battery/reboot/overnight behavior and signing/update continuity remain open. Onboarding and other screens were not covered by this selected-flow pass. No production signing, live billing, universal accessibility compliance or resolution of the historical startup ANR is claimed. See [[BACKLOG]], [[STARTUP-INVESTIGATION-2026-10-19]] and repository `docs/DEVICE_CHECKLIST.md`.

Daniel also requested exercise/task-based app unlocking as a future idea; it is saved under `UNLOCK-01`, with no implementation in this build. The handoff was bounded to leave capacity for owner testing before the five-hour allowance is exhausted; the latest checked window was 77% used.

Guidance: [Android accessibility testing](https://developer.android.com/guide/topics/ui/accessibility/testing), [custom-view accessibility](https://developer.android.com/guide/topics/ui/accessibility/views/custom-views), [official emulator console](https://developer.android.com/studio/run/emulator-console).
