import type { CourseState, ReviewItem } from '../domain/progress-types'
import type { Exercise, SkillId } from '../domain/course-types'

export const reviewIntervals = [0, 1, 3, 7, 14, 30]

export function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addLocalDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return localDateKey(date)
}

export function evidenceForAttempt(passed: boolean, hintLevel: number, attempts: number) {
  if (!passed) return 0.2
  if (hintLevel >= 3) return 0.35
  if (hintLevel === 2) return 0.6
  if (hintLevel === 1) return 0.75
  return attempts === 1 ? 1 : 0.8
}

export function updateMastery(current: number, evidence: number) {
  return Math.max(0, Math.min(1, current * 0.75 + evidence * 0.25))
}

export function scheduleReview(queue: ReviewItem[], exerciseId: string, passed: boolean, hintLevel: number, today = localDateKey()) {
  const current = queue.find((item) => item.exerciseId === exerciseId)
  const currentBox = current?.box ?? 0
  const nextBox = passed && hintLevel <= 1 ? Math.min(5, currentBox + 1) : passed ? currentBox : 0
  const dueDate = addLocalDays(today, reviewIntervals[nextBox])
  return [...queue.filter((item) => item.exerciseId !== exerciseId), { exerciseId, box: nextBox, dueDate }]
}

export function recommendedExerciseIds(state: CourseState, exercises: Exercise[], limit = 6, today = localDateKey()) {
  const due = state.reviewQueue
    .filter((item) => item.dueDate <= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((item) => item.exerciseId)

  const weakest = Object.entries(state.skillMastery)
    .sort((a, b) => a[1] - b[1])
    .map(([skill]) => skill as SkillId)

  const candidates = exercises
    .filter((exercise) => !due.includes(exercise.id))
    .sort((a, b) => {
      const aRank = Math.min(...a.skillIds.map((skill) => weakest.indexOf(skill)))
      const bRank = Math.min(...b.skillIds.map((skill) => weakest.indexOf(skill)))
      return aRank - bRank
    })
    .map((exercise) => exercise.id)

  return [...new Set([...due, ...candidates])].slice(0, limit)
}
