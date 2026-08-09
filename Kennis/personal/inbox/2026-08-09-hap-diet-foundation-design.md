# Hap diet foundation design

**Date:** 2026-08-09  
**Status:** Approved by the user's explicit autonomous "don't stop improving" mandate  
**Project:** `E:\MData\projecten\tinder-eten`

## Goal

Make Hap useful for ordinary meal discovery and for people choosing food around dietary preferences or nutrition goals. Improve correctness and finish incomplete core flows before adding lower-value breadth.

## Current baseline

Hap already has a polished responsive swipe UI, 1,024 local recipes, estimated per-portion macros, local taste learning, saved meals, four numeric filters, and Jumbo price/cart integrations. The production build and all eight existing Playwright tests pass.

The main gaps are:

- Diet support is only calorie and protein sliders; there are no dietary-pattern or allergen exclusions.
- The source data is not certified for allergies, halal, kosher, or cross-contamination.
- Ingredient measure parsing can badly undercount packaged weights such as `1 (400g) tin`.
- Search is visible but inactive, saved cards cannot open their recipe, and undo does not undo the learned preference or save.
- The filter badge always says four, settings are not persisted, and the catalog mixes meals with many desserts and sides without a meal-type control.
- Recipe instructions are absent, so Hap often hands users off before they can cook.

## Chosen approach

Use a foundation-first, local-first release.

Alternatives rejected for now:

- Feature-first would add planners, streaks, and collections on top of unreliable classification and incomplete flows.
- Cloud-first would add accounts and sync before they improve meal choice. The current local architecture can gain the important product value without a backend.

## Product safety boundary

Diet and allergen features are ingredient-based decision aids, not medical or religious certification.

- Detect the 14 EU allergen groups from recipe ingredients: gluten cereals, crustaceans, eggs, fish, peanuts, soy, milk, nuts, celery, mustard, sesame, sulphites, lupin, and molluscs.
- Show detected allergens on every detailed recipe view.
- Let users exclude detected allergens, but show a short persistent warning to check the full recipe, product packaging, substitutions, and cross-contamination.
- Do not label meals "allergy safe," "halal," or "kosher." A future certified data source is required for those claims.
- Name nutrition presets for what they filter (for example, "calorie-conscious") rather than claiming weight loss or health outcomes.

This follows the EU allergen model while acknowledging that TheMealDB exposes recipe ingredients, not certification or cross-contamination evidence.

## Domain design

Add a small `diet.ts` domain module containing deterministic, testable classification and filtering.

Each built meal gains:

- `allergens`: detected EU allergen identifiers.
- `dietary`: inferred `vegetarian`, `vegan`, and `pescatarian` booleans.
- `mealType`: `main`, `breakfast`, `starter`, `side`, or `dessert` derived from the source category.

Classification uses normalized ingredient names and conservative keyword groups. It describes what was detected in the provided ingredient list; it never converts inference into certification.

Persist one versioned preference object in `localStorage`:

- selected dietary pattern (`all`, `vegetarian`, `vegan`, or `pescatarian`);
- excluded detected allergens;
- included meal types;
- maximum calories, carbohydrates, time, and estimated price;
- minimum protein;
- selected goal preset.

Unknown or malformed stored values fall back safely to defaults. Existing saved meals and taste profiles continue to load unchanged.

## Experience design

### Discover and filters

- Keep swiping as the primary interaction.
- Add compact quick presets: Balanced, Calorie-conscious, High protein, Lower carb, Quick, and Budget.
- Expand the filter sheet with dietary pattern, allergen exclusions, and meal types, followed by the existing numeric controls.
- Persist filter choices and show a truthful active-filter count.
- Show active preference chips near the result count with a one-action reset.
- If no recipes match, explain which constraints are active and offer a reset.

Preset values are transparent filters, not personalized medical targets. Users can change every value manually.

### Recipe understanding

- Show diet labels and detected allergens beside macros.
- Show all ingredients rather than silently truncating after eight.
- Store and display source cooking instructions when available.
- Clearly label macros, portions, and prices as estimates and retain source attribution.

### Complete existing flows

- Make search functional across titles, cuisines, categories, tags, and ingredients. Selecting a result opens that meal.
- Make saved meal cards open full details and the same Jumbo actions.
- Undo restores the previous card, taste profile, and saved list snapshot.
- Support Escape to close sheets and left/right arrow keys for skip/like when focus is not in a form control.
- Announce swipe results and errors through an `aria-live` region.

## Data quality work

Fix ingredient weight parsing before presenting stronger diet features:

- Prefer explicit gram or millilitre quantities inside packaged measures, including parenthesized values.
- Support common Unicode fractions and mixed imperial/metric measures.
- Keep nutrition coverage visible and label low-coverage estimates.
- Use the official nutrition-claim threshold (at least 20% of energy from protein) for the `high-protein` label instead of only a fixed gram cutoff.

Regenerate the local recipe catalog to retain source instructions. Do not fabricate missing instructions.

## Architecture and data flow

1. Raw recipe JSON is built into enriched meals once at app startup.
2. Pure domain functions classify diet/allergens and calculate nutrition.
3. A versioned preference object filters meals, then the existing taste model ranks the matching set.
4. UI actions update local state and persist only user-owned preferences, saves, and taste data.
5. External Jumbo calls remain explicit user actions with current error handling and attribution.

No new runtime dependency or backend is needed.

## Verification

Add intent-focused checks for:

- all 14 allergen groups and representative vegetarian/vegan/pescatarian boundaries;
- packaged-weight and Unicode-fraction parsing;
- preference sanitization, preset application, combined filtering, and persistence;
- active filter counts and empty-state reset;
- undo restoring learning and saves;
- search selecting a meal and saved cards opening the correct details;
- keyboard and dialog-close behavior;
- desktop and mobile screenshots with no clipping or overlap.

Run the complete test suite and production build. Inspect generated desktop and mobile screenshots before declaring the milestone complete.

## Later improvement cycles

After this foundation is verified, prioritize by user value:

1. Portion scaling and a consolidated shopping list.
2. Weekly meal planning with daily calorie/protein summaries.
3. Cooked history, ratings, notes, and stronger taste learning from ratings.
4. Pantry exclusions and ingredient substitutions.
5. Optional export/import, then cloud sync only if multi-device demand is real.

## Success criteria

- A user can set persistent dietary and allergen preferences and only swipe recipes matching the app's detected ingredient rules.
- Every recipe clearly exposes detected allergens and the non-certification warning.
- Nutrition estimates handle packaged weights better and disclose uncertainty.
- Search, saved-details, filter count, and undo all work end to end.
- The app remains usable and polished on desktop and mobile.
- Build and all old and new tests pass, with no new dependency or backend.

## Sources

- European Commission, 14 allergen groups and labelling context: https://food.ec.europa.eu/food-safety/campaign-2026/allergies_en
- European Commission, mandatory food information: https://food.ec.europa.eu/food-safety/labelling-and-nutrition/food-information-consumers-legislation/mandatory-food-information_en
- TheMealDB API guide: https://themealdb.com/docs_api_guide.php
- Voedingscentrum, protein and the 20%-of-energy high-protein claim: https://www.voedingscentrum.nl/nl/service/vraag-en-antwoord/gezonde-voeding-en-voedingsstoffen/heb-je-producten-met-extra-eiwit-nodig-.aspx
