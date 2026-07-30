import type { DashboardKpi } from '../../domain/dashboard-types'
import { KpiCard } from './KpiCard'

type KpiGridProps = {
  kpis: DashboardKpi[]
}

export function KpiGrid({ kpis }: KpiGridProps) {
  return <div className="kpi-grid">{kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}</div>
}
