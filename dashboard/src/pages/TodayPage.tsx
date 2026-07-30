import { AlertTriangle, ArrowRight, BrainCircuit, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SourceNote } from '../components/context/SourceNote'
import { PageHeader } from '../components/layout/PageHeader'
import { DailyPriorities } from '../components/planning/DailyPriorities'
import { ExecutionChecklist } from '../components/planning/ExecutionChecklist'
import { QuickCapture } from '../components/planning/QuickCapture'
import { knowledgeContext } from '../data/knowledge-context'
import { useWorkspace } from '../state/useWorkspace'

export default function TodayPage() {
  const { state } = useWorkspace()
  const openDecisions = knowledgeContext.decisions.filter((decision) => (state.decisionStates[decision.id]?.status ?? 'open') === 'open')
  return (
    <div className="page today-page">
      <PageHeader eyebrow="PERSONAL OPERATING SYSTEM" title="Goedemorgen, Daniël." description="Eén plek voor richting, keuzes en de kleinste nuttige volgende stap." provenance="verified" actions={<Link className="secondary-link" to="/review">Open weekreview <ArrowRight aria-hidden="true" size={15} /></Link>} />

      <section className="objective-card" aria-labelledby="objective-title">
        <div><p className="eyebrow">PRIMAIRE DOELSTELLING</p><h2 id="objective-title">{knowledgeContext.objective.title}</h2><p>{knowledgeContext.objective.detail}</p></div>
        <div className="objective-signal"><span>Nu nodig</span><strong>Bron herstellen → productie verifiëren → outreach uitvoeren</strong></div>
        <SourceNote source={knowledgeContext.objective.source} />
      </section>

      <div className="page-grid page-grid--today">
        <DailyPriorities />
        <div className="today-side-stack"><QuickCapture compact /><ExecutionChecklist /></div>
      </div>

      <div className="page-grid page-grid--context">
        <article className="workspace-card blockers-card">
          <header className="workspace-card__header"><div><p className="eyebrow">BLOCKERS</p><h2>Wat beweging verhindert</h2></div><span className="card-count">{knowledgeContext.blockers.length}</span></header>
          <ul>{knowledgeContext.blockers.map((blocker) => <li key={blocker}><AlertTriangle aria-hidden="true" size={15} /><span>{blocker}</span></li>)}</ul>
          <SourceNote source={knowledgeContext.sources.status} />
        </article>

        <article className="workspace-card brain-executor-card">
          <header className="workspace-card__header"><div><p className="eyebrow">HANDOFF</p><h2>Wie moet nu bewegen?</h2></div></header>
          <div><section><BrainCircuit aria-hidden="true" size={18} /><span><strong>Daniël beslist</strong><small>{openDecisions[0]?.question ?? 'Geen open beslissing geselecteerd.'}</small></span></section><section><Workflow aria-hidden="true" size={18} /><span><strong>Executor kan door</strong><small>{knowledgeContext.nextActions[1]}</small></span></section></div>
          <Link to="/decisions">Bekijk {openDecisions.length} open besluiten <ArrowRight aria-hidden="true" size={14} /></Link>
        </article>
      </div>
    </div>
  )
}
