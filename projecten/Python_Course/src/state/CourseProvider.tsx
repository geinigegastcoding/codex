import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Assessment } from '../domain/course-types'
import type { CoursePreferences, CourseState, MilestoneEvidence } from '../domain/progress-types'
import { loadCourseState, saveCourseState } from './course-storage'
import { courseReducer, type AttemptInput } from './course-reducer'

type CourseContextValue = {
  state: CourseState
  recordAttempt: (input: AttemptInput) => void
  unlockHint: (exerciseId: string, level: 1 | 2 | 3) => void
  completeLesson: (lessonId: string) => void
  startProject: (projectId: string) => void
  startMilestone: (projectId: string, milestoneId: string) => void
  updateMilestoneNotes: (projectId: string, milestoneId: string, notes: string) => void
  recordMilestoneEvidence: (projectId: string, milestoneId: string, evidence: MilestoneEvidence) => void
  updateProjectReflection: (projectId: string, reflection: string) => void
  toggleCertificationGoal: (certificationId: string) => void
  completeAssessment: (assessment: Assessment, answers: Record<string, string>, score: number, timed: boolean, startedAt: string) => void
  updatePreferences: (preferences: Partial<CoursePreferences>) => void
  importState: (state: CourseState) => void
  reset: () => void
}

const CourseContext = createContext<CourseContextValue | null>(null)

export function CourseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(courseReducer, undefined, loadCourseState)
  useEffect(() => saveCourseState(state), [state])
  const value = useMemo<CourseContextValue>(() => ({
    state,
    recordAttempt: (payload) => dispatch({ type: 'attempt', payload }),
    unlockHint: (exerciseId, level) => dispatch({ type: 'hint', exerciseId, level }),
    completeLesson: (lessonId) => dispatch({ type: 'complete-lesson', lessonId }),
    startProject: (projectId) => dispatch({ type: 'start-project', projectId }),
    startMilestone: (projectId, milestoneId) => dispatch({ type: 'start-milestone', projectId, milestoneId }),
    updateMilestoneNotes: (projectId, milestoneId, notes) => dispatch({ type: 'milestone-notes', projectId, milestoneId, notes }),
    recordMilestoneEvidence: (projectId, milestoneId, evidence) => dispatch({ type: 'record-milestone-evidence', projectId, milestoneId, evidence }),
    updateProjectReflection: (projectId, reflection) => dispatch({ type: 'project-reflection', projectId, reflection }),
    toggleCertificationGoal: (certificationId) => dispatch({ type: 'toggle-certification-goal', certificationId }),
    completeAssessment: (assessment, answers, score, timed, startedAt) => dispatch({ type: 'complete-assessment', assessment, answers, score, timed, startedAt }),
    updatePreferences: (preferences) => dispatch({ type: 'preferences', preferences }),
    importState: (nextState) => dispatch({ type: 'import', state: nextState }),
    reset: () => dispatch({ type: 'reset' }),
  }), [state])
  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
}

export function useCourse() {
  const value = useContext(CourseContext)
  if (!value) throw new Error('useCourse must be used inside CourseProvider')
  return value
}
