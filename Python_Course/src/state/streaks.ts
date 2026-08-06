import type { CoursePreferences, DailyActivity } from '../domain/progress-types'
import { addLocalDays, localDateKey } from './adaptive-review'

export function isVacationDay(dateKey: string, preferences: CoursePreferences) {
  return Boolean(preferences.vacationStart && preferences.vacationEnd && dateKey >= preferences.vacationStart && dateKey <= preferences.vacationEnd)
}

export function weekdayForKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day).getDay()
}

export function qualifies(activity?: DailyActivity) {
  return Boolean(activity && (activity.passed > 0 || activity.minutes >= 10))
}

export function calculateStreak(activityByDate: Record<string, DailyActivity>, preferences: CoursePreferences, today = localDateKey()) {
  let streak = 0
  let cursor = today
  for (let checked = 0; checked < 730; checked += 1) {
    if (qualifies(activityByDate[cursor])) {
      streak += 1
    } else if (preferences.restDays.includes(weekdayForKey(cursor)) || isVacationDay(cursor, preferences)) {
      // Protected days preserve the chain without increasing it.
    } else if (cursor === today) {
      // Today may still become active.
    } else {
      break
    }
    cursor = addLocalDays(cursor, -1)
  }
  return streak
}
