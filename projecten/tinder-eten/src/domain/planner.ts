export type PlannerEntry = { date: string; mealId: string; servings: number }
export type PlannerState = { version: 1; entries: PlannerEntry[] }

export const emptyPlannerState = (): PlannerState => ({ version: 1, entries: [] })

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const clampServings = (value: unknown) => typeof value === 'number' && Number.isFinite(value)
  ? Math.min(12, Math.max(1, Math.round(value)))
  : 1

function parseDate(value: string) {
  if (!datePattern.test(value)) return null
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

export function startOfWeek(date = new Date()) {
  const localDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const offset = localDate.getUTCDay() === 0 ? -6 : 1 - localDate.getUTCDay()
  localDate.setUTCDate(localDate.getUTCDate() + offset)
  return formatDate(localDate)
}

export function shiftWeek(weekStart: string, offset: number) {
  const date = parseDate(weekStart)
  if (!date) return weekStart
  date.setUTCDate(date.getUTCDate() + Math.round(offset) * 7)
  return formatDate(date)
}

export function weekDates(weekStart: string) {
  const start = parseDate(weekStart)
  if (!start) return []
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setUTCDate(date.getUTCDate() + index)
    return formatDate(date)
  })
}

export function sanitizePlannerState(value: unknown, validMealIds: Set<string>): PlannerState {
  if (!value || typeof value !== 'object') return emptyPlannerState()
  const input = value as Record<string, unknown>
  const entries = new Map<string, PlannerEntry>()
  if (Array.isArray(input.entries)) for (const candidate of input.entries) {
    if (!candidate || typeof candidate !== 'object') continue
    const { date, mealId, servings } = candidate as Record<string, unknown>
    if (typeof date === 'string' && parseDate(date) && typeof mealId === 'string' && validMealIds.has(mealId)) {
      entries.set(date, { date, mealId, servings: clampServings(servings) })
    }
  }
  return { version: 1, entries: [...entries.values()].sort((a, b) => a.date.localeCompare(b.date)) }
}

export function upsertPlannerEntry(state: PlannerState, entry: PlannerEntry): PlannerState {
  if (!parseDate(entry.date)) return state
  const next = { ...entry, servings: clampServings(entry.servings) }
  const index = state.entries.findIndex(({ date }) => date === entry.date)
  return { ...state, entries: index < 0
    ? [...state.entries, next].sort((a, b) => a.date.localeCompare(b.date))
    : state.entries.map((current, currentIndex) => currentIndex === index ? next : current) }
}

export function removePlannerEntry(state: PlannerState, date: string): PlannerState {
  return { ...state, entries: state.entries.filter((entry) => entry.date !== date) }
}

export function selectDiverseMeals<T extends { id: string; area: string; category: string; sourceUrl: string; title?: string }>(ranked: T[], count: number, excludedIds: Set<string>) {
  const variantStyle = ({ id, title }: T) => id.includes('-variant-') ? title?.split(/\s+/)[0].toLowerCase() || 'variant' : ''
  const usedSources = new Set(ranked.filter(({ id }) => excludedIds.has(id)).map(({ sourceUrl }) => sourceUrl))
  const usedAreas = new Set(ranked.filter(({ id }) => excludedIds.has(id)).map(({ area }) => area))
  const usedCategories = new Set(ranked.filter(({ id }) => excludedIds.has(id)).map(({ category }) => category))
  const usedStyles = new Map<string, number>()
  for (const candidate of ranked.filter(({ id }) => excludedIds.has(id))) {
    const style = variantStyle(candidate)
    if (style) usedStyles.set(style, (usedStyles.get(style) || 0) + 1)
  }
  const selected: T[] = []
  const selectedIds = new Set(excludedIds)

  while (selected.length < count) {
    let best: T | undefined
    let bestScore = Number.POSITIVE_INFINITY
    ranked.forEach((candidate, index) => {
      if (selectedIds.has(candidate.id)) return
      const score = index
        + (usedSources.has(candidate.sourceUrl) ? 100 : 0)
        + (usedAreas.has(candidate.area) ? 30 : 0)
        + (usedCategories.has(candidate.category) ? 20 : 0)
        + (usedStyles.get(variantStyle(candidate)) || 0) * 80
      if (score < bestScore) { best = candidate; bestScore = score }
    })
    if (!best) break
    selected.push(best)
    selectedIds.add(best.id)
    usedSources.add(best.sourceUrl)
    usedAreas.add(best.area)
    usedCategories.add(best.category)
    const style = variantStyle(best)
    if (style) usedStyles.set(style, (usedStyles.get(style) || 0) + 1)
  }
  return selected
}
