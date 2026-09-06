import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Divider,
  FluentProvider,
  Input,
  ProgressBar,
  Select,
  Tab,
  TabList,
  createLightTheme,
} from '@fluentui/react-components'
import {
  ArrowLeftRegular,
  ArrowRightRegular,
  ArrowRotateClockwiseRegular,
  BookOpenRegular,
  BookmarkFilled,
  BookmarkRegular,
  CheckmarkCircleFilled,
  CheckmarkRegular,
  ChevronRightRegular,
  ClockRegular,
  DataBarVerticalRegular,
  DismissCircleFilled,
  FilterRegular,
  HomeRegular,
  LightbulbRegular,
  PlayRegular,
  SearchRegular,
  SettingsRegular,
  SparkleRegular,
  TargetArrowRegular,
  TrophyRegular,
} from '@fluentui/react-icons'
import {
  categories,
  categoryLabels,
  fallacies,
  fallacyById,
  type Category,
  type Difficulty,
  type Fallacy,
  type Question,
} from './data'
import {
  buildQuestionQueue,
  defaultSettings,
  getCategoryStats,
  getMastery,
  getOverallStats,
  getQuestionById,
  getWeakestFallacies,
  isLearned,
  loadState,
  recordAnswer,
  toggleId,
  type AnswerRecord,
  type AppState,
  type Mastery,
  type PracticeSettings,
} from './learning'
import './App.css'

const fallacyTheme = createLightTheme({
  10: '#f5fbf6',
  20: '#e9f5eb',
  30: '#d8ebdc',
  40: '#c5e0cb',
  50: '#acd2b7',
  60: '#91c2a2',
  70: '#74b18c',
  80: '#5ca27b',
  90: '#468f69',
  100: '#347f5b',
  110: '#286e4e',
  120: '#205e42',
  130: '#1a4e37',
  140: '#143f2c',
  150: '#0f3223',
  160: '#092619',
})

type View = 'home' | 'practice' | 'library' | 'progress' | 'detail'
type LibraryFilter = 'all' | 'beginner' | 'learned' | 'unlearned' | 'hard'

const navigation: { id: Exclude<View, 'detail' | 'practice'>; label: string; hint: string }[] = [
  { id: 'home', label: 'Overzicht', hint: 'Je startpunt' },
  { id: 'library', label: 'Bibliotheek', hint: 'Alle fallacies' },
  { id: 'progress', label: 'Voortgang', hint: 'Je leerpatroon' },
]

function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [view, setView] = useState<View>('home')
  const [selectedFallacyId, setSelectedFallacyId] = useState(fallacies[0].id)
  const [sessionSettings, setSessionSettings] = useState<PracticeSettings>(defaultSettings)
  const [sessionKey, setSessionKey] = useState(0)
  const [toast, setToast] = useState('')
  const stats = getOverallStats(state)

  useEffect(() => {
    localStorage.setItem('fallacy-lab-state-v1', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function navigate(nextView: View) {
    setView(nextView)
  }

  function openFallacy(id: string) {
    setSelectedFallacyId(id)
    setView('detail')
  }

  function startPractice(overrides: Partial<PracticeSettings> = {}) {
    const nextSettings = { ...state.settings, ...overrides }
    setState((current) => ({ ...current, settings: nextSettings }))
    setSessionSettings(nextSettings)
    setSessionKey((key) => key + 1)
    setView('practice')
  }

  function updateSettings(nextSettings: PracticeSettings) {
    setState((current) => ({ ...current, settings: nextSettings }))
    setSessionSettings(nextSettings)
  }

  function toggleBookmark(id: string) {
    setState((current) => ({ ...current, bookmarkedIds: toggleId(current.bookmarkedIds, id) }))
    setToast(state.bookmarkedIds.includes(id) ? 'Verwijderd uit opgeslagen fallacies' : 'Fallacy opgeslagen')
  }

  function toggleLearned(id: string) {
    const wasMarked = state.learnedIds.includes(id)
    setState((current) => ({ ...current, learnedIds: toggleId(current.learnedIds, id) }))
    setToast(wasMarked ? 'Gemarkeerd als nieuw' : 'Gemarkeerd als geleerd')
  }

  function saveAnswer(input: Omit<AnswerRecord, 'answeredAt' | 'nextReviewAt' | 'reviewStage'>) {
    setState((current) => recordAnswer(current, input))
  }

  return (
    <FluentProvider theme={fallacyTheme} className="app-provider">
      <div className="app-shell">
        <aside className="sidebar" aria-label="Hoofdnavigatie">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">F</div>
            <div>
              <strong>Fallacy Lab</strong>
              <span>Leer scherper denken</span>
            </div>
          </div>

          <div className="sidebar-section-label">Werkruimte</div>
          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <Button
                key={item.id}
                appearance="subtle"
                className={`nav-button ${view === item.id || (view === 'detail' && item.id === 'library') ? 'is-active' : ''}`}
                icon={navIcon(item.id)}
                onClick={() => navigate(item.id)}
              >
                <span>{item.label}</span>
                <small>{item.hint}</small>
              </Button>
            ))}
          </nav>

          <div className="sidebar-spacer" />
          <Card className="sidebar-progress-card">
            <div className="eyebrow">Jouw leerpad</div>
            <div className="sidebar-progress-row">
              <strong>{stats.learned}</strong>
              <span>van {fallacies.length} geleerd</span>
            </div>
            <ProgressBar value={stats.learned / fallacies.length} />
            <button type="button" className="text-link" onClick={() => navigate('progress')}>
              Bekijk voortgang <ArrowRightRegular />
            </button>
          </Card>
          <div className="sidebar-footer">
            <span className="status-dot" />
            <span>Lokale opslag actief</span>
          </div>
        </aside>

        <div className="content-shell">
          <header className="topbar">
            <div className="mobile-brand">
              <div className="brand-mark small" aria-hidden="true">F</div>
              <strong>Fallacy Lab</strong>
            </div>
            <div className="topbar-context">
              <span className="context-dot" />
              <span>{stats.learned ? `${stats.learned} fallacies in beweging` : 'Je eerste sessie wacht'}</span>
            </div>
            <div className="topbar-actions">
              <span className="saved-count"><BookmarkFilled /> {state.bookmarkedIds.length}</span>
              <Button appearance="primary" size="small" icon={<PlayRegular />} onClick={() => startPractice()}>
                Snel oefenen
              </Button>
            </div>
          </header>

          <main className="main-content">
            {view === 'home' && (
              <Dashboard
                state={state}
                onStartPractice={() => startPractice()}
                onWeakPractice={() => startPractice({ source: 'errors' })}
                onOpenLibrary={() => navigate('library')}
                onOpenFallacy={openFallacy}
              />
            )}
            {view === 'library' && (
              <Library
                state={state}
                onOpenFallacy={openFallacy}
                onToggleBookmark={toggleBookmark}
              />
            )}
            {view === 'detail' && (
              <FallacyDetail
                state={state}
                fallacyId={selectedFallacyId}
                onBack={() => navigate('library')}
                onOpenFallacy={openFallacy}
                onToggleBookmark={toggleBookmark}
                onToggleLearned={toggleLearned}
                onStartPractice={() => startPractice({ category: fallacyById[selectedFallacyId]?.category ?? 'all' })}
              />
            )}
            {view === 'progress' && (
              <ProgressView
                state={state}
                onStartPractice={startPractice}
                onOpenFallacy={openFallacy}
              />
            )}
            {view === 'practice' && (
              <PracticeView
                key={sessionKey}
                state={state}
                settings={sessionSettings}
                onClose={() => navigate('home')}
                onAnswer={saveAnswer}
                onRestart={(nextSettings) => {
                  updateSettings(nextSettings)
                  setSessionKey((key) => key + 1)
                }}
              />
            )}
          </main>
        </div>

        <nav className="mobile-nav" aria-label="Mobiele navigatie">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id || (view === 'detail' && item.id === 'library') ? 'is-active' : ''}
              onClick={() => navigate(item.id)}
            >
              {navIcon(item.id)}
              <span>{item.label}</span>
            </button>
          ))}
          <button type="button" className={view === 'practice' ? 'is-active' : ''} onClick={() => startPractice()}>
            <TargetArrowRegular />
            <span>Oefenen</span>
          </button>
        </nav>

        {toast && <div className="toast" role="status">{toast}</div>}
      </div>
    </FluentProvider>
  )
}

function Dashboard({
  state,
  onStartPractice,
  onWeakPractice,
  onOpenLibrary,
  onOpenFallacy,
}: {
  state: AppState
  onStartPractice: () => void
  onWeakPractice: () => void
  onOpenLibrary: () => void
  onOpenFallacy: (id: string) => void
}) {
  const stats = getOverallStats(state)
  const weakest = getWeakestFallacies(state).slice(0, 3)
  const latestAnswer = state.answers[0]
  const continueFallacy = latestAnswer?.fallacyId ? fallacyById[latestAnswer.fallacyId] : fallacies[0]
  const dailyProgress = state.answers.filter((answer) => new Date(answer.answeredAt).toDateString() === new Date().toDateString()).length

  return (
    <div className="page-stack dashboard-page">
      <section className="page-heading intro-heading">
        <div>
          <div className="eyebrow accent-eyebrow"><SparkleRegular /> Korte sessies, blijvend inzicht</div>
          <h1>Leer drogredenen herkennen.</h1>
          <p>Train je radar voor slechte argumenten met voorbeelden die steeds iets lastiger worden.</p>
        </div>
        <div className="heading-note">
          <span className="heading-note-icon"><LightbulbRegular /></span>
          <span><strong>Tip van vandaag</strong><br />Vraag altijd: welk stuk van deze zin bewijst eigenlijk de conclusie?</span>
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid-top">
        <Card className="continue-card accent-card">
          <div className="card-kicker"><span className="kicker-line" /> Doorgaan met leren</div>
          <div className="continue-content">
            <div>
              <span className="continue-label">Volgende op je leerpad</span>
              <h2>{continueFallacy.nameNl}</h2>
              <p>{continueFallacy.nameEn} <span className="muted-separator">/</span> {continueFallacy.category}</p>
              <Button appearance="primary" icon={<ArrowRightRegular />} onClick={() => onOpenFallacy(continueFallacy.id)}>
                Ga verder
              </Button>
            </div>
            <div className="continue-orbit" aria-hidden="true">
              <span className="orbit-ring ring-one" />
              <span className="orbit-ring ring-two" />
              <span className="orbit-core">F</span>
            </div>
          </div>
        </Card>

        <Card className="daily-card">
          <div className="card-header-row">
            <div>
              <div className="card-kicker"><ClockRegular /> Dagelijkse oefening</div>
              <h2>Vijf minuten scherpte</h2>
            </div>
            <Badge appearance="tint" color={dailyProgress >= 5 ? 'success' : 'informative'}>{dailyProgress >= 5 ? 'Afgerond' : `${dailyProgress}/5`}</Badge>
          </div>
          <p>Een korte mix van bekende en nieuwe patronen. Fouten komen vanzelf terug.</p>
          <div className="daily-progress-line">
            <ProgressBar value={Math.min(dailyProgress / 5, 1)} />
            <span>{dailyProgress >= 5 ? 'Goed bezig' : `${5 - dailyProgress} vragen te gaan`}</span>
          </div>
          <Button appearance="outline" icon={<PlayRegular />} onClick={onStartPractice}>
            Start dagelijkse oefening
          </Button>
        </Card>
      </section>

      <section className="stats-strip" aria-label="Samenvatting van je voortgang">
        <StatItem label="Vragen beantwoord" value={String(stats.totalAnswered)} hint="in alle sessies" icon={<TargetArrowRegular />} />
        <StatItem label="Percentage correct" value={`${stats.accuracy}%`} hint="op basis van antwoorden" icon={<CheckmarkCircleFilled />} />
        <StatItem label="Fallacies geleerd" value={`${stats.learned}/${fallacies.length}`} hint={`${stats.mastered} beheerst`} icon={<BookOpenRegular />} />
        <StatItem label="Opgeslagen" value={String(state.bookmarkedIds.length)} hint="om later terug te lezen" icon={<BookmarkFilled />} />
      </section>

      <section className="dashboard-grid dashboard-grid-bottom">
        <Card className="list-card">
          <div className="section-header">
            <div>
              <div className="eyebrow">Waar je winst zit</div>
              <h2>Zwakste fallacies</h2>
            </div>
            {weakest.length > 0 && <Button appearance="subtle" onClick={onWeakPractice}>Oefen mijn zwakke punten <ArrowRightRegular /></Button>}
          </div>
          {weakest.length > 0 ? (
            <div className="weak-list">
              {weakest.map((item, index) => (
                <button type="button" className="weak-row" key={item.fallacy.id} onClick={() => onOpenFallacy(item.fallacy.id)}>
                  <span className="rank-number">0{index + 1}</span>
                  <span className="weak-name"><strong>{item.fallacy.nameNl}</strong><small>{item.fallacy.nameEn}</small></span>
                  <span className="weak-meter"><span style={{ width: `${item.accuracy ?? 0}%` }} /></span>
                  <span className="weak-score">{item.accuracy}%</span>
                  <ChevronRightRegular />
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-list compact-empty">
              <div className="empty-icon"><TargetArrowRegular /></div>
              <strong>Je hebt nog geen missers.</strong>
              <span>Na je eerste oefening zie je hier precies waar je extra aandacht kunt gebruiken.</span>
            </div>
          )}
        </Card>

        <Card className="list-card recent-card">
          <div className="section-header">
            <div>
              <div className="eyebrow">Laatste pogingen</div>
              <h2>Recente resultaten</h2>
            </div>
            <Button appearance="subtle" onClick={() => onOpenLibrary()}>Bibliotheek <ArrowRightRegular /></Button>
          </div>
          {state.answers.length > 0 ? (
            <div className="recent-list">
              {state.answers.slice(0, 4).map((answer) => <RecentAnswer key={`${answer.questionId}-${answer.answeredAt}`} answer={answer} />)}
            </div>
          ) : (
            <div className="empty-list compact-empty">
              <div className="empty-icon soft"><ClockRegular /></div>
              <strong>Je geschiedenis verschijnt hier.</strong>
              <span>Beantwoord een vraag om je leerpad te starten.</span>
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

function Library({
  state,
  onOpenFallacy,
  onToggleBookmark,
}: {
  state: AppState
  onOpenFallacy: (id: string) => void
  onToggleBookmark: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<LibraryFilter>('all')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const filteredFallacies = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return fallacies.filter((fallacy) => {
      const matchesQuery = !normalized || [fallacy.nameNl, fallacy.nameEn, fallacy.definition, fallacy.category].join(' ').toLowerCase().includes(normalized)
      const matchesCategory = category === 'all' || fallacy.category === category
      const matchesFilter =
        filter === 'all' ||
        (filter === 'beginner' && fallacy.difficulty === 'Easy') ||
        (filter === 'hard' && fallacy.difficulty === 'Hard') ||
        (filter === 'learned' && isLearned(state, fallacy.id)) ||
        (filter === 'unlearned' && !isLearned(state, fallacy.id))
      return matchesQuery && matchesCategory && matchesFilter
    })
  }, [category, filter, query, state])

  return (
    <div className="page-stack library-page">
      <section className="page-heading library-heading">
        <div>
          <div className="eyebrow accent-eyebrow"><BookOpenRegular /> De bibliotheek</div>
          <h1>Alle patronen op een rij.</h1>
          <p>Lees compact, herken het patroon en test jezelf zodra je klaar bent.</p>
        </div>
        <Badge appearance="tint" color="brand">{filteredFallacies.length} van {fallacies.length}</Badge>
      </section>

      <Card className="library-toolbar">
        <div className="search-wrap">
          <Input
            value={query}
            onChange={(_, data) => setQuery(data.value)}
            contentBefore={<SearchRegular />}
            placeholder="Zoek op strawman, persoon, oorzaak..."
            aria-label="Zoek in fallacies"
          />
        </div>
        <div className="toolbar-select">
          <FilterRegular />
          <Select aria-label="Filter op categorie" value={category} onChange={(_, data) => setCategory(data.value as Category | 'all')}>
            <option value="all">Alle categorieen</option>
            {categories.map((item) => <option key={item} value={item}>{categoryLabels[item]}</option>)}
          </Select>
        </div>
      </Card>

      <TabList selectedValue={filter} onTabSelect={(_, data) => setFilter(data.value as LibraryFilter)} className="filter-tabs" aria-label="Filter fallacies">
        <Tab value="all">Alle</Tab>
        <Tab value="beginner">Beginner</Tab>
        <Tab value="learned">Geleerd</Tab>
        <Tab value="unlearned">Nog leren</Tab>
        <Tab value="hard">Moeilijk</Tab>
      </TabList>

      {filteredFallacies.length > 0 ? (
        <div className="fallacy-grid">
          {filteredFallacies.map((fallacy) => (
            <FallacyCard key={fallacy.id} fallacy={fallacy} state={state} onOpen={onOpenFallacy} onToggleBookmark={onToggleBookmark} />
          ))}
        </div>
      ) : (
        <Card className="empty-state-card">
          <div className="empty-icon large"><SearchRegular /></div>
          <h2>Geen fallacies gevonden</h2>
          <p>Probeer een andere zoekterm of zet je filters terug.</p>
          <Button appearance="secondary" onClick={() => { setQuery(''); setCategory('all'); setFilter('all') }}>Filters wissen</Button>
        </Card>
      )}
    </div>
  )
}

function FallacyCard({
  fallacy,
  state,
  onOpen,
  onToggleBookmark,
}: {
  fallacy: Fallacy
  state: AppState
  onOpen: (id: string) => void
  onToggleBookmark: (id: string) => void
}) {
  const bookmarked = state.bookmarkedIds.includes(fallacy.id)
  const mastery = getMastery(state, fallacy.id)
  return (
    <Card className="fallacy-card">
      <div className="fallacy-card-top">
        <Badge appearance="tint" color={difficultyColor(fallacy.difficulty)}>{fallacy.difficulty}</Badge>
        <Button
          appearance="subtle"
          size="small"
          icon={bookmarked ? <BookmarkFilled /> : <BookmarkRegular />}
          aria-label={bookmarked ? `Verwijder ${fallacy.nameNl} uit opgeslagen` : `Sla ${fallacy.nameNl} op`}
          onClick={() => onToggleBookmark(fallacy.id)}
        />
      </div>
      <button type="button" className="fallacy-card-button" onClick={() => onOpen(fallacy.id)}>
        <span className="fallacy-index">{String(fallacies.findIndex((item) => item.id === fallacy.id) + 1).padStart(2, '0')}</span>
        <h2>{fallacy.nameNl}</h2>
        <p className="fallacy-en">{fallacy.nameEn}</p>
        <p className="fallacy-definition">{fallacy.definition}</p>
        <span className="card-bottom-line"><span>{fallacy.category}</span><MasteryPill mastery={mastery} /><ChevronRightRegular /></span>
      </button>
    </Card>
  )
}

function FallacyDetail({
  state,
  fallacyId,
  onBack,
  onOpenFallacy,
  onToggleBookmark,
  onToggleLearned,
  onStartPractice,
}: {
  state: AppState
  fallacyId: string
  onBack: () => void
  onOpenFallacy: (id: string) => void
  onToggleBookmark: (id: string) => void
  onToggleLearned: (id: string) => void
  onStartPractice: () => void
}) {
  const fallacy = fallacyById[fallacyId] ?? fallacies[0]
  const bookmarked = state.bookmarkedIds.includes(fallacy.id)
  const learned = state.learnedIds.includes(fallacy.id)
  const mastery = getMastery(state, fallacy.id)
  return (
    <div className="page-stack detail-page">
      <button type="button" className="back-link" onClick={onBack}><ArrowLeftRegular /> Terug naar bibliotheek</button>
      <section className="detail-hero">
        <div className="detail-hero-main">
          <div className="eyebrow accent-eyebrow"><span className="detail-number">{String(fallacies.findIndex((item) => item.id === fallacy.id) + 1).padStart(2, '0')}</span> In de bibliotheek</div>
          <div className="detail-title-row">
            <div>
              <h1>{fallacy.nameNl}</h1>
              <p className="detail-english">{fallacy.nameEn}</p>
            </div>
            <div className="detail-actions">
              <Button appearance="subtle" icon={bookmarked ? <BookmarkFilled /> : <BookmarkRegular />} onClick={() => onToggleBookmark(fallacy.id)}>
                {bookmarked ? 'Opgeslagen' : 'Opslaan'}
              </Button>
              <Button appearance={learned ? 'secondary' : 'primary'} icon={<CheckmarkRegular />} onClick={() => onToggleLearned(fallacy.id)}>
                {learned ? 'Geleerd' : 'Markeer als geleerd'}
              </Button>
            </div>
          </div>
          <div className="detail-meta"><Badge appearance="tint" color="brand">{fallacy.category}</Badge><Badge appearance="tint" color={difficultyColor(fallacy.difficulty)}>{fallacy.difficulty}</Badge><MasteryPill mastery={mastery} /></div>
        </div>
        <div className="detail-definition-card">
          <div className="eyebrow">In een zin</div>
          <p>{fallacy.definition}</p>
        </div>
      </section>

      <section className="detail-columns">
        <div className="detail-main-column">
          <Card className="detail-card explanation-card">
            <div className="eyebrow">De kern</div>
            <h2>Wat gebeurt hier?</h2>
            <p>{fallacy.explanation}</p>
            <Divider />
            <div className="quote-example"><span className="quote-mark">“</span><p>{fallacy.example}</p></div>
          </Card>
          <Card className="detail-card">
            <div className="eyebrow">Meer context</div>
            <h2>Extra voorbeelden</h2>
            <div className="example-list">{fallacy.extraExamples.map((example) => <div className="example-row" key={example}><span className="example-bullet">+</span><p>{example}</p></div>)}</div>
          </Card>
          <Card className="detail-card warning-detail-card">
            <div className="eyebrow">Waarom fout?</div>
            <h2>Waar zit de sprong?</h2>
            <p>{fallacy.whyWrong}</p>
          </Card>
        </div>
        <aside className="detail-side-column">
          <Card className="signal-card">
            <div className="signal-icon"><LightbulbRegular /></div>
            <div className="eyebrow">Herkenningssignalen</div>
            <h2>Let hierop</h2>
            <ul className="signal-list">{fallacy.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
          </Card>
          <Card className="confusion-card">
            <div className="eyebrow">Makkelijk te verwarren</div>
            <h2>Vergelijk ook</h2>
            <div className="confusion-list">{fallacy.confusedWith.map((id) => { const related = fallacyById[id]; return related ? <button type="button" key={id} onClick={() => onOpenFallacy(id)}><span><strong>{related.nameNl}</strong><small>{related.nameEn}</small></span><ArrowRightRegular /></button> : null })}</div>
          </Card>
          <Card className="practice-callout">
            <div className="eyebrow">Klaar om te testen?</div>
            <h2>Zie je hem in het wild?</h2>
            <p>Oefen met vragen uit dezelfde categorie.</p>
            <Button appearance="primary" icon={<TargetArrowRegular />} onClick={onStartPractice}>Oefen deze categorie</Button>
          </Card>
        </aside>
      </section>
    </div>
  )
}

function ProgressView({
  state,
  onStartPractice,
  onOpenFallacy,
}: {
  state: AppState
  onStartPractice: (overrides?: Partial<PracticeSettings>) => void
  onOpenFallacy: (id: string) => void
}) {
  const stats = getOverallStats(state)
  const weakest = getWeakestFallacies(state)
  const categoryStats = getCategoryStats(state)
  return (
    <div className="page-stack progress-page">
      <section className="page-heading progress-heading">
        <div>
          <div className="eyebrow accent-eyebrow"><DataBarVerticalRegular /> Je leerpatroon</div>
          <h1>Voortgang die iets zegt.</h1>
          <p>Geen scorebord. Alleen signalen die je helpen gerichter te oefenen.</p>
        </div>
        <Button appearance="primary" icon={<TargetArrowRegular />} onClick={() => onStartPractice({ source: 'errors' })}>Oefen mijn zwakke punten</Button>
      </section>

      <section className="progress-hero-grid">
        <Card className="progress-score-card">
          <div className="score-orbit" aria-hidden="true" style={{ background: `conic-gradient(var(--sage) 0deg ${stats.accuracy * 3.6}deg, #d6e8d8 ${stats.accuracy * 3.6}deg 360deg)` }}><span className="score-ring" /><strong>{stats.accuracy}%</strong></div>
          <div><div className="eyebrow">Algemene nauwkeurigheid</div><h2>{stats.totalAnswered ? 'Je ziet steeds meer patronen.' : 'Je score start bij je eerste antwoord.'}</h2><p>{stats.totalAnswered ? `${stats.correct} van ${stats.totalAnswered} antwoorden waren correct.` : 'Oefen regelmatig en kijk vooral naar de uitleg na een fout.'}</p></div>
        </Card>
        <Card className="mastery-card">
          <div className="eyebrow">Mastery</div>
          <h2>Hoeveel blijft hangen?</h2>
          <div className="mastery-grid">
            <MasteryStat label="Nieuw" value={fallacies.filter((fallacy) => getMastery(state, fallacy.id) === 'Nieuw').length} className="new" />
            <MasteryStat label="Aan het leren" value={stats.learning} className="learning" />
            <MasteryStat label="Redelijk" value={stats.redelijk} className="okay" />
            <MasteryStat label="Beheerst" value={stats.mastered} className="mastered" />
          </div>
        </Card>
      </section>

      <section className="progress-content-grid">
        <Card className="progress-panel">
          <div className="section-header"><div><div className="eyebrow">Per categorie</div><h2>Waar je sterk in bent</h2></div><TrophyRegular className="section-header-icon" /></div>
          <div className="category-progress-list">{categoryStats.map((item) => <div className="category-progress-row" key={item.category}><div className="category-row-label"><span>{item.category}</span><small>{item.attempts ? `${item.accuracy}% correct` : 'Nog geen data'}</small></div><div className="wide-meter"><span style={{ width: `${item.attempts ? item.accuracy : 0}%` }} /></div></div>)}</div>
        </Card>
        <Card className="progress-panel">
          <div className="section-header"><div><div className="eyebrow">Focus voor straks</div><h2>Moeilijkste fallacies</h2></div><LightbulbRegular className="section-header-icon" /></div>
          {weakest.length > 0 ? <div className="focus-list">{weakest.slice(0, 5).map((item) => <button type="button" key={item.fallacy.id} onClick={() => onOpenFallacy(item.fallacy.id)}><span className="focus-initial">{item.fallacy.nameNl.charAt(0)}</span><span className="focus-name"><strong>{item.fallacy.nameNl}</strong><small>{item.attempts} {item.attempts === 1 ? 'poging' : 'pogingen'}</small></span><span className="focus-score">{item.accuracy}%</span><ChevronRightRegular /></button>)}</div> : <div className="empty-list"><div className="empty-icon"><TrophyRegular /></div><strong>Je focuslijst wordt hier gevuld.</strong><span>Maak een paar oefenvragen om je patronen te ontdekken.</span></div>}
        </Card>
      </section>

      <Card className="progress-tip"><div className="progress-tip-icon"><SparkleRegular /></div><div><strong>Een fout is een geheugenhaakje.</strong><p>Fallacy Lab zet foute antwoorden opnieuw klaar: eerst binnenkort, daarna met meer ruimte ertussen.</p></div><Button appearance="subtle" icon={<ArrowRotateClockwiseRegular />} onClick={() => onStartPractice({ source: 'errors' })}>Bekijk mijn fouten</Button></Card>
    </div>
  )
}

function PracticeView({
  state,
  settings,
  onClose,
  onAnswer,
  onRestart,
}: {
  state: AppState
  settings: PracticeSettings
  onClose: () => void
  onAnswer: (input: Omit<AnswerRecord, 'answeredAt' | 'nextReviewAt' | 'reviewStage'>) => void
  onRestart: (settings: PracticeSettings) => void
}) {
  const [queue] = useState<Question[]>(() => buildQuestionQueue(state, settings))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [classification, setClassification] = useState<'fallacy' | 'none' | null>(null)
  const [selectedFallacyId, setSelectedFallacyId] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draftSettings, setDraftSettings] = useState(settings)
  const question = queue[questionIndex]

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return
      if (event.key.toLowerCase() === 'e') setShowHint((current) => !current)
      if (event.key === 'Enter' && answered) goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  function chooseClassification(next: 'fallacy' | 'none') {
    if (!question || answered) return
    setClassification(next)
    if (next === 'none') finishAnswer(next, null)
  }

  function chooseFallacy(id: string) {
    if (!question || answered || classification !== 'fallacy') return
    finishAnswer('fallacy', id)
  }

  function finishAnswer(nextClassification: 'fallacy' | 'none', nextFallacyId: string | null) {
    if (!question || answered) return
    const correctAnswer = nextClassification === 'none' ? null : nextFallacyId
    const correct = question.correctFallacyId === correctAnswer
    setSelectedFallacyId(nextFallacyId)
    setAnswered(true)
    setIsCorrect(correct)
    setSessionCorrect((score) => score + (correct ? 1 : 0))
    onAnswer({
      questionId: question.id,
      fallacyId: question.correctFallacyId,
      selectedFallacyId: nextFallacyId,
      classification: nextClassification,
      isCorrect: correct,
    })
  }

  function goNext() {
    if (!answered) return
    if (questionIndex >= queue.length - 1) {
      setFinished(true)
      return
    }
    setQuestionIndex((index) => index + 1)
    setClassification(null)
    setSelectedFallacyId(null)
    setAnswered(false)
    setIsCorrect(false)
    setShowHint(false)
  }

  if (queue.length === 0) {
    return <PracticeEmpty state={state} settings={draftSettings} onClose={onClose} onRestart={onRestart} />
  }

  if (finished) {
    return <PracticeFinished total={queue.length} correct={sessionCorrect} onClose={onClose} onRestart={() => onRestart(draftSettings)} />
  }

  const correctFallacy = question.correctFallacyId ? fallacyById[question.correctFallacyId] : null
  const selectedFallacy = selectedFallacyId ? fallacyById[selectedFallacyId] : null
  const optionFallacies = question.optionIds.map((id) => fallacyById[id]).filter(Boolean)

  return (
    <div className="practice-page">
      <div className="practice-topbar">
        <Button appearance="subtle" icon={<ArrowLeftRegular />} onClick={onClose}>Stoppen</Button>
        <div className="practice-progress"><span>Vraag {questionIndex + 1} van {queue.length}</span><div className="practice-progress-track"><span style={{ width: `${((questionIndex + (answered ? 1 : 0)) / queue.length) * 100}%` }} /></div></div>
        <Button appearance="subtle" icon={<SettingsRegular />} onClick={() => setSettingsOpen((open) => !open)}>Instellingen</Button>
      </div>

      {settingsOpen && <PracticeSettingsPanel settings={draftSettings} onChange={setDraftSettings} onRestart={() => onRestart(draftSettings)} />}

      <div className="practice-intro"><div className="eyebrow accent-eyebrow"><TargetArrowRegular /> Herkenningsronde</div><h1>Wat gebeurt er in deze zin?</h1><p>Kijk eerst naar het patroon. Pas daarna naar het label.</p><span className="shortcut-hint"><kbd>E</kbd> hint <span>·</span> <kbd>Enter</kbd> volgende</span></div>

      <Card className="question-card">
        <div className="question-meta"><Badge appearance="tint" color={difficultyColor(question.difficulty)}>{question.difficulty}</Badge><span>{question.category ?? 'Controleerbare redenering'}</span></div>
        <blockquote>{highlightStatement(question.statement, answered ? question.suspiciousPart : '')}</blockquote>
        <div className="question-divider" />
        {!answered ? (
          <div className="answer-area">
            <div className="answer-step-label"><span>01</span> Eerst de hoofdvraag</div>
            <div className="classification-grid">
              <button type="button" className={`classification-option ${classification === 'fallacy' ? 'selected' : ''}`} onClick={() => chooseClassification('fallacy')}><span className="classification-icon"><TargetArrowRegular /></span><span><strong>Dit is een fallacy</strong><small>Er zit een denkfout in</small></span><ArrowRightRegular /></button>
              <button type="button" className={`classification-option ${classification === 'none' ? 'selected' : ''}`} onClick={() => chooseClassification('none')}><span className="classification-icon neutral"><CheckmarkRegular /></span><span><strong>Geen fallacy</strong><small>Dit argument kan kloppen</small></span><ArrowRightRegular /></button>
            </div>
            {classification === 'fallacy' && <div className="label-step"><div className="answer-step-label"><span>02</span> Welke fallacy zie je?</div><div className="fallacy-options">{optionFallacies.map((fallacy) => <button type="button" key={fallacy.id} onClick={() => chooseFallacy(fallacy.id)}><span className="option-letter">{String.fromCharCode(65 + optionFallacies.indexOf(fallacy))}</span><span><strong>{fallacy.nameNl}</strong><small>{fallacy.nameEn}</small></span><ArrowRightRegular /></button>)}</div></div>}
            {showHint && <div className="hint-panel"><LightbulbRegular /><span><strong>Hint</strong> Kijk vooral naar: <mark>{question.suspiciousPart}</mark></span></div>}
          </div>
        ) : (
          <div className={`feedback-area ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-header"><span className="feedback-icon">{isCorrect ? <CheckmarkCircleFilled /> : <DismissCircleFilled />}</span><div><div className="eyebrow">{isCorrect ? 'Correct' : 'Nog een keer kijken'}</div><h2>{isCorrect ? (correctFallacy ? correctFallacy.nameNl : 'Geen fallacy') : `Dit is ${correctFallacy ? correctFallacy.nameNl : 'geen fallacy'}`}</h2></div></div>
            {!isCorrect && selectedFallacy && <p className="mistake-line">Je koos <strong>{selectedFallacy.nameNl}</strong>. Dit is echter <strong>{correctFallacy ? correctFallacy.nameNl : 'geen fallacy'}</strong>.</p>}
            <div className="feedback-copy"><div className="eyebrow">Waarom?</div><p>{question.explanation}</p><div className="highlighted-copy"><span className="eyebrow">Verdacht gedeelte</span><p>{highlightStatement(question.statement, question.suspiciousPart)}</p></div><div className="contrast-copy"><span className="eyebrow">Waarom de andere antwoorden niet kloppen</span><p>{question.contrast}</p></div></div>
            <Button appearance={isCorrect ? 'primary' : 'secondary'} icon={questionIndex >= queue.length - 1 ? <TrophyRegular /> : <ArrowRightRegular />} onClick={goNext}>{questionIndex >= queue.length - 1 ? 'Bekijk resultaat' : 'Volgende vraag'} <span className="enter-chip">Enter</span></Button>
          </div>
        )}
      </Card>
    </div>
  )
}

function PracticeSettingsPanel({
  settings,
  onChange,
  onRestart,
}: {
  settings: PracticeSettings
  onChange: (settings: PracticeSettings) => void
  onRestart: () => void
}) {
  return (
    <Card className="practice-settings-panel">
      <div className="settings-panel-heading"><div><div className="eyebrow">Sessies aanpassen</div><h2>Jouw oefenmix</h2></div><SettingsRegular /></div>
      <div className="settings-grid">
        <label>Vragen<Select value={String(settings.questionCount)} onChange={(_, data) => onChange({ ...settings, questionCount: Number(data.value) as PracticeSettings['questionCount'] })}><option value="5">5 vragen</option><option value="10">10 vragen</option><option value="20">20 vragen</option></Select></label>
        <label>Moeilijkheid<Select value={settings.difficulty} onChange={(_, data) => onChange({ ...settings, difficulty: data.value as PracticeSettings['difficulty'] })}><option value="all">Alle niveaus</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></Select></label>
        <label>Bron<Select value={settings.source} onChange={(_, data) => onChange({ ...settings, source: data.value as PracticeSettings['source'] })}><option value="all">Alles</option><option value="learned">Alleen geleerd</option><option value="errors">Alleen fouten</option></Select></label>
        <label>Categorie<Select value={settings.category} onChange={(_, data) => onChange({ ...settings, category: data.value as PracticeSettings['category'] })}><option value="all">Alle categorieen</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</Select></label>
      </div>
      <div className="settings-panel-footer"><span>Fouten worden automatisch eerder opnieuw aangeboden.</span><Button appearance="primary" icon={<ArrowRotateClockwiseRegular />} onClick={onRestart}>Start nieuwe mix</Button></div>
    </Card>
  )
}

function PracticeEmpty({
  state,
  settings,
  onClose,
  onRestart,
}: {
  state: AppState
  settings: PracticeSettings
  onClose: () => void
  onRestart: (settings: PracticeSettings) => void
}) {
  const hasErrors = state.answers.some((answer) => !answer.isCorrect)
  return <div className="practice-empty-page"><div className="empty-icon large"><TargetArrowRegular /></div><h1>Deze mix is nog leeg.</h1><p>{settings.source === 'errors' && !hasErrors ? 'Je hebt nog geen fout beantwoorde vragen om opnieuw te oefenen.' : 'Met deze filters zijn geen vragen beschikbaar.'}</p><div className="empty-actions"><Button appearance="primary" onClick={() => onRestart({ ...settings, source: 'all' })}>Oefen alles</Button><Button appearance="subtle" onClick={onClose}>Terug naar overzicht</Button></div></div>
}

function PracticeFinished({
  total,
  correct,
  onClose,
  onRestart,
}: {
  total: number
  correct: number
  onClose: () => void
  onRestart: () => void
}) {
  const percentage = Math.round((correct / total) * 100)
  return <div className="practice-finished-page"><div className="finished-mark"><TrophyRegular /></div><div className="eyebrow accent-eyebrow">Sessie afgerond</div><h1>{percentage >= 80 ? 'Sterke ronde.' : 'Goed dat je bent blijven kijken.'}</h1><p>Je had <strong>{correct} van {total}</strong> antwoorden correct. Bekijk de uitleg terug en laat de lastige patronen nog eens langskomen.</p><div className="finished-score"><span style={{ width: `${percentage}%` }} /><strong>{percentage}%</strong></div><div className="empty-actions"><Button appearance="primary" icon={<ArrowRotateClockwiseRegular />} onClick={onRestart}>Nog een ronde</Button><Button appearance="subtle" onClick={onClose}>Naar overzicht</Button></div></div>
}

function StatItem({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) {
  return <div className="stat-item"><span className="stat-icon">{icon}</span><div><div className="stat-label">{label}</div><strong>{value}</strong><small>{hint}</small></div></div>
}

function MasteryStat({ label, value, className }: { label: string; value: number; className: string }) {
  return <div className={`mastery-stat ${className}`}><strong>{value}</strong><span>{label}</span></div>
}

function MasteryPill({ mastery }: { mastery: Mastery }) {
  const color = mastery === 'Beheerst' ? 'success' : mastery === 'Redelijk' ? 'informative' : mastery === 'Aan het leren' ? 'warning' : 'subtle'
  return <Badge appearance="tint" color={color}>{mastery}</Badge>
}

function RecentAnswer({ answer }: { answer: AnswerRecord }) {
  const question = getQuestionById(answer.questionId)
  const label = answer.fallacyId ? fallacyById[answer.fallacyId]?.nameNl : 'Geen fallacy'
  return <div className="recent-row"><span className={`result-dot ${answer.isCorrect ? 'is-correct' : 'is-wrong'}`}>{answer.isCorrect ? <CheckmarkRegular /> : '!'}</span><span className="recent-text"><strong>{label}</strong><small>{question?.difficulty ?? 'Oefening'} <span>·</span> {formatRelativeTime(answer.answeredAt)}</small></span><span className={answer.isCorrect ? 'result-label correct-label' : 'result-label wrong-label'}>{answer.isCorrect ? 'Correct' : 'Opnieuw'}</span></div>
}

function navIcon(id: string) {
  if (id === 'home') return <HomeRegular />
  if (id === 'library') return <BookOpenRegular />
  return <DataBarVerticalRegular />
}

function difficultyColor(difficulty: Difficulty) {
  if (difficulty === 'Easy') return 'success' as const
  if (difficulty === 'Medium') return 'warning' as const
  return 'danger' as const
}

function highlightStatement(statement: string, phrase: string) {
  if (!phrase) return statement
  const start = statement.indexOf(phrase)
  if (start === -1) return statement
  return <>{statement.slice(0, start)}<mark>{phrase}</mark>{statement.slice(start + phrase.length)}</>
}

function formatRelativeTime(timestamp: number) {
  const diff = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'net gedaan'
  if (minutes < 60) return `${minutes} min geleden`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} uur geleden`
  return `${Math.floor(hours / 24)} d geleden`
}

export default App
