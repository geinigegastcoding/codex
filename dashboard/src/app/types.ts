export type ConnectorStatus = 'connected' | 'not-connected' | 'empty' | 'error' | 'syncing'

export type MetricValue = {
  value: number | null
  unit: 'count' | 'currency' | 'minutes' | 'percent'
  source: string
  status: ConnectorStatus
  detail?: string
  previous?: number | null
}

export type TrendPoint = {
  date: string
  users?: number
  sessions?: number
  leads?: number
  views?: number
  revenue?: number
  watchMinutes?: number
}

export type SourceReport = {
  status: ConnectorStatus
  source: string
  detail?: string
  syncedAt?: string
  metrics?: Record<string, number | null>
  series?: TrendPoint[]
  items?: Array<Record<string, string | number | null>>
}

export type DashboardSnapshot = {
  generatedAt: string
  range: '7d' | '30d' | '90d'
  metrics: {
    visitors: MetricValue
    leads: MetricValue
    youtubeViews: MetricValue
    revenue: MetricValue
  }
  acquisition: TrendPoint[]
  sources: {
    ga4: SourceReport
    youtube: SourceReport
    stripe: SourceReport
    formspree: SourceReport
  }
}

export type LeadStage = 'new' | 'qualified' | 'proposal' | 'won' | 'lost'

export type Lead = {
  id: string
  company: string
  name: string
  email: string
  stage: LeadStage
  source: string
  nextAction: string
  nextActionAt: string
  notes: string[]
  value: number | null
  createdAt: string
  updatedAt: string
}

export type CrmSnapshot = {
  updatedAt: string | null
  leads: Lead[]
}

export type IntegrationConfig = {
  name: string
  key: string
  description: string
  status: ConnectorStatus
  detail: string
}
