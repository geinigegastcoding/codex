# Design system and UX direction

## 1. Design mode

**Operate.** This is a tool used during a real task. Scanability, trust, keyboard access and predictable Windows behavior outrank visual novelty. The product can be beautiful through restraint, rhythm and precise state communication.

## 2. Product-to-design translation

The visual system must make one relationship obvious:

**work evidence → power lease → next action**

Every screen should help the user answer:

- What is running?
- What evidence proves it?
- Why is the PC awake?
- What will happen if nothing changes?

## 3. Visual-world candidates

The design exercise considered seven grounded systems:

1. **Quiet power console** — an electrical control panel translated into calm cards, rails and state indicators; strongest fit for causal power decisions.
2. **Airport departure board** — excellent for timelines and countdowns, but risks making agent work feel like a queue rather than a living process.
3. **Lab instrument** — strong for evidence, measurements and diagnostics; risks feeling clinical.
4. **Maintenance ledger** — strong for history and auditability; too slow as the primary glance surface.
5. **Terminal transcript** — authentic for developers; too narrow for non-agent workloads and too close to an implementation surface.
6. **Nordic utility** — calm and approachable; can become generic without a stronger status grammar.
7. **Windows status rail** — uses familiar system semantics, narrow rails and native density; chosen as the underlying grammar, fused with the quiet power console.

### Chosen direction: Quiet Power Console

The product feels like a small, trustworthy instrument installed beside Windows rather than a floating dashboard. The main window has a cool neutral canvas, precise status rails, restrained accent color and compact telemetry. The tray panel is the product’s natural home; the full window expands the same grammar instead of becoming a separate brand world.

### What this direction must not become

- a sci-fi control room;
- a dark neon “AI dashboard”;
- an oversized glassmorphism panel;
- a fake terminal with unreadable logs;
- a dashboard that celebrates activity instead of explaining risk.

## 4. Design principles

1. **State before decoration.** Color, shape and motion support the state; they never replace its label.
2. **Calm while safe, emphatic at risk.** Active work is quiet; a pending shutdown is unmistakable.
3. **Evidence is first-class.** Show source and freshness, not just confidence words.
4. **Windows-native familiarity.** Use familiar controls, focus behavior, taskbar/tray patterns and system typography.
5. **Progressive detail.** Tray glance → session card → event details. Do not force the user into logs.
6. **Reversible destructive actions.** Countdown, cancel and post-action history are part of the primary design.

## 5. Information architecture

### Tray

- current state;
- current session/workload;
- next action;
- pause/cancel/end controls;
- open main window.

### Main window navigation

1. **Overview** — current session and power lease.
2. **Sessions** — recent and active runs.
3. **Rules** — workload adapters and completion policies.
4. **Settings** — power, startup, notifications, data and safety.
5. **Diagnostics** — capability checks and event logs.

Keep navigation shallow. A user who only wants to cancel a shutdown should not need to find a settings page.

## 6. Core screens

### 6.1 Tray quick panel

Use a compact panel with:

- state mark and label: “Awake — 1 workload active”;
- one-line reason: “Codex CLI output seen 18s ago”;
- small lease indicator: “Power protection on”;
- next action: “Sleep when all work is complete”;
- primary contextual action: Pause or Cancel countdown;
- secondary link: View session.

Do not show charts here. The tray is for action and confidence, not analysis.

### 6.2 Overview

Structure:

- top app bar: product name, session selector, settings;
- status hero: one large state label, reason and next action;
- workload list: one row per workload with status, freshness and evidence source;
- power context strip: AC/DC, battery, lid policy, capability state;
- event rail: last five meaningful events;
- sticky action area: pause, end session or cancel countdown.

The first viewport should communicate the mechanism through a live session, not through marketing copy.

### 6.3 Start session

Three-step setup:

1. **What should I watch?** Choose process tree, wrapper/heartbeat, watched folder or manual.
2. **What should happen when it is done?** Choose No action, Sleep, Hibernate or Shut down; choose Safe or Hands-off.
3. **Can this device do it safely?** Show preflight and test detection.

Every step has a plain-language explanation and a visible “why this matters” detail.

### 6.4 Session detail

Show:

- session title and elapsed time;
- state timeline;
- current evidence with timestamp;
- lease start and renewals;
- completion checklist;
- planned action and countdown;
- full event list.

The session detail is the audit surface. It may be dense, but it should read top-to-bottom without requiring a graph.

### 6.5 Rules

Use simple rule cards:

- source;
- trigger/evidence;
- stale-after duration;
- completion rule;
- fallback behavior.

Avoid a visual node editor in MVP. Rules are configuration, not a programming environment.

### 6.6 Settings

Sections:

- General and startup;
- Power behavior;
- Battery and thermal guard;
- Notifications;
- Data and history;
- Advanced integrations.

Place destructive or privilege-sensitive settings in a clearly labeled “Safety” section; do not hide them in a generic advanced drawer.

### 6.7 Unknown/error state

Use an explicit state panel:

**“We can’t prove the workload is finished.”**

Then show:

- what evidence went stale;
- what the app is doing now;
- what the user can inspect;
- actions: refresh, pause, end session, open diagnostics.

Never write “Probably done” next to a shutdown button.

## 7. Status vocabulary

| State | Label | Icon/shape | Accent | Example copy |
|---|---|---|---|---|
| Active | Working | filled pulse/vertical rail | system blue | “Output seen 18s ago” |
| Waiting | Waiting for you | pause bars + outline | amber | “Terminal prompt detected” |
| Blocked | Blocked | square stop mark | red | “Agent reported an error” |
| Unknown | Checking | dotted ring | slate/amber | “No heartbeat for 90s” |
| Ready | Ready to finish | check ring | green | “All workloads complete” |
| Countdown | Shutting down in 60s | countdown ring | red/orange | “Cancel if you need more time” |
| Paused | Protection paused | pause mark | muted | “Windows may sleep normally” |
| Completed | Finished | check | green | “Session ended at 02:14” |

Never rely on color alone. Pair every color with label, icon shape and text.

## 8. Tokens

These are a starting contract for future implementation; validate contrast on real Windows themes before shipping.

### Color

| Token | Light | Dark | Use |
|---|---|---|---|
| Canvas | #F6F7F9 | #0F1115 | app background |
| Surface | #FFFFFF | #171A21 | cards and panels |
| Surface muted | #EEF1F5 | #20242D | secondary strip |
| Ink | #111827 | #F5F7FA | primary text |
| Ink muted | #5F6B7A | #AAB4C2 | secondary text |
| Border | #D8DEE8 | #343B48 | separators |
| Accent | #2563EB | #60A5FA | current action/selection |
| Success | #15803D | #4ADE80 | completed/ready |
| Warning | #B45309 | #FBBF24 | waiting/capability warning |
| Danger | #B91C1C | #F87171 | countdown/error/abort |
| Focus | #1D4ED8 | #93C5FD | keyboard focus |

Use one primary accent. Do not add a second saturated “AI purple” accent.

### Typography

- UI: Segoe UI Variable.
- Telemetry and event values: Cascadia Mono.
- Body: 14px / 20px.
- Compact labels: 12px / 16px, never below 11px.
- Section title: 16px / 22px semibold.
- Status title: 28px / 34px semibold.
- Numeric countdown: Cascadia Mono, tabular figures.

The app does not need a display font. Hierarchy comes from scale, weight and spacing.

### Shape and spacing

- base spacing: 4px;
- common gaps: 8, 12, 16, 24, 32px;
- card radius: 10px;
- small control radius: 6px;
- border: 1px, not shadow-only separation;
- elevation: one restrained shadow level for menus/overlays;
- status rail: 3–4px wide, always paired with text.

## 9. Component contract

Every interactive component needs:

- default;
- hover;
- focus-visible;
- pressed/active;
- disabled;
- loading;
- error;
- success where relevant;
- high-contrast fallback.

Priority components:

- status banner;
- workload row;
- evidence chip;
- power lease badge;
- countdown panel;
- danger confirmation;
- rule card;
- event row;
- capability check.

### Confirmation pattern

For Safe mode, a shutdown confirmation should include:

- explicit verb: “Shut down this PC”;
- workload summary;
- evidence summary;
- target time;
- large Cancel action;
- optional “Pause protection instead” alternative.

Hands-off mode can skip repeated confirmation only after one-time consent; it never skips the visible countdown.

## 10. Motion

- 150–250ms for state transitions and panel changes;
- no page-load choreography;
- a status pulse only while Active, with a static equivalent for reduced motion;
- countdown ticks may update text without animating the whole panel;
- when new evidence arrives, highlight the evidence row once, then settle;
- no bouncing tray icon or attention-grabbing loops.

## 11. Copy and tone

Voice: precise, calm, direct, non-anthropomorphic.

Prefer:

- “Keeping your PC awake because build.exe is still active.”
- “We cannot verify completion. Automatic shutdown is blocked.”
- “Your lid policy is Sleep on battery. Closed-lid work is only available on AC if Windows stays awake.”
- “Shutdown cancelled. Protection remains on.”

Avoid:

- “Your AI buddy is hard at work.”
- “We think everything is fine.”
- “Magic auto-shutdown.”
- vague badges such as “Smart mode”.

## 12. Accessibility

- full keyboard path for every setup and cancellation flow;
- logical tab order matching visual order;
- focus ring visible on all backgrounds;
- screen reader labels include state, reason and action;
- no status communicated by color or motion alone;
- high contrast tested on Windows;
- reduced-motion setting removes pulses and animated transitions;
- countdown uses both numeric and spoken status;
- error copy explains recovery, not only failure.

## 13. Responsive and window behavior

This is a desktop app, not a responsive website:

- support a compact tray panel;
- support a minimum main-window width around 720px;
- at narrow widths, stack power context below workloads;
- preserve action controls above the fold;
- remember size and position, but reopen on the active monitor;
- avoid modal windows for routine status;
- keep the main window safe to close: it minimizes to tray while a session is armed.

## 14. Design acceptance checklist

- A first-time user can distinguish Active, Waiting and Unknown without a tutorial.
- A user can cancel a countdown within two actions.
- Every keep-awake state has a visible reason.
- The UI never implies that lid-closed work is universally supported.
- Dark/light/high-contrast/reduced-motion variants use the same state grammar.
- The visual system feels native to Windows without copying Settings or macOS.
