import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WebsiteIssueDatum } from '../../domain/dashboard-types'
import { StatusBadge } from '../ui/StatusBadge'
import { ChartCard } from './ChartCard'
import { ChartTable } from './ChartTable'

type WebsiteIssuesChartProps = { data: WebsiteIssueDatum[] }

const severityLabels = { good: 'Op orde', warning: 'Controle', serious: 'Serieus', critical: 'Kritiek' }

export function WebsiteIssuesChart({ data }: WebsiteIssuesChartProps) {
  return (
    <ChartCard
      eyebrow="ISSUE MIX"
      title="Waar zit websitewerk?"
      description="Open fictieve aandachtspunten gegroepeerd op soort."
      chart={
        <div className="chart-frame chart-frame--bars" aria-label="Staafdiagram van fictieve websiteproblemen">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 14 }}>
              <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
              <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} width={112} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip cursor={{ fill: 'rgba(69, 185, 124, .06)' }} contentStyle={{ display: 'none' }} />
              <Bar dataKey="count" radius={[0, 5, 5, 0]} barSize={18}>
                {data.map((item) => <Cell key={item.category} fill="var(--series-green)" />)}
                <LabelList dataKey="count" position="right" fill="var(--text-primary)" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
      table={<ChartTable caption="Open fictieve websiteproblemen" rows={data} columns={[{ key: 'category', label: 'Categorie' }, { key: 'count', label: 'Aantal', align: 'right' }, { key: 'severity', label: 'Status', format: (value) => severityLabels[value as keyof typeof severityLabels] }]} />}
      legend={<div className="status-legend"><StatusBadge tone="warning" label="Controle" /><StatusBadge tone="critical" label="Kritiek" /></div>}
    />
  )
}
