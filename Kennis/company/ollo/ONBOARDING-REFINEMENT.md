---
title: Ollo onboarding selection refinement
created: 2026-10-17
updated: 2026-10-17
type: implementation
status: verified-local
tags: [ollo, android, onboarding, accessibility]
---

# Onboarding selection refinement

The native setup had two observable problems. In the app-selection steps, only the checkbox accepted a tap; the app name was separate inert text and the checkbox was unnamed. At 200% text, continuing from the previous page could carry its scroll position into the next step, hiding the new heading. Both were captured on the owned API 34 emulator before editing.

## Change

The existing app row now owns one native checkbox selection action containing the app name. Tapping the name, row space or checkbox area selects the same item. The displayed checkbox has no second callback; its existing 48 dp space preserves alignment and row height. A composition key for the current setup step recreates that page's scroll state when the step changes, including Back.

Selection rules remain the same: distraction edits only `distraction`, essentials edits only `essential`, and safety essentials remain checked and disabled. A safety app can still be included in distraction measurements independently of always being reachable. No new setup step, permission, default, feature or data schema was added. Existing orange Material controls and the pixel mascot remain.

## Evidence and limits

The actual `MainActivity` onboarding route is used with the emulator's saved configuration; these are live controls, not a static review snapshot. Original APK and nineteen persistent files were backed up and extraction/SQLite integrity checked before testing. Raw private backups stay under ignored app artifacts.

The final build passed with the source hash unchanged between start and finish: debug and minified release, 75 unit tests, lint 0 errors / 18 existing warnings, library inventory and all 12 review packaging checks. The release is still development-signed, version 0.2.0-review (3).

Native confirmation passed 20 checks with nine captures at each of normal and 200% text: 40 checks and 18 candidate captures. Parent independently checked all results, eight XML row/state/role observations, heading bounds, APK/source hashes and build reports. One batched final visual review confirmed unchanged alignment, visible headings and unclipped large text. The confirmation scope includes row action/label/state, taps on both sides, editable essentials, checked/disabled Clock, independent distraction selection for Clock, search clearing and page headings on forward/Back navigation. It does not establish TalkBack speech, physical-device/OEM acceptance, all nine steps end to end or runtime acceptance of the minified release.

All original policy values remained equal after the test. The full configuration matched the two expected test effects: one default Clock policy entry after selecting/deselecting it, and exactly twelve increments of the existing classification counter for twelve intended changes. The original nineteen-file persistent set was then restored with exact hashes, owners and modes; the original APK hash, font 1.0, viewport/density, permissions and shell adbd identity were independently verified. The emulator is stopped. OS UsageStats test-launch history is not rolled back. The user's phone was untouched.

Preserved history includes an initial baseline driver matching the search field instead of the app-name text, the actual large-text scroll-position failure, and a candidate driver expecting a flat `CheckBox` node. The default Compose XML instead exposes one checkable parent with a text descendant and inert role placeholder. The harness now scopes the label under that action; app source did not change for the harness repair. A first build was superseded when the scroll-reset patch was added during compilation; only the final stable-source build is used for candidate artifacts.

## References

Impeccable onboarding/native guidance and Ponytail full informed the bounded implementation. [Ro's selection screen](https://mobbin.com/screens/2aeae146-e9a5-429a-a48d-b7da48039d0c) provided a whole-row choice reference; [Shopify's searchable selection](https://mobbin.com/screens/a3437546-7a98-4717-8c69-4e67ed526f85) showed another scoped list pattern. They are iOS references, not copied Android components or assets. Android's [Compose accessibility defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults) describe moving the selection callback to a parent and retaining a noninteractive checkbox indicator.

App evidence is saved under `docs/evidence/2026-10-17-onboarding-selection/` and `screenshots/2026-10-17-onboarding-selection/`. Seven native attempt records, including three failures, remain visible; baseline diagnostics are not added to the 40 candidate checks. The gallery now indexes 455 images across all milestones.

Candidate release: `artifacts/review/Ollo-0.2.0-onboarding-selection-release-2026-10-17.apk`, SHA-256 `f2449aaad97f81e5a4941c9692ad294783bccb9502354db176f12890cec1156f`. The native suites used the debug candidate, SHA-256 `4a244c95ad5b88d7dbae085ce558b2e4b961156490193ad7d0bba2444c28ef78`. Both contain the final stable-source patch; no publication or production signing occurred.

Local source/evidence commit: `ed1bbed`. The canonical source manifest contains 993 index-blob entries, and the app worktree was clean after the commit.
