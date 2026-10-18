---
title: Ollo Settings access heading
created: 2026-10-18
updated: 2026-10-18
type: project
status: verified-local
tags: [ollo, native-ui, clarity]
---

# Settings access heading

- **Changed:** the Settings section now says **Android-toegang**, instead of an aggregate **Bescherming · Gedeeltelijk/Actief/Uit** heading. The separate Usage Access and app-protection rows still show their actual states.
- **Why:** the prior permission review showed “partial protection” while only usage measurement was enabled and blocking was off. The neutral heading avoids that possible implication. This is a clarity inference, not an observed user-comprehension finding.
- **Scope:** one line in `OlloApp.kt`. Permission actions, row copy, onboarding, controller, rules and orange visual identity are unchanged.
- **Verified:** debug and minified release assembly, all 83 existing unit tests, lint with 0 errors/18 existing warnings, and all 12 review-package checks. Actual minified Settings captures at normal and 200% text show the heading and both complete access-status rows. Parent visually reviewed both captures; no correction pass was needed.
- **Candidate:** release SHA-256 `c4cbcc50c68b959a4f6de1f2e8404f13e4ac513be93fb3ada14bebfce58c2045`. Development signing, unpublished. Evidence: app `docs/evidence/2026-10-18-access-heading/`; two PNG/XML pairs in `screenshots/2026-10-18-access-heading/`.
- **Limits:** this batch keeps Accessibility off and Usage Access allowed; it does not repeat the prior permission-recovery/blocking suite on the new APK. No physical-device, OEM, TalkBack, API36 or user-comprehension acceptance. Original emulator APK, 19 persisted files and settings were restored and cold-boot verified; emulator stopped. User phone untouched.
