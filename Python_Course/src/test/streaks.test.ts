import { describe, expect, it } from 'vitest'
import { calculateStreak, isVacationDay, qualifies } from '../state/streaks'
import type { CoursePreferences } from '../domain/progress-types'

const preferences: CoursePreferences = { dailyMinutes: 60, restDays: [], vacationStart: '', vacationEnd: '', streakShields: true }

describe('streak rules', () => {
  it('counts passed practice even when the session was short', () => {
    expect(qualifies({ minutes: 2, attempts: 1, passed: 1, xp: 20 })).toBe(true)
  })

  it('does not count a background visit with no meaningful work', () => {
    expect(qualifies({ minutes: 2, attempts: 0, passed: 0, xp: 0 })).toBe(false)
  })

  it('preserves a chain across a scheduled rest day without increasing it', () => {
    const restMonday = { ...preferences, restDays: [1] }
    const activity = {
      '2026-07-26': { minutes: 20, attempts: 2, passed: 1, xp: 20 },
      '2026-07-28': { minutes: 20, attempts: 2, passed: 1, xp: 20 },
    }
    expect(calculateStreak(activity, restMonday, '2026-07-28')).toBe(2)
  })

  it('recognizes inclusive vacation boundaries', () => {
    const vacation = { ...preferences, vacationStart: '2026-08-01', vacationEnd: '2026-08-10' }
    expect(isVacationDay('2026-08-01', vacation)).toBe(true)
    expect(isVacationDay('2026-08-10', vacation)).toBe(true)
    expect(isVacationDay('2026-08-11', vacation)).toBe(false)
  })
})
