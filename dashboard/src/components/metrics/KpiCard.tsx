import {
  AlertCircle,
  Clock3,
  FileCheck2,
  ListChecks,
  PanelsTopLeft,
  UsersRound,
} from 'lucide-react'
import type { DashboardKpi } from '../../domain/dashboard-types'

const icons = {
  leads: UsersRound,
  actions: ListChecks,
  proposals: FileCheck2,
  clock: Clock3,
  issues: AlertCircle,
  pages: PanelsTopLeft,
}

export function KpiCard({ label, value, context, tone, icon }: DashboardKpi) {
  const Icon = icons[icon]

  return (
    <article className={`kpi-card kpi-card--${tone}`}>
      <div className="kpi-card__top">
        <span>{label}</span>
        <span className="kpi-card__icon"><Icon aria-hidden="true" size={17} /></span>
      </div>
      <strong>{value}</strong>
      <p>{context}</p>
    </article>
  )
}
