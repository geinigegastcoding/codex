# Hap portions and shopping design

**Date:** 2026-08-09  
**Status:** Approved by the user's autonomous improvement mandate  
**Project:** `E:\MData\projecten\tinder-eten`

## Goal

Turn saved meal inspiration into a practical cooking workflow: choose portions, see scaled ingredients, combine several recipes into one checkable shopping list, and hand the remaining ingredients to Jumbo.

## Scope

- Scale full recipe ingredients from 1 through 12 portions.
- Keep per-portion macros unchanged and clearly distinguish them from selected total portions.
- Add or update a recipe in a persistent local shopping list.
- Combine ingredients by normalized Dutch shopping name while preserving each scaled source amount.
- Show estimated aggregate grams only as a secondary estimate, never as exact package advice.
- Check ingredients off, remove recipes, clear completed ingredients, and create one Jumbo cart from unchecked items.
- Add a fourth responsive navigation destination for the list.

Weekly planning, pantry inventory, substitutions, and account sync stay in later cycles.

## Quantity rules

Scaling is deterministic and conservative:

- Multiply fractions, mixed numbers, decimals, and common Unicode fractions.
- Preserve package-size annotations: `1 (400g) tin` at half scale becomes `1/2 (400g) tin`, not a fictional 200g tin.
- Scale both sides of explicit metric/imperial alternatives where practical.
- Leave qualitative amounts such as `pinch` and `to taste` unchanged.
- Display the original ingredient name and scaled source measure; estimated grams remain visibly approximate.

## Local state

Persist a versioned `hap:shopping` object:

- `selections`: unique meal ID plus selected servings;
- `checked`: normalized aggregate ingredient keys.

Sanitize corrupted values, clamp portions to 1–12, remove duplicate selections, and ignore meal IDs no longer present in the catalog.

## Experience

Full recipe details gain a compact minus/value/plus portion control. Ingredient measures update immediately. The primary action adds the current portion choice to the shopping list or updates it if already present.

The shopping view contains:

- selected-recipe summary cards with portions, edit, and remove actions;
- a progress summary for checked ingredients;
- one grouped list with accessible native checkboxes;
- source amount breakdown and approximate aggregate grams;
- actions to remove checked marks, clear the list, and open a combined Jumbo cart.

An empty list explains how to add a recipe and links back to discovery.

## Verification

- Unit tests prove fractions, packaged measures, unchanged qualitative quantities, sanitization, deduplication, grouping, and check-state pruning.
- End-to-end tests prove portion scaling, add/update persistence, grouped list behavior, checking, recipe removal, empty state, and combined cart payload construction.
- Typecheck, full Playwright suite, production build, and desktop/mobile screenshot inspection must pass.

## Success criteria

- A user can select portions and see every displayed ingredient measure scale predictably.
- Multiple recipes produce one persistent, grouped, checkable list without silent data loss.
- The Jumbo handoff uses only unchecked grouped items and visibly remains an estimate requiring user confirmation.
- Desktop and mobile remain polished with four navigation destinations.
