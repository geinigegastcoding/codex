import { useMemo, useState } from 'react'

type View = 'overzicht' | 'kennis' | 'cursus' | 'skills' | 'community'
type IconName = 'grid' | 'book' | 'play' | 'spark' | 'users' | 'search' | 'arrow' | 'check' | 'clock' | 'folder' | 'plus' | 'menu'

const navigation: { id: View; label: string; icon: IconName }[] = [
  { id: 'overzicht', label: 'Overzicht', icon: 'grid' },
  { id: 'kennis', label: 'Kennis', icon: 'book' },
  { id: 'cursus', label: 'Cursus', icon: 'play' },
  { id: 'skills', label: 'Skills', icon: 'spark' },
  { id: 'community', label: 'Community', icon: 'users' },
]

const modules = [
  { number: '01', title: 'Je werkruimte klaarzetten', text: 'Mappen, regels en een veilige start.', status: 'Klaar', progress: 100 },
  { number: '02', title: 'Kennis die de agent begrijpt', text: 'Context verzamelen zonder een rommelig archief.', status: 'Bezig', progress: 68 },
  { number: '03', title: 'Je eerste skill bouwen', text: 'Een terugkerende taak vastleggen als workflow.', status: 'Open', progress: 0 },
  { number: '04', title: 'Van taak naar systeem', text: 'Review, foutafhandeling en onderhoud.', status: 'Open', progress: 0 },
]

const skills = [
  { name: 'E-mail checker', description: 'Inbox triage met menselijke goedkeuring.', tag: 'Communicatie' },
  { name: 'Kennis navigator', description: 'Leest, schrijft en onderhoudt je vault.', tag: 'Context' },
  { name: 'YouTube transcriber', description: 'Maakt bronnotities van toegestane video\'s.', tag: 'Research' },
  { name: 'System builder', description: 'Zet herhaalbaar werk om in een workflow.', tag: 'Bouwen' },
]

const activities = [
  { icon: 'book' as IconName, title: 'Kennisstructuur geopend', detail: 'Je navigatie en bronregels staan klaar.', time: 'Vandaag, 09:42' },
  { icon: 'spark' as IconName, title: 'Skill bekeken', detail: 'E-mail checker staat klaar voor een eerste test.', time: 'Gisteren, 16:10' },
  { icon: 'check' as IconName, title: 'Module 01 afgerond', detail: 'De werkruimte heeft een vaste startplek.', time: 'Gisteren, 15:48' },
]

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, string> = {
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    book: 'M5 4.5A2.5 2.5 0 0 1 7.5 2H20v16H7.5A2.5 2.5 0 0 0 5 20.5zm0 0v16M8 6h8M8 10h7',
    play: 'M8 5.5v13l10-6.5z',
    spark: 'm12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6zm7 12 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z',
    users: 'M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20m6-10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m5.5-6.5a3 3 0 0 1 0 5.8M17 14.5a4.5 4.5 0 0 1 4 4V20',
    search: 'm20 20-4.8-4.8m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
    arrow: 'M5 12h13m-5-5 5 5-5 5',
    check: 'm5 12 4 4L19 6',
    clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    folder: 'M3 7.5h7l1.6 2H21v9.5H3zM3 7.5V5h6l2 2.5',
    plus: 'M12 5v14M5 12h14',
    menu: 'M4 7h16M4 12h16M4 17h16',
  }

  return (
    <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <path d={paths[name]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {text ? <p>{text}</p> : null}
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  return <div aria-label={`${value}% voortgang`} className="progress-track"><span style={{ width: `${value}%` }} /></div>
}

function DashboardHome({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <>
      <section className="welcome-grid">
        <div className="welcome-copy">
          <span className="eyebrow">AI-systeem academy</span>
          <h1>Goedemorgen, ondernemer.</h1>
          <p>Je werkruimte staat klaar. Kies een kleine workflow en bouw vandaag iets dat je morgen opnieuw kunt gebruiken.</p>
          <div className="button-row">
            <button className="button button-primary" onClick={() => onNavigate('cursus')}>Ga verder met de cursus <Icon name="arrow" size={16} /></button>
            <button className="button button-secondary" onClick={() => onNavigate('kennis')}>Open Kennis</button>
          </div>
        </div>
        <div className="welcome-diagram" aria-label="Diagram van Kennis naar skill en output">
          <div className="diagram-line line-one" />
          <div className="diagram-line line-two" />
          <div className="diagram-node node-source"><Icon name="book" size={17} /><span>Kennis</span></div>
          <div className="diagram-node node-skill"><Icon name="spark" size={19} /><strong>Skill</strong><small>herhaalbaar werk</small></div>
          <div className="diagram-node node-output"><Icon name="check" size={17} /><span>Output</span></div>
          <span className="diagram-caption">Een kleine route die klopt</span>
        </div>
      </section>

      <div className="demo-note"><span className="status-dot" /> Demo-data. Vervang de voorbeelden door je eigen context en metingen.</div>

      <section className="metric-grid" aria-label="Voortgang">
        <article className="metric-card"><span className="metric-label">Cursusvoortgang</span><strong>22%</strong><ProgressBar value={22} /><small>2 van 8 modules bekeken</small></article>
        <article className="metric-card"><span className="metric-label">Kennisnotities</span><strong>12</strong><small>Voorbeeldnotities klaar voor vervanging</small><button className="text-link" onClick={() => onNavigate('kennis')}>Bekijk Kennis <Icon name="arrow" size={14} /></button></article>
        <article className="metric-card"><span className="metric-label">Premade skills</span><strong>5</strong><small>Gesynchroniseerd in twee skillmappen</small><button className="text-link" onClick={() => onNavigate('skills')}>Bekijk skills <Icon name="arrow" size={14} /></button></article>
        <article className="metric-card metric-card-accent"><span className="metric-label">Volgende stap</span><strong>01</strong><small>Maak je eerste echte workflow</small><button className="text-link" onClick={() => onNavigate('cursus')}>Open module <Icon name="arrow" size={14} /></button></article>
      </section>

      <div className="content-grid content-grid-main">
        <section className="panel module-panel">
          <SectionHeading eyebrow="01 / leren" title="Bouw je eerste systeem" text="Korte modules. Elke module eindigt met een bestand of een werkende test." />
          <div className="module-list">
            {modules.map((module) => (
              <button className="module-row" key={module.number} onClick={() => onNavigate('cursus')}>
                <span className="module-number">{module.number}</span>
                <span className="module-copy"><strong>{module.title}</strong><small>{module.text}</small><ProgressBar value={module.progress} /></span>
                <span className={`status status-${module.status.toLowerCase()}`}>{module.status}</span>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
        </section>

        <aside className="panel side-panel">
          <SectionHeading eyebrow="volgende actie" title="Kies klein" />
          <p className="side-lede">Schrijf een taak op die deze week minstens drie keer terugkomt. Dat is je eerste kandidaat voor een skill.</p>
          <div className="focus-box"><span className="focus-label">Voorbeeld</span><strong>Nieuwe klantmails samenvatten</strong><small>Input: inbox-label. Output: drie regels in `output/`.</small></div>
          <button className="button button-secondary full-button" onClick={() => onNavigate('skills')}>Bekijk de skill-opbouw <Icon name="arrow" size={16} /></button>
        </aside>
      </div>

      <div className="content-grid content-grid-bottom">
        <section className="panel activity-panel">
          <SectionHeading eyebrow="logboek" title="Recente activiteit" />
          <div className="activity-list">
            {activities.map((activity) => <div className="activity-row" key={activity.title}><span className="activity-icon"><Icon name={activity.icon} size={16} /></span><div><strong>{activity.title}</strong><small>{activity.detail}</small></div><time>{activity.time}</time></div>)}
          </div>
        </section>
        <section className="panel health-panel">
          <SectionHeading eyebrow="systeemcheck" title="Klaar voor gebruik" />
          <div className="health-row"><span><Icon name="check" size={16} /> Kennisstructuur</span><strong>Goed</strong></div>
          <div className="health-row"><span><Icon name="check" size={16} /> Skills gespiegeld</span><strong>Goed</strong></div>
          <div className="health-row"><span><Icon name="clock" size={16} /> Eerste onderhoud</span><strong>Plan na week 1</strong></div>
        </section>
      </div>
    </>
  )
}

function KennisView() {
  const folders = ['company', 'personal', 'sources', 'queries', 'logs', '_archive']
  return <>
    <SectionHeading eyebrow="contextlaag" title="Kennis" text="Een kleine, controleerbare vault geeft de agent houvast." />
    <div className="content-grid content-grid-main">
      <section className="panel folder-panel"><div className="panel-top"><div><span className="eyebrow">vault</span><h3>Mapstructuur</h3></div><button className="icon-button" aria-label="Nieuwe map"><Icon name="plus" size={17} /></button></div><div className="folder-list">{folders.map((folder) => <button className="folder-row" key={folder}><span className="folder-icon"><Icon name="folder" size={17} /></span><span><strong>{folder}/</strong><small>{folder === 'company' ? 'Bedrijfscontext en projecten' : folder === 'personal' ? 'Persoonlijke context' : 'Lege template-map'}</small></span><Icon name="arrow" size={15} /></button>)}</div></section>
      <aside className="panel capture-panel"><SectionHeading eyebrow="snel vastleggen" title="Nieuwe capture" /><p>Schrijf eerst ruw. De agent helpt later met classificeren, linken en opslaan.</p><label htmlFor="capture">Notitie</label><textarea id="capture" placeholder="Bijvoorbeeld: elke vrijdag maak ik een klantupdate..."></textarea><button className="button button-primary full-button">Opslaan in inbox <Icon name="arrow" size={16} /></button><small className="form-help">De demo slaat nog niets extern op.</small></aside>
    </div>
    <section className="panel rules-panel"><SectionHeading eyebrow="bronregels" title="Zo blijft Kennis betrouwbaar" /><div className="rule-grid"><div><strong>1. Zoek eerst</strong><p>Lees bestaande notities voordat je een nieuwe pagina maakt.</p></div><div><strong>2. Label status</strong><p>Maak verschil tussen gecontroleerd, gemeld en afgeleid.</p></div><div><strong>3. Log wijzigingen</strong><p>Een onderhoudsregel maakt later zichtbaar wat er gebeurde.</p></div></div></section>
  </>
}

function CursusView() {
  return <><SectionHeading eyebrow="leerpad" title="Cursus" text="Van lege map naar een systeem dat een echte taak aankan." /><div className="course-summary"><div><span className="eyebrow">voortgang</span><strong>22%</strong><p>Je hebt de werkruimte en de basisregels gezien.</p></div><div className="course-progress"><ProgressBar value={22} /><small>2 / 8 modules</small></div><button className="button button-primary">Ga door <Icon name="arrow" size={16} /></button></div><section className="course-grid">{modules.map((module) => <article className="course-card" key={module.number}><span className="module-number">{module.number}</span><span className={`status status-${module.status.toLowerCase()}`}>{module.status}</span><h3>{module.title}</h3><p>{module.text}</p><ProgressBar value={module.progress} /><button className="text-link">Module openen <Icon name="arrow" size={14} /></button></article>)}</section></>
}

function SkillsView() {
  return <><SectionHeading eyebrow="gereedschap" title="Skills" text="Een skill bewaart werkwijze, beslisregels en controlepunten op een vaste plek." /><div className="skill-grid">{skills.map((skill) => <article className="skill-card" key={skill.name}><div className="skill-card-top"><span className="skill-icon"><Icon name="spark" size={18} /></span><span className="tag">{skill.tag}</span></div><h3>{skill.name}</h3><p>{skill.description}</p><div className="skill-card-footer"><span>Spiegel actief</span><button className="text-link">Open <Icon name="arrow" size={14} /></button></div></article>)}</div><section className="panel build-skill"><div><span className="eyebrow">volgende stap</span><h2>Maak een skill van je eigen taak</h2><p>Gebruik de system-builder. Begin met een concreet probleem en drie echte voorbeelden.</p></div><button className="button button-primary">Skill ontwerpen <Icon name="arrow" size={16} /></button></section></>
}

function CommunityView() {
  const items = [{ title: 'Start hier', text: 'Volg de eerste test en deel een screenshot van je structuur.' }, { title: 'Vragen stellen', text: 'Gebruik context, doel, input, poging en gewenste uitkomst.' }, { title: 'Showcase', text: 'Deel een workflow met de reviewstap en het leerpunt.' }]
  return <><SectionHeading eyebrow="samen leren" title="Community" text="Een werkende workflow wordt beter wanneer anderen hem kunnen volgen en bevragen." /><section className="community-hero"><div><span className="eyebrow">weekritme</span><h2>Een kleine test per week</h2><p>Kies een taak, maak de context zichtbaar, draai de workflow en schrijf op waar de agent nog hulp nodig had.</p><button className="button button-primary">Open weekplan <Icon name="arrow" size={16} /></button></div><div className="week-list"><span><b>01</b> Kies een echte taak</span><span><b>02</b> Maak de input schoon</span><span><b>03</b> Review de output</span></div></section><div className="community-grid">{items.map((item) => <article className="panel community-card" key={item.title}><span className="eyebrow">community</span><h3>{item.title}</h3><p>{item.text}</p><button className="text-link">Open pagina <Icon name="arrow" size={14} /></button></article>)}</div></>
}

function App() {
  const [view, setView] = useState<View>('overzicht')
  const [mobileNav, setMobileNav] = useState(false)
  const activeLabel = useMemo(() => navigation.find((item) => item.id === view)?.label ?? 'Overzicht', [view])

  const navigate = (nextView: View) => {
    setView(nextView)
    setMobileNav(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <div className="app-shell">
    <a className="skip-link" href="#main">Ga naar inhoud</a>
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Icon name="spark" size={18} /></span><span><strong>AI-systeem</strong><small>werkruimte</small></span></div>
      <nav aria-label="Hoofdnavigatie">{navigation.map((item) => <button className={view === item.id ? 'nav-item active' : 'nav-item'} key={item.id} onClick={() => navigate(item.id)}><Icon name={item.icon} size={17} /><span>{item.label}</span></button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><span className="status-dot" /><span><strong>Template actief</strong><small>Demo-omgeving</small></span></div><div className="profile"><span className="avatar">DM</span><span><strong>Jouw naam</strong><small>Eigen werkruimte</small></span></div></div>
    </aside>
    <main id="main">
      <header className="topbar"><button className="mobile-menu" aria-label="Navigatie openen" onClick={() => setMobileNav((open) => !open)}><Icon name="menu" size={20} /></button><div className="breadcrumb"><span>Werkruimte</span><span>/</span><strong>{activeLabel}</strong></div><div className="topbar-actions"><button className="search-button" aria-label="Zoeken"><Icon name="search" size={17} /></button><span className="topbar-date">Template v1</span><span className="topbar-avatar">DM</span></div></header>
      <div className="page-header"><div><span className="eyebrow">{activeLabel}</span><p className="page-date">Donderdag 8 augustus 2026</p></div><div className="page-actions"><button className="button button-secondary">Hulp nodig?</button></div></div>
      {view === 'overzicht' ? <DashboardHome onNavigate={navigate} /> : null}
      {view === 'kennis' ? <KennisView /> : null}
      {view === 'cursus' ? <CursusView /> : null}
      {view === 'skills' ? <SkillsView /> : null}
      {view === 'community' ? <CommunityView /> : null}
      <footer className="footer"><span>AI-systeem template</span><span>Kennis-first. Controleerbaar. Uitbreidbaar.</span></footer>
    </main>
  </div>
}

export default App

