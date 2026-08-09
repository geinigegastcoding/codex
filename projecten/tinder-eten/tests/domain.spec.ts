import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { calculateNutrition, estimateGrams } from '../src/domain/nutrition'
import { createTasteProfile, rankMeals, updateTasteProfile } from '../src/domain/taste'
import { buildCartPayload, buildPriceUrl } from '../src/domain/integrations'
import { buildMeal } from '../src/domain/catalog'
import {
  activeFilterCount, applyPreset, classifyDiet, defaultPreferences, filterMeals, matchesPreferences,
  mealTypeFor, sanitizePreferences,
} from '../src/domain/diet'
import {
  addCustomItem, aggregateShoppingItems, categoryForIngredient, removeCustomItem, sanitizeShoppingState,
  scaleAmount, shoppingCartIngredients, togglePantryItem, upsertSelection,
} from '../src/domain/shopping'
import {
  removePlannerEntry, sanitizePlannerState, selectDiverseMeals, shiftWeek, startOfWeek, upsertPlannerEntry, weekDates,
} from '../src/domain/planner'
import {
  EU_REFERENCE_GOALS, addTrackerEntry, dailyTotals, recentDateRange, removeTrackerEntry,
  recentTrackerEntries, rescaleRecipeEntry, sanitizeTrackerState, scaleMealNutrition,
  selectMealsWithinRemainingEnergy, shiftTrackerDate, trackerEntriesCsv, trackerPeriodSummary,
} from '../src/domain/tracker'
import { createHapBackup, parseHapBackup, sanitizeSaved, sanitizeTasteProfile } from '../src/domain/backup'

const recipes = JSON.parse(readFileSync(new URL('../src/data/recipes.generated.json', import.meta.url), 'utf8')) as Array<{ id: string; sourceUrl: string; sourceName: string; instructionId?: string; instructions?: string }>

test('macro’s worden uit echte ingrediëntgewichten berekend', () => {
  const nutrition = calculateNutrition([
    { name: 'chicken breast', grams: 200 },
    { name: 'cooked rice', grams: 150 },
    { name: 'olive oil', grams: 10 },
  ])

  expect(nutrition.kcal).toBe(613)
  expect(nutrition.protein).toBe(66)
  expect(nutrition.carbs).toBe(42)
  expect(nutrition.fat).toBe(18)
  expect(nutrition.coverage).toBe(100)
})

test('verpakkingsgewichten en Unicode-breuken worden niet onderschat', () => {
  expect(estimateGrams('1 (400g) tin', 'chopped tomatoes')).toBe(400)
  expect(estimateGrams('175g/6oz', 'plain flour')).toBe(175)
  expect(estimateGrams('2½ oz', 'butter')).toBe(71)
  expect(estimateGrams('½ tsp', 'salt')).toBe(3)
})

test('alle 14 EU-allergenen worden uit receptingrediënten gedetecteerd', () => {
  const info = classifyDiet('Seafood', [
    { name: 'Wheat flour' }, { name: 'Prawns' }, { name: 'Egg' }, { name: 'Salmon' },
    { name: 'Peanuts' }, { name: 'Tofu' }, { name: 'Cheddar cheese' }, { name: 'Almonds' },
    { name: 'Celery' }, { name: 'Mustard' }, { name: 'Sesame' }, { name: 'Red wine' },
    { name: 'Lupin' }, { name: 'Mussels' },
  ])

  expect(info.allergens).toEqual([
    'gluten', 'crustaceans', 'eggs', 'fish', 'peanuts', 'soy', 'milk', 'nuts',
    'celery', 'mustard', 'sesame', 'sulphites', 'lupin', 'molluscs',
  ])
})

test('rijstnoedels blijven glutenvrij gedetecteerd en vis past alleen bij pescotarisch', () => {
  const info = classifyDiet('Seafood', [
    { name: 'Rice noodles' }, { name: 'Prawns' }, { name: 'Soy sauce' },
    { name: 'Sesame oil' }, { name: 'Peanut butter' }, { name: 'Egg' },
  ])

  expect(info.allergens).toEqual(['crustaceans', 'eggs', 'peanuts', 'soy', 'sesame'])
  expect(info.dietary).toEqual({ vegetarian: false, vegan: false, pescatarian: true })
})

test('plantaardige en vegetarische grenzen blijven conservatief', () => {
  expect(classifyDiet('Vegan', [{ name: 'Tofu' }, { name: 'Broccoli' }]).dietary.vegan).toBe(true)
  expect(classifyDiet('Vegetarian', [{ name: 'Egg' }, { name: 'Cheddar cheese' }]).dietary)
    .toEqual({ vegetarian: true, vegan: false, pescatarian: true })
  expect(classifyDiet('Chicken', [{ name: 'Chicken breast' }]).dietary.pescatarian).toBe(false)
  expect(['Dessert', 'Breakfast', 'Starter', 'Side', 'Chicken'].map(mealTypeFor))
    .toEqual(['dessert', 'breakfast', 'starter', 'side', 'main'])
})

test('voorkeuren worden gesaneerd, gecombineerd en eerlijk geteld', () => {
  const preferences = sanitizePreferences({
    version: 99, preset: 'custom', diet: 'vegan', excludedAllergens: ['peanuts', 'invalid', 'peanuts'],
    excludedIngredients: [' Mushroom ', 'mushroom', '', 4], mealTypes: ['main', 'main', 'invalid'],
    maxKcal: 600, maxCarbs: 45, maxFat: 25, minProtein: 20, maxTime: 30, maxPrice: 7,
  })

  expect(preferences.excludedAllergens).toEqual(['peanuts'])
  expect(preferences.excludedIngredients).toEqual(['Mushroom'])
  expect(preferences.mealTypes).toEqual(['main'])
  expect(activeFilterCount(preferences)).toBe(10)
  expect(matchesPreferences({
    dietary: { vegetarian: true, vegan: true, pescatarian: true }, allergens: [], mealType: 'main',
    ingredients: [{ name: 'Spinach' }], kcal: 550, carbs: 40, fat: 20, protein: 25, time: 25, estimatedPrice: 6,
  }, preferences)).toBe(true)
  expect(matchesPreferences({
    dietary: { vegetarian: true, vegan: true, pescatarian: true }, allergens: ['peanuts'], mealType: 'main',
    ingredients: [{ name: 'Spinach' }], kcal: 550, carbs: 40, fat: 20, protein: 25, time: 25, estimatedPrice: 6,
  }, preferences)).toBe(false)
  expect(matchesPreferences({
    dietary: { vegetarian: true, vegan: true, pescatarian: true }, allergens: [], mealType: 'main',
    ingredients: [{ name: 'Wild mushrooms' }], kcal: 550, carbs: 40, fat: 20, protein: 25, time: 25, estimatedPrice: 6,
  }, preferences)).toBe(false)
  expect(matchesPreferences({
    dietary: { vegetarian: true, vegan: true, pescatarian: true }, allergens: [], mealType: 'main',
    ingredients: [{ name: 'Spinach' }], kcal: 550, carbs: 40, fat: 30, protein: 25, time: 25, estimatedPrice: 6,
  }, preferences)).toBe(false)
  expect(filterMeals([{
    id: 'match', dietary: { vegetarian: true, vegan: true, pescatarian: true }, allergens: [], mealType: 'main',
    ingredients: [{ name: 'Spinach' }], kcal: 550, carbs: 40, fat: 20, protein: 25, time: 25, estimatedPrice: 6,
  }, {
    id: 'allergen', dietary: { vegetarian: true, vegan: true, pescatarian: true }, allergens: ['peanuts'], mealType: 'main',
    ingredients: [{ name: 'Spinach' }], kcal: 550, carbs: 40, fat: 20, protein: 25, time: 25, estimatedPrice: 6,
  }], preferences).map((meal) => meal.id)).toEqual(['match'])
})

test('doelpresets veranderen alleen transparante maaltijdlimieten', () => {
  const current = { ...defaultPreferences(), diet: 'vegetarian' as const, excludedAllergens: ['milk' as const], excludedIngredients: ['Mushroom'] }
  const highProtein = applyPreset(current, 'high-protein')
  expect(highProtein).toMatchObject({ preset: 'high-protein', diet: 'vegetarian', excludedAllergens: ['milk'], excludedIngredients: ['Mushroom'], minProtein: 30 })
  expect(applyPreset(highProtein, 'balanced')).toMatchObject({ minProtein: 0, maxKcal: 1000, maxFat: 120, diet: 'vegetarian', excludedAllergens: ['milk'], excludedIngredients: ['Mushroom'] })
})

test('porties schalen breuken en bewaren verpakkingsgroottes', () => {
  expect(scaleAmount('500g', .5)).toBe('250g')
  expect(scaleAmount('1/2 cup', 2)).toBe('1 cup')
  expect(scaleAmount('1 1/2 tbsp', .5)).toBe('3/4 tbsp')
  expect(scaleAmount('1 (400g) tin', .5)).toBe('1/2 (400g) tin')
  expect(scaleAmount('pinch', 3)).toBe('pinch')
})

test('boodschappenstaat wordt begrensd en per recept ontdubbeld', () => {
  const state = sanitizeShoppingState({
    version: 9,
    selections: [{ mealId: 'a', servings: 0 }, { mealId: 'a', servings: 20 }, { mealId: 'missing', servings: 4 }],
    checked: ['tomaten', 'tomaten', 3],
  }, new Set(['a']))

  expect(state).toEqual({ version: 2, selections: [{ mealId: 'a', servings: 12 }], checked: ['tomaten'], custom: [], pantry: [] })
  expect(upsertSelection(state, { mealId: 'a', servings: 3 }).selections).toEqual([{ mealId: 'a', servings: 3 }])
})

test('ingrediënten worden transparant gegroepeerd voor een gecombineerde lijst', () => {
  const items = aggregateShoppingItems([
    { id: 'a', title: 'A', servings: 4, ingredients: [{ name: 'Tomatoes', amount: '400g', totalGrams: 400 }] },
    { id: 'b', title: 'B', servings: 2, ingredients: [{ name: 'Chopped tomatoes', amount: '1 tin', totalGrams: 400 }] },
  ], [{ mealId: 'a', servings: 2 }, { mealId: 'b', servings: 2 }])

  expect(items).toEqual([{ key: 'tomaten', name: 'tomaten', estimatedGrams: 600, contributions: [
    { mealId: 'a', mealTitle: 'A', amount: '200g' },
    { mealId: 'b', mealTitle: 'B', amount: '1 tin' },
  ] }])
  expect(shoppingCartIngredients(items, [])).toEqual([{ name: 'tomaten', amount: '200g + 1 tin' }])
  expect(shoppingCartIngredients(items, ['tomaten'])).toEqual([])
})

test('handmatige boodschappen groeperen met recepten en voorraad blijft uit de winkelwagen', () => {
  let state = sanitizeShoppingState({
    version: 2, selections: [], checked: [], pantry: ['tomaten', 'tomaten', 4],
    custom: [{ id: 'custom-1', name: ' Tomatoes ', amount: '2 extra' }, { id: '', name: 'fout' }],
  }, new Set())
  state = addCustomItem(state, { id: 'custom-2', name: 'Bananen', amount: '6 stuks' })
  state = togglePantryItem(state, 'bananen')

  const items = aggregateShoppingItems([{
    id: 'a', title: 'Pasta', servings: 2, ingredients: [{ name: 'Tomatoes', amount: '400g', totalGrams: 400 }],
  }], [{ mealId: 'a', servings: 2 }], state.custom)

  expect(items.find(({ key }) => key === 'tomaten')?.contributions).toEqual([
    { mealId: 'a', mealTitle: 'Pasta', amount: '400g' },
    { mealId: 'custom-1', mealTitle: 'Handmatig', amount: '2 extra' },
  ])
  expect(categoryForIngredient('tomaten')).toBe('produce')
  expect(categoryForIngredient('Griekse yoghurt')).toBe('dairy')
  expect(categoryForIngredient('rijst')).toBe('pantry')
  expect(shoppingCartIngredients(items, [], state.pantry)).toEqual([])
  expect(removeCustomItem(state, 'custom-2').custom).toHaveLength(1)
})

test('weekplanning begint op maandag en schuift zonder datumverlies', () => {
  expect(startOfWeek(new Date(2026, 7, 9))).toBe('2026-08-03')
  expect(weekDates('2026-08-03')).toEqual([
    '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07', '2026-08-08', '2026-08-09',
  ])
  expect(shiftWeek('2026-08-03', 1)).toBe('2026-08-10')
  expect(shiftWeek('2026-08-03', -1)).toBe('2026-07-27')
})

test('plannerstaat bewaart één begrensd recept per geldige dag', () => {
  const state = sanitizePlannerState({
    version: 8,
    entries: [
      { date: '2026-08-03', mealId: 'a', servings: 0 },
      { date: '2026-08-03', mealId: 'b', servings: 20 },
      { date: 'geen-datum', mealId: 'a', servings: 4 },
      { date: '2026-08-04', mealId: 'missing', servings: 4 },
    ],
  }, new Set(['a', 'b']))

  expect(state).toEqual({ version: 1, entries: [{ date: '2026-08-03', mealId: 'b', servings: 12 }] })
  const added = upsertPlannerEntry(state, { date: '2026-08-04', mealId: 'a', servings: 3 })
  expect(added.entries).toHaveLength(2)
  expect(removePlannerEntry(added, '2026-08-03').entries).toEqual([{ date: '2026-08-04', mealId: 'a', servings: 3 }])
})

test('automatische planning kiest eerst verschillende bronnen en keukens', () => {
  const ranked = [
    { id: 'a', area: 'Italian', category: 'Pasta', sourceUrl: 'bron-1' },
    { id: 'a-variant', area: 'Italian', category: 'Pasta', sourceUrl: 'bron-1' },
    { id: 'b', area: 'Italian', category: 'Pasta', sourceUrl: 'bron-2' },
    { id: 'c', area: 'Japanese', category: 'Seafood', sourceUrl: 'bron-3' },
    { id: 'd', area: 'Mexican', category: 'Chicken', sourceUrl: 'bron-4' },
  ]

  expect(selectDiverseMeals(ranked, 3, new Set()).map(({ id }) => id)).toEqual(['a', 'c', 'd'])
  expect(selectDiverseMeals(ranked, 2, new Set(['a'])).map(({ id }) => id)).toEqual(['c', 'd'])

  const repeatedStyle = [
    { id: 'a-variant-1', title: 'Snelle A', area: 'Italian', category: 'Pasta', sourceUrl: 'a' },
    { id: 'b-variant-2', title: 'Snelle B', area: 'Japanese', category: 'Seafood', sourceUrl: 'b' },
    { id: 'c', title: 'Origineel C', area: 'Mexican', category: 'Chicken', sourceUrl: 'c' },
    { id: 'd', title: 'Origineel D', area: 'Greek', category: 'Vegetarian', sourceUrl: 'd' },
  ]
  expect(selectDiverseMeals(repeatedStyle, 3, new Set()).map(({ id }) => id)).toEqual(['a-variant-1', 'c', 'd'])
})

test('voedingslog start met herkenbare EU-referenties en saneert invoer', () => {
  expect(EU_REFERENCE_GOALS).toEqual({ kcal: 2000, protein: 50, carbs: 260, fat: 70 })
  const state = sanitizeTrackerState({
    version: 9,
    goals: { kcal: -10, protein: 120, carbs: 'fout', fat: 80 },
    entries: [
      { id: 'a', date: '2026-08-09', name: 'Ontbijt', mealType: 'breakfast', source: 'manual', portions: .1, kcal: 450, protein: 25, carbs: 60, fat: 12 },
      { id: 'bad', date: 'geen-datum', name: 'Fout', kcal: 10 },
    ],
  })

  expect(state.goals).toEqual({ kcal: 2000, protein: 120, carbs: 260, fat: 80 })
  expect(state.entries).toEqual([expect.objectContaining({ id: 'a', portions: .25, kcal: 450 })])
})

test('receptporties schalen alle macro’s en dagtotalen blijven historisch vast', () => {
  const nutrition = scaleMealNutrition({ kcal: 515, protein: 43, carbs: 38, fat: 19 }, 1.5)
  expect(nutrition).toEqual({ kcal: 773, protein: 64.5, carbs: 57, fat: 28.5 })
  let state = sanitizeTrackerState(null)
  state = addTrackerEntry(state, { id: 'a', date: '2026-08-08', name: 'A', mealType: 'dinner', source: 'recipe', mealId: 'meal-a', portions: 1.5, ...nutrition })
  state = addTrackerEntry(state, { id: 'b', date: '2026-08-08', name: 'B', mealType: 'snack', source: 'manual', portions: 1, kcal: 200, protein: 4, carbs: 22, fat: 10 })

  expect(dailyTotals(state.entries, '2026-08-08')).toEqual({ kcal: 973, protein: 68.5, carbs: 79, fat: 38.5 })
  expect(recentDateRange('2026-08-09', 3)).toEqual(['2026-08-07', '2026-08-08', '2026-08-09'])
  expect(shiftTrackerDate('2026-08-09', -1)).toBe('2026-08-08')
  expect(removeTrackerEntry(state, 'a').entries.map(({ id }) => id)).toEqual(['b'])
})

test('voedingslogregels kunnen historisch veilig worden geschaald en herhaald', () => {
  const recipe = sanitizeTrackerState({ entries: [
    { id: 'recept', date: '2026-08-07', name: 'Pasta', mealType: 'dinner', source: 'recipe', mealId: 'pasta', portions: 1.5, kcal: 750, protein: 30, carbs: 90, fat: 24 },
  ] }).entries[0]
  expect(rescaleRecipeEntry(recipe, .5)).toMatchObject({ portions: .5, kcal: 250, protein: 10, carbs: 30, fat: 8 })

  const recent = recentTrackerEntries([
    { ...recipe, id: 'oud', date: '2026-08-06' },
    { ...recipe, id: 'nieuw', date: '2026-08-08' },
    { ...recipe, id: 'snack', date: '2026-08-08', source: 'manual', mealId: undefined, name: 'Kwark' },
  ], '2026-08-09', 5)
  expect(recent.map(({ id }) => id)).toEqual(['snack', 'nieuw'])
})

test('dertig-dageninzichten behandelen ontbrekende dagen niet als nul', () => {
  const entries = sanitizeTrackerState({ entries: [
    { id: 'a', date: '2026-08-01', name: 'A', mealType: 'breakfast', source: 'manual', portions: 1, kcal: 400, protein: 20, carbs: 40, fat: 10 },
    { id: 'b', date: '2026-08-09', name: 'B', mealType: 'dinner', source: 'manual', portions: 1, kcal: 600, protein: 40, carbs: 60, fat: 20 },
    { id: 'te-oud', date: '2026-06-01', name: 'Oud', mealType: 'dinner', source: 'manual', portions: 1, kcal: 2000, protein: 100, carbs: 200, fat: 80 },
  ] }).entries
  expect(trackerPeriodSummary(entries, '2026-08-09', 30)).toEqual({
    days: 30, loggedDays: 2, average: { kcal: 500, protein: 30, carbs: 50, fat: 15 },
  })
})

test('receptsuggesties blijven onder de resterende energie en behouden smaakvolgorde', () => {
  const ranked = [
    { id: 'te-groot', kcal: 700 },
    { id: 'beste-passend', kcal: 500 },
    { id: 'beste-passend', kcal: 500 },
    { id: 'ook-passend', kcal: 300 },
  ]
  const totals = { kcal: 1400, protein: 30, carbs: 100, fat: 40 }
  expect(selectMealsWithinRemainingEnergy(ranked, totals, { kcal: 2000, protein: 50, carbs: 260, fat: 70 }, 3).map(({ id }) => id))
    .toEqual(['beste-passend', 'ook-passend'])
  expect(selectMealsWithinRemainingEnergy(ranked, totals, EU_REFERENCE_GOALS, 3, new Set(['beste-passend'])).map(({ id }) => id))
    .toEqual(['ook-passend'])
  expect(selectMealsWithinRemainingEnergy(ranked, { ...totals, kcal: 2000 }, EU_REFERENCE_GOALS, 3)).toEqual([])
})

test('CSV-export quote velden en neutraliseert spreadsheetformules', () => {
  const entries = sanitizeTrackerState({ entries: [
    { id: 'veilig', date: '2026-08-09', name: '=HYPERLINK("https://fout")', mealType: 'snack', source: 'manual', portions: 1, kcal: 100, protein: 2, carbs: 20, fat: 1 },
  ] }).entries
  const csv = trackerEntriesCsv(entries)
  expect(csv).toContain('Datum;Maaltijdtype;Naam;Bron;Recept-id;Porties;Calorieën (kcal);Eiwit (g);Koolhydraten (g);Vet (g)')
  expect(csv).toContain('"\'=HYPERLINK(""https://fout"")"')
  expect(csv.startsWith('\uFEFF')).toBe(true)
})

test('lokale back-up maakt een gesaneerde volledige roundtrip', () => {
  const validIds = new Set(['meal-a'])
  const backup = createHapBackup({
    saved: ['meal-a', 'missing'], taste: { interactions: 3, weights: { 'area:Italian': 1.2, fout: Number.NaN } },
    preferences: { ...defaultPreferences(), excludedIngredients: ['Mushroom'], maxFat: 35 }, shopping: sanitizeShoppingState({ selections: [{ mealId: 'meal-a', servings: 4 }] }, validIds),
    planner: sanitizePlannerState({ entries: [{ date: '2026-08-09', mealId: 'meal-a', servings: 4 }] }, validIds),
    tracker: sanitizeTrackerState({ entries: [{ id: 'log-a', date: '2026-08-09', name: 'A', source: 'manual', mealType: 'dinner', portions: 1, kcal: 400, protein: 20, carbs: 40, fat: 12 }] }),
  }, '2026-08-09T10:00:00.000Z')
  const restored = parseHapBackup(JSON.stringify(backup), validIds)

  expect(backup).toMatchObject({ app: 'Hap', version: 1, createdAt: '2026-08-09T10:00:00.000Z' })
  expect(restored.saved).toEqual(['meal-a'])
  expect(restored.taste).toEqual({ interactions: 3, weights: { 'area:Italian': 1.2 } })
  expect(restored.preferences).toMatchObject({ excludedIngredients: ['Mushroom'], maxFat: 35 })
  expect(restored.shopping.selections).toEqual([{ mealId: 'meal-a', servings: 4 }])
  expect(restored.planner.entries).toHaveLength(1)
  expect(restored.tracker.entries).toHaveLength(1)
})

test('beschadigde lokale profielen en niet-Hap-bestanden falen veilig', () => {
  expect(sanitizeSaved(['a', 'a', 4], new Set(['a']))).toEqual(['a'])
  expect(sanitizeTasteProfile({ interactions: -5, weights: { ok: 2, teHoog: 500, tekst: 'nee' } })).toEqual({ interactions: 0, weights: { ok: 2, teHoog: 50 } })
  expect(() => parseHapBackup('{"app":"Iets anders","version":1}', new Set())).toThrow(/geen geldige Hap-back-up/i)
  expect(() => parseHapBackup('{kapot', new Set())).toThrow(/niet worden gelezen/i)
})

test('de lokale catalogus bevat minstens duizend herleidbare recepten', () => {
  expect(recipes.length).toBeGreaterThanOrEqual(1000)
  expect(recipes.every((recipe) => recipe.sourceUrl && recipe.sourceName)).toBe(true)
  expect(new Set(recipes.map((recipe) => recipe.id)).size).toBe(recipes.length)
})

test('kookinstructies staan in een herbruikbare luie databron', () => {
  const instructions = JSON.parse(readFileSync(new URL('../src/data/instructions.generated.json', import.meta.url), 'utf8')) as Record<string, string>
  expect(Object.keys(instructions).length).toBeGreaterThan(700)
  expect(recipes.every((recipe) => recipe.instructionId && instructions[recipe.instructionId])).toBe(true)
  expect(recipes.every((recipe) => !recipe.instructions)).toBe(true)
})

test('positieve swipes laten vergelijkbare gerechten hoger ranken', () => {
  const liked = { id: 'liked', area: 'Italian', category: 'Pasta', tags: ['high-protein'], protein: 42, time: 20 }
  const similar = { id: 'similar', area: 'Italian', category: 'Pasta', tags: ['high-protein'], protein: 38, time: 24 }
  const different = { id: 'different', area: 'Japanese', category: 'Dessert', tags: ['sweet'], protein: 4, time: 70 }
  let profile = createTasteProfile()
  for (let i = 0; i < 5; i++) profile = updateTasteProfile(profile, liked, 'like')

  expect(rankMeals([different, similar], profile)[0].id).toBe('similar')
  expect(profile.interactions).toBe(5)
})

test('Jumbo-integraties maken veilige prijs- en cartrequests', () => {
  expect(buildPriceUrl('chicken breast')).toBe('/api/prices?q=kipfilet&retailer=jumbo')
  expect(buildCartPayload([{ name: 'kipfilet', amount: '250 g' }, { name: 'rijst', amount: '150 g' }])).toEqual({
    shopping_list: '250 g kipfilet\n150 g rijst',
    locale: 'nl-NL',
  })
})

test('de lokale prijsroute levert actuele Jumbo-producten', async ({ request }) => {
  const response = await request.get('/api/prices?q=kipfilet&retailer=jumbo')
  expect(response.ok()).toBe(true)
  const data = await response.json()
  expect(data.results.length).toBeGreaterThan(0)
  expect(data.results[0].product_url).toContain('jumbo.com')
})

test('bronrecepten krijgen portiegewichten en berekende macro’s', () => {
  const meal = buildMeal({
    id: 'recipe-1', title: 'Chicken rice', subtitle: '', area: 'Asian', category: 'Chicken', image: '',
    sourceUrl: 'https://example.com', sourceName: 'Test', servings: 1, tags: [], time: 20, popularity: 90, accent: '#fff',
    instructionId: 'mealdb-test',
    ingredients: [{ name: 'chicken breast', amount: '200 g' }, { name: 'cooked rice', amount: '150 g' }],
  })
  expect(meal.kcal).toBe(525)
  expect(meal.ingredients[0].grams).toBe(200)
  expect(meal.nutritionCoverage).toBe(100)
  expect(meal.estimatedPrice).toBeGreaterThan(0)
  expect(meal.instructionId).toBe('mealdb-test')
  expect(meal.mealType).toBe('main')
  expect(meal.dietary).toEqual({ vegetarian: false, vegan: false, pescatarian: false })
  expect(meal.allergens).toEqual([])
  expect(meal.tags).toContain('high-protein')
})
