import { useEffect, useRef, useState } from 'react'
import {
  Activity, ArrowUpRight, Bell, BriefcaseBusiness, Building2, CalendarDays,
  ChevronsUpDown, CircleDollarSign, Clock3, Command, Contact, Ellipsis, Inbox,
  CheckCircle2, ClipboardEdit, FileUp, LayoutDashboard, Menu, Moon, Plus, Search,
  Sparkles, Sun, UsersRound, WandSparkles, X,
} from 'lucide-react'
import { parseLeadFile } from './leadImport'
import { customerLeads } from './customerLeads'

const queue = []

const nav = [
  [LayoutDashboard, 'Command center'], [Contact, 'Contacts'], [Building2, 'Companies'],
  [BriefcaseBusiness, 'Pipeline'], [CalendarDays, 'Activities'], [Inbox, 'Inbox', '7'],
]

const leadStorageKey = 'orbit-imported-leads'
const urgencyOrder = { overdue: 4, urgent: 4, high: 3, today: 2, new: 1, customer: 0 }

function currency(value) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0)
}

function urgencyFor(lead) {
  return urgencyOrder[String(lead.badge || '').toLowerCase()] || 1
}

function actionLabel(lead) {
  return lead.action || 'Add a next action'
}
function Logo() {
  return <div className="logo"><span className="logo-mark"><i /><i /></span><span>orbit</span></div>
}

function Avatar({ initials, tone = 'cobalt' }) {
  return <span className={`avatar ${tone}`}>{initials}</span>
}

function MiniChart() {
  return (
    <svg className="mini-chart" viewBox="0 0 160 42" aria-hidden="true">
      <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".22"/><stop offset="1" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
      <path className="area" d="M2 35 C18 32 22 19 38 24 S58 34 71 20 S90 10 104 18 S124 17 134 8 S149 12 158 3 L158 42 L2 42 Z" />
      <path className="line" d="M2 35 C18 32 22 19 38 24 S58 34 71 20 S90 10 104 18 S124 17 134 8 S149 12 158 3" />
    </svg>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('orbit-theme') || 'light')
  const [mobileNav, setMobileNav] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importPreview, setImportPreview] = useState({ leads: [], errors: [], fileName: '' })
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [actionDraft, setActionDraft] = useState('')
  const [leads, setLeads] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(leadStorageKey) || '[]')
      const stored = Array.isArray(saved) ? saved : []
      const baseLeads = [...queue, ...customerLeads]
      return [...baseLeads, ...stored.filter((lead) => !String(lead.id || '').startsWith('seed-') && !baseLeads.some((seed) => seed.id === lead.id))]
    } catch {
      return [...queue, ...customerLeads]
    }
  })
  const fileInput = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('orbit-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(leadStorageKey, JSON.stringify(leads))
  }, [leads])

  const handleLeadFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const result = parseLeadFile(await file.text())
    setImportPreview({ ...result, fileName: file.name })
  }

  const closeImport = () => {
    setImportOpen(false)
    setImportPreview({ leads: [], errors: [], fileName: '' })
    if (fileInput.current) fileInput.current.value = ''
  }

  const importLeads = () => {
    setLeads((current) => [...importPreview.leads, ...current])
    closeImport()
  }

  const activeQueue = leads.slice().sort((left, right) => urgencyFor(right) - urgencyFor(left))
  const activeStages = Object.values(leads.reduce((stages, lead) => {
    const stage = lead.stage || 'New'
    stages[stage] = stages[stage] || { name: stage, count: 0, value: 0 }
    stages[stage].count += 1
    stages[stage].value += Number(lead.dealValue || lead.value || 0)
    return stages
  }, {})).sort((left, right) => right.value - left.value || right.count - left.count)
  const pipelineValue = activeStages.reduce((total, stage) => total + stage.value, 0)
  const largestStageValue = Math.max(...activeStages.map((stage) => stage.value), 1)
  const activeLead = leads.find((lead) => lead.id === selectedLeadId) || null
  const queuedActions = activeQueue.filter((lead) => lead.action).length
  const nextLead = activeQueue[0]
  const attentionCount = activeQueue.filter((lead) => lead.hot || /needs action|overdue|urgent|high/i.test(lead.badge || '')).length
  const focusScore = Math.min(100, 55 + (queuedActions * 5) + (attentionCount * 4))

  const openLead = (lead) => {
    setSelectedLeadId(lead.id)
    setActionDraft(actionLabel(lead))
  }

  const saveNextAction = () => {
    if (!activeLead || !actionDraft.trim()) return
    setLeads((current) => current.map((lead) => lead.id === activeLead.id ? { ...lead, action: actionDraft.trim(), badge: lead.badge === 'Customer' ? 'Customer' : 'Today', hot: false } : lead))
  }

  const completeNextAction = () => {
    if (!activeLead) return
    setLeads((current) => current.map((lead) => lead.id === activeLead.id ? { ...lead, action: 'Add a next action', badge: 'Needs action', hot: false, time: 'Unscheduled' } : lead))
    setActionDraft('Add a next action')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div className="side-head"><Logo /><button className="icon-btn close-nav" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18}/></button></div>
        <nav>
          <p className="nav-label">Workspace</p>
          {nav.map(([Icon, label, count], index) => (
            <button className={`nav-item ${index === 0 ? 'active' : ''}`} key={label}>
              <Icon size={17} strokeWidth={1.8}/><span>{label}</span>{count && <em>{count}</em>}
            </button>
          ))}
          <p className="nav-label second">Manage</p>
          <button className="nav-item"><UsersRound size={17}/><span>Team</span></button>
          <button className="nav-item"><Activity size={17}/><span>Reports</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="signal-card">
            <span><WandSparkles size={15}/> Pipeline signal</span>
            <strong>{attentionCount || 'No'} lead{attentionCount === 1 ? '' : 's'} need attention</strong>
            <div className="signal-bar"><i style={{ width: `${Math.min(100, attentionCount * 24 || 12)}%` }}/></div>
          </div>
          <button className="profile"><Avatar initials="D"/><span><strong>Daniël</strong><small>MagisData</small></span><ChevronsUpDown size={15}/></button>
        </div>
      </aside>

      {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}

      <section className="workspace">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={19}/></button>
          <div className="search"><Search size={16}/><span>Search people, companies, deals...</span><kbd><Command size={11}/> K</kbd></div>
          <div className="top-actions">
            <button className="icon-btn theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle color theme">
              {theme === 'light' ? <Moon size={17}/> : <Sun size={17}/>}<span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <button className="icon-btn bell"><Bell size={17}/><i/></button>
            <button className="primary-btn" onClick={() => setImportOpen(true)}><FileUp size={16}/>Import leads</button>
          </div>
        </header>

        <main>
          <section className="welcome">
            <div><p className="eyebrow"><Sparkles size={14}/> Thursday, July 16</p><h1>Good morning, Daniël.</h1><p>Your pipeline is moving. Here’s what needs your attention today.</p></div>
            <div className="live-pill"><span/> Sales workspace live</div>
          </section>

          <section className="stats-grid">
            <article className="stat-card featured">
              <div className="stat-top"><span>Pipeline value</span><CircleDollarSign size={17}/></div>
              <div className="stat-value">{currency(pipelineValue)}</div>
              <div className="stat-foot"><span className="positive">{activeStages.length}</span><small>active pipeline stage{activeStages.length === 1 ? '' : 's'}</small></div>
              <MiniChart />
            </article>
            <article className="stat-card"><div className="stat-top"><span>Active records</span><BriefcaseBusiness size={17}/></div><div className="stat-value">{leads.length}</div><div className="stat-foot"><span className="positive">{leads.filter((lead) => lead.stage !== 'Customer').length}</span><small>in progress</small></div></article>
            <article className="stat-card"><div className="stat-top"><span>Next actions</span><Activity size={17}/></div><div className="stat-value">{queuedActions}</div><div className="stat-foot"><span className={attentionCount ? 'neutral' : 'positive'}>{attentionCount}</span><small>need attention</small></div></article>
            <article className="stat-card"><div className="stat-top"><span>Demos scheduled</span><Clock3 size={17}/></div><div className="stat-value">{leads.filter((lead) => /scheduled/i.test(lead.demoStatus || '')).length}</div><div className="stat-foot"><span className="neutral">{leads.filter((lead) => /completed/i.test(lead.demoStatus || '')).length}</span><small>completed</small></div></article>
          </section>

          <section className="content-grid">
            <article className="panel queue-panel">
              <div className="panel-head"><div><span className="title-icon"><Clock3 size={16}/></span><div><h2>Today queue</h2><p>{activeQueue.length} prospects need a next action, sorted by urgency.</p></div></div><button className="soft-btn" onClick={() => setImportOpen(true)}>Import CSV <ArrowUpRight size={14}/></button></div>
              <div className="queue-list">
                {activeQueue.map((item, index) => (
                  <div className="queue-row queue-row-clickable" key={item.id || item.name} onClick={() => openLead(item)}>
                    <span className="row-number">0{index + 1}</span><Avatar initials={item.initials} tone={item.tone}/>
                    <div className="person"><strong>{item.name}</strong><small>{item.company}</small></div>
                    <div className="next-step"><small>Next action</small><strong>{item.action}</strong></div>
                    <span className={`status ${item.hot ? 'hot' : ''}`}>{item.badge}</span>
                    <time>{item.time}</time><button className="row-menu" aria-label={`Open ${item.name}`} onClick={(event) => { event.stopPropagation(); openLead(item) }}><Ellipsis size={18}/></button>
                  </div>
                ))}
              </div>
              <div className="queue-foot"><span><i/> Focus score</span><strong>{focusScore}</strong><div className="focus-track"><i style={{ width: `${focusScore}%` }}/></div><small>{attentionCount ? `${attentionCount} to resolve` : 'Queue is clear'}</small></div>
            </article>

            <article className="panel pipeline-panel">
              <div className="panel-head compact"><div><span className="title-icon warm"><BriefcaseBusiness size={16}/></span><div><h2>Pipeline pulse</h2><p>{currency(pipelineValue)} across {activeStages.length} stage{activeStages.length === 1 ? '' : 's'}</p></div></div><button className="icon-btn" aria-label="Open top lead" onClick={() => nextLead && openLead(nextLead)}><Ellipsis size={18}/></button></div>
              <div className="stages">
                {activeStages.slice(0, 3).map((stage) => <div key={stage.name}><span>{stage.name} · {stage.count}</span><strong>{currency(stage.value)}</strong><i style={{ '--w': `${Math.max(8, (stage.value / largestStageValue) * 100)}%` }}/></div>)}
              </div>
              <div className="deal-list">
                {activeQueue.slice(0, 3).map((lead) => <button className="deal" key={lead.id || lead.company} onClick={() => openLead(lead)}><Avatar initials={lead.initials} tone={lead.tone}/><span><strong>{lead.company}</strong><small>{lead.name}</small></span><div><strong>{lead.dealValue || lead.value ? currency(Number(lead.dealValue || lead.value)) : 'No value'}</strong><small>{lead.stage || 'New'}</small></div></button>)}
              </div>
              <button className="full-soft" onClick={() => nextLead && openLead(nextLead)}>Review top priority <ArrowUpRight size={14}/></button>
            </article>
          </section>

          <section className="bottom-grid">
            <article className="insight-card"><span className="insight-icon"><Sparkles size={18}/></span><div><small>Top priority</small><strong>{nextLead ? `${nextLead.company} needs attention.` : 'Import leads to build your queue.'}</strong><p>{nextLead ? actionLabel(nextLead) : 'Every record needs a next action to appear here.'}</p></div><button className="soft-btn" onClick={() => nextLead && openLead(nextLead)}>View record</button></article>
            <article className="calendar-card"><div><small>{nextLead ? `Up next · ${nextLead.time}` : 'No action scheduled'}</small><strong>{nextLead ? actionLabel(nextLead) : 'Your queue is clear'}</strong>{nextLead && <span><Avatar initials={nextLead.initials} tone={nextLead.tone}/> {nextLead.name} · {nextLead.company}</span>}</div><button className="round-arrow" onClick={() => nextLead && openLead(nextLead)}><ArrowUpRight size={17}/></button></article>
          </section>
        </main>
      </section>
      {activeLead && <div className="detail-backdrop" role="presentation" onClick={() => setSelectedLeadId(null)}>
        <aside className="lead-detail" role="dialog" aria-modal="true" aria-labelledby="lead-detail-title" onClick={(event) => event.stopPropagation()}>
          <div className="detail-head"><div><Avatar initials={activeLead.initials} tone={activeLead.tone}/><div><p className="eyebrow">Lead record</p><h2 id="lead-detail-title">{activeLead.name}</h2><span>{activeLead.company}</span></div></div><button className="icon-btn" onClick={() => setSelectedLeadId(null)} aria-label="Close lead detail"><X size={18}/></button></div>
          <div className="detail-body">
            <div className="record-meta"><span><small>Pipeline stage</small><strong>{activeLead.stage || 'New'}</strong></span><span><small>Lead source</small><strong>{activeLead.source || 'Not set'}</strong></span><span><small>Demo status</small><strong>{activeLead.demoStatus || 'Not set'}</strong></span><span><small>Value</small><strong>{activeLead.dealValue || activeLead.value ? currency(Number(activeLead.dealValue || activeLead.value)) : 'Not set'}</strong></span></div>
            <div className="detail-section"><p className="detail-label"><ClipboardEdit size={14}/> Mandatory next action</p><label className="action-field"><span>Next action</span><input value={actionDraft} onChange={(event) => setActionDraft(event.target.value)} placeholder="Add the next action" /></label><div className="detail-actions"><button className="primary-btn" disabled={!actionDraft.trim()} onClick={saveNextAction}>Save action</button><button className="soft-btn" onClick={completeNextAction}><CheckCircle2 size={14}/>Mark done</button></div></div>
            <div className="detail-section"><p className="detail-label">Tags</p><div className="tag-list">{(activeLead.tags || 'No tags').split(',').map((tag) => <span key={tag}>{tag.trim()}</span>)}</div></div>
            {activeLead.email && <div className="detail-section"><p className="detail-label">Email</p><strong className="detail-text">{activeLead.email}</strong></div>}
            {activeLead.notes && <div className="detail-section"><p className="detail-label">Notes</p><p className="detail-note">{activeLead.notes}</p></div>}
          </div>
        </aside>
      </div>}
      {importOpen && <div className="modal-backdrop" role="presentation">
        <section className="import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title">
          <div className="import-modal-head"><div><span className="title-icon"><FileUp size={17}/></span><div><p className="eyebrow">Lead intake</p><h2 id="import-title">Import leads from CSV</h2></div></div><button className="icon-btn" onClick={closeImport} aria-label="Close lead import"><X size={18}/></button></div>
          <div className="import-modal-body">
            {!importPreview.fileName ? <>
              <p>Upload a CSV with <strong>company</strong>, <strong>name</strong> (or contact), and <strong>next_action</strong>. Optional fields: stage, source, demo_status, tags, email, urgency, and next_action_time.</p>
              <button className="drop-zone" onClick={() => fileInput.current?.click()}><FileUp size={24}/><strong>Choose a CSV file</strong><span>Only validated rows can enter the Sales OS.</span></button>
            </> : <>
              <div className="import-summary"><span className="file-chip"><FileUp size={15}/>{importPreview.fileName}</span><strong>{importPreview.leads.length} ready to import</strong></div>
              {importPreview.errors.length > 0 && <div className="import-errors"><strong>{importPreview.errors.length} row{importPreview.errors.length === 1 ? '' : 's'} need attention</strong>{importPreview.errors.slice(0, 4).map((error) => <p key={error}>{error}</p>)}</div>}
              {importPreview.leads.length > 0 && <div className="import-preview"><div className="preview-label"><span>Contact</span><span>Company</span><span>Mandatory next action</span></div>{importPreview.leads.slice(0, 4).map((lead) => <div className="preview-row" key={lead.id}><span>{lead.name}</span><span>{lead.company}</span><span>{lead.action}</span></div>)}{importPreview.leads.length > 4 && <small>+{importPreview.leads.length - 4} more validated leads</small>}</div>}
              <button className="text-button" onClick={() => { setImportPreview({ leads: [], errors: [], fileName: '' }); if (fileInput.current) fileInput.current.value = '' }}>Choose a different file</button>
            </>}
            <input ref={fileInput} className="visually-hidden" type="file" accept=".csv,text/csv" onChange={handleLeadFile}/>
          </div>
          <div className="import-modal-foot"><button className="soft-btn" onClick={closeImport}>Cancel</button>{importPreview.fileName && <button className="primary-btn" disabled={!importPreview.leads.length} onClick={importLeads}>Import {importPreview.leads.length || ''} lead{importPreview.leads.length === 1 ? '' : 's'}</button>}</div>
        </section>
      </div>}
    </div>
  )
}
