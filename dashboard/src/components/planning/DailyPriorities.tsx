import { useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { useWorkspace } from '../../state/useWorkspace'
import { ProvenanceBadge } from '../context/ProvenanceBadge'

export function DailyPriorities() {
  const [title, setTitle] = useState('')
  const { state, addPriority, togglePriority, removePriority } = useWorkspace()
  const full = state.priorities.length >= 3

  return (
    <article className="workspace-card priorities-card">
      <header className="workspace-card__header"><div><p className="eyebrow">DAILY LIMIT</p><h2>Drie prioriteiten</h2></div><ProvenanceBadge provenance="local" compact /></header>
      <p className="workspace-card__description">Niet alles verdient vandaag aandacht. Kies maximaal drie uitkomsten.</p>
      <div className="priority-list">
        {state.priorities.map((priority, index) => (
          <div className={priority.complete ? 'priority-item is-complete' : 'priority-item'} key={priority.id}>
            <button type="button" className="check-button" onClick={() => togglePriority(priority.id)} aria-label={`${priority.complete ? 'Heropen' : 'Voltooi'} ${priority.title}`}><Check aria-hidden="true" size={15} /></button>
            <span><small>0{index + 1}</small><strong>{priority.title}</strong></span>
            <button type="button" className="icon-button" onClick={() => removePriority(priority.id)} aria-label={`Verwijder ${priority.title}`}><Trash2 aria-hidden="true" size={14} /></button>
          </div>
        ))}
      </div>
      <form className="inline-form" onSubmit={(event) => { event.preventDefault(); if (addPriority(title)) setTitle('') }}>
        <label className="sr-only" htmlFor="priority-title">Nieuwe prioriteit</label>
        <input id="priority-title" value={title} onChange={(event) => setTitle(event.target.value)} disabled={full} placeholder={full ? 'Drie prioriteiten gekozen' : 'Voeg een prioriteit toe…'} />
        <button type="submit" disabled={full || !title.trim()}><Plus aria-hidden="true" size={15} />Toevoegen</button>
      </form>
    </article>
  )
}
