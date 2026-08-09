# SiteRoast Responsive Dashboard Implementation Plan

**Goal:** Restore complete mobile navigation and remove inert dashboard header controls.

**Architecture:** Keep the dashboard shell server-rendered. Add one client navigation leaf shared by desktop and mobile, plus a tested route-matching utility.

**Tech stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide, Playwright.

---

## Task 1: Specify active navigation behavior

**Files:**
- Create: `tests/navigation/dashboard-navigation.test.ts`
- Modify: `lib/utils.ts`

1. Add failing tests for exact overview matching, nested section matching, and false prefix matches.
2. Run the focused test and confirm the helper is missing.
3. Implement the minimal route matcher.
4. Run the focused test until green.

## Task 2: Add shared responsive navigation

**Files:**
- Create: `components/app/dashboard-navigation.tsx`
- Modify: `components/app/app-shell.tsx`

1. Move the dashboard route list into the client navigation leaf.
2. Render shared links in the desktop sidebar with accurate active state.
3. Add a mobile menu button, backdrop, dialog drawer, close control, and navigation-close behavior.
4. Add Escape and body-scroll cleanup.
5. Remove the inert notification bell.
6. Link the header search surface to Reports and the avatar to Settings.

## Task 3: Complete destinations and fonts

**Files:**
- Create: `app/dashboard/help/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

1. Add a concise Help page using existing shell components and valid internal/external links.
2. Replace external font links with `next/font/google` variables.
3. Preserve the current Inter and Playfair Display typography.

## Task 4: Verify responsive behavior

1. Run full tests, lint, and production build.
2. Add a temporary unauthenticated shell preview.
3. Use Playwright at mobile width to open the menu, verify dialog state, Escape close, reopen, navigate, and confirm close.
4. Capture and inspect mobile open/closed and desktop screenshots.
5. Remove preview route and images.
6. Rerun full tests, lint, build, npm audit, and diff checks.
