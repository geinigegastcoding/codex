# SiteRoast Safe Report Deletion Design

## Goal

Make report deletion deliberate, observable, and complete enough that users do not lose data from a stray click or receive a false success state.

## Current risks

- The trash button deletes immediately without confirmation.
- The client ignores HTTP failures and refreshes as if deletion succeeded.
- There is no loading state, accessible label, or visible error.
- The API returns success when no owned audit matched.
- Database cascades remove report rows, but screenshot objects can remain orphaned in storage.
- Activity-log insert failures are silently ignored.

## Design

### Client

- Ask for native confirmation with the report domain and an irreversible-action warning.
- Allow one deletion at a time and disable only the active trash button.
- Give every trash button a domain-specific accessible label.
- Call a tested request helper that parses server errors and cleanup warnings.
- Remove the report from local display only after confirmed API success, then refresh server data.
- Show errors and nonfatal cleanup warnings above the report list.

### API

1. Authenticate the user.
2. Verify the owned audit exists.
3. Read its screenshot paths before deleting database rows.
4. Delete the owned audit and confirm a row was actually removed.
5. Use the existing server-side service client to remove only screenshot paths read from that user's pages.
6. Record the deletion usage event.
7. Return `ok: true` plus warnings for post-delete cleanup failures, and log internal details server-side.

The database deletion remains the source of truth. Screenshot and activity cleanup happen afterward because deleting assets first could leave a surviving report with broken screenshots if the database operation fails.

## Success criteria

- Cancelled confirmation sends no request.
- Failed requests leave the row visible and show the server message.
- Successful requests remove the row and refresh data.
- Missing or unowned audit IDs return 404.
- Post-delete cleanup failure is visible as a warning, not reported as total failure.
- Existing audit row cascades continue to handle pages, issues, raw data, and score breakdowns.
