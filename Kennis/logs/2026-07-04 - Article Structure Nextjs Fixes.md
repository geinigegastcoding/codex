# 2026-07-04 - Article Structure & Nextjs Fixes

- **Session ID**: 3f2da29b-c19a-42ab-9202-4994bd1fbb3c

## Summary
Built a fully automated Article generation & publishing infrastructure via Next.js and MD/TS mapping (`seo-page-publisher` & `seo-article-generator` skills). Deployed a live SEO article for "loodgieters", automated `sitemap.xml` inclusion via `seoRoutes`, fixed a Next.js 15+ Async params crash on Vercel, and built an `Article_Inventory.md` tracking system. Finally, removed the generic test article and its homepage links.

## Files Changed
- `WebsiteMagisData/app/inzichten/page.tsx` (created)
- `WebsiteMagisData/app/inzichten/[slug]/page.tsx` (created)
- `WebsiteMagisData/content/articles.ts` (created/modified)
- `WebsiteMagisData/content/seo.ts` (modified)
- `WebsiteMagisData/components/homepage-sections.tsx` (modified)
- `WebsiteMagisData/app/page.tsx` (modified)
- `WebsiteMagisData/public/assets/agency_office_cover.jpg` (created)
- `WebsiteMagisData/public/assets/analytics_dashboard.jpg` (created)
- `Kennis/Article_Inventory.md` (created)
- `.agents/skills/seo-article-generator/SKILL.md` (created/modified)
- `.agents/skills/seo-page-publisher/SKILL.md` (created/modified)
- `Kennis/Competitor_Research/` files (created)

## Key Decisions & Assumptions
- Inzichten page will be accessible and part of the sitemap, but explicitly NOT added to the main header navigation menu.
- A central `Article_Inventory.md` acts as the source of truth for planning content gaps.
- Articles in `articles.ts` are automatically pushed to the Next.js sitemap via dynamic imports mapping.

## Next Steps
- Perform keyword research and fill new content gaps (e.g. kappers, aannemers, boekhouders).
- Execute the `seo-article-generator` and `seo-page-publisher` for the upcoming niches.

## Related Notes
- [[Article_Inventory]]
- [[Competitor_Analysis]]
