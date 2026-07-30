# MagisData Website Architecture

**Verification status (24 July 2026):** `Website` and `WebsiteMagisData` are both tracked as gitlinks, but neither contains a working tree or `.gitmodules` mapping in this checkout. The architecture below is the last known setup from project logs and must be confirmed after restoring the canonical repository.

**Last known framework:** Next.js App Router, React, Tailwind CSS
**Last known mode:** Static export to `out/`
**Canonical directory:** Unresolved (`Website` vs. `WebsiteMagisData`)

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
- `Keywoard-pages/`: Last-known (misspelled) directory for local/keyword SEO routing/data; verify whether it still exists.
- `scripts/`, `Buildtools/`: Maintenance utilities. (Skip checking these for standard web dev).

## Development Rules
- **Commands:** `npm run dev` (local), `npm run build` (static export).
- **Constraints:** Avoid SSR or dynamic API routes since the target is a static export.
- **Before any edit:** initialize/restore the intended gitlink, inspect its `AGENTS.md`, manifest, `next.config`, route tree, exports, callers and shared content utilities.
- **Before publishing:** run the build and screenshot desktop/mobile pages; verify titles are at most 70 characters, descriptions/canonicals/Open Graph, robots/sitemap, relevant schema only, at least three valid internal links per page, no broken links (including `/cdn-cgi/l/email-protection`), and consent-first analytics.
