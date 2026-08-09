import { assessments } from './assessments'
import { certifications } from './certifications'
import { exercises } from './exercises'
import { lessons, modules, stages } from './catalog'
import { projects, validateProjects } from './projects'
import { resources } from './resources'

function assertAcyclic(nodes: { id: string; prerequisiteIds: string[] }[], label: string) {
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]))
  const visiting = new Set<string>()
  const visited = new Set<string>()
  function visit(id: string) {
    if (visiting.has(id)) throw new Error(`${label} prerequisites contain a cycle at ${id}`)
    if (visited.has(id)) return
    visiting.add(id)
    for (const prerequisiteId of byId[id]?.prerequisiteIds ?? []) visit(prerequisiteId)
    visiting.delete(id)
    visited.add(id)
  }
  for (const node of nodes) visit(node.id)
}

export function validateCourseContent() {
  const assessmentIds = new Set(assessments.map((item) => item.id))
  const exerciseIds = new Set(exercises.map((item) => item.id))
  const resourceIds = new Set(resources.map((item) => item.id))
  const projectIds = new Set(projects.map((item) => item.id))
  const moduleIds = new Set(modules.map((item) => item.id))
  const lessonIds = new Set(lessons.map((item) => item.id))

  const allIds = [...stages, ...modules, ...lessons, ...exercises, ...projects, ...resources, ...assessments].map((item) => item.id)
  if (new Set(allIds).size !== allIds.length) throw new Error('Course content contains duplicate IDs across content types')

  for (const stage of stages) {
    for (const moduleId of stage.moduleIds) if (!moduleIds.has(moduleId)) throw new Error(`Missing module ${moduleId}`)
    if (stage.assessmentId && !assessmentIds.has(stage.assessmentId)) throw new Error(`Missing stage assessment ${stage.id}/${stage.assessmentId}`)
  }
  for (const item of modules) {
    for (const lessonId of item.lessonIds) if (!lessonIds.has(lessonId)) throw new Error(`Missing lesson ${lessonId}`)
    for (const prerequisiteId of item.prerequisiteIds) if (!moduleIds.has(prerequisiteId)) throw new Error(`Missing prerequisite module ${prerequisiteId}`)
    if (!projectIds.has(item.projectId)) throw new Error(`Missing project ${item.projectId}`)
    if (item.bossAssessmentId && !assessmentIds.has(item.bossAssessmentId)) throw new Error(`Missing module boss assessment ${item.id}/${item.bossAssessmentId}`)
  }
  for (const item of lessons) {
    if (item.exerciseId && !exerciseIds.has(item.exerciseId)) throw new Error(`Missing exercise ${item.exerciseId}`)
    for (const resourceId of item.resourceIds) if (!resourceIds.has(resourceId)) throw new Error(`Missing resource ${resourceId}`)
    for (const prerequisiteId of item.prerequisiteLessonIds ?? []) if (!lessonIds.has(prerequisiteId)) throw new Error(`Missing prerequisite lesson ${prerequisiteId}`)
    for (const evidence of item.evidence ?? []) {
      if (evidence.kind === 'assessment' && !assessmentIds.has(evidence.referenceId)) throw new Error(`Missing lesson assessment ${item.id}/${evidence.referenceId}`)
      if (evidence.kind === 'exercise' && !exerciseIds.has(evidence.referenceId)) throw new Error(`Missing lesson exercise evidence ${item.id}/${evidence.referenceId}`)
    }
    if (item.exerciseId && item.evidence?.some((evidence) => evidence.kind === 'exercise' && evidence.referenceId !== item.exerciseId)) throw new Error(`Mismatched lesson exercise evidence ${item.id}`)
    if (!item.skillIds.length || !item.objectives.length || !item.explanation.length || !item.challenge.trim()) throw new Error(`Incomplete lesson ${item.id}`)
  }
  for (const item of projects) {
    for (const moduleId of item.prerequisiteModuleIds) if (!moduleIds.has(moduleId)) throw new Error(`Missing project prerequisite module ${item.id}/${moduleId}`)
    for (const lessonId of item.prerequisiteLessonIds) if (!lessonIds.has(lessonId)) throw new Error(`Missing project prerequisite lesson ${item.id}/${lessonId}`)
  }

  for (const assessment of assessments) {
    if (assessment.questionPool.length < 4 || assessment.passingScore < 1 || assessment.passingScore > 100) throw new Error(`Incomplete assessment ${assessment.id}`)
    for (const prerequisiteId of assessment.prerequisiteIds) if (!assessmentIds.has(prerequisiteId)) throw new Error(`Missing assessment prerequisite ${assessment.id}/${prerequisiteId}`)
    const questionIds = new Set(assessment.questionPool.map((question) => question.id))
    if (questionIds.size !== assessment.questionPool.length) throw new Error(`Duplicate question IDs in ${assessment.id}`)
    for (const question of assessment.questionPool) if (question.choices.length !== 4 || !question.explanation.trim() || !question.skillIds.length) throw new Error(`Incomplete question ${assessment.id}/${question.id}`)
  }

  for (const certification of certifications) {
    if (!certification.officialUrl.startsWith('https://') || !/^\d{4}-\d{2}-\d{2}$/.test(certification.verifiedAt)) throw new Error(`Invalid certification source metadata ${certification.id}`)
    if (certification.objectives.reduce((total, objective) => total + objective.weight, 0) !== 100) throw new Error(`Certification ${certification.id} objective weights must total 100`)
    for (const objective of certification.objectives) {
      for (const lessonId of objective.lessonIds) if (!lessonIds.has(lessonId)) throw new Error(`Missing certification lesson ${certification.id}/${lessonId}`)
      for (const exerciseId of objective.exerciseIds) if (!exerciseIds.has(exerciseId)) throw new Error(`Missing certification exercise ${certification.id}/${exerciseId}`)
      for (const assessmentId of objective.assessmentIds) if (!assessmentIds.has(assessmentId)) throw new Error(`Missing certification assessment ${certification.id}/${assessmentId}`)
      for (const reference of objective.projectEvidenceIds) {
        const [projectId, milestoneId] = reference.split('/')
        const definition = projects.find((project) => project.id === projectId)
        if (!definition?.milestones.some((milestone) => milestone.id === milestoneId)) throw new Error(`Missing certification project evidence ${certification.id}/${reference}`)
      }
    }
  }

  assertAcyclic(modules, 'Module')
  assertAcyclic(lessons.map((item) => ({ id: item.id, prerequisiteIds: item.prerequisiteLessonIds ?? [] })), 'Lesson')
  validateProjects()
  return true
}
