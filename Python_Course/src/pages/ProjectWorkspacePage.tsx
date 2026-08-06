import { useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, ClipboardCheck, Download, ExternalLink, Play, Upload } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { projectById } from '../content/projects'
import { modules } from '../content/catalog'
import { PageHeader } from '../components/layout/PageHeader'
import { ProgressBar } from '../components/progress/ProgressBar'
import { useCourse } from '../state/CourseProvider'
import { milestoneStatus, validateVerifierReport } from '../state/project-progress'

export function ProjectWorkspacePage() {
  const { projectId = '' } = useParams()
  const project = projectById[projectId]
  const { state, startProject, startMilestone, updateMilestoneNotes, recordMilestoneEvidence, updateProjectReflection } = useCourse()
  const [message, setMessage] = useState('')
  const verifierRef = useRef<HTMLInputElement>(null)
  if (!project) return <Navigate to="/projects" replace />
  const progress = state.projectProgress[project.id]
  if (!progress) return <Navigate to="/projects" replace />

  const completed = project.milestones.filter((item) => milestoneStatus(project, item.id, progress) === 'verified-complete').length
  const ready = project.prerequisiteModuleIds.every((moduleId) => {
    const definition = modules.find((item) => item.id === moduleId)
    return definition?.lessonIds.every((lessonId) => state.completedLessons.includes(lessonId))
  })

  async function importVerifier(file?: File) {
    if (!file) return
    try {
      const report = validateVerifierReport(JSON.parse(await file.text()), project)
      for (const item of project.milestones) {
        const requirement = item.evidence.find((evidence) => evidence.kind !== 'reflection')
        if (!requirement) continue
        recordMilestoneEvidence(project.id, item.id, { requirementId: requirement.id, kind: requirement.kind, recordedAt: report.generatedAt, value: report.reportId })
      }
      setMessage(`Imported passing verifier report ${report.reportId}. Add a reflection to each milestone to complete its evidence.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Verifier report import failed.')
    }
  }

  return (
    <>
      <Link className="back-link" to="/projects"><ArrowLeft size={16} /> All projects</Link>
      <PageHeader eyebrow={`${project.estimatedHours} guided hours · ${project.environment}`} title={project.title} description={project.summary} />
      <section className="project-workspace-summary">
        <div><p className="eyebrow">Target outcome</p><h2>{project.outcome}</h2><ProgressBar label={`${completed} of ${project.milestones.length} milestones verified`} value={Math.round((completed / project.milestones.length) * 100)} /></div>
        <div className="project-workspace-actions">
          <span className={`status-pill ${ready ? '' : 'status-pill--warning'}`}>{ready ? 'Prerequisites complete' : 'Prerequisites still in progress'}</span>
          {progress.status === 'not-started' && <button className="primary-link" disabled={!ready} onClick={() => startProject(project.id)}><Play size={16} /> {ready ? 'Start project' : 'Complete prerequisites first'}</button>}
          <a className="secondary-button" href={project.starterBundlePath} download><Download size={16} /> Download starter</a>
        </div>
      </section>

      <div className="project-workspace-grid">
        <main className="project-milestones">
          <section className="settings-card">
            <p className="eyebrow">Work in order</p><h2>Milestones</h2>
            {project.milestones.map((item, index) => {
              const current = progress.milestones[item.id]
              const status = milestoneStatus(project, item.id, progress)
              const unlocked = item.prerequisiteMilestoneIds.every((id) => progress.milestones[id]?.status === 'verified-complete')
              const reflectionRequirement = item.evidence.find((evidence) => evidence.kind === 'reflection')
              const reflectionRecorded = reflectionRequirement && current.evidence.some((evidence) => evidence.requirementId === reflectionRequirement.id)
              return <article className="project-milestone" key={item.id}>
                <header><span className="stage-number">{String(index + 1).padStart(2, '0')}</span><div><p className="eyebrow">{item.estimatedHours} hours · {status.replace('-', ' ')}</p><h3>{item.title}</h3><p>{item.summary}</p></div>{status === 'verified-complete' && <CheckCircle2 className="success-icon" />}</header>
                <div className="project-milestone-columns"><div><strong>Instructions</strong><ol>{item.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol></div><div><strong>Acceptance criteria</strong><ul>{item.acceptanceCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></div></div>
                {status === 'not-started' ? <button className="secondary-button" disabled={!unlocked || progress.status === 'not-started'} onClick={() => startMilestone(project.id, item.id)}><Play size={15} /> {unlocked ? 'Start milestone' : 'Complete the previous milestone'}</button> : <label className="project-notes">Milestone reflection<textarea value={current.notes} onChange={(event) => updateMilestoneNotes(project.id, item.id, event.target.value)} placeholder="What did you choose, what failed, and what would you improve?" />{!reflectionRecorded && <button className="secondary-button" disabled={current.notes.trim().length < 40} onClick={() => reflectionRequirement && recordMilestoneEvidence(project.id, item.id, { requirementId: reflectionRequirement.id, kind: 'reflection', recordedAt: new Date().toISOString(), value: current.notes.trim() })}><ClipboardCheck size={15} /> Record reflection evidence</button>}</label>}
              </article>
            })}
          </section>
        </main>

        <aside className="project-workspace-side">
          <section className="settings-card"><p className="eyebrow">Exact setup</p><h2>Environment</h2><ol className="setup-list">{project.setup.map((step) => <li key={step.id}><strong>{step.title}</strong>{step.command && <code>{step.command}</code>}<p>{step.detail}</p></li>)}</ol></section>
          <section className="settings-card"><p className="eyebrow">Required files</p><h2>Deliverables</h2><ul>{project.deliverables.map((item) => <li key={item.id}><strong>{item.path}</strong><p>{item.description}</p></li>)}</ul></section>
          <section className="settings-card"><p className="eyebrow">Local evidence</p><h2>Verifier report</h2><p>Run <code>{project.verifier?.command}</code>, then import the generated JSON. Project files stay on your computer; only report metadata and hashes are stored.</p><button className="secondary-button" onClick={() => verifierRef.current?.click()}><Upload size={16} /> Import verifier JSON</button><input ref={verifierRef} hidden type="file" accept="application/json" onChange={(event) => void importVerifier(event.target.files?.[0])} />{message && <p className="settings-message" role="status">{message}</p>}</section>
          <section className="settings-card"><p className="eyebrow">100-point standard</p><h2>Rubric</h2><ul>{project.rubric.map((item) => <li key={item.id}><strong>{item.weight} · {item.title}</strong><p>{item.description}</p></li>)}</ul></section>
          <section className="settings-card"><p className="eyebrow">Final reflection</p><h2>What changed?</h2><textarea value={progress.reflection} onChange={(event) => updateProjectReflection(project.id, event.target.value)} placeholder="Summarize what you can now build independently and what still needs practice." /></section>
          <a className="secondary-button" href={project.starterBundlePath}><ExternalLink size={16} /> Starter bundle path</a>
        </aside>
      </div>
    </>
  )
}
