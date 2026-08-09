# SiteRoast Actionable Reports Design

## Goal

Turn the report's dead controls into a small, reliable workflow without adding new schema or pretending private reports are publicly shareable.

## Success criteria

- Re-run opens the existing audit form with the report inputs prefilled.
- The user still confirms submission, so quota use is visible and intentional.
- Action-plan issue status can be changed through the existing authenticated PATCH route.
- A failed status update is shown and the previous status remains selected.
- Dashboard issue actions navigate to the owning report.
- No inert Share or Fix Issue buttons remain in this workflow.
- Existing tests, lint, build, security audit, and scanner behavior stay green.

## Design

### Re-run

Add a deterministic URL builder to the existing dashboard data module. It carries the audit URL, type, keyword, business type, and competitor URL as query parameters. The report action becomes a Next.js link to `/dashboard/new-audit`.

The new-audit page reads and sanitizes those query parameters, then passes them as defaults to the existing form. Audit type is allowlisted; unknown values fall back to `quick_homepage`.

This preserves the normal creation endpoint, project association, validation, quota checks, and worker queue.

### Issue status

Add a small status selector inside the existing Action Plan rows. It calls the existing `/api/issues/:id` PATCH route and only changes local state after success. While saving, the selector is disabled. API failures are surfaced beside the selector.

No database or API contract change is needed.

### Dead actions and copy

- Replace dashboard `Fix Issue` buttons with links to their report.
- Remove the report Share button. Public report links need a deliberate token/access design and are not part of this slice.
- Update new-audit copy that still calls scan data a mock or report shell.

## Trade-offs

- Re-run requires one confirmation click, but avoids accidental quota consumption.
- Status updates are local until the next server render; this is sufficient because the API persists the state and no cross-row cache exists.
- Public sharing remains deferred because implementing it safely would require authorization and revocation decisions.

## Verification

Use Node tests for query construction and the status-update request contract, then run the full test suite, lint, production build, `npm audit`, and `git diff --check`.
