# English Play phone screenshots

Six genuine screens from the Ollo `0.3.1-preview` candidate (source `0bef8f68c04041e4b58f2be6c2ade4d24d69df8f`; APK SHA-256 `4ea8eec82b63294c60f18d0bcdb1e6332507aa830fef4804a15089ac1f37ba93`). These are a curated feature set, not a sequential six-step onboarding flow.

Each 1080×1920 raw capture is preserved unchanged as the complete app-UI rectangle, uniformly scaled to 936×1664 (13/15) and placed at x=72, y=204 on a 1080×1920 frame. The external frame adds only the title, a small pixel spark, and—on screens 5 and 6—a clearly visible “FICTIONAL DEMO DATA” label. No Play approval or performance is implied. See `capture-log.json` and `verification.json` for route, fixture, and hash provenance; `visual-review.json` records the visual check.

| File | Route and fixture | Alt text |
|---|---|---|
| `framed/01-choose-your-apps.png` | Onboarding distraction-app choices; fresh default configuration. | App picker with YouTube selected and a button to choose essential apps. |
| `framed/02-keep-essentials-close.png` | Onboarding optional essentials; fresh default configuration. | Optional essentials list with Maps selected while calls, alarms, and system settings stay available. |
| `framed/03-make-room-for-routines.png` | Morning routine settings; fresh default configuration. | Morning routine schedule with weekday and weekend time ranges. |
| `framed/04-find-an-offline-idea.png` | Alternatives / Ideas screen; fresh default configuration. | Ideas screen with duration, energy, and time filters. |
| `framed/05-understand-your-patterns.png` | Insights screen; partial fictional read-only fixture. | Fictional demo of weekly distraction insights with measured-day coverage and a bar chart. |
| `framed/06-a-calmer-daily-view.png` | Today screen; partial fictional read-only fixture. | Fictional demo of today’s distraction minutes, goal progress, and hourly chart. |

Screens 5 and 6 contain illustrative fixture values, not a real person's usage. The label is present in both the frame and app UI. Screen 1's lower app row continues below the app's fixed action area in the captured viewport; the screenshot itself is not cropped by the frame renderer.
