import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Inbox, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { workspaceRoutes } from '../../app/navigation'
import { useWorkspace } from '../../state/useWorkspace'

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [capture, setCapture] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { captureInbox } = useWorkspace()

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 0)
    else { setQuery(''); setCapture('') }
  }, [open])

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return workspaceRoutes
    return workspaceRoutes.filter((route) => [route.label, route.description, ...route.keywords].join(' ').toLowerCase().includes(normalized))
  }, [query])

  if (!open) return null

  function go(path: string) {
    navigate(path)
    onClose()
  }

  function submitCapture() {
    if (!capture.trim()) return
    captureInbox(capture)
    setCapture('')
    go('/inbox')
  }

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}>
      <section className="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-title">
        <header><div><Search aria-hidden="true" size={17} /><h2 id="command-title">Ga naar of leg iets vast</h2></div><button type="button" onClick={onClose} aria-label="Sluit command palette"><X aria-hidden="true" size={17} /></button></header>
        <label className="command-search"><span className="sr-only">Zoek pagina</span><Search aria-hidden="true" size={16} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek pagina of workflow…" /></label>
        <div className="command-results" aria-label="Pagina’s">
          {matches.map(({ path, label, description, icon: Icon }) => <button type="button" key={path} onClick={() => go(path)}><Icon aria-hidden="true" size={17} /><span><strong>{label}</strong><small>{description}</small></span><ArrowRight aria-hidden="true" size={15} /></button>)}
        </div>
        <form className="command-capture" onSubmit={(event) => { event.preventDefault(); submitCapture() }}>
          <Inbox aria-hidden="true" size={17} />
          <label><span>Snel naar Inbox</span><input value={capture} onChange={(event) => setCapture(event.target.value)} placeholder="Nieuwe taak, gedachte of follow-up…" /></label>
          <button type="submit">Vastleggen</button>
        </form>
      </section>
    </div>
  )
}
