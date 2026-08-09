# SiteRoast Working Profile Settings Design

## Goal

Replace visible settings placeholders with a small set of honest, working controls.

## Current problems

- The profile card is read-only even though the existing profile schema and RLS policy support updates.
- The avatar row literally says `Placeholder initials avatar` while the dashboard already derives initials.
- The upgrade button has no supported billing action.
- The danger-zone buttons look destructive but do nothing.

## Design

### Editable profile

- Add a client-side form for the full name, with a derived initials preview and read-only account email.
- Validate and trim the name on the server; allow 1–80 characters.
- Send updates through an authenticated `PATCH /api/profile` route.
- Update only the authenticated user's `full_name` column and confirm a row was returned.
- Surface request errors and success feedback in the form, then refresh server-rendered dashboard data.

### Honest plan and data controls

- Keep the real plan and quota readout.
- Link the upgrade call to the existing public pricing section instead of implying billing exists.
- Remove nonfunctional account-deletion controls.
- Link data management to the report browser, where safe per-report deletion now works.

## Success criteria

- Empty or overlong names are rejected by the shared validation contract.
- A successful save updates the visible name and initials after refresh.
- Failed requests retain the typed value and show the server message.
- Only the authenticated profile row can be updated.
- Settings contains no visible `placeholder` actions.
- Existing plan, quota, usage, and navigation behavior still works.
