---
title: Opening plan memory spec
created: 2026-10-18
type: project
status: proposed
tags: [ollo, opening-plan, product-spec]
---

# Opening-plan memory spec

## Scope and rationale

A free convenience experiment: let someone optionally reuse the purpose and check-in duration they chose for a specific app. Existing evidence is directional only: one configuration-fatigue discussion, plus Ollo’s existing purpose flow. This is not a demand or uniqueness claim. Keep all current features free; future Pro customization could offer multiple named presets, custom purposes, or broader rules. Do not include those here.

## Smallest useful behavior

On the existing purpose form, initialize purpose/time from an opted-in saved choice for that package; otherwise keep today’s `MESSAGE`/5-minute defaults. Add an unchecked “Use this next time” control. Selecting it saves only the currently selected enum and allowed duration (5/10/20) when the user confirms “Open with this purpose.” Turning it off on a later opening forgets that app’s preset. Add a “Forget saved choice” action when one exists. Form edits are immediately reflected in selection; leaving via Back or “Open without a purpose” does not save. Never auto-open or auto-start a timer: every launch still requires the current explicit confirmation. A saved choice is a form default, not an active plan or permission to bypass quiz, prompt, block, grace, foreground, or safety-package checks.

## Existing touchpoints

- `app/src/main/java/app/ollo/platform/OlloAccessibilityService.kt`: `showPlanForm` (lines ~274–316) owns form defaults, opt-in checkbox, forget action, and existing confirmation buttons; both normal prompt and completed-quiz paths enter this form.
- `app/src/main/java/app/ollo/data/AppController.kt`: `openConsciously` (~219) remains authoritative. Pass an explicit remember/forget intent with the selected plan and persist only after all existing quiz/foreground/Prompt/currentDecision checks pass. Continue creating transient `openingPlan` only from that confirmed call.
- `app/src/main/java/app/ollo/domain/Models.kt`: add a small `SavedOpeningPlan(purpose, minutes)` and `Config.rememberedOpeningPlans: Map<String, SavedOpeningPlan>` keyed by package name.
- `app/src/main/java/app/ollo/data/OlloDatabase.kt`: `StateStore.read` is Gson-backed JSON in one Room snapshot. Normalize absent/null map to empty and reject invalid enum/duration entries; no Room table migration. Bump the exported settings schema version in `AppController.exportSettings` if the format contract requires it.

## Data, privacy, verification

Store package name, purpose enum, and duration locally in existing config JSON; no free text, history, timestamps, analytics, notifications, or account sync. Settings export already serializes full config, so saved app names/choices will be included; preserve this explicit export disclosure and ensure forgetting removes them from subsequent exports. No separate usage-CSV impact.

Verify old snapshots load empty; malformed/unsupported values fall back to current defaults; opt-in survives restart for app A only; off/forget removes A; edits persist only on confirmed planned open; Back/open-without-plan does not persist; opening still waits for confirmation; quiz, hard-block, foreground mismatch, grace expiry, and safety-app rules win. Check unavailable/uninstalled packages are harmless and removable.

## Is there a simpler option?

A single global last choice is less code but can surprise users across apps and fails the requested per-app reuse. Keep one saved tuple per app and no separate settings screen; the inline opt-in/forget control is the smallest understandable version.


## Source implementation checkpoint18October

Source is implemented but not yet native-accepted: one optional remembered purpose/duration per app, default-prefill only, explicit confirmation, inline opt-out and forget. Saved tuples are part of Config and the existing settings JSON; no new store, account or network flow. The checkbox is off for a new choice and on for a remembered one. Active plans remain transient. The decoder sanitizes only the new map before Gson so absent/null/wrong-shaped data or invalid entries preserve unrelated policies/goals; four new decoder tests passed (91total units). Room schema stays1 and the export remains the existing additive settings format; no importer is implied. Initial new-label localization warning was corrected in resources, and the confirmation build passed91units,lint0errors/18existing warnings,13debug-package checks and16KB alignment. Native acceptance remains pending. Current stable accepted build remains85d1e79/c2adee7f…; do not market this source work as shipped.
