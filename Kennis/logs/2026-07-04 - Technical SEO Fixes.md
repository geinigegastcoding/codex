# 2026-07-04 - Technical SEO Fixes

- **Session ID**: 34eab2fa-7a9e-4d21-9bcd-c1bb5e9102c8

## Summary
Audited and resolved multiple technical SEO issues including broken links caused by Cloudflare email obfuscation, missing Open Graph tags, a 410 redirect error for insights, and a JSX syntax/duplication error blocking the Cloudflare Pages build.

## Files Changed
- `content/seo.ts` (modified)
- `app/inzichten/page.tsx` (modified)
- `app/inzichten/[slug]/page.tsx` (modified)
- `app/contact/page.tsx` (modified)
- `components/contact-form.tsx` (modified)
- `components/site-footer.tsx` (modified)
- `Keywoard-pages/routes/website-laten-maken-voor-kappers-voorschoten/page.tsx` (modified)
- `Keywoard-pages/routes/website-laten-maken-voor-loodgieters-voorschoten/page.tsx` (modified)
- `public/_redirects` (modified)
- `components/homepage-sections.tsx` (modified)
- `content/landing-pages.ts` (modified)

## Key Decisions & Assumptions
- Replaced `mailto:` anchors and broke up plain text emails with `<span>` or zero-width spaces to bypass Cloudflare email obfuscation without disabling the feature.
- Consolidated and cleaned up duplicated component exports in `homepage-sections.tsx` to fix a Turbopack build failure.
- Updated `_redirects` rules to capture HTTP traffic for `www` and removed the erroneous `410 Gone` rule for the `/inzichten` path.
- Assumed `www.magisdata.nl` needs to be linked as a custom domain in Cloudflare Pages to resolve 522 timeouts.

## Next Steps
- Verify the Cloudflare Pages build successfully deploys the latest fixes.
- Check Cloudflare Pages custom domain settings if the 522 timeout on `www` persists.
- Integrate Keyword Pages into the Next.js App Router if they are intended to be published live.

## Related Notes
- [[website]]
