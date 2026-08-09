# SiteRoast PDF Export Design

## Goal

Deliver the client-ready PDF report already promised by the product, while preserving the report's current private access model.

## Success criteria

- An authenticated report owner can download a valid PDF from the report page.
- Another user cannot fetch the audit through the export route.
- The PDF contains audit context, scores, severity mix, summary, prioritized fixes, and scanned-page context.
- Long content paginates without clipping or overlap.
- Unsupported website characters cannot crash generation.
- The final sample renders cleanly and its text can be extracted for structural checks.

## Options considered

1. **Pure Node PDF generation with `pdf-lib` - selected.** Small runtime surface, works in a Next.js route, and does not need Chromium or a separate service.
2. **Render HTML with Playwright.** Strong CSS fidelity, but adds a heavy browser dependency to a request path and conflicts with the worker-only deployment guidance.
3. **React PDF renderer.** Capable, but adds a second component/layout model and more abstraction than this report needs.

## Architecture

Add `lib/audit/export-pdf.ts` with a pure async builder that accepts the same audit data already loaded for Markdown export and returns PDF bytes. It uses A4 pages, standard embedded fonts, deterministic wrapping, page breaks, and page-number footers.

Add `GET /api/audits/:id/pdf`, mirroring the Markdown route's Supabase authentication and owner-scoped query. The PDF is generated on demand and returned as an attachment; no public token or storage bucket is added.

The report page gains a `PDF` download action beside `audit.md`.

## Report structure

1. Branded title and audit metadata
2. Score overview and issue severity mix
3. Executive summary and suggested next actions when present
4. Prioritized issue sections with evidence, fix, impact, effort, and status
5. Scanned-page summary

Issue and page sections have explicit upper bounds with a visible truncation note, preventing unbounded response size while failing visibly rather than silently omitting records.

## Text and layout safety

- Normalize common smart punctuation and unsupported characters to PDF-safe text.
- Wrap every variable-length value by measured font width.
- Check remaining page height before drawing each block.
- Truncate individual evidence fields to practical limits.
- Add a footer after generation so every page shows `Page x of y`.

## Verification

- Test PDF signature, metadata, pagination, page dimensions, and Unicode-heavy input.
- Test the download filename helper.
- Run the full application test, lint, build, npm audit, and diff checks.
- Generate a representative sample under `tmp/pdfs`, inspect it with `pypdf`, render every page with Poppler, and visually inspect the PNGs.
