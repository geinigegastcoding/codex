export type Provenance = 'verified' | 'local' | 'demo' | 'unknown'

export type SourceReference = {
  label: string
  repositoryPath: string
  asOf: string
  provenance: Provenance
}

export type DailyPriority = {
  id: string
  title: string
  complete: boolean
}

export type ChecklistItem = {
  id: string
  title: string
  complete: boolean
}

export type InboxDestination = 'inbox' | 'today' | 'decision' | 'archived'

export type InboxItem = {
  id: string
  title: string
  createdAt: string
  dueDate?: string
  projectId?: string
  destination: InboxDestination
}

export type DecisionStatus = 'open' | 'decided' | 'deferred'

export type DecisionState = {
  status: DecisionStatus
  note: string
  updatedAt: string
}

export type WeeklyReviewState = {
  answer: string
  checklist: Record<string, boolean>
  updatedAt: string
}

export type WorkspaceState = {
  version: 1
  priorities: DailyPriority[]
  checklist: ChecklistItem[]
  inbox: InboxItem[]
  projectNotes: Record<string, string>
  decisionStates: Record<string, DecisionState>
  weeklyReview: WeeklyReviewState
}
