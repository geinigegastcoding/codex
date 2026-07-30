import { useState } from 'react'
import { ArrowRight, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWorkspace } from '../../state/useWorkspace'

export function QuickCapture({ compact = false }: { compact?: boolean }) {
  const [title, setTitle] = useState('')
  const { captureInbox } = useWorkspace()
  return (
    <article className={`workspace-card quick-capture${compact ? ' quick-capture--compact' : ''}`}>
      <div className="quick-capture__title"><Inbox aria-hidden="true" size={18} /><div><p className="eyebrow">QUICK CAPTURE</p><h2>Uit je hoofd, in Inbox</h2></div></div>
      <form onSubmit={(event) => { event.preventDefault(); captureInbox(title); setTitle('') }}>
        <label className="sr-only" htmlFor={compact ? 'quick-capture-compact' : 'quick-capture'}>Nieuwe inboxnotitie</label>
        <input id={compact ? 'quick-capture-compact' : 'quick-capture'} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Taak, idee of follow-up…" />
        <button type="submit" disabled={!title.trim()}>Vastleggen</button>
      </form>
      {!compact && <Link to="/inbox">Open Inbox <ArrowRight aria-hidden="true" size={14} /></Link>}
    </article>
  )
}
