# 2026-06-28 - Page Removal & Mobile Perf

- **Session ID**: b4f87502-e07d-46b6-9cab-33cf592b04d0

## Summary
Completely removed the deprecated `ai-automatisering` / `ai-infrastructuur` services from the site structure and resolved major mobile performance bottlenecks by deferring Google Analytics and enforcing responsive images.

## Files Changed
- `public/_redirects` (modified: added 410 redirect, updated cache headers)
- `content/seo.ts` (modified: removed deleted route)
- `content/internal-links.ts` (modified: removed internal references)
- `components/site-footer.tsx` (modified: removed link)
- `components/site-header.tsx` (modified: removed link)
- `app/diensten/page.tsx` (modified: removed service sections)
- `app/layout.tsx` (modified: pushed GA to lazyOnload)
- `components/homepage-sections.tsx` (modified: optimized hero image media queries)
- `components/consent-manager.tsx` (modified: fixed ARIA role)
- `app/ai-automatisering` (deleted)

## Key Decisions & Assumptions
- Decision: Used 410 (Gone) redirect for removed pages instead of 301 to signal permanent deletion to search engines.
- Decision: Changed Google Analytics tags to `lazyOnload` instead of `afterInteractive` to guarantee they don't block mobile LCP/FCP.
- Assumption: The heavy mobile LCP was primarily caused by the 100vw `<picture>` query resolving to the 1122px desktop fallback image on high-DPI screens.

## Next Steps
- Verify the mobile PageSpeed score is stable at 95+.

## Related Notes
- [[decisions]]
- [[2026-06-27 - GA Consent Mode Fix]]
