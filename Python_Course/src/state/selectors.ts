import type { CourseState } from '../domain/progress-types'
import { lessons, stages } from '../content/catalog'
import { exercises } from '../content/exercises'

export function levelForXp(xp: number) {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function xpForNextLevel(level: number) {
  return level * level * 100
}

export function courseCompletion(state: CourseState) {
  return Math.round((state.completedLessons.length / lessons.length) * 100)
}

export function exerciseCompletion(state: CourseState) {
  return Math.round((Object.values(state.exerciseProgress).filter((item) => item.passed).length / exercises.length) * 100)
}

export function stageCompletion(state: CourseState, stageId: string) {
  const stage = stages.find((item) => item.id === stageId)
  if (!stage) return 0
  const stageLessons = lessons.filter((item) => stage.moduleIds.includes(item.moduleId))
  return Math.round((stageLessons.filter((item) => state.completedLessons.includes(item.id)).length / stageLessons.length) * 100)
}
