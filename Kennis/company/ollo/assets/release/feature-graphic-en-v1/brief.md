# Ollo English Google Play feature graphic

**Status:** unpublished English-localized draft; not submitted to Play Console.

**Copy:** “Ollo” / “A pause.” / “Your choice.”

**Alt text (75 characters):** Ollo’s orange pixel mascot beside “A pause. Your choice.” on a cream panel.

**Composition:** Adapts the existing code-native `feature-graphic-v1` layout: same orange gradient field, inset cream panel, orange pixel mascot, circular ground, small spark and edge pixels. The mascot input is copied byte-for-byte. Only the two tagline lines and English alt text are localized; no app UI is edited or depicted. No CTA, store badge, device frame, screenshot, performance, health, price or exclusivity claim.

**Technical check:** 1024 × 500 opaque RGB PNG, no alpha. `verification.json` records actual source/output SHA-256, dimensions, channels, render date, runtime versions and visual-review findings. Renderer uses standard `sharp` resolution or `OLLO_SHARP_MODULE`; no personal absolute-path default. Run with the bundled Node runtime and set `OLLO_SHARP_MODULE` to its Sharp package path when needed.

**Platform reference reviewed 19 October 2026:** Google Play’s [official preview asset requirements](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en-en) specify JPEG or 24-bit PNG without alpha at 1024 × 500. This format check and visual review do not establish Play approval, cropping behavior across surfaces, publication, or performance.
