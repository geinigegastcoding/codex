import { describe, expect, it } from 'vitest'
import { buildExerciseBrief, extractFunctionSignature, formatPythonValue } from '../components/lesson/exercise-brief'
import { exerciseById } from '../content/exercises'
import type { Exercise } from '../domain/course-types'

describe('exercise briefing', () => {
  it('turns count_truthy into an exact contract and actionable checklist', () => {
    const exercise = exerciseById['count-truthy']
    const brief = buildExerciseBrief(exercise)

    expect(brief.signature).toBe('def count_truthy(values):')
    expect(brief.contract).toContain('1 argument')
    expect(brief.contract).toContain('return the result')
    expect(brief.checklist).toEqual([
      expect.objectContaining({ title: 'mixed values', behavior: 'count_truthy([0, "", [], None, "Python", 4]) → return 2' }),
      expect.objectContaining({ title: 'all false', behavior: 'count_truthy([0, False, "", []]) → return 0' }),
      expect.objectContaining({ title: 'empty list', behavior: 'count_truthy([]) → return 0' }),
    ])
    expect(brief.example).toBe('count_truthy([0, "", [], None, "Python", 4]) → return 2')
  })

  it('explains nested values, exceptions, and tolerant comparisons', () => {
    const nested = buildExerciseBrief(exerciseById['summarize-orders'])
    const exception = buildExerciseBrief(exerciseById['safe-average'])
    const tolerance = buildExerciseBrief(exerciseById['standardize'])

    expect(nested.checklist[0].behavior).toContain('{"customer": "Alice"')
    expect(exception.checklist[2].behavior).toContain('raise ValueError')
    expect(tolerance.checklist[0].note).toContain('0.000001')
  })

  it('extracts exact generated signatures and truncates oversized examples', () => {
    const generated = exerciseById['matrix-multiply-pure']
    expect(extractFunctionSignature(generated)).toBe('def matrix_multiply(a, b):')
    expect(generated.starterCode).toContain('def matrix_multiply(a, b):')
    expect(formatPythonValue('x'.repeat(400))).toHaveLength(220)
    expect(formatPythonValue('x'.repeat(400))).toMatch(/…$/)
  })

  it('fails visibly when an exercise has no usable signature', () => {
    const invalid = { ...exerciseById['count-truthy'], starterCode: 'pass' } satisfies Exercise
    expect(extractFunctionSignature(invalid)).toBe('')
  })
})
