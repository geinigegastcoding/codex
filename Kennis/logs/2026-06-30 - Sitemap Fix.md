# 2026-06-30 - Sitemap Fix

- **Session ID**: e62012fd-3a37-4015-8b20-0d2862c392d2

## Summary
Resolved sitemap raw text rendering issue by removing redundant language alternates causing xhtml tags, rebuilt static export, and documented Website routing rules in Kennis.

## Files Changed
- `C:\Users\Daniël\Desktop\Codex\WebsiteMagisData\app\sitemap.ts` (modified)
- `C:\Users\Daniël\Desktop\Codex\Kennis\website.md` (created)
- `C:\Users\Daniël\Desktop\Codex\AGENTS.md` (modified)

## Key Decisions & Assumptions
- Removed `alternates` from `sitemap.ts` since site is single-language Dutch and Next.js `xhtml:link` tags were breaking XML tree rendering in browsers.
- Wrote a token-optimized `website.md` context map to prevent future unnecessary directory hunting.
- Updated `AGENTS.md` to force reading `website.md` first for all website tasks.

## Next Steps
- Verify sitemap indexing in Google Search Console if necessary.

## Related Notes
- [[website.md]]
- [[AGENTS.md]]
