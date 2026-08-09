# SiteRoast Responsive Dashboard Design

## Goal

Make the dashboard fully navigable on mobile, correct its active navigation state, and replace misleading header affordances with real destinations.

## Success criteria

- Every dashboard route is reachable below the `lg` breakpoint.
- The current route is highlighted correctly for overview and nested sections.
- The mobile drawer opens from a labeled button, closes from the backdrop, close button, link selection, or Escape, and restores body scrolling.
- The drawer uses dialog semantics and does not add decorative motion.
- Header search, avatar, and Help affordances lead to working routes.
- The unsupported notification button is removed.
- Fonts are self-hosted through `next/font`, removing the lint warning and browser requests to Google.
- Desktop navigation and the established dark orange visual system stay intact.

## Design read

Existing dark B2B SaaS dashboard for site owners, in preserve mode. Keep Tailwind, current local components, Lucide (already the project's icon family), charcoal surfaces, burnt-orange accent, and soft 12-20px radii.

Dial settings: `DESIGN_VARIANCE: 3`, `MOTION_INTENSITY: 2`, `VISUAL_DENSITY: 7`.

## Architecture

Create one isolated client component for dashboard navigation. It owns the shared route list, `usePathname` active-state logic, and mobile drawer state. The existing server-rendered shell keeps user/profile data and passes its logo into the mobile drawer as rendered content.

Desktop and mobile both consume the same navigation component, preventing route drift. A pure path-matching helper lives in the existing utilities module and receives direct tests.

The mobile drawer is a fixed client leaf with:

- a backdrop
- a `role="dialog"` panel with `aria-modal="true"`
- Escape handling with cleanup
- temporary body scroll lock with cleanup
- a visible close button
- immediate close after navigation

## Working destinations

- The inert header search surface becomes a clear link to Reports.
- The header avatar links to Settings.
- The unsupported notification bell is removed.
- Add `/dashboard/help` with concise guidance for audits, worker processing, exports, and issue status.

## Typography

Replace runtime Google Fonts `<link>` elements with official `next/font/google` loaders and CSS variables for Inter and Playfair Display. This keeps the current typography while self-hosting font files, removing layout shift and the lint warning.

## Verification

- Test active-route matching first.
- Run full tests, lint, build, npm audit, and diff checks.
- Create a temporary public preview, exercise the drawer at mobile width with Playwright, verify Escape and link-close behavior, capture desktop/mobile screenshots, inspect them, then remove all preview artifacts.
