import { useState } from 'react'
import { Check, ChevronDown, Clock3, ExternalLink } from 'lucide-react'
import type { DemoLead } from '../../domain/dashboard-types'
import { formatDateTime } from '../../utils/formatting'
import { StatusBadge } from '../ui/StatusBadge'

type TodayQueueProps = {
  leads: DemoLead[]
  referenceDate: string
}

const stageLabels = {
  new: 'Nieuw',
  qualified: 'Gekwalificeerd',
  demo: 'Demo voorbereid',
  proposal: 'Voorstel',
  followUp: 'Opvolging',
}

export function TodayQueue({ leads, referenceDate }: TodayQueueProps) {
  const [expanded, setExpanded] = useState<string | null>(leads[0]?.id ?? null)
  const [completed, setCompleted] = useState<string[]>([])
  const visibleLeads = leads.slice(0, 5)

  return (
    <article className="panel queue-panel">
      <header className="panel-header">
        <div><p className="eyebrow">NEXT ACTION FIRST</p><h3>Today Queue</h3></div>
        <span className="panel-count">{visibleLeads.filter((lead) => !completed.includes(lead.id)).length} open</span>
      </header>

      <div className="queue-list">
        {visibleLeads.map((lead) => {
          const isExpanded = expanded === lead.id
          const isComplete = completed.includes(lead.id)
          const isOverdue = lead.nextActionAt.slice(0, 10) < referenceDate
          return (
            <div className={`queue-item${isComplete ? ' is-complete' : ''}`} key={lead.id}>
              <button
                className="queue-item__summary"
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setExpanded(isExpanded ? null : lead.id)}
              >
                <span className="queue-item__initials" aria-hidden="true">
                  {lead.companyName.split(' ').slice(0, 2).map((word) => word[0]).join('')}
                </span>
                <span className="queue-item__identity">
                  <strong>{lead.companyName}</strong>
                  <small>{stageLabels[lead.stage]} · {lead.source.replaceAll('-', ' ')}</small>
                </span>
                <span className="queue-item__action">
                  <strong>{lead.nextAction}</strong>
                  <small className={isOverdue ? 'is-overdue' : ''}><Clock3 aria-hidden="true" size={12} /> {formatDateTime(lead.nextActionAt)}</small>
                </span>
                <StatusBadge tone={lead.urgency} label={lead.urgency === 'high' ? 'Hoog' : lead.urgency === 'medium' ? 'Midden' : 'Laag'} />
                <ChevronDown aria-hidden="true" className={isExpanded ? 'is-rotated' : ''} size={16} />
              </button>
              {isExpanded && (
                <div className="queue-item__details">
                  <div><span>Contact</span><strong>{lead.contactName}</strong></div>
                  <div><span>Notitie</span><strong>{lead.notes[0]}</strong></div>
                  <div className="queue-item__buttons">
                    <button type="button" onClick={() => setCompleted((items) => items.includes(lead.id) ? items.filter((id) => id !== lead.id) : [...items, lead.id])}>
                      <Check aria-hidden="true" size={15} /> {isComplete ? 'Heropen' : 'Markeer afgerond'}
                    </button>
                    <button type="button"><ExternalLink aria-hidden="true" size={15} /> Open demo</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </article>
  )
}
