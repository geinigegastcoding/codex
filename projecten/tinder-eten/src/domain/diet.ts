export const ALLERGENS = [
  ['gluten', 'Gluten'],
  ['crustaceans', 'Schaaldieren'],
  ['eggs', 'Ei'],
  ['fish', 'Vis'],
  ['peanuts', 'Pinda'],
  ['soy', 'Soja'],
  ['milk', 'Melk'],
  ['nuts', 'Noten'],
  ['celery', 'Selderij'],
  ['mustard', 'Mosterd'],
  ['sesame', 'Sesam'],
  ['sulphites', 'Sulfieten'],
  ['lupin', 'Lupine'],
  ['molluscs', 'Weekdieren'],
] as const

export const DIETS = [
  ['all', 'Alles'],
  ['vegetarian', 'Vegetarisch'],
  ['vegan', 'Vegan'],
  ['pescatarian', 'Pescotarisch'],
] as const

export const MEAL_TYPES = ['main', 'breakfast', 'starter', 'side', 'dessert'] as const
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  main: 'Hoofdgerecht', breakfast: 'Ontbijt', starter: 'Voorgerecht', side: 'Bijgerecht', dessert: 'Dessert',
}

export const GOAL_PRESETS = [
  ['balanced', 'Gebalanceerd'],
  ['calorie-conscious', 'Caloriebewust'],
  ['high-protein', 'High protein'],
  ['lower-carb', 'Minder koolhydraten'],
  ['quick', 'Snel klaar'],
  ['budget', 'Budget'],
] as const

export type Allergen = typeof ALLERGENS[number][0]
export type Diet = typeof DIETS[number][0]
export type MealType = typeof MEAL_TYPES[number]
export type Preset = typeof GOAL_PRESETS[number][0]
export type GoalPreset = Preset | 'custom'

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
  excludedIngredients: string[]
  mealTypes: MealType[]
  maxKcal: number
  maxCarbs: number
  maxFat: number
  minProtein: number
  maxTime: number
  maxPrice: number
}

const aliases: Record<Allergen, string[]> = {
  gluten: ['wheat', 'tarwe', 'barley', 'gerst', 'rye', 'rogge', 'oat', 'haver', 'flour', 'bloem', 'bread', 'brood', 'bun', 'breadcrumb', 'pasta', 'spaghetti', 'couscous', 'semolina', 'noodle'],
  crustaceans: ['prawn', 'shrimp', 'garnalen', 'crab', 'krab', 'lobster', 'kreeft', 'crayfish'],
  eggs: ['egg', 'eggs', 'ei', 'eieren', 'mayonnaise', 'mayo'],
  fish: ['fish', 'vis', 'salmon', 'zalm', 'tuna', 'tonijn', 'cod', 'kabeljauw', 'haddock', 'anchovy', 'sardine', 'mackerel', 'trout', 'tilapia'],
  peanuts: ['peanut', 'pinda'],
  soy: ['soy', 'soja', 'tofu', 'tempeh', 'edamame', 'miso'],
  milk: ['milk', 'melk', 'cheese', 'kaas', 'cheddar', 'parmesan', 'feta', 'mozzarella', 'yogurt', 'yoghurt', 'cream', 'room', 'butter', 'boter', 'whey', 'casein', 'ghee'],
  nuts: ['nut', 'noten', 'almond', 'amandel', 'hazelnut', 'walnut', 'cashew', 'pecan', 'pistachio', 'brazil nut', 'macadamia', 'marzipan'],
  celery: ['celery', 'celeriac', 'selderij', 'knolselderij'],
  mustard: ['mustard', 'mosterd'],
  sesame: ['sesame', 'sesam', 'tahini'],
  sulphites: ['wine', 'wijn', 'sherry', 'vermouth', 'cider', 'sulphite', 'sulfite', 'sulfiet'],
  lupin: ['lupin', 'lupine'],
  molluscs: ['mussel', 'mossel', 'oyster', 'oester', 'squid', 'inktvis', 'octopus', 'clam', 'scallop', 'snail', 'slak'],
}

const landMeat = [
  'meat', 'vlees', 'chicken', 'kip', 'beef', 'rund', 'steak', 'pork', 'varken', 'lamb', 'lam',
  'turkey', 'kalkoen', 'bacon', 'spek', 'ham', 'sausage', 'worst', 'duck', 'eend', 'goat', 'geit',
  'veal', 'kalf', 'venison', 'lard',
]
const animalExtras = ['honey', 'honing', 'gelatin', 'gelatine']
const alternativeFlours = /\b(almond|amandel|rice|rijst|corn|mais|chickpea|kikkererwt|coconut|kokos|lupin|lupine)\s+flour\b/

const normalize = (value: string) => value.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const hasTerm = (value: string, terms: string[]) => terms.some((term) => {
  const words = normalize(term).split(' ').map(escapeRegExp).join('\\s+')
  return new RegExp(`(^|\\s)${words}(?:s|es)?($|\\s)`).test(value)
})

export function mealTypeFor(category: string): MealType {
  const value = normalize(category)
  if (value.includes('dessert')) return 'dessert'
  if (value.includes('breakfast') || value.includes('ontbijt')) return 'breakfast'
  if (value.includes('starter') || value.includes('voorgerecht')) return 'starter'
  if (value.includes('side') || value.includes('bijgerecht')) return 'side'
  return 'main'
}

export function classifyDiet(category: string, ingredients: Array<{ name: string }>): DietInfo {
  const names = ingredients.map(({ name }) => normalize(name))
  const allergens = ALLERGENS.flatMap(([id]) => {
    const detected = names.some((name) => {
      if (id === 'gluten' && (/\b(rice|rijst)\s+noodles?\b/.test(name) || /\bgluten\s+free\b/.test(name) || alternativeFlours.test(name))) return false
      if (id === 'milk' && (/\b(peanut|pinda|almond|amandel|cashew|nut)\s+butter\b/.test(name) || /\b(coconut|kokos|soy|soja|oat|haver|rice|rijst|almond|amandel)\s+milk\b/.test(name))) return false
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
    dietary: {
      vegetarian: !hasLandMeat && !hasSeafood,
      vegan: !hasLandMeat && !hasSeafood && !hasAnimalExtra,
      pescatarian: !hasLandMeat,
    },
    mealType: mealTypeFor(category),
  }
}

export const defaultPreferences = (): DietPreferences => ({
  version: 1,
  preset: 'balanced',
  diet: 'all',
  excludedAllergens: [],
  excludedIngredients: [],
  mealTypes: [...MEAL_TYPES],
  maxKcal: 1000,
  maxCarbs: 200,
  maxFat: 120,
  minProtein: 0,
  maxTime: 60,
  maxPrice: 12,
})

const presetLimits: Record<Preset, Partial<DietPreferences>> = {
  balanced: {},
  'calorie-conscious': { maxKcal: 600, minProtein: 20 },
  'high-protein': { minProtein: 30 },
  'lower-carb': { maxCarbs: 45 },
  quick: { maxTime: 25 },
  budget: { maxPrice: 5 },
}

const limitsFrom = ({ maxKcal, maxCarbs, maxFat, minProtein, maxTime, maxPrice }: DietPreferences) => ({
  maxKcal, maxCarbs, maxFat, minProtein, maxTime, maxPrice,
})

export function applyPreset(current: DietPreferences, preset: Preset): DietPreferences {
  return { ...current, ...limitsFrom(defaultPreferences()), ...presetLimits[preset], preset }
}

const goalPresets: GoalPreset[] = [...GOAL_PRESETS.map(([id]) => id), 'custom']
const numberIn = (value: unknown, fallback: number, min: number, max: number) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback
const uniqueValid = <T extends string>(value: unknown, valid: readonly T[]) => Array.isArray(value)
  ? [...new Set(value.filter((item): item is T => typeof item === 'string' && valid.includes(item as T)))]
  : null
const ingredientTerms = (value: unknown) => {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const terms: string[] = []
  for (const candidate of value) {
    if (typeof candidate !== 'string') continue
    const term = candidate.trim().replace(/\s+/g, ' ').slice(0, 60)
    const key = normalize(term)
    if (!key || seen.has(key)) continue
    seen.add(key); terms.push(term)
    if (terms.length === 20) break
  }
  return terms
}

export function sanitizePreferences(value: unknown): DietPreferences {
  const fallback = defaultPreferences()
  if (!value || typeof value !== 'object') return fallback
  const input = value as Record<string, unknown>
  const excludedAllergens = uniqueValid(input.excludedAllergens, ALLERGENS.map(([id]) => id))
  const mealTypes = uniqueValid(input.mealTypes, MEAL_TYPES)

  return {
    version: 1,
    preset: goalPresets.includes(input.preset as GoalPreset) ? input.preset as GoalPreset : fallback.preset,
    diet: DIETS.some(([id]) => id === input.diet) ? input.diet as Diet : fallback.diet,
    excludedAllergens: excludedAllergens ?? fallback.excludedAllergens,
    excludedIngredients: ingredientTerms(input.excludedIngredients),
    mealTypes: mealTypes ?? fallback.mealTypes,
    maxKcal: numberIn(input.maxKcal, fallback.maxKcal, 250, 1500),
    maxCarbs: numberIn(input.maxCarbs, fallback.maxCarbs, 10, 250),
    maxFat: numberIn(input.maxFat, fallback.maxFat, 0, 250),
    minProtein: numberIn(input.minProtein, fallback.minProtein, 0, 80),
    maxTime: numberIn(input.maxTime, fallback.maxTime, 10, 180),
    maxPrice: numberIn(input.maxPrice, fallback.maxPrice, 2, 30),
  }
}

export type PreferenceMeal = DietInfo & {
  ingredients: Array<{ name: string }>
  kcal: number
  carbs: number
  fat: number
  protein: number
  time: number
  estimatedPrice: number
}

export function matchesPreferences(meal: PreferenceMeal, preferences: DietPreferences) {
  const dietMatches = preferences.diet === 'all'
    || (preferences.diet === 'vegetarian' && meal.dietary.vegetarian)
    || (preferences.diet === 'vegan' && meal.dietary.vegan)
    || (preferences.diet === 'pescatarian' && meal.dietary.pescatarian)

  return dietMatches
    && !meal.allergens.some((allergen) => preferences.excludedAllergens.includes(allergen))
    && !meal.ingredients.some(({ name }) => preferences.excludedIngredients.some((term) => hasTerm(normalize(name), [term])))
    && preferences.mealTypes.includes(meal.mealType)
    && meal.kcal <= preferences.maxKcal
    && meal.carbs <= preferences.maxCarbs
    && meal.fat <= preferences.maxFat
    && meal.protein >= preferences.minProtein
    && meal.time <= preferences.maxTime
    && meal.estimatedPrice <= preferences.maxPrice
}

export const filterMeals = <T extends PreferenceMeal>(meals: T[], preferences: DietPreferences) =>
  meals.filter((meal) => matchesPreferences(meal, preferences))

export function activeFilterCount(value: DietPreferences) {
  const defaults = defaultPreferences()
  const mealTypesChanged = value.mealTypes.length !== defaults.mealTypes.length
    || value.mealTypes.some((type) => !defaults.mealTypes.includes(type))
  return Number(value.diet !== defaults.diet)
    + value.excludedAllergens.length
    + value.excludedIngredients.length
    + Number(mealTypesChanged)
    + Number(value.maxKcal !== defaults.maxKcal)
    + Number(value.maxCarbs !== defaults.maxCarbs)
    + Number(value.maxFat !== defaults.maxFat)
    + Number(value.minProtein !== defaults.minProtein)
    + Number(value.maxTime !== defaults.maxTime)
    + Number(value.maxPrice !== defaults.maxPrice)
}
