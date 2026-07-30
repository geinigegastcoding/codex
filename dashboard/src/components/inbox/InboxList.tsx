import { Archive, CalendarPlus, CheckCircle2, ListChecks } from 'lucide-react'
import { useWorkspace } from '../../state/useWorkspace'
import { ProvenanceBadge } from '../context/ProvenanceBadge'

export function InboxList() {
  const { state, moveInbox } = useWorkspace()
  const active = state.inbox.filter((item) => item.destination === 'inbox')
  return (
    <article className="workspace-card inbox-card">
      <header className="workspace-card__header"><div><p className="eyebrow">UNIVERSAL INBOX</p><h2>{active.length} niet verwerkt</h2></div><ProvenanceBadge provenance="local" compact /></header>
      {active.length === 0 ? <div className="empty-state"><CheckCircle2 aria-hidden="true" size={26} /><strong>Inbox is leeg</strong><span>Leg werk vast zonder het direct te hoeven plannen.</span></div> : (
        <div className="inbox-list">
          {active.map((item) => <div className="inbox-item" key={item.id}>
            <div><strong>{item.title}</strong><small>{new Intl.DateTimeFormat('nl-NL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}{item.dueDate ? ` · voor ${item.dueDate}` : ''}</small></div>
            <div className="inbox-actions">
              <button type="button" onClick={() => moveInbox(item.id, 'today')} disabled={state.priorities.length >= 3} title={state.priorities.length >= 3 ? 'Today heeft al drie prioriteiten' : undefined}><CalendarPlus aria-hidden="true" size={14} />Vandaag</button>
              <button type="button" onClick={() => moveInbox(item.id, 'decision')}><ListChecks aria-hidden="true" size={14} />Besluit</button>
              <button type="button" onClick={() => moveInbox(item.id, 'archived')}><Archive aria-hidden="true" size={14} />Archief</button>
            </div>
          </div>)}
        </div>
      )}
    </article>
  )
}
