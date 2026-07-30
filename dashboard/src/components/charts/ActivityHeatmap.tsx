import type { ActivityDay } from '../../domain/dashboard-types'
import { formatDate } from '../../utils/formatting'
import { ChartCard } from './ChartCard'
import { ChartTable } from './ChartTable'

type ActivityHeatmapProps = { data: ActivityDay[] }

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const max = Math.max(...data.map((day) => day.count), 1)
  return (
    <ChartCard
      eyebrow="EXECUTION RHYTHM"
      title="Hoe consistent wordt uitgevoerd?"
      description="Voltooide fictieve acties per dag."
      summary={`${data.reduce((sum, day) => sum + day.count, 0)} totaal`}
      chart={
        <div className="heatmap-wrap">
          <div className="heatmap" role="img" aria-label="Heatmap van voltooide fictieve acties per dag">
            {data.map((day) => {
              const level = day.count === 0 ? 0 : Math.max(1, Math.ceil((day.count / max) * 4))
              return <span key={day.date} className={`heat-cell heat-cell--${level}`} tabIndex={0} title={`${formatDate(day.date)}: ${day.count} acties`} aria-label={`${formatDate(day.date)}: ${day.count} acties`} />
            })}
          </div>
          <div className="heat-legend"><span>Minder</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`heat-cell heat-cell--${level}`} />)}<span>Meer</span></div>
        </div>
      }
      table={<ChartTable caption="Voltooide fictieve acties per dag" rows={data} columns={[{ key: 'date', label: 'Datum', format: (value) => formatDate(String(value)) }, { key: 'count', label: 'Acties', align: 'right' }]} />}
    />
  )
}
