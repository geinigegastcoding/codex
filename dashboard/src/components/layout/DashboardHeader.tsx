import { CalendarDays, Command, Search } from 'lucide-react'
import type { DashboardRange, DashboardScope } from '../../domain/dashboard-types'
import { dutchLongDateFormatter } from '../../utils/formatting'
import { DemoDataBadge } from '../ui/DemoDataBadge'
import { SegmentedControl } from '../ui/SegmentedControl'

type DashboardHeaderProps = {
  referenceDate: string
  range: DashboardRange
  scope: DashboardScope
  disclosure: string
  onRangeChange: (range: DashboardRange) => void
  onScopeChange: (scope: DashboardScope) => void
}

export function DashboardHeader({
  referenceDate,
  range,
  scope,
  disclosure,
  onRangeChange,
  onScopeChange,
}: DashboardHeaderProps) {
  const formattedDate = dutchLongDateFormatter.format(new Date(`${referenceDate}T12:00:00`))

  return (
    <header className="dashboard-header" id="overzicht">
      <div className="topbar">
        <div className="topbar-status"><span /> Systeemoverzicht</div>
        <div className="topbar-actions">
          <button type="button" aria-label="Zoeken in demo"><Search aria-hidden="true" size={17} /></button>
          <kbd><Command aria-hidden="true" size={12} /> K</kbd>
        </div>
      </div>

      <div className="header-copy">
        <div>
          <p className="eyebrow">MAGISDATA COMMAND CENTER</p>
          <h1>Goedemorgen, Daniël.</h1>
          <p>Jij bepaalt de richting. Het systeem houdt de uitvoering scherp.</p>
        </div>
        <div className="header-date">
          <CalendarDays aria-hidden="true" size={17} />
          <span>{formattedDate}</span>
          <DemoDataBadge />
        </div>
      </div>

      <div className="disclosure" role="note">
        <strong>Demo-omgeving</strong>
        <span>{disclosure}</span>
      </div>

      <div className="global-filters" aria-label="Dashboardfilters">
        <SegmentedControl
          label="Periode"
          value={range}
          onChange={onRangeChange}
          options={[{ label: '7 dagen', value: 7 }, { label: '30 dagen', value: 30 }, { label: '90 dagen', value: 90 }]}
        />
        <SegmentedControl
          label="Onderdeel"
          value={scope}
          onChange={onScopeChange}
          options={[{ label: 'Alles', value: 'all' }, { label: 'Sales', value: 'sales' }, { label: 'Website', value: 'website' }]}
        />
      </div>
    </header>
  )
}
