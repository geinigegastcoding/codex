import { sanitizePreferences, type DietPreferences } from './diet'
import { sanitizePlannerState, type PlannerState } from './planner'
import { sanitizeShoppingState, type ShoppingState } from './shopping'
import { sanitizeTrackerState, type TrackerState } from './tracker'
import { createTasteProfile, type TasteProfile } from './taste'

export type HapBackupData = {
  saved: string[]
  taste: TasteProfile
  preferences: DietPreferences
  shopping: ShoppingState
  planner: PlannerState
  tracker: TrackerState
}
export type HapBackup = { app: 'Hap'; version: 1; createdAt: string; data: HapBackupData }
export type ParsedHapBackup = HapBackupData & { createdAt: string }

export function sanitizeSaved(value: unknown, validMealIds: Set<string>) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && validMealIds.has(id)))]
}

export function sanitizeTasteProfile(value: unknown): TasteProfile {
  if (!value || typeof value !== 'object') return createTasteProfile()
  const input = value as Record<string, unknown>
  const interactions = typeof input.interactions === 'number' && Number.isFinite(input.interactions)
    ? Math.min(1_000_000, Math.max(0, Math.round(input.interactions)))
    : 0
  const weights: Record<string, number> = {}
  if (input.weights && typeof input.weights === 'object' && !Array.isArray(input.weights)) {
    for (const [key, candidate] of Object.entries(input.weights as Record<string, unknown>)) {
      if (!key.trim() || typeof candidate !== 'number' || !Number.isFinite(candidate)) continue
      weights[key.slice(0, 120)] = Math.min(50, Math.max(-50, Math.round(candidate * 1000) / 1000))
    }
  }
  return { interactions, weights }
}

export function createHapBackup(data: HapBackupData, createdAt = new Date().toISOString()): HapBackup {
  return { app: 'Hap', version: 1, createdAt, data: { ...data, taste: sanitizeTasteProfile(data.taste) } }
}

export function parseHapBackup(value: string | unknown, validMealIds: Set<string>): ParsedHapBackup {
  let parsed: unknown = value
  if (typeof value === 'string') {
    try { parsed = JSON.parse(value) } catch { throw new Error('De back-up kon niet worden gelezen. Controleer het JSON-bestand.') }
  }
  if (!parsed || typeof parsed !== 'object') throw new Error('Dit is geen geldige Hap-back-up.')
  const backup = parsed as Record<string, unknown>
  if (backup.app !== 'Hap' || backup.version !== 1 || !backup.data || typeof backup.data !== 'object') throw new Error('Dit is geen geldige Hap-back-up of de versie wordt niet ondersteund.')
  const data = backup.data as Record<string, unknown>
  return {
    createdAt: typeof backup.createdAt === 'string' && !Number.isNaN(Date.parse(backup.createdAt)) ? backup.createdAt : new Date(0).toISOString(),
    saved: sanitizeSaved(data.saved, validMealIds),
    taste: sanitizeTasteProfile(data.taste),
    preferences: sanitizePreferences(data.preferences),
    shopping: sanitizeShoppingState(data.shopping, validMealIds),
    planner: sanitizePlannerState(data.planner, validMealIds),
    tracker: sanitizeTrackerState(data.tracker),
  }
}
