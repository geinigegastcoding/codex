import { useState, type ReactNode } from 'react'
import { SegmentedControl } from '../ui/SegmentedControl'

type ChartCardProps = {
  eyebrow: string
  title: string
  description: string
  summary?: string
  legend?: ReactNode
  chart: ReactNode
  table: ReactNode
  className?: string
}

export function ChartCard({ eyebrow, title, description, summary, legend, chart, table, className = '' }: ChartCardProps) {
  const [view, setView] = useState<'chart' | 'table'>('chart')

  return (
    <article className={`panel chart-card ${className}`}>
      <header className="chart-card__header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
          <span>{description}</span>
        </div>
        {summary && <strong className="chart-summary">{summary}</strong>}
      </header>
      <div className="chart-card__toolbar">
        {legend ?? <span />}
        <SegmentedControl
          compact
          label={`Weergave voor ${title}`}
          value={view}
          onChange={setView}
          options={[{ label: 'Grafiek', value: 'chart' }, { label: 'Tabel', value: 'table' }]}
        />
      </div>
      <div className="chart-card__body">{view === 'chart' ? chart : table}</div>
      <footer>Bron: fictieve demonstratiedata</footer>
    </article>
  )
}
