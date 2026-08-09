# MagisData dashboard

Local-first business command center and CRM for MagisData. The UI lives in React/Vite; the local Node service keeps API credentials server-side, fetches normalized source data, and persists CRM records to `data/crm.json` after the first save.

## Run it

```powershell
npm install
Copy-Item .env.example .env
npm run dev:all
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

The dashboard is usable without credentials: it will show which sources are missing, which sources return no rows, and which sources return errors. It never inserts example metrics or sample leads.

## Connect real data

Add credentials to `.env` (never commit this file):

- `GA4_PROPERTY_ID` plus either `GA4_ACCESS_TOKEN` or `GOOGLE_APPLICATION_CREDENTIALS` for visitors, sessions, events, and conversions.
- `YOUTUBE_CHANNEL_ID` plus `YOUTUBE_API_KEY` for channel totals. Add `YOUTUBE_ACCESS_TOKEN` for date-range views and engagement.
- `STRIPE_SECRET_KEY` for succeeded payment-intent revenue in the selected range.
- `FORMSPREE_FORM_ID` and `FORMSPREE_API_TOKEN` for contact-form submissions.

The integrations screen explains the exact settings each source needs. The local API is available at `http://127.0.0.1:8787/api/health`.

## CRM

Create leads manually or import CSV. `company` and `email` are required; `name`, `stage`, `next_action`, `next_action_at`, `source`, `notes`, and `value` are optional. Records are stored locally in `data/crm.json`, which is ignored by git. Browser storage is used as an offline fallback when the API is unavailable.

## Verify

```powershell
npm run verify
```

This runs Oxlint, TypeScript, unit tests, the production build, and Playwright desktop/mobile checks. Presentation screenshots are generated under `screenshots/` by `tests/e2e/showcase.spec.ts`.
