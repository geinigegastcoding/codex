# MagisData Website Architecture

**Framework:** Next.js 16 (App Router), React 19, Tailwind CSS
**Mode:** Static Export (`output: "export"` in `next.config.mjs`) -> builds to `out/`
**Primary Directory:** `WebsiteMagisData/`

## Routing (`app/`)
- **App Router:** Routes defined via folders containing `page.tsx`.
- **Static SEO:** `app/sitemap.ts` and `app/robots.ts` generate static files. (Single-language Dutch site; no `hreflang`/`alternates` needed).
- **Metadata:** Centrally generated via `metadataForPath()` defined in `content/seo.ts`.

## Core Directories
- `app/`: Next.js routes, layouts, and API/static handlers.
- `components/`: Reusable React UI and layout components.
- `content/`: Static data collections (`seo.ts`, `pages.ts`, `landing-pages.ts`).
- `public/`: Served at root. Contains `assets/`, plus Cloudflare config (`_headers`, `_redirects`).
- `lib/`, `hooks/`, `schemas/`: Utilities, React hooks, and validation (Zod).
- `Keywoard-pages/`: Dedicated routing and data for local/keyword SEO pages.
- `scripts/`, `Buildtools/`: Maintenance utilities. (Skip checking these for standard web dev).

## Development Rules
- **Commands:** `npm run dev` (local), `npm run build` (static export).
- **Constraints:** Avoid SSR or dynamic API routes since the target is a static export.
