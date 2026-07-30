import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CommandPalette } from '../command/CommandPalette'
import { Sidebar } from './Sidebar'

export function DashboardShell() {
  const [commandOpen, setCommandOpen] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true }))
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openerRef.current = document.activeElement as HTMLElement
        setCommandOpen(true)
      }
      if (event.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function openCommand() {
    openerRef.current = document.activeElement as HTMLElement
    setCommandOpen(true)
  }

  function closeCommand() {
    setCommandOpen(false)
    window.setTimeout(() => openerRef.current?.focus(), 0)
  }

  return (
    <div className="dashboard-shell">
      <a className="skip-link" href="#main-content">Ga naar hoofdinhoud</a>
      <Sidebar onOpenCommand={openCommand} />
      <main id="main-content" tabIndex={-1}><Outlet /></main>
      <CommandPalette open={commandOpen} onClose={closeCommand} />
    </div>
  )
}
