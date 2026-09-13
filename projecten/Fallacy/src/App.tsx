import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  categories,
  fallacies,
  fallacyById,
  questions,
  type Category,
  type Difficulty,
  type Fallacy,
  type PracticeMode,
  type Question,
} from './data'
import {
  addSession,
  defaultSettings,
  getAccuracy,
  getCategoryStats,
  getMastery,
  getQuestionById,
  getStats,
  getWeakSpots,
  loadState,
  recordAnswer,
  selectQuestions,
  toggleId,
  type AppState,
  type PracticeSettings,
} from './learning'
import './App.css'

type View = 'home' | 'library' | 'practice' | 'progress' | 'detail'
type LibraryFilter = 'all' | 'needs-work' | 'strong' | 'saved'
type IconName =
  | 'home'
  | 'book'
  | 'target'
  | 'chart'
  | 'search'
  | 'arrow'
  | 'chevron'
  | 'bookmark'
  | 'check'
  | 'clock'
  | 'spark'
  | 'moon'
  | 'sun'
  | 'flame'
  | 'refresh'
  | 'brain'
  | 'play'
  | 'timer'
  | 'quote'
  | 'filter'
  | 'close'
  | 'info'

const iconPaths: Record<IconName, string> = {
  home: 'M3 10.8 12 3l9 7.8v8.7a1.5 1.5 0 0 1-1.5 1.5h-4.3v-6.2H8.8V21H4.5A1.5 1.5 0 0 1 3 19.5v-8.7Z',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5m0-16v16m3-13h9m-9 4h7',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-4.5h.01',
  chart: 'M4 19.5V14m5 5.5V9m5 10.5V4.5m5 15V12',
  search: 'm20 20-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z',
  arrow: 'M5 12h13m-5-5 5 5-5 5',
  chevron: 'm9 5 7 7-7 7',
  bookmark: 'M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z',
  check: 'm5 12.5 4.2 4.2L19 7',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2',
  spark: 'm12 3 1.1 5.2L18 10l-4.9 1.8L12 17l-1.1-5.2L6 10l4.9-1.8L12 3Zm6.3 11.8.5 2.4 2.2.8-2.2.8-.5 2.4-.5-2.4-2.2-.8 2.2-.8.5-2.4Z',
  moon: 'M20.8 15.2A8.8 8.8 0 0 1 8.8 3.2a9 9 0 1 0 12 12Z',
  sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2-1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  flame: 'M12.5 21c4.2 0 7-2.5 7-6.4 0-3.3-2.1-5.2-4.1-7.5-.6 2-1.5 3.1-2.4 3.8.2-3.8-1.6-6.3-4.6-8.9.1 3.5-3.8 5.6-3.8 10.1C4.6 17.9 7.6 21 12.5 21Zm-.2-2.5c-1.7 0-3-1.2-3-2.9 0-1.1.6-2.2 1.7-3.4.1 1.4.7 2.3 1.6 3 .2-.6.5-1.1 1-1.8.6.8 1 1.5 1 2.3 0 1.7-1.3 2.8-3.3 2.8Z',
  refresh: 'M20 11a8.1 8.1 0 0 0-14.7-3L3 11m0 0V5m0 6h6m-5 2a8.1 8.1 0 0 0 14.7 3L21 13m0 0v6m0-6h-6',
  brain: 'M9.2 4.1A3.2 3.2 0 0 0 6 7.3c0 .3 0 .6.1.9A3.7 3.7 0 0 0 4 11.5a3.6 3.6 0 0 0 2.1 3.3A3.2 3.2 0 0 0 9 20a3.1 3.1 0 0 0 3-2.2 3.1 3.1 0 0 0 3 2.2 3.2 3.2 0 0 0 2.9-5.2 3.6 3.6 0 0 0 2.1-3.3 3.7 3.7 0 0 0-2.1-3.3A3.2 3.2 0 0 0 15 4.1a3.1 3.1 0 0 0-3 2.2 3.1 3.1 0 0 0-2.8-2.2ZM12 6.5V18m-3-6h3m3-2h-3',
  play: 'M8 5.3a1.5 1.5 0 0 1 2.3-1.2l8.2 6.1a2.2 2.2 0 0 1 0 3.6l-8.2 6.1A1.5 1.5 0 0 1 8 18.7V5.3Z',
  timer: 'M9 2h6m-3 0v3m7.1.9 1.4-1.4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-4v4l2.8 1.8',
  quote: 'M9.2 11.2H5.5A1.5 1.5 0 0 0 4 12.7v4.8A1.5 1.5 0 0 0 5.5 19h3.7a1.5 1.5 0 0 0 1.5-1.5v-7A4.5 4.5 0 0 0 6.2 6H5.5m9.3 5.2h3.7a1.5 1.5 0 0 1 1.5 1.5v4.8a1.5 1.5 0 0 1-1.5 1.5h-3.7a1.5 1.5 0 0 1-1.5-1.5v-7A4.5 4.5 0 0 1 17.8 6h.7',
  filter: 'M4 5h16M7 12h10m-6 7h2',
  close: 'm6 6 12 12M18 6 6 18',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5m0-8h.01',
}

const navItems: { id: Exclude<View, 'detail'>; label: string; note: string; icon: IconName }[] = [
  { id: 'home', label: 'Today', note: 'Your starting point', icon: 'home' },
  { id: 'library', label: 'Learn', note: 'The field guide', icon: 'book' },
  { id: 'practice', label: 'Practice', note: 'Train your radar', icon: 'target' },
  { id: 'progress', label: 'Progress', note: 'Patterns over time', icon: 'chart' },
]

const modeMeta: Record<PracticeMode, { label: string; eyebrow: string; description: string; detail: string; icon: IconName; className: string }> = {
  identify: {
    label: 'Identify the fallacy',
    eyebrow: 'Name the move',
    description: 'Read a real-world argument and choose the pattern hiding inside it.',
    detail: 'Multiple choice · 5 min',
    icon: 'target',
    className: 'mode-lime',
  },
  valid: {
    label: 'Fallacy or valid?',
    eyebrow: 'Keep your skepticism honest',
    description: 'Not every imperfect argument is a fallacy. Decide when the reasoning holds up.',
    detail: 'Binary calls · 4 min',
    icon: 'check',
    className: 'mode-teal',
  },
  scenario: {
    label: 'Scenario analysis',
    eyebrow: 'Slow down the claim',
    description: 'Unpack longer debates, ads, and conversations with a full explanation after your call.',
    detail: 'Deep reads · 8 min',
    icon: 'quote',
    className: 'mode-violet',
  },
  speed: {
    label: 'Speed round',
    eyebrow: 'Build your streak',
    description: 'Quick decisions against the clock. Can you keep a clear head when the timer talks back?',
    detail: '45 seconds · best score',
    icon: 'timer',
    className: 'mode-orange',
  },
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  )
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [view, setView] = useState<View>('home')
  const [selectedFallacyId, setSelectedFallacyId] = useState(fallacies[0].id)
  const [activeMode, setActiveMode] = useState<PracticeMode | null>(null)
  const [practiceKey, setPracticeKey] = useState(0)
  const [toast, setToast] = useState('')
  const stats = useMemo(() => getStats(state), [state])

  useEffect(() => {
    window.localStorage.setItem('signal-noise-fallacy-lab-v1', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
  }, [state.theme])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view, practiceKey, selectedFallacyId])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function navigate(nextView: View) {
    setView(nextView)
    if (nextView !== 'practice') setActiveMode(null)
  }

  function startPractice(mode?: PracticeMode) {
    setActiveMode(mode ?? null)
    setPracticeKey((value) => value + 1)
    setView('practice')
  }

  function openFallacy(id: string) {
    setSelectedFallacyId(id)
    setView('detail')
  }

  function toggleSaved(id: string) {
    const wasSaved = state.savedIds.includes(id)
    setState((current) => ({ ...current, savedIds: toggleId(current.savedIds, id) }))
    setToast(wasSaved ? 'Removed from your saved list' : 'Saved to your field notes')
  }

  function toggleLearned(id: string) {
    const wasLearned = state.learnedIds.includes(id)
    setState((current) => ({ ...current, learnedIds: toggleId(current.learnedIds, id) }))
    setToast(wasLearned ? 'Moved back to your learning queue' : 'Marked as familiar')
  }

  function saveAnswer(answer: Parameters<typeof recordAnswer>[1]) {
    setState((current) => recordAnswer(current, answer))
  }

  function saveSession(session: Parameters<typeof addSession>[1]) {
    setState((current) => addSession(current, session))
  }

  function toggleTheme() {
    setState((current) => ({ ...current, theme: current.theme === 'dark' ? 'light' : 'dark' }))
  }

  function resetProgress() {
    if (!window.confirm('Reset all local answers, saved notes, and session history?')) return
    setState((current) => ({ ...current, answers: [], sessions: [], savedIds: [], learnedIds: [] }))
    setToast('Local progress reset')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <button type="button" className="brand" onClick={() => navigate('home')} aria-label="Signal / Noise home">
          <span className="brand-mark"><span>S</span><span>N</span></span>
          <span className="brand-type"><strong>signal / noise</strong><small>fallacy lab</small></span>
        </button>

        <div className="sidebar-label">Workspace</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={['nav-item', view === item.id || (view === 'detail' && item.id === 'library') ? 'is-active' : ''].filter(Boolean).join(' ')}
              onClick={() => item.id === 'practice' ? startPractice() : navigate(item.id)}
            >
              <span className="nav-icon"><Icon name={item.icon} /></span>
              <span className="nav-copy"><strong>{item.label}</strong><small>{item.note}</small></span>
              {item.id === 'practice' && state.answers.some((answer) => !answer.isCorrect) && <span className="nav-dot" aria-label="You have mistakes to revisit" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="local-card">
          <div className="local-card-top"><span className="live-dot" /><span>Local only</span><Icon name="info" size={14} /></div>
          <p>Your answers stay in this browser. No account, no cloud, no noise.</p>
        </div>
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          <span className="theme-icon"><Icon name={state.theme === 'dark' ? 'sun' : 'moon'} size={16} /></span>
          <span>{state.theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark compact"><span>S</span><span>N</span></span>
            <strong>signal / noise</strong>
          </div>
          <div className="topbar-context">
            <span className="live-dot" />
            <span>Private practice room</span>
          </div>
          <div className="topbar-actions">
            <button type="button" className="saved-pill" aria-label={'Open saved field notes (' + state.savedIds.length + ')'} onClick={() => { navigate('library'); setToast('Showing the field guide — use Saved to filter your notes') }}>
              <Icon name="bookmark" size={16} /> <span>{state.savedIds.length}</span>
            </button>
            <button type="button" className="topbar-cta" onClick={() => startPractice('identify')}>
              <Icon name="play" size={14} /> Quick practice
            </button>
          </div>
        </header>

        <main className="main-content">
          {view === 'home' && (
            <Home
              state={state}
              stats={stats}
              onPractice={startPractice}
              onOpenLibrary={() => navigate('library')}
              onOpenProgress={() => navigate('progress')}
              onOpenFallacy={openFallacy}
            />
          )}
          {view === 'library' && (
            <Library state={state} onOpen={openFallacy} onToggleSaved={toggleSaved} />
          )}
          {view === 'detail' && (
            <FallacyDetail
              state={state}
              fallacyId={selectedFallacyId}
              onBack={() => navigate('library')}
              onOpen={openFallacy}
              onToggleSaved={toggleSaved}
              onToggleLearned={toggleLearned}
              onPractice={() => startPractice('identify')}
            />
          )}
          {view === 'progress' && (
            <Progress
              state={state}
              stats={stats}
              onPractice={startPractice}
              onOpen={openFallacy}
              onReset={resetProgress}
            />
          )}
          {view === 'practice' && (
            activeMode ? (
              <PracticeSession
                key={practiceKey}
                state={state}
                mode={activeMode}
                settings={defaultSettings}
                onAnswer={saveAnswer}
                onSessionComplete={saveSession}
                onBack={() => { setActiveMode(null); setView('practice') }}
                onExit={() => navigate('home')}
                onStartAgain={() => { setPracticeKey((value) => value + 1) }}
              />
            ) : (
              <PracticeHub state={state} onStart={startPractice} />
            )
          )}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={view === item.id || (view === 'detail' && item.id === 'library') ? 'is-active' : ''}
            onClick={() => item.id === 'practice' ? startPractice() : navigate(item.id)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {toast && <div className="toast" role="status"><Icon name="check" size={15} />{toast}</div>}
    </div>
  )
}

function Home({
  state,
  stats,
  onPractice,
  onOpenLibrary,
  onOpenProgress,
  onOpenFallacy,
}: {
  state: AppState
  stats: ReturnType<typeof getStats>
  onPractice: (mode?: PracticeMode) => void
  onOpenLibrary: () => void
  onOpenProgress: () => void
  onOpenFallacy: (id: string) => void
}) {
  const weakSpots = getWeakSpots(state)
  const nextFallacy = weakSpots[0]?.fallacy ?? fallacies[0]
  const dailyCount = state.answers.filter((answer) => new Date(answer.answeredAt).toDateString() === new Date().toDateString()).length
  const lastSession = state.sessions[0]

  return (
    <div className="page-stack home-page">
      <section className="hero-grid">
        <div className="hero-card">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-lime"><span className="eyebrow-mark"><Icon name="spark" size={13} /></span> A five-minute thinking ritual</div>
            <h1>See the move.<br /><em>Name the fallacy.</em></h1>
            <p>Arguments rarely announce their weak spots. Train your eye to catch the hidden leap, ask a better question, and stay honest when the answer is inconvenient.</p>
            <div className="hero-actions">
              <button type="button" className="button button-primary" onClick={() => onPractice('identify')}><Icon name="play" size={15} /> Start a practice set <Icon name="arrow" size={16} /></button>
              <button type="button" className="button button-ghost" onClick={onOpenLibrary}>Browse the field guide</button>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-grid" />
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="visual-node node-one" />
            <span className="visual-node node-two" />
            <span className="visual-node node-three" />
            <div className="signal-chip chip-top"><span className="chip-dot lime" /> CLAIM</div>
            <div className="signal-chip chip-bottom"><span className="chip-dot violet" /> ASSUMPTION</div>
            <div className="visual-core"><span>?</span><small>look closer</small></div>
          </div>
          <div className="hero-footer">
            <span><Icon name="brain" size={15} /> 24 patterns to learn</span>
            <span><Icon name="clock" size={15} /> Built for short sessions</span>
            <span><Icon name="moon" size={15} /> Works offline</span>
          </div>
        </div>

        <aside className="today-card">
          <div className="card-overline"><span className="overline-line" /> TODAY’S SIGNAL</div>
          <div className="today-number">{String(Math.min(dailyCount, 5)).padStart(2, '0')}<span>/05</span></div>
          <h2>{dailyCount >= 5 ? 'You made the time.' : 'A small reset beats a perfect plan.'}</h2>
          <p>{dailyCount >= 5 ? 'Daily practice complete. Let the ideas breathe, then come back tomorrow.' : 'Five thoughtful calls today will sharpen more than an hour of passive reading.'}</p>
          <div className="mini-progress"><span style={{ width: String(Math.min(dailyCount / 5, 1) * 100) + '%' }} /></div>
          <button type="button" className="text-button" onClick={() => onPractice('valid')}>{dailyCount >= 5 ? 'Keep going anyway' : 'Do today’s set'} <Icon name="arrow" size={15} /></button>
          <div className="today-note"><Icon name="spark" size={15} /><span><strong>Prompt</strong> — What would change your mind?</span></div>
        </aside>
      </section>

      <section className="stats-row" aria-label="Your practice summary">
        <StatTile label="Questions answered" value={String(stats.total)} hint={stats.total ? 'Keep the loop going' : 'Your first call is waiting'} icon="target" />
        <StatTile label="Accuracy" value={String(stats.accuracy) + '%'} hint={stats.total ? 'Across every mode' : 'A baseline starts here'} icon="chart" accent="teal" />
        <StatTile label="Best streak" value={String(stats.bestStreak)} hint={stats.bestStreak ? 'Consecutive clear reads' : 'Find your rhythm'} icon="flame" accent="orange" />
        <StatTile label="Patterns in hand" value={String(stats.learned) + '/' + String(fallacies.length)} hint={String(stats.mastered) + ' strongly held'} icon="brain" accent="violet" />
      </section>

      <section className="section-heading with-action">
        <div><div className="eyebrow">Choose your angle</div><h2>Practice the way your brain needs today.</h2></div>
        <button type="button" className="text-button" onClick={() => onPractice()}>{lastSession ? 'Change the mode' : 'See all modes'} <Icon name="arrow" size={15} /></button>
      </section>
      <section className="mode-preview-grid">
        {(Object.keys(modeMeta) as PracticeMode[]).map((mode) => (
          <button type="button" key={mode} className={['mode-preview', modeMeta[mode].className].join(' ')} onClick={() => onPractice(mode)}>
            <span className="mode-preview-icon"><Icon name={modeMeta[mode].icon} size={21} /></span>
            <span className="mode-preview-copy"><small>{modeMeta[mode].eyebrow}</small><strong>{modeMeta[mode].label}</strong><span>{modeMeta[mode].description}</span></span>
            <span className="mode-preview-arrow"><Icon name="arrow" size={16} /></span>
          </button>
        ))}
      </section>

      <section className="home-lower-grid">
        <div className="focus-card">
          <div className="section-heading"><div><div className="eyebrow">Adaptive focus</div><h2>Your next useful wobble.</h2></div><span className="section-icon"><Icon name="spark" size={17} /></span></div>
          <p className="section-intro">{weakSpots.length ? 'Your misses come back with a little more space around them. That is how a weak spot becomes a reflex.' : 'Once you have a few answers, this space will point you toward the patterns worth revisiting.'}</p>
          {weakSpots.length ? (
            <div className="focus-list">
              {weakSpots.slice(0, 3).map((item, index) => (
                <button type="button" key={item.fallacy.id} className="focus-row" onClick={() => onOpenFallacy(item.fallacy.id)}>
                  <span className="focus-index">0{index + 1}</span>
                  <span className="focus-name"><strong>{item.fallacy.name}</strong><small>{item.attempts} {item.attempts === 1 ? 'attempt' : 'attempts'} · {item.mastery}</small></span>
                  <span className="focus-meter"><span style={{ width: String(item.accuracy ?? 0) + '%' }} /></span>
                  <span className="focus-score">{item.accuracy}%</span><Icon name="chevron" size={15} />
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-inline"><span className="empty-round"><Icon name="target" size={18} /></span><span><strong>No weak spots yet.</strong><small>Practice a round and the app will tune the next one for you.</small></span></div>
          )}
          <button type="button" className="inline-link" onClick={() => onPractice(weakSpots.length ? 'identify' : undefined)}>{weakSpots.length ? 'Practice my weak spots' : 'Start finding your pattern'} <Icon name="arrow" size={15} /></button>
        </div>

        <div className="continue-card">
          <div className="section-heading"><div><div className="eyebrow">Keep the thread</div><h2>{lastSession ? 'Your last read' : 'A good first read'}</h2></div><span className="continue-tag">{lastSession ? modeMeta[lastSession.mode].label : 'Suggested'}</span></div>
          <div className="continue-main">
            <div className="continue-number">{String(fallacies.findIndex((fallacy) => fallacy.id === nextFallacy.id) + 1).padStart(2, '0')}</div>
            <div><small>Try this one next</small><h3>{nextFallacy.name}</h3><p>{nextFallacy.definition}</p></div>
          </div>
          <div className="continue-actions"><button type="button" className="button button-primary small-button" onClick={() => onOpenFallacy(nextFallacy.id)}>Open field note <Icon name="arrow" size={15} /></button><button type="button" className="icon-button" aria-label="Open progress" onClick={onOpenProgress}><Icon name="chart" size={17} /></button></div>
        </div>
      </section>
    </div>
  )
}

function StatTile({ label, value, hint, icon, accent = 'lime' }: { label: string; value: string; hint: string; icon: IconName; accent?: string }) {
  return (
    <div className={['stat-tile', 'accent-' + accent].join(' ')}>
      <span className="stat-icon"><Icon name={icon} size={17} /></span>
      <span className="stat-copy"><small>{label}</small><strong>{value}</strong><span>{hint}</span></span>
    </div>
  )
}

function PracticeHub({ state, onStart }: { state: AppState; onStart: (mode?: PracticeMode) => void }) {
  const weakSpots = getWeakSpots(state)
  return (
    <div className="page-stack practice-page">
      <section className="practice-heading">
        <div><div className="eyebrow eyebrow-lime"><span className="eyebrow-mark"><Icon name="target" size={13} /></span> Training room</div><h1>Choose your kind of hard.</h1><p>Every mode trains a different part of the skill: spotting, resisting, unpacking, and responding under pressure.</p></div>
        <div className="practice-heading-stamp"><span className="stamp-top">ADAPTIVE</span><strong>{weakSpots.length ? 'Focus mode on' : 'Baseline mode'}</strong><span>{weakSpots.length ? 'Your miss patterns shape the queue.' : 'Your first few answers set the baseline.'}</span></div>
      </section>
      <section className="mode-hub-grid">
        {(Object.keys(modeMeta) as PracticeMode[]).map((mode, index) => (
          <button type="button" key={mode} className={['mode-hub-card', modeMeta[mode].className].join(' ')} onClick={() => onStart(mode)}>
            <span className="mode-card-top"><span className="mode-card-index">0{index + 1}</span><span className="mode-card-icon"><Icon name={modeMeta[mode].icon} size={23} /></span></span>
            <span className="mode-card-body"><small>{modeMeta[mode].eyebrow}</small><strong>{modeMeta[mode].label}</strong><span>{modeMeta[mode].description}</span></span>
            <span className="mode-card-footer"><span>{modeMeta[mode].detail}</span><Icon name="arrow" size={17} /></span>
          </button>
        ))}
      </section>
      <div className="adaptive-banner"><span className="adaptive-banner-icon"><Icon name="spark" size={18} /></span><span><strong>The queue learns with you.</strong> Miss a pattern and it gets another seat in your next practice set. Get it right repeatedly and it gives your attention to something less familiar.</span><button type="button" className="text-button" onClick={() => onStart(weakSpots.length ? 'identify' : 'valid')}>Use my focus <Icon name="arrow" size={15} /></button></div>
    </div>
  )
}

function Library({ state, onOpen, onToggleSaved }: { state: AppState; onOpen: (id: string) => void; onToggleSaved: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [filter, setFilter] = useState<LibraryFilter>('all')
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = useMemo(() => fallacies.filter((fallacy) => {
    const haystack = [fallacy.name, fallacy.alsoKnownAs, fallacy.definition, fallacy.explanation, fallacy.category].join(' ').toLowerCase()
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery)
    const matchesCategory = category === 'all' || fallacy.category === category
    const matchesFilter = filter === 'all'
      || (filter === 'needs-work' && getMastery(state, fallacy.id) !== 'Strong')
      || (filter === 'strong' && getMastery(state, fallacy.id) === 'Strong')
      || (filter === 'saved' && state.savedIds.includes(fallacy.id))
    return matchesQuery && matchesCategory && matchesFilter
  }), [category, filter, normalizedQuery, state])

  return (
    <div className="page-stack library-page">
      <section className="page-heading library-heading"><div><div className="eyebrow eyebrow-lime"><span className="eyebrow-mark"><Icon name="book" size={13} /></span> Field guide</div><h1>Learn the shape of an argument.</h1><p>Short notes for the pattern, the leap, and the look-alikes that make it easy to miss.</p></div><div className="library-count"><strong>{String(filtered.length).padStart(2, '0')}</strong><span>of {fallacies.length} notes</span></div></section>
      <section className="library-toolbar">
        <label className="search-field"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, pattern, or phrase..." aria-label="Search fallacies" />{query && <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={15} /></button>}</label>
        <label className="category-select"><Icon name="filter" size={16} /><select value={category} onChange={(event) => setCategory(event.target.value as Category | 'all')} aria-label="Filter by category"><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </section>
      <div className="filter-row" role="tablist" aria-label="Filter field guide">
        {([
          ['all', 'All notes'],
          ['needs-work', 'Needs attention'],
          ['strong', 'Strong'],
          ['saved', 'Saved'],
        ] as [LibraryFilter, string][]).map(([value, label]) => <button type="button" key={value} className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)} role="tab" aria-selected={filter === value}>{label}{value === 'saved' && state.savedIds.length > 0 ? <span>{state.savedIds.length}</span> : null}</button>)}
      </div>
      {filtered.length ? <div className="library-grid">{filtered.map((fallacy) => <FallacyCard key={fallacy.id} fallacy={fallacy} state={state} onOpen={onOpen} onToggleSaved={onToggleSaved} />)}</div> : <div className="empty-state"><span className="empty-round large"><Icon name="search" size={22} /></span><h2>No notes match that search.</h2><p>Try a broader phrase or clear one of the filters.</p><button type="button" className="button button-ghost" onClick={() => { setQuery(''); setCategory('all'); setFilter('all') }}>Reset filters</button></div>}
    </div>
  )
}

function FallacyCard({ fallacy, state, onOpen, onToggleSaved }: { fallacy: Fallacy; state: AppState; onOpen: (id: string) => void; onToggleSaved: (id: string) => void }) {
  const accuracy = getAccuracy(state, fallacy.id)
  const mastery = getMastery(state, fallacy.id)
  const isSaved = state.savedIds.includes(fallacy.id)
  return (
    <article className="fallacy-card">
      <div className="fallacy-card-top"><span className={['difficulty-pill', difficultyClass(fallacy.difficulty)].join(' ')}>{fallacy.difficulty}</span><button type="button" className={['bookmark-button', isSaved ? 'is-saved' : ''].filter(Boolean).join(' ')} onClick={() => onToggleSaved(fallacy.id)} aria-label={isSaved ? 'Remove ' + fallacy.name + ' from saved notes' : 'Save ' + fallacy.name}><Icon name="bookmark" size={16} /></button></div>
      <button type="button" className="fallacy-card-main" onClick={() => onOpen(fallacy.id)}><span className="fallacy-number">{String(fallacies.findIndex((item) => item.id === fallacy.id) + 1).padStart(2, '0')}</span><h2>{fallacy.name}</h2><small>{fallacy.alsoKnownAs}</small><p>{fallacy.definition}</p></button>
      <div className="fallacy-card-bottom"><span className="category-label">{fallacy.category}</span><span className={['mastery-label', masteryClass(mastery)].join(' ')}><span />{mastery}</span>{accuracy !== null && <span className="card-accuracy">{accuracy}%</span>}<button type="button" className="card-arrow" onClick={() => onOpen(fallacy.id)} aria-label={'Open ' + fallacy.name}><Icon name="arrow" size={15} /></button></div>
    </article>
  )
}

function FallacyDetail({
  state,
  fallacyId,
  onBack,
  onOpen,
  onToggleSaved,
  onToggleLearned,
  onPractice,
}: {
  state: AppState
  fallacyId: string
  onBack: () => void
  onOpen: (id: string) => void
  onToggleSaved: (id: string) => void
  onToggleLearned: (id: string) => void
  onPractice: () => void
}) {
  const fallacy = fallacyById[fallacyId] ?? fallacies[0]
  const isSaved = state.savedIds.includes(fallacy.id)
  const isLearned = state.learnedIds.includes(fallacy.id)
  const mastery = getMastery(state, fallacy.id)
  return (
    <div className="page-stack detail-page">
      <button type="button" className="back-link" onClick={onBack}><Icon name="arrow" size={15} /> Back to field guide</button>
      <section className="detail-hero"><div className="detail-hero-number">{String(fallacies.findIndex((item) => item.id === fallacy.id) + 1).padStart(2, '0')}</div><div className="detail-title"><div className="eyebrow eyebrow-lime">Field note · {fallacy.category}</div><h1>{fallacy.name}</h1><p>{fallacy.alsoKnownAs}</p></div><div className="detail-actions"><button type="button" className={['button', 'button-ghost', isSaved ? 'button-saved' : ''].filter(Boolean).join(' ')} onClick={() => onToggleSaved(fallacy.id)}><Icon name="bookmark" size={16} />{isSaved ? 'Saved' : 'Save note'}</button><button type="button" className={['button', isLearned ? 'button-secondary' : 'button-primary'].join(' ')} onClick={() => onToggleLearned(fallacy.id)}><Icon name="check" size={16} />{isLearned ? 'In your toolkit' : 'Mark familiar'}</button></div></section>
      <div className="detail-definition"><span className="definition-label">In one line</span><p>{fallacy.definition}</p><span className={['mastery-chip', masteryClass(mastery)].join(' ')}><span /> {mastery}</span></div>
      <section className="detail-grid">
        <div className="detail-main">
          <article className="detail-block"><div className="detail-block-heading"><span className="detail-block-number">01</span><div><small>The move</small><h2>What is happening here?</h2></div></div><p>{fallacy.explanation}</p></article>
          <article className="detail-block example-block"><div className="detail-block-heading"><span className="detail-block-number">02</span><div><small>In the wild</small><h2>A realistic example</h2></div></div><div className="quote-card"><span className="quote-mark">“</span><p>{fallacy.realisticExample}</p><span className="quote-tail">a claim worth slowing down for</span></div><div className="why-fails"><span className="why-fails-label"><Icon name="spark" size={14} /> Why it fails</span><p>{fallacy.whyItFails}</p></div></article>
          <article className="detail-block"><div className="detail-block-heading"><span className="detail-block-number">03</span><div><small>The pocket version</small><h2>Simple example</h2></div></div><div className="simple-example">“{fallacy.simpleExample}”</div></article>
        </div>
        <aside className="detail-side">
          <article className="signal-card"><div className="detail-block-heading compact-heading"><span className="signal-card-icon"><Icon name="search" size={17} /></span><div><small>Pattern recognition</small><h2>Listen for this</h2></div></div><ul>{fallacy.tips.map((tip) => <li key={tip}><span><Icon name="check" size={12} /></span>{tip}</li>)}</ul></article>
          <article className="confused-card"><div className="detail-block-heading compact-heading"><span className="signal-card-icon violet-icon"><Icon name="brain" size={17} /></span><div><small>Close cousins</small><h2>Do not mix it up with…</h2></div></div><div className="confused-list">{fallacy.confusedWith.map((item) => { const related = fallacyById[item.id]; return related ? <button type="button" key={item.id} onClick={() => onOpen(item.id)}><span><strong>{related.name}</strong><small>{item.distinction}</small></span><Icon name="chevron" size={15} /></button> : null })}</div></article>
          <article className="practice-prompt"><span className="prompt-icon"><Icon name="target" size={18} /></span><div><small>Make it stick</small><strong>See this pattern in context.</strong><button type="button" className="inline-link" onClick={onPractice}>Practice this family <Icon name="arrow" size={14} /></button></div></article>
        </aside>
      </section>
    </div>
  )
}

function Progress({ state, stats, onPractice, onOpen, onReset }: { state: AppState; stats: ReturnType<typeof getStats>; onPractice: (mode?: PracticeMode) => void; onOpen: (id: string) => void; onReset: () => void }) {
  const weakSpots = getWeakSpots(state)
  const categoryStats = getCategoryStats(state)
  const masteryCounts = {
    New: fallacies.filter((item) => getMastery(state, item.id) === 'New').length,
    'Warming up': fallacies.filter((item) => getMastery(state, item.id) === 'Warming up').length,
    Practicing: fallacies.filter((item) => getMastery(state, item.id) === 'Practicing').length,
    Strong: fallacies.filter((item) => getMastery(state, item.id) === 'Strong').length,
  }
  return (
    <div className="page-stack progress-page">
      <section className="page-heading progress-heading"><div><div className="eyebrow eyebrow-lime"><span className="eyebrow-mark"><Icon name="chart" size={13} /></span> Your pattern</div><h1>Progress that tells you something.</h1><p>Not a leaderboard. A clearer picture of what your attention is learning to notice.</p></div><button type="button" className="button button-primary" onClick={() => onPractice('identify')}><Icon name="play" size={15} /> Practice weak spots</button></section>
      <section className="progress-hero"><div className="progress-hero-copy"><span className="eyebrow">Current read</span><h2>{state.answers.length ? stats.accuracy >= 75 ? 'Your signal is getting cleaner.' : 'You are finding the useful friction.' : 'Your baseline starts with one honest call.'}</h2><p>{state.answers.length ? String(stats.correct) + ' of ' + String(stats.total) + ' answers landed. Every miss is a useful pointer, not a verdict.' : 'Answer a few arguments across different modes and this page will start showing your learning pattern.'}</p></div><div className="ring-stat" style={{ background: 'conic-gradient(var(--violet) 0deg, var(--violet) ' + String(stats.accuracy * 3.6) + 'deg, var(--bg-soft) ' + String(stats.accuracy * 3.6) + 'deg, var(--bg-soft) 360deg)' }}><div className="ring-stat-inner"><strong>{stats.accuracy}<span>%</span></strong><small>accuracy</small></div></div><div className="progress-hero-note"><Icon name="flame" size={17} /><span><strong>{stats.currentStreak} current streak</strong><small>Best: {stats.bestStreak} in a row</small></span></div></section>
      <section className="mastery-section"><div className="section-heading"><div><div className="eyebrow">Field guide coverage</div><h2>How much is sticking?</h2></div><span className="section-note">{stats.learned} of {fallacies.length} encountered</span></div><div className="mastery-bar">{(['New', 'Warming up', 'Practicing', 'Strong'] as const).map((level) => <span key={level} className={masteryClass(level)} style={{ width: String((masteryCounts[level] / fallacies.length) * 100) + '%' }} title={level + ': ' + masteryCounts[level]} />)}</div><div className="mastery-legend">{(['New', 'Warming up', 'Practicing', 'Strong'] as const).map((level) => <span key={level}><i className={masteryClass(level)} />{level}<strong>{masteryCounts[level]}</strong></span>)}</div></section>
      <section className="progress-grid">
        <article className="progress-card category-progress"><div className="section-heading"><div><div className="eyebrow">By family</div><h2>Where your radar is strongest.</h2></div><Icon name="chart" size={18} /></div><div className="category-list">{categoryStats.map((item) => <div className="category-row" key={item.category}><div><span>{item.category}</span><small>{item.attempts ? item.attempts + ' scored answers' : 'Not tested yet'}</small></div><div className="category-meter"><span style={{ width: String(item.attempts ? item.accuracy : 3) + '%' }} /></div><strong>{item.attempts ? item.accuracy + '%' : '—'}</strong></div>)}</div></article>
        <article className="progress-card focus-progress"><div className="section-heading"><div><div className="eyebrow">Next up</div><h2>Worth another look.</h2></div><span className="section-icon"><Icon name="spark" size={17} /></span></div>{weakSpots.length ? <div className="progress-focus-list">{weakSpots.slice(0, 5).map((item) => <button type="button" key={item.fallacy.id} onClick={() => onOpen(item.fallacy.id)}><span className="focus-initial">{item.fallacy.name.charAt(0)}</span><span><strong>{item.fallacy.name}</strong><small>{item.attempts} {item.attempts === 1 ? 'attempt' : 'attempts'} · {item.mastery}</small></span><em>{item.accuracy}%</em><Icon name="chevron" size={15} /></button>)}</div> : <div className="empty-inline tall"><span className="empty-round"><Icon name="spark" size={18} /></span><span><strong>No data to tune yet.</strong><small>Take a practice set and the app will surface your next useful review.</small></span></div>}<button type="button" className="inline-link" onClick={() => onPractice(weakSpots.length ? 'identify' : undefined)}>Open a focused set <Icon name="arrow" size={15} /></button></article>
      </section>
      <section className="sessions-card"><div className="section-heading"><div><div className="eyebrow">Recent sessions</div><h2>The habit, in miniature.</h2></div><button type="button" className="text-button danger-button" onClick={onReset}>Reset local progress</button></div>{state.sessions.length ? <div className="session-list">{state.sessions.slice(0, 6).map((session) => <div className="session-row" key={session.id}><span className={['session-mode-icon', modeMeta[session.mode].className].join(' ')}><Icon name={modeMeta[session.mode].icon} size={15} /></span><span className="session-info"><strong>{modeMeta[session.mode].label}</strong><small>{formatDate(session.completedAt)} · {session.durationSeconds}s</small></span><span className="session-score"><strong>{session.correct}/{session.total}</strong><small>{Math.round((session.correct / session.total) * 100)}%</small></span><span className="session-bar"><span style={{ width: String((session.correct / session.total) * 100) + '%' }} /></span></div>)}</div> : <div className="empty-state compact-empty"><span className="empty-round"><Icon name="clock" size={18} /></span><h3>Your session history is waiting.</h3><p>Finish a practice round and it will show up here.</p></div>}</section>
    </div>
  )
}

function PracticeSession({
  state,
  mode,
  settings,
  onAnswer,
  onSessionComplete,
  onBack,
  onExit,
  onStartAgain,
}: {
  state: AppState
  mode: PracticeMode
  settings: PracticeSettings
  onAnswer: (answer: Parameters<typeof recordAnswer>[1]) => void
  onSessionComplete: (session: Parameters<typeof addSession>[1]) => void
  onBack: () => void
  onExit: () => void
  onStartAgain: () => void
}) {
  const [queue] = useState<Question[]>(() => selectQuestions(state, mode, settings))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selection, setSelection] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [finished, setFinished] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(mode === 'speed' ? 45 : 0)
  const startedAt = useRef(Date.now())
  const question = queue[questionIndex]

  useEffect(() => {
    if (mode !== 'speed' || finished) return undefined
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(value - 1, 0)), 1000)
    return () => window.clearInterval(timer)
  }, [finished, mode])

  useEffect(() => {
    if (mode === 'speed' && secondsLeft === 0 && !finished) finishSession(score)
  }, [finished, mode, score, secondsLeft])

  function finishSession(finalScore: number) {
    if (finished) return
    setFinished(true)
    onSessionComplete({ mode, correct: finalScore, total: mode === 'speed' ? Math.max(questionIndex + (answered ? 1 : 0), 1) : queue.length, durationSeconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)) })
  }

  function evaluate(choice: string) {
    if (!question || answered || finished) return
    const correct = isChoiceCorrect(question, choice)
    const nextScore = score + (correct ? 1 : 0)
    const nextStreak = correct ? streak + 1 : 0
    setSelection(choice)
    setAnswered(true)
    setScore(nextScore)
    setStreak(nextStreak)
    setBestStreak((value) => Math.max(value, nextStreak))
    onAnswer({ questionId: question.id, mode: question.mode, fallacyId: question.correctFallacyId, selectedFallacyId: choice === 'valid' || choice === 'fallacy' ? null : choice, isCorrect: correct })

    if (mode === 'speed') {
      window.setTimeout(() => {
        if (questionIndex >= queue.length - 1 || secondsLeft <= 1) finishSession(nextScore)
        else nextQuestion()
      }, 620)
    }
  }

  function nextQuestion() {
    setQuestionIndex((value) => value + 1)
    setSelection(null)
    setAnswered(false)
  }

  if (!queue.length) return <PracticeEmpty mode={mode} onBack={onBack} onExit={onExit} />
  if (finished) return <PracticeResult mode={mode} score={score} total={mode === 'speed' ? Math.max(questionIndex + (answered ? 1 : 0), 1) : queue.length} bestStreak={bestStreak} onExit={onExit} onAgain={onStartAgain} />

  const options = getSessionOptions(question, mode)
  const correctLabel = question.correctFallacyId ? fallacyById[question.correctFallacyId]?.name ?? 'the fallacy' : 'valid reasoning'
  const answerTitle = answered ? (isChoiceCorrect(question, selection ?? '') ? mode === 'speed' ? 'Clean read' : 'That is the move.' : 'A useful miss.') : ''
  return (
    <div className={['practice-session', mode === 'speed' ? 'speed-session' : ''].filter(Boolean).join(' ')}>
      <div className="session-topline"><button type="button" className="back-link" onClick={onBack}><Icon name="arrow" size={15} /> All practice modes</button><div className="session-mode-name"><span className={['session-mode-dot', modeMeta[mode].className].join(' ')} />{modeMeta[mode].label}</div><div className="session-streak">{mode === 'speed' ? <><Icon name="timer" size={15} /><strong>{String(secondsLeft).padStart(2, '0')}s</strong></> : <><Icon name="flame" size={15} /><strong>{streak}</strong><span>streak</span></>}</div></div>
      <div className="session-progress-row"><span>Question {questionIndex + 1} of {mode === 'speed' ? '∞' : queue.length}</span><div className="session-progress"><span style={{ width: mode === 'speed' ? String(Math.max(0, (secondsLeft / 45) * 100)) + '%' : String(((questionIndex + (answered ? 1 : 0)) / queue.length) * 100) + '%' }} /></div><span>{score} correct</span></div>
      <section className="question-wrap">
        <div className="question-label"><span className="question-number">{String(questionIndex + 1).padStart(2, '0')}</span><span className={['difficulty-pill', difficultyClass(question.difficulty)].join(' ')}>{question.difficulty}</span><span>{question.mode === 'scenario' ? 'Read the whole room' : question.mode === 'valid' ? 'Keep your skepticism honest' : 'Spot the hidden move'}</span></div>
        <h1>{mode === 'speed' ? 'Quick read.' : mode === 'scenario' ? 'What is the argument doing?' : mode === 'valid' ? 'Does this reasoning hold up?' : 'Which pattern is hiding here?'}</h1>
        <div className={['question-card', question.mode === 'scenario' ? 'scenario-question' : ''].filter(Boolean).join(' ')}><div className="question-card-mark"><Icon name={question.mode === 'scenario' ? 'quote' : 'brain'} size={17} /></div><p>{question.prompt}</p><span className="question-card-caption">{question.mode === 'scenario' ? 'Read for the structure, not the vibe.' : mode === 'speed' ? 'Trust the first clear signal.' : 'Take one breath. What is the leap?'}</span></div>
        <div className="answer-area">
          {mode === 'valid' ? <BinaryChoices answered={answered} selection={selection} question={question} onChoose={evaluate} /> : <div className="answer-options">{options.map((option, index) => <AnswerOption key={option} value={option} index={index} selected={selection === option} answered={answered} correct={answered && isChoiceCorrect(question, option)} onChoose={evaluate} />)}{mode === 'speed' && !options.includes('valid') && <AnswerOption value="valid" index={options.length} selected={selection === 'valid'} answered={answered} correct={answered && isChoiceCorrect(question, 'valid')} onChoose={evaluate} label="Valid reasoning" subtitle="No fallacy found" />}</div>}
        </div>
        {answered && mode !== 'speed' && <Feedback question={question} isCorrect={isChoiceCorrect(question, selection ?? '')} correctLabel={correctLabel} answerTitle={answerTitle} onNext={questionIndex >= queue.length - 1 ? () => finishSession(score) : nextQuestion} isLast={questionIndex >= queue.length - 1} />}
        {answered && mode === 'speed' && <div className={['speed-feedback', isChoiceCorrect(question, selection ?? '') ? 'is-correct' : 'is-wrong'].join(' ')}><Icon name={isChoiceCorrect(question, selection ?? '') ? 'check' : 'close'} size={15} /><strong>{isChoiceCorrect(question, selection ?? '') ? '+1 ' + correctLabel : correctLabel}</strong><span>{isChoiceCorrect(question, selection ?? '') ? 'Next signal…' : 'Keep moving — the pattern comes back.'}</span></div>}
      </section>
    </div>
  )
}

function BinaryChoices({ answered, selection, question, onChoose }: { answered: boolean; selection: string | null; question: Question; onChoose: (value: string) => void }) {
  return (
    <div className="binary-grid">
      <button type="button" className={choiceClass('valid', selection, answered, question)} onClick={() => onChoose('valid')} disabled={answered}><span className="binary-icon"><Icon name="check" size={18} /></span><span><strong>Valid reasoning</strong><small>The conclusion is supported well enough.</small></span><Icon name="arrow" size={16} /></button>
      <button type="button" className={choiceClass('fallacy', selection, answered, question)} onClick={() => onChoose('fallacy')} disabled={answered}><span className="binary-icon warning-icon"><Icon name="target" size={18} /></span><span><strong>There is a fallacy</strong><small>A leap or distraction weakens the argument.</small></span><Icon name="arrow" size={16} /></button>
    </div>
  )
}

function AnswerOption({ value, index, selected, answered, correct, onChoose, label, subtitle }: { value: string; index: number; selected: boolean; answered: boolean; correct: boolean; onChoose: (value: string) => void; label?: string; subtitle?: string }) {
  const fallacy = fallacyById[value]
  const fallbackLabel = value === 'valid' ? 'Valid reasoning' : value === 'fallacy' ? 'There is a fallacy' : fallacy?.name
  const fallbackSubtitle = value === 'valid' ? 'No fallacy found' : value === 'fallacy' ? 'A leap or distraction' : fallacy?.alsoKnownAs
  return <button type="button" className={['answer-option', selected ? 'is-selected' : '', answered && correct ? 'is-correct' : '', answered && selected && !correct ? 'is-wrong' : ''].filter(Boolean).join(' ')} onClick={() => onChoose(value)} disabled={answered}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span><strong>{label ?? fallbackLabel}</strong><small>{subtitle ?? fallbackSubtitle}</small></span><span className="option-trail">{answered && correct ? <Icon name="check" size={15} /> : answered && selected && !correct ? <Icon name="close" size={15} /> : <Icon name="chevron" size={15} />}</span></button>
}

function Feedback({ question, isCorrect, correctLabel, answerTitle, onNext, isLast }: { question: Question; isCorrect: boolean; correctLabel: string; answerTitle: string; onNext: () => void; isLast: boolean }) {
  return <article className={['feedback-card', isCorrect ? 'feedback-correct' : 'feedback-wrong'].join(' ')}><div className="feedback-heading"><span className="feedback-icon"><Icon name={isCorrect ? 'check' : 'spark'} size={18} /></span><div><div className="eyebrow">{isCorrect ? 'Good catch' : 'Keep this distinction'}</div><h2>{isCorrect ? answerTitle : 'The sharper read: ' + correctLabel}</h2></div></div><p className="feedback-explanation">{question.explanation}</p><div className="feedback-grid"><div><small><Icon name="search" size={13} /> Signal</small><p>{question.clue}</p></div><div><small><Icon name="brain" size={13} /> Do not confuse it with…</small><p>{question.contrast}</p></div></div><button type="button" className="button button-primary feedback-next" onClick={onNext}>{isLast ? 'See your result' : 'Next question'} <Icon name={isLast ? 'chart' : 'arrow'} size={15} /></button></article>
}

function PracticeResult({ mode, score, total, bestStreak, onExit, onAgain }: { mode: PracticeMode; score: number; total: number; bestStreak: number; onExit: () => void; onAgain: () => void }) {
  const percentage = Math.round((score / total) * 100)
  const headline = percentage >= 80 ? 'The signal came through.' : percentage >= 50 ? 'You found some useful friction.' : 'Good. Now you know where to look.'
  return <div className="practice-result"><div className="result-orbit"><span className="result-orbit-inner"><Icon name={percentage >= 80 ? 'spark' : 'brain'} size={28} /></span></div><div className="eyebrow eyebrow-lime">Round complete · {modeMeta[mode].label}</div><h1>{headline}</h1><p>{score} of {total} reads landed. {percentage >= 80 ? 'That is a strong foundation for harder examples.' : 'The explanations are the point — let the distinctions do their work.'}</p><div className="result-score"><strong>{percentage}<span>%</span></strong><div><span className="result-score-bar"><i style={{ width: String(percentage) + '%' }} /></span><small>{bestStreak ? 'Best streak: ' + bestStreak : 'Every round starts a streak'}</small></div></div><div className="result-actions"><button type="button" className="button button-primary" onClick={onAgain}><Icon name="refresh" size={16} /> Run it back</button><button type="button" className="button button-ghost" onClick={onExit}>Back to today</button></div></div>
}

function PracticeEmpty({ mode, onBack, onExit }: { mode: PracticeMode; onBack: () => void; onExit: () => void }) {
  return <div className="empty-state practice-empty"><span className="empty-round large"><Icon name="target" size={23} /></span><h1>This set is empty for now.</h1><p>{mode === 'identify' ? 'Try another category or start the full field guide. Your practice queue will grow as you explore.' : 'There are not enough questions for this filter yet. Open the full mode to keep moving.'}</p><div className="result-actions"><button type="button" className="button button-primary" onClick={onBack}>Choose another mode</button><button type="button" className="button button-ghost" onClick={onExit}>Back to today</button></div></div>
}

function isChoiceCorrect(question: Question, choice: string): boolean {
  if (question.mode === 'valid') return question.correctFallacyId ? choice === 'fallacy' : choice === 'valid'
  return choice === question.correctFallacyId
}

function getSessionOptions(question: Question, mode: PracticeMode): string[] {
  if (mode === 'speed') {
    if (question.mode === 'valid') return ['valid', 'fallacy']
    if (question.correctFallacyId) return uniqueOptions(question.options).slice(0, 4)
    const alternatives = fallacies.filter((fallacy) => !question.options.includes(fallacy.id)).slice(0, 3).map((fallacy) => fallacy.id)
    return uniqueOptions([...alternatives, ...question.options]).slice(0, 3)
  }
  return question.options
}

function uniqueOptions(options: string[]) {
  return [...new Set(options)]
}

function choiceClass(choice: string, selection: string | null, answered: boolean, question: Question) {
  return ['binary-choice', selection === choice ? 'is-selected' : '', answered && isChoiceCorrect(question, choice) ? 'is-correct' : '', answered && selection === choice && !isChoiceCorrect(question, choice) ? 'is-wrong' : ''].filter(Boolean).join(' ')
}

function difficultyClass(difficulty: Difficulty) {
  return difficulty === 'Warm-up' ? 'difficulty-warm' : difficulty === 'Deep dive' ? 'difficulty-deep' : 'difficulty-stretch'
}

function masteryClass(mastery: string) {
  return mastery.toLowerCase().replace(' ', '-')
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return 'Today'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default App
