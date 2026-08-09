import type { SkillId } from './course-types'

export type ExerciseProgress = {
  attempts: number
  passed: boolean
  hintLevel: 0 | 1 | 2 | 3
  bestSeconds?: number
  draft: string
  solution?: string
  lastAttemptAt?: string
}

export type ReviewItem = {
  exerciseId: string
  box: number
  dueDate: string
}

export type DailyActivity = {
  minutes: number
  attempts: number
  passed: number
  xp: number
}

export type CoursePreferences = {
  dailyMinutes: 30 | 60 | 90
  restDays: number[]
  vacationStart: string
  vacationEnd: string
  streakShields: boolean
}

export type MilestoneEvidence = {
  requirementId: string
  recordedAt: string
  kind: 'browser-check' | 'verifier-report' | 'file-hash' | 'reflection'
  value: string
}

export type MilestoneProgress = {
  status: 'not-started' | 'in-progress' | 'needs-evidence' | 'verified-complete'
  startedAt?: string
  completedAt?: string
  notes: string
  evidence: MilestoneEvidence[]
}

export type ProjectProgress = {
  projectId: string
  status: 'not-started' | 'in-progress' | 'needs-evidence' | 'verified-complete'
  startedAt?: string
  completedAt?: string
  activeMilestoneId?: string
  milestones: Record<string, MilestoneProgress>
  reflection: string
  verifierReportId?: string
}

export type AssessmentAttempt = {
  id: string
  assessmentId: string
  startedAt: string
  completedAt?: string
  score?: number
  passed?: boolean
  timed: boolean
  answers: Record<string, string>
}

export type CertificationGoal = {
  certificationId: string
  selectedAt: string
  targetDate?: string
}

export type XpEvent = {
  id: string
  source: 'exercise-attempt' | 'lesson-completion' | 'milestone-completion' | 'assessment-completion' | 'migration'
  sourceId: string
  amount: number
  awardedAt: string
}

export type ContentProgress = {
  contentVersion: string
  migratedAt?: string
}

export type LegacyCourseStateV1 = {
  version: 1
  startedAt: string
  xp: number
  completedLessons: string[]
  completedProjects: string[]
  skillMastery: Record<SkillId, number>
  exerciseProgress: Record<string, ExerciseProgress>
  reviewQueue: ReviewItem[]
  activityByDate: Record<string, DailyActivity>
  currentStreak: number
  longestStreak: number
  shields: number
  placementCalibrated: boolean
  preferences: CoursePreferences
}

export type CourseState = {
  version: 2
  startedAt: string
  xp: number
  completedLessons: string[]
  skillMastery: Record<SkillId, number>
  exerciseProgress: Record<string, ExerciseProgress>
  reviewQueue: ReviewItem[]
  activityByDate: Record<string, DailyActivity>
  currentStreak: number
  longestStreak: number
  shields: number
  placementCalibrated: boolean
  preferences: CoursePreferences
  projectProgress: Record<string, ProjectProgress>
  assessmentAttempts: AssessmentAttempt[]
  certificationGoals: CertificationGoal[]
  xpEvents: Record<string, XpEvent>
  content: ContentProgress
}
