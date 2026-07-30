import type { WorkspaceState } from '../domain/workspace-types'

export const workspaceStorageKey = 'magisdata-workspace:v1'

export const defaultWorkspaceState: WorkspaceState = {
  version: 1,
  priorities: [
    { id: 'priority-website-source', title: 'Kies de canonieke websitebron', complete: false },
    { id: 'priority-outreach', title: 'Scherp één Leiden-outreachboodschap aan', complete: false },
    { id: 'priority-follow-up', title: 'Plan één geconcentreerd follow-upblok', complete: false },
  ],
  checklist: [
    { id: 'check-direction', title: 'Richting en gewenste uitkomst zijn expliciet', complete: false },
    { id: 'check-smallest-step', title: 'De kleinste nuttige volgende stap is gekozen', complete: false },
    { id: 'check-verify', title: 'Uitvoering wordt technisch én visueel geverifieerd', complete: false },
  ],
  inbox: [],
  projectNotes: {},
  decisionStates: {},
  weeklyReview: { answer: '', checklist: {}, updatedAt: '' },
}

function cloneDefaults() {
  return structuredClone(defaultWorkspaceState)
}

export function loadWorkspaceState(): WorkspaceState {
  if (typeof window === 'undefined') return cloneDefaults()
  try {
    const stored = window.localStorage.getItem(workspaceStorageKey)
    if (!stored) return cloneDefaults()
    const parsed = JSON.parse(stored) as Partial<WorkspaceState>
    if (parsed.version !== 1 || !Array.isArray(parsed.priorities) || !Array.isArray(parsed.inbox)) return cloneDefaults()
    return {
      ...cloneDefaults(),
      ...parsed,
      priorities: parsed.priorities.slice(0, 3),
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : cloneDefaults().checklist,
      projectNotes: parsed.projectNotes ?? {},
      decisionStates: parsed.decisionStates ?? {},
      weeklyReview: { ...cloneDefaults().weeklyReview, ...(parsed.weeklyReview ?? {}) },
    }
  } catch {
    return cloneDefaults()
  }
}

export function saveWorkspaceState(state: WorkspaceState) {
  try {
    window.localStorage.setItem(workspaceStorageKey, JSON.stringify(state))
  } catch {
    // The workspace remains usable in memory when storage is unavailable.
  }
}
