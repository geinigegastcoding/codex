import { describe, expect, it } from 'vitest'
import { addLocalDays, evidenceForAttempt, scheduleReview, updateMastery } from '../state/adaptive-review'

describe('adaptive review', () => {
  it('rewards an independent first-try solution more than a hinted solution', () => {
    expect(evidenceForAttempt(true, 0, 1)).toBeGreaterThan(evidenceForAttempt(true, 2, 2))
  })

  it('moves independent passes into longer review intervals', () => {
    const first = scheduleReview([], 'exercise', true, 0, '2026-07-30')
    expect(first[0]).toEqual({ exerciseId: 'exercise', box: 1, dueDate: '2026-07-31' })
    const second = scheduleReview(first, 'exercise', true, 0, '2026-07-31')
    expect(second[0]).toEqual({ exerciseId: 'exercise', box: 2, dueDate: '2026-08-03' })
  })

  it('returns failures to immediate review because the idea is not retrievable yet', () => {
    const queue = [{ exerciseId: 'exercise', box: 4, dueDate: '2026-08-20' }]
    expect(scheduleReview(queue, 'exercise', false, 0, '2026-07-30')[0]).toEqual({ exerciseId: 'exercise', box: 0, dueDate: '2026-07-30' })
  })

  it('keeps mastery bounded between zero and one', () => {
    expect(updateMastery(1, 1)).toBe(1)
    expect(updateMastery(0, 0)).toBe(0)
  })

  it('adds local calendar days across a month boundary', () => {
    expect(addLocalDays('2026-07-31', 1)).toBe('2026-08-01')
  })
})
