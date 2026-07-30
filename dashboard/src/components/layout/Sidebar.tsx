import { Search, Sparkles } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { workspaceRoutes } from '../../app/navigation'
import { DemoDataBadge } from '../ui/DemoDataBadge'

export function Sidebar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const location = useLocation()
  const current = workspaceRoutes.find((route) => location.pathname.startsWith(route.path)) ?? workspaceRoutes[0]

  return (
    <aside className="sidebar">
      <div className="mobile-appbar">
        <NavLink className="brand" to="/today" aria-label="MagisData Command Center">
          <span className="brand-mark"><Sparkles aria-hidden="true" size={18} /></span>
          <span className="brand-copy"><strong>MagisData</strong><small>Command Center</small></span>
        </NavLink>
        <strong className="mobile-page-title">{current.shortLabel}</strong>
        <button className="mobile-command" type="button" onClick={onOpenCommand} aria-label="Open command palette"><Search aria-hidden="true" size={17} /></button>
      </div>

      <nav aria-label="Dashboardpagina’s">
        {workspaceRoutes.map(({ path, label, shortLabel, icon: Icon }) => (
          <NavLink className={({ isActive }) => isActive ? 'is-active' : undefined} to={path} key={path} title={label}>
            <Icon aria-hidden="true" size={17} />
            <span>{shortLabel}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-command" type="button" onClick={onOpenCommand}><Search aria-hidden="true" size={16} /><span>Command palette</span><kbd>⌘ K</kbd></button>

      <div className="sidebar-profile">
        <DemoDataBadge compact />
        <div className="avatar" aria-hidden="true">DM</div>
        <div><strong>Daniël</strong><span>Founder · The Brain</span></div>
      </div>
    </aside>
  )
}
