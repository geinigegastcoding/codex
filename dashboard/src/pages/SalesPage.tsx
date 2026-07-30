import { useMemo, useState } from 'react'
import { AcquisitionPulseChart } from '../components/charts/AcquisitionPulseChart'
import { ActivityHeatmap } from '../components/charts/ActivityHeatmap'
import { PipelineChart } from '../components/charts/PipelineChart'
import { PageHeader } from '../components/layout/PageHeader'
import { KpiGrid } from '../components/metrics/KpiGrid'
import { TodayQueue } from '../components/operations/TodayQueue'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { demoDashboard } from '../data/demo-dashboard'
import { getActivityDays, getFilteredTimeSeries, getKpis, getPipelineData, getSortedLeads } from '../domain/dashboard-selectors'
import type { DashboardRange } from '../domain/dashboard-types'

export default function SalesPage() {
  const [range, setRange] = useState<DashboardRange>(30)
  const view = useMemo(() => ({
    timeSeries: getFilteredTimeSeries(demoDashboard, range),
    kpis: getKpis(demoDashboard, range, 'sales'),
    leads: getSortedLeads(demoDashboard.leads, demoDashboard.metadata.referenceDate),
    pipeline: getPipelineData(demoDashboard),
    activityDays: getActivityDays(demoDashboard, range),
  }), [range])
  return (
    <div className="page analytics-page">
      <PageHeader eyebrow="ILLUSTRATIVE WORKBENCH" title="Sales demo" description="Een fictieve Sales OS-omgeving om queue, next actions en visualisaties te beoordelen—niet als echte funnelrapportage." provenance="demo" actions={<SegmentedControl label="Periode Sales demo" value={range} onChange={setRange} options={[{ label: '7 dagen', value: 7 }, { label: '30 dagen', value: 30 }, { label: '90 dagen', value: 90 }]} />} />
      <div className="demo-disclosure"><strong>Geen live CRM</strong><span>Alle organisaties, contacten, activiteiten en waarden op deze pagina zijn fictief.</span></div>
      <KpiGrid kpis={view.kpis} />
      <div className="dashboard-grid dashboard-grid--sales"><TodayQueue leads={view.leads} referenceDate={demoDashboard.metadata.referenceDate} /><PipelineChart data={view.pipeline} /></div>
      <div className="dashboard-grid dashboard-grid--analytics"><AcquisitionPulseChart data={view.timeSeries.acquisition} /><ActivityHeatmap data={view.activityDays} /></div>
    </div>
  )
}
