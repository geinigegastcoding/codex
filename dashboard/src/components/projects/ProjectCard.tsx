import { AlertTriangle, ArrowRight, Save } from 'lucide-react'
import type { KnowledgeProject } from '../../data/knowledge-context'
import { useWorkspace } from '../../state/useWorkspace'
import { SourceNote } from '../context/SourceNote'

const stateLabels = { active: 'Actief', blocked: 'Geblokkeerd', 'under-review': 'Onder review', recent: 'Recent' }

export function ProjectCard({ project }: { project: KnowledgeProject }) {
  const { state, updateProjectNote } = useWorkspace()
  return (
    <article className="workspace-card project-card">
      <header><div><span className={`project-state project-state--${project.state}`}>{stateLabels[project.state]}</span><h2>{project.name}</h2></div><span className="project-index">{project.id.toUpperCase()}</span></header>
      <p>{project.relevance}</p>
      <div className="project-next"><ArrowRight aria-hidden="true" size={16} /><span><small>Volgende betekenisvolle actie</small><strong>{project.nextAction}</strong></span></div>
      {project.blocker && <div className="project-warning"><AlertTriangle aria-hidden="true" size={15} /><span><small>Blokkade</small>{project.blocker}</span></div>}
      {project.decisionGate && <p className="project-gate"><strong>Beslismoment:</strong> {project.decisionGate}</p>}
      <label className="project-note"><span><Save aria-hidden="true" size={13} /> Lokale werknotitie</span><textarea value={state.projectNotes[project.id] ?? ''} onChange={(event) => updateProjectNote(project.id, event.target.value)} placeholder="Wat wil je onthouden voor de volgende sessie?" /></label>
      <SourceNote source={project.source} />
    </article>
  )
}
