# SiteRoast Working Profile Settings Implementation Plan

**Goal:** Add a validated profile editor and remove misleading settings controls.

**Architecture:** Share a small profile validation contract between the API and tests, use a tested fetch helper in a client form, and keep the page server-rendered for plan and usage data.

**Tech stack:** Next.js 16, React 19, TypeScript, Zod, Supabase, Node tests.

---

## Task 1: Define profile behavior with tests

**Files:**
- Add: `tests/settings/profile-settings.test.ts`
- Add: `lib/settings/profile.ts`
- Add: `lib/data/settings.ts`

1. Add failing tests for trimmed name validation and the 80-character limit.
2. Add failing tests for the authenticated PATCH request contract and server-error propagation.
3. Implement only the shared schema and request helper needed to pass.

## Task 2: Add the authenticated update route

**Files:**
- Add: `app/api/profile/route.ts`

1. Authenticate the request.
2. safely parse JSON and validate the payload.
3. Update only `full_name` on the matching profile ID.
4. Return 404 for a missing profile and surface database errors.

## Task 3: Replace settings placeholders

**Files:**
- Add: `components/app/profile-settings-form.tsx`
- Modify: `app/dashboard/settings/page.tsx`
- Modify: `components/app/app-shell.tsx`
- Modify: `lib/utils.ts`

1. Add the profile form with initials, email, loading, success, and error states.
2. Share the existing initials derivation helper.
3. Replace the upgrade placeholder with a pricing link.
4. Replace fake danger actions with a working reports-management link.
5. Raise low-contrast text in the touched settings surfaces.

## Task 4: Verify

1. Run focused tests through red and green.
2. Run the full test, lint, production build, audit, and diff checks.
3. Confirm no placeholder controls remain on the settings page.
4. Continue to the next improvement slice.
