import type { CourseState, LegacyCourseStateV1 } from '../domain/progress-types'
import type { SkillId } from '../domain/course-types'
import { diagnosticSkills } from '../content/diagnostic'
import { projects } from '../content/projects'
import { currentContentVersion, migrateV1ToV2, normalizeV2State } from './course-migrations'
import { createProjectProgress } from './project-progress'

export const courseStorageKey = 'python-course-workspace:v2'
export const legacyCourseStorageKey = 'python-course-workspace:v1'

const mastery = Object.fromEntries(diagnosticSkills.map((skill) => [skill.skillId, skill.score / 100])) as Record<SkillId, number>

export function createDefaultState(): CourseState {
  return {
    version: 2,
    startedAt: new Date().toISOString(),
    xp: 0,
    completedLessons: [],
    skillMastery: { ...mastery },
    exerciseProgress: {},
    reviewQueue: [],
    activityByDate: {},
    currentStreak: 0,
    longestStreak: 0,
    shields: 0,
    placementCalibrated: false,
    preferences: { dailyMinutes: 60, restDays: [0], vacationStart: '', vacationEnd: '', streakShields: true },
    projectProgress: Object.fromEntries(projects.map((project) => [project.id, createProjectProgress(project)])),
    assessmentAttempts: [],
    certificationGoals: [],
    xpEvents: {},
    content: { contentVersion: currentContentVersion },
  }
}

function parseStoredState(raw: string, defaults: CourseState) {
  const parsed = JSON.parse(raw) as Partial<CourseState> | LegacyCourseStateV1
  if (parsed.version === 1) return migrateV1ToV2(parsed as LegacyCourseStateV1)
  if (parsed.version === 2 && parsed.skillMastery && parsed.exerciseProgress) return normalizeV2State(parsed, defaults)
  throw new Error('Unsupported progress version.')
}

export function loadCourseState(): CourseState {
  const defaults = createDefaultState()
  if (typeof window === 'undefined') return defaults
  try {
    const current = window.localStorage.getItem(courseStorageKey)
    if (current) return parseStoredState(current, defaults)
    const legacy = window.localStorage.getItem(legacyCourseStorageKey)
    if (!legacy) return defaults
    const migrated = parseStoredState(legacy, defaults)
    saveCourseState(migrated)
    return migrated
  } catch {
    return defaults
  }
}

export function saveCourseState(state: CourseState) {
  try {
    window.localStorage.setItem(courseStorageKey, JSON.stringify(state))
  } catch {
    // The course remains usable in memory when browser storage is unavailable.
  }
}

export function exportCourseState(state: CourseState) {
  return JSON.stringify(state, null, 2)
}

export function parseImportedState(text: string) {
  try {
    return parseStoredState(text, createDefaultState())
  } catch {
    throw new Error('This is not a valid Python Path progress file.')
  }
}
