# Luna Android UI handoff

The approved Sep 21 screenshot is the source of truth for Luna’s finished visual treatment. It supersedes the Sep 20 yellow Picnic concept. The UI is a cheerful, colorful cartoon interface with a warm cream background, dark navy ink, coral primary actions, mint/peach/sky accents, Fredoka display type, Nunito body text, and Lilita One for the calorie counter. The approved reference is [the chosen screenshot](C:\Users\daniel\AppData\Local\Temp\codex-clipboard-a977f00b-61a5-425a-a427-94da10d5f964.png).

Today leads with a live open half-circle calorie gauge. It shows eaten, goal, and a centered remaining amount; the arc supports empty, in-range, and over-target states, with over-target wording shown as “kcal over.” Macro totals sit below. Values come from the existing data and profile logic; screenshot/demo numbers must not be hard-coded.

Four meal cards use matching cartoon drawings: yogurt, sandwich, salmon bowl, and apple slices. Each card shows the actual logged food names and total calories, expands to individual entries, and keeps edit/delete/repeat/save actions available. The coral “Log food” action is paired with a separate Scan action.

Hydration is a friendly bottle row with visible progress droplets, a tappable Water area, and a +250 control. Expanded water actions include -250 ml and +500 ml. Bottom navigation remains Today, Log, Insights, and You. Insights preserves Picnic Passport.

Above the calorie count, `luna_bunny_poses.png` is a transparent 2×2 sprite with strawberry, water, apple, and carrot bunny poses. It rotates every eight seconds, supports tap-to-cycle, and pauses when Today is inactive, the app is backgrounded, animations are reduced, or TalkBack/touch exploration is active.

Use the existing responsive behavior for small phones and large font scales. Source assets and provenance are [drawable-nodpi assets](E:\MData\projecten\calorie-tracker-android\app\src\main\res\drawable-nodpi) and [approved generation prompts](E:\MData\projecten\calorie-tracker-android\output\imagegen\approved-ui-assets-prompts.json). Keep implementation aligned with [Theme.kt](E:\MData\projecten\calorie-tracker-android\app\src\main\java\com\magisdata\luna\ui\Theme.kt), [PicnicComponents.kt](E:\MData\projecten\calorie-tracker-android\app\src\main\java\com\magisdata\luna\ui\PicnicComponents.kt), and [LunaApp.kt](E:\MData\projecten\calorie-tracker-android\app\src\main\java\com\magisdata\luna\ui\LunaApp.kt).
