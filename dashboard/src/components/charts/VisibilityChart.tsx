import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { VisibilityPoint } from '../../domain/dashboard-types'
import { formatDate } from '../../utils/formatting'
import { ChartCard } from './ChartCard'
import { ChartTable } from './ChartTable'
import { TooltipContent } from '../ui/TooltipContent'

type VisibilityChartProps = { data: VisibilityPoint[] }
type VisibilityTooltipProps = { active?: boolean; label?: string; payload?: Array<{ value?: string | number }> }

function VisibilityTooltip({ active, label, payload }: VisibilityTooltipProps) {
  if (!active || !label || !payload?.[0]) return null
  return <TooltipContent label={formatDate(label)} items={[{ name: 'Geïndexeerde pagina’s', value: payload[0].value ?? 0, color: '#45b97c' }]} />
}

export function VisibilityChart({ data }: VisibilityChartProps) {
  const current = data.at(-1)?.pagesIndexed ?? 0
  return (
    <ChartCard
      eyebrow="ZICHTBAARHEID"
      title="Geïndexeerde demo-pagina’s"
      description="Eén meetreeks, zonder verkeers- of rankingclaims."
      summary={String(current)}
      chart={
        <div className="chart-frame" aria-label="Gebiedsdiagram van fictief geïndexeerde pagina’s">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 14, bottom: 0, left: -18 }}>
              <defs><linearGradient id="visibility-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--series-green)" stopOpacity="0.18" /><stop offset="100%" stopColor="var(--series-green)" stopOpacity="0" /></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} minTickGap={28} tickFormatter={formatDate} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip content={<VisibilityTooltip />} cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="pagesIndexed" stroke="var(--series-green)" strokeWidth={2} fill="url(#visibility-fill)" activeDot={{ r: 5, stroke: 'var(--surface-1)', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      }
      table={<ChartTable caption="Fictief aantal geïndexeerde pagina’s" rows={data} columns={[{ key: 'date', label: 'Datum', format: (value) => formatDate(String(value)) }, { key: 'pagesIndexed', label: 'Pagina’s', align: 'right' }]} />}
    />
  )
}
