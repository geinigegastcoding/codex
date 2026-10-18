---
title: Ollo day-selection states
created: 2026-10-18
updated: 2026-10-18
type: project
status: verified-local
tags: [ollo, native-ui, accessibility]
---

# Day controls that match the lock

- **Fixed:** day chips in an active fixed time block now look disabled and expose a disabled native state. Previously they looked editable and were announced as enabled, while taps did nothing.
- **Small change:** three lines pass the existing `activeFixed` state into Material's chip. The callback guard, time rules, controller, storage and orange identity are unchanged.
- **Verified:** 83 existing unit tests, lint with 0 errors/18 existing warnings, and 12 review-package checks. Six actual minified UI cases cover locked days, editable new-block days and editable morning days at normal and 200% text. All six accepted screenshots were visually inspected.
- **Evidence:** three baseline captures, six accepted captures and four separate driver-diagnostic captures. Two helper viewport cutoffs were corrected; neither required another app edit/build. The complete six-case batch passed after correction; failed prefixes are not added to acceptance. App evidence: `docs/evidence/2026-10-18-day-picker/`.
- **Candidate:** Dutch review APK SHA-256 `5e947ad801a304c2e3fa536c87e5fe8ce80e04c32b972511a3efa01076d3c553`, development-signed and unpublished. The user's later English-UI approval is the next task, with separate artifact/evidence required.
- **Restored / limits:** original emulator APK, 19 persisted files and settings were restored, synced and cold-boot verified; emulator stopped. User phone untouched. One API34 emulator with protection off; no TalkBack, keyboard, physical/OEM/API36, rule-enforcement, rotation or user-comprehension acceptance. Editable-day checks were unsaved UI changes.
