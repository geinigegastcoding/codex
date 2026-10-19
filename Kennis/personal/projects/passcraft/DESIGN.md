---
name: Passcraft
description: Personal artwork in a simple native Android pass library.
colors:
  cobalt: "#3154CA"
  white: "#FFFFFF"
  light-primary-container: "#E5EAFF"
  light-on-primary-container: "#17295D"
  light-secondary-container: "#E8EDFA"
  light-on-secondary-container: "#1B315C"
  cool-paper: "#F7F8FC"
  light-surface-high: "#EDF0F7"
  ink-navy: "#1C2440"
  light-secondary-ink: "#515A70"
  light-outline: "#747C91"
  night-primary: "#B8C4FF"
  night-on-primary: "#14296C"
  night-primary-container: "#253D8A"
  night-on-primary-container: "#DDE3FF"
  night-secondary-container: "#28334E"
  night-on-secondary-container: "#DEE5FA"
  night-background: "#11141E"
  night-surface: "#1C2130"
  night-surface-high: "#262D3F"
  night-ink: "#E7EBF7"
  night-secondary-ink: "#BFC6DB"
  night-outline: "#909AB3"
typography:
  headline-large:
    fontFamily: "sans-serif"
    fontWeight: 600
  headline-medium:
    fontFamily: "sans-serif"
    fontWeight: 600
  headline-small:
    fontFamily: "sans-serif"
    fontWeight: 600
  title-large:
    fontFamily: "sans-serif"
  title-medium:
    fontFamily: "sans-serif"
  title-small:
    fontFamily: "sans-serif"
  body-large:
    fontFamily: "sans-serif"
  body-medium:
    fontFamily: "sans-serif"
  body-small:
    fontFamily: "sans-serif"
  label-large:
    fontFamily: "sans-serif"
rounded:
  pass-card: "20dp"
spacing:
  inline: "8dp"
  controls: "12dp"
  form: "16dp"
  sections: "20dp"
  pass-inset: "22dp"
  page-inset: "24dp"
components:
  button-primary-light:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    typography: "{typography.label-large}"
  button-primary-dark:
    backgroundColor: "{colors.night-primary}"
    textColor: "{colors.night-on-primary}"
    typography: "{typography.label-large}"
  button-outlined-light:
    textColor: "{colors.cobalt}"
    typography: "{typography.label-large}"
  button-outlined-dark:
    textColor: "{colors.night-primary}"
    typography: "{typography.label-large}"
  pass-card-default:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    rounded: "{rounded.pass-card}"
---

# Design System: Passcraft

## Overview

**Creative North Star: "Camera contact sheet"**

The user's picture is the expressive material. Cool surfaces, dark ink, cobalt actions, and a compact native control vocabulary frame that material without competing with it. The built app uses a centered, single-column composition with generous page margins and clear saved-state text.

This is a native Kotlin and Jetpack Compose system. Material 3 supplies typography, control shapes, state layers, dialogs, and navigation. System typography is an intentional Android platform choice. The build is the authority for the values below.

**Key Characteristics:**

- Personal artwork provides the visual variety.
- Paired light and dark schemes follow the device setting.
- Native controls retain familiar touch, focus, and disabled behavior.
- Flat pass cards sit within a quiet, spacious single column.
- Labels distinguish local saving from a handoff to Google Wallet.

Recorded from `PasscraftApp.kt`, `MainActivity.kt`, `PassExport.kt`, the Android theme, and native phone captures. Source locations and capture coverage are in `.impeccable/design.json`. Values use Android dp and sp conventions; they are not web pixel specifications.

## Colors

Cobalt and cool neutrals form the application palette; artwork and the chosen pass color remain independent of the surrounding theme.

### Primary

- **Cobalt** is the light-theme primary action color and the default pass background. **White** is its action and pass text color.
- **Night Primary** and **Night On Primary** are the dark-theme action pair.
- The **Light Primary Container** and **Night Primary Container** pairs support native tonal actions such as the create-pass floating action button.

### Secondary

- The **Light Secondary Container** and **Night Secondary Container** pairs provide selection emphasis in native navigation and filter chips. The light secondary container also forms the empty-library image-import surface.
- These are quiet tonal surfaces, not an additional decorative accent.

### Neutral

- **Cool Paper** is the light background and surface; **White** is the light surface container. **Light Surface High** supports elevated native containers.
- **Ink Navy**, **Light Secondary Ink**, and **Light Outline** are the explicit light on-surface, secondary-text, and outline roles.
- **Night Background**, **Night Surface**, and **Night Surface High** form the dark surface hierarchy. **Night Ink**, **Night Secondary Ink**, and **Night Outline** are their explicit foreground roles.
- Unspecified Material roles, including `onBackground`, error colors, dividers, and inverse snackbar colors, retain the pinned Material 3 defaults. Plain screen text can therefore inherit `onBackground`; do not force every text element to the explicit on-surface color.

The editor offers Cobalt, Charcoal, Forest, Copper, Slate, and Violet as pass-content choices. Their source values live in the editor, not the application theme. Pass text is chosen from white or dark ink by background luminance. Black and white QR output remains independent of either application theme.

**The Artwork Owns Color Rule.** Keep application chrome on its semantic theme roles; preserve the selected pass color and full-color artwork in light and dark mode.

## Typography

**Display and Body Font:** Android system sans-serif, inherited through Material 3. No font asset or separate display face is installed.

**Character:** Familiar Android type establishes hierarchy through Material roles and selective semibold weight. It remains responsive to the user's font scale.

### Hierarchy

- **Headline Large:** `MaterialTheme.typography.headlineLarge`, semibold (600); main screen headings.
- **Headline Medium:** `headlineMedium`, semibold (600); the settings heading.
- **Headline Small:** `headlineSmall`, semibold (600); pass titles and the empty-library heading.
- **Title Large:** `titleLarge`; native app-bar titles and the Wallet section heading use semibold (600).
- **Title Medium:** `titleMedium`; section labels use semibold (600), while scan instructions inherit the role weight.
- **Title Small:** `titleSmall`; saved-state and hardware-state text.
- **Body Large / Medium / Small:** the corresponding Material roles; explanation, ordinary content, and secondary help respectively. Unstyled screen copy inherits the native local text style.
- **Label Large:** `labelLarge`; pass identification and native button labels. Native navigation and chips retain their own Material role mapping.

Sizes, line heights, and tracking are inherited from Material 3 (resolved dependency 1.3.2), rather than independently redefined. The frontmatter records the explicit weight choices; the native role mapping in the sidecar is authoritative for inherited metrics.

**The Native Type Rule.** Reuse Material typography roles and allow Android font scaling; do not replace them with fixed bitmap or web typography in the app.

## Layout

All principal screens use a centered content column with a maximum width (680dp). Phone layouts fill the available width. Repeated page gutters (24dp), form gaps (16dp), and section gaps (20dp) give the app its open rhythm. Smaller inline gaps and NFC control-row gaps use the frontmatter spacing scale.

The library is a `LazyColumn`; editor, detail, settings, and NFC pages are vertically scrollable. Content is aligned at the top. There is no breakpoint-specific multi-column layout in the build.

The `Scaffold` owns the native app bar, bottom navigation, snackbar host, and create-pass floating action button. Its content consumes scaffold insets and respects the keyboard. Root destinations show bottom navigation; editor and detail use back navigation. The editor's persistent save action sits in the bottom bar with navigation-bar and keyboard padding. Its minimum button height (52dp) can grow with content. Recurring secondary actions use a minimum height (48dp).

The library reserves bottom scroll space for the floating action and navigation. The editor starts with the live pass preview, then uses the same field and section rhythm throughout. Large text stays within the scrollable content and retains the visible top heading.

**The Top and Scroll Rule.** Preserve top-aligned, inset-aware scrolling when adding content or supporting larger font scales.

## Elevation & Depth

Pass cards are flat colored surfaces with no explicit shadow. Tonal surfaces, outlines, dividers, and whitespace carry most hierarchy. The extended floating action button, dialogs, snackbars, and other native components retain Material elevation and state treatment. The editor save-bar surface has an explicit shadow elevation (2dp). Do not translate native elevation into an invented CSS shadow recipe.

## Shapes

The recurring pass silhouette uses the frontmatter pass-card radius. The header has the pass-inset padding; artwork can reach the card edges below it. The whole card is clipped to its rounded outline.

Native filled and outlined buttons use Material's pill silhouette. Fields, chips, floating actions, dialogs, and navigation indicators retain their Material shapes. Color choices are circular. The empty-library import surface is more broadly rounded than the pass card; that screen-specific shape is not a universal container token.

## Components

### Buttons

Familiar native actions with explicit, sentence-case labels.

- **Primary:** Material `Button`, primary/on-primary theme roles, generally full width with the recurring primary minimum height.
- **Secondary:** Material `OutlinedButton`, primary text and native outline/state treatment, generally full width with the secondary minimum height.
- **Text:** Material `TextButton` for supporting links and dialog actions.
- **States:** Material touch feedback, focus indication, and disabled colors remain intact. Busy image import replaces the icon with a progress indicator and updates the label. Export progress replaces export actions while work is running.

### Chips

Compact native selection controls.

- Material `FilterChip` expresses NFC read/write mode and URL/plain-text choice.
- Selected and unselected states use native container and outline treatment. Type selection and input are disabled during an active scan.

### Cards / Containers

The pass is the signature component shared by library, editor, and detail.

- Its header contains a Material vector icon, Passcraft label, pass name, and optional subtitle.
- The background is the user's pass color; the header foreground is selected by luminance.
- Artwork uses `ContentScale.Fit` and preserves aspect ratio. Compact views cap artwork height (210dp); detail caps it (360dp).
- Compact previews omit the QR block. Detail shows the generated QR centered on its own white bitmap field.
- The pass image is runtime user content, not a shipped brand illustration.

### Inputs / Fields

Material `OutlinedTextField` with a persistent label and optional placeholder; fields fill the column. Notes allow multiple lines. URL fields request the URI keyboard. Native focus, caret, selection, and disabled treatment are retained. Validation messages surface through the app's snackbar or error surface; the build does not define a custom inline field-error style.

### Navigation

Material `TopAppBar`, `NavigationBar`, and `NavigationBarItem` provide the app structure. The three root destinations are Passes, NFC, and Settings. Each combines a Material outlined vector icon with a text label; selection is visible through native tonal emphasis. Editor and detail expose a labeled back icon, and detail exposes the delete action. System status- and navigation-bar icon appearance follows light/dark theme at runtime.

### Feedback and dialogs

Material snackbars report completion, cancellation, and errors. Native progress indicators name the operation. Material alert dialogs confirm discard, deletion, NFC overwrite, and the saved-image Wallet import steps. Saved-state text names the local copy; a Wallet handoff is not presented as a verified Wallet save.

### NFC availability

Hardware state is written in text above the controls. Scan/write actions are disabled whenever NFC is unavailable or off. The Android NFC settings link appears only when hardware exists and NFC is off. Active scans expose progress, placement instructions, and a cancel action. These states are part of the native interaction contract, not decorative disabled variants.

## Do's and Don'ts

### Do:

- **Do** let the user's artwork and pass color provide visual variety.
- **Do** reuse Material components, typography roles, and semantic theme colors.
- **Do** keep the centered column, repeated page gutters, and top-aligned scrolling.
- **Do** preserve native focus, touch, disabled, progress, and font-scale behavior.
- **Do** name local-save, busy, error, and hardware states explicitly.

### Don't:

- **Don't** crop or recolor uploaded artwork to fit the application palette.
- **Don't** treat a Google Wallet image handoff as a confirmed Wallet save.
- **Don't** enable scan/write actions when NFC is unavailable or off.
- **Don't** replace the native Android system with website styling or web component approximations.
