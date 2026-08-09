export type TrackerMealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type TrackerSource = 'recipe' | 'manual'
export type NutritionValues = { kcal: number; protein: number; carbs: number; fat: number }
export type TrackerGoals = NutritionValues
export type TrackerEntry = NutritionValues & {
  id: string
  date: string
  name: string
  mealType: TrackerMealType
  source: TrackerSource
  mealId?: string
  portions: number
}
export type TrackerState = { version: 1; goals: TrackerGoals; entries: TrackerEntry[] }

export const EU_REFERENCE_GOALS: TrackerGoals = { kcal: 2000, protein: 50, carbs: 260, fat: 70 }
export const TRACKER_MEAL_TYPES: TrackerMealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const isDate = (value: string) => {
  if (!datePattern.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const rounded = (value: number) => Math.round(value * 10) / 10
const nutritionValue = (value: unknown, max: number) => finite(value) ? Math.min(max, Math.max(0, rounded(value))) : 0
const goalValue = (value: unknown, fallback: number, max: number) => finite(value) && value > 0 && value <= max ? rounded(value) : fallback
const portionsValue = (value: unknown) => finite(value) ? Math.min(24, Math.max(.25, Math.round(value * 4) / 4)) : 1

export const emptyTrackerState = (): TrackerState => ({ version: 1, goals: { ...EU_REFERENCE_GOALS }, entries: [] })

export function sanitizeTrackerState(value: unknown): TrackerState {
  if (!value || typeof value !== 'object') return emptyTrackerState()
  const input = value as Record<string, unknown>
  const rawGoals = input.goals && typeof input.goals === 'object' ? input.goals as Record<string, unknown> : {}
  const goals = {
    kcal: goalValue(rawGoals.kcal, EU_REFERENCE_GOALS.kcal, 10000),
    protein: goalValue(rawGoals.protein, EU_REFERENCE_GOALS.protein, 1000),
    carbs: goalValue(rawGoals.carbs, EU_REFERENCE_GOALS.carbs, 2000),
    fat: goalValue(rawGoals.fat, EU_REFERENCE_GOALS.fat, 1000),
  }
  const entries = new Map<string, TrackerEntry>()
  if (Array.isArray(input.entries)) for (const candidate of input.entries) {
    if (!candidate || typeof candidate !== 'object') continue
    const item = candidate as Record<string, unknown>
    if (typeof item.id !== 'string' || !item.id.trim() || typeof item.date !== 'string' || !isDate(item.date) || typeof item.name !== 'string' || !item.name.trim()) continue
    const mealType = TRACKER_MEAL_TYPES.includes(item.mealType as TrackerMealType) ? item.mealType as TrackerMealType : 'dinner'
    const source: TrackerSource = item.source === 'recipe' ? 'recipe' : 'manual'
    const entry: TrackerEntry = {
      id: item.id.trim().slice(0, 100), date: item.date, name: item.name.trim().slice(0, 100), mealType, source,
      portions: portionsValue(item.portions), kcal: Math.round(nutritionValue(item.kcal, 20000)),
      protein: nutritionValue(item.protein, 2000), carbs: nutritionValue(item.carbs, 3000), fat: nutritionValue(item.fat, 2000),
    }
    if (source === 'recipe' && typeof item.mealId === 'string' && item.mealId.trim()) entry.mealId = item.mealId.trim().slice(0, 100)
    entries.set(entry.id, entry)
  }
  return { version: 1, goals, entries: [...entries.values()] }
}

export function scaleMealNutrition(values: NutritionValues, portions: number): NutritionValues {
  const factor = portionsValue(portions)
  return {
    kcal: Math.round(Math.max(0, values.kcal) * factor),
    protein: rounded(Math.max(0, values.protein) * factor),
    carbs: rounded(Math.max(0, values.carbs) * factor),
    fat: rounded(Math.max(0, values.fat) * factor),
  }
}

export function addTrackerEntry(state: TrackerState, input: TrackerEntry): TrackerState {
  const entry = sanitizeTrackerState({ goals: state.goals, entries: [input] }).entries[0]
  if (!entry) return state
  const index = state.entries.findIndex(({ id }) => id === entry.id)
  return { ...state, entries: index < 0 ? [...state.entries, entry] : state.entries.map((current, currentIndex) => currentIndex === index ? entry : current) }
}

export function removeTrackerEntry(state: TrackerState, id: string): TrackerState {
  return { ...state, entries: state.entries.filter((entry) => entry.id !== id) }
}

export function updateTrackerGoals(state: TrackerState, goals: TrackerGoals): TrackerState {
  return sanitizeTrackerState({ goals, entries: state.entries })
}

export function dailyTotals(entries: TrackerEntry[], date: string): NutritionValues {
  const totals = entries.filter((entry) => entry.date === date).reduce((sum, entry) => ({
    kcal: sum.kcal + entry.kcal,
    protein: sum.protein + entry.protein,
    carbs: sum.carbs + entry.carbs,
    fat: sum.fat + entry.fat,
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0 })
  return { kcal: Math.round(totals.kcal), protein: rounded(totals.protein), carbs: rounded(totals.carbs), fat: rounded(totals.fat) }
}

export function shiftTrackerDate(date: string, offset: number) {
  if (!isDate(date)) return date
  const parsed = new Date(`${date}T00:00:00Z`)
  parsed.setUTCDate(parsed.getUTCDate() + Math.round(offset))
  return parsed.toISOString().slice(0, 10)
}

export function recentDateRange(endDate: string, count: number) {
  if (!isDate(endDate)) return []
  const length = Math.max(0, Math.round(count))
  return Array.from({ length }, (_, index) => shiftTrackerDate(endDate, index - length + 1))
}

export function rescaleRecipeEntry(entry: TrackerEntry, portions: number): TrackerEntry {
  const previousPortions = portionsValue(entry.portions)
  const nextPortions = portionsValue(portions)
  return {
    ...entry,
    portions: nextPortions,
    ...scaleMealNutrition({
      kcal: entry.kcal / previousPortions,
      protein: entry.protein / previousPortions,
      carbs: entry.carbs / previousPortions,
      fat: entry.fat / previousPortions,
    }, nextPortions),
  }
}

export function recentTrackerEntries(entries: TrackerEntry[], beforeDate: string, limit = 5) {
  if (!isDate(beforeDate)) return []
  const maximum = Math.min(20, Math.max(0, Math.round(limit)))
  const seen = new Set<string>()
  return entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.date < beforeDate)
    .sort((a, b) => b.entry.date.localeCompare(a.entry.date) || b.index - a.index)
    .filter(({ entry }) => {
      const key = entry.source === 'recipe' && entry.mealId
        ? `recipe:${entry.mealId}`
        : `manual:${entry.name.trim().toLocaleLowerCase('nl-NL')}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, maximum)
    .map(({ entry }) => entry)
}

export function trackerPeriodSummary(entries: TrackerEntry[], endDate: string, count: number) {
  const dates = recentDateRange(endDate, count)
  const loggedDates = dates.filter((date) => entries.some((entry) => entry.date === date))
  const totals = loggedDates.reduce((sum, date) => {
    const day = dailyTotals(entries, date)
    return {
      kcal: sum.kcal + day.kcal,
      protein: sum.protein + day.protein,
      carbs: sum.carbs + day.carbs,
      fat: sum.fat + day.fat,
    }
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 })
  const divisor = loggedDates.length || 1
  return {
    days: dates.length,
    loggedDays: loggedDates.length,
    average: {
      kcal: Math.round(totals.kcal / divisor),
      protein: rounded(totals.protein / divisor),
      carbs: rounded(totals.carbs / divisor),
      fat: rounded(totals.fat / divisor),
    },
  }
}

export function selectMealsWithinRemainingEnergy<T extends { id: string; kcal: number }>(meals: T[], totals: NutritionValues, goals: TrackerGoals, limit = 3, excludedIds: ReadonlySet<string> = new Set()) {
  const remaining = Math.max(0, goals.kcal - totals.kcal)
  if (!remaining) return []
  const maximum = Math.min(12, Math.max(0, Math.round(limit)))
  const seen = new Set<string>()
  return meals.filter((meal) => {
    if (!meal.id || excludedIds.has(meal.id) || seen.has(meal.id) || !finite(meal.kcal) || meal.kcal <= 0 || meal.kcal > remaining) return false
    seen.add(meal.id)
    return true
  }).slice(0, maximum)
}

const mealTypeLabels: Record<TrackerMealType, string> = {
  breakfast: 'Ontbijt', lunch: 'Lunch', dinner: 'Diner', snack: 'Tussendoor',
}

function csvCell(value: string | number) {
  let text = String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[;"\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function trackerEntriesCsv(entries: TrackerEntry[]) {
  const header = ['Datum', 'Maaltijdtype', 'Naam', 'Bron', 'Recept-id', 'Porties', 'Calorieën (kcal)', 'Eiwit (g)', 'Koolhydraten (g)', 'Vet (g)']
  const rows = entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => a.entry.date.localeCompare(b.entry.date) || a.index - b.index)
    .map(({ entry }) => [
      entry.date, mealTypeLabels[entry.mealType], entry.name, entry.source === 'recipe' ? 'Recept' : 'Handmatig',
      entry.mealId || '', entry.portions, entry.kcal, entry.protein, entry.carbs, entry.fat,
    ].map(csvCell).join(';'))
  return `\uFEFF${[header.join(';'), ...rows].join('\r\n')}\r\n`
}
