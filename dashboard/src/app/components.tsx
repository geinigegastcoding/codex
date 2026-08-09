import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleDollarSign,
  Command,
  DatabaseZap,
  Gauge,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Plus,
  RefreshCw,
  Settings2,
  Sparkles,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { ConnectorStatus, MetricValue, SourceReport } from './types'

export const navItems: Array<{ to: string; label: string; hint: string; icon: LucideIcon }> = [
  { to: '/overview', label: 'Overview', hint: 'Business command center', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', hint: 'Traffic, content & revenue', icon: BarChart3 },
  { to: '/crm', label: 'CRM', hint: 'Leads and next actions', icon: UsersRound },
  { to: '/tasks', label: 'Tasks', hint: 'Work that needs attention', icon: ListChecks },
  { to: '/integrations', label: 'Integrations', hint: 'Connect real sources', icon: DatabaseZap },
]

export function Brand() {
  return (
    <a className="brand" href="#/overview" aria-label="MagisData overview">
      <span className="brand-mark" aria-hidden="true">M</span>
      <span className="brand-copy">
        <strong>MagisData</strong>
        <small>business command center</small>
      </span>
    </a>
  )
}

export function Sidebar({ apiReady }: { apiReady: boolean }) {
  return (
    <aside className="sidebar">
      <Brand />
      <nav className="primary-nav" aria-label="Primary navigation">
        {navItems.map(({ to, label, hint, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}>
            <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
            <span><strong>{label}</strong><small>{hint}</small></span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className={`readiness-pill${apiReady ? ' is-ready' : ''}`}>
          <span className="status-dot" aria-hidden="true" />
          {apiReady ? 'Local data layer ready' : 'Connect data sources'}
        </div>
        <div className="profile-chip">
          <span className="profile-avatar" aria-hidden="true">DM</span>
          <span><strong>Daniel Magis</strong><small>Founder · MagisData</small></span>
          <Settings2 aria-hidden="true" size={15} />
        </div>
      </div>
    </aside>
  )
}

export function MobileNav() {
  return (
    <details className="mobile-nav">
      <summary aria-label="Open navigation"><Command aria-hidden="true" size={18} /></summary>
      <div className="mobile-nav-menu">
        {navItems.map(({ to, label, hint, icon: Icon }) => (
          <NavLink key={to} to={to}>
            <Icon aria-hidden="true" size={16} />
            <span><strong>{label}</strong><small>{hint}</small></span>
          </NavLink>
        ))}
      </div>
    </details>
  )
}

export function HeaderBar({ syncing, onSync }: { syncing: boolean; onSync: () => void }) {
  return (
    <div className="topbar">
      <div className="topbar-context"><span className="status-dot" aria-hidden="true" /> Private workspace · local-first</div>
      <div className="topbar-actions">
        <span className="shortcut"><Command aria-hidden="true" size={12} /> K</span>
        <button className="icon-button" type="button" aria-label="Sync all data" onClick={onSync} disabled={syncing}>
          <RefreshCw aria-hidden="true" size={16} className={syncing ? 'spin' : ''} />
        </button>
        <span className="today-label">{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())}</span>
      </div>
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  )
}

export function RangeControl({ value, onChange }: { value: '7d' | '30d' | '90d'; onChange: (value: '7d' | '30d' | '90d') => void }) {
  return (
    <div className="segmented-control" aria-label="Date range">
      {(['7d', '30d', '90d'] as const).map((range) => (
        <button key={range} type="button" aria-pressed={value === range} onClick={() => onChange(range)}>
          {range.replace('d', ' days')}
        </button>
      ))}
    </div>
  )
}

export function PrimaryButton({ children, onClick, type = 'button', disabled = false }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button className="button button-primary" type={type} onClick={onClick} disabled={disabled}>{children}</button>
}

export function SecondaryButton({ children, onClick, type = 'button', disabled = false }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button className="button button-secondary" type={type} onClick={onClick} disabled={disabled}>{children}</button>
}

export function Panel({ children, className = '', title, description, action }: { children: ReactNode; className?: string; title?: string; description?: string; action?: ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      {title ? <div className="panel-heading"><div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>{action}</div> : null}
      {children}
    </section>
  )
}

export function SourceBadge({ source, status }: { source: string; status: ConnectorStatus }) {
  const label = status === 'connected' ? 'Live' : status === 'syncing' ? 'Syncing' : status === 'error' ? 'Error' : status === 'empty' ? 'No data' : 'Not connected'
  return <span className={`source-badge status-${status}`}><span className="mini-dot" aria-hidden="true" />{source} · {label}</span>
}

export function MetricCard({ label, metric, icon: Icon }: { label: string; metric: MetricValue; icon: LucideIcon }) {
  return (
    <article className="metric-card">
      <div className="metric-card-top"><span>{label}</span><span className="metric-icon"><Icon aria-hidden="true" size={17} /></span></div>
      <strong className={`metric-value metric-${metric.status}`}>{formatMetric(metric)}</strong>
      <div className="metric-card-bottom"><span>{metric.source}</span>{metric.previous != null && metric.value != null ? <span className="metric-change">{formatChange(metric.value, metric.previous)}</span> : null}</div>
      {metric.detail ? <p className="metric-detail">{metric.detail}</p> : null}
    </article>
  )
}

export function EmptyChart({ title, detail }: { title: string; detail: string }) {
  return <div className="chart-empty"><Activity aria-hidden="true" size={22} /><strong>{title}</strong><span>{detail}</span></div>
}

export function EmptyState({ icon: Icon = Inbox, title, detail, action }: { icon?: LucideIcon; title: string; detail: string; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-icon"><Icon aria-hidden="true" size={19} /></span><strong>{title}</strong><p>{detail}</p>{action}</div>
}

export function SourceReadiness({ sources }: { sources: Record<string, SourceReport> }) {
  return (
    <div className="source-readiness">
      {Object.entries(sources).map(([key, source]) => (
        <div className="source-row" key={key}>
          <span className={`source-symbol source-${key}`} aria-hidden="true">{key === 'youtube' ? 'Y' : key === 'ga4' ? 'G' : key === 'stripe' ? 'S' : 'F'}</span>
          <span><strong>{source.source}</strong><small>{source.detail ?? 'Awaiting configuration'}</small></span>
          <span className={`readiness-status status-${source.status}`}>{source.status === 'connected' ? 'Connected' : source.status === 'error' ? 'Error' : source.status === 'empty' ? 'No data' : 'Not connected'}</span>
        </div>
      ))}
    </div>
  )
}

export function Notice({ children, tone = 'info', onDismiss }: { children: ReactNode; tone?: 'info' | 'error' | 'success'; onDismiss?: () => void }) {
  return <div className={`notice notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}><span>{children}</span>{onDismiss ? <button className="notice-dismiss" type="button" aria-label="Dismiss notification" onClick={onDismiss}><X aria-hidden="true" size={15} /></button> : null}</div>
}

export function InlineAdd({ onClick, label = 'Add item' }: { onClick: () => void; label?: string }) {
  return <button className="inline-add" type="button" onClick={onClick}><Plus aria-hidden="true" size={15} />{label}</button>
}

export function formatMetric(metric: MetricValue) {
  if (metric.status === 'not-connected') return 'Not connected'
  if (metric.status === 'error') return 'Sync error'
  if (metric.status === 'empty') return 'No data in range'
  if (metric.value == null) return 'No data'
  if (metric.unit === 'currency') return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(metric.value)
  if (metric.unit === 'percent') return `${metric.value.toFixed(1)}%`
  return new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 }).format(metric.value)
}

function formatChange(value: number, previous: number) {
  if (previous === 0) return 'New'
  const change = ((value - previous) / previous) * 100
  return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`
}

export function formatDate(value: string) {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(parsed)
}

export function formatCurrency(value: number | null) {
  if (value == null || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

export function stageLabel(stage: string) {
  return { new: 'New', qualified: 'Qualified', proposal: 'Proposal', won: 'Won', lost: 'Lost' }[stage] ?? stage
}

export function stageTone(stage: string) {
  return `stage-${stage}`
}

export function iconForNav(to: string) {
  return to === '/overview' ? Gauge : to === '/analytics' ? Activity : to === '/crm' ? BriefcaseBusiness : to === '/tasks' ? Check : CircleDollarSign
}

export { ChevronDown, Sparkles, Plus, RefreshCw, UsersRound, Gauge, BarChart3 }
