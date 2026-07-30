import { createContext } from 'react'
import type { DecisionStatus, InboxDestination, WorkspaceState } from '../domain/workspace-types'

export type WorkspaceContextValue = {
  state: WorkspaceState
  addPriority: (title: string) => boolean
  togglePriority: (id: string) => void
  removePriority: (id: string) => void
  toggleChecklist: (id: string) => void
  captureInbox: (title: string, dueDate?: string) => void
  moveInbox: (id: string, destination: InboxDestination) => void
  updateProjectNote: (projectId: string, note: string) => void
  updateDecision: (id: string, status: DecisionStatus, note: string) => void
  updateWeeklyReview: (answer: string) => void
  toggleReviewStep: (id: string) => void
  resetWorkspace: () => void
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)
