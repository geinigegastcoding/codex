# MagisData Website Architecture

**Verification status (8 August 2026):** The working website source is available at `E:\MData\Website` on branch `codex/website-complete-rehaul`. The AI-focused rehaul builds successfully as a static export; the homepage center-text hero is live.

**Framework:** Next.js App Router, React/TypeScript, Tailwind CSS
**Mode:** Static export to `out/`
**Canonical directory:** `E:\MData\Website`

## Routing (`app/`)
- **App Router:** Routes defined via folders containing `page.tsx`.
- **Static SEO:** `app/sitemap.ts` and `app/robots.ts` generate static files. (Single-language Dutch site; no `hreflang`/`alternates` needed).
- **Metadata:** Route metadata plus shared SEO/schema helpers in `content/seo.ts` and `schemas/seo.ts`.
- **AI discoverability:** `app/llms.txt/route.ts`, `app/sitemap.ts`, `app/robots.ts`, canonical URLs and JSON-LD are maintained in the website source.

## Core Directories
- `app/`: Next.js routes, layouts, and API/static handlers.
- `components/`: Reusable React UI and layout components.
- `content/`: Static data collections (`seo.ts`, `pages.ts`, `landing-pages.ts`).
- `public/`: Root-served assets, including the blue/white hero image and local AI platform logos.
- `lib/`, `schemas/`: Savings calculator logic, analytics consent and JSON-LD builders.
- `tests/`: Small executable checks for calculator behavior.
- `scripts/`, `Buildtools/`: Maintenance and source-reference utilities.

## Development Rules
- **Commands:** `npm run dev` (local), `npm run build` (static export).
- **Constraints:** Avoid SSR or dynamic API routes since the target is a static export.
- **Before any edit:** inspect `AGENTS.md`, manifest, `next.config`, route tree, exports, callers and shared content utilities.
- **Before publishing:** run the build and screenshot desktop/mobile pages; verify titles are at most 70 characters, descriptions/canonicals/Open Graph, robots/sitemap, relevant schema only, at least three valid internal links per page, no broken links (including `/cdn-cgi/l/email-protection`), and consent-first analytics.

## Current AI positioning

- Core offer: audit, build and enablement for AI systems that remove recurring work from an entrepreneur's workflow.
- Product direction: a Mainframe-style folder/directory and skill system for use with an AI agent, a course for using it, and AI audits for companies.
- Pricing: not established; do not add fixed prices or imply finalized packages until Daniel approves them.
- Homepage H1: **Haal terugkerend werk uit je bedrijf met AI.**
- Homepage hero: centered text over the supplied blue/white statue image; CTA, savings calculator path and local Anthropic/Claude, OpenAI, Gemini and Google Cloud logo chips.
- Supporting proof: workflow card, time-savings calculator, practical system examples, second-brain/skills section, FAQ and final CTA.
- Brand constraints: light blue/white palette, Inter, no dark/glow/neon AI styling, one H1 per page, subtle scroll reveals, AI crawlers allowed.
