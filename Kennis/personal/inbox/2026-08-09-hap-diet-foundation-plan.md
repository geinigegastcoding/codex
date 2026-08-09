# Hap Diet Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Hap's numeric macro filtering into a trustworthy local dietary-preference experience while fixing data-quality and incomplete core-flow defects.

**Architecture:** Add one pure `diet.ts` domain module for classification, preference sanitization, presets, and filtering. Enrich meals in the existing catalog builder, keep user state in versioned `localStorage`, and extend the existing single-page React UI without a backend or new dependency.

**Tech Stack:** React, TypeScript, Vite, Playwright, Node.js, localStorage, TheMealDB recipe export.

---

## File map

- Create `E:\MData\projecten\tinder-eten\src\domain\diet.ts`: EU-allergen detection, dietary inference, meal types, versioned preferences, presets, matching, active-count helpers.
- Modify `E:\MData\projecten\tinder-eten\src\domain\nutrition.ts`: robust explicit package-weight and Unicode-fraction parsing.
- Modify `E:\MData\projecten\tinder-eten\src\domain\catalog.ts`: add instructions and dietary metadata; derive high-protein labels from energy percentage.
- Modify `E:\MData\projecten\tinder-eten\scripts\generate-recipes.mjs`: retain source instructions during deterministic catalog generation.
- Regenerate `E:\MData\projecten\tinder-eten\src\data\recipes.generated.json`: include source instructions without fabricating content.
- Modify `E:\MData\projecten\tinder-eten\src\App.tsx`: persisted preferences, diet filters, accurate filter count, search, full details, correct undo, keyboard support, live announcements.
- Modify `E:\MData\projecten\tinder-eten\src\styles.css`: intentional responsive styling for the new controls, results, badges, warnings, and instructions.
- Modify `E:\MData\projecten\tinder-eten\tests\domain.spec.ts`: intent-focused domain and data tests.
- Modify `E:\MData\projecten\tinder-eten\tests\app.spec.ts`: end-to-end diet, search, saved-detail, undo, persistence, and keyboard tests.
- Modify `E:\MData\projecten\tinder-eten\README.md`: document diet detection boundary and new controls.

No worktree or commits are planned: the project is untracked inside a parent repository with extensive unrelated changes, and workspace rules forbid automatic commits.

### Task 1: Nutrition measure correctness

**Files:**
- Modify: `E:\MData\projecten\tinder-eten\tests\domain.spec.ts`
- Modify: `E:\MData\projecten\tinder-eten\src\domain\nutrition.ts`

- [ ] **Step 1: Write failing regression tests**

Import `estimateGrams` and add:

```ts
test('verpakkingsgewichten en Unicode-breuken worden niet onderschat', () => {
  expect(estimateGrams('1 (400g) tin', 'chopped tomatoes')).toBe(400)
  expect(estimateGrams('175g/6oz', 'plain flour')).toBe(175)
  expect(estimateGrams('2½ oz', 'butter')).toBe(71)
  expect(estimateGrams('½ tsp', 'salt')).toBe(3)
})
```

- [ ] **Step 2: Run the focused test and confirm the package case fails**

Run:

```powershell
npx playwright test tests/domain.spec.ts -g "verpakkingsgewichten"
```

Expected: FAIL because `1 (400g) tin` currently resolves to 1 gram.

- [ ] **Step 3: Parse explicit metric quantities before container counts**

Add a Unicode fraction normalizer and make `estimateGrams` prefer the first metric weight/volume in the original measure:

```ts
const unicodeFractions: Record<string, string> = {
  '¼': ' 1/4', '½': ' 1/2', '¾': ' 3/4', '⅓': ' 1/3', '⅔': ' 2/3',
  '⅛': ' 1/8', '⅜': ' 3/8', '⅝': ' 5/8', '⅞': ' 7/8',
}

const normalizeMeasure = (measure: string) => Object.entries(unicodeFractions)
  .reduce((value, [fraction, replacement]) => value.replaceAll(fraction, replacement), measure)
  .replace(',', '.')

export function estimateGrams(measure: string, ingredient: string) {
  const normalizedMeasure = normalizeMeasure(measure)
  const metric = normalizedMeasure.match(/(\d+(?:\.\d+)?)\s*(kg|g|ml|l)\b/i)
  if (metric) {
    const amount = Number(metric[1])
    return Math.round(amount * (/^(kg|l)$/i.test(metric[2]) ? 1000 : 1))
  }
  const value = clean(normalizedMeasure).replace(/(\d)\s+(\d)/, '$1.$2')
  const mixed = normalizedMeasure.match(/(\d+)\s+(\d+)\/(\d+)/)
  const fraction = normalizedMeasure.match(/(\d+)\/(\d+)/)
  const numeric = mixed ? Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]) : fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(value.match(/[\d.]+/)?.[0] || 1)
  if (/\b(oz|ounce)/.test(value)) return Math.round(numeric * 28.35)
  if (/\b(lb|pound)/.test(value)) return Math.round(numeric * 453.6)
  if (/\b(tbs|tbsp|tablespoon)/.test(value)) return Math.round(numeric * 15)
  if (/\b(tsp|teaspoon)/.test(value)) return Math.round(numeric * 5)
  if (/\bcup/.test(value)) return Math.round(numeric * (/flour|sugar|rice|pasta/i.test(ingredient) ? 150 : 220))
  if (/\b(clove)/.test(value)) return Math.round(numeric * 4)
  if (/\b(can|tin)/.test(value)) return Math.round(numeric * 400)
  if (/\b(slice)/.test(value)) return Math.round(numeric * 30)
  if (/\b(bunch|handful)/.test(value)) return Math.round(numeric * 40)
  if (/egg/i.test(ingredient)) return Math.round(numeric * 50)
  if (/onion|tomato|pepper|potato|apple|banana/i.test(ingredient)) return Math.round(numeric * 120)
  return Math.round(numeric * 30)
}
```

- [ ] **Step 4: Run nutrition and complete domain tests**

Run:

```powershell
npx playwright test tests/domain.spec.ts
```

Expected: all domain tests PASS, including the existing 613 kcal reference calculation.

### Task 2: Dietary classification and safe preferences

**Files:**
- Create: `E:\MData\projecten\tinder-eten\src\domain\diet.ts`
- Modify: `E:\MData\projecten\tinder-eten\tests\domain.spec.ts`

- [ ] **Step 1: Write failing classification tests**

Add imports for the new module and these tests:

```ts
test('EU-allergenen worden uit ingredienten gedetecteerd zonder veiligheidsclaim', () => {
  const info = classifyDiet('Seafood', [
    { name: 'Rice noodles' }, { name: 'Prawns' }, { name: 'Soy sauce' },
    { name: 'Sesame oil' }, { name: 'Peanut butter' }, { name: 'Egg' },
  ])
  expect(info.allergens).toEqual(['crustaceans', 'eggs', 'peanuts', 'soy', 'sesame'])
  expect(info.allergens).not.toContain('gluten')
  expect(info.dietary).toEqual({ vegetarian: false, vegan: false, pescatarian: true })
})

test('plantaardige en vegetarische grenzen blijven conservatief', () => {
  expect(classifyDiet('Vegan', [{ name: 'Tofu' }, { name: 'Broccoli' }]).dietary.vegan).toBe(true)
  expect(classifyDiet('Vegetarian', [{ name: 'Egg' }, { name: 'Cheddar cheese' }]).dietary).toEqual({ vegetarian: true, vegan: false, pescatarian: true })
  expect(classifyDiet('Chicken', [{ name: 'Chicken breast' }]).dietary.pescatarian).toBe(false)
})

test('voorkeuren worden gesaneerd, gecombineerd en eerlijk geteld', () => {
  const preferences = sanitizePreferences({
    version: 1, preset: 'custom', diet: 'vegan', excludedAllergens: ['peanuts', 'invalid'],
    mealTypes: ['main'], maxKcal: 600, maxCarbs: 45, minProtein: 20, maxTime: 30, maxPrice: 7,
  })
  expect(preferences.excludedAllergens).toEqual(['peanuts'])
  expect(activeFilterCount(preferences)).toBe(8)
  expect(matchesPreferences({
    dietary: { vegetarian: true, vegan: true, pescatarian: true }, allergens: [], mealType: 'main',
    kcal: 550, carbs: 40, protein: 25, time: 25, estimatedPrice: 6,
  }, preferences)).toBe(true)
})
```

- [ ] **Step 2: Run the focused tests and confirm the missing module failure**

Run:

```powershell
npx playwright test tests/domain.spec.ts -g "EU-allergenen|plantaardige|voorkeuren"
```

Expected: FAIL because `src/domain/diet.ts` does not exist.

- [ ] **Step 3: Implement the pure diet module**

Create the module with exported constants/types and pure functions:

```ts
export const ALLERGENS = [
  ['gluten', 'Gluten'], ['crustaceans', 'Schaaldieren'], ['eggs', 'Ei'], ['fish', 'Vis'],
  ['peanuts', 'Pinda'], ['soy', 'Soja'], ['milk', 'Melk'], ['nuts', 'Noten'],
  ['celery', 'Selderij'], ['mustard', 'Mosterd'], ['sesame', 'Sesam'], ['sulphites', 'Sulfieten'],
  ['lupin', 'Lupine'], ['molluscs', 'Weekdieren'],
] as const
export type Allergen = typeof ALLERGENS[number][0]
export type Diet = 'all' | 'vegetarian' | 'vegan' | 'pescatarian'
export type MealType = 'main' | 'breakfast' | 'starter' | 'side' | 'dessert'
export type GoalPreset = 'balanced' | 'calorie-conscious' | 'high-protein' | 'lower-carb' | 'quick' | 'budget' | 'custom'

export type DietInfo = {
  allergens: Allergen[]
  dietary: { vegetarian: boolean; vegan: boolean; pescatarian: boolean }
  mealType: MealType
}

export type DietPreferences = {
  version: 1
  preset: GoalPreset
  diet: Diet
  excludedAllergens: Allergen[]
  mealTypes: MealType[]
  maxKcal: number
  maxCarbs: number
  minProtein: number
  maxTime: number
  maxPrice: number
}

export const MEAL_TYPES: MealType[] = ['main', 'breakfast', 'starter', 'side', 'dessert']
export const defaultPreferences = (): DietPreferences => ({
  version: 1, preset: 'balanced', diet: 'all', excludedAllergens: [], mealTypes: [...MEAL_TYPES],
  maxKcal: 1000, maxCarbs: 200, minProtein: 0, maxTime: 60, maxPrice: 12,
})

const aliases: Record<Allergen, string[]> = {
  gluten: ['wheat', 'barley', 'rye', 'oat', 'flour', 'bread', 'bun', 'breadcrumb', 'pasta', 'spaghetti', 'couscous', 'semolina', 'noodle'],
  crustaceans: ['prawn', 'shrimp', 'crab', 'lobster', 'crayfish'], eggs: ['egg', 'mayonnaise', 'mayo'],
  fish: ['fish', 'salmon', 'tuna', 'cod', 'haddock', 'anchovy', 'sardine', 'mackerel', 'trout', 'tilapia'],
  peanuts: ['peanut'], soy: ['soy', 'tofu', 'tempeh', 'edamame', 'miso'],
  milk: ['milk', 'cheese', 'cheddar', 'parmesan', 'feta', 'mozzarella', 'yogurt', 'yoghurt', 'cream', 'butter', 'whey', 'casein', 'ghee'],
  nuts: ['almond', 'hazelnut', 'walnut', 'cashew', 'pecan', 'pistachio', 'brazil nut', 'macadamia', 'marzipan'],
  celery: ['celery', 'celeriac'], mustard: ['mustard'], sesame: ['sesame', 'tahini'],
  sulphites: ['wine', 'sherry', 'vermouth', 'cider', 'sulphite', 'sulfite'], lupin: ['lupin'],
  molluscs: ['mussel', 'oyster', 'squid', 'octopus', 'clam', 'scallop', 'snail'],
}
const landMeat = ['meat', 'chicken', 'beef', 'steak', 'pork', 'lamb', 'turkey', 'bacon', 'ham', 'sausage', 'duck', 'goat', 'veal', 'venison']
const animalExtras = ['honey', 'gelatin', 'gelatine']
const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
const hasTerm = (value: string, terms: string[]) => terms.some((term) => new RegExp(`(^|\\s)${term.replace(' ', '\\s+')}($|\\s)`).test(value))

export function mealTypeFor(category: string): MealType {
  const value = normalize(category)
  if (value.includes('dessert')) return 'dessert'
  if (value.includes('breakfast')) return 'breakfast'
  if (value.includes('starter')) return 'starter'
  if (value.includes('side')) return 'side'
  return 'main'
}

export function classifyDiet(category: string, ingredients: Array<{ name: string }>): DietInfo {
  const names = ingredients.map(({ name }) => normalize(name))
  const allergens = ALLERGENS.flatMap(([id]) => {
    const detected = names.some((name) => {
      if (id === 'gluten' && /rice noodles?|gluten free/.test(name)) return false
      return hasTerm(name, aliases[id])
    })
    return detected ? [id] : []
  })
  const combined = [...names, normalize(category)].join(' ')
  const hasLandMeat = hasTerm(combined, landMeat)
  const hasSeafood = hasTerm(combined, [...aliases.fish, ...aliases.crustaceans, ...aliases.molluscs])
  const hasAnimalExtra = hasTerm(combined, [...aliases.eggs, ...aliases.milk, ...animalExtras])
  return {
    allergens,
    dietary: { vegetarian: !hasLandMeat && !hasSeafood, vegan: !hasLandMeat && !hasSeafood && !hasAnimalExtra, pescatarian: !hasLandMeat },
    mealType: mealTypeFor(category),
  }
}

const presets: Record<Exclude<GoalPreset, 'custom'>, Partial<DietPreferences>> = {
  balanced: {}, 'calorie-conscious': { maxKcal: 600, minProtein: 20 }, 'high-protein': { minProtein: 30 },
  'lower-carb': { maxCarbs: 45 }, quick: { maxTime: 25 }, budget: { maxPrice: 5 },
}

export function applyPreset(current: DietPreferences, preset: Exclude<GoalPreset, 'custom'>): DietPreferences {
  const base = defaultPreferences()
  return { ...current, ...pickNutritionLimits(base), ...presets[preset], preset }
}

const pickNutritionLimits = ({ maxKcal, maxCarbs, minProtein, maxTime, maxPrice }: DietPreferences) => ({ maxKcal, maxCarbs, minProtein, maxTime, maxPrice })
const diets: Diet[] = ['all', 'vegetarian', 'vegan', 'pescatarian']
const goalPresets: GoalPreset[] = ['balanced', 'calorie-conscious', 'high-protein', 'lower-carb', 'quick', 'budget', 'custom']
const numberIn = (value: unknown, fallback: number, min: number, max: number) => typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback

export function sanitizePreferences(value: unknown): DietPreferences {
  const fallback = defaultPreferences()
  if (!value || typeof value !== 'object') return fallback
  const input = value as Partial<DietPreferences>
  return {
    version: 1,
    preset: goalPresets.includes(input.preset as GoalPreset) ? input.preset as GoalPreset : fallback.preset,
    diet: diets.includes(input.diet as Diet) ? input.diet as Diet : fallback.diet,
    excludedAllergens: Array.isArray(input.excludedAllergens) ? input.excludedAllergens.filter((item): item is Allergen => ALLERGENS.some(([id]) => id === item)) : [],
    mealTypes: Array.isArray(input.mealTypes) ? input.mealTypes.filter((item): item is MealType => MEAL_TYPES.includes(item as MealType)) : [...MEAL_TYPES],
    maxKcal: numberIn(input.maxKcal, fallback.maxKcal, 250, 1500), maxCarbs: numberIn(input.maxCarbs, fallback.maxCarbs, 10, 250),
    minProtein: numberIn(input.minProtein, fallback.minProtein, 0, 80), maxTime: numberIn(input.maxTime, fallback.maxTime, 10, 180),
    maxPrice: numberIn(input.maxPrice, fallback.maxPrice, 2, 30),
  }
}

export type PreferenceMeal = DietInfo & { kcal: number; carbs: number; protein: number; time: number; estimatedPrice: number }
export function matchesPreferences(meal: PreferenceMeal, preferences: DietPreferences) {
  return (preferences.diet === 'all' || meal.dietary[preferences.diet])
    && !meal.allergens.some((allergen) => preferences.excludedAllergens.includes(allergen))
    && preferences.mealTypes.includes(meal.mealType)
    && meal.kcal <= preferences.maxKcal && meal.carbs <= preferences.maxCarbs && meal.protein >= preferences.minProtein
    && meal.time <= preferences.maxTime && meal.estimatedPrice <= preferences.maxPrice
}
export const filterMeals = <T extends PreferenceMeal>(meals: T[], preferences: DietPreferences) => meals.filter((meal) => matchesPreferences(meal, preferences))
export function activeFilterCount(value: DietPreferences) {
  const defaults = defaultPreferences()
  return Number(value.diet !== defaults.diet) + value.excludedAllergens.length
    + Number(value.mealTypes.length !== defaults.mealTypes.length)
    + Number(value.maxKcal !== defaults.maxKcal) + Number(value.maxCarbs !== defaults.maxCarbs)
    + Number(value.minProtein !== defaults.minProtein) + Number(value.maxTime !== defaults.maxTime) + Number(value.maxPrice !== defaults.maxPrice)
}
```

- [ ] **Step 4: Run the focused tests and correct only demonstrated classification errors**

Run:

```powershell
npx playwright test tests/domain.spec.ts -g "EU-allergenen|plantaardige|voorkeuren"
```

Expected: all three tests PASS.

### Task 3: Enrich the catalog and retain cooking instructions

**Files:**
- Modify: `E:\MData\projecten\tinder-eten\src\domain\catalog.ts`
- Modify: `E:\MData\projecten\tinder-eten\scripts\generate-recipes.mjs`
- Regenerate: `E:\MData\projecten\tinder-eten\src\data\recipes.generated.json`
- Modify: `E:\MData\projecten\tinder-eten\tests\domain.spec.ts`

- [ ] **Step 1: Extend the catalog tests first**

Add `instructions: 'Cook until done.'` to the `buildMeal` fixture and assertions:

```ts
expect(meal.instructions).toBe('Cook until done.')
expect(meal.mealType).toBe('main')
expect(meal.dietary.pescatarian).toBe(false)
expect(meal.allergens).toEqual([])
```

Extend the recipe-data test type with `instructions?: string` and assert:

```ts
expect(recipes.filter((recipe) => recipe.instructions?.trim()).length).toBeGreaterThan(700)
```

- [ ] **Step 2: Run the two affected tests and confirm failure**

Run:

```powershell
npx playwright test tests/domain.spec.ts -g "catalogus|bronrecepten"
```

Expected: FAIL because generated recipes and enriched meals lack instructions/diet fields.

- [ ] **Step 3: Enrich the catalog**

Import `classifyDiet`, add `instructions?: string` to `RawRecipe`, add `DietInfo` fields to `Meal`, and merge classification in `buildMeal`. Replace the current high-protein rule with:

```ts
const diet = classifyDiet(recipe.category, ingredients)
const tags = recipe.tags.filter((tag) => tag !== 'high-protein')
if (nutrition.kcal > 0 && nutrition.protein * 4 / nutrition.kcal >= .2) tags.push('high-protein')
if (recipe.time <= 25 && !tags.includes('snel')) tags.push('snel')
return { ...recipe, ...diet, /* existing nutrition fields */ tags: [...new Set(tags)].slice(0, 4) }
```

- [ ] **Step 4: Retain source instructions in generated data**

In `baseRecipe`, add:

```js
instructions: (meal.strInstructions || '').trim(),
```

Run:

```powershell
npm run generate:recipes
```

Expected: `Generated 1024 recipes from ... TheMealDB sources.` and the JSON contains non-empty `instructions` fields where supplied by the source.

- [ ] **Step 5: Verify catalog tests**

Run:

```powershell
npx playwright test tests/domain.spec.ts -g "catalogus|bronrecepten"
```

Expected: PASS.

### Task 4: Persist preferences and replace misleading filtering

**Files:**
- Modify: `E:\MData\projecten\tinder-eten\src\App.tsx`
- Modify: `E:\MData\projecten\tinder-eten\tests\app.spec.ts`

- [ ] **Step 1: Write the end-to-end preference test**

Add a fresh-storage test that opens filters, selects Vegan, excludes peanuts, chooses the High protein preset, applies, reloads, and verifies controls stay selected and every swiped card remains compatible through visible diet badges. Assert the filter badge equals the domain-active constraint count rather than the old hard-coded four.

Use stable labels:

```ts
await page.getByRole('button', { name: /Filters/ }).click()
await page.getByRole('radio', { name: 'Vegan' }).check()
await page.getByRole('checkbox', { name: 'Pinda' }).check()
await page.getByRole('button', { name: 'High protein' }).click()
await page.getByRole('button', { name: /Toon .* gerechten/ }).click()
await expect(page.getByText('Vegan', { exact: true }).first()).toBeVisible()
await page.reload()
await page.getByRole('button', { name: /Filters/ }).click()
await expect(page.getByRole('radio', { name: 'Vegan' })).toBeChecked()
await expect(page.getByRole('checkbox', { name: 'Pinda' })).toBeChecked()
```

- [ ] **Step 2: Confirm the test fails against the existing four sliders**

Run:

```powershell
npx playwright test tests/app.spec.ts -g "eetvoorkeuren"
```

Expected: FAIL because the controls do not exist.

- [ ] **Step 3: Replace separate numeric state with one persisted preference object**

Import diet helpers/types. Replace `maxPrice`, `maxKcal`, `minProtein`, and `maxTime` state with:

```ts
const [preferences, setPreferences] = useState(() => sanitizePreferences(stored('hap:preferences', null)))
useEffect(() => localStorage.setItem('hap:preferences', JSON.stringify(preferences)), [preferences])
const filtered = useMemo(() => filterMeals(meals, preferences), [preferences])
const filterCount = activeFilterCount(preferences)
const changePreference = <K extends keyof DietPreferences>(key: K, value: DietPreferences[K]) =>
  setPreferences((current) => ({ ...current, [key]: value, preset: key === 'preset' ? current.preset : 'custom' }))
```

Show the badge only when `filterCount > 0`, and reset with `defaultPreferences()`.

- [ ] **Step 4: Build accessible preset, diet, allergen, meal-type, and numeric controls**

Use native radio/checkbox inputs for semantic state. Keep the EU-allergen warning permanently visible under allergen controls:

```tsx
<p className="safety-note"><ShieldAlert /> Detectie op basis van receptingredienten. Controleer altijd het volledige recept, verpakkingen en kruisbesmetting.</p>
```

Add a carbohydrate range and wire every range to `preferences`. Presets call `setPreferences((current) => applyPreset(current, id))`.

- [ ] **Step 5: Verify persistence and filtering**

Run:

```powershell
npx playwright test tests/app.spec.ts -g "eetvoorkeuren"
```

Expected: PASS.

### Task 5: Show diet evidence and complete recipe details

**Files:**
- Modify: `E:\MData\projecten\tinder-eten\src\App.tsx`
- Modify: `E:\MData\projecten\tinder-eten\src\styles.css`
- Modify: `E:\MData\projecten\tinder-eten\tests\app.spec.ts`

- [ ] **Step 1: Write a details test**

Open a card's details and assert the dialog contains a diet badge, an "Allergenen gedetecteerd" section (or explicit "Geen ... gedetecteerd"), the safety note, all ingredient rows, and a "Bereiding" section when instructions exist.

- [ ] **Step 2: Confirm the current truncated details fail**

Run:

```powershell
npx playwright test tests/app.spec.ts -g "dieetinformatie"
```

Expected: FAIL because details show at most eight ingredients and no diet/allergen/instruction evidence.

- [ ] **Step 3: Render transparent recipe evidence**

Add label maps for diets, meal types, and allergens. In `MealDetails`:

- render inferred diet badges;
- render detected allergens using `ALLERGENS` labels;
- render the safety warning without claiming safety when no allergen was detected;
- map every ingredient instead of `slice(0, 8)`;
- split source instructions on line breaks or sentence boundaries into readable steps, while preserving the source link;
- label macro and price values as estimates where applicable.

- [ ] **Step 4: Make the details overlay work on every viewport**

Remove the desktop `display: none` restriction from `.detail-overlay`, constrain `.mobile-details` to a readable width on desktop, retain the bottom-sheet presentation below 760px, and keep all content scrollable.

- [ ] **Step 5: Verify the details test and responsive layout**

Run:

```powershell
npx playwright test tests/app.spec.ts -g "dieetinformatie"
```

Expected: PASS.

### Task 6: Fix undo and finish saved-meal details

**Files:**
- Modify: `E:\MData\projecten\tinder-eten\src\App.tsx`
- Modify: `E:\MData\projecten\tinder-eten\tests\app.spec.ts`

- [ ] **Step 1: Write an undo snapshot test**

Capture the first meal title, like it, assert one learned interaction and one saved meal, click `Vorige`, then assert the first title is restored, learning returns to zero, and the saved count returns to zero.

- [ ] **Step 2: Confirm current undo leaves learning/save behind**

Run:

```powershell
npx playwright test tests/app.spec.ts -g "ongedaan"
```

Expected: FAIL on interaction or saved count.

- [ ] **Step 3: Store reversible snapshots**

Replace `string[]` history with:

```ts
type SwipeSnapshot = { mealId: string; profile: TasteProfile; saved: string[]; seen: string[] }
const [history, setHistory] = useState<SwipeSnapshot[]>([])
```

Before each action, push `{ mealId: meal.id, profile, saved, seen }`. On rewind, restore all three snapshots, remove the last history entry, and pin the restored meal as the visible card.

- [ ] **Step 4: Make saved cards open the selected meal**

Store `detailMealId`; derive `detailMeal` from the full catalog. Clicking a saved card opens the details overlay for that exact meal, while the heart-removal button stops propagation.

- [ ] **Step 5: Verify undo and saved details**

Run:

```powershell
npx playwright test tests/app.spec.ts -g "ongedaan|opgeslagen detail"
```

Expected: PASS.

### Task 7: Activate search and keyboard operation

**Files:**
- Modify: `E:\MData\projecten\tinder-eten\src\App.tsx`
- Modify: `E:\MData\projecten\tinder-eten\src\styles.css`
- Modify: `E:\MData\projecten\tinder-eten\tests\app.spec.ts`

- [ ] **Step 1: Write search and keyboard tests**

Search for a known catalog title, select it, verify that exact recipe's details open, press Escape to close, press ArrowRight, and verify the interaction count increases once. Confirm arrow keys do nothing while a text input is focused.

- [ ] **Step 2: Confirm the inactive search button fails**

Run:

```powershell
npx playwright test tests/app.spec.ts -g "zoeken en toetsenbord"
```

Expected: FAIL because clicking Search does nothing.

- [ ] **Step 3: Add local search with no new dependency**

Filter the already-loaded catalog against a normalized concatenation of title, area, category, tags, and ingredient names. Limit visible results to 40. A result opens the full details overlay; an empty query shows helpful popular results and an unmatched query shows a clear empty state.

- [ ] **Step 4: Add global keyboard handling and live announcements**

When no overlay is open and focus is not in `input`, `select`, `textarea`, or a content-editable element:

- ArrowLeft skips;
- ArrowRight likes;
- Escape closes search, filters, or details;
- every action updates a visually hidden `aria-live="polite"` message.

- [ ] **Step 5: Verify search and keyboard behavior**

Run:

```powershell
npx playwright test tests/app.spec.ts -g "zoeken en toetsenbord"
```

Expected: PASS.

### Task 8: Polish the responsive experience and documentation

**Files:**
- Modify: `E:\MData\projecten\tinder-eten\src\styles.css`
- Modify: `E:\MData\projecten\tinder-eten\README.md`
- Modify: `E:\MData\projecten\tinder-eten\tests\app.spec.ts`

- [ ] **Step 1: Add stable responsive screenshot coverage**

Add Playwright screenshots after seeding deterministic preferences for desktop 1440x1000 and mobile 390x844. Disable animations for the screenshots and mask externally loaded recipe images only if network image timing causes nondeterminism.

- [ ] **Step 2: Apply existing visual language to new controls**

Use existing green/cream/coral tokens, rounded cards, and focus rings. Ensure:

- quick presets wrap without horizontal overflow;
- checkboxes and radios have at least 44px hit areas;
- the filter sheet remains usable at 320px;
- diet/allergen badges do not cover card copy;
- search results have visible keyboard focus;
- long ingredients and instructions wrap;
- reduced-motion behavior remains intact.

- [ ] **Step 3: Document behavior and limitations**

Update README with the preference presets, diet/allergen detection, source-instruction support, persistence key, and explicit non-certification warning. Keep the existing startup and integration instructions.

- [ ] **Step 4: Run complete verification**

Run:

```powershell
npm test
npm run build
```

Expected: all tests PASS and Vite build exits 0.

- [ ] **Step 5: Inspect screenshots**

Open the generated desktop and mobile images and verify the new controls, details, focus, wrapping, and navigation without clipping or overlap. Any visual defect found is fixed and both verification commands are rerun.

## Plan self-review

- Spec coverage: diet/allergen inference, safety boundary, presets, persistence, meal types, carbohydrate filter, nutrition parsing, source instructions, search, saved details, undo, keyboard handling, live announcements, responsive inspection, docs, build, and tests are each assigned to a task.
- Scope: the work is one connected local-first foundation release; weekly planning, consolidated shopping, ratings, pantry substitutions, and cloud sync remain explicit later cycles.
- Type consistency: `Allergen`, `Diet`, `MealType`, `GoalPreset`, `DietInfo`, `DietPreferences`, `classifyDiet`, `sanitizePreferences`, `applyPreset`, `filterMeals`, `matchesPreferences`, and `activeFilterCount` are defined once in Task 2 and consumed consistently later.
- Placeholder scan: every implementation step contains concrete code or an exact behavioral contract; no fill-in work remains.
