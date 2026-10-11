# Luna reliability fixes - 2026-09-19

Project: E:/MData/projecten/calorie-tracker-android
Request: improve the calorie app until weekly Codex remaining usage reaches zero.
Existing uncommitted work was preserved. No commits, push, or production release.

## Changes

- Correct litre/centilitre and sub-gram barcode portion scaling; remove silent scaling clamps.
- Distinguish zero calories from missing nutrition; reject missing/invalid required macros.
- Handle Open Food Facts standard liquid nutrient fields and kilojoule energy fallback.
- Keep serving labels consistent with the nutrient quantity when metadata is missing.
- Preserve exact portions when opening/editing and using quarter-serving controls.
- Reject invalid/nonfinite serving conversions and persistence without changing an existing log.
- Reuse saved barcode corrections and previous foods before making network requests.
- Export the latest stored diary in compact JSON so whitespace cannot break valid large backups.
- Allow damaged data export for repair; add retry and visible storage/onboarding failures.
- Prevent resume reloads from suppressing successful save callbacks; undo targets the newly appended entry.
- Fix meal-repeat calorie totals for historical days and mention water history during restore confirmation.
- Preserve quick-add drafts and entry-edit state across recreation; allow decimal height inputs.
- Treat unentered manual-food fiber as unknown.
- Advance a selected Today at day changes, retaining deliberate history selections.
- Fit navigation to available width and stack daily balance content on narrow screens or larger fonts.

## Verification

- 59 JVM unit tests passed; 18 Android instrumentation tests passed on API 36.
- Debug APK built and installed. Final UI changes compiled and passed lint.
- Lint: zero errors; existing dependency-update/icon and KTX suggestions remain.
- Repository checks cover stale writers, 1,100-entry backup round-trip, invalid restore, corruption preservation, and invalid portions.
- Emulator: decimal onboarding height, quick-add draft rotation, 0.75 serving -> 285 kcal preview and saved quantity, normal and 320dp screen layouts.
- Screenshots in E:/MData/screenshots: luna-portion-075-20260919.png, luna-draft-preserved-20260919.png, luna-small-screen-fixed-20260919.png, luna-final-20260919.png.
- Emulator density and rotation settings restored. Sample test profile and one food entry remain on the emulator.
- git diff --check passed. Existing release checklist remains applicable; this is a debug build.

APK: E:/MData/projecten/calorie-tracker-android/app/build/outputs/apk/debug/app-debug.apk

Reference checked for barcode semantics: https://openfoodfacts.github.io/documentation/docs/Product-Opener/schemas/schemas/product_nutrition/
