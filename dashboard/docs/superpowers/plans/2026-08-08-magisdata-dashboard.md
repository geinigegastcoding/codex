# MagisData Business Dashboard and CRM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, local-first MagisData command center in `dashboard/` with real-data connector paths, an operational CRM, and no fabricated metrics.

**Architecture:** A Vite + React + TypeScript SPA renders the dashboard and CRM. A small Node HTTP service in `server/` owns secrets, external API calls, and JSON persistence for CRM records. The browser receives normalized source data with provenance and renders empty/error states when a connector is not configured or returns no records.

**Tech Stack:** React 19, TypeScript, Vite, React Router, Recharts, Lucide React, Node built-ins, Playwright, Node test runner.

---

### Task 1: Establish testable business-domain primitives

**Files:**
- Create: `dashboard/tests/unit/domain.test.mjs`
- Create: `dashboard/server/domain.mjs`

- [ ] **Step 1: Write the failing tests**

Cover the real-data invariants before implementation:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCsv, normalizeLead, summarizeSources } from '../../server/domain.mjs'

test('parseCsv handles quoted commas and preserves empty optional fields', () => {
  assert.deepEqual(parseCsv('company,email,note\n"Studio, West",a@example.com,"Needs follow-up"'), [
    { company: 'Studio, West', email: 'a@example.com', note: 'Needs follow-up' },
  ])
})

test('normalizeLead rejects records without the minimum CRM identity', () => {
  assert.throws(() => normalizeLead({ company: '', email: 'a@example.com' }), /company/i)
  assert.throws(() => normalizeLead({ company: 'Studio West', email: '' }), /email/i)
})

test('summarizeSources never turns missing data into a metric', () => {
  assert.deepEqual(summarizeSources({ ga4: { status: 'not-connected' }, youtube: { status: 'connected', views: 42 } }), {
    ga4: { status: 'not-connected' },
    youtube: { status: 'connected', views: 42 },
  })
})
```

- [ ] **Step 2: Run the focused test and verify the expected missing-module failure**

Run from `E:\MData\dashboard`:

```powershell
node --test tests/unit/domain.test.mjs
```

Expected: FAIL because `server/domain.mjs` does not exist yet.

- [ ] **Step 3: Implement the smallest domain module**

Implement CSV tokenization with quote escaping, strict company/email validation, and a shallow source summary that preserves connector status without synthesizing values. Export exactly `parseCsv`, `normalizeLead`, and `summarizeSources`.

- [ ] **Step 4: Run the focused test and verify it passes**

```powershell
node --test tests/unit/domain.test.mjs
```

Expected: 3 passing tests and no warnings.

### Task 2: Create the Vite application foundation

**Files:**
- Create: `dashboard/package.json`
- Create: `dashboard/package-lock.json` via `npm install`
- Create: `dashboard/index.html`
- Create: `dashboard/tsconfig.json`
- Create: `dashboard/tsconfig.app.json`
- Create: `dashboard/tsconfig.node.json`
- Create: `dashboard/vite.config.ts`
- Create: `dashboard/src/main.tsx`
- Create: `dashboard/src/app/types.ts`
- Create: `dashboard/src/app/api.ts`
- Create: `dashboard/.env.example`
- Create: `dashboard/.gitignore`

- [ ] **Step 1: Add the minimal project configuration**

Use the existing repository dependency choices: React, React Router, Recharts, Lucide React, Vite, TypeScript, Playwright, and Oxlint. Add scripts for `dev`, `api`, `dev:all`, `build`, `typecheck`, `lint`, `test`, `test:e2e`, and `verify`. Do not add a dependency for CSV parsing or server routing.

- [ ] **Step 2: Add typed normalized data contracts**

Define `ConnectorStatus`, `MetricValue`, `TrendPoint`, `DashboardSnapshot`, `Lead`, `LeadStage`, `CrmSnapshot`, and `IntegrationConfig`. Every metric must allow `value: null` and carry `source`, `status`, and optional `detail`.

- [ ] **Step 3: Add the fetch boundary**

`src/app/api.ts` must expose `getSnapshot(range)`, `getCrm()`, `saveCrm(snapshot)`, and `syncConnectors()`. It must parse non-2xx responses into readable errors and never catch an error by returning fake data.

- [ ] **Step 4: Run typecheck before UI work**

```powershell
npm install
npm run typecheck
```

Expected: exit code 0.

### Task 3: Add real connector and local persistence service

**Files:**
- Create: `dashboard/server/env.mjs`
- Create: `dashboard/server/connectors.mjs`
- Create: `dashboard/server/store.mjs`
- Create: `dashboard/server/index.mjs`
- Create: `dashboard/server/dev.mjs`
- Create: `dashboard/tests/unit/connectors.test.mjs`
- Create: `dashboard/data/.gitkeep`

- [ ] **Step 1: Write failing connector normalization tests**

Test YouTube channel statistics normalization, GA4 row normalization, Stripe amount conversion from cents to euros, and empty connector behavior. Tests may pass fixture-shaped API responses directly to pure normalizers; no live credentials or network calls belong in tests.

- [ ] **Step 2: Run connector tests and verify they fail for missing exports**

```powershell
node --test tests/unit/connectors.test.mjs
```

Expected: FAIL because `server/connectors.mjs` is not implemented.

- [ ] **Step 3: Implement server-side connectors**

Support these optional environment variables without exposing them to the browser:

```env
GA4_PROPERTY_ID=
GA4_ACCESS_TOKEN=
GOOGLE_APPLICATION_CREDENTIALS=
YOUTUBE_CHANNEL_ID=
YOUTUBE_API_KEY=
YOUTUBE_ACCESS_TOKEN=
STRIPE_SECRET_KEY=
FORMSPREE_FORM_ID=
FORMSPREE_API_TOKEN=
```

Implement:

- YouTube Data API channel totals with API key, plus YouTube Analytics daily reports when an OAuth access token is present.
- GA4 `runReport` for daily users, sessions, event count, and `generate_lead`; support a direct access token and service-account JWT exchange when credentials are present.
- Stripe balance and recent payment-intent totals using the secret key server-side.
- Formspree submission count/list when both form ID and API token are present.
- Explicit `not-connected`, `connected`, and `error` results with a human-readable detail string.

Implement `store.mjs` with `node:fs/promises` and `dashboard/data/crm.json`; create the file only when the first lead is saved. Do not seed the file.

- [ ] **Step 4: Implement the local HTTP API**

Expose:

```text
GET  /api/health
GET  /api/snapshot?range=7d|30d|90d
POST /api/sync
GET  /api/crm
PUT  /api/crm
```

Return JSON only, set CORS for local development, reject malformed CRM payloads with `400`, and return `500` with a source-specific error rather than silently skipping connector failures.

- [ ] **Step 5: Run the connector and domain tests**

```powershell
node --test tests/unit/*.test.mjs
```

Expected: all tests pass with no live API calls.

### Task 4: Build the branded dashboard shell and overview

**Files:**
- Create: `dashboard/src/App.tsx`
- Create: `dashboard/src/styles.css`
- Create: `dashboard/src/app/components.tsx`

- [ ] **Step 1: Add the route shell**

Use `HashRouter` with routes `/overview`, `/analytics`, `/crm`, `/tasks`, and `/integrations`. The sidebar must include the MagisData mark, route descriptions, current source readiness, and a compact profile block. On mobile, collapse the sidebar into a horizontal top bar with an accessible menu.

- [ ] **Step 2: Add the overview data states**

Render four KPI cards for website visitors, leads/signups, YouTube views, and revenue. Each card must show source, sync time, and one of: a real formatted value, “Not connected”, “No data in range”, or “Sync error”. Never render hardcoded metric values.

- [ ] **Step 3: Add real-data charts and operational panels**

Use Recharts for a multi-series acquisition trend and a revenue/lead comparison chart. When a series is empty, keep the chart frame and show the source-specific empty state. Add an “Attention today” panel driven only by actual CRM leads/tasks and integration errors.

- [ ] **Step 4: Style against the main website system**

Use the website tokens: `#FBFCFF`, `#171C2B`, `#4F58FF`, `#E9EDFF`, `#DFE4F0`, `#5F6880`, `#2B8A78`. Use Inter with tight display headings, thin borders, rectangular blue CTAs, subtle grid texture, and restrained motion. Provide focus states, reduced-motion handling, and responsive layouts for 1440px, 768px, and 390px widths.

### Task 5: Build analytics, CRM, task, and integrations views

**Files:**
- Modify: `dashboard/src/App.tsx`
- Modify: `dashboard/src/app/components.tsx`
- Modify: `dashboard/src/app/api.ts`
- Modify: `dashboard/src/styles.css`

- [ ] **Step 1: Add analytics view**

Provide source tabs for Website, YouTube, Revenue, and Leads. Each view contains a chart, source label, date range control, accessible data table, and a concise explanation of what is being measured. Top videos/pages use actual connector rows only.

- [ ] **Step 2: Add CRM view**

Support search, stage filter, urgency filter, list/board toggle, add lead form, edit stage, next action, notes, mark-complete, CSV import, and delete with confirmation. Show an empty CRM state when no records exist. Required import columns are `company` and `email`; optional columns are `name`, `stage`, `next_action`, `next_action_at`, `source`, `notes`, and `value`.

- [ ] **Step 3: Add tasks view**

Derive tasks from CRM next actions only. Sort overdue first, then today, then upcoming. Provide completion and navigation back to the lead without inventing tasks.

- [ ] **Step 4: Add integrations view**

Show connector cards with connection status, the exact missing setting, last sync, and a link to `.env.example`. Add a sync button with loading/error feedback and a collapsible “data contract” panel explaining each metric source.

- [ ] **Step 5: Run typecheck and unit tests**

```powershell
npm run typecheck
node --test tests/unit/*.test.mjs
```

Expected: exit code 0 for both commands.

### Task 6: Verify the working product visually and functionally

**Files:**
- Create: `dashboard/playwright.config.ts`
- Create: `dashboard/tests/e2e/dashboard.spec.ts`
- Create: `dashboard/README.md`

- [ ] **Step 1: Add browser tests**

Verify overview renders without demo values, routes navigate, connector empty states are explicit, CRM can add/edit/delete a lead, CSV import rejects missing required columns, and the app has no horizontal overflow at 390px and 1440px.

- [ ] **Step 2: Run the full verification command**

```powershell
npm run verify
```

Expected: lint, typecheck, build, unit tests, and Playwright tests all exit 0.

- [ ] **Step 3: Run the API and capture screenshots**

```powershell
npm run dev:all
```

Use Playwright at desktop and mobile sizes to capture `dashboard/screenshots/overview-desktop.png`, `dashboard/screenshots/overview-mobile.png`, `dashboard/screenshots/crm-desktop.png`, and `dashboard/screenshots/integrations-desktop.png`. Inspect them for clipped text, empty-state hierarchy, chart readability, and mobile navigation overlap.

- [ ] **Step 4: Update README with real setup instructions**

Document the local run commands, connector credential setup, supported metrics, CRM persistence location, and the fact that no demo records are seeded. Do not include real secrets.

## Plan self-review

- Website design-system alignment is covered by the token and responsive styling task.
- YouTube views, website signups/leads, revenue, and CRM are represented by real connector/data paths.
- No fabricated metric or lead values are introduced; empty, not-connected, and error states are explicitly required.
- The user’s “dashboard folder only” constraint is honored by every path above.
- The only deliberate ceiling is local single-user JSON persistence; a hosted database/auth layer can be added later if multi-user deployment becomes a requirement.
