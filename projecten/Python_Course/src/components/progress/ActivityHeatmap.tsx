import { localDateKey, addLocalDays } from '../../state/adaptive-review'
import type { DailyActivity } from '../../domain/progress-types'

export function ActivityHeatmap({ activity }: { activity: Record<string, DailyActivity> }) {
  const days = Array.from({ length: 84 }, (_, index) => addLocalDays(localDateKey(), index - 83))
  return (
    <div>
      <div className="activity-heatmap" role="img" aria-label="Study activity over the last 12 weeks">
        {days.map((day) => {
          const minutes = activity[day]?.minutes ?? 0
          const attempts = activity[day]?.attempts ?? 0
          const level = Math.min(4, minutes >= 60 || attempts >= 6 ? 4 : minutes >= 30 || attempts >= 4 ? 3 : minutes >= 10 || attempts >= 2 ? 2 : minutes > 0 || attempts > 0 ? 1 : 0)
          return <span key={day} className={`heat-cell heat-cell--${level}`} tabIndex={0} title={`${day}: ${minutes} minutes, ${attempts} attempts`} aria-label={`${day}: ${minutes} minutes and ${attempts} attempts`} />
        })}
      </div>
      <div className="heat-legend"><span>Less</span>{[0,1,2,3,4].map((level) => <i key={level} className={`heat-cell heat-cell--${level}`} />)}<span>More</span></div>
    </div>
  )
}
