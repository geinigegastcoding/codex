# Store icon asset — English release folder

The 512 × 512 PNG is a direct render of the existing `app/src/main/res/drawable/ic_ollo.xml` Android vector. The copied XML bytes match the app source; all six paths, order, geometry and five fill colors are retained. No app UI was redrawn and no generative media was used. The separate SVG is the path-for-path conversion input. Re-render with the bundled Node runtime and Sharp; use `OLLO_SHARP_MODULE` if `sharp` is not resolvable normally.

Visual review on 19 October 2026: cream background is opaque and uniform; the mascot is centered, with non-background pixels at x=104–407 and y=132–388. Raster edges contain antialiasing shades, while source path colors remain exact. PNG is 512 × 512, RGBA (4 channels, alpha present with every alpha value 255), 3,632 bytes.

Google Play’s current listing guide requires a 32-bit PNG with alpha, 512 × 512, up to 1,024 KB, and compliance with its icon design specifications. The asset meets the documented encoding, dimensions and size; this does not guarantee approval. No console upload or Play approval was tested.

Reviewed source: [Google Play: Add preview assets to showcase your app](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en-GB), requirements at lines 44–59 and icon design-specifications link at line 58 (reviewed 19 October 2026).
