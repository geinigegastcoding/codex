# YouTube Studio mobile analytics carousel: frame study

**Research date:** 2026-11-04  
**Purpose:** Evidence for the Larp Dashboard analytics interface.  
**Source video:** [How to use YouTube Studio mobile app](https://www.youtube.com/watch?v=arG_b4MOZD8), a 2023 recording. Source extraction begins at 780 s. Video is 23.976 fps (24000/1001). The supplied sheets contain consecutive frames at 1001/24000 s per frame, arranged row-major, 16 frames per sheet.

## Evidence and timing

I inspected sheets 03–08 individually. These are frame observations from the supplied crops, not a claim that the source recording itself is unedited. The timestamp formula is `780 + n × 1001/24000` seconds, where `n` is the zero-based frame index across the sequence. Therefore sheets 03–08 cover frames 32–127, approximately 781.335–785.297 s. Timing boundaries and individual visual state changes have natural uncertainty of about ±1 frame (±0.042 s). No finger or easing curve is identifiable in these crops.

| Evidence | Frame indices | Approx. source timestamps | Directly observed |
|---|---:|---:|---|
| [carousel-sequence-03.jpg](E:/MData/screenshots/larp-dashboard/research/youtube-studio/carousel-sequence-03.jpg) | 32–47 | 781.335–781.960 s | Overview starts with Views/Watch time; horizontal card movement becomes visible toward Watch time. |
| [carousel-sequence-04.jpg](E:/MData/screenshots/larp-dashboard/research/youtube-studio/carousel-sequence-04.jpg) | 48–63 | 782.002–782.627 s | Watch time card moves into the left/primary position; Subscribers peeks in from the right. |
| [carousel-sequence-05.jpg](E:/MData/screenshots/larp-dashboard/research/youtube-studio/carousel-sequence-05.jpg) | 64–79 | 782.668–783.293 s | Subscribers (+33.2K) becomes the primary card; Estimated revenue is visible as the next card to the right. |
| [carousel-sequence-06.jpg](E:/MData/screenshots/larp-dashboard/research/youtube-studio/carousel-sequence-06.jpg) | 80–95 | 783.335–783.960 s | Estimated revenue ($32K) is primary. The card/chart area continues sliding horizontally. |
| [carousel-sequence-07.jpg](E:/MData/screenshots/larp-dashboard/research/youtube-studio/carousel-sequence-07.jpg) | 96–111 | 784.002–784.627 s | Motion goes back across the cards: neighboring metric content changes from revenue toward Subscribers. |
| [carousel-sequence-08.jpg](E:/MData/screenshots/larp-dashboard/research/youtube-studio/carousel-sequence-08.jpg) | 112–127 | 784.668–785.293 s | The sequence continues back through Subscribers and Watch time; adjacent card edges/contents remain visible during movement. |

The frame series supports a horizontally navigable set of analytics cards and visible partial neighboring cards. It does not reveal the initiating gesture, finger contact, intended easing, or whether an edit/cut occurred outside the inspected spans. Do not describe these as measured touch behavior or infer a specific animation curve.

## Observed screen structure

- The screen has a white presentation in this 2023 recording. This is distinct from the dark reference supplied by the user; treat the reference as the target appearance where applicable, not evidence of Studio's appearance in this source.
- At the top is the YouTube Studio brand row with notification and profile icons, followed by a horizontal analytics section tab row. Visible labels include Research, Overview, Content, Audience, and Revenue; Overview is underlined/selected in the inspected views.
- The metric region has a horizontal carousel. A metric title/value, small context text, and a turquoise line graph with axis labels sit within each card. Adjacent cards peek at the side, with their titles, values, or graph portions clipped by the viewport. Observed metrics include Views (6.9M), Watch time (219.9K hours), Subscribers (+33.2K), and Estimated revenue ($32K). Figures and small graph labels are read from the supplied frames and may be imprecise at this scale.
- The carousel moves while the content below stays in place: a centered page indicator dot, “Your weekly recap is here” with a circular action icon, a Podcasts section with video rows/thumbnails, then Top content. The bottom navigation remains fixed, with Dashboard, Content, Analytics (selected in red), Comments, and Earn. This fixed-versus-moving relationship is directly apparent across the consecutive sheet frames.
- Typography is small sans-serif UI text. The exact typeface, size, weight, and spacing cannot be identified reliably from these scaled frames and are not specified here.
- [Google's YouTube Sans case study](https://design.google/library/youtube-sans-font) describes YouTube Sans as a proprietary display face paired with Roboto for system and body copy. It is useful brand context, but does not identify the exact fonts used in this 2023 Studio recording.

## Source and uncertainty notes

The original video URL above and the supplied local frame sheets are the evidence for this report. The source is a 2023 tutorial, so its interface is historical and does not establish current YouTube Studio behavior. Device model, OS version, and Studio build are not identified in the viewed frames. The previously captured scouting sheet ([scout-0-75s.jpg](E:/MData/screenshots/larp-dashboard/research/youtube-studio/scout-0-75s.jpg)) is separate context and not used to make claims about this carousel sequence.

**Measured from supplied extraction metadata:** source frame rate, extraction start, frame cadence, row-major layout, and sheet frame ranges/timestamps computed by the formula above.  
**Observed visually:** labels, layout, card contents and side-peeking, chart appearance, and lower-page elements listed above.  
**Inferred cautiously:** the horizontal set behaves as a carousel because adjacent metric cards shift through the same viewport in consecutive frames. Gesture source, native implementation, animation easing, exact dimensions, and whether the recording was edited are unknown.

## App implementation guidance

1. Build a horizontal metric-card viewport with a partially visible neighboring card so the next/previous navigation affordance is evident. Keep the metric label/value and its line chart together as one card.
2. Let the carousel move independently while the recap, content lists, and bottom navigation remain stable, as they do in the observed sequence. Preserve normal vertical scrolling for the page.
3. Keep the analytics section tabs at the top and the app's primary navigation at the bottom. In this recording, Analytics is the selected bottom destination and Overview is the selected analytics tab.
4. Match the user's supplied dark reference for the app's intended theme. The source's white surface, turquoise graph, and red selected navigation are reference evidence only, not a requirement to copy its palette.
5. Implement and validate touch/swipe details against the actual product requirements; this footage establishes card translation and peeking, but not finger behavior, duration, or easing. Avoid treating the 2023 labels, values, chart scale, or content as current product requirements.

## Earlier research notes reconciled

An earlier draft incorrectly concluded that no usable video or frame observations existed, then later appended local-video observations. The no-video conclusion is superseded by this supplied, inspectable source sequence. Official product documentation links retained from that draft are contextual product references, not evidence for the observed visuals: [Google Play listing](https://play.google.com/store/apps/details?id=com.google.android.apps.youtube.creator), [Analytics on Android](https://support.google.com/youtubecreatorstudio/answer/9002587?co=GENIE.Platform%3DAndroid&hl=en), [channel performance overview](https://support.google.com/youtubecreatorstudio/answer/9314414?co=GENIE.Platform%3DAndroid&hl=en), [content performance](https://support.google.com/youtubecreatorstudio/answer/12220281?co=GENIE.Platform%3DAndroid&hl=en), and [candidate tutorial listing](https://vidaction.tv/youtube-studio-app-dee-nimmin/).
