import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, BadgeCheck, Beef, Bookmark, Brain, CalendarDays, CalendarPlus, ChartNoAxesCombined, ChevronLeft, ChevronRight, Clock3, Copy, Download, ExternalLink,
  Flame, Heart, Info, Leaf, LoaderCircle, Minus, Pencil, Plus, RotateCcw, Save, Search, Settings2,
  ShieldAlert, ShoppingBasket, Sparkles, Store, Target, Trash2, Upload, UserRound, Utensils, Warehouse, X, Zap,
} from 'lucide-react'
import recipeData from './data/recipes.generated.json'
import { buildCatalog, type Meal, type RawRecipe } from './domain/catalog'
import { createJumboCart, fetchJumboPrices, type JumboProduct } from './domain/integrations'
import { createTasteProfile, rankMeals, tasteScore, updateTasteProfile, type TasteProfile } from './domain/taste'
import {
  ALLERGENS, DIETS, GOAL_PRESETS, MEAL_TYPES, MEAL_TYPE_LABELS, activeFilterCount, applyPreset,
  defaultPreferences, filterMeals, sanitizePreferences, type DietPreferences, type MealType,
} from './domain/diet'
import {
  addCustomItem, aggregateShoppingItems, categoryForIngredient, emptyShoppingState, removeCustomItem,
  removeSelection, sanitizeShoppingState, scaleAmount, shoppingCartIngredients, togglePantryItem,
  upsertSelection, type ShoppingCategory, type ShoppingItem, type ShoppingState,
} from './domain/shopping'
import {
  removePlannerEntry, sanitizePlannerState, selectDiverseMeals, shiftWeek, startOfWeek,
  upsertPlannerEntry, weekDates, type PlannerState,
} from './domain/planner'
import {
  TRACKER_MEAL_TYPES, addTrackerEntry, dailyTotals, recentDateRange, removeTrackerEntry, sanitizeTrackerState,
  recentTrackerEntries, rescaleRecipeEntry, scaleMealNutrition, selectMealsWithinRemainingEnergy, shiftTrackerDate, trackerEntriesCsv,
  trackerPeriodSummary, updateTrackerGoals, type TrackerEntry, type TrackerGoals, type TrackerMealType, type TrackerState,
} from './domain/tracker'
import { createHapBackup, parseHapBackup, sanitizeSaved, sanitizeTasteProfile, type ParsedHapBackup } from './domain/backup'

const meals = buildCatalog(recipeData as RawRecipe[])
const mealIds = new Set(meals.map(({ id }) => id))
const ingredientSuggestions = [...new Map(meals.flatMap(({ ingredients }) => ingredients.map(({ name }) => [name.trim().toLocaleLowerCase('nl-NL'), name.trim()] as const))).values()]
  .filter(Boolean).sort((a, b) => a.localeCompare(b, 'nl-NL'))
const euro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
type SwipeSnapshot = { mealId: string; profile: TasteProfile; saved: string[]; seen: string[] }
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

function stored<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || '') as T } catch { return fallback }
}

function StoreMark() { return <span className="store-mark store-j">J</span> }

function App() {
  const [view, setView] = useState<'discover' | 'saved' | 'planner' | 'tracker' | 'shopping' | 'profile'>('discover')
  const [saved, setSaved] = useState<string[]>(() => sanitizeSaved(stored('hap:saved', []), mealIds))
  const [profile, setProfile] = useState<TasteProfile>(() => sanitizeTasteProfile(stored('hap:taste', createTasteProfile())))
  const [seen, setSeen] = useState<string[]>([])
  const [history, setHistory] = useState<SwipeSnapshot[]>([])
  const [pinnedMealId, setPinnedMealId] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailMealId, setDetailMealId] = useState<string | null>(null)
  const [detailServings, setDetailServings] = useState(1)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [preferences, setPreferences] = useState(() => sanitizePreferences(stored('hap:preferences', null)))
  const [shopping, setShopping] = useState<ShoppingState>(() => sanitizeShoppingState(stored('hap:shopping', null), mealIds))
  const [planner, setPlanner] = useState<PlannerState>(() => sanitizePlannerState(stored('hap:planner', null), mealIds))
  const [tracker, setTracker] = useState<TrackerState>(() => sanitizeTrackerState(stored('hap:tracker', null)))
  const [visibleWeekStart, setVisibleWeekStart] = useState(() => startOfWeek())
  const [trackerDate, setTrackerDate] = useState(() => localToday())
  const [dragX, setDragX] = useState(0)
  const [online, setOnline] = useState(() => navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches)
  const [backupPreview, setBackupPreview] = useState<ParsedHapBackup | null>(null)
  const [backupError, setBackupError] = useState('')
  const [ingredientDraft, setIngredientDraft] = useState('')
  const dragStart = useRef<number | null>(null)
  const modalReturnFocus = useRef<HTMLElement | null>(null)
  const wasModalOpen = useRef(false)

  useEffect(() => localStorage.setItem('hap:saved', JSON.stringify(saved)), [saved])
  useEffect(() => localStorage.setItem('hap:taste', JSON.stringify(profile)), [profile])
  useEffect(() => localStorage.setItem('hap:preferences', JSON.stringify(preferences)), [preferences])
  useEffect(() => localStorage.setItem('hap:shopping', JSON.stringify(shopping)), [shopping])
  useEffect(() => localStorage.setItem('hap:planner', JSON.stringify(planner)), [planner])
  useEffect(() => localStorage.setItem('hap:tracker', JSON.stringify(tracker)), [tracker])
  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline); window.addEventListener('offline', goOffline)
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline) }
  }, [])
  useEffect(() => {
    const capturePrompt = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPromptEvent) }
    const markInstalled = () => { setInstalled(true); setInstallPrompt(null) }
    window.addEventListener('beforeinstallprompt', capturePrompt); window.addEventListener('appinstalled', markInstalled)
    return () => { window.removeEventListener('beforeinstallprompt', capturePrompt); window.removeEventListener('appinstalled', markInstalled) }
  }, [])

  const filtered = useMemo(() => filterMeals(meals, preferences), [preferences])
  const ranked = useMemo(() => rankMeals(filtered, profile), [filtered, profile])
  const meal = ranked.find((item) => item.id === pinnedMealId) || ranked.find((item) => !seen.includes(item.id)) || ranked[0]
  const detailMeal = detailMealId ? meals.find((item) => item.id === detailMealId) : undefined
  const savedMeals = meals.filter((item) => saved.includes(item.id))
  const shoppingItems = useMemo(() => aggregateShoppingItems(meals, shopping.selections, shopping.custom), [shopping.custom, shopping.selections])
  const visibleDates = useMemo(() => weekDates(visibleWeekStart), [visibleWeekStart])
  const learning = Math.min(100, Math.round(profile.interactions / 25 * 100))
  const filterCount = activeFilterCount(preferences)
  const activeChips = preferenceChips(preferences)
  const modalOpen = filtersOpen || searchOpen || Boolean(detailMealId)
  const trackerSuggestions = useMemo(() => {
    const loggedRecipeIds = new Set(tracker.entries.filter((entry) => entry.date === trackerDate && entry.mealId).map((entry) => entry.mealId!))
    return selectMealsWithinRemainingEnergy(ranked, dailyTotals(tracker.entries, trackerDate), tracker.goals, 3, loggedRecipeIds)
  }, [ranked, tracker.entries, tracker.goals, trackerDate])
  const searchResults = useMemo(() => {
    const query = normalizeSearch(searchQuery)
    const source = query ? filtered.filter((item) => normalizeSearch([
      item.title, item.area, item.category, ...item.tags, ...item.ingredients.map(({ name }) => name),
    ].join(' ')).includes(query)) : ranked
    return source.slice(0, 40)
  }, [filtered, ranked, searchQuery])

  useEffect(() => {
    if (wasModalOpen.current && !modalOpen) {
      const target = modalReturnFocus.current
      window.requestAnimationFrame(() => { if (target?.isConnected) target.focus() })
      modalReturnFocus.current = null
    }
    wasModalOpen.current = modalOpen
  }, [modalOpen])

  useEffect(() => {
    const validKeys = new Set(shoppingItems.map(({ key }) => key))
    setShopping((current) => {
      const checked = current.checked.filter((key) => validKeys.has(key))
      return checked.length === current.checked.length ? current : { ...current, checked }
    })
  }, [shoppingItems])

  function flash(message: string) {
    setToast(message)
    setAnnouncement(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  function openDetails(mealId: string) {
    const target = meals.find((item) => item.id === mealId)
    if (!target) return
    if (!modalOpen) modalReturnFocus.current = document.activeElement as HTMLElement
    setDetailServings(shopping.selections.find((selection) => selection.mealId === mealId)?.servings || target.servings)
    setDetailMealId(mealId)
  }

  function openSearch() {
    modalReturnFocus.current = document.activeElement as HTMLElement
    setSearchQuery(''); setSearchOpen(true)
  }

  function openFilters() {
    modalReturnFocus.current = document.activeElement as HTMLElement
    setFiltersOpen(true)
  }

  function addDetailToShopping() {
    if (!detailMeal) return
    const existed = shopping.selections.some((selection) => selection.mealId === detailMeal.id)
    setShopping((current) => upsertSelection(current, { mealId: detailMeal.id, servings: detailServings }))
    flash(`${detailMeal.title} ${existed ? 'bijgewerkt op' : 'toegevoegd aan'} boodschappenlijst`)
  }

  function toggleShoppingItem(key: string) {
    setShopping((current) => ({ ...current, checked: current.checked.includes(key)
      ? current.checked.filter((item) => item !== key)
      : [...current.checked, key] }))
  }

  function removeShoppingMeal(mealId: string) {
    setShopping((current) => removeSelection(current, mealId))
  }

  function planDetailMeal(date: string) {
    if (!detailMeal) return
    setPlanner((current) => upsertPlannerEntry(current, { date, mealId: detailMeal.id, servings: detailServings }))
    flash(`${detailMeal.title} gepland op ${formatDayDate(date)}`)
  }

  function fillPlannerWeek() {
    const existing = planner.entries.filter(({ date }) => visibleDates.includes(date))
    const used = new Set(existing.map(({ mealId }) => mealId))
    const existingMeals = existing.flatMap(({ mealId }) => meals.filter(({ id }) => id === mealId))
    const candidatePool = [...ranked, ...existingMeals.filter(({ id }) => !ranked.some((candidate) => candidate.id === id))]
    const candidates = selectDiverseMeals(candidatePool, visibleDates.length - existing.length, used)
    let candidateIndex = 0
    let added = 0
    let next = planner
    for (const date of visibleDates) {
      if (next.entries.some((entry) => entry.date === date)) continue
      const candidate = candidates[candidateIndex++]
      if (!candidate) break
      next = upsertPlannerEntry(next, { date, mealId: candidate.id, servings: candidate.servings })
      added++
    }
    if (added) setPlanner(next)
    flash(added ? `${added} ${added === 1 ? 'dag' : 'dagen'} gevuld met je beste matches` : 'Geen lege dag of passende match gevonden')
  }

  function addPlannerWeekToShopping() {
    const entries = planner.entries.filter(({ date }) => visibleDates.includes(date))
    setShopping((current) => entries.reduce((next, { mealId, servings }) => upsertSelection(next, { mealId, servings }), current))
    flash(`${entries.length} ${entries.length === 1 ? 'recept' : 'recepten'} toegevoegd aan boodschappenlijst`)
  }

  function logDetailMeal({ date, mealType, portions }: { date: string; mealType: TrackerMealType; portions: number }) {
    if (!detailMeal) return
    const nutrition = scaleMealNutrition(detailMeal, portions)
    setTracker((current) => addTrackerEntry(current, {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date, name: detailMeal.title,
      mealType, source: 'recipe', mealId: detailMeal.id, portions, ...nutrition,
    }))
    setTrackerDate(date)
    flash(`${detailMeal.title} gelogd in voedingslog`)
  }

  function updateTrackerLog(entry: TrackerEntry) {
    setTracker((current) => addTrackerEntry(current, entry))
    flash(`${entry.name} bijgewerkt`)
  }

  function repeatTrackerLog(entry: TrackerEntry) {
    setTracker((current) => addTrackerEntry(current, {
      ...entry,
      id: `repeat-log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: trackerDate,
    }))
    flash(`${entry.name} opnieuw gelogd`)
  }

  function downloadTrackerCsv() {
    const url = URL.createObjectURL(new Blob([trackerEntriesCsv(tracker.entries)], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url; link.download = `hap-voedingslog-${localToday()}.csv`; link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    flash('Voedingslog als CSV gedownload')
  }

  async function installApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') { setInstalled(true); setInstallPrompt(null) }
  }

  function downloadBackup() {
    const backup = createHapBackup({ saved, taste: profile, preferences, shopping, planner, tracker })
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url; link.download = `hap-backup-${localToday()}.json`; link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    flash('Lokale Hap-back-up gedownload')
  }

  async function previewBackup(file: File) {
    try {
      const preview = parseHapBackup(await file.text(), mealIds)
      setBackupPreview(preview); setBackupError('')
    } catch (reason) {
      setBackupPreview(null); setBackupError(reason instanceof Error ? reason.message : 'De back-up kon niet worden gelezen.')
    }
  }

  function restoreBackup() {
    if (!backupPreview || !window.confirm('Deze back-up vervangt je huidige lokale Hap-data. Doorgaan?')) return
    setSaved(backupPreview.saved); setProfile(backupPreview.taste); setPreferences(backupPreview.preferences)
    setShopping(backupPreview.shopping); setPlanner(backupPreview.planner); setTracker(backupPreview.tracker)
    setSeen([]); setHistory([]); setPinnedMealId(null); setBackupPreview(null); setBackupError('')
    flash('Back-up hersteld')
  }

  function advance(action: 'like' | 'skip') {
    if (!meal) return
    const nextProfile = updateTasteProfile(profile, meal, action)
    setProfile(nextProfile)
    if (action === 'like') {
      setSaved((current) => current.includes(meal.id) ? current : [...current, meal.id])
      flash(`Opgeslagen · smaakprofiel ${Math.min(100, Math.round(nextProfile.interactions / 25 * 100))}%`)
    } else setAnnouncement(`${meal.title} overgeslagen`)
    setHistory((current) => [...current.slice(-29), { mealId: meal.id, profile, saved, seen }])
    setSeen((current) => current.length + 1 >= filtered.length ? [] : [...current, meal.id])
    setPinnedMealId(null)
    setDragX(0)
  }

  function rewind() {
    const previous = history.at(-1)
    if (!previous) return flash('Je bent al bij het begin')
    setProfile(previous.profile)
    setSaved(previous.saved)
    setSeen(previous.seen)
    setHistory((current) => current.slice(0, -1))
    setPinnedMealId(previous.mealId)
    flash('Keuze ongedaan gemaakt')
  }

  function onPointerDown(event: React.PointerEvent) {
    if ((event.target as HTMLElement).closest('button, a, input')) return
    dragStart.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function onPointerMove(event: React.PointerEvent) {
    if (dragStart.current !== null) setDragX(event.clientX - dragStart.current)
  }
  function onPointerUp() {
    if (Math.abs(dragX) > 90) advance(dragX > 0 ? 'like' : 'skip')
    setDragX(0)
    dragStart.current = null
  }

  function updatePreference<K extends keyof DietPreferences>(key: K, value: DietPreferences[K]) {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  function updateLimit(key: 'maxPrice' | 'maxKcal' | 'maxCarbs' | 'maxFat' | 'minProtein' | 'maxTime', value: number) {
    setPreferences((current) => ({ ...current, [key]: value, preset: 'custom' }))
  }

  function addIngredientExclusion(event: React.FormEvent) {
    event.preventDefault()
    if (!ingredientDraft.trim()) return
    setPreferences((current) => sanitizePreferences({ ...current, excludedIngredients: [...current.excludedIngredients, ingredientDraft] }))
    setIngredientDraft('')
  }

  function removeIngredientExclusion(term: string) {
    setPreferences((current) => ({ ...current, excludedIngredients: current.excludedIngredients.filter((item) => item !== term) }))
  }

  function clearPreferenceChip(id: string) {
    setPreferences((current) => {
      const defaults = defaultPreferences()
      if (id === 'diet') return { ...current, diet: defaults.diet }
      if (id === 'preset') return applyPreset(current, 'balanced')
      if (id === 'meal-types') return { ...current, mealTypes: defaults.mealTypes }
      if (id.startsWith('allergen:')) return { ...current, excludedAllergens: current.excludedAllergens.filter((item) => item !== id.slice('allergen:'.length)) }
      if (id.startsWith('ingredient:')) return { ...current, excludedIngredients: current.excludedIngredients.filter((item) => item !== id.slice('ingredient:'.length)) }
      if (id.startsWith('limit:')) {
        const key = id.slice('limit:'.length) as PreferenceLimitKey
        const next = { ...current, [key]: defaults[key] }
        return { ...next, preset: preferenceLimitKeys.some((limit) => next[limit] !== defaults[limit]) ? 'custom' : 'balanced' }
      }
      return current
    })
  }

  function toggleAllergen(allergen: DietPreferences['excludedAllergens'][number]) {
    updatePreference('excludedAllergens', preferences.excludedAllergens.includes(allergen)
      ? preferences.excludedAllergens.filter((item) => item !== allergen)
      : [...preferences.excludedAllergens, allergen])
  }

  function toggleMealType(mealType: MealType) {
    updatePreference('mealTypes', preferences.mealTypes.includes(mealType)
      ? preferences.mealTypes.filter((item) => item !== mealType)
      : [...preferences.mealTypes, mealType])
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (detailMealId) setDetailMealId(null)
        else if (searchOpen) setSearchOpen(false)
        else if (filtersOpen) setFiltersOpen(false)
        return
      }
      if (event.repeat || filtersOpen || detailMealId || searchOpen || view !== 'discover' || !meal) return
      const target = event.target as HTMLElement
      if (target.matches('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        advance(event.key === 'ArrowRight' ? 'like' : 'skip')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [detailMealId, filtered.length, filtersOpen, meal, profile, saved, searchOpen, seen, view])

  return (
    <div className="app-shell">
      <header className="topbar" inert={modalOpen} aria-hidden={modalOpen || undefined}>
        <button className="brand" onClick={() => setView('discover')} aria-label="Naar ontdekken"><span className="brand-bite"><Sparkles size={20} strokeWidth={3} /></span><span>hap</span></button>
        <div className="top-actions"><span className="streak"><Brain size={17} /> {profile.interactions} keer geleerd</span><button className="icon-button" aria-label="Zoeken" onClick={openSearch}><Search size={20} /></button><button className="avatar" aria-label="Mijn smaak" onClick={() => setView('profile')}><UserRound size={18} /></button></div>
        {!online ? <div className="offline-banner" role="status"><ShieldAlert /> <strong>Je werkt offline.</strong> Recepten, planning, voedingslog en lokale lijsten blijven werken; Jumbo wacht op internet.</div> : null}
      </header>

      <aside className="sidebar" aria-label="Hoofdnavigatie" inert={modalOpen} aria-hidden={modalOpen || undefined}>
        <div>
          <NavButton active={view === 'discover'} onClick={() => setView('discover')} icon={<Zap />} label="Ontdekken" />
          <NavButton active={view === 'saved'} onClick={() => setView('saved')} icon={<Bookmark />} label="Opgeslagen" badge={saved.length} />
          <NavButton active={view === 'planner'} onClick={() => setView('planner')} icon={<CalendarDays />} label="Weekplanner" />
          <NavButton active={view === 'tracker'} onClick={() => setView('tracker')} icon={<ChartNoAxesCombined />} label="Voedingslog" />
          <NavButton active={view === 'shopping'} onClick={() => setView('shopping')} icon={<ShoppingBasket />} label="Boodschappen" badge={shopping.selections.length} />
          <NavButton active={view === 'profile'} onClick={() => setView('profile')} icon={<UserRound />} label="Mijn smaak" />
        </div>
        <div className="taste-card"><span className="taste-icon"><Brain size={20} /></span><strong>Hap leert lokaal</strong><p>Elke swipe verfijnt keuken, tempo en macrovoorkeur. Je data blijft op dit apparaat.</p><div className="progress" role="progressbar" aria-label="Smaakprofiel ingeleerd" aria-valuemin={0} aria-valuemax={100} aria-valuenow={learning} aria-valuetext={`${learning}% ingeleerd`}><span style={{ width: `${learning}%` }} /></div><small>{learning}% ingeleerd</small></div>
      </aside>

      <main className={`main-content view-${view}`} inert={modalOpen} aria-hidden={modalOpen || undefined}>
        {view === 'discover' && <>
          <section className="discover-head"><div><span className="eyebrow">{meals.length.toLocaleString('nl-NL')} GERECHTEN · {filtered.length.toLocaleString('nl-NL')} MATCHES</span><h1>Waar heb je trek in?</h1></div><button className="filter-button" onClick={openFilters}><Settings2 size={18} /> Filters {filterCount ? <span>{filterCount}</span> : null}</button></section>
          {activeChips.length ? <div className="active-filter-row" aria-label="Actieve filters">{activeChips.map(({ id, label }) => <button className="active-filter-chip" key={id} onClick={() => clearPreferenceChip(id)} aria-label={`Verwijder filter ${label}`}><span>{label}</span><X /></button>)}<button className="clear-all-filters" onClick={() => setPreferences(defaultPreferences())}>Wis filters</button></div> : null}
          {meal ? <div className="discovery-grid">
            <section className="deck-area" aria-label="Gerechten swipen">
              <div className="card-shadow card-shadow-two" /><div className="card-shadow card-shadow-one" />
              <article className="meal-card" style={{ transform: `translateX(${dragX}px) rotate(${dragX / 25}deg)`, '--accent': meal.accent } as React.CSSProperties} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
                <img src={meal.image} alt={meal.title} draggable={false} />
                <div className={`swipe-label swipe-like ${dragX > 35 ? 'visible' : ''}`}>LEKKER!</div><div className={`swipe-label swipe-nope ${dragX < -35 ? 'visible' : ''}`}>VOLGENDE</div>
                <div className="card-topline"><span className="match-pill"><Sparkles size={14} fill="currentColor" /> {matchPercent(meal, profile)}% match</span><button className="card-info" onClick={(event) => { event.stopPropagation(); openDetails(meal.id) }} aria-label="Bekijk details"><Info size={18} /></button></div>
                <div className="card-copy"><div className="tag-row"><span className="diet-card-badge">{primaryDietLabel(meal)}</span>{meal.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div><h2>{meal.title}</h2><p>{meal.subtitle}</p><div className="quick-stats"><span><Clock3 /> {meal.time} min</span><span><Flame /> {meal.kcal} kcal</span><span><Beef /> {meal.protein}g eiwit</span></div></div>
              </article>
              <div className="swipe-actions"><button className="round-action rewind" onClick={rewind} aria-label="Vorige"><RotateCcw /></button><button className="round-action dislike" onClick={() => advance('skip')} aria-label="Niet lekker"><X /></button><button className="round-action like" onClick={() => advance('like')} aria-label="Opslaan"><Heart fill="currentColor" /></button><button className="round-action details" onClick={() => openDetails(meal.id)} aria-label="Details"><Info /></button></div>
              <p className="swipe-hint"><ArrowLeft size={14} /> swipe om Hap te leren <ChevronRight size={14} /></p>
            </section>
            <MealDetails meal={meal} online={online} />
          </div> : <EmptyFilters onReset={() => setPreferences(defaultPreferences())} />}
        </>}

        {view === 'saved' && <section className="collection-view"><span className="eyebrow">JOUW LEKKER-LIJST</span><h1>Opgeslagen gerechten</h1><p className="view-intro">Kies een gerecht en stuur de ingrediënten direct door naar Jumbo.</p>{savedMeals.length ? <div className="saved-grid">{savedMeals.map((item) => <article className="saved-card" key={item.id}><button className="saved-card-open" onClick={() => openDetails(item.id)} aria-label={`Bekijk ${item.title}`}><img src={item.image} alt="" /><div><small>{item.time} MIN · {item.protein}G EIWIT</small><h2>{item.title}</h2><span>richtprijs {euro.format(item.estimatedPrice)} p.p.</span></div></button><button className="saved-remove" onClick={() => setSaved((current) => current.filter((id) => id !== item.id))} aria-label={`Verwijder ${item.title}`}><Heart fill="currentColor" /></button></article>)}</div> : <div className="empty-state compact"><Heart size={44} /><h2>Nog niets opgeslagen</h2><p>Swipe een gerecht naar rechts en het verschijnt hier.</p><button onClick={() => setView('discover')}>Ga ontdekken</button></div>}</section>}

        {view === 'planner' && <PlannerView state={planner} dates={visibleDates} weekStart={visibleWeekStart} onPrevious={() => setVisibleWeekStart((current) => shiftWeek(current, -1))} onNext={() => setVisibleWeekStart((current) => shiftWeek(current, 1))} onToday={() => setVisibleWeekStart(startOfWeek())} onFill={fillPlannerWeek} onAddToShopping={addPlannerWeekToShopping} onOpen={openDetails} onRemove={(date) => setPlanner((current) => removePlannerEntry(current, date))} onClear={() => setPlanner((current) => ({ ...current, entries: current.entries.filter(({ date }) => !visibleDates.includes(date)) }))} onServings={(date, servings) => setPlanner((current) => {
          const entry = current.entries.find((item) => item.date === date)
          return entry ? upsertPlannerEntry(current, { ...entry, servings }) : current
        })} onDiscover={() => setView('discover')} />}

        {view === 'tracker' && <TrackerView state={tracker} date={trackerDate} suggestions={trackerSuggestions} onPrevious={() => setTrackerDate((current) => shiftTrackerDate(current, -1))} onNext={() => setTrackerDate((current) => shiftTrackerDate(current, 1))} onToday={() => setTrackerDate(localToday())} onOpen={openDetails} onRemove={(id) => setTracker((current) => removeTrackerEntry(current, id))} onUpdate={updateTrackerLog} onRepeat={repeatTrackerLog} onExport={downloadTrackerCsv} onGoals={(goals) => { setTracker((current) => updateTrackerGoals(current, goals)); flash('Voedingsdoelen bewaard') }} onAddManual={(entry) => {
          setTracker((current) => addTrackerEntry(current, { id: `manual-log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: trackerDate, source: 'manual', portions: 1, ...entry }))
          flash(`${entry.name} toegevoegd aan voedingslog`)
        }} onDiscover={() => setView('discover')} />}

        {view === 'shopping' && <ShoppingView state={shopping} items={shoppingItems} online={online} onToggle={toggleShoppingItem} onEdit={openDetails} onRemove={removeShoppingMeal} onAddCustom={(name, amount) => {
          const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
          setShopping((current) => addCustomItem(current, { id, name, amount }))
          flash(`${name.trim()} toegevoegd aan boodschappenlijst`)
        }} onRemoveCustom={(id) => setShopping((current) => removeCustomItem(current, id))} onTogglePantry={(key) => setShopping((current) => togglePantryItem(current, key))} onClearChecks={() => setShopping((current) => ({ ...current, checked: [] }))} onClear={() => setShopping((current) => ({ ...emptyShoppingState(), pantry: current.pantry }))} onDiscover={() => setView('discover')} />}

        {view === 'profile' && <ProfileView profile={profile} saved={saved.length} preferences={preferences} canInstall={Boolean(installPrompt)} installed={installed} backupPreview={backupPreview} backupError={backupError} onInstall={installApp} onDownloadBackup={downloadBackup} onBackupFile={previewBackup} onRestoreBackup={restoreBackup} onEditDiet={openFilters} onReset={() => { setProfile(createTasteProfile()); setSeen([]); flash('Smaakprofiel gereset') }} />}
      </main>

      <nav className="mobile-nav" inert={modalOpen} aria-hidden={modalOpen || undefined}><NavButton active={view === 'discover'} onClick={() => setView('discover')} icon={<Zap />} label="Ontdek" /><NavButton active={view === 'saved'} onClick={() => setView('saved')} icon={<Bookmark />} label="Bewaard" badge={saved.length} /><NavButton active={view === 'planner'} onClick={() => setView('planner')} icon={<CalendarDays />} label="Week" /><NavButton active={view === 'tracker'} onClick={() => setView('tracker')} icon={<ChartNoAxesCombined />} label="Log" /><NavButton active={view === 'shopping'} onClick={() => setView('shopping')} icon={<ShoppingBasket />} label="Lijst" badge={shopping.selections.length} /></nav>

      {searchOpen && <div className="overlay" onMouseDown={() => setSearchOpen(false)}><section className="sheet search-sheet" role="dialog" aria-modal="true" aria-labelledby="search-title" onMouseDown={(event) => event.stopPropagation()}><div className="sheet-head"><div><span className="eyebrow">ZOEK BINNEN JOUW MATCHES</span><h2 id="search-title">Recept zoeken</h2></div><button onClick={() => setSearchOpen(false)} aria-label="Sluit zoeken"><X /></button></div><label className="search-field"><Search size={19} /><input type="search" aria-label="Zoek gerechten" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Naam, keuken of ingrediënt" autoFocus /></label><p className="search-count">{searchResults.length}{searchResults.length === 40 ? '+' : ''} resultaten binnen je actieve filters</p>{searchResults.length ? <div className="search-results">{searchResults.map((item) => <button className="search-result" key={item.id} onClick={() => { setPinnedMealId(item.id); setSearchOpen(false); openDetails(item.id) }}><img src={item.image} alt="" /><span><strong>{item.title}</strong><small>{primaryDietLabel(item)} · {item.time} min · {item.kcal} kcal</small></span><ChevronRight /></button>)}</div> : <div className="search-empty"><Search size={30} /><strong>Geen gerecht gevonden</strong><span>Probeer een andere naam of maak je filters ruimer.</span></div>}</section></div>}
      {filtersOpen && <div className="overlay" onMouseDown={() => setFiltersOpen(false)}><section className="sheet filter-sheet" role="dialog" aria-modal="true" aria-labelledby="filter-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sheet-head"><div><span className="eyebrow">MAAK HET JOUW MATCH</span><h2 id="filter-title">Filters</h2></div><button onClick={() => setFiltersOpen(false)} aria-label="Sluit filters" autoFocus><X /></button></div>
        <div className="filter-group"><div className="filter-group-title"><strong>Doel voor deze maaltijd</strong><small>Geen medisch advies</small></div><div className="preset-grid">{GOAL_PRESETS.map(([id, label]) => <button key={id} aria-pressed={preferences.preset === id} onClick={() => setPreferences((current) => applyPreset(current, id))}>{label}</button>)}</div></div>
        <fieldset className="filter-group"><legend>Eetpatroon</legend><div className="choice-grid diet-choices">{DIETS.map(([id, label]) => <label key={id}><input type="radio" name="diet" value={id} checked={preferences.diet === id} onChange={() => updatePreference('diet', id)} /><span>{label}</span></label>)}</div></fieldset>
        <fieldset className="filter-group"><legend>Vermijd gedetecteerde allergenen</legend><div className="choice-grid allergen-choices">{ALLERGENS.map(([id, label]) => <label key={id}><input type="checkbox" checked={preferences.excludedAllergens.includes(id)} onChange={() => toggleAllergen(id)} /><span>{label}</span></label>)}</div><p className="safety-note"><ShieldAlert size={17} /> Detectie op basis van receptingrediënten. Controleer altijd het volledige recept, verpakkingen en kruisbesmetting.</p></fieldset>
        <fieldset className="filter-group ingredient-exclusions"><legend>Persoonlijke ingrediënten vermijden</legend><form className="ingredient-exclusion-form" onSubmit={addIngredientExclusion}><label><span>Ingrediëntnaam</span><input list="hap-ingredient-suggestions" aria-label="Ingrediënt vermijden" value={ingredientDraft} onChange={(event) => setIngredientDraft(event.target.value)} placeholder="Bijv. mushroom of coriander" maxLength={60} /></label><button type="submit" aria-label="Voeg ingrediëntuitsluiting toe" disabled={!ingredientDraft.trim()}><Plus /> Voeg toe</button><datalist id="hap-ingredient-suggestions">{ingredientSuggestions.map((name) => <option value={name} key={name} />)}</datalist></form>{preferences.excludedIngredients.length ? <div className="ingredient-exclusion-chips" aria-label="Uitgesloten ingrediënten">{preferences.excludedIngredients.map((term) => <button key={term} onClick={() => removeIngredientExclusion(term)} aria-label={`Sta ${term} weer toe`}><span>{term}</span><X /></button>)}</div> : <p className="ingredient-exclusion-empty">Nog geen persoonlijke ingrediënten uitgesloten.</p>}<p className="preference-note"><Info size={16} /> Voorkeurfilter op ingrediëntnaam, niet geschikt als allergiecontrole. Gebruik daarvoor de allergenen hierboven en controleer altijd het recept.</p></fieldset>
        <fieldset className="filter-group"><legend>Type gerecht</legend><div className="choice-grid meal-type-choices">{MEAL_TYPES.map((type) => <label key={type}><input type="checkbox" checked={preferences.mealTypes.includes(type)} onChange={() => toggleMealType(type)} /><span>{MEAL_TYPE_LABELS[type]}</span></label>)}</div></fieldset>
        <div className="range-group"><FilterRange label="Richtprijs per portie" value={preferences.maxPrice} min={2} max={30} step={.5} suffix={euro.format(preferences.maxPrice)} onChange={(value) => updateLimit('maxPrice', value)} /><FilterRange label="Maximale calorieën" value={preferences.maxKcal} min={250} max={1500} step={25} suffix={`${preferences.maxKcal} kcal`} onChange={(value) => updateLimit('maxKcal', value)} /><FilterRange label="Minimaal eiwit" value={preferences.minProtein} min={0} max={80} step={2} suffix={`${preferences.minProtein}g`} onChange={(value) => updateLimit('minProtein', value)} /><FilterRange label="Bereidingstijd" value={preferences.maxTime} min={10} max={180} step={5} suffix={`${preferences.maxTime} min`} onChange={(value) => updateLimit('maxTime', value)} /><FilterRange label="Maximale koolhydraten" value={preferences.maxCarbs} min={10} max={250} step={5} suffix={`${preferences.maxCarbs}g`} onChange={(value) => updateLimit('maxCarbs', value)} /><FilterRange label="Maximaal vet" value={preferences.maxFat} min={0} max={250} step={5} suffix={`${preferences.maxFat}g`} onChange={(value) => updateLimit('maxFat', value)} /></div>
        <div className="store-filter"><div><strong>Live supermarkt</strong><span>1 gekoppeld</span></div><div className="store-options"><button className="selected"><StoreMark /> Jumbo <BadgeCheck /></button></div></div><button className="primary-button filter-apply" onClick={() => setFiltersOpen(false)}>Toon {filtered.length.toLocaleString('nl-NL')} gerechten</button>
      </section></div>}
      {detailMeal && <div className="overlay detail-overlay" onMouseDown={() => setDetailMealId(null)}><section className="sheet mobile-details recipe-detail-sheet" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}><div className="sheet-head"><h2 id="detail-title">{detailMeal.title}</h2><button onClick={() => setDetailMealId(null)} aria-label="Sluit details" autoFocus><X /></button></div><MealDetails meal={detailMeal} full servings={detailServings} onServingsChange={setDetailServings} onAddToShopping={addDetailToShopping} inShopping={shopping.selections.some((selection) => selection.mealId === detailMeal.id)} plannerDates={visibleDates} onPlan={planDetailMeal} onLog={logDetailMeal} online={online} /></section></div>}
      <div className={`toast ${toast ? 'show' : ''}`}><Heart size={18} fill="currentColor" /> {toast}</div>
      <div className="sr-only" aria-live="polite">{announcement}</div>
    </div>
  )
}

const normalizeSearch = (value: string) => value.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

const isoDate = (value: string) => new Date(`${value}T12:00:00Z`)
const formatDayName = (value: string) => new Intl.DateTimeFormat('nl-NL', { weekday: 'long', timeZone: 'UTC' }).format(isoDate(value))
const formatDayDate = (value: string) => new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(isoDate(value))
const formatShortDate = (value: string) => new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(isoDate(value))
const localToday = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}
const TRACKER_MEAL_LABELS: Record<TrackerMealType, string> = { breakfast: 'Ontbijt', lunch: 'Lunch', dinner: 'Diner', snack: 'Tussendoor' }
const formatTrackerDate = (value: string) => new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(isoDate(value))

function formatWeekRange(dates: string[]) {
  if (!dates.length) return ''
  const first = isoDate(dates[0]); const last = isoDate(dates.at(-1)!)
  const sameMonth = first.getUTCMonth() === last.getUTCMonth()
  const firstLabel = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', ...(sameMonth ? {} : { month: 'short' }), timeZone: 'UTC' }).format(first)
  const lastLabel = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(last)
  return `${firstLabel} t/m ${lastLabel}`
}

function primaryDietLabel(meal: Meal) {
  if (meal.dietary.vegan) return 'Vegan'
  if (meal.dietary.vegetarian) return 'Vegetarisch'
  if (meal.dietary.pescatarian) return 'Pescotarisch'
  return 'Alleseter'
}

const preferenceLimitKeys = ['maxKcal', 'maxCarbs', 'maxFat', 'minProtein', 'maxTime', 'maxPrice'] as const
type PreferenceLimitKey = typeof preferenceLimitKeys[number]

function preferenceChips(preferences: DietPreferences) {
  const defaults = defaultPreferences()
  const chips: Array<{ id: string; label: string }> = []
  if (preferences.diet !== 'all') chips.push({ id: 'diet', label: DIETS.find(([id]) => id === preferences.diet)?.[1] || preferences.diet })
  if (preferences.preset !== 'balanced' && preferences.preset !== 'custom') chips.push({ id: 'preset', label: GOAL_PRESETS.find(([id]) => id === preferences.preset)?.[1] || preferences.preset })
  chips.push(...preferences.excludedAllergens.map((allergen) => ({ id: `allergen:${allergen}`, label: `Zonder ${ALLERGENS.find(([id]) => id === allergen)?.[1] || allergen}` })))
  chips.push(...preferences.excludedIngredients.map((ingredient) => ({ id: `ingredient:${ingredient}`, label: `Zonder ingrediënt ${ingredient}` })))
  if (preferences.mealTypes.length !== defaults.mealTypes.length) chips.push({ id: 'meal-types', label: preferences.mealTypes.length ? preferences.mealTypes.map((type) => MEAL_TYPE_LABELS[type]).join(' + ') : 'Geen gerechtsoort' })
  if (preferences.preset === 'custom') {
    if (preferences.maxKcal !== defaults.maxKcal) chips.push({ id: 'limit:maxKcal', label: `Max ${preferences.maxKcal} kcal` })
    if (preferences.maxCarbs !== defaults.maxCarbs) chips.push({ id: 'limit:maxCarbs', label: `Max ${preferences.maxCarbs}g koolhydraten` })
    if (preferences.maxFat !== defaults.maxFat) chips.push({ id: 'limit:maxFat', label: `Max ${preferences.maxFat}g vet` })
    if (preferences.minProtein !== defaults.minProtein) chips.push({ id: 'limit:minProtein', label: `Min ${preferences.minProtein}g eiwit` })
    if (preferences.maxTime !== defaults.maxTime) chips.push({ id: 'limit:maxTime', label: `Max ${preferences.maxTime} min` })
    if (preferences.maxPrice !== defaults.maxPrice) chips.push({ id: 'limit:maxPrice', label: `Max ${euro.format(preferences.maxPrice)}` })
  }
  return chips
}

function matchPercent(meal: Meal, profile: TasteProfile) { return Math.max(68, Math.min(99, Math.round(meal.popularity * .82 + tasteScore(meal, profile) * 3))) }

function NavButton({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) { return <button className={`nav-button ${active ? 'active' : ''}`} onClick={onClick} aria-current={active ? 'page' : undefined}>{icon}<span>{label}</span>{badge ? <em>{badge}</em> : null}</button> }
function FilterRange({ label, value, min, max, step, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void }) { return <label className="range-field"><div><strong>{label}</strong><span>{suffix}</span></div><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ '--range': `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties} /></label> }
function EmptyFilters({ onReset }: { onReset: () => void }) { return <div className="empty-state"><ShoppingBasket size={44} /><h2>Geen hap gevonden</h2><p>Maak je filters iets ruimer en we vullen je bord weer.</p><button onClick={onReset}>Filters resetten</button></div> }

function TrackerView({ state, date, suggestions, onPrevious, onNext, onToday, onOpen, onRemove, onUpdate, onRepeat, onExport, onGoals, onAddManual, onDiscover }: {
  state: TrackerState
  date: string
  suggestions: Meal[]
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onOpen: (mealId: string) => void
  onRemove: (id: string) => void
  onUpdate: (entry: TrackerEntry) => void
  onRepeat: (entry: TrackerEntry) => void
  onExport: () => void
  onGoals: (goals: TrackerGoals) => void
  onAddManual: (entry: { name: string; mealType: TrackerMealType; kcal: number; protein: number; carbs: number; fat: number }) => void
  onDiscover: () => void
}) {
  const [goalsOpen, setGoalsOpen] = useState(false)
  const [goalDraft, setGoalDraft] = useState<TrackerGoals>(state.goals)
  const [manual, setManual] = useState({ name: '', mealType: 'snack' as TrackerMealType, kcal: '', protein: '', carbs: '', fat: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({ date: '', name: '', mealType: 'snack' as TrackerMealType, portions: '1', kcal: '', protein: '', carbs: '', fat: '' })
  const entries = state.entries.filter((entry) => entry.date === date)
  const totals = dailyTotals(state.entries, date)
  const remainingKcal = Math.max(0, state.goals.kcal - totals.kcal)
  const remainingProtein = Math.max(0, Math.round((state.goals.protein - totals.protein) * 10) / 10)
  const energyPercent = Math.min(100, totals.kcal / state.goals.kcal * 100)
  const status = (value: number, goal: number, suffix: string) => value <= goal ? `${Math.round((goal - value) * 10) / 10}${suffix} resterend` : `${Math.round((value - goal) * 10) / 10}${suffix} boven referentie`
  const history = recentDateRange(date, 7).map((historyDate) => ({ date: historyDate, totals: dailyTotals(state.entries, historyDate) }))
  const historyMax = Math.max(state.goals.kcal, ...history.map(({ totals: day }) => day.kcal))
  const loggedHistory = history.filter(({ totals: day }) => day.kcal > 0)
  const historyAverage = loggedHistory.length ? Math.round(loggedHistory.reduce((sum, { totals: day }) => sum + day.kcal, 0) / loggedHistory.length) : 0
  const recentEntries = recentTrackerEntries(state.entries, date, 4)
  const insights = trackerPeriodSummary(state.entries, date, 30)

  function addManualEntry(event: React.FormEvent) {
    event.preventDefault()
    if (!manual.name.trim()) return
    onAddManual({
      name: manual.name.trim(), mealType: manual.mealType, kcal: Number(manual.kcal) || 0,
      protein: Number(manual.protein) || 0, carbs: Number(manual.carbs) || 0, fat: Number(manual.fat) || 0,
    })
    setManual({ name: '', mealType: manual.mealType, kcal: '', protein: '', carbs: '', fat: '' })
  }

  function beginEdit(entry: TrackerEntry) {
    setEditingId(entry.id)
    setEditDraft({
      date: entry.date, name: entry.name, mealType: entry.mealType, portions: String(entry.portions),
      kcal: String(entry.kcal), protein: String(entry.protein), carbs: String(entry.carbs), fat: String(entry.fat),
    })
  }

  function saveEdit(event: React.FormEvent, entry: TrackerEntry) {
    event.preventDefault()
    const updated = entry.source === 'recipe'
      ? { ...rescaleRecipeEntry(entry, Number(editDraft.portions)), date: editDraft.date, mealType: editDraft.mealType }
      : {
          ...entry, date: editDraft.date, name: editDraft.name.trim(), mealType: editDraft.mealType, portions: 1,
          kcal: Number(editDraft.kcal) || 0, protein: Number(editDraft.protein) || 0,
          carbs: Number(editDraft.carbs) || 0, fat: Number(editDraft.fat) || 0,
        }
    onUpdate(updated)
    setEditingId(null)
  }

  return <section className="tracker-view">
    <span className="eyebrow">LOKAAL VOEDINGSLOG · SCHATTINGEN</span>
    <div className="tracker-title-row"><div><h1>Voedingslog</h1><p className="view-intro">Log wat je daadwerkelijk eet. Geplande maaltijden tellen pas mee nadat jij ze toevoegt.</p></div><div className="tracker-date-switcher"><button onClick={onPrevious} aria-label="Vorige dag"><ChevronLeft /></button><button onClick={onToday} aria-label="Ga naar vandaag"><strong>{date === localToday() ? 'Vandaag' : formatShortDate(date)}</strong><small>{formatTrackerDate(date)}</small></button><button onClick={onNext} aria-label="Volgende dag"><ChevronRight /></button></div></div>
    <div className="tracker-dashboard">
      <article className="tracker-energy-card"><div className="tracker-energy-ring" role="progressbar" aria-label="Calorieën" aria-valuemin={0} aria-valuemax={state.goals.kcal} aria-valuenow={Math.min(totals.kcal, state.goals.kcal)} aria-valuetext={`${totals.kcal} kcal van ${state.goals.kcal} kcal`} style={{ '--tracker-progress': `${energyPercent * 3.6}deg` } as React.CSSProperties}><span><strong>{totals.kcal}</strong><small>van {state.goals.kcal}</small></span></div><div><span className="section-icon coral"><Flame /></span><small>ENERGIE</small><h2>{totals.kcal} kcal gebruikt</h2><p>{status(totals.kcal, state.goals.kcal, ' kcal')}</p></div></article>
      <div className="tracker-macro-cards"><TrackerMetric label="Eiwit" value={totals.protein} goal={state.goals.protein} suffix="g" color="protein" status={status(totals.protein, state.goals.protein, 'g')} /><TrackerMetric label="Koolhydraten" value={totals.carbs} goal={state.goals.carbs} suffix="g" color="carbs" status={status(totals.carbs, state.goals.carbs, 'g')} /><TrackerMetric label="Vetten" value={totals.fat} goal={state.goals.fat} suffix="g" color="fat" status={status(totals.fat, state.goals.fat, 'g')} /></div>
    </div>
    <section className="tracker-goal-panel"><div className="tracker-goal-summary"><span className="section-icon green"><Target /></span><div><small>JOUW BEWERKBARE DAGREFERENTIE</small><strong>{state.goals.kcal.toLocaleString('nl-NL')} kcal</strong><span>{state.goals.protein}g eiwit · {state.goals.carbs}g khd · {state.goals.fat}g vet</span></div><button onClick={() => { setGoalDraft(state.goals); setGoalsOpen((current) => !current) }}>{goalsOpen ? 'Sluit doelen' : 'Doelen aanpassen'}</button></div>{goalsOpen ? <form className="tracker-goal-form" onSubmit={(event) => { event.preventDefault(); onGoals(goalDraft); setGoalsOpen(false) }}><label><span>Calorieën</span><input type="number" aria-label="Dagdoel calorieën" min="1" max="10000" value={goalDraft.kcal} onChange={(event) => setGoalDraft((current) => ({ ...current, kcal: Number(event.target.value) }))} /></label><label><span>Eiwit (g)</span><input type="number" aria-label="Dagdoel eiwit" min="1" max="1000" step="1" value={goalDraft.protein} onChange={(event) => setGoalDraft((current) => ({ ...current, protein: Number(event.target.value) }))} /></label><label><span>Koolhydraten (g)</span><input type="number" aria-label="Dagdoel koolhydraten" min="1" max="2000" step="1" value={goalDraft.carbs} onChange={(event) => setGoalDraft((current) => ({ ...current, carbs: Number(event.target.value) }))} /></label><label><span>Vet (g)</span><input type="number" aria-label="Dagdoel vet" min="1" max="1000" step="1" value={goalDraft.fat} onChange={(event) => setGoalDraft((current) => ({ ...current, fat: Number(event.target.value) }))} /></label><button type="submit" aria-label="Bewaar voedingsdoelen"><BadgeCheck /> Bewaar doelen</button></form> : null}</section>
    <p className="tracker-reference-note"><ShieldAlert /> Startdoelen zijn EU-referentie-innames voor een gemiddelde volwassene, geen persoonlijk of medisch advies. Receptwaarden zijn schattingen. <a href="https://eur-lex.europa.eu/eli/reg/2011/1169" target="_blank" rel="noreferrer">Bekijk bron</a></p>
    <section className={`tracker-suggestions ${remainingKcal ? '' : 'reference-reached'}`} aria-labelledby="tracker-suggestions-title"><div className="tracker-suggestions-head"><div><span className="section-icon blue"><Sparkles /></span><div><small>TRANSPARANT OP BASIS VAN JE ACTIEVE FILTERS</small><h2 id="tracker-suggestions-title">{remainingKcal ? 'Past nog binnen je referentie' : 'Dagreferentie bereikt'}</h2><p>{remainingKcal ? `Alleen recepten van maximaal ${remainingKcal.toLocaleString('nl-NL')} kcal per portie. Geen compleet dag- of medisch advies.` : 'Je log staat op of boven je ingestelde energiereferentie. Hap geeft daarom geen restrictieve suggesties.'}</p></div></div>{remainingKcal ? <div><strong>{remainingKcal.toLocaleString('nl-NL')} kcal</strong><span>resterend{remainingProtein ? ` · ${remainingProtein}g eiwit` : ''}</span></div> : null}</div>{suggestions.length ? <div className="tracker-suggestion-grid">{suggestions.map((meal) => <article className="tracker-suggestion-card" key={meal.id}><button onClick={() => onOpen(meal.id)} aria-label={`Bekijk passende suggestie ${meal.title}`}><img src={meal.image} alt="" /><span><small className="diet-card-badge">{primaryDietLabel(meal)}</small><h3>{meal.title}</h3><em>{meal.kcal} kcal · {meal.protein}g eiwit</em><small>{meal.carbs}g khd · {meal.fat}g vet · {meal.time} min</small></span><ChevronRight /></button></article>)}</div> : <div className="tracker-suggestion-empty"><div><strong>{remainingKcal ? 'Geen recept binnen deze combinatie' : 'Ontdekken blijft altijd beschikbaar'}</strong><span>{remainingKcal ? 'Maak een maaltijdlimiet ruimer of bekijk je volledige gefilterde catalogus.' : 'Je kunt zonder oordeel verder bladeren door alle gerechten die bij je eetprofiel passen.'}</span></div><button onClick={onDiscover}>Bekijk gefilterde recepten <ChevronRight /></button></div>}</section>
    <div className="tracker-log-head"><div><small>{formatTrackerDate(date).toUpperCase()}</small><h2>Gelogde maaltijden</h2></div><div className="tracker-log-actions"><button onClick={onExport} disabled={!state.entries.length} aria-label="Exporteer voedingslog als CSV"><Download /> Exporteer CSV</button><button onClick={onDiscover}><Plus /> Log vanuit een recept</button></div></div>
    <form className="tracker-manual-form" onSubmit={addManualEntry}><div><span className="section-icon blue"><Plus /></span><div><strong>Handmatig loggen</strong><small>Voor eten zonder Hap-recept</small></div></div><label className="tracker-manual-name"><span>Naam</span><input aria-label="Naam maaltijd" value={manual.name} onChange={(event) => setManual((current) => ({ ...current, name: event.target.value }))} placeholder="Bijv. havermout met fruit" /></label><label><span>Type</span><select aria-label="Maaltijdtype" value={manual.mealType} onChange={(event) => setManual((current) => ({ ...current, mealType: event.target.value as TrackerMealType }))}>{TRACKER_MEAL_TYPES.map((type) => <option value={type} key={type}>{TRACKER_MEAL_LABELS[type]}</option>)}</select></label><label><span>Calorieën</span><input type="number" aria-label="Calorieën" min="0" max="20000" value={manual.kcal} onChange={(event) => setManual((current) => ({ ...current, kcal: event.target.value }))} placeholder="kcal" /></label><label><span>Eiwit</span><input type="number" aria-label="Eiwit" min="0" max="2000" step=".1" value={manual.protein} onChange={(event) => setManual((current) => ({ ...current, protein: event.target.value }))} placeholder="g" /></label><label><span>Koolhydraten</span><input type="number" aria-label="Koolhydraten" min="0" max="3000" step=".1" value={manual.carbs} onChange={(event) => setManual((current) => ({ ...current, carbs: event.target.value }))} placeholder="g" /></label><label><span>Vet</span><input type="number" aria-label="Vet" min="0" max="2000" step=".1" value={manual.fat} onChange={(event) => setManual((current) => ({ ...current, fat: event.target.value }))} placeholder="g" /></label><button type="submit" aria-label="Voeg handmatig toe aan voedingslog" disabled={!manual.name.trim()}><Plus /> Voeg toe</button></form>
    {recentEntries.length ? <section className="tracker-recent"><div><small>SNEL OPNIEUW LOGGEN</small><h2>Recente maaltijden</h2><p>Een kopie komt op {date === localToday() ? 'vandaag' : formatShortDate(date)}; het origineel blijft staan.</p></div><div>{recentEntries.map((entry) => <button key={entry.id} onClick={() => onRepeat(entry)} aria-label={`Log ${entry.name} opnieuw`}><Copy /><span><strong>{entry.name}</strong><small>{entry.kcal} kcal · {TRACKER_MEAL_LABELS[entry.mealType]}</small></span></button>)}</div></section> : null}
    {entries.length ? <div className="tracker-meal-groups">{TRACKER_MEAL_TYPES.map((mealType) => {
      const group = entries.filter((entry) => entry.mealType === mealType)
      return group.length ? <section key={mealType}>
        <h3>{TRACKER_MEAL_LABELS[mealType]}<span>{group.reduce((sum, entry) => sum + entry.kcal, 0)} kcal</span></h3>
        <div>{group.map((entry) => <div className="tracker-entry-wrap" key={entry.id}>
          <article className="tracker-entry">
            {entry.source === 'recipe' && entry.mealId ? <button className="tracker-entry-open" onClick={() => onOpen(entry.mealId!)} aria-label={`Open ${entry.name}`}><Utensils /></button> : <span className="tracker-entry-icon"><Utensils /></span>}
            <div><small>{entry.source === 'recipe' ? `${entry.portions} ${entry.portions === 1 ? 'portie' : 'porties'} · RECEPTSCHATTING` : 'HANDMATIG GELOGD'}</small><h3>{entry.name}</h3><span>{entry.kcal} kcal · {entry.protein}g eiwit · {entry.carbs}g khd · {entry.fat}g vet</span></div>
            <div className="tracker-entry-actions"><button className="tracker-entry-edit" onClick={() => beginEdit(entry)} aria-label={`Bewerk ${entry.name}`} aria-expanded={editingId === entry.id}><Pencil /></button><button className="tracker-entry-remove" onClick={() => { onRemove(entry.id); if (editingId === entry.id) setEditingId(null) }} aria-label={`Verwijder ${entry.name} uit voedingslog`}><Trash2 /></button></div>
          </article>
          {editingId === entry.id ? <form className={`tracker-edit-form ${entry.source}`} role="form" aria-label={`Bewerk ${entry.name}`} onSubmit={(event) => saveEdit(event, entry)}>
            <div><strong>{entry.source === 'recipe' ? 'Receptlog aanpassen' : 'Handmatige log aanpassen'}</strong><small>{entry.source === 'recipe' ? 'Macro’s schalen mee vanaf de vastgelegde receptschatting.' : 'Corrigeer de waarden die je eerder zelf invulde.'}</small></div>
            {entry.source === 'manual' ? <label><span>Naam</span><input aria-label="Naam bewerken" value={editDraft.name} onChange={(event) => setEditDraft((current) => ({ ...current, name: event.target.value }))} required autoFocus /></label> : null}
            <label><span>Datum</span><input type="date" aria-label="Datum bewerken" value={editDraft.date} onChange={(event) => setEditDraft((current) => ({ ...current, date: event.target.value }))} required autoFocus={entry.source === 'recipe'} /></label>
            <label><span>Type</span><select aria-label="Maaltijdtype bewerken" value={editDraft.mealType} onChange={(event) => setEditDraft((current) => ({ ...current, mealType: event.target.value as TrackerMealType }))}>{TRACKER_MEAL_TYPES.map((type) => <option value={type} key={type}>{TRACKER_MEAL_LABELS[type]}</option>)}</select></label>
            {entry.source === 'recipe' ? <label><span>Gegeten porties</span><input type="number" aria-label="Gegeten porties bewerken" min=".25" max="24" step=".25" value={editDraft.portions} onChange={(event) => setEditDraft((current) => ({ ...current, portions: event.target.value }))} required /></label> : <>
              <label><span>Calorieën</span><input type="number" aria-label="Calorieën bewerken" min="0" max="20000" value={editDraft.kcal} onChange={(event) => setEditDraft((current) => ({ ...current, kcal: event.target.value }))} /></label>
              <label><span>Eiwit</span><input type="number" aria-label="Eiwit bewerken" min="0" max="2000" step=".1" value={editDraft.protein} onChange={(event) => setEditDraft((current) => ({ ...current, protein: event.target.value }))} /></label>
              <label><span>Koolhydraten</span><input type="number" aria-label="Koolhydraten bewerken" min="0" max="3000" step=".1" value={editDraft.carbs} onChange={(event) => setEditDraft((current) => ({ ...current, carbs: event.target.value }))} /></label>
              <label><span>Vet</span><input type="number" aria-label="Vet bewerken" min="0" max="2000" step=".1" value={editDraft.fat} onChange={(event) => setEditDraft((current) => ({ ...current, fat: event.target.value }))} /></label>
            </>}
            <div className="tracker-edit-actions"><button type="button" onClick={() => setEditingId(null)} aria-label={`Annuleer bewerken van ${entry.name}`}><X /> Annuleer</button><button type="submit" aria-label={`Bewaar wijzigingen voor ${entry.name}`}><Save /> Bewaar</button></div>
          </form> : null}
        </div>)}</div>
      </section> : null
    })}</div> : <div className="empty-state compact tracker-empty"><ChartNoAxesCombined size={44} /><h2>Nog niets gelogd op deze dag</h2><p>Planning en eten blijven bewust gescheiden. Voeg alleen toe wat je daadwerkelijk hebt gegeten.</p><button onClick={onDiscover}>Kies een recept</button></div>}
    <section className="tracker-history"><div className="tracker-history-head"><div><small>LAATSTE 7 DAGEN TOT DEZE DATUM</small><h2>Historie</h2></div><div><strong>{historyAverage.toLocaleString('nl-NL')} kcal</strong><span>gemiddeld op {loggedHistory.length} {loggedHistory.length === 1 ? 'gelogde dag' : 'gelogde dagen'}</span></div></div><div className="tracker-history-chart">{history.map(({ date: historyDate, totals: day }) => <div className="tracker-history-bar" key={historyDate}><div><i style={{ height: `${day.kcal ? Math.max(8, day.kcal / historyMax * 100) : 0}%` }} /><span style={{ bottom: `${Math.min(100, state.goals.kcal / historyMax * 100)}%` }} /></div><strong>{day.kcal || '–'}</strong><small>{new Intl.DateTimeFormat('nl-NL', { weekday: 'short', timeZone: 'UTC' }).format(isoDate(historyDate))}</small></div>)}</div><p><span /> Referentielijn: {state.goals.kcal.toLocaleString('nl-NL')} kcal. Alleen gelogde data; ontbrekende dagen zijn geen nul-inname.</p></section>
    <section className="tracker-insights" aria-labelledby="tracker-insights-title"><div className="tracker-insights-head"><div><small>LAATSTE {insights.days} DAGEN TOT DEZE DATUM</small><h2 id="tracker-insights-title">Voedingsoverzicht</h2></div><strong>{insights.loggedDays} {insights.loggedDays === 1 ? 'gelogde dag' : 'gelogde dagen'}</strong></div><div className="tracker-insight-grid"><div><strong>{insights.average.kcal}</strong><span>gem. kcal</span></div><div><strong>{insights.average.protein}g</strong><span>gem. eiwit</span></div><div><strong>{insights.average.carbs}g</strong><span>gem. koolhydraten</span></div><div><strong>{insights.average.fat}g</strong><span>gem. vet</span></div></div><p>Gemiddeld per gelogde dag. Dagen zonder logregels tellen niet als nul-inname.</p></section>
  </section>
}

function TrackerMetric({ label, value, goal, suffix, color, status }: { label: string; value: number; goal: number; suffix: string; color: string; status: string }) {
  return <article className="tracker-metric"><div><span className={`macro-dot ${color}`} /><strong>{value}{suffix}</strong><small>van {goal}{suffix}</small></div><div className="tracker-metric-bar" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(value, goal)} aria-valuetext={`${value}${suffix} van ${goal}${suffix}; ${status}`}><i className={color} style={{ width: `${Math.min(100, value / goal * 100)}%` }} /></div><p>{status}</p></article>
}

function PlannerView({ state, dates, weekStart, onPrevious, onNext, onToday, onFill, onAddToShopping, onOpen, onRemove, onClear, onServings, onDiscover }: {
  state: PlannerState
  dates: string[]
  weekStart: string
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onFill: () => void
  onAddToShopping: () => void
  onOpen: (mealId: string) => void
  onRemove: (date: string) => void
  onClear: () => void
  onServings: (date: string, servings: number) => void
  onDiscover: () => void
}) {
  const entries = dates.flatMap((date) => {
    const entry = state.entries.find((item) => item.date === date)
    const meal = entry ? meals.find(({ id }) => id === entry.mealId) : undefined
    return entry && meal ? [{ ...entry, meal }] : []
  })
  const plannedByDate = new Map(entries.map((entry) => [entry.date, entry]))
  const averageKcal = entries.length ? Math.round(entries.reduce((sum, { meal }) => sum + meal.kcal, 0) / entries.length) : 0
  const averageProtein = entries.length ? Math.round(entries.reduce((sum, { meal }) => sum + meal.protein, 0) / entries.length) : 0
  const totalPrice = entries.reduce((sum, { meal, servings }) => sum + meal.estimatedPrice * servings, 0)
  const today = localToday()

  return <section className="planner-view">
    <span className="eyebrow">JE EETWEEK IN ÉÉN OOGOPSLAG</span>
    <div className="planner-title-row"><div><h1>Mijn week</h1><p className="view-intro">Plan diners met je actieve eetprofiel. De voedingswaarden blijven receptschattingen per portie.</p></div><div className="week-switcher"><button onClick={onPrevious} aria-label="Vorige week"><ChevronLeft /></button><button className="week-current" onClick={onToday} aria-label="Ga naar deze week">{weekStart === startOfWeek() ? 'Deze week' : 'Vandaag'}</button><button onClick={onNext} aria-label="Volgende week"><ChevronRight /></button></div></div>
    <div className="planner-toolbar"><div><CalendarDays /><span><strong>{formatWeekRange(dates)}</strong><small>{entries.length} van 7 dagen gepland</small></span></div><div className="planner-toolbar-actions"><button className="planner-fill" onClick={onFill} disabled={entries.length === dates.length}><Sparkles /> {entries.length === dates.length ? 'Week gevuld' : 'Vul lege dagen'}</button><button className="planner-shopping" onClick={onAddToShopping} disabled={!entries.length}><CalendarPlus /> Voeg week toe aan boodschappenlijst</button></div></div>
    {entries.length ? <div className="planner-summary"><div><strong>{entries.length}/7</strong><span>diners gepland</span></div><div><strong>{averageKcal}</strong><span>gem. kcal p.p.</span></div><div><strong>{averageProtein}g</strong><span>gem. eiwit p.p.</span></div><div><strong>{euro.format(totalPrice)}</strong><span>richtprijs totaal</span></div></div> : null}
    <div className="planner-days">{dates.map((date) => {
      const entry = plannedByDate.get(date)
      return <article className={`planner-day-card ${date === today ? 'today' : ''}`} key={date}>
        <header><div><span>{formatDayName(date)}</span><strong>{formatShortDate(date)}</strong></div>{date === today ? <em>Vandaag</em> : null}</header>
        {entry ? <div className="planner-meal-card"><button className="planner-meal-open" onClick={() => onOpen(entry.meal.id)}><img src={entry.meal.image} alt="" /><span><small>{primaryDietLabel(entry.meal)} · {entry.meal.time} MIN</small><h3>{entry.meal.title}</h3><em>{entry.meal.kcal} kcal · {entry.meal.protein}g eiwit</em></span></button><div className="planner-meal-actions"><div className="planner-portions"><button onClick={() => onServings(date, entry.servings - 1)} disabled={entry.servings <= 1} aria-label={`Minder porties op ${formatDayName(date)}`}><Minus /></button><output>{entry.servings}p</output><button onClick={() => onServings(date, entry.servings + 1)} disabled={entry.servings >= 12} aria-label={`Meer porties op ${formatDayName(date)}`}><Plus /></button></div><button className="planner-remove" onClick={() => onRemove(date)} aria-label={`Verwijder maaltijd op ${formatDayName(date)}`}><X /></button></div></div>
          : <div className="planner-empty-day"><CalendarPlus /><strong>Nog geen diner</strong><button onClick={onDiscover}>Kies een recept</button></div>}
      </article>
    })}</div>
    {entries.length ? <button className="planner-clear" onClick={onClear}>Wis alleen deze week</button> : null}
  </section>
}

function ShoppingView({ state, items, online, onToggle, onEdit, onRemove, onAddCustom, onRemoveCustom, onTogglePantry, onClearChecks, onClear, onDiscover }: {
  state: ShoppingState
  items: ShoppingItem[]
  online: boolean
  onToggle: (key: string) => void
  onEdit: (mealId: string) => void
  onRemove: (mealId: string) => void
  onAddCustom: (name: string, amount: string) => void
  onRemoveCustom: (id: string) => void
  onTogglePantry: (key: string) => void
  onClearChecks: () => void
  onClear: () => void
  onDiscover: () => void
}) {
  const [cartLoading, setCartLoading] = useState(false)
  const [error, setError] = useState('')
  const [customName, setCustomName] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const selectedMeals = state.selections.flatMap((selection) => {
    const meal = meals.find(({ id }) => id === selection.mealId)
    return meal ? [{ meal, servings: selection.servings }] : []
  })
  const checked = new Set(state.checked)
  const pantry = new Set(state.pantry)
  const checkedCount = items.filter(({ key }) => checked.has(key)).length
  const pantryCount = items.filter(({ key }) => pantry.has(key)).length
  const cartIngredients = shoppingCartIngredients(items, state.checked, state.pantry)
  const categoryLabels: Record<ShoppingCategory, string> = {
    produce: 'Groente & fruit', bakery: 'Brood & bakkerij', dairy: 'Zuivel & eieren', protein: 'Vlees, vis & vega',
    pantry: 'Voorraadkast', spices: 'Kruiden & smaakmakers', other: 'Overig',
  }
  const categoryOrder: ShoppingCategory[] = ['produce', 'bakery', 'dairy', 'protein', 'pantry', 'spices', 'other']
  const groups = categoryOrder.map((category) => ({ category, items: items.filter((item) => categoryForIngredient(item.name) === category) })).filter((group) => group.items.length)

  function addManualItem(event: React.FormEvent) {
    event.preventDefault()
    if (!customName.trim()) return
    onAddCustom(customName, customAmount)
    setCustomName(''); setCustomAmount('')
  }

  async function openCombinedCart() {
    if (!online) return setError('De Jumbo-winkelwagen vereist internet. Je lokale lijst blijft bewaard.')
    setCartLoading(true); setError('')
    try {
      const redirect = await createJumboCart(cartIngredients)
      window.location.assign(redirect)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Winkelwagen maken mislukt.')
      setCartLoading(false)
    }
  }

  return <section className="shopping-view">
    <span className="eyebrow">RECEPTEN EN ALLES WAT JE NOG NODIG HEBT</span>
    <div className="shopping-title-row"><div><h1>Boodschappenlijst</h1><p className="view-intro">Gegroepeerd per winkelafdeling. Hoeveelheden uit recepten blijven zichtbaar; grammen zijn schattingen.</p></div>{selectedMeals.length || state.custom.length ? <button className="shopping-clear" onClick={onClear}>Wis lijst</button> : null}</div>
    <form className="manual-shopping-form" onSubmit={addManualItem}><div><span className="section-icon green"><Plus /></span><div><strong>Zelf iets toevoegen</strong><small>Ook voor alles buiten je recepten</small></div></div><label><span>Artikel</span><input aria-label="Artikel" value={customName} onChange={(event) => setCustomName(event.target.value)} maxLength={80} placeholder="Bijv. bananen" /></label><label><span>Hoeveelheid</span><input aria-label="Hoeveelheid" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} maxLength={50} placeholder="Bijv. 6 stuks" /></label><button type="submit" aria-label="Voeg handmatig artikel toe" disabled={!customName.trim()}><Plus /> Voeg toe</button></form>
    {state.custom.length ? <div className="manual-shopping-items" aria-label="Handmatig toegevoegd">{state.custom.map((item) => <span key={item.id}><strong>{item.name}</strong>{item.amount ? <small>{item.amount}</small> : null}<button onClick={() => onRemoveCustom(item.id)} aria-label={`Verwijder handmatig artikel ${item.name}`}><Trash2 /></button></span>)}</div> : null}
    {!items.length ? <div className="empty-state compact"><ShoppingBasket size={44} /><h1>Je boodschappenlijst is leeg</h1><p>Voeg hierboven zelf iets toe of kies ingrediënten vanuit een recept.</p><button onClick={onDiscover}>Vind een gerecht</button></div> : <div className={`shopping-layout ${selectedMeals.length ? '' : 'without-recipes'}`}>
      {selectedMeals.length ? <aside className="shopping-recipes" aria-label="Gekozen recepten">
        <div className="shopping-section-head"><div><small>GERECHTEN</small><h2>{selectedMeals.length} {selectedMeals.length === 1 ? 'recept' : 'recepten'}</h2></div></div>
        <div className="shopping-recipe-list">{selectedMeals.map(({ meal, servings }) => <article className="shopping-recipe-card" key={meal.id}>
          <img src={meal.image} alt="" />
          <div><small>{servings} {servings === 1 ? 'PORTIE' : 'PORTIES'}</small><h2>{meal.title}</h2><button onClick={() => onEdit(meal.id)}>Pas porties aan</button></div>
          <button className="shopping-recipe-remove" onClick={() => onRemove(meal.id)} aria-label={`Verwijder ${meal.title} uit boodschappenlijst`}><X /></button>
        </article>)}</div>
      </aside> : null}
      <div className="shopping-list-panel">
        <div className="shopping-section-head"><div><small>GECOMBINEERD</small><h2>Alles op volgorde</h2></div>{checkedCount ? <button onClick={onClearChecks}>Vinkjes wissen</button> : null}</div>
        <div className="shopping-progress"><span>{checkedCount} van {items.length} afgevinkt{pantryCount ? ` · ${pantryCount} altijd in huis` : ''}</span><div role="progressbar" aria-label="Boodschappen afgerond" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={checkedCount + pantryCount} aria-valuetext={`${checkedCount} afgevinkt${pantryCount ? ` en ${pantryCount} altijd in huis` : ''} van ${items.length}`}><i style={{ width: `${items.length ? (checkedCount + pantryCount) / items.length * 100 : 0}%` }} /></div></div>
        <div className="shopping-groups">{groups.map(({ category, items: categoryItems }) => <section className="shopping-category" key={category}><h3><span>{categoryLabels[category]}</span><em>{categoryItems.length}</em></h3><div className="shopping-items">{categoryItems.map((item) => {
          const inPantry = pantry.has(item.key)
          return <div className={`shopping-item ${checked.has(item.key) ? 'checked' : ''} ${inPantry ? 'pantry' : ''}`} key={item.key}>
            <label className="shopping-item-main"><input type="checkbox" checked={checked.has(item.key)} disabled={inPantry} onChange={() => onToggle(item.key)} /><span className="shopping-check" aria-hidden="true"><BadgeCheck /></span><span className="shopping-item-copy"><strong>{item.name}</strong><span>{item.contributions.map(({ amount, mealTitle }) => `${amount || 'hoeveelheid naar smaak'} voor ${mealTitle}`).join(' + ')}</span>{item.estimatedGrams > 0 ? <small>≈ {item.estimatedGrams} g geschat</small> : null}</span></label>
            <button className="pantry-toggle" onClick={() => onTogglePantry(item.key)} aria-pressed={inPantry} aria-label={inPantry ? `Haal ${item.name} uit vaste voorraad` : `Markeer ${item.name} als altijd in huis`}><Warehouse /><span>{inPantry ? 'In huis' : 'Vaste voorraad'}</span></button>
          </div>
        })}</div></section>)}</div>
        {error ? <p className="integration-error">{error}</p> : null}
        <button className="basket-button shopping-cart-button" onClick={openCombinedCart} disabled={cartLoading || !cartIngredients.length || !online} aria-label={!online ? 'Jumbo-winkelwagen vereist internet' : undefined}>{cartLoading ? <LoaderCircle className="spin" /> : <ShoppingBasket size={19} />} {cartLoading ? 'Winkelwagen maken…' : online ? `Open Jumbo-winkelwagen (${cartIngredients.length})` : 'Jumbo-winkelwagen is offline'} <ChevronRight size={18} /></button>
      </div>
    </div>}
  </section>
}

function MealDetails({ meal, full = false, servings = meal.servings, onServingsChange, onAddToShopping, inShopping = false, plannerDates, onPlan, onLog, online = true }: { meal: Meal; full?: boolean; servings?: number; onServingsChange?: (servings: number) => void; onAddToShopping?: () => void; inShopping?: boolean; plannerDates?: string[]; onPlan?: (date: string) => void; onLog?: (input: { date: string; mealType: TrackerMealType; portions: number }) => void; online?: boolean }) {
  const [plannerOpen, setPlannerOpen] = useState(false)
  const [trackerOpen, setTrackerOpen] = useState(false)
  const [eatenPortions, setEatenPortions] = useState(1)
  const [logDate, setLogDate] = useState(localToday())
  const [logMealType, setLogMealType] = useState<TrackerMealType>('dinner')
  const allergenLabels = meal.allergens.map((allergen) => ALLERGENS.find(([id]) => id === allergen)?.[1] || allergen)
  const ingredients = full ? meal.ingredients : meal.ingredients.slice(0, 8)
  const ingredientIcons = ['🥩', '🍞', '🧀', '🍅', '🥒', '🥔', '🌿', '🥣']
  const portionLabel = `${servings} ${servings === 1 ? 'portie' : 'porties'}`
  const portionFactor = servings / meal.servings

  return <aside className="details-panel">
    <div className="panel-section macro-section"><div className="section-title"><div><span className="section-icon coral"><Zap size={17} /></span><div><small>GESCHAT PER PORTIE · {meal.grams} GRAM</small><h3>Macro's</h3></div></div><strong>{meal.kcal}<small> kcal</small></strong></div><div className="macro-grid"><div><span className="macro-dot protein" /><strong>{meal.protein}g</strong><small>Eiwit</small></div><div><span className="macro-dot carbs" /><strong>{meal.carbs}g</strong><small>Koolhydraten</small></div><div><span className="macro-dot fat" /><strong>{meal.fat}g</strong><small>Vetten</small></div></div><div className="nutrition-proof"><BadgeCheck size={13} /> Gewichtsschatting · {meal.nutritionCoverage}% dekking · <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noreferrer">USDA-basis</a></div></div>
    <div className="panel-section diet-section"><div className="section-title"><div><span className="section-icon green"><Leaf size={17} /></span><div><small>OP BASIS VAN DE INGREDIËNTENLIJST</small><h3>Eetprofiel</h3></div></div></div><div className="diet-evidence"><span>{primaryDietLabel(meal)}</span><span>{MEAL_TYPE_LABELS[meal.mealType]}</span></div><h4>{allergenLabels.length ? 'Allergenen gedetecteerd' : 'Geen van de 14 EU-allergenen gedetecteerd'}</h4>{allergenLabels.length ? <div className="allergen-list">{allergenLabels.map((label) => <span key={label}>{label}</span>)}</div> : null}<p className="safety-note"><ShieldAlert size={17} /> Controleer altijd het volledige recept, productverpakkingen, vervangingen en kruisbesmetting. Deze detectie is geen allergieveiligheidsgarantie.</p></div>
    <div className="panel-section ingredient-section"><div className="section-title"><div><span className="section-icon green"><ShoppingBasket size={17} /></span><div><small>{meal.ingredients.length} INGREDIËNTEN · {full ? servings : meal.servings} PORTIES</small><h3>Dit heb je nodig</h3></div></div></div>{full && onServingsChange ? <div className="portion-row"><div><strong>Voor hoeveel mensen?</strong><small>Ingrediënten schalen direct mee</small></div><div className="portion-control"><button onClick={() => onServingsChange(servings - 1)} disabled={servings <= 1} aria-label="Minder porties"><Minus /></button><output aria-label="Aantal porties">{portionLabel}</output><button onClick={() => onServingsChange(servings + 1)} disabled={servings >= 12} aria-label="Meer porties"><Plus /></button></div></div> : null}<div className="ingredient-list">{ingredients.map((ingredient, i) => <span key={`${ingredient.name}-${i}`}><i>{ingredientIcons[i % ingredientIcons.length]}</i>{scaleAmount(ingredient.amount, portionFactor)} {ingredient.name}</span>)}</div>{!full && meal.ingredients.length > ingredients.length ? <small className="ingredient-more">+ {meal.ingredients.length - ingredients.length} meer in volledige details</small> : null}<a className="source-link" href={meal.sourceUrl} target="_blank" rel="noreferrer">Bron: {meal.sourceName} <ExternalLink size={12} /></a></div>
    {full && onAddToShopping ? <button className="shopping-add-button" aria-label={`${inShopping ? 'Werk' : 'Voeg'} ${portionLabel} ${inShopping ? 'bij op' : 'toe aan'} boodschappenlijst`} onClick={onAddToShopping}><ShoppingBasket /> {inShopping ? `Werk ${portionLabel} bij` : `Voeg ${portionLabel} toe aan boodschappenlijst`}</button> : null}
    {full && onPlan && plannerDates?.length ? <div className="planner-add-block"><button className="planner-add-button" onClick={() => setPlannerOpen((current) => !current)} aria-expanded={plannerOpen}><CalendarPlus /> Plan deze maaltijd <ChevronRight /></button>{plannerOpen ? <div className="planner-picker"><strong>Kies een dag</strong><small>Een bestaande maaltijd op die dag wordt vervangen.</small><div>{plannerDates.map((date) => <button className="planner-day-option" key={date} onClick={() => { onPlan(date); setPlannerOpen(false) }}><span>{formatDayName(date)}</span><small>{formatShortDate(date)}</small></button>)}</div></div> : null}</div> : null}
    {full && onLog ? <div className="tracker-add-block"><button className="tracker-add-button" onClick={() => setTrackerOpen((current) => !current)} aria-expanded={trackerOpen}><ChartNoAxesCombined /> Log in voedingslog <ChevronRight /></button>{trackerOpen ? <div className="tracker-recipe-form"><div><strong>Wat heb je gegeten?</strong><small>Gegeten porties staan los van de bereidingsporties hierboven.</small></div><div className="tracker-recipe-fields"><label><span>Datum</span><input type="date" value={logDate} onChange={(event) => setLogDate(event.target.value)} /></label><label><span>Maaltijd</span><select value={logMealType} onChange={(event) => setLogMealType(event.target.value as TrackerMealType)}>{TRACKER_MEAL_TYPES.map((type) => <option key={type} value={type}>{TRACKER_MEAL_LABELS[type]}</option>)}</select></label><div className="tracker-eaten-portions"><span>Gegeten porties</span><div><button onClick={() => setEatenPortions((current) => Math.max(.25, current - .25))} disabled={eatenPortions <= .25} aria-label="Minder gegeten porties"><Minus /></button><output>{eatenPortions} {eatenPortions === 1 ? 'portie' : 'porties'}</output><button onClick={() => setEatenPortions((current) => Math.min(24, current + .25))} disabled={eatenPortions >= 24} aria-label="Meer gegeten porties"><Plus /></button></div></div></div><div className="tracker-log-preview">{(() => { const values = scaleMealNutrition(meal, eatenPortions); return <><strong>{values.kcal} kcal</strong><span>{values.protein}g eiwit · {values.carbs}g khd · {values.fat}g vet</span></> })()}</div><button className="tracker-log-submit" aria-label={`Log ${eatenPortions} ${eatenPortions === 1 ? 'portie' : 'porties'} in voedingslog`} onClick={() => { onLog({ date: logDate, mealType: logMealType, portions: eatenPortions }); setTrackerOpen(false) }}><Plus /> Log {eatenPortions} {eatenPortions === 1 ? 'portie' : 'porties'} in voedingslog</button></div> : null}</div> : null}
    {full ? <RecipeInstructions meal={meal} /> : null}
    <JumboPanel meal={meal} servings={servings} online={online} />
  </aside>
}

function RecipeInstructions({ meal }: { meal: Meal }) {
  const [instructions, setInstructions] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setInstructions(''); setError('')
    if (!meal.instructionId) { setLoading(false); return () => { active = false } }
    setLoading(true)
    import('./data/instructions.generated.json')
      .then((module) => { if (active) setInstructions((module.default as Record<string, string>)[meal.instructionId!] || '') })
      .catch(() => { if (active) setError('De bereiding kon niet worden geladen.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [meal.instructionId])

  const steps = instructions.split(/\r?\n+|(?<=[.!?])\s+(?=[A-Z])/).map((step) => step.trim()).filter(Boolean)
  return <div className="panel-section instruction-section"><div className="section-title"><div><span className="section-icon coral"><Flame size={17} /></span><div><small>VAN DE ORIGINELE RECEPTBRON</small><h3>Bereiding</h3></div></div></div>{loading ? <p className="instruction-status"><LoaderCircle className="spin" /> Bereiding laden…</p> : error ? <p className="integration-error">{error}</p> : steps.length ? <ol>{steps.map((step, index) => <li key={`${index}-${step.slice(0, 24)}`}>{step}</li>)}</ol> : <p className="instruction-status">De bron bevat geen bereidingsstappen.</p>}</div>
}

function JumboPanel({ meal, servings = meal.servings, online = true }: { meal: Meal; servings?: number; online?: boolean }) {
  const [products, setProducts] = useState<JumboProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { setProducts([]); setError('') }, [meal.id])

  async function checkPrices() {
    if (!online) return setError('Jumbo-prijzen vereisen internet.')
    setLoading(true); setError('')
    try {
      const matches = await Promise.all(meal.ingredients.slice(0, 5).map(async (ingredient) => (await fetchJumboPrices(ingredient.name))[0]))
      setProducts(matches.filter(Boolean))
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Prijscontrole mislukt.') }
    finally { setLoading(false) }
  }

  async function addToCart() {
    if (!online) return setError('De Jumbo-winkelwagen vereist internet.')
    setCartLoading(true); setError('')
    try {
      const redirect = await createJumboCart(meal.ingredients.slice(0, 30).map(({ name, amount }) => ({ name, amount: scaleAmount(amount, servings / meal.servings) })))
      window.location.assign(redirect)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Winkelwagen maken mislukt.'); setCartLoading(false) }
  }

  const total = products.reduce((sum, product) => sum + product.price, 0)
  return <div className="jumbo-block"><div className="panel-section"><div className="section-title"><div><span className="section-icon blue"><Store size={17} /></span><div><small>GRATIS LIVE KOPPELING</small><h3>Jumbo prijscheck</h3></div></div>{products.length ? <strong>{euro.format(total)}</strong> : null}</div>{products.length ? <div className="deal-list">{products.map((product) => <a className="deal" href={product.product_url} target="_blank" rel="noreferrer" key={product.product_id}><StoreMark /><div><strong>{product.name}</strong><span>{product.quantity || 'Jumbo product'}</span></div><div className="deal-price"><strong>{euro.format(product.price)}</strong>{product.original_price ? <small>VAN {euro.format(product.original_price)}</small> : null}</div></a>)}</div> : <button className="price-check" onClick={checkPrices} disabled={loading || !online} aria-label={!online ? 'Jumbo-prijzen vereisen internet' : undefined}>{loading ? <LoaderCircle className="spin" /> : <Search />} {loading ? 'Jumbo doorzoeken…' : online ? 'Controleer live Jumbo-prijs' : 'Jumbo-prijzen zijn offline'}</button>}{error && <p className="integration-error">{error}</p>}<a className="attribution" href="https://www.prijsprofeet.nl" target="_blank" rel="noreferrer">Prijsdata via PrijsProfeet</a></div><button className="basket-button" onClick={addToCart} disabled={cartLoading || !online} aria-label={!online ? 'Jumbo-winkelwagen vereist internet' : undefined}>{cartLoading ? <LoaderCircle className="spin" /> : <ShoppingBasket size={19} />} {cartLoading ? 'Winkelwagen maken…' : online ? 'Open Jumbo-winkelwagen' : 'Jumbo-winkelwagen is offline'} <ChevronRight size={18} /></button></div>
}

function ProfileView({ profile, saved, preferences, canInstall, installed, backupPreview, backupError, onInstall, onDownloadBackup, onBackupFile, onRestoreBackup, onEditDiet, onReset }: { profile: TasteProfile; saved: number; preferences: DietPreferences; canInstall: boolean; installed: boolean; backupPreview: ParsedHapBackup | null; backupError: string; onInstall: () => void; onDownloadBackup: () => void; onBackupFile: (file: File) => void; onRestoreBackup: () => void; onEditDiet: () => void; onReset: () => void }) {
  const top = Object.entries(profile.weights).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([key]) => key.split(':')[1].replace('-', ' '))
  const diet = DIETS.find(([id]) => id === preferences.diet)?.[1] || 'Alles'
  const exclusions = preferences.excludedAllergens.map((allergen) => ALLERGENS.find(([id]) => id === allergen)?.[1]).filter(Boolean)
  return <section className="profile-view"><span className="eyebrow">LOKAAL LEERPROFIEL</span><h1>Hap leert je kennen.</h1><div className="profile-card"><div className="profile-ring"><span>{profile.interactions}</span><small>swipes</small></div><div><h2>Elke keuze telt een beetje mee</h2><p>Recente keuzes wegen het sterkst; een kleine exploratiebonus blijft nieuwe smaken tonen.</p><div className="taste-tags">{top.length ? top.map((tag) => <span key={tag}>✨ {tag}</span>) : <span>Swipe om te beginnen</span>}</div></div></div><div className="profile-diet-card"><span className="section-icon green"><Leaf size={19} /></span><div><small>VASTE VOORKEUREN</small><h2>Mijn eetprofiel</h2><p>{diet}{exclusions.length ? ` · zonder ${exclusions.join(', ')}` : ' · geen allergenen uitgesloten'}</p></div><button onClick={onEditDiet}>Pas eetprofiel aan</button></div><div className="profile-install-card"><span className="section-icon blue"><Download /></span><div><small>APP OP DIT APPARAAT</small><h2>{installed ? 'Hap is geïnstalleerd' : 'Installeer Hap'}</h2><p>{installed ? 'Je gebruikt Hap als zelfstandige app.' : canInstall ? 'Sneller openen en je lokale functies na de eerste laadbeurt ook offline gebruiken.' : 'Gebruik de installatie-optie in het browsermenu als die beschikbaar is.'}</p></div>{canInstall && !installed ? <button onClick={onInstall}>Installeer Hap</button> : <span className="install-status">{installed ? 'Geïnstalleerd' : 'Browsermenu'}</span>}</div><section className="profile-data-card"><div className="profile-data-head"><span className="section-icon green"><Upload /></span><div><small>PRIVÉ EN VOLLEDIG LOKAAL</small><h2>Mijn lokale data</h2><p>Download of herstel saves, eetprofiel, planner, boodschappen en voedingslog. Er wordt niets geüpload.</p></div><div><button onClick={onDownloadBackup} aria-label="Download Hap-back-up"><Download /> Download back-up</button><label><Upload /> Kies back-up<input type="file" accept="application/json,.json" aria-label="Kies Hap-back-up" onChange={(event) => { const file = event.target.files?.[0]; if (file) onBackupFile(file); event.target.value = '' }} /></label></div></div>{backupError ? <p className="backup-error" role="alert">{backupError}</p> : null}{backupPreview ? <div className="backup-preview"><div><strong>Geldige Hap-back-up</strong><span>{new Intl.DateTimeFormat('nl-NL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(backupPreview.createdAt))}</span><small>{backupPreview.saved.length} {backupPreview.saved.length === 1 ? 'opgeslagen recept' : 'opgeslagen recepten'} · {backupPreview.planner.entries.length} geplande dagen · {backupPreview.tracker.entries.length} logregels</small></div><button onClick={onRestoreBackup}>Herstel back-up</button></div> : null}</section><div className="profile-stats"><div><strong>{saved}</strong><span>opgeslagen</span></div><div><strong>{profile.interactions}</strong><span>geleerde keuzes</span></div><div><strong>{Math.min(100, Math.round(profile.interactions / 25 * 100))}%</strong><span>ingeleerd</span></div></div><button className="reset-taste" onClick={onReset}>Wis alleen mijn smaakmodel</button></section>
}

export default App
