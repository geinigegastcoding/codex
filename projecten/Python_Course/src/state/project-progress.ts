import type { Project } from '../domain/course-types'
import type { MilestoneEvidence, MilestoneProgress, ProjectProgress } from '../domain/progress-types'

export type VerifierCheck = {
  id: string
  passed: boolean
  message: string
}

export type VerifierReport = {
  schemaVersion: 1
  reportId: string
  projectId: string
  verifierId: string
  generatedAt: string
  checks: VerifierCheck[]
  files: { path: string; sha256: string; bytes: number }[]
}

export function createMilestoneProgress(): MilestoneProgress {
  return { status: 'not-started', notes: '', evidence: [] }
}

export function createProjectProgress(project: Project): ProjectProgress {
  return {
    projectId: project.id,
    status: 'not-started',
    milestones: Object.fromEntries(project.milestones.map((item) => [item.id, createMilestoneProgress()])),
    reflection: '',
  }
}

export function milestoneHasRequiredEvidence(project: Project, milestoneId: string, progress: MilestoneProgress) {
  const milestone = project.milestones.find((item) => item.id === milestoneId)
  if (!milestone) return false
  const recorded = new Set(progress.evidence.map((item) => item.requirementId))
  return milestone.evidence.filter((item) => item.required).every((item) => recorded.has(item.id))
}

export function milestoneStatus(project: Project, milestoneId: string, progress: ProjectProgress): MilestoneProgress['status'] {
  const current = progress.milestones[milestoneId]
  if (!current) return 'not-started'
  const milestone = project.milestones.find((item) => item.id === milestoneId)
  if (!milestone) return 'not-started'
  const prerequisitesComplete = milestone.prerequisiteMilestoneIds.every((id) => progress.milestones[id]?.status === 'verified-complete')
  if (!prerequisitesComplete && current.status === 'not-started') return 'not-started'
  if (milestoneHasRequiredEvidence(project, milestoneId, current)) return 'verified-complete'
  if (current.evidence.length > 0) return 'needs-evidence'
  return current.startedAt ? 'in-progress' : 'not-started'
}

export function canCompleteProject(project: Project, progress: ProjectProgress) {
  return project.milestones.every((item) => milestoneStatus(project, item.id, progress) === 'verified-complete')
}

export function addMilestoneEvidence(progress: ProjectProgress, milestoneId: string, evidence: MilestoneEvidence): ProjectProgress {
  const current = progress.milestones[milestoneId]
  if (!current) return progress
  const existing = current.evidence.filter((item) => item.requirementId !== evidence.requirementId)
  return {
    ...progress,
    milestones: {
      ...progress.milestones,
      [milestoneId]: { ...current, evidence: [...existing, evidence] },
    },
  }
}

export function validateVerifierReport(report: unknown, project: Project): VerifierReport {
  if (!report || typeof report !== 'object') throw new Error('Verifier report must be a JSON object.')
  const candidate = report as Partial<VerifierReport>
  if (candidate.schemaVersion !== 1 || candidate.projectId !== project.id || candidate.verifierId !== project.verifier?.id) throw new Error('Verifier report does not match this project or verifier version.')
  if (!candidate.reportId || !candidate.generatedAt || !Array.isArray(candidate.checks) || candidate.checks.length === 0) throw new Error('Verifier report is missing its identity, date, or checks.')
  if (candidate.checks.some((check) => !check || typeof check.id !== 'string' || check.passed !== true || typeof check.message !== 'string')) throw new Error('Every verifier check must pass before evidence can be imported.')
  if (!Array.isArray(candidate.files) || candidate.files.some((file) => !file.path || !/^[a-f0-9]{64}$/i.test(file.sha256) || !Number.isFinite(file.bytes) || file.bytes < 0)) throw new Error('Verifier file evidence is incomplete.')
  return candidate as VerifierReport
}
