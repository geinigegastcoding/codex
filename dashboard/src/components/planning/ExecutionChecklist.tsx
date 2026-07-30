import { CheckCircle2 } from 'lucide-react'
import { useWorkspace } from '../../state/useWorkspace'
import { ProvenanceBadge } from '../context/ProvenanceBadge'

export function ExecutionChecklist() {
  const { state, toggleChecklist } = useWorkspace()
  const completed = state.checklist.filter((item) => item.complete).length
  return (
    <article className="workspace-card checklist-card">
      <header className="workspace-card__header"><div><p className="eyebrow">EXECUTION CONTRACT</p><h2>Klaar om uit te voeren</h2></div><span className="card-count">{completed}/{state.checklist.length}</span></header>
      <div className="checklist-list">
        {state.checklist.map((item) => <label key={item.id} className={item.complete ? 'is-complete' : undefined}><input type="checkbox" checked={item.complete} onChange={() => toggleChecklist(item.id)} /><CheckCircle2 aria-hidden="true" size={17} /><span>{item.title}</span></label>)}
      </div>
      <ProvenanceBadge provenance="local" compact />
    </article>
  )
}
