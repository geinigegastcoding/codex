# SiteRoast Safe Report Deletion Implementation Plan

**Goal:** Prevent accidental report loss and make every deletion outcome visible.

**Architecture:** Add a small tested client request helper, improve the existing report browser state cycle, and harden the current authenticated DELETE route.

**Tech stack:** Next.js 16, React 19, TypeScript, Supabase Storage and Postgres, Node tests.

---

## Task 1: Specify the deletion request contract

**Files:**
- Modify: `tests/reports/report-actions.test.ts`
- Modify: `lib/data/dashboard.ts`

1. Add a failing test for DELETE method, encoded audit ID, and returned cleanup warnings.
2. Add a failing test for server-error propagation.
3. Run the focused tests and confirm only the missing helper fails.
4. Implement the smallest request helper and rerun to green.

## Task 2: Harden the deletion API

**Files:**
- Modify: `app/api/audits/[id]/route.ts`

1. Verify the owned audit exists and return 404 when it does not.
2. Read screenshot paths before database deletion.
3. Confirm the delete operation removed the expected row.
4. Remove stored screenshots through the existing service-role client.
5. Check activity-event insertion.
6. Return explicit warnings for post-delete cleanup failures and log their details.

## Task 3: Complete the client state cycle

**Files:**
- Modify: `components/app/reports-browser.tsx`

1. Add domain-specific confirmation.
2. Add active deletion, hidden-row, error, and warning state.
3. Disable and label the active button.
4. Keep rows on failure and remove them only after success.
5. Show contextual error or warning banners.

## Task 4: Verify

1. Run focused and full tests.
2. Run lint and production build.
3. Inspect the API diff for ownership and path scoping.
4. Run npm audit and diff checks.
5. Continue to the next improvement slice.
