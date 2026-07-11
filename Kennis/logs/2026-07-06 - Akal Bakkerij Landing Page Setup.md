# 2026-07-06 - Akal Bakkerij Landing Page Setup

- **Session ID**: 07135d9d-ebfe-4c95-9702-d68cf69a10b5

## Summary
Created a brand-new Next.js landing page application for customer Akal Bakkerij based on the restaurant landing page design template. Used Playwright with Shadow DOM traversal to scrape and download the business's actual Google Business Profile photos, and compiled the application successfully.

## Files Changed
- `E:\MData\customers\Akal Bakkerij\app\globals.css` (created)
- `E:\MData\customers\Akal Bakkerij\app\layout.tsx` (created)
- `E:\MData\customers\Akal Bakkerij\app\page.tsx` (created)
- `E:\MData\customers\Akal Bakkerij\package.json` (created)
- `E:\MData\customers\Akal Bakkerij\tsconfig.json` (created)
- `E:\MData\customers\Akal Bakkerij\postcss.config.mjs` (created)
- `E:\MData\customers\Akal Bakkerij\next.config.ts` (created)
- `E:\MData\customers\Akal Bakkerij\wrangler.jsonc` (created)
- `E:\MData\customers\Akal Bakkerij\.gitignore` (created)
- `E:\MData\customers\Akal Bakkerij\open-next.config.ts` (created)
- `E:\MData\customers\Akal Bakkerij\public\images\hero.jpg` (created)
- `E:\MData\customers\Akal Bakkerij\public\images\turkse_pizza.jpg` (created)
- `E:\MData\customers\Akal Bakkerij\public\images\kapsalon.jpg` (created)
- `E:\MData\customers\Akal Bakkerij\public\images\turkish_bread.jpg` (created)
- `E:\MData\customers\Akal Bakkerij\public\images\baklava.jpg` (created)
- `E:\MData\customers\Akal Bakkerij\public\images\durum.jpg` (created)

## Key Decisions & Assumptions
- Reused layout and configuration boilerplate from `WebsitePapa2` for compatibility with the customer sites and Cloudflare Wrangler/OpenNext environment.
- Implemented a custom shadow-DOM-aware Playwright script to fetch actual Google Maps CDN photos, rather than relying on placeholder images.
- Ensured single H1 semantic tags targeting primary keywords ("Akal Bakkerij", "Leiden", "Turkse Pizza", "döner", "steenovenbrood") and optimized titles under 70 characters.
- Used standard `<img>` tags over Next.js image component to avoid deployment/runtime configuration errors in the Cloudflare OpenNext/Wrangler workers environment.

## Next Steps
- Push/Deploy the new Akal Bakkerij Cloudflare Pages worker.

## Related Notes
- [[website]]
