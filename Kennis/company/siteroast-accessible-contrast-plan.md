# SiteRoast Accessible Contrast Implementation Plan

**Goal:** Bring primary controls and muted marketing copy to WCAG AA contrast without changing the brand palette.

**Architecture:** Update existing Tailwind utility tokens only. Add a small source-level contract test plus a contrast-ratio assertion for the shared button variant.

**Tech stack:** React, Tailwind CSS 4, Node tests, Lighthouse.

---

## Task 1: Specify the contrast contract

**Files:**
- Create: `tests/accessibility/marketing-contrast.test.ts`

1. Assert the shared default button uses near-black text on orange.
2. Calculate and require at least 4.5:1 contrast for the selected pair.
3. Assert marketing source does not contain solid-orange white text or low-opacity supporting text tokens.
4. Run the focused test and confirm it fails against the current classes.

## Task 2: Fix shared controls and marketing copy

**Files:**
- Modify: `components/ui/button.tsx`
- Modify: `components/marketing-home.tsx`
- Modify: `app/dashboard/settings/page.tsx`

1. Change shared orange controls to near-black text.
2. Change solid-orange badges and icons to near-black text.
3. Raise low-opacity supporting text to 60% white.
4. Keep layout, spacing, typography, and brand colors unchanged.

## Task 3: Verify accessibility

1. Run the focused and full test suites.
2. Run lint and production build.
3. Audit the production homepage with Lighthouse.
4. Inspect any remaining contrast nodes and iterate until the contrast audit passes.
5. Run npm audit and diff checks, then continue to the next improvement slice.
