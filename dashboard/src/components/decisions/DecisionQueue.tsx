import { useState } from 'react'
import { BrainCircuit, Workflow } from 'lucide-react'
import { knowledgeContext } from '../../data/knowledge-context'
import type { DecisionStatus } from '../../domain/workspace-types'
import { useWorkspace } from '../../state/useWorkspace'
import { ProvenanceBadge } from '../context/ProvenanceBadge'
import { SourceNote } from '../context/SourceNote'

export function DecisionQueue() {
  const [filter, setFilter] = useState<DecisionStatus | 'all'>('open')
  const { state, updateDecision } = useWorkspace()
  const decisions = knowledgeContext.decisions.filter((decision) => filter === 'all' || (state.decisionStates[decision.id]?.status ?? 'open') === filter)

  return (
    <div className="decision-workspace">
      <div className="decision-filter" aria-label="Filter besluiten">{(['open', 'decided', 'deferred', 'all'] as const).map((value) => <button type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} key={value}>{value === 'open' ? 'Open' : value === 'decided' ? 'Beslist' : value === 'deferred' ? 'Uitgesteld' : 'Alles'}</button>)}</div>
      <div className="decision-list">
        {decisions.map((decision) => {
          const local = state.decisionStates[decision.id] ?? { status: 'open' as const, note: '', updatedAt: '' }
          const OwnerIcon = decision.owner === 'Daniël' ? BrainCircuit : Workflow
          return <article className="workspace-card decision-card" key={decision.id}>
            <header><span className="decision-owner"><OwnerIcon aria-hidden="true" size={15} />{decision.owner}</span><ProvenanceBadge provenance={decision.provenance} compact /></header>
            <h2>{decision.title}</h2><p>{decision.question}</p>
            <div className="decision-fields">
              <label><span>Status</span><select value={local.status} onChange={(event) => updateDecision(decision.id, event.target.value as DecisionStatus, local.note)}><option value="open">Open</option><option value="decided">Beslist</option><option value="deferred">Uitgesteld</option></select></label>
              <label><span>Beslisnotitie</span><textarea value={local.note} onChange={(event) => updateDecision(decision.id, local.status, event.target.value)} placeholder="Leg de keuze, reden of ontbrekende informatie vast…" /></label>
            </div>
            <SourceNote source={decision.source} />
          </article>
        })}
      </div>
    </div>
  )
}
