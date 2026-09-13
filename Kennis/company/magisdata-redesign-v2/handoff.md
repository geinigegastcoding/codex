# MagisData main site redesign — testing handoff

Date: 2026-09-07
Status: implemented, verified, committed and published to a testing branch. Production not deployed or merged.

## Location

- Repository: https://github.com/geinigegastcoding/magisdata
- Branch: `redesign/main-site-v2`
- Commit: `66aaee848939a0bec2b014877859de21ba1a6b06`
- Verified Git tree: `c2845500edded4a4789b9296a2371e0f83973668`
- Worktree: `C:\Users\Daniël\Desktop\Codex\magisdata-redesign-v2`
- Local preview: http://127.0.0.1:4187/ (static export server, current laptop session)
- Production main unchanged: `b71ce26fe92d2ab90527d541ab252531987951b7`

Git transport stalled on upload. The connected GitHub API created the exact same Git tree; the local branch was synchronized only after tree identity and a clean worktree were verified. The branch tracks origin and is clean.

## Creative direction

Industrial editorial design: warm ivory, charcoal, vermilion, and a muted sage supporting surface. Manrope typography with IBM Plex Mono annotations; locally served via Next fonts. New geometric wordmark and favicon, expansive editorial hierarchy and clean rules instead of repeated cards.

Original generated cable sculpture shows tangled work becoming ordered routes through machined aluminium guides. Integrated across the hero rather than framed as an image card. Hero WebP: 1870×841, 92,214 bytes. Matching social artwork: 1200×630, 335,431 bytes. Both committed under public/assets/redesign/. Original source retained locally in ignored artifacts/.

## Page structure

1. Clear Dutch offer, primary AI-scan CTA, continuous sculptural hero.
2. Keyboard-accessible workflow explorer: email, leads, reporting, company knowledge.
3. Audit, build, and handover through an editorial process section.
4. Existing time-value calculation with explicit 52-week basis and no savings promise.
5. Real founder portrait, direct working relationship and transparent operating principles.
6. FAQ synchronized with structured data.
7. Vermilion closing CTA and rebuilt navigation/footer.

Contact page and form are rebuilt to carry the same visual system. Existing supporting routes retain their content/layout logic, with shared new typography, palette, navigation and footer. No fabricated clients, results, prices, testimonials or dashboard proof.

## Preserved and corrected

- Next.js App Router static export and trailing-slash routing.
- Existing routes, contact integration and form field names.
- Formspree endpoint https://formspree.io/f/mgolbyvp, native validation, failure/retry/success states.
- Analytics ID G-H6G8TMGDWY and consent-aware CTA/lead events.
- Fixed inherited unconditional GA loader: Google loads only after permission; refusal/revocation stop tracking.
- Calculator formula and independent ROI route.
- Canonicals, JSON-LD, sitemap, robots, llms.txt, security headers, redirects and current verification token.
- Updated social metadata for homepage and main supporting pages; removed redundant global robots default that conflicted with 404 noindex.
- Removed seven already-filtered dead landing-content entries and replaced obsolete tests with relevant route/consent checks.

## Verification

- `npm run build`: pass, static export complete.
- `npm run typecheck`: pass.
- `node --test tests/*.test.mjs`: 13/13 pass (Node 24 in this session).
- Rendered screenshots: 1440×1000 desktop, 1280×800 laptop, 390×844 mobile, 320×780 small mobile.
- No JavaScript page errors, missing images or page overflow at those sizes.
- Calculator extremes checked at 1440, 1280, 1024, 768, 390, 360, and 320 widths; EUR 3,900,000 maximum fits; zero hours returns zero.
- All four workflows switch; arrow/Home/End tab navigation implemented; arrow navigation verified.
- Mobile menu opens and closes on Escape and link activation; native FAQ opens.
- Browser network interception verifies zero Google requests before consent, one loader on acceptance, and tracking disabled on revocation.
- Form POST intercepted locally: simulated 422 preserves input; retry with simulated 200 shows success. No test message was sent.
- All 31 exported HTML files audited: titles max 63 characters, one H1, at least seven valid internal page links, canonicals/OG URLs aligned, valid JSON-LD, all assets/anchors resolve.
- Checked text contrast; closing CTA darkened to meet small-text contrast.

## Screenshots and local tools

Screenshots: `C:\Users\Daniël\Desktop\Codex\magisdata-redesign-v2\artifacts\screenshots\`

- desktop-hero.png, desktop-full.png
- laptop-hero.png, laptop-full.png
- mobile-hero.png, mobile-full.png, mobile-contact.png
- small-mobile-hero.png, small-mobile-full.png
- desktop-systemen.png, desktop-werkwijze.png, desktop-rekenen.png, desktop-over-magisdata.png, desktop-faq.png

Local browser scripts and JSON results are in ignored artifacts/ (machine-specific Playwright paths). They are not production assets.

To run development from this worktree: `npm run dev -- --port 4188`.
To rebuild: `npm ci` then `npm run build`. Serve `out/` using a static server for production-style preview. `next start` is not the server for this export configuration.

## Before production

1. Review inherited dependency advisories. npm ci reported 14 advisories overall; npm audit --omit=dev reported five high-severity package entries, including Next, Sharp and transitive packages. No dependency upgrades were mixed into this visual rebuild. Applicability and remediation need a separate review; this site uses a static export.
2. Run one intentional real form-delivery check and confirm analytics in the actual hosting environment. Local tests intercepted requests rather than sending business messages or analytics data.

No known remaining visual or functional defects in the rebuilt homepage/contact flow. No production action authorized or performed as part of this handoff.
