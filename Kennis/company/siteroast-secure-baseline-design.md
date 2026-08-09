# SiteRoast secure baseline design

Date: 2026-08-09
Project: `E:\MData\projecten\Siteroast`

## Goal

Make the existing audit-to-report flow safe to extend. Preserve current behavior while adding a small automated test gate, closing outbound scan gaps, fixing fresh-clone setup, and removing known dependency risk where a minimal compatible change exists.

## Why this comes first

Three approaches were considered:

1. Reliability-first (selected): secure scanner boundaries and add regression checks before visible features. Lowest regression risk and directly supports the product's completed audit-to-report metric.
2. Feature-first: add PDF/share/report comparison now. Faster visible progress, but expands an untested app with known scanner and dependency risks.
3. Architecture-first: migrate to the planned monorepo. Aligns with `report.md`, but creates a large unrelated diff and delays useful product work.

## Scope

### Test gate

Use Node's built-in test runner through the already installed `tsx`; add no test framework. Cover URL normalization, public/private address classification, redirect validation, and scanner entry validation. Keep the existing live `audit:test-url` command as a slower smoke check.

### Outbound scan boundary

- Validate targets inside the scan engine, not only in the API route.
- Normalize bracketed IPv6 literals correctly.
- Reject non-public IPv4 and IPv6 ranges, including IPv4-mapped IPv6 addresses.
- Guard browser requests before network access so redirects and subresources cannot reach local/private targets.
- Guard robots and sitemap fetches across redirects.
- Cache successful hostname checks within one browser page scan to avoid repeated DNS lookups.
- Keep a clear limitation: application checks reduce SSRF risk, but production still needs worker-level egress controls for full DNS-rebinding resistance.

### Fresh-clone and dependency health

- Fix the service-role variable typo in `.env.example`.
- Document the one-time Chromium install required by local scanning.
- Remove `image-size` if confirmed unused.
- Apply compatible security patches first. The registry check showed Next 15.5.23 still hard-pins three high-severity findings, while `report.md` already targets Next 16; use the coherent Next 16.3.0 + matching ESLint config upgrade and root `middleware.ts` to `proxy.ts` migration instead of unsupported dependency overrides. Do not migrate to a monorepo.
- Keep lockfile authoritative and re-run audit, lint, tests, build, and live URL smoke scan.

## Data flow

`POST /api/audits` validates a public target and queues it. Worker calls the same scan-engine validation again. Every Playwright network request and every robots/sitemap redirect passes through the public-target guard before connection. Unsafe requests fail loudly and the existing worker marks the audit failed with an actionable error.

## Error handling

- User-entered unsafe targets return a clear 400 response.
- Unsafe redirects or subresources are blocked before connection.
- Optional discovery failures remain non-fatal and are recorded as missing/error scan signals.
- Primary-page safety failure remains fatal; no partial success is reported.

## Verification

Success requires fresh evidence from:

- focused tests first observed failing, then passing;
- full `npm test`;
- `npm run lint` with no new warnings;
- `npm run build`;
- `npm audit` with direct fixable high-severity findings removed or explicitly documented;
- `npm run audit:test-url -- https://example.com` completing and saving output;
- clean Git diff limited to this slice.

## Deferred

PDF export, authenticated sharing, audit comparison, issue workflow controls, billing, monorepo migration, and AI enrichment remain separate iterations. Next recommended visible slice is working report actions and issue-status workflow.
