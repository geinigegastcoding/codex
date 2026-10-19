# Luna feature coverage audit — 13 October 2026

Scope: the native Android app in `C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android`. Checked against the implemented screens, repository, nutrition models and tests. The user explicitly chose an on-device diary with export/import for this version; automatic account synchronization is not required now.

## Onboarding and goals

| Requested feature | Coverage | Where / qualification |
| --- | --- | --- |
| Personalized onboarding with goals and preferences | Present | Goal, age, measurements, activity, equation preference, units and optional vegetarian preference in `ui/OnboardingFlow.kt`. |
| Editable daily calorie target | Present | You → Edit targets. Changes retain historical targets for previous dates. |
| Protein, carbohydrate and fat targets | Present | Daily target profile and homepage macro bars. Protein is editable; carbs and fat are calculated to fit the calorie target. Independent percentage sliders are optional for this scope. |
| Unit preferences: kg/lb and g/oz | Present; food weight support added in this update | Metric/imperial setting converts body measurements. Portion dialog offers grams or ounces according to that setting when the food has a known serving weight. Bowl counts and liquid volumes are never assigned an invented weight. |
| Optional maintenance or nutrition-only mode | Covered by maintenance goal | “Maintain my routine” is available during onboarding. A separate mode without calorie targets is optional; the requested maintenance alternative is present. |

## Food logging

| Requested feature | Coverage | Where / qualification |
| --- | --- | --- |
| Food search with a reliable nutrition database | Present with a catalog limitation | Text search covers saved foods, previous foods and the bundled sample/recipe catalog. Barcode lookup reads Open Food Facts, with an exact-barcode Jumbo label fallback. Sources are labeled; sample/recipe estimates are not verified package labels. Broad live free-text database search is not implemented. |
| Manual food and calorie entry | Present | Log → Manual add / Enter label; calories, macros and optional fiber can be entered. |
| Accurate serving and portion selection | Present | Serving multiplier, calorie/protein portion targets and known gram/ounce weights; live preview before confirmation. Accuracy depends on the entered/product nutrition label. |
| Breakfast, lunch, dinner and snacks | Present | Four meal groups and meal selector. |
| Edit, duplicate, move or delete logged foods | Present through existing flows | Adjust entry changes quantity and moves between meal groups. Food quick-add repeats previous quantities; Repeat duplicates a meal; copying a previous day creates fresh entry IDs. Delete has Undo. An individual cross-date drag/drop editor is optional. |
| Recent foods, favorites and repeat yesterday | Present | Recent-food memory, Saved foods, saved meals, Copy yesterday / Copy day and Repeat actions. |
| Custom foods and saved meals | Present | Manual add → Save for later; meal → Save meal. |
| Build recipes from ingredients | Covered by saved ingredient collections | Log ingredient foods and their portions in one meal, then Save meal. The collection retains all ingredients/quantities and sums their nutrition. A separate recipe-yield editor and scaling a whole recipe before logging are not implemented; existing saved meals cover the current workflow. |

## Daily dashboard

| Requested feature | Coverage | Where / qualification |
| --- | --- | --- |
| Calories consumed versus target | Present | Homepage shows consumed, target, remaining/over and progress from real entries. |
| Protein, carbs and fat progress | Present | Homepage has the approved three macro bars. Insights adds an energy-share ring. |
| Calorie and macro breakdown per meal | Present; group macro summary added | Log shows group calorie totals and protein/carb/fat totals. Tap an entry for its individual nutrition and share of the day. |
| Today and previous-day navigation | Present | Existing day navigation retains date-specific targets. |
| Daily food diary with individual entries | Present | Log → What you ate, with food, portion, timestamp where known and edit/delete/details. |
| Daily and weekly nutrition history | Present; visual history expanded | Insights has a smooth seven-day calorie curve, historical target line, date selection with each day’s macro totals, scope statistics, macro energy shares and calorie contributor bars. Missing days remain gaps; logged zero-calorie entries remain real zero values. Flexible week retains weekly budget details. |

## Reliability and settings

| Requested feature | Coverage | Where / qualification |
| --- | --- | --- |
| Nutrition data sources and errors | Present | Explicit source labels, distinctions between unavailable/not-found/incomplete database results, label fallback and bounded network reads/timeouts. |
| Data backup and account synchronization | Backup present; automatic sync unnecessary for this version by explicit user choice | You → Export / Import moves JSON nutrition data. Accounts enable photo scanning, not diary sync. Backups include thumbnail IDs, not photo files; moved backups may show placeholders. |
| Privacy settings, export and deletion | Present; full local deletion added | Opt-in analytics controls, JSON export and confirmed Delete local data, which removes profile, diary, saved foods/meals, water/target history and private meal photos. Accounts/subscriptions remain active and are named in the confirmation. Local deletion does not delete the Firebase account. |
| Missing nutritional information | Present | Database products without a complete calorie/macronutrient basis are rejected for manual review. Unknown fiber is explicitly flagged instead of claimed as a measured zero. Unknown food weights do not offer weight conversions. |
| Accessible interface and reliable errors | Implemented; verification recorded below | Pixel number font shared across labels and numeric inputs; minimum control sizes, font scaling, chart summaries/arrows, reduced-motion path, validation, persisted-data recovery and mutation error messages. Physical-device and TalkBack testing are not claimed. |

## Original feedback

- Numeric runs now use the same bundled Silkscreen family as homepage Protein/Carbs/Fat values. Surrounding pixel lettering stays Pixelify Sans. Numeric entry fields also use Silkscreen.
- Insights prioritizes statistics and a smooth calorie curve, with a macro energy-share ring and contributor bars. Smooth interpolation stays between the recorded endpoints and never bridges a missing day. Existing Picnic Passport and Flexible week remain available.
- All five widget styles have a matching angry bunny asset. An existing logging streak with no food logged today becomes at risk from 18:00 local time. Any food log clears that state, including zero-calorie or over-target logs. New/broken streaks do not show anger.
- Widget hour/date cache keys now refresh time-based state on subsequent widget updates. Android’s existing 30-minute update cadence can delay the evening transition; no exact-alarm permission or notification was added.

## Verification

Verified on 14 October 2026:

- Debug app and instrumentation APK assembly passed. The debug app installs as **Luna (Test)**.
- **98 unit tests passed**, with zero failures/errors.
- Lint passed with **zero errors and 60 warnings**.
- **18 distinct Android checks passed** across the final targeted runs: FeedbackUiTest (4), PixelUiTest (6), LoggingDetailsTest (3), PixelWidgetTest (5). Native checks covered the four tabs, onboarding, manual/saved logging, edited targets, empty/over-target days, water, photo details, gram/ounce nutrition equivalence, missing versus zero-entry history, historical targets, local deletion confirmation/cleanup, font scaling, all five widget variants and live hosted widget refresh.
- Native verification used a clean **Android API 35 emulator** at **360 dp / 945×2100 px / 420 dpi**, plus **1.5× text** and **320 dp compact logging controls**. The API 36.1 emulator image had package-installer failures; no physical-device or TalkBack verification is claimed.
- The rendered large-text pass found wrapped axis values; scaling the axis width fixed them. The local-data reset no longer starts a pager animation as that pager is disposed. The relevant native checks pass after both fixes.
- Test helpers use the current Compose dispatcher where needed, distinguish editable search text from food cards, and scroll virtualized lists before querying their rows. Test data, photos and analytics consent are restored; the destructive check requires an empty test app.
- Git diff whitespace checks and the typography detector passed. Previous Gradle/server dependency edits were preserved. No commits or pushes were created.

[Installable debug APK](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/build/outputs/apk/debug/app-debug.apk). SHA-256: `3F8404A51A8DE9975E1156D3B11E27A33FFFD64D949D294C5C7375823C1A30B3`.

[Machine-readable verification](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/design/pixel-ui/verification/2026-10-14-feedback.json), [normal Insights preview](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/design/pixel-ui/feedback-previews/pixel-ui-previews/insights.png), [large-text graph](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/design/pixel-ui/feedback-previews/feedback-previews/insights-large-font.png), [macro chart](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/design/pixel-ui/feedback-previews/feedback-previews/insights-macros.png), [ounce portion](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/design/pixel-ui/feedback-previews/feedback-previews/ounce-portion.png).

The new artwork was created with **built-in Imagegen**, saved in the project and has its exact generation prompt embedded in PNG metadata: [four angry sprites](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/res/drawable-nodpi/luna_pixel_bunnies_angry.png), [wide angry bunny](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/app/src/main/res/drawable-nodpi/luna_pixel_wide_bunny_angry.png), [complete prompt set and asset paths](C:/Users/Daniël/Desktop/Codex/projecten/calorie-tracker-android/design/widget-concepts/angry-sprite-prompts.json).

Local Windows build verification used an ASCII temporary directory for Java sockets and the command-line property `-Pandroid.overridePathCheck=true` for the user path containing “ë”; no shared build configuration was changed for those workarounds.
