import { AlertTriangle, CheckCircle2, Circle, Clock3 } from 'lucide-react'
import type { IssueSeverity, Urgency } from '../../domain/dashboard-types'

type StatusBadgeProps = {
  tone: IssueSeverity | Urgency | 'neutral'
  label: string
}

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const Icon = tone === 'critical' || tone === 'high'
    ? AlertTriangle
    : tone === 'warning' || tone === 'medium'
      ? Clock3
      : tone === 'good'
        ? CheckCircle2
        : Circle

  return (
    <span className={`status-badge status-badge--${tone}`}>
      <Icon aria-hidden="true" size={12} />
      {label}
    </span>
  )
}
