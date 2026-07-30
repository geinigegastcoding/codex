import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { AcquisitionPoint } from '../../domain/dashboard-types'
import { formatDate } from '../../utils/formatting'
import { ChartCard } from './ChartCard'
import { ChartTable } from './ChartTable'
import { TooltipContent } from '../ui/TooltipContent'

type AcquisitionPulseChartProps = { data: AcquisitionPoint[] }

type TooltipPayload = { dataKey?: string | number; name?: string; value?: string | number; color?: string }
type CustomTooltipProps = { active?: boolean; label?: string; payload?: TooltipPayload[] }

function AcquisitionTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !label || !payload?.length) return null
  return <TooltipContent label={formatDate(label)} items={payload.map((item) => ({ name: String(item.name ?? item.dataKey), value: item.value ?? 0, color: item.color ?? '#fff' }))} />
}

export function AcquisitionPulseChart({ data }: AcquisitionPulseChartProps) {
  const total = data.reduce((sum, item) => sum + item.outreach, 0)
  return (
    <ChartCard
      className="chart-card--wide"
      eyebrow="ACQUISITION PULSE"
      title="Wordt acquisitie consequent uitgevoerd?"
      description="Acties, reacties en gesprekken binnen dezelfde fictieve periode."
      summary={`${total} acties`}
      legend={
        <ul className="chart-legend" aria-label="Legenda acquisitieactiviteit">
          <li><i className="chart-legend__line chart-legend__line--green" aria-hidden="true" /><span>Outreachacties</span></li>
          <li><i className="chart-legend__line chart-legend__line--blue" aria-hidden="true" /><span>Reacties</span></li>
          <li><i className="chart-legend__line chart-legend__line--orange" aria-hidden="true" /><span>Gesprekken</span></li>
        </ul>
      }
      chart={
        <div className="chart-frame" aria-label="Lijndiagram van fictieve acquisitieactiviteit">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: -18 }}>
              <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} minTickGap={28} tickFormatter={formatDate} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip content={<AcquisitionTooltip />} cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }} />
              <Line type="monotone" dataKey="outreach" name="Outreachacties" stroke="var(--series-green)" strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: 'var(--surface-1)', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="replies" name="Reacties" stroke="var(--series-blue)" strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: 'var(--surface-1)', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="meetings" name="Gesprekken" stroke="var(--series-orange)" strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: 'var(--surface-1)', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      }
      table={<ChartTable caption="Fictieve acquisitieactiviteit per dag" rows={data} columns={[{ key: 'date', label: 'Datum', format: (value) => formatDate(String(value)) }, { key: 'outreach', label: 'Acties', align: 'right' }, { key: 'replies', label: 'Reacties', align: 'right' }, { key: 'meetings', label: 'Gesprekken', align: 'right' }]} />}
    />
  )
}
