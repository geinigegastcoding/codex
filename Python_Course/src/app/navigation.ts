import { Award, BarChart3, BookOpen, BrainCircuit, CalendarCheck, FolderKanban, Map, Settings, type LucideIcon } from 'lucide-react'

export type NavigationItem = { to: string; label: string; description: string; icon: LucideIcon }

export const navigation: NavigationItem[] = [
  { to: '/today', label: 'Today', description: 'Your next session', icon: CalendarCheck },
  { to: '/course', label: 'Course map', description: 'Complete Python path', icon: Map },
  { to: '/certifications', label: 'Certifications', description: 'Objective readiness', icon: Award },
  { to: '/practice', label: 'Practice', description: 'Adaptive review', icon: BrainCircuit },
  { to: '/projects', label: 'Projects', description: 'Build real things', icon: FolderKanban },
  { to: '/progress', label: 'Progress', description: 'Mastery and streaks', icon: BarChart3 },
  { to: '/resources', label: 'Resources', description: 'Videos and docs', icon: BookOpen },
  { to: '/settings', label: 'Settings', description: 'Rest and backups', icon: Settings },
]
