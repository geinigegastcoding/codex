import { describe, expect, it } from 'vitest'
import { buildExerciseBrief, extractFunctionSignature } from '../components/lesson/exercise-brief'
import { assessments } from '../content/assessments'
import { lessons, modules, stages, validateCatalog } from '../content/catalog'
import { exercises } from '../content/exercises'
import { professionalExerciseByModule } from '../content/professional-exercises'
import { projects } from '../content/projects'
import { resources } from '../content/resources'
import { validateCourseContent } from '../content/validate-content'

describe('course content', () => {
  it('keeps every reference valid so learners cannot reach a dead end', () => {
    expect(validateCatalog()).toBe(true)
    expect(validateCourseContent()).toBe(true)
  })

  it('ships a complete multi-stage path rather than placeholder navigation', () => {
    expect(stages).toHaveLength(12)
    expect(modules.length).toBeGreaterThanOrEqual(55)
    expect(lessons.length).toBeGreaterThanOrEqual(172)
    expect(exercises.length).toBeGreaterThanOrEqual(56)
    expect(projects.length).toBeGreaterThanOrEqual(8)
  })

  it('gives every coding exercise behavior checks, staged hints, and a solution', () => {
    for (const exercise of exercises) {
      expect(exercise.tests.length).toBeGreaterThanOrEqual(2)
      expect(exercise.hints).toHaveLength(3)
      expect(exercise.solution.trim().length).toBeGreaterThan(20)
      expect(extractFunctionSignature(exercise)).toMatch(new RegExp(`^def ${exercise.functionName}\\(`))
      expect(buildExerciseBrief(exercise).checklist).toHaveLength(exercise.tests.length)
    }
  })

  it('links a dedicated coding exercise into every expanded professional module', () => {
    const expandedModules = modules.filter((module) => professionalExerciseByModule[module.id])
    expect(expandedModules).toHaveLength(Object.keys(professionalExerciseByModule).length)
    for (const module of expandedModules) {
      const linked = lessons.filter((lesson) => module.lessonIds.includes(lesson.id) && lesson.exerciseId)
      expect(linked).toHaveLength(1)
      expect(linked[0].evidence).toContainEqual({ kind: 'exercise', referenceId: linked[0].exerciseId, required: true })
    }
  })

  it('varies module assessment answers and ties distractors to the tested concepts', () => {
    const moduleQuestions = assessments
      .filter((assessment) => assessment.kind === 'module-boss')
      .flatMap((assessment) => assessment.questionPool)
    expect(new Set(moduleQuestions.map((question) => question.correctIndex)).size).toBe(4)
    for (const question of moduleQuestions) {
      expect(new Set(question.choices).size).toBe(4)
      expect(question.choices.some((choice) => choice.includes('boundary') || choice.includes('contract'))).toBe(true)
    }
  })

  it('describes why every external resource belongs in the course', () => {
    for (const resource of resources) {
      expect(resource.url).toMatch(/^https:\/\//)
      expect(resource.reason.length).toBeGreaterThan(20)
    }
  })
})
