import { CheckCircle2, FileText, Globe2, UserPlus } from 'lucide-react'
import type { ActivityEvent } from '../../domain/dashboard-types'
import { formatDateTime } from '../../utils/formatting'

const icons = {
  action: CheckCircle2,
  lead: UserPlus,
  proposal: FileText,
  website: Globe2,
}

type RecentActivityProps = {
  activity: ActivityEvent[]
}

export function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <article className="panel activity-panel">
      <header className="panel-header">
        <div><p className="eyebrow">UITVOERING</p><h3>Recente activiteit</h3></div>
        <span className="panel-meta">Fictieve gebeurtenissen</span>
      </header>
      <div className="activity-list">
        {activity.slice(0, 6).map((event) => {
          const Icon = icons[event.type]
          return (
            <div className="activity-row" key={event.id}>
              <span className={`activity-icon activity-icon--${event.type}`}><Icon aria-hidden="true" size={16} /></span>
              <div className="activity-row__content"><strong>{event.title}</strong><span>{event.detail}</span></div>
              <time dateTime={event.occurredAt}>{formatDateTime(event.occurredAt)}</time>
            </div>
          )
        })}
      </div>
    </article>
  )
}
