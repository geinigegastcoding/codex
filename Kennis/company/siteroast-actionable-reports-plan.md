# SiteRoast Actionable Reports Implementation Plan

**Goal:** Make report re-runs and issue actions work through existing SiteRoast flows.

**Architecture:** Reuse the current audit creation page and issue PATCH endpoint. Add only a pure re-run link builder, form defaults, and a client-side status selector.

**Tech stack:** Next.js 16 App Router, React 19, TypeScript, Supabase, Node test runner.

---

## Task 1: Specify report action contracts

**Files:**
- Create: `tests/reports/report-actions.test.ts`
- Modify: `lib/data/dashboard.ts`
- Modify: `components/app/report-tabs.tsx`

1. Add failing tests for a re-run URL that preserves required and optional audit fields and omits null values.
2. Add failing tests for an issue status PATCH request, including method, JSON body, and server-error propagation.
3. Run the focused tests and confirm they fail for the missing behavior.
4. Implement the smallest helpers in existing modules.
5. Run the focused tests and confirm they pass.

## Task 2: Wire re-run defaults

**Files:**
- Modify: `app/dashboard/reports/[id]/page.tsx`
- Modify: `app/dashboard/new-audit/page.tsx`
- Modify: `components/app/new-audit-form.tsx`

1. Replace the inert Re-run button with a link built from the report audit.
2. Parse async Next.js search params on the new-audit page and allowlist audit type.
3. Pass defaults into the current form fields.
4. Update stale mock/report-shell copy.
5. Run focused tests and TypeScript through the production build.

## Task 3: Wire issue actions

**Files:**
- Modify: `components/app/report-tabs.tsx`
- Modify: `app/dashboard/page.tsx`

1. Add the Action Plan status selector with disabled saving state and visible error text.
2. Update local status only after the PATCH succeeds.
3. Replace dashboard Fix Issue buttons with report links.
4. Remove the unsupported Share button from report actions.

## Task 4: Verify the slice

1. Run `npm test`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Run `npm audit --audit-level=high`.
5. Run `git diff --check` and inspect the scoped diff.
6. Record what passed and continue to the next useful slice without committing.
