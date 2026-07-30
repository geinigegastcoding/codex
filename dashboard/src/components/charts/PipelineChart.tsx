import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PipelineDatum } from '../../domain/dashboard-types'
import { ChartCard } from './ChartCard'
import { ChartTable } from './ChartTable'

type PipelineChartProps = { data: PipelineDatum[] }

export function PipelineChart({ data }: PipelineChartProps) {
  return (
    <ChartCard
      eyebrow="PIPELINE"
      title="Waar staan de demo-leads?"
      description="Verdeling per fase, zonder omzet- of klantclaims."
      summary={`${data.reduce((sum, item) => sum + item.count, 0)} open`}
      chart={
        <div className="chart-frame chart-frame--bars" aria-label="Staafdiagram van demo-leads per pipelinefase">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 14 }}>
              <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
              <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} width={108} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip cursor={{ fill: 'rgba(69, 185, 124, .06)' }} contentStyle={{ display: 'none' }} />
              <Bar dataKey="count" radius={[0, 5, 5, 0]} barSize={18} fill="var(--series-green)">
                {data.map((item) => <Cell key={item.stage} fill="var(--series-green)" />)}
                <LabelList dataKey="count" position="right" fill="var(--text-primary)" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
      table={<ChartTable caption="Demo-leads per pipelinefase" rows={data} columns={[{ key: 'stage', label: 'Fase' }, { key: 'count', label: 'Leads', align: 'right' }, { key: 'averageDays', label: 'Gem. dagen', align: 'right' }]} />}
    />
  )
}
