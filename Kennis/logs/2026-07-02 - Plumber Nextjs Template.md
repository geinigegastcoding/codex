# 2026-07-02 - Plumber Nextjs Template

- **Session ID**: 878b97a7-d4f0-4906-b21b-535aea69af98

## Summary
Converted a static HTML plumber landing page into a fully functional Next.js template with Tailwind CSS v4, shared layouts, mobile-responsive navigation, and complete SEO/local-SEO foundations.

## Files Changed
- `templates/plumber/src/app/page.tsx` (modified)
- `templates/plumber/src/app/layout.tsx` (modified)
- `templates/plumber/src/app/diensten/page.tsx` (created)
- `templates/plumber/src/app/tarieven/page.tsx` (created)
- `templates/plumber/src/app/projecten/page.tsx` (created)
- `templates/plumber/src/app/contact/page.tsx` (created)
- `templates/plumber/src/app/privacy/page.tsx` (created)
- `templates/plumber/src/app/voorwaarden/page.tsx` (created)
- `templates/plumber/src/app/cookies/page.tsx` (created)
- `templates/plumber/src/app/werkgebied/page.tsx` (created)
- `templates/plumber/src/components/Header.tsx` (modified)
- `templates/plumber/src/components/Footer.tsx` (modified)
- `templates/plumber/src/components/LocalBusinessSchema.tsx` (created)

## Key Decisions & Assumptions
- Used Next.js App Router for consistency with the main MagisData website.
- Centralized navigation and footer in `layout.tsx` for easy site-wide updates.
- Replaced emojis with `lucide-react` icons for a more professional aesthetic.
- Implemented responsive hamburger menu and scaled-down CTAs for mobile usability.
- Added LocalBusiness JSON-LD schema, canonical tags, and OpenGraph metadata for local SEO dominance.
- Created a dedicated `/werkgebied` page as a local SEO hub.
- Added standard MagisData backlink in the footer for SEO.

## Next Steps
- Replace placeholder variables (`{brandnaam}`, `{locatie}`) with real company data when deploying for a client.
- Add real project photos to the placeholder sections.

## Related Notes
- [[WebsiteMagisData]]
