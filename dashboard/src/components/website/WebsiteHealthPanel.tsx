import { CheckCircle2, Gauge, ShieldCheck, TriangleAlert } from 'lucide-react'
import type { WebsiteIssue } from '../../domain/dashboard-types'
import { StatusBadge } from '../ui/StatusBadge'

type WebsiteHealthPanelProps = {
  issues: WebsiteIssue[]
}

export function WebsiteHealthPanel({ issues }: WebsiteHealthPanelProps) {
  const openIssues = issues.filter((issue) => !issue.resolvedAt)
  const critical = openIssues.filter((issue) => issue.severity === 'critical').length
  const checks = [
    { label: 'Technische basis', status: 'Controle nodig', icon: Gauge, tone: 'warning' as const },
    { label: 'Toegankelijkheid', status: critical ? 'Actie vereist' : 'Op orde', icon: ShieldCheck, tone: critical ? 'critical' as const : 'good' as const },
    { label: 'Contentstructuur', status: 'Verbeterkans', icon: TriangleAlert, tone: 'serious' as const },
    { label: 'Demo-databron', status: 'Duidelijk gemarkeerd', icon: CheckCircle2, tone: 'good' as const },
  ]

  return (
    <article className="panel health-panel">
      <header className="panel-header">
        <div><p className="eyebrow">WEBSITE HEALTH</p><h3>Demo-aandachtspunten</h3></div>
        <span className="panel-count">{openIssues.length} open</span>
      </header>
      <p className="panel-description">Wat vraagt aandacht voordat de volgende acquisitieronde start?</p>
      <div className="health-list">
        {checks.map(({ label, status, icon: Icon, tone }) => (
          <div key={label}>
            <span className="health-icon"><Icon aria-hidden="true" size={17} /></span>
            <strong>{label}</strong>
            <StatusBadge tone={tone} label={status} />
          </div>
        ))}
      </div>
      <div className="health-footer"><span>Bronstatus</span><strong>Illustratieve demo · niet live gekoppeld</strong></div>
    </article>
  )
}
