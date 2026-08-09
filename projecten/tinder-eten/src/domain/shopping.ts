import { toDutchIngredient, type CartIngredient } from './integrations'

export type ShoppingSelection = { mealId: string; servings: number }
export type CustomShoppingItem = { id: string; name: string; amount: string }
export type ShoppingState = { version: 2; selections: ShoppingSelection[]; checked: string[]; custom: CustomShoppingItem[]; pantry: string[] }
export type ShoppingMeal = {
  id: string
  title: string
  servings: number
  ingredients: Array<{ name: string; amount: string; totalGrams: number }>
}
export type ShoppingContribution = { mealId: string; mealTitle: string; amount: string }
export type ShoppingItem = {
  key: string
  name: string
  estimatedGrams: number
  contributions: ShoppingContribution[]
}

export type ShoppingCategory = 'produce' | 'bakery' | 'dairy' | 'protein' | 'pantry' | 'spices' | 'other'

export const emptyShoppingState = (): ShoppingState => ({ version: 2, selections: [], checked: [], custom: [], pantry: [] })

const unicodeFractions: Record<string, string> = {
  '¼': '1/4', '½': '1/2', '¾': '3/4', '⅓': '1/3', '⅔': '2/3',
  '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8',
}
const quantityPattern = /(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)/g

function parseQuantity(value: string) {
  const normalized = value.trim().replace(',', '.')
  const mixed = normalized.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3])
  const fraction = normalized.match(/^(\d+)\/(\d+)$/)
  if (fraction) return Number(fraction[1]) / Number(fraction[2])
  return Number(normalized)
}

function greatestCommonDivisor(a: number, b: number): number {
  return b ? greatestCommonDivisor(b, a % b) : a
}

function formatQuantity(value: number) {
  const eighths = Math.round(value * 8)
  if (eighths === 0 && value > 0) return value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
  const whole = Math.floor(eighths / 8)
  const remainder = eighths % 8
  if (!remainder) return String(whole)
  const divisor = greatestCommonDivisor(remainder, 8)
  const fraction = `${remainder / divisor}/${8 / divisor}`
  return whole ? `${whole} ${fraction}` : fraction
}

export function scaleAmount(amount: string, factor: number) {
  if (!Number.isFinite(factor) || factor <= 0 || factor === 1) return amount
  const normalized = Object.entries(unicodeFractions).reduce((value, [fraction, replacement]) => value.replaceAll(fraction, replacement), amount)
  const packageMeasure = normalized.match(new RegExp(`^(\\s*)${quantityPattern.source}(\\s*(?:\\([^)]*(?:kg|g|ml|l|oz|lb)[^)]*\\)|[x×]\\s*\\d)[\\s\\S]*)$`, 'i'))
  if (packageMeasure) return `${packageMeasure[1]}${formatQuantity(parseQuantity(packageMeasure[2]) * factor)}${packageMeasure[3]}`
  return normalized.replace(quantityPattern, (quantity) => formatQuantity(parseQuantity(quantity) * factor))
}

const clampServings = (value: unknown) => typeof value === 'number' && Number.isFinite(value)
  ? Math.min(12, Math.max(1, Math.round(value)))
  : 1

const normalizeKey = (value: string) => value.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

export function sanitizeShoppingState(value: unknown, validMealIds: Set<string>): ShoppingState {
  if (!value || typeof value !== 'object') return emptyShoppingState()
  const input = value as Record<string, unknown>
  const selections = new Map<string, ShoppingSelection>()
  if (Array.isArray(input.selections)) for (const candidate of input.selections) {
    if (!candidate || typeof candidate !== 'object') continue
    const { mealId, servings } = candidate as Record<string, unknown>
    if (typeof mealId === 'string' && validMealIds.has(mealId)) selections.set(mealId, { mealId, servings: clampServings(servings) })
  }
  const checked = Array.isArray(input.checked)
    ? [...new Set(input.checked.filter((key): key is string => typeof key === 'string').map(normalizeKey).filter(Boolean))]
    : []
  const custom = new Map<string, CustomShoppingItem>()
  if (Array.isArray(input.custom)) for (const candidate of input.custom) {
    if (!candidate || typeof candidate !== 'object') continue
    const { id, name, amount } = candidate as Record<string, unknown>
    if (typeof id !== 'string' || !id.trim() || typeof name !== 'string' || !name.trim()) continue
    custom.set(id.trim().slice(0, 80), { id: id.trim().slice(0, 80), name: name.trim().slice(0, 80), amount: typeof amount === 'string' ? amount.trim().slice(0, 50) : '' })
  }
  const pantry = Array.isArray(input.pantry)
    ? [...new Set(input.pantry.filter((key): key is string => typeof key === 'string').map(normalizeKey).filter(Boolean))]
    : []
  return { version: 2, selections: [...selections.values()], checked, custom: [...custom.values()], pantry }
}

export function upsertSelection(state: ShoppingState, selection: ShoppingSelection): ShoppingState {
  const next = { mealId: selection.mealId, servings: clampServings(selection.servings) }
  const index = state.selections.findIndex(({ mealId }) => mealId === selection.mealId)
  return { ...state, selections: index < 0 ? [...state.selections, next] : state.selections.map((current, currentIndex) => currentIndex === index ? next : current) }
}

export function removeSelection(state: ShoppingState, mealId: string): ShoppingState {
  return { ...state, selections: state.selections.filter((selection) => selection.mealId !== mealId) }
}

export function addCustomItem(state: ShoppingState, item: CustomShoppingItem): ShoppingState {
  const id = item.id.trim().slice(0, 80)
  const name = item.name.trim().slice(0, 80)
  if (!id || !name) return state
  const next = { id, name, amount: item.amount.trim().slice(0, 50) }
  const index = state.custom.findIndex((current) => current.id === id)
  return { ...state, custom: index < 0 ? [...state.custom, next] : state.custom.map((current, currentIndex) => currentIndex === index ? next : current) }
}

export function removeCustomItem(state: ShoppingState, id: string): ShoppingState {
  return { ...state, custom: state.custom.filter((item) => item.id !== id) }
}

export function togglePantryItem(state: ShoppingState, key: string): ShoppingState {
  const normalized = normalizeKey(key)
  if (!normalized) return state
  return { ...state, pantry: state.pantry.includes(normalized) ? state.pantry.filter((item) => item !== normalized) : [...state.pantry, normalized] }
}

export function aggregateShoppingItems(meals: ShoppingMeal[], selections: ShoppingSelection[], custom: CustomShoppingItem[] = []) {
  const mealsById = new Map(meals.map((meal) => [meal.id, meal]))
  const items = new Map<string, ShoppingItem>()
  for (const selection of selections) {
    const meal = mealsById.get(selection.mealId)
    if (!meal) continue
    const factor = selection.servings / meal.servings
    for (const ingredient of meal.ingredients) {
      const name = toDutchIngredient(ingredient.name).trim()
      const key = normalizeKey(name)
      if (!key) continue
      const current = items.get(key) || { key, name, estimatedGrams: 0, contributions: [] }
      current.estimatedGrams += Math.round(ingredient.totalGrams * factor)
      current.contributions.push({ mealId: meal.id, mealTitle: meal.title, amount: scaleAmount(ingredient.amount, factor) })
      items.set(key, current)
    }
  }
  for (const item of custom) {
    const name = toDutchIngredient(item.name).trim()
    const key = normalizeKey(name)
    if (!key) continue
    const current = items.get(key) || { key, name, estimatedGrams: 0, contributions: [] }
    current.contributions.push({ mealId: item.id, mealTitle: 'Handmatig', amount: item.amount })
    items.set(key, current)
  }
  return [...items.values()].sort((a, b) => a.name.localeCompare(b.name, 'nl'))
}

export function categoryForIngredient(name: string): ShoppingCategory {
  const value = normalizeKey(name)
  if (/tomat|aardappel|potato|aubergine|eggplant|paprika|pepper|spinazie|spinach|broccoli|bloemkool|cauliflower|courgette|zucchini|champignon|mushroom|wortel|carrot|ui\b|uien|onion|knoflook|garlic|appel|apple|bana|citroen|lemon|limoen|lime|fruit|berries|berry|strawberr|frambo|raspberr|kool|cabbage|prei|leek|selder|celery|komkommer|cucumber|avocado/.test(value)) return 'produce'
  if (/brood|bread|baguette|wrap|tortilla|pita|croissant|gebak|pastry/.test(value)) return 'bakery'
  if (/yogh?urt|melk|milk|room|cream|kaas|cheese|boter|butter|ei\b|eieren|egg/.test(value)) return 'dairy'
  if (/kip|chicken|rund|beef|gehakt|mince|varken|pork|lam\b|lamb|kalkoen|turkey|zalm|salmon|tonijn|tuna|vis\b|fish|garnaal|shrimp|prawn|tofu|tempeh/.test(value)) return 'protein'
  if (/kruid|spice|cumin|komijn|paprika powder|curry|kurkuma|turmeric|oregano|basil|basilicum|parsley|peterselie|cilantro|koriander|zout|salt|peper|pepper|vanilla|kaneel|cinnamon/.test(value)) return 'spices'
  if (/rijst|rice|pasta|noedel|noodle|bloem|flour|suiker|sugar|olie|oil|azijn|vinegar|saus|sauce|bouillon|stock|bonen|beans|linzen|lentil|kikkererwt|chickpea|blik|tin|puree|cornstarch|sesam|sesame/.test(value)) return 'pantry'
  return 'other'
}

export function shoppingCartIngredients(items: ShoppingItem[], checked: string[], pantry: string[] = []): CartIngredient[] {
  return items.filter(({ key }) => !checked.includes(key) && !pantry.includes(key)).map((item) => ({
    name: item.name,
    amount: item.contributions.map(({ amount }) => amount).filter(Boolean).join(' + ') || `ca. ${item.estimatedGrams} g`,
  }))
}
