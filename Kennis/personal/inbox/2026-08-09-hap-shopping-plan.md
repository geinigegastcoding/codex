# Hap Portions and Shopping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reliable portion scaling and one persistent, grouped, checkable multi-recipe shopping list with Jumbo handoff.

**Architecture:** Create one pure shopping domain module for measure scaling, state sanitization, selection updates, ingredient grouping, and cart-line construction. Keep the existing App state/localStorage pattern and add one `shopping` view plus full-detail portion controls; no backend or runtime dependency.

**Tech Stack:** React, TypeScript, Vite, Playwright, localStorage, existing Jumbo integration.

---

## File map

- Create `E:\MData\projecten\tinder-eten\src\domain\shopping.ts`: pure quantities, state, grouping, and cart functions.
- Modify `E:\MData\projecten\tinder-eten\tests\domain.spec.ts`: quantity and aggregation contracts.
- Modify `E:\MData\projecten\tinder-eten\src\App.tsx`: portions, persistence, fourth view, grouped list, checked state, combined cart.
- Modify `E:\MData\projecten\tinder-eten\src\styles.css`: shopping cards/list and four-item mobile navigation.
- Modify `E:\MData\projecten\tinder-eten\tests\app.spec.ts`: end-to-end portions/list workflow.
- Modify `E:\MData\projecten\tinder-eten\README.md`: document the workflow and storage key.
- Modify `E:\MData\projecten\tinder-eten\scripts\capture-screenshots.mjs`: capture desktop/mobile shopping views.

No VCS actions are allowed because the project remains untracked in a dirty parent repository.

### Task 1: Pure quantity and shopping model

**Files:**
- Create: `src/domain/shopping.ts`
- Modify: `tests/domain.spec.ts`

- [ ] **Step 1: Write failing tests**

```ts
test('porties schalen breuken en bewaren verpakkingsgroottes', () => {
  expect(scaleAmount('500g', .5)).toBe('250g')
  expect(scaleAmount('1/2 cup', 2)).toBe('1 cup')
  expect(scaleAmount('1 1/2 tbsp', .5)).toBe('3/4 tbsp')
  expect(scaleAmount('1 (400g) tin', .5)).toBe('1/2 (400g) tin')
  expect(scaleAmount('pinch', 3)).toBe('pinch')
})

test('boodschappenstaat wordt begrensd en per recept ontdubbeld', () => {
  const state = sanitizeShoppingState({ version: 9, selections: [
    { mealId: 'a', servings: 0 }, { mealId: 'a', servings: 20 }, { mealId: 'missing', servings: 4 },
  ], checked: ['tomaten', 'tomaten', 3] }, new Set(['a']))
  expect(state).toEqual({ version: 1, selections: [{ mealId: 'a', servings: 12 }], checked: ['tomaten'] })
  expect(upsertSelection(state, { mealId: 'a', servings: 3 }).selections).toEqual([{ mealId: 'a', servings: 3 }])
})

test('ingrediënten worden transparant gegroepeerd voor een gecombineerde lijst', () => {
  const items = aggregateShoppingItems([
    { id: 'a', title: 'A', servings: 4, ingredients: [{ name: 'Tomatoes', amount: '400g', totalGrams: 400 }] },
    { id: 'b', title: 'B', servings: 2, ingredients: [{ name: 'Chopped tomatoes', amount: '1 tin', totalGrams: 400 }] },
  ], [{ mealId: 'a', servings: 2 }, { mealId: 'b', servings: 2 }])
  expect(items).toEqual([{ key: 'tomaten', name: 'tomaten', estimatedGrams: 600, contributions: [
    { mealId: 'a', mealTitle: 'A', amount: '200g' }, { mealId: 'b', mealTitle: 'B', amount: '1 tin' },
  ] }])
  expect(shoppingCartIngredients(items, ['tomaten'])).toEqual([])
})
```

- [ ] **Step 2: Run and observe missing-module failure**

Run `npx playwright test tests/domain.spec.ts -g "porties schalen|boodschappenstaat|transparant gegroepeerd" --reporter=line`.

- [ ] **Step 3: Implement minimal pure functions**

Export:

```ts
export type ShoppingSelection = { mealId: string; servings: number }
export type ShoppingState = { version: 1; selections: ShoppingSelection[]; checked: string[] }
export const emptyShoppingState = (): ShoppingState => ({ version: 1, selections: [], checked: [] })
export function scaleAmount(amount: string, factor: number): string
export function sanitizeShoppingState(value: unknown, validMealIds: Set<string>): ShoppingState
export function upsertSelection(state: ShoppingState, selection: ShoppingSelection): ShoppingState
export function removeSelection(state: ShoppingState, mealId: string): ShoppingState
export function aggregateShoppingItems(meals: ShoppingMeal[], selections: ShoppingSelection[]): ShoppingItem[]
export function shoppingCartIngredients(items: ShoppingItem[], checked: string[]): CartIngredient[]
```

Use eighth-fraction formatting, preserve parenthesized package sizes, group on normalized `toDutchIngredient(name)`, sum only estimated grams, and retain every scaled source contribution.

- [ ] **Step 4: Run focused and complete domain tests**

Expected: focused tests and the full domain suite pass.

### Task 2: Portion controls in full recipe details

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `tests/app.spec.ts`

- [ ] **Step 1: Write a failing portion workflow test**

Open full details, capture the first ingredient text, increment portions, verify the text changes and the selected count is announced, add the recipe, and assert the shopping navigation badge becomes one.

- [ ] **Step 2: Observe failure because controls are absent**

Run `npx playwright test tests/app.spec.ts -g "porties aanpassen" --reporter=line`.

- [ ] **Step 3: Add bounded detail state and controls**

Store `detailServings`, reset it from an existing shopping selection or the recipe's base servings in one `openDetails(mealId)` helper, and pass it to full `MealDetails`. Render native minus/plus buttons with disabled boundaries at 1 and 12 and display ingredients through `scaleAmount(amount, selected/base)`.

- [ ] **Step 4: Add/update the selected recipe**

Persist `hap:shopping` through `sanitizeShoppingState`. A full-detail primary action calls `upsertSelection`, announces whether the recipe was added or updated, and shows the current selection state.

- [ ] **Step 5: Run the focused test**

Expected: pass.

### Task 3: Consolidated shopping view

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `tests/app.spec.ts`

- [ ] **Step 1: Extend the failing workflow test**

Open `Boodschappen`, verify the selected recipe, grouped items, source amount, approximate gram disclosure, native checkbox, progress count, and persistence after reload. Remove the recipe and verify the empty state.

- [ ] **Step 2: Add the fourth navigation destination**

Extend the view union with `shopping`. Add desktop `Boodschappen` and mobile `Lijst` buttons with the number of selected recipes, and change mobile navigation to four equal columns.

- [ ] **Step 3: Render recipe sources and aggregate items**

Compute `shoppingMeals` and `shoppingItems` with `useMemo`. Render selected recipe cards with edit/remove actions and a grouped list with accessible checkboxes. Updating `checked` must persist; stale checked keys are pruned when selections change.

- [ ] **Step 4: Add list actions and combined Jumbo handoff**

Add `Vinkjes wissen`, `Wis lijst`, and a combined cart button using `shoppingCartIngredients` plus the existing `createJumboCart`. Show loading and fail-loud errors; never navigate when all items are checked.

- [ ] **Step 5: Run focused and full app tests**

Expected: pass.

### Task 4: Responsive polish, docs, and verification

**Files:**
- Modify: `src/styles.css`
- Modify: `README.md`
- Modify: `scripts/capture-screenshots.mjs`

- [ ] **Step 1: Polish without changing Hap's visual language**

Ensure 44px controls, readable contribution wrapping, no four-item mobile-nav overflow at 320px, visible checked states, disabled/loading affordances, and list actions that cannot be mistaken for the main cart action.

- [ ] **Step 2: Update docs and screenshots**

Document `hap:shopping`, portion bounds, approximate grouping, and combined cart. Capture desktop/mobile populated shopping-list screenshots.

- [ ] **Step 3: Run full verification**

Run:

```powershell
npm run typecheck
npm test
npm run build
npm run screenshots
```

Expected: every command exits 0; inspect all new screenshots before moving to weekly planning.

## Plan self-review

- Coverage: portion rules, persistence, deduplication, grouping, checks, removal, empty state, combined cart, responsive navigation, docs, and verification are assigned.
- Scope: weekly planning and pantry intelligence remain separate later releases.
- Types and function names are defined once and reused consistently.
- Every code-producing task begins with a failing intent test; no fill-in step remains.
