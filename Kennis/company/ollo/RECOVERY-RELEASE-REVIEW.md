---
title: Ollo minified recovery route review
created: 2026-10-18
updated: 2026-10-18
type: project
status: verified-local
tags: [ollo, reliability, accessibility, production]
---

# Recovery routes on the minified release

- **Closed a verification gap:** the existing recovery buttons now have a complete native release-flow check, beyond earlier reachability checks. App code and the minified APK stayed unchanged; no new app build was needed.
- **Passed:** 31 native checks at 200% text on the disposable Android 14 emulator, with 12 screenshots and native accessibility trees. A separate test APK drives visible controls while retaining Ollo's Accessibility service.
- **Essentials:** Open telefoon opens `com.google.android.dialer`; Open je wekker opens `com.google.android.deskclock`. Neither has an Ollo overlay in the checked state. No call was placed and no alarm was created.
- **Emergency scope:** Calendar's confirmation names the app and two minutes. Cancel leaves Calendar blocked. Confirm allows Calendar while Contacts remains blocked, and Calendar stays allowed on return.
- **Real expiry:** Calendar blocks again 120,177 ms after the confirmation tap, with the underlying ten-minute manual pause still active. Eight elapsed samples precede expiry. Access was first observed 439 ms after the tap, so expiry is 119,738 ms after that observation. Home remains accessible afterward.
- **Readable controls:** parent inspected Essentials, emergency confirmation and expired-access screens at 200% text. Existing orange pixel styling is preserved; no further UI change was made.
- **Cleanup passed:** own probe removed; original APK, 19 private files, settings, ownership, modes and SELinux restored, synced and checked after a cold restart before app launch. Shell adbd restored; emulator stopped. User phone untouched.
- **Scope:** one emulator and manual-pause flow. Calling, alarm delivery, other rule modes, physical/OEM/TalkBack/API36 behavior and universal recovery remain unqualified. The release probe uses no private subject reads, reflection, deadline injection or clock changes. Separate debug priming checks and their unretained capture names are not counted as release evidence.

The unchanged development-signed 1d97d9… artifact retains its earlier 83 unit tests, 0 lint errors/18 existing warnings and 12 packaging checks; these were not rerun. This evidence supports a scoped product claim, not a guarantee on every Android device.

[Exact evidence](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-recovery-release/results.json) · [Native gallery](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/index.html) · [[CUE-ACTION-CLARITY]]
