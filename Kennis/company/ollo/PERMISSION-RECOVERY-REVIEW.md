---
title: Ollo minified permission recovery review
created: 2026-10-18
updated: 2026-10-18
type: project
status: verified-local
tags: [ollo, reliability, accessibility, production]
---

# Permission state and recovery

- **Verified:** 53 recorded native checks and 17 accepted screenshots/accessibility trees on the unchanged minified release, at 200% text on the Android 14 emulator. These are interaction checks, not 53 user sessions.
- **Decline works:** Android's actual **Deny** action leaves Ollo's service disabled. Settings explicitly says Accessibility is off; Calendar opens without an Ollo overlay. Usage Access remains a separate granted access.
- **Grant works:** explicit **Allow** connects Ollo, Settings reports Active, and the existing ten-minute manual pause blocks Calendar. Home remains reachable.
- **Revoke and recover work:** native **Stop** removes Ollo's access. Settings changes to off/Partial, Today displays its protection-off warning, and Calendar is unprotected. A second explicit Allow restores connected/Active status and Calendar blocking, with Home still reachable.
- **Controlled scope:** the separate probe instruments itself. Existing production Settings/Today entry intents open those pages; all service changes use actual Android controls. No subject imports, reflection, private reads, clock/deadline injection or shell permission mutation occurs inside the release probe. Debug setup is separate; no call or alarm was created.
- **Honest evidence:** five failed driver runs are preserved, including incorrect dialog assumptions and native root/cache/window races. Their partial checks and 17 diagnostic captures are not accepted coverage. Three consecutive observations establish transition conditions. Raw filenames saying cancel retain their original names; the actual action is Deny.
- **Framework detail:** UiAutomation can keep Android's global Accessibility master on while Ollo's component is absent. The result checks Ollo's exact component, actual UI and blocking behavior.
- **Cleanup passed:** own probe removed; original APK, 19 private files, ownership/modes/SELinux and settings restored, synced and verified after a cold restart before app launch. Shell adbd restored; emulator stopped. User phone untouched.
- **Remaining:** physical/OEM/TalkBack/API36, Usage Access revocation, first disclosure, process-death reliability and transient-purpose cleanup are separate. No user-comprehension, learning or focus outcome is inferred.

App source and APK1d97d9… were unchanged. Earlier 83 unit tests, 0 lint errors/18 existing warnings and 12 packaging checks were retained, not rerun. Development signing remains.

[Exact evidence](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-permissions-release/results.json) · [Native gallery](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/index.html) · [[RECOVERY-RELEASE-REVIEW]]
