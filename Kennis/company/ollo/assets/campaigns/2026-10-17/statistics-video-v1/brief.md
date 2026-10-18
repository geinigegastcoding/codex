# Creative brief: Ollo statistics context video

**Status:** unpublished local concept. **Format:** silent 9:16, 12 seconds, 1080×1920, 30 fps. The goal is to make one narrow product truth clear: a missing day is labeled unknown instead of being shown as zero, and partial coverage is disclosed next to the measured average. This is a trust-led creative hypothesis; it is not evidence of efficacy, comprehension, or campaign performance.

| Time | Copy | Picture |
|---|---|---|
| 0.06–1.78s | “Geen meting? Dan ook geen nul.” | The existing orange pixel mascot bobs once. A single restrained pixel spark appears during the sign-off, not in the opening. |
| 1.82–5.98s | “Onbekend ≠ nul.” / “FICTIEVE REVIEWDATA” | Complete confirmed mixed-week capture, scaled to fit the composition without cropping. Its own “Demo · fictief” UI label remains visible. The screenshot shows 6 of 7 days available, one partial day, a dash for unknown and a separate measured zero. |
| 6.02–9.18s | “Ook dekking staat erbij.” / “FICTIEVE REVIEWDATA” | Complete confirmed 30-day capture, likewise uncropped and unretouched; it shows 24 of 30 days available and three partial days. |
| 9.22–12.0s | “Cijfers met context. Inzicht zonder oordeel.” | Mascot sign-off, no CTA or destination. |

The confirmed screenshots are review fixtures with fictional data, not a user's statistics. The persistent outer demo label is added only in the video composition; source screenshots are embedded as-is and their in-app “Demo · fictief” label remains visible. Only proportional composition resizing is applied; no screenshot crop, retouch, retyped interface, or hidden label is used.

The statements about unknown and partial data match the current Insights UI and `UsageReader` behavior: days with no Ollo local intervals and no Android day history remain `unknown`, are excluded from the average, and unknown chart points display a dash; partial local measurement is shown beside the average. Android daily history is the basis where available, and local fallback can miss usage. The ad does not imply complete coverage or perfect measurement.

No learning, reduced-use, health, exclusivity, privacy, download, store availability, pricing, or customer-result claim appears. No audio, CTA, or fake UI is used. “CONCEPT” remains onscreen.

**Files:** `statistics-context-v1.mp4`, extracted `poster.png`, editable `render.mjs`, and `verification.json`. The script uses the already installed Node runtime, bundled Sharp, and installed FFmpeg; it adds no packages, browser, or remote media.


Scene transitions now fade through the warm background with non-overlapping opacity windows; the renderer asserts no encoded frame has two active scenes. Confirmed screenshot copies live in inputs/ and are hash-checked against their source captures before rendering. The renderer accepts OLLO_SHARP_MODULE, OLLO_FFMPEG, and OLLO_FFPROBE overrides for the already-installed tools.

