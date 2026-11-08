# Shopify mobile app research (video evidence)

## Source and evidence
- Assigned source: [How to view analytics on Shopify app](https://www.youtube.com/watch?v=00FgN6OKI1k), local supplied video `C:\Users\daniel\AppData\Local\Temp\dashlab-video-research\shopify.mp4`.
- ffprobe: 1280x720, 60 fps, duration 59.8167 s (about 3,589 frames). Video depicts a phone screen recording composited over a blurred app-icon background, with large title text at opening. The phone UI is portrait; exact device pixel dimensions cannot be determined from the composite. Android status/icons are visible in places, but OS version, Shopify app version, recording date, and source publication date are not established from inspected frames.
- Full-video scout sampled every 3 seconds; evidence image: `E:\MData\screenshots\larp-dashboard\research\shopify\scout.png`. It shows Shopify Analytics views through most of the tutorial, an initial product editing screen, and a navigation drawer. Source-rate sequence evidence: `E:\MData\screenshots\larp-dashboard\research\shopify\analytics-sequence.png` (timestamps 20–23 seconds, 60 frames/sec; numbered source frames tiled in temporal order). The recording has an overall fast-forward/shortened appearance; precise interaction timing is uncertain.

## Observed UI
- White analytics page with a compact black top app bar titled “Analytics” and a down-chevron. On the first analytics view, two compact date/filter chips sit below the bar; the legible content includes Gross sales, Returning customer rate, Orders fulfilled, Orders, and Total sales over time. Values are mostly zero or unavailable in this demo account.
- Scrolling reveals many stacked report cards: sales by channel, average order value over time, sessions over time, conversion rate over time, sales attributed to marketing, sessions by device type (blue bar / ring visual), sessions by location (horizontal blue bars), customer cohort analysis (table), and other report sections. Empty states read “No data for this date range.” Charts use Shopify blue with pale blue bars on white. Navigation is a persistent five-icon bottom bar (icons visible, labels not legible at this scale).
- The navigation drawer is black with white text and category rows including Home, Orders, Products, Customers, Marketing, Discounts, Content, Markets, Analytics, Sales channels, Online Store, Apps, Settings. An “Analytics” report-list/menu is also visible with report names in blue on white.
- A separate product editing screen appears briefly: “Product status,” “Media,” “Product title,” description/category fields and sales channel options. Not treated as part of analytics interaction.

## Interaction and timing evidence
- 0:00–~0:18: opening title / phone home-screen footage and transition into analytics. Exact tap is obscured by title and miniature scale; no specific tap target or animation duration claimed.
- ~0:18–~0:24: analytics overview visible with sales summary cards and a thin blue time-series chart. Around 20–23s the source-rate contact sheet contains repeated analytics overview frames. No reliably readable touch or chart-selection state change is visible there; therefore no before/during/after chart gesture is asserted.
- ~0:24 onward: analytics report content changes across views and scroll positions; charts and tables are visible, including sessions by device (blue bars and donut) and sessions by location (blue horizontal bars). The sparse whole-video scout establishes these states but not continuous scroll velocity or animation.
- ~0:39–~0:42: drawer/menu state appears, exposing dark navigation categories and Analytics report names. The exact initiating tap and transition easing are not sufficiently legible to measure.
- Across the recording, cards and chart sections update by view/scroll, but there is no clearly observed interactive chart scrub, date-picker result, or filter application in the inspected sequential interval. Do not infer gesture behavior from static report changes.

## Visual estimates and limits
- Palette identification is qualitative: black navigation/header, white report surfaces, dark gray text, Shopify-blue chart marks, pale blue secondary marks. Exact color values are not sampled.
- Typography appears to be a compact sans serif; font family, point size, spacing, and physical dp dimensions cannot be identified reliably from the scaled composite.
- Shopify's [Polaris 2 migration guide](https://shopify.dev/docs/apps/build/app-home/polaris2) says the updated Shopify admin uses ShopifyInter. That refers to the updated admin experience and does not establish the font in this particular mobile recording.
- The report cards are vertically stacked and narrow, with small headings, thin separators, minimal decoration, and blue chart highlights. There is no reliable way to measure exact card height or scroll offset from the supplied landscape composition.
- Contact sheets are evidence aids, not substitutes for the full recording. The analytics sequence contains 180 frames over 3 seconds at 60 fps in timestamp order; at 60 fps each adjacent source frame is 16.67 ms apart. The displayed composite appears largely static within the selected interval, so transitions/taps there remain unverified.

## App implications supported by the footage
- Keep analytics reports in a single vertical scroll surface, with compact report cards, clear section titles, and blue chart marks on white backgrounds.
- Support meaningful empty states per report; this demo repeatedly shows no-data messaging rather than blank chart space.
- Keep navigation to analytics discoverable from the menu and provide report-level navigation/listing. The footage supports the existence of these structures, not exact transition or date-filter behavior.
- Do not tune animation timing, exact typography, color hex values, chart interactions, or device-specific dimensions from this source; evidence is insufficient.
