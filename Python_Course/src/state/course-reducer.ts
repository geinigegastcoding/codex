import { lessons, moduleById } from '../content/catalog'
import { projectById } from '../content/projects'
import type { Assessment, Exercise } from '../domain/course-types'
import type { CoursePreferences, CourseState, MilestoneEvidence, XpEvent } from '../domain/progress-types'
import { calculateStreak } from './streaks'
import { createDefaultState } from './course-storage'
import { evidenceForAttempt, localDateKey, scheduleReview, updateMastery } from './adaptive-review'
import { addMilestoneEvidence, canCompleteProject, milestoneStatus } from './project-progress'

export type AttemptInput = { exercise: Exercise; passed: boolean; code: string; seconds: number }

export type CourseAction =
  | { type: 'attempt'; payload: AttemptInput }
  | { type: 'hint'; exerciseId: string; level: 1 | 2 | 3 }
  | { type: 'complete-lesson'; lessonId: string }
  | { type: 'start-project'; projectId: string }
  | { type: 'start-milestone'; projectId: string; milestoneId: string }
  | { type: 'milestone-notes'; projectId: string; milestoneId: string; notes: string }
  | { type: 'record-milestone-evidence'; projectId: string; milestoneId: string; evidence: MilestoneEvidence }
  | { type: 'project-reflection'; projectId: string; reflection: string }
  | { type: 'toggle-certification-goal'; certificationId: string }
  | { type: 'complete-assessment'; assessment: Assessment; answers: Record<string, string>; score: number; timed: boolean; startedAt: string }
  | { type: 'preferences'; preferences: Partial<CoursePreferences> }
  | { type: 'import'; state: CourseState }
  | { type: 'reset' }

export function applyXpEvent(state: CourseState, event: XpEvent): CourseState {
  if (state.xpEvents[event.id]) return state
  return { ...state, xp: state.xp + event.amount, xpEvents: { ...state.xpEvents, [event.id]: event } }
}

function withProject(state: CourseState, projectId: string, update: (current: NonNullable<CourseState['projectProgress'][string]>) => CourseState['projectProgress'][string]) {
  const current = state.projectProgress[projectId]
  if (!current) return state
  return { ...state, projectProgress: { ...state.projectProgress, [projectId]: update(current) } }
}

function recordAttempt(state: CourseState, input: AttemptInput): CourseState {
  const { exercise, passed, code, seconds } = input
  const today = localDateKey()
  const now = new Date().toISOString()
  const current = state.exerciseProgress[exercise.id] ?? { attempts: 0, passed: false, hintLevel: 0 as const, draft: '' }
  const attempts = current.attempts + 1
  const evidence = evidenceForAttempt(passed, current.hintLevel, attempts)
  const skillMastery = { ...state.skillMastery }
  for (const skill of exercise.skillIds) skillMastery[skill] = updateMastery(skillMastery[skill] ?? 0, evidence)
  const earnedXp = passed ? Math.max(15, 60 - current.hintLevel * 12) : 3
  const priorDay = state.activityByDate[today] ?? { minutes: 0, attempts: 0, passed: 0, xp: 0 }
  const activityByDate = {
    ...state.activityByDate,
    [today]: { ...priorDay, attempts: priorDay.attempts + 1, passed: priorDay.passed + (passed ? 1 : 0), xp: priorDay.xp + earnedXp },
  }
  const exerciseProgress = {
    ...state.exerciseProgress,
    [exercise.id]: {
      ...current,
      attempts,
      passed: current.passed || passed,
      draft: code,
      solution: passed ? code : current.solution,
      bestSeconds: passed ? Math.min(current.bestSeconds ?? Number.POSITIVE_INFINITY, seconds) : current.bestSeconds,
      lastAttemptAt: now,
    },
  }
  const currentStreak = calculateStreak(activityByDate, state.preferences, today)
  const passedCount = Object.values(exerciseProgress).filter((item) => item.passed).length
  const next = {
    ...state,
    skillMastery,
    exerciseProgress,
    activityByDate,
    reviewQueue: scheduleReview(state.reviewQueue, exercise.id, passed, current.hintLevel, today),
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
    placementCalibrated: passedCount >= 10,
  }
  return applyXpEvent(next, { id: `attempt:${exercise.id}:${attempts}`, source: 'exercise-attempt', sourceId: exercise.id, amount: earnedXp, awardedAt: now })
}

export function courseReducer(state: CourseState, action: CourseAction): CourseState {
  if (action.type === 'reset') return createDefaultState()
  if (action.type === 'import') return action.state
  if (action.type === 'preferences') {
    const preferences = { ...state.preferences, ...action.preferences }
    return { ...state, preferences, currentStreak: calculateStreak(state.activityByDate, preferences) }
  }
  if (action.type === 'complete-lesson') {
    if (state.completedLessons.includes(action.lessonId)) return state
    const now = new Date().toISOString()
    return applyXpEvent({ ...state, completedLessons: [...state.completedLessons, action.lessonId] }, { id: `lesson:${action.lessonId}`, source: 'lesson-completion', sourceId: action.lessonId, amount: 30, awardedAt: now })
  }
  if (action.type === 'start-project') {
    const project = projectById[action.projectId]
    if (!project) return state
    const requiredLessons = new Set([...project.prerequisiteLessonIds, ...project.prerequisiteModuleIds.flatMap((moduleId) => moduleById[moduleId]?.lessonIds ?? [])])
    if (![...requiredLessons].every((lessonId) => state.completedLessons.includes(lessonId))) return state
    return withProject(state, action.projectId, (current) => current.status === 'not-started' ? { ...current, status: 'in-progress', startedAt: new Date().toISOString() } : current)
  }
  if (action.type === 'start-milestone') {
    const project = projectById[action.projectId]
    if (!project) return state
    return withProject(state, action.projectId, (current) => {
      const definition = project.milestones.find((item) => item.id === action.milestoneId)
      if (!definition || !definition.prerequisiteMilestoneIds.every((id) => current.milestones[id]?.status === 'verified-complete')) return current
      const milestone = current.milestones[action.milestoneId]
      if (!milestone || milestone.status !== 'not-started') return current
      const now = new Date().toISOString()
      return { ...current, status: 'in-progress', startedAt: current.startedAt ?? now, activeMilestoneId: action.milestoneId, milestones: { ...current.milestones, [action.milestoneId]: { ...milestone, status: 'in-progress', startedAt: now } } }
    })
  }
  if (action.type === 'milestone-notes') {
    return withProject(state, action.projectId, (current) => {
      const milestone = current.milestones[action.milestoneId]
      return milestone ? { ...current, milestones: { ...current.milestones, [action.milestoneId]: { ...milestone, notes: action.notes } } } : current
    })
  }
  if (action.type === 'record-milestone-evidence') {
    const project = projectById[action.projectId]
    if (!project) return state
    const next = withProject(state, action.projectId, (current) => {
      const withEvidence = addMilestoneEvidence(current, action.milestoneId, action.evidence)
      const status = milestoneStatus(project, action.milestoneId, withEvidence)
      const now = new Date().toISOString()
      const milestones = { ...withEvidence.milestones, [action.milestoneId]: { ...withEvidence.milestones[action.milestoneId], status, completedAt: status === 'verified-complete' ? now : undefined } }
      const updated = { ...withEvidence, milestones }
      return { ...updated, status: canCompleteProject(project, updated) ? 'verified-complete' : 'in-progress', completedAt: canCompleteProject(project, updated) ? now : undefined }
    })
    const progress = next.projectProgress[action.projectId]
    if (progress?.milestones[action.milestoneId]?.status !== 'verified-complete') return next
    return applyXpEvent(next, { id: `milestone:${action.projectId}:${action.milestoneId}`, source: 'milestone-completion', sourceId: `${action.projectId}/${action.milestoneId}`, amount: 50, awardedAt: new Date().toISOString() })
  }
  if (action.type === 'project-reflection') return withProject(state, action.projectId, (current) => ({ ...current, reflection: action.reflection }))
  if (action.type === 'toggle-certification-goal') {
    const selected = state.certificationGoals.some((goal) => goal.certificationId === action.certificationId)
    return { ...state, certificationGoals: selected ? state.certificationGoals.filter((goal) => goal.certificationId !== action.certificationId) : [...state.certificationGoals, { certificationId: action.certificationId, selectedAt: new Date().toISOString() }] }
  }
  if (action.type === 'complete-assessment') {
    const completedAt = new Date().toISOString()
    const passed = action.score >= action.assessment.passingScore
    const attempt = { id: `${action.assessment.id}:${completedAt}`, assessmentId: action.assessment.id, startedAt: action.startedAt, completedAt, score: action.score, passed, timed: action.timed, answers: action.answers }
    const evidencedLessons = passed ? lessons.filter((lesson) => lesson.evidence?.some((evidence) => evidence.required && evidence.kind === 'assessment' && evidence.referenceId === action.assessment.id)).map((lesson) => lesson.id) : []
    const next = { ...state, completedLessons: [...new Set([...state.completedLessons, ...evidencedLessons])], assessmentAttempts: [...state.assessmentAttempts, attempt] }
    return passed ? applyXpEvent(next, { id: `assessment-pass:${action.assessment.id}`, source: 'assessment-completion', sourceId: action.assessment.id, amount: 100, awardedAt: completedAt }) : next
  }
  if (action.type === 'hint') {
    const current = state.exerciseProgress[action.exerciseId] ?? { attempts: 0, passed: false, hintLevel: 0, draft: '' }
    return { ...state, exerciseProgress: { ...state.exerciseProgress, [action.exerciseId]: { ...current, hintLevel: Math.max(current.hintLevel, action.level) as 0 | 1 | 2 | 3 } } }
  }
  return recordAttempt(state, action.payload)
}
