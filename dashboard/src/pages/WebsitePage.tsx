import { useMemo, useState } from 'react'
import { VisibilityChart } from '../components/charts/VisibilityChart'
import { WebsiteIssuesChart } from '../components/charts/WebsiteIssuesChart'
import { PageHeader } from '../components/layout/PageHeader'
import { KpiGrid } from '../components/metrics/KpiGrid'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { WebsiteHealthPanel } from '../components/website/WebsiteHealthPanel'
import { demoDashboard } from '../data/demo-dashboard'
import { getFilteredTimeSeries, getKpis, getWebsiteIssueData } from '../domain/dashboard-selectors'
import type { DashboardRange } from '../domain/dashboard-types'

export default function WebsitePage() {
  const [range, setRange] = useState<DashboardRange>(30)
  const view = useMemo(() => ({ timeSeries: getFilteredTimeSeries(demoDashboard, range), kpis: getKpis(demoDashboard, range, 'website'), issues: getWebsiteIssueData(demoDashboard) }), [range])
  return (
    <div className="page analytics-page">
      <PageHeader eyebrow="QUALITY WORKBENCH" title="Website demo" description="Illustratieve auditdata naast de eerlijke status van de echte bron: niet verbonden en productie nog te verifiëren." provenance="demo" actions={<SegmentedControl label="Periode Website demo" value={range} onChange={setRange} options={[{ label: '7 dagen', value: 7 }, { label: '30 dagen', value: 30 }, { label: '90 dagen', value: 90 }]} />} />
      <div className="evidence-strip"><div><span>Websitebron</span><strong>Onbekend / te bevestigen</strong></div><div><span>Productie-audit</span><strong>Niet uitgevoerd vanuit deze checkout</strong></div><div><span>Analytics</span><strong>Niet gekoppeld</strong></div></div>
      <KpiGrid kpis={view.kpis} />
      <div className="dashboard-grid dashboard-grid--website"><WebsiteHealthPanel issues={demoDashboard.websiteIssues} /><VisibilityChart data={view.timeSeries.visibility} /><WebsiteIssuesChart data={view.issues} /></div>
    </div>
  )
}
