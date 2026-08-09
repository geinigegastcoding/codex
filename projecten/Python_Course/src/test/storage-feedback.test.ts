import { beforeEach, describe, expect, it } from 'vitest'
import { courseStorageKey, createDefaultState, loadCourseState, parseImportedState, saveCourseState } from '../state/course-storage'
import { feedbackFor } from '../checker/feedback'

class MemoryStorage {
  private values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
  clear() { this.values.clear() }
}

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { value: new MemoryStorage(), configurable: true })
})

describe('local progress storage', () => {
  it('starts from diagnostic defaults when no progress exists', () => {
    expect(loadCourseState().version).toBe(2)
    expect(loadCourseState().skillMastery.dictionaries).toBeLessThan(0.5)
  })

  it('round-trips valid progress so a reload does not lose work', () => {
    const state = createDefaultState()
    state.xp = 140
    saveCourseState(state)
    expect(loadCourseState().xp).toBe(140)
  })

  it('fails safely when stored JSON is corrupt', () => {
    localStorage.setItem(courseStorageKey, '{broken')
    expect(loadCourseState().xp).toBe(0)
  })

  it('rejects unrelated import files', () => {
    expect(() => parseImportedState('{"version":2}')).toThrow(/valid Python Path/)
  })
})

describe('guided feedback', () => {
  it('turns a wrong test into a diagnostic question instead of dumping a solution', () => {
    const feedback = feedbackFor({ id: '1', status: 'failed', stdout: '', tests: [{ name: 'tie handling', passed: false, message: 'wrong order' }] })
    expect(feedback.message).toContain('Which assumption')
    expect(feedback.message).not.toContain('sorted(')
  })

  it('points a timeout toward loop growth', () => {
    expect(feedbackFor({ id: '1', status: 'timeout', stdout: '', tests: [] }).title).toBe('Execution timed out')
  })
})
