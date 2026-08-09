import type { CertificationObjective, CertificationProfile } from '../domain/course-types'
import type { CourseState } from '../domain/progress-types'

export type ObjectiveReadiness = {
  objectiveId: string
  score: number
  completedEvidence: number
  totalEvidence: number
  missing: string[]
}

function projectEvidenceComplete(state: CourseState, reference: string) {
  const [projectId, milestoneId] = reference.split('/')
  return state.projectProgress[projectId]?.milestones[milestoneId]?.status === 'verified-complete'
}

export function objectiveReadiness(state: CourseState, objective: CertificationObjective): ObjectiveReadiness {
  const evidence = [
    ...objective.lessonIds.map((id) => ({ id: `Lesson: ${id}`, complete: state.completedLessons.includes(id) })),
    ...objective.exerciseIds.map((id) => ({ id: `Exercise: ${id}`, complete: state.exerciseProgress[id]?.passed === true })),
    ...objective.assessmentIds.map((id) => ({ id: `Assessment: ${id}`, complete: state.assessmentAttempts.some((attempt) => attempt.assessmentId === id && attempt.passed) })),
    ...objective.projectEvidenceIds.map((id) => ({ id: `Project evidence: ${id}`, complete: projectEvidenceComplete(state, id) })),
  ]
  const completedEvidence = evidence.filter((item) => item.complete).length
  return {
    objectiveId: objective.id,
    score: evidence.length ? Math.round((completedEvidence / evidence.length) * 100) : 0,
    completedEvidence,
    totalEvidence: evidence.length,
    missing: evidence.filter((item) => !item.complete).map((item) => item.id),
  }
}

export function certificationReadiness(state: CourseState, certification: CertificationProfile) {
  const objectives = certification.objectives.map((item) => objectiveReadiness(state, item))
  const totalWeight = certification.objectives.reduce((sum, item) => sum + item.weight, 0)
  const score = totalWeight ? Math.round(certification.objectives.reduce((sum, item, index) => sum + objectives[index].score * item.weight, 0) / totalWeight) : 0
  return { score, objectives, mappedEvidence: objectives.reduce((sum, item) => sum + item.totalEvidence, 0) }
}
