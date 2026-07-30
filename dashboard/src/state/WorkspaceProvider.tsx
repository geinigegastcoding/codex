import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { WorkspaceContext, type WorkspaceContextValue } from './workspace-context'
import { defaultWorkspaceState, loadWorkspaceState, saveWorkspaceState, workspaceStorageKey } from './workspace-storage'

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadWorkspaceState)

  useEffect(() => saveWorkspaceState(state), [state])

  const value = useMemo<WorkspaceContextValue>(() => ({
    state,
    addPriority(title) {
      const clean = title.trim()
      if (!clean || state.priorities.length >= 3) return false
      setState((current) => ({ ...current, priorities: [...current.priorities, { id: createId('priority'), title: clean, complete: false }] }))
      return true
    },
    togglePriority(id) {
      setState((current) => ({ ...current, priorities: current.priorities.map((item) => item.id === id ? { ...item, complete: !item.complete } : item) }))
    },
    removePriority(id) {
      setState((current) => ({ ...current, priorities: current.priorities.filter((item) => item.id !== id) }))
    },
    toggleChecklist(id) {
      setState((current) => ({ ...current, checklist: current.checklist.map((item) => item.id === id ? { ...item, complete: !item.complete } : item) }))
    },
    captureInbox(title, dueDate) {
      const clean = title.trim()
      if (!clean) return
      setState((current) => ({
        ...current,
        inbox: [{ id: createId('capture'), title: clean, createdAt: new Date().toISOString(), dueDate: dueDate || undefined, destination: 'inbox' }, ...current.inbox],
      }))
    },
    moveInbox(id, destination) {
      setState((current) => {
        const item = current.inbox.find((entry) => entry.id === id)
        if (!item) return current
        const priorities = destination === 'today' && current.priorities.length < 3
          ? [...current.priorities, { id: `priority-${item.id}`, title: item.title, complete: false }]
          : current.priorities
        return { ...current, priorities, inbox: current.inbox.map((entry) => entry.id === id ? { ...entry, destination } : entry) }
      })
    },
    updateProjectNote(projectId, note) {
      setState((current) => ({ ...current, projectNotes: { ...current.projectNotes, [projectId]: note } }))
    },
    updateDecision(id, status, note) {
      setState((current) => ({ ...current, decisionStates: { ...current.decisionStates, [id]: { status, note, updatedAt: new Date().toISOString() } } }))
    },
    updateWeeklyReview(answer) {
      setState((current) => ({ ...current, weeklyReview: { ...current.weeklyReview, answer, updatedAt: new Date().toISOString() } }))
    },
    toggleReviewStep(id) {
      setState((current) => ({
        ...current,
        weeklyReview: {
          ...current.weeklyReview,
          checklist: { ...current.weeklyReview.checklist, [id]: !current.weeklyReview.checklist[id] },
          updatedAt: new Date().toISOString(),
        },
      }))
    },
    resetWorkspace() {
      window.localStorage.removeItem(workspaceStorageKey)
      setState(structuredClone(defaultWorkspaceState))
    },
  }), [state])

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
