# SiteRoast Accessible Contrast Design

## Goal

Remove the Lighthouse contrast failure while preserving SiteRoast's orange and charcoal brand system.

## Evidence

Production Lighthouse scored Performance 95, Accessibility 95, Best Practices 96, and SEO 100. The only weighted accessibility failure was color contrast. It identified:

- white text on solid `#ff6b2c` controls at roughly 2.8:1
- supporting copy using white opacity between 34% and 48% on near-black panels at roughly 3.2:1 to 3.9:1

## Options considered

1. **Near-black text on solid orange - selected.** Contrast is comfortably above WCAG AA, the orange remains unchanged, and the treatment feels intentional.
2. **Darken the orange and keep white text.** Meets contrast only with a substantial brand-color shift.
3. **Increase font size or weight.** Does not solve small labels and creates inconsistent hierarchy.

## Design

- Change the default orange button variant to `#101010` text.
- Apply the same treatment to solid-orange badges and compact labels.
- Raise supporting marketing text below 52% white opacity to 60%.
- Preserve higher-opacity body copy, orange accents, borders, surfaces, and layout.
- Update the settings placeholder control for the same solid-orange contrast rule.

## Success criteria

- Default button text and solid-orange badges no longer use white.
- Marketing copy contains no white opacity tokens below 52%, except non-text decoration.
- Button foreground/background contrast is at least 4.5:1 in a deterministic test.
- Lighthouse reports no color-contrast failure on the production homepage.
- Existing tests, lint, build, scanner, and dependency audit remain green.
