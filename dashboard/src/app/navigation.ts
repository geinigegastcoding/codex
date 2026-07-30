import {
  BriefcaseBusiness,
  CalendarCheck2,
  CircleDollarSign,
  Globe2,
  Inbox,
  ListChecks,
  ScanSearch,
  type LucideIcon,
} from 'lucide-react'

export type WorkspaceRoute = {
  path: string
  label: string
  shortLabel: string
  description: string
  keywords: string[]
  icon: LucideIcon
}

export const workspaceRoutes: WorkspaceRoute[] = [
  { path: '/today', label: 'Vandaag', shortLabel: 'Vandaag', description: 'Prioriteiten, blokkades en acties', keywords: ['today', 'planning', 'prioriteit'], icon: CalendarCheck2 },
  { path: '/inbox', label: 'Inbox', shortLabel: 'Inbox', description: 'Leg ideeën en werk snel vast', keywords: ['capture', 'idee', 'taak'], icon: Inbox },
  { path: '/projects', label: 'Projecten', shortLabel: 'Projecten', description: 'Actief werk en volgende stappen', keywords: ['project', 'werk', 'status'], icon: BriefcaseBusiness },
  { path: '/decisions', label: 'Besluiten', shortLabel: 'Besluiten', description: 'Keuzes die richting nodig hebben', keywords: ['decision', 'brain', 'keuze'], icon: ListChecks },
  { path: '/review', label: 'Review', shortLabel: 'Review', description: 'Wekelijkse reflectie en voortgang', keywords: ['week', 'reflectie', 'progress'], icon: ScanSearch },
  { path: '/sales', label: 'Sales demo', shortLabel: 'Sales', description: 'Illustratieve acquisitie-workbench', keywords: ['crm', 'leads', 'pipeline'], icon: CircleDollarSign },
  { path: '/website', label: 'Website demo', shortLabel: 'Website', description: 'Illustratieve websitekwaliteit', keywords: ['seo', 'audit', 'issues'], icon: Globe2 },
]
