import type {
  ActivityDay,
  DashboardKpi,
  DashboardRange,
  DashboardScope,
  DemoDashboardDataset,
  DemoLead,
  LeadStage,
  PipelineDatum,
  WebsiteIssueDatum,
} from './dashboard-types'
import { daysBetween } from '../utils/formatting'

const stageLabels: Record<LeadStage, string> = {
  new: 'Nieuw',
  qualified: 'Gekwalificeerd',
  demo: 'Demo voorbereid',
  proposal: 'Voorstel',
  followUp: 'Opvolging',
}

const stageOrder: LeadStage[] = ['new', 'qualified', 'demo', 'proposal', 'followUp']
const severityRank = { good: 0, warning: 1, serious: 2, critical: 3 } as const

function startDate(referenceDate: string, range: DashboardRange) {
  const date = new Date(`${referenceDate}T23:59:59`)
  date.setDate(date.getDate() - (range - 1))
  return date
}

export function getFilteredTimeSeries(dataset: DemoDashboardDataset, range: DashboardRange) {
  const start = startDate(dataset.metadata.referenceDate, range)
  return {
    acquisition: dataset.acquisition.filter((point) => new Date(point.date) >= start),
    visibility: dataset.visibility.filter((point) => new Date(point.date) >= start),
    activity: dataset.activity.filter((event) => new Date(event.occurredAt) >= start),
  }
}

export function getSortedLeads(leads: DemoLead[], referenceDate: string) {
  const now = new Date(`${referenceDate}T12:00:00`).getTime()
  const urgencyRank = { high: 0, medium: 1, low: 2 }

  return [...leads].sort((left, right) => {
    const leftTime = new Date(left.nextActionAt).getTime()
    const rightTime = new Date(right.nextActionAt).getTime()
    const leftOverdue = leftTime < now ? 0 : 1
    const rightOverdue = rightTime < now ? 0 : 1

    return (
      leftOverdue - rightOverdue ||
      urgencyRank[left.urgency] - urgencyRank[right.urgency] ||
      leftTime - rightTime ||
      new Date(left.enteredStageAt).getTime() - new Date(right.enteredStageAt).getTime()
    )
  })
}

export function getPipelineData(dataset: DemoDashboardDataset): PipelineDatum[] {
  return stageOrder.map((stage) => {
    const leads = dataset.leads.filter((lead) => lead.stage === stage)
    const averageDays = leads.length
      ? Math.round(
          leads.reduce(
            (sum, lead) => sum + daysBetween(lead.enteredStageAt, dataset.metadata.referenceDate),
            0,
          ) / leads.length,
        )
      : 0

    return { stage: stageLabels[stage], count: leads.length, averageDays }
  })
}

export function getWebsiteIssueData(dataset: DemoDashboardDataset): WebsiteIssueDatum[] {
  const labels = {
    technical: 'Techniek',
    content: 'Content',
    localSeo: 'Lokale SEO',
    speed: 'Snelheid',
    accessibility: 'Toegankelijkheid',
  }

  return (Object.keys(labels) as Array<keyof typeof labels>).map((category) => {
    const issues = dataset.websiteIssues.filter((issue) => issue.category === category && !issue.resolvedAt)
    const severity = issues.reduce<WebsiteIssueDatum['severity']>(
      (highest, issue) => (severityRank[issue.severity] > severityRank[highest] ? issue.severity : highest),
      'good',
    )

    return { category: labels[category], count: issues.length, severity }
  })
}

export function getActivityDays(dataset: DemoDashboardDataset, range: DashboardRange): ActivityDay[] {
  const filtered = getFilteredTimeSeries(dataset, range).activity
  const counts = new Map<string, number>()

  for (const event of filtered) {
    const date = event.occurredAt.slice(0, 10)
    counts.set(date, (counts.get(date) ?? 0) + 1)
  }

  return Array.from({ length: range }, (_, index) => {
    const date = new Date(`${dataset.metadata.referenceDate}T12:00:00`)
    date.setDate(date.getDate() - (range - 1 - index))
    const iso = date.toISOString().slice(0, 10)
    return { date: iso, count: counts.get(iso) ?? 0 }
  })
}

export function getKpis(dataset: DemoDashboardDataset, range: DashboardRange, scope: DashboardScope): DashboardKpi[] {
  const sortedLeads = getSortedLeads(dataset.leads, dataset.metadata.referenceDate)
  const referenceEnd = new Date(`${dataset.metadata.referenceDate}T23:59:59`).getTime()
  const dueToday = sortedLeads.filter((lead) => lead.nextActionAt.slice(0, 10) === dataset.metadata.referenceDate)
  const overdue = sortedLeads.filter((lead) => new Date(lead.nextActionAt).getTime() < referenceEnd && !dueToday.includes(lead))
  const proposals = dataset.leads.filter((lead) => lead.proposalOutstanding)
  const averageDays = Math.round(
    dataset.leads.reduce(
      (sum, lead) => sum + daysBetween(lead.enteredStageAt, dataset.metadata.referenceDate),
      0,
    ) / dataset.leads.length,
  )
  const issues = dataset.websiteIssues.filter((issue) => !issue.resolvedAt)
  const visible = getFilteredTimeSeries(dataset, range).visibility
  const indexedPages = visible.at(-1)?.pagesIndexed ?? 0

  const kpis: DashboardKpi[] = [
    { label: 'Open leads', value: String(dataset.leads.length), context: `${dueToday.length + overdue.length} vragen nu aandacht`, tone: 'neutral', icon: 'leads' },
    { label: 'Acties vandaag', value: String(dueToday.length + overdue.length), context: overdue.length ? `${overdue.length} actie is achterstallig` : 'Alles ligt op schema', tone: overdue.length ? 'attention' : 'positive', icon: 'actions' },
    { label: 'Openstaande voorstellen', value: String(proposals.length), context: 'Fictieve voorstellen zonder bedragen', tone: 'neutral', icon: 'proposals' },
    { label: 'Gem. dagen in fase', value: String(averageDays), context: `Gemeten over ${dataset.leads.length} demo-leads`, tone: averageDays > 7 ? 'attention' : 'neutral', icon: 'clock' },
    { label: 'Websiteproblemen', value: String(issues.length), context: `${issues.filter((issue) => issue.severity === 'critical').length} kritisch aandachtspunt`, tone: issues.some((issue) => issue.severity === 'critical') ? 'attention' : 'neutral', icon: 'issues' },
    { label: 'Geïndexeerde pagina’s', value: String(indexedPages), context: `Illustratieve stand · ${range} dagen`, tone: 'positive', icon: 'pages' },
  ]

  if (scope === 'sales') return kpis.slice(0, 4)
  if (scope === 'website') return kpis.slice(4)
  return kpis
}
