import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Download,
  ExternalLink,
  FileUp,
  Filter,
  Globe2,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Trash2,
  UploadCloud,
  UsersRound,
  X,
  Youtube,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getCrm, getSnapshot, saveCrm, syncConnectors } from './app/api'
import {
  Brand,
  EmptyChart,
  EmptyState,
  HeaderBar,
  InlineAdd,
  MetricCard,
  MobileNav,
  Notice,
  PageHeader,
  Panel,
  PrimaryButton,
  RangeControl,
  SecondaryButton,
  Sidebar,
  SourceBadge,
  SourceReadiness,
  formatCurrency,
  formatDate,
  formatMetric,
  stageLabel,
  stageTone,
} from './app/components'
import type { ConnectorStatus, CrmSnapshot, DashboardSnapshot, Lead, LeadStage, MetricValue, SourceReport, TrendPoint } from './app/types'

type Range = DashboardSnapshot['range']
type AnalyticsSource = 'ga4' | 'youtube' | 'stripe' | 'formspree'

const stages: LeadStage[] = ['new', 'qualified', 'proposal', 'won', 'lost']

function source(sourceName: string, status: ConnectorStatus, detail: string): SourceReport {
  return { source: sourceName, status, detail, metrics: {}, series: [] }
}

function unavailableSnapshot(range: Range, detail: string): DashboardSnapshot {
  const offline = (name: string) => source(name, 'error', detail)
  const metric = (name: string): MetricValue => ({ value: null, unit: 'count', source: name, status: 'error', detail })
  return {
    generatedAt: new Date().toISOString(),
    range,
    metrics: {
      visitors: metric('GA4'),
      leads: metric('GA4 / Formspree'),
      youtubeViews: metric('YouTube'),
      revenue: { ...metric('Stripe'), unit: 'currency' },
    },
    acquisition: [],
    sources: {
      ga4: offline('GA4'),
      youtube: offline('YouTube'),
      stripe: offline('Stripe'),
      formspree: offline('Formspree'),
    },
  }
}

function localCrm(): CrmSnapshot {
  try {
    const saved = window.localStorage.getItem('magisdata-crm')
    if (saved) return JSON.parse(saved) as CrmSnapshot
  } catch {
    // A corrupt browser cache should not prevent a clean workspace from opening.
  }
  return { updatedAt: null, leads: [] }
}

function displayError(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

function AppWorkspace() {
  const [range, setRange] = useState<Range>('30d')
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(() => unavailableSnapshot('30d', 'Waiting for the local API'))
  const [crm, setCrm] = useState<CrmSnapshot>(() => localCrm())
  const [apiReady, setApiReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [notice, setNotice] = useState<{ tone: 'info' | 'error' | 'success'; text: string } | null>(null)

  const loadSnapshot = useCallback(async (nextRange: Range) => {
    setLoading(true)
    try {
      const next = await getSnapshot(nextRange)
      setSnapshot(next)
      setApiReady(true)
    } catch (error) {
      setSnapshot(unavailableSnapshot(nextRange, `Local API unavailable: ${displayError(error)}`))
      setApiReady(false)
      setNotice({ tone: 'error', text: `The data layer could not be reached. ${displayError(error)}` })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadSnapshot(range) }, [loadSnapshot, range])

  useEffect(() => {
    getCrm().then((next) => {
      setCrm(next)
      window.localStorage.setItem('magisdata-crm', JSON.stringify(next))
    }).catch(() => {
      setCrm(localCrm())
    })
  }, [])

  async function handleSync() {
    setSyncing(true)
    try {
      const next = await syncConnectors()
      setSnapshot(next)
      setApiReady(true)
      setNotice({ tone: 'success', text: 'Data sources evaluated. Metrics below reflect their current connection state.' })
    } catch (error) {
      setNotice({ tone: 'error', text: `Sync failed. ${displayError(error)}` })
    } finally {
      setSyncing(false)
    }
  }

  async function handleCrmSave(next: CrmSnapshot) {
    try {
      const saved = await saveCrm(next)
      setCrm(saved)
      window.localStorage.setItem('magisdata-crm', JSON.stringify(saved))
      setNotice({ tone: 'success', text: 'CRM saved locally.' })
    } catch (error) {
      setCrm(next)
      window.localStorage.setItem('magisdata-crm', JSON.stringify(next))
      setNotice({ tone: 'error', text: `Saved in this browser only. ${displayError(error)}` })
    }
  }

  return (
    <div className="app-frame">
      <Sidebar apiReady={apiReady} />
      <div className="main-column">
        <div className="mobile-topbar"><Brand /><MobileNav /></div>
        <HeaderBar syncing={syncing || loading} onSync={handleSync} />
        {notice ? <Notice tone={notice.tone} onDismiss={() => setNotice(null)}>{notice.text}</Notice> : null}
        <main className="content-area">
          <Routes>
            <Route index element={<Navigate replace to="/overview" />} />
            <Route path="overview" element={<OverviewPage snapshot={snapshot} crm={crm} range={range} setRange={setRange} onSync={handleSync} loading={loading} />} />
            <Route path="analytics" element={<AnalyticsPage snapshot={snapshot} range={range} setRange={setRange} />} />
            <Route path="crm" element={<CrmPage crm={crm} onSave={handleCrmSave} />} />
            <Route path="tasks" element={<TasksPage crm={crm} onSave={handleCrmSave} />} />
            <Route path="integrations" element={<IntegrationsPage snapshot={snapshot} onSync={handleSync} syncing={syncing} />} />
            <Route path="*" element={<Navigate replace to="/overview" />} />
          </Routes>
        </main>
        <footer className="app-footer"><span>MagisData · private workspace</span><span>{snapshot.generatedAt ? `Last evaluated ${formatDate(snapshot.generatedAt)}` : 'Waiting for source data'}</span></footer>
      </div>
    </div>
  )
}

function OverviewPage({ snapshot, crm, range, setRange, onSync, loading }: { snapshot: DashboardSnapshot; crm: CrmSnapshot; range: Range; setRange: (value: Range) => void; onSync: () => void; loading: boolean }) {
  const attention = useMemo(() => crm.leads.filter((lead) => lead.nextAction).sort((a, b) => actionTime(a) - actionTime(b)).slice(0, 4), [crm.leads])
  const sourceErrors = Object.values(snapshot.sources).filter((item) => item.status === 'error')
  return (
    <>
      <PageHeader
        eyebrow="Founder view · live sources only"
        title="Business command center"
        description="One calm surface for the work that matters: audience, acquisition, revenue, and the next conversation."
        actions={<><RangeControl value={range} onChange={setRange} /><PrimaryButton onClick={onSync} disabled={loading}><RefreshIcon spinning={loading} />{loading ? 'Refreshing' : 'Sync now'}</PrimaryButton></>}
      />
      {sourceErrors.length ? <Notice tone="info">Some sources need setup. The dashboard keeps their cards visible so the boundary between known and unknown stays clear.</Notice> : null}
      <div className="metric-grid">
        <MetricCard label="Website visitors" metric={snapshot.metrics.visitors} icon={Globe2} />
        <MetricCard label="Leads / signups" metric={snapshot.metrics.leads} icon={UsersRound} />
        <MetricCard label="YouTube views" metric={snapshot.metrics.youtubeViews} icon={Youtube} />
        <MetricCard label="Revenue" metric={snapshot.metrics.revenue} icon={CreditCard} />
      </div>
      <div className="overview-grid">
        <Panel className="panel-chart panel-span-2" title="Acquisition pulse" description={`Daily users and leads in the last ${range.replace('d', ' days')}.`} action={<SourceBadge source="GA4" status={snapshot.sources.ga4.status} />}>
          {snapshot.acquisition.length ? <AcquisitionChart data={snapshot.acquisition} /> : <EmptyChart title="Connect GA4 to see your acquisition curve" detail={snapshot.sources.ga4.detail ?? 'No daily rows are available for this range.'} />}
        </Panel>
        <Panel title="Attention today" description="Only records with a real next action appear here." action={<a className="panel-link" href="#/crm">Open CRM <ArrowRight aria-hidden="true" size={14} /></a>}>
          {attention.length ? <div className="attention-list">{attention.map((lead) => <AttentionRow key={lead.id} lead={lead} />)}</div> : <EmptyState icon={CheckCircle2} title="Nothing queued" detail="Add a next action to a CRM lead and it will appear here." action={<a className="text-link" href="#/crm">Open the CRM <ArrowRight aria-hidden="true" size={14} /></a>} />}
        </Panel>
      </div>
      <div className="overview-grid overview-grid-bottom">
        <Panel title="Source readiness" description="Every number on this page points back to a source." action={<a className="panel-link" href="#/integrations">Manage sources <ArrowRight aria-hidden="true" size={14} /></a>}>
          <SourceReadiness sources={snapshot.sources} />
        </Panel>
        <Panel title="What this workspace knows" description="The useful distinction is between a zero and an unknown value.">
          <div className="definition-list">
            <div><span className="definition-key blue" /><span><strong>Connected</strong><small>Source responded with real data.</small></span></div>
            <div><span className="definition-key green" /><span><strong>No data in range</strong><small>Source is connected but returned no rows.</small></span></div>
            <div><span className="definition-key gray" /><span><strong>Not connected</strong><small>Credentials or source setup are still missing.</small></span></div>
          </div>
          <div className="workspace-note"><SparkleIcon /><span>Connect the sources you already own. The surface stays useful before everything is wired.</span></div>
        </Panel>
      </div>
    </>
  )
}

function AnalyticsPage({ snapshot, range, setRange }: { snapshot: DashboardSnapshot; range: Range; setRange: (value: Range) => void }) {
  const [active, setActive] = useState<AnalyticsSource>('ga4')
  const report = snapshot.sources[active]
  const label = active === 'ga4' ? 'Website' : active === 'youtube' ? 'YouTube' : active === 'stripe' ? 'Revenue' : 'Signups'
  return (
    <>
      <PageHeader eyebrow="Evidence layer" title="Analytics that stay honest" description="Choose a source, inspect the trend, and trace every number back to the tool that produced it." actions={<RangeControl value={range} onChange={setRange} />} />
      <div className="analytics-tabs" role="tablist" aria-label="Analytics sources">
        {(['ga4', 'youtube', 'stripe', 'formspree'] as AnalyticsSource[]).map((key) => {
          const item = snapshot.sources[key]
          const itemLabel = key === 'ga4' ? 'Website' : key === 'youtube' ? 'YouTube' : key === 'stripe' ? 'Revenue' : 'Signups'
          return <button key={key} type="button" role="tab" aria-selected={active === key} className={active === key ? 'is-active' : ''} onClick={() => setActive(key)}><span>{itemLabel}</span><SourceBadge source={item.source} status={item.status} /></button>
        })}
      </div>
      <div className="analytics-layout">
        <Panel className="panel-chart" title={`${label} trend`} description={report.detail ?? 'Source report'} action={<SourceBadge source={report.source} status={report.status} />}>
          <AnalyticsChart source={active} data={report.series ?? []} />
        </Panel>
        <Panel title="Source totals" description="Totals are returned by the connected source for this range.">
          <ReportTotals source={active} report={report} />
        </Panel>
      </div>
      <Panel className="table-panel" title={`${label} data table`} description="A text view is kept beside every chart for quick checking and accessible review." action={<button className="icon-button" type="button" aria-label="Download table"><Download aria-hidden="true" size={15} /></button>}>
        <ReportTable source={active} report={report} />
      </Panel>
    </>
  )
}

function CrmPage({ crm, onSave }: { crm: CrmSnapshot; onSave: (next: CrmSnapshot) => Promise<void> }) {
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<'all' | LeadStage>('all')
  const [view, setView] = useState<'board' | 'list'>('board')
  const [modal, setModal] = useState(false)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [importing, setImporting] = useState(false)
  const filtered = useMemo(() => crm.leads.filter((lead) => {
    const search = `${lead.company} ${lead.name} ${lead.email}`.toLowerCase()
    return (stage === 'all' || lead.stage === stage) && (!query || search.includes(query.toLowerCase()))
  }), [crm.leads, query, stage])

  async function submitNewLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next: Lead = {
      id: crypto.randomUUID(),
      company: String(data.get('company') ?? '').trim(),
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      stage: String(data.get('stage') ?? 'new') as LeadStage,
      source: String(data.get('source') ?? 'manual').trim() || 'manual',
      nextAction: String(data.get('nextAction') ?? '').trim(),
      nextActionAt: String(data.get('nextActionAt') ?? '').trim(),
      notes: String(data.get('notes') ?? '').trim() ? [String(data.get('notes')).trim()] : [],
      value: data.get('value') ? Number(data.get('value')) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    if (!next.company || !next.email) return
    await onSave({ updatedAt: new Date().toISOString(), leads: [next, ...crm.leads] })
    setModal(false)
  }

  async function updateSelected(changes: Partial<Lead>) {
    if (!selected) return
    const nextLeads = crm.leads.map((lead) => lead.id === selected.id ? { ...lead, ...changes, updatedAt: new Date().toISOString() } : lead)
    const next = { updatedAt: new Date().toISOString(), leads: nextLeads }
    setSelected({ ...selected, ...changes })
    await onSave(next)
  }

  async function removeLead(lead: Lead) {
    if (!window.confirm(`Delete ${lead.company}?`)) return
    await onSave({ updatedAt: new Date().toISOString(), leads: crm.leads.filter((item) => item.id !== lead.id) })
    setSelected(null)
  }

  async function importCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const rows = parseCsvBrowser(await file.text())
      const imported = rows.map((row) => ({
        id: crypto.randomUUID(),
        company: row.company ?? row.companyname ?? '',
        name: row.name ?? row.contact ?? '',
        email: row.email ?? '',
        stage: stages.includes(row.stage as LeadStage) ? row.stage as LeadStage : 'new',
        source: row.source || 'csv import',
        nextAction: row.next_action ?? row.nextaction ?? '',
        nextActionAt: row.next_action_at ?? row.nextactionat ?? '',
        notes: row.notes ? [row.notes] : [],
        value: row.value ? Number(row.value) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })).filter((lead) => lead.company && lead.email)
      if (!imported.length) throw new Error('No rows with both company and email were found.')
      await onSave({ updatedAt: new Date().toISOString(), leads: [...imported, ...crm.leads] })
    } catch (error) {
      window.alert(`CSV import failed: ${displayError(error)}`)
    } finally {
      setImporting(false)
      event.target.value = ''
    }
  }

  return (
    <>
      <PageHeader eyebrow="Relationship system" title="CRM workspace" description="Keep the next conversation visible. Records are local, editable, and never seeded with pretend prospects." actions={<><label className="button button-secondary" htmlFor="crm-import"><UploadCloud aria-hidden="true" size={15} />{importing ? 'Importing…' : 'Import CSV'}</label><input className="sr-only" id="crm-import" type="file" accept=".csv,text/csv" onChange={importCsv} /><PrimaryButton onClick={() => setModal(true)}><Plus aria-hidden="true" size={16} />Add lead</PrimaryButton></>} />
      <div className="crm-toolbar">
        <label className="search-box"><Search aria-hidden="true" size={16} /><span className="sr-only">Search leads</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, person or email" /></label>
        <label className="select-box"><Filter aria-hidden="true" size={15} /><span className="sr-only">Filter by stage</span><select value={stage} onChange={(event) => setStage(event.target.value as 'all' | LeadStage)}><option value="all">All stages</option>{stages.map((item) => <option key={item} value={item}>{stageLabel(item)}</option>)}</select><ChevronDown aria-hidden="true" size={14} /></label>
        <div className="view-toggle" aria-label="CRM view"><button type="button" aria-pressed={view === 'board'} onClick={() => setView('board')}>Board</button><button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>List</button></div>
        <span className="record-count">{filtered.length} {filtered.length === 1 ? 'record' : 'records'}</span>
      </div>
      {view === 'board' ? <div className="crm-board">{stages.map((item) => <section className="stage-column" key={item}><div className="stage-heading"><span className={`stage-marker ${stageTone(item)}`} /><h2>{stageLabel(item)}</h2><span>{filtered.filter((lead) => lead.stage === item).length}</span></div><div className="stage-cards">{filtered.filter((lead) => lead.stage === item).map((lead) => <LeadCard key={lead.id} lead={lead} onOpen={() => setSelected(lead)} />)}{!filtered.some((lead) => lead.stage === item) ? <p className="stage-empty">No records here.</p> : null}</div></section>)}</div> : <LeadTable leads={filtered} onOpen={setSelected} onDelete={removeLead} />}
      {!crm.leads.length ? <Panel className="crm-empty-panel"><EmptyState icon={UsersRound} title="Your CRM is ready for its first real record" detail="Add a lead manually or import a CSV with company and email columns. No sample companies are preloaded." action={<InlineAdd onClick={() => setModal(true)} label="Add your first lead" />} /></Panel> : null}
      {modal ? <LeadModal onClose={() => setModal(false)} onSubmit={submitNewLead} /> : null}
      {selected ? <LeadDetail lead={selected} onClose={() => setSelected(null)} onUpdate={updateSelected} onDelete={removeLead} /> : null}
    </>
  )
}

function TasksPage({ crm, onSave }: { crm: CrmSnapshot; onSave: (next: CrmSnapshot) => Promise<void> }) {
  const navigate = useNavigate()
  const tasks = useMemo(() => crm.leads.filter((lead) => lead.nextAction).sort((a, b) => actionTime(a) - actionTime(b)), [crm.leads])
  async function complete(lead: Lead) {
    await onSave({ updatedAt: new Date().toISOString(), leads: crm.leads.map((item) => item.id === lead.id ? { ...item, nextAction: '', nextActionAt: '', updatedAt: new Date().toISOString() } : item) })
  }
  return (
    <>
      <PageHeader eyebrow="Execution queue" title="Tasks worth doing" description="A small, date-aware queue derived from your CRM. Nothing appears here unless you created the action." actions={<PrimaryButton onClick={() => navigate('/crm')}><Plus aria-hidden="true" size={16} />Add action in CRM</PrimaryButton>} />
      <Panel title={`${tasks.length} open ${tasks.length === 1 ? 'action' : 'actions'}`} description="Overdue first, then today, then the next commitments.">
        {tasks.length ? <div className="task-list">{tasks.map((lead) => <article className="task-row" key={lead.id}><button className="task-check" type="button" aria-label={`Complete ${lead.nextAction}`} onClick={() => complete(lead)}><Check aria-hidden="true" size={14} /></button><div className="task-copy"><span className={`task-due ${dueTone(lead)}`}>{dueLabel(lead)}</span><h2>{lead.nextAction}</h2><p>{lead.company} · {lead.email}</p></div><button className="table-link" type="button" onClick={() => navigate('/crm')}>Open CRM <ArrowRight aria-hidden="true" size={14} /></button></article>)}</div> : <EmptyState icon={CheckCircle2} title="No open actions" detail="A focused queue is better than a full one. Add the next action when a lead needs movement." action={<InlineAdd onClick={() => navigate('/crm')} label="Open CRM" />} />}
      </Panel>
    </>
  )
}

function IntegrationsPage({ snapshot, onSync, syncing }: { snapshot: DashboardSnapshot; onSync: () => void; syncing: boolean }) {
  const cards: Array<{ key: AnalyticsSource; title: string; description: string; icon: typeof Globe2; env: string }> = [
    { key: 'ga4', title: 'Google Analytics 4', description: 'Visitors, sessions, events, and conversion counts.', icon: Globe2, env: 'GA4_PROPERTY_ID + GA4_ACCESS_TOKEN' },
    { key: 'youtube', title: 'YouTube', description: 'Channel totals, date-range views, watch time, and engagement.', icon: Youtube, env: 'YOUTUBE_CHANNEL_ID + YOUTUBE_API_KEY' },
    { key: 'stripe', title: 'Stripe', description: 'Payment intents and revenue in the selected period.', icon: CreditCard, env: 'STRIPE_SECRET_KEY' },
    { key: 'formspree', title: 'Formspree', description: 'Contact-form submissions and lead intake count.', icon: Mail, env: 'FORMSPREE_FORM_ID + FORMSPREE_API_TOKEN' },
  ]
  return (
    <>
      <PageHeader eyebrow="Source control" title="Integrations" description="Connect the tools you already use. Secrets stay on the local server and are never shipped to the browser." actions={<PrimaryButton onClick={onSync} disabled={syncing}><RefreshIcon spinning={syncing} />{syncing ? 'Syncing' : 'Sync all sources'}</PrimaryButton>} />
      <div className="integration-grid">{cards.map(({ key, title, description, icon: Icon, env }) => { const item = snapshot.sources[key]; return <article className="integration-card" key={key}><div className="integration-card-top"><span className={`integration-icon integration-${key}`}><Icon aria-hidden="true" size={19} /></span><SourceBadge source={item.source} status={item.status} /></div><h2>{title}</h2><p>{description}</p><div className="integration-meta"><span>Required</span><code>{env}</code></div><div className="integration-detail">{item.detail ?? 'Add the settings in dashboard/.env and sync again.'}</div><a href="#/integrations" className="integration-link">Setup guide <ExternalLink aria-hidden="true" size={14} /></a></article>})}</div>
      <Panel className="contract-panel" title="Data contract" description="What the dashboard will and will not claim.">
        <div className="contract-grid"><div><span className="contract-number">01</span><h2>Real values only</h2><p>Connector responses are normalized, labeled, and kept tied to their source. There are no fallback metric arrays.</p></div><div><span className="contract-number">02</span><h2>Unknown is visible</h2><p>Missing credentials, empty periods, and API errors keep their own states instead of becoming zeroes.</p></div><div><span className="contract-number">03</span><h2>CRM stays local</h2><p>Lead records are stored in <code>dashboard/data/crm.json</code> after the first save, with browser storage as an offline fallback.</p></div></div>
        <div className="env-callout"><FileUp aria-hidden="true" size={18} /><div><strong>Start with the template</strong><span>Copy <code>.env.example</code> to <code>.env</code>, add credentials, then use Sync all sources.</span></div><a className="button button-secondary" href="https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1alpha/TopLevel/runReport" target="_blank" rel="noreferrer">GA4 docs <ExternalLink aria-hidden="true" size={14} /></a></div>
      </Panel>
    </>
  )
}

function AcquisitionChart({ data }: { data: TrendPoint[] }) {
  return <div className="chart-frame"><ResponsiveContainer width="100%" height={320}><AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="#e6e9f1" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} tick={{ fill: '#8b93a7', fontSize: 11 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#8b93a7', fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="users" stroke="#4f58ff" strokeWidth={2.5} fill="#e9edff" fillOpacity={0.85} name="Visitors" /><Area type="monotone" dataKey="leads" stroke="#2b8a78" strokeWidth={2} fill="none" name="Leads" /></AreaChart></ResponsiveContainer></div>
}

function AnalyticsChart({ source, data }: { source: AnalyticsSource; data: TrendPoint[] }) {
  if (!data.length) return <EmptyChart title="No chart rows yet" detail="Connect this source or choose a range with returned data." />
  if (source === 'youtube') return <div className="chart-frame"><ResponsiveContainer width="100%" height={320}><AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="#e6e9f1" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} tick={{ fill: '#8b93a7', fontSize: 11 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#8b93a7', fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="views" stroke="#4f58ff" strokeWidth={2.5} fill="#e9edff" name="Views" /><Area type="monotone" dataKey="watchMinutes" stroke="#b55279" strokeWidth={2} fill="none" name="Watch minutes" /></AreaChart></ResponsiveContainer></div>
  return <div className="chart-frame"><ResponsiveContainer width="100%" height={320}><BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="#e6e9f1" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} tick={{ fill: '#8b93a7', fontSize: 11 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#8b93a7', fontSize: 11 }} /><Tooltip /><Bar dataKey={source === 'ga4' ? 'users' : 'leads'} fill="#4f58ff" radius={[4, 4, 0, 0]} name={source === 'ga4' ? 'Visitors' : 'Leads'} /></BarChart></ResponsiveContainer></div>
}

function ReportTotals({ source, report }: { source: AnalyticsSource; report: SourceReport }) {
  const fields = source === 'ga4' ? [['users', 'Active users', 'count'], ['sessions', 'Sessions', 'count'], ['leads', 'Conversions', 'count']] : source === 'youtube' ? [['views', 'Views', 'count'], ['watchMinutes', 'Watch minutes', 'minutes'], ['subscribers', 'Subscribers gained', 'count']] : source === 'stripe' ? [['revenue', 'Revenue', 'currency'], ['payments', 'Payments', 'count']] : [['signups', 'Submissions', 'count']]
  return <div className="report-totals">{fields.map(([key, label, unit]) => <div className="report-total" key={key}><span>{label}</span><strong>{formatMetric({ value: report.metrics?.[key] ?? null, unit: unit as MetricValue['unit'], source: report.source, status: report.status })}</strong></div>)}</div>
}

function ReportTable({ source, report }: { source: AnalyticsSource; report: SourceReport }) {
  const rows = [...(report.series ?? [])].reverse().slice(0, 15)
  const columns = source === 'ga4' ? [['users', 'Visitors'], ['sessions', 'Sessions'], ['leads', 'Leads']] : source === 'youtube' ? [['views', 'Views'], ['watchMinutes', 'Watch minutes'], ['subscribers', 'Subscribers']] : []
  if (!rows.length || !columns.length) return <EmptyState icon={BarChart3} title="No rows to review" detail={report.detail ?? 'This source does not currently expose a daily table.'} />
  return <div className="data-table-wrap"><table className="data-table"><caption className="sr-only">{report.source} daily data</caption><thead><tr><th>Date</th>{columns.map(([, label]) => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.date}><td>{formatDate(row.date)}</td>{columns.map(([key]) => <td key={key}>{new Intl.NumberFormat('en-GB').format(Number(row[key as keyof TrendPoint] ?? 0))}</td>)}</tr>)}</tbody></table></div>
}

function AttentionRow({ lead }: { lead: Lead }) {
  return <a className="attention-row" href="#/crm"><span className={`attention-dot ${stageTone(lead.stage)}`} /><span><strong>{lead.nextAction}</strong><small>{lead.company} · {dueLabel(lead)}</small></span><ArrowRight aria-hidden="true" size={14} /></a>
}

function LeadCard({ lead, onOpen }: { lead: Lead; onOpen: () => void }) {
  return <button className="lead-card" type="button" onClick={onOpen}><div className="lead-card-top"><span className={`stage-marker ${stageTone(lead.stage)}`} /><span>{lead.source || 'manual'}</span><MoreHorizontal aria-hidden="true" size={15} /></div><strong>{lead.company}</strong>{lead.name ? <span className="lead-contact">{lead.name}</span> : null}<div className="lead-card-bottom"><span>{lead.nextAction ? <><Clock3 aria-hidden="true" size={13} />{dueLabel(lead)}</> : 'No next action'}</span>{lead.value != null ? <span>{formatCurrency(lead.value)}</span> : null}</div></button>
}

function LeadTable({ leads, onOpen, onDelete }: { leads: Lead[]; onOpen: (lead: Lead) => void; onDelete: (lead: Lead) => void }) {
  if (!leads.length) return <Panel className="crm-empty-panel"><EmptyState icon={Search} title="No records match that filter" detail="Try a different search or reset the stage filter." /></Panel>
  return <div className="data-table-wrap crm-table-wrap"><table className="data-table crm-table"><caption className="sr-only">CRM lead records</caption><thead><tr><th>Company</th><th>Stage</th><th>Next action</th><th>Source</th><th>Value</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td><button className="table-primary" type="button" onClick={() => onOpen(lead)}><strong>{lead.company}</strong><small>{lead.name || lead.email}</small></button></td><td><span className={`stage-pill ${stageTone(lead.stage)}`}>{stageLabel(lead.stage)}</span></td><td>{lead.nextAction ? <><strong>{lead.nextAction}</strong><small>{dueLabel(lead)}</small></> : <span className="muted">No action</span>}</td><td>{lead.source}</td><td>{formatCurrency(lead.value)}</td><td><button className="icon-button danger-icon" type="button" aria-label={`Delete ${lead.company}`} onClick={() => onDelete(lead)}><Trash2 aria-hidden="true" size={15} /></button></td></tr>)}</tbody></table></div>
}

function LeadModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="new-lead-title"><div className="modal-heading"><div><p className="eyebrow">New record</p><h2 id="new-lead-title">Add a real lead</h2></div><button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}><X aria-hidden="true" size={17} /></button></div><form className="lead-form" onSubmit={onSubmit}><div className="form-grid"><label>Company<input name="company" required autoFocus /></label><label>Contact name<input name="name" /></label></div><div className="form-grid"><label>Email<input name="email" type="email" required /></label><label>Source<input name="source" placeholder="Website, referral…" /></label></div><div className="form-grid"><label>Stage<select name="stage" defaultValue="new">{stages.map((item) => <option key={item} value={item}>{stageLabel(item)}</option>)}</select></label><label>Value<input name="value" type="number" min="0" step="1" placeholder="Optional" /></label></div><div className="form-grid"><label>Next action<input name="nextAction" placeholder="What happens next?" /></label><label>Due date<input name="nextActionAt" type="date" /></label></div><label>Notes<textarea name="notes" rows={3} placeholder="Context worth remembering" /></label><div className="modal-actions"><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit"><Check aria-hidden="true" size={15} />Save lead</PrimaryButton></div></form></section></div>
}

function LeadDetail({ lead, onClose, onUpdate, onDelete }: { lead: Lead; onClose: () => void; onUpdate: (changes: Partial<Lead>) => Promise<void>; onDelete: (lead: Lead) => Promise<void> }) {
  const [note, setNote] = useState('')
  return <div className="detail-backdrop" role="presentation"><aside className="lead-detail" role="dialog" aria-modal="true" aria-labelledby="lead-detail-title"><div className="detail-heading"><div><p className="eyebrow">Lead record</p><h2 id="lead-detail-title">{lead.company}</h2><span>{lead.email}</span></div><button className="icon-button" type="button" aria-label="Close lead detail" onClick={onClose}><X aria-hidden="true" size={17} /></button></div><div className="detail-section"><span className="detail-label">Stage</span><select value={lead.stage} onChange={(event) => void onUpdate({ stage: event.target.value as LeadStage })}>{stages.map((item) => <option key={item} value={item}>{stageLabel(item)}</option>)}</select></div><div className="detail-section"><span className="detail-label">Next action</span><input value={lead.nextAction} onChange={(event) => void onUpdate({ nextAction: event.target.value })} placeholder="Add the next action" /><input value={lead.nextActionAt} onChange={(event) => void onUpdate({ nextActionAt: event.target.value })} type="date" /></div><div className="detail-section"><span className="detail-label">Notes</span>{lead.notes.length ? <div className="notes-list">{lead.notes.map((item, index) => <p key={`${item}-${index}`}>{item}</p>)}</div> : <p className="muted">No notes yet.</p>}<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a note" rows={3} /><SecondaryButton onClick={() => { if (note.trim()) { void onUpdate({ notes: [...lead.notes, note.trim()] }); setNote('') } }}><Plus aria-hidden="true" size={14} />Add note</SecondaryButton></div><div className="detail-footer"><span>Created {formatDate(lead.createdAt)}</span><button className="danger-link" type="button" onClick={() => void onDelete(lead)}><Trash2 aria-hidden="true" size={14} />Delete record</button></div></aside></div>
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return <span className={spinning ? 'icon-spin' : ''}><Send aria-hidden="true" size={15} /></span>
}

function SparkleIcon() {
  return <span className="sparkle-icon" aria-hidden="true">✦</span>
}

function shortDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value.slice(5) : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date)
}

function actionTime(lead: Lead) {
  const time = lead.nextActionAt ? new Date(lead.nextActionAt).getTime() : Number.MAX_SAFE_INTEGER
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time
}

function dueLabel(lead: Lead) {
  if (!lead.nextActionAt) return 'No due date'
  const date = new Date(`${lead.nextActionAt.length === 10 ? `${lead.nextActionAt}T12:00:00` : lead.nextActionAt}`)
  if (Number.isNaN(date.getTime())) return 'Date to confirm'
  const today = new Date()
  const todayKey = today.toISOString().slice(0, 10)
  const dateKey = date.toISOString().slice(0, 10)
  if (dateKey < todayKey) return `Overdue · ${formatDate(lead.nextActionAt)}`
  if (dateKey === todayKey) return 'Due today'
  return `Due ${formatDate(lead.nextActionAt)}`
}

function dueTone(lead: Lead) {
  if (!lead.nextActionAt) return 'due-none'
  const key = new Date(lead.nextActionAt).toISOString().slice(0, 10)
  const today = new Date().toISOString().slice(0, 10)
  return key < today ? 'due-overdue' : key === today ? 'due-today' : 'due-upcoming'
}

function parseCsvBrowser(input: string) {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    const next = input[index + 1]
    if (character === '"' && quoted && next === '"') { cell += '"'; index += 1 }
    else if (character === '"') quoted = !quoted
    else if (character === ',' && !quoted) { row.push(cell); cell = '' }
    else if ((character === '\n' || character === '\r') && !quoted) { if (character === '\r' && next === '\n') index += 1; row.push(cell); rows.push(row); row = []; cell = '' }
    else cell += character
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  const headers = rows.shift()?.map((item) => item.trim().toLowerCase()) ?? []
  return rows.filter((values) => values.some((value) => value.trim())).map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] ?? '').trim()])))
}

export default function App() {
  return <HashRouter><AppWorkspace /></HashRouter>
}
