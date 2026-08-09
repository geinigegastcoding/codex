import { projects } from '../content/projects'
import type { CourseState, LegacyCourseStateV1, ProjectProgress } from '../domain/progress-types'
import { createProjectProgress } from './project-progress'

export const currentContentVersion = '2026.07-comprehensive'

function projectProgressDefaults() {
  return Object.fromEntries(projects.map((project) => [project.id, createProjectProgress(project)]))
}

export function migrateV1ToV2(legacy: LegacyCourseStateV1): CourseState {
  const migratedAt = new Date().toISOString()
  const projectProgress = projectProgressDefaults()
  for (const projectId of legacy.completedProjects) {
    const current = projectProgress[projectId]
    if (!current) continue
    projectProgress[projectId] = {
      ...current,
      status: 'needs-evidence',
      startedAt: legacy.startedAt,
      reflection: 'This project was marked complete before evidence-based project verification was introduced. Import fresh verifier evidence to confirm completion.',
    }
  }
  return {
    version: 2,
    startedAt: legacy.startedAt,
    xp: legacy.xp,
    completedLessons: [...legacy.completedLessons],
    skillMastery: { ...legacy.skillMastery },
    exerciseProgress: { ...legacy.exerciseProgress },
    reviewQueue: [...legacy.reviewQueue],
    activityByDate: { ...legacy.activityByDate },
    currentStreak: legacy.currentStreak,
    longestStreak: legacy.longestStreak,
    shields: legacy.shields,
    placementCalibrated: legacy.placementCalibrated,
    preferences: { ...legacy.preferences },
    projectProgress,
    assessmentAttempts: [],
    certificationGoals: [],
    xpEvents: {},
    content: { contentVersion: currentContentVersion, migratedAt },
  }
}

export function normalizeV2State(state: Partial<CourseState>, defaults: CourseState): CourseState {
  const projectProgress = projectProgressDefaults()
  for (const [projectId, progress] of Object.entries(state.projectProgress ?? {})) {
    if (!projectProgress[projectId] || !progress) continue
    const base = projectProgress[projectId]
    projectProgress[projectId] = {
      ...base,
      ...progress,
      milestones: Object.fromEntries(Object.entries(base.milestones).map(([milestoneId, milestone]) => [
        milestoneId,
        { ...milestone, ...progress.milestones?.[milestoneId], evidence: Array.isArray(progress.milestones?.[milestoneId]?.evidence) ? progress.milestones[milestoneId].evidence : [] },
      ])),
    } as ProjectProgress
  }
  return {
    ...defaults,
    ...state,
    version: 2,
    completedLessons: Array.isArray(state.completedLessons) ? state.completedLessons : [],
    skillMastery: { ...defaults.skillMastery, ...state.skillMastery },
    exerciseProgress: state.exerciseProgress ?? {},
    reviewQueue: Array.isArray(state.reviewQueue) ? state.reviewQueue : [],
    activityByDate: state.activityByDate ?? {},
    preferences: { ...defaults.preferences, ...state.preferences },
    projectProgress,
    assessmentAttempts: Array.isArray(state.assessmentAttempts) ? state.assessmentAttempts : [],
    certificationGoals: Array.isArray(state.certificationGoals) ? state.certificationGoals : [],
    xpEvents: state.xpEvents ?? {},
    content: { contentVersion: currentContentVersion, ...state.content },
  }
}
