# WebsitePapa2: redesign and design QA

Date: 2026-10-23

final result: passed

The public MagisIntel site in `E:/MData/klanten/WebsitePapa2` was rebuilt from Daniel's desktop reference. The working production preview is [http://127.0.0.1:3010](http://127.0.0.1:3010). This update has not been committed, pushed, or deployed to the live domain.

## Visual sources and evidence

- Supplied ZIP: `E:/MData/projecten/calorie-tracker-android/app/src/debug/Untitled.zip`.
- Full reference: `E:/MData/klanten/WebsitePapa2/.codex/design-reference/Untitled.png`, 1604 x 6132 pixels.
- Detailed process reference: `E:/MData/klanten/WebsitePapa2/.codex/design-reference/image 55.png`, 1579 x 889 pixels.
- Supplied portrait, vehicle artwork, company logos and brand mark: `C:/Users/daniel/.codex/attachments/6d93ff01-784c-4cd6-8d78-be1cdabad0d0/`.
- Browser captures and paired source/implementation comparisons: `E:/MData/klanten/WebsitePapa2/.codex/qa/`.
- Full browser capture: `desktop-full.png`. Focused comparisons: `comparison-hero.png`, `comparison-flow.png`, `comparison-process.png`, `comparison-closing.png`.
- Responsive evidence: `mobile-hero.png`, `tablet-hero.png`, and `layout-checks.json`.

Desktop comparison used a 1604 x 1055 CSS viewport. Windows browser captures exclude the 15-pixel scrollbar, so the implementation capture is 1589 pixels wide. Source and implementation regions were both normalized to 800 pixels wide for the paired comparisons. Full-page composition was also compared; the existing site's footer is retained beyond the reference's final section. The process starts on Analyse, with the search empty and all four example rows visible, matching the supplied detailed reference.

Final saved captures: full desktop 1589 x 6863 pixels; desktop first screen 1589 x 1045; mobile first screen 375 x 812 at the requested 390 x 844 test size. Comparison regions preserve their aspect ratios; neither reference nor implementation was stretched.

## Required visual surfaces

| Surface | Verified result |
| --- | --- |
| Typography | Locally hosted Google Fonts Lato, weights 400, 700 and 900. Hero, reviews, process and closing headline scale were compared with the reference. Headings remain readable at all tested widths. |
| Layout and rhythm | Dark hero with portrait and vehicle panorama, experience strip, connected file cards, five testimonials, five-step process, comparison and blue CTA. Card padding, column proportions, active states and responsive stacking were inspected. |
| Colors | Near-black backgrounds, cream hero type, amber primary actions, restrained blue connections and active table rows, green validation indicators, and the dark-blue closing section. |
| Images and icons | Portrait and vehicle artwork are ordinary image assets. File diagrams, process panels, comparison tables and closing artwork are actual web components. No cropped reference screenshots remain in those sections. Excel uses Microsoft's SVG; file, database, search, cloud and chart icons use Tabler SVGs. |
| Copy | Supplied main promise, testimonials and process copy retained. Borrowed Tenki navigation replaced with the site's real navigation. Raw/clean file labels use Dutch. Example data is visibly identified as fictional. |

The source reference was inspected together with the rendered implementation in each paired comparison. The detailed comparisons cover both overall composition and readable file/table content.

## Corrections made during QA

1. Replaced the initial raster diagram sections with semantic HTML cards, SVG connections, actual file icons and scalable closing artwork after Daniel clarified that the images were references.
2. Fixed visible background rectangles around the experience logos.
3. Increased table text and replaced letter-based file badges with actual SVG assets.
4. Corrected the 320-pixel layout's minimum-width overflow.
5. Reworked tablet portrait placement so Gerhard's face is fully visible.
6. Refined headline weight, file labels, icon sizes and closing CTA scale after the paired comparison.
7. Captured the revised page and repeated the visual, interaction and responsive checks.

No actionable P0, P1 or P2 issues remain. The vector closing characters intentionally use flatter shapes than the raster reference, following the request to build real web elements.

## Verification

- `npm run build`: passed, Next.js 16.4.3, including TypeScript.
- `npm test`: all 21 tests passed, including existing Papa/Luna tests.
- Browser interaction checks in `tests/redesign.browser.mjs`: passed. These cover menu navigation, inert content while the menu is open, Escape/focus recovery, every process tab, arrow/Home/End keyboard navigation, case-insensitive search, empty results, search reset, difference filtering, example anchor, real contact destination and contact FAQ.
- Responsive widths: 320, 390, 768, 1024, 1440 and 1604 pixels. No page-wide overflow or clipped headings.
- All eight public routes checked; the seven inner routes were additionally checked at 390 and 1440 pixels.
- `npm run test:seo` against the production preview: passed. Eight HTTP-200 pages, titles of 33-56 characters, descriptions, canonicals, Open Graph, Twitter cards, JSON-LD, at least three internal links, robots/sitemap, a real noindex 404, and all 17 discovered internal targets.
- Production browser warning/error log: empty.
- `npm audit --omit=dev`: zero vulnerabilities. Next.js was patched from 16.4.0 to 16.4.3 after the existing installation reported critical advisories.
- `git diff --check`: passed. Git's LF/CRLF notices are normal workspace line-ending normalization.

The test runner still emits the pre-existing MODULE_TYPELESS_PACKAGE_JSON warnings for `lib/luna.ts` and `lib/papa-ai.ts`; tests pass. Cloudflare deployment and real portal sign-in were not performed. Portal behavior and privacy text were preserved.

## Asset sources

- Lato: Google Fonts, locally stored in `public/fonts/lato/` with its OFL license.
- Excel: Microsoft's Office CDN product icon, with the exact source recorded in `public/icons/sources.txt`.
- Other SVG icons: [Tabler Icons](https://github.com/tabler/tabler-icons), MIT license retained in `public/icons/tabler-LICENSE.txt`.

## Spacing and hero refinement

Daniel requested a consistent background for the data-flow section, a road that fits inside the hero, and smaller content with more whitespace.

- Ordinary homepage sections now share `#0d0d0c`. The closing blue CTA remains the visual accent.
- The road is inside the bounded hero stage, with all three vehicles visible below the copy and actions. Desktop hero height follows the viewport between 740 and 840 pixels. Headline size also responds to short windows.
- Content width is capped at 1200 pixels, with smaller headings, diagrams, tabs, icons and CTA controls, and more space around sections. Body copy remains readable. Portrait and road edges blend into the background.
- The file-card SVG connections were realigned to the reduced card heights. Process search, tabs, comparison filtering, contact links and the mobile menu remain functional.
- Production build passed. All 21 automated tests passed. Browser interaction checks passed. The SEO crawl passed all eight routes and 17 internal targets. Browser warning/error logs were empty.
- Layout assertions passed at 320, 390, 768, 1024, 1440 and 1604 pixels wide at 900 pixels high, plus 1024/1366/1604 x 768 and 1604 x 740. The assertions check matching section backgrounds, road containment, separation from hero actions, heading fit, and horizontal overflow. All seven inner routes also passed at 390 and 1440 pixels.
- Current focused evidence: `premium-desktop-hero.png`, `premium-mobile-hero.png`, `premium-desktop-flow.png`, `premium-desktop-process.png`, `premium-desktop-closing.png` and `premium-layout-checks.json`, under `.codex/qa/`. Earlier comparison images predate this requested refinement. A full-page recapture from the top failed in the in-app browser; focused captures and measured layout checks were used for the final verification.

This refinement remains local and uncommitted.

## Full-screen feedback correction

Daniel clarified that the hero text must stay centered and that the face placement was the main spacing issue.

- The hero copy is centered on the page, without a horizontal offset. The portrait shares its grid row, sits to the right beside the headline, and scales with available desktop height. The road occupies its own row below both. This replaces the fixed-height stage and absolute portrait placement described in the earlier pass.
- The introductory paragraph has a narrower measure so its text stays clear of the portrait. All words are retained.
- Adjacent sections now have a single spacing allowance. Measured desktop gaps are 88, 101, 96 and 96 pixels, replacing the earlier 160-176 pixel gaps. Process tabs use equal columns.
- Rendered and inspected at 1920 x 1080 and 2560 x 1440, plus laptop and mobile sizes. Final evidence: `fullscreen-1920-hero.png`, `fullscreen-2560-hero.png`, `fullscreen-mobile-hero.png` and `fullscreen-layout-checks.json` under `.codex/qa/`.
- Browser assertions verify centered hero copy, portrait position beside the heading, road separation, section gaps, background consistency and overflow. Twelve viewport combinations and seven inner pages passed. Full interaction checks passed again.
- Final production build and all 21 automated tests passed. No commit, push or deployment was performed.

## Continuing locally

The production preview remains open in the in-app browser. If it has stopped, run `npm run dev -- --port 3010 --hostname 127.0.0.1` from `E:/MData/klanten/WebsitePapa2`.
