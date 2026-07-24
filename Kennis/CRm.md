# MagisData Sales OS

**Status:** Local frontend MVP implemented in `CRM/` and last repository-checked on 24 July 2026. It is not a deployed, persistent CRM.

The Sales OS is a lead command center with company/contact records, pipeline stages, notes, tags, lead source, demo status, and a mandatory next action. Its “Today Queue” sorts prospects by urgency. Scope deliberately excludes multi-tenant SaaS, mass email, AI scoring, billing, and generic dashboard filler.

### Definition of done

- CSV import validates required company/contact/next-action fields.
- Leads can be opened and their next action changed or completed during the current browser session.
- Pipeline filtering and urgency-based queueing work in the frontend.
- `npm run build` succeeds from `CRM/`.

### Design vibe

Fast, visual, opinionated. More command center than spreadsheet.

### Next module

Persist records and edits before adding Gmail drafts. Current data is seeded from `CRM/src/customerLeads.js` and imported/edited state is not backed by a server or database.
