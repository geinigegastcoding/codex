import { describe, expect, it } from 'vitest'
import { assessmentById } from '../content/assessments'
import { certificationById } from '../content/certifications'
import { projects } from '../content/projects'
import type { LegacyCourseStateV1 } from '../domain/progress-types'
import { certificationReadiness } from '../state/certification-readiness'
import { courseReducer } from '../state/course-reducer'
import { migrateV1ToV2 } from '../state/course-migrations'
import { createDefaultState, parseImportedState } from '../state/course-storage'
import { canCompleteProject, createProjectProgress, validateVerifierReport } from '../state/project-progress'

const legacyState: LegacyCourseStateV1 = {
  version: 1,
  startedAt: '2026-01-01T00:00:00.000Z',
  xp: 430,
  completedLessons: ['trace-values'],
  completedProjects: ['word-insight'],
  skillMastery: createDefaultState().skillMastery,
  exerciseProgress: {},
  reviewQueue: [],
  activityByDate: {},
  currentStreak: 2,
  longestStreak: 4,
  shields: 1,
  placementCalibrated: false,
  preferences: { dailyMinutes: 60, restDays: [0], vacationStart: '', vacationEnd: '', streakShields: true },
}

describe('state v2 migration', () => {
  it('preserves v1 learning evidence and marks old project clicks as needing evidence', () => {
    const migrated = migrateV1ToV2(legacyState)
    expect(migrated.version).toBe(2)
    expect(migrated.xp).toBe(430)
    expect(migrated.completedLessons).toEqual(['trace-values'])
    expect(migrated.projectProgress['word-insight'].status).toBe('needs-evidence')
    expect(migrated.projectProgress['word-insight'].milestones['word-core'].status).toBe('not-started')
  })

  it('imports v1 backups through the public parser', () => {
    expect(parseImportedState(JSON.stringify(legacyState)).version).toBe(2)
  })
})

describe('evidence-based project progress', () => {
  const project = projects[0]

  it('requires all milestone evidence before completion', () => {
    expect(canCompleteProject(project, createProjectProgress(project))).toBe(false)
  })

  it('awards milestone XP once when all required evidence is present', () => {
    let state = createDefaultState()
    state = courseReducer(state, { type: 'start-project', projectId: project.id })
    state = courseReducer(state, { type: 'start-milestone', projectId: project.id, milestoneId: 'word-core' })
    state = courseReducer(state, { type: 'record-milestone-evidence', projectId: project.id, milestoneId: 'word-core', evidence: { requirementId: 'word-core-verification', kind: 'browser-check', recordedAt: '2026-07-30T10:00:00.000Z', value: 'passed' } })
    expect(state.projectProgress[project.id].milestones['word-core'].status).toBe('needs-evidence')
    state = courseReducer(state, { type: 'record-milestone-evidence', projectId: project.id, milestoneId: 'word-core', evidence: { requirementId: 'word-core-reflection', kind: 'reflection', recordedAt: '2026-07-30T10:01:00.000Z', value: 'I separated tokenization from counting and found punctuation edge cases.' } })
    expect(state.projectProgress[project.id].milestones['word-core'].status).toBe('verified-complete')
    expect(state.xp).toBe(50)
    const duplicate = courseReducer(state, { type: 'record-milestone-evidence', projectId: project.id, milestoneId: 'word-core', evidence: { requirementId: 'word-core-reflection', kind: 'reflection', recordedAt: '2026-07-30T10:02:00.000Z', value: 'Updated reflection.' } })
    expect(duplicate.xp).toBe(50)
  })

  it('rejects verifier reports with failed checks or invalid hashes', () => {
    const report = { schemaVersion: 1, reportId: 'run-1', projectId: project.id, verifierId: project.verifier?.id, generatedAt: '2026-07-30T10:00:00.000Z', checks: [{ id: 'tests', passed: false, message: 'one failure' }], files: [] }
    expect(() => validateVerifierReport(report, project)).toThrow(/must pass/)
  })
})

describe('certification assessment evidence', () => {
  it('stores timed attempts, improves readiness, and awards passing XP once', () => {
    const assessment = assessmentById['simulation-pcep']
    const certification = certificationById.pcep
    const answers = Object.fromEntries(assessment.questionPool.map((item) => [item.id, String(item.correctIndex)]))
    const initial = createDefaultState()
    const before = certificationReadiness(initial, certification).score
    const passed = courseReducer(initial, { type: 'complete-assessment', assessment, answers, score: 100, timed: true, startedAt: '2026-07-30T10:00:00.000Z' })
    expect(passed.assessmentAttempts[0]).toMatchObject({ assessmentId: assessment.id, timed: true, score: 100, passed: true })
    expect(certificationReadiness(passed, certification).score).toBeGreaterThan(before)
    expect(passed.xp).toBe(100)
    const repeated = courseReducer(passed, { type: 'complete-assessment', assessment, answers, score: 100, timed: false, startedAt: '2026-07-30T11:00:00.000Z' })
    expect(repeated.assessmentAttempts).toHaveLength(2)
    expect(repeated.xp).toBe(100)
  })
})
