export type DashboardRange = 7 | 30 | 90
export type DashboardScope = 'all' | 'sales' | 'website'
export type LeadStage = 'new' | 'qualified' | 'demo' | 'proposal' | 'followUp'
export type Urgency = 'low' | 'medium' | 'high'
export type IssueSeverity = 'good' | 'warning' | 'serious' | 'critical'

export type DemoMetadata = {
  mode: 'illustrative'
  label: string
  disclosure: string
  referenceDate: string
}

export type FounderFocus = {
  priority: string
  supportingActions: string[]
  decisions: {
    founder: string[]
    executor: string[]
  }
  evidenceReadiness: Array<{
    label: string
    status: 'demo' | 'not-connected'
  }>
  weeklyReviewPrompt: string
}

export type DemoLead = {
  id: string
  fictional: true
  companyName: string
  contactName: string
  stage: LeadStage
  source: 'local-outreach' | 'website-demo' | 'referral-demo'
  createdAt: string
  enteredStageAt: string
  nextAction: string
  nextActionAt: string
  urgency: Urgency
  proposalOutstanding: boolean
  notes: string[]
}

export type AcquisitionPoint = {
  date: string
  outreach: number
  replies: number
  meetings: number
}

export type VisibilityPoint = {
  date: string
  pagesIndexed: number
}

export type WebsiteIssue = {
  id: string
  fictional: true
  category: 'technical' | 'content' | 'localSeo' | 'speed' | 'accessibility'
  label: string
  severity: IssueSeverity
  foundAt: string
  resolvedAt?: string
}

export type ActivityEvent = {
  id: string
  fictional: true
  occurredAt: string
  type: 'lead' | 'action' | 'proposal' | 'website'
  title: string
  detail: string
}

export type DemoDashboardDataset = {
  metadata: DemoMetadata
  profile: {
    name: string
    role: string
    company: string
    region: string
  }
  founderFocus: FounderFocus
  leads: DemoLead[]
  acquisition: AcquisitionPoint[]
  visibility: VisibilityPoint[]
  websiteIssues: WebsiteIssue[]
  activity: ActivityEvent[]
}

export type DashboardKpi = {
  label: string
  value: string
  context: string
  tone: 'neutral' | 'positive' | 'attention'
  icon: 'leads' | 'actions' | 'proposals' | 'clock' | 'issues' | 'pages'
}

export type PipelineDatum = {
  stage: string
  count: number
  averageDays: number
}

export type WebsiteIssueDatum = {
  category: string
  count: number
  severity: IssueSeverity
}

export type ActivityDay = {
  date: string
  count: number
}
