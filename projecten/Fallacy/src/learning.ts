import { categories, fallacies, questions, type Category, type Difficulty, type PracticeMode, type Question } from './data'

export const STORAGE_KEY = 'signal-noise-fallacy-lab-v1'

export type Mastery = 'New' | 'Warming up' | 'Practicing' | 'Strong'

export interface AnswerRecord {
  questionId: string
  mode: Exclude<PracticeMode, 'speed'>
  fallacyId: string | null
  selectedFallacyId: string | null
  isCorrect: boolean
  answeredAt: number
}

export interface SessionRecord {
  id: string
  mode: PracticeMode
  correct: number
  total: number
  durationSeconds: number
  completedAt: number
}

export interface AppState {
  answers: AnswerRecord[]
  sessions: SessionRecord[]
  savedIds: string[]
  learnedIds: string[]
  theme: 'dark' | 'light'
}

export interface PracticeSettings {
  count: 5 | 8 | 12
  difficulty: Difficulty | 'all'
  category: Category | 'all'
}

export const defaultSettings: PracticeSettings = {
  count: 5,
  difficulty: 'all',
  category: 'all',
}

export function createDefaultState(): AppState {
  return {
    answers: [],
    sessions: [],
    savedIds: [],
    learnedIds: [],
    theme: 'dark',
  }
}

export function loadState(): AppState {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return createDefaultState()

  try {
    const parsed = JSON.parse(stored) as Partial<AppState>
    return {
      answers: Array.isArray(parsed.answers) ? parsed.answers.filter(isAnswerRecord) : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions.filter(isSessionRecord) : [],
      savedIds: Array.isArray(parsed.savedIds) ? parsed.savedIds.filter((id): id is string => typeof id === 'string') : [],
      learnedIds: Array.isArray(parsed.learnedIds) ? parsed.learnedIds.filter((id): id is string => typeof id === 'string') : [],
      theme: parsed.theme === 'light' ? 'light' : 'dark',
    }
  } catch {
    console.warn('Signal / Noise could not read its local progress and started fresh.')
    return createDefaultState()
  }
}

export function getFallacyAnswers(state: AppState, fallacyId: string): AnswerRecord[] {
  return state.answers.filter((answer) => answer.fallacyId === fallacyId)
}

export function getMastery(state: AppState, fallacyId: string): Mastery {
  const answers = getFallacyAnswers(state, fallacyId)
  if (answers.length === 0) return 'New'

  const accuracy = answers.filter((answer) => answer.isCorrect).length / answers.length
  if (answers.length >= 5 && accuracy >= 0.8) return 'Strong'
  if (answers.length >= 3 && accuracy >= 0.65) return 'Practicing'
  return 'Warming up'
}

export function getAccuracy(state: AppState, fallacyId: string): number | null {
  const answers = getFallacyAnswers(state, fallacyId)
  if (answers.length === 0) return null
  return Math.round((answers.filter((answer) => answer.isCorrect).length / answers.length) * 100)
}

export function getStats(state: AppState) {
  const total = state.answers.length
  const correct = state.answers.filter((answer) => answer.isCorrect).length
  const mastered = fallacies.filter((fallacy) => getMastery(state, fallacy.id) === 'Strong').length
  const currentStreak = getCurrentStreak(state.answers)

  return {
    total,
    correct,
    accuracy: total ? Math.round((correct / total) * 100) : 0,
    mastered,
    currentStreak,
    bestStreak: getBestStreak(state.answers),
    learned: fallacies.filter((fallacy) => state.learnedIds.includes(fallacy.id) || getMastery(state, fallacy.id) !== 'New').length,
  }
}

export function getWeakSpots(state: AppState) {
  return fallacies
    .map((fallacy) => {
      const answers = getFallacyAnswers(state, fallacy.id)
      return {
        fallacy,
        attempts: answers.length,
        accuracy: getAccuracy(state, fallacy.id),
        mastery: getMastery(state, fallacy.id),
      }
    })
    .filter((item) => item.attempts > 0)
    .sort((a, b) => {
      const accuracyDifference = (a.accuracy ?? 0) - (b.accuracy ?? 0)
      if (accuracyDifference !== 0) return accuracyDifference
      return b.attempts - a.attempts
    })
}

export function getCategoryStats(state: AppState) {
  return categoriesWithAttempts(state).sort((a, b) => b.accuracy - a.accuracy)
}

export function selectQuestions(
  state: AppState,
  mode: PracticeMode,
  settings: PracticeSettings,
): Question[] {
  const pool = questions.filter((question) => {
    if (mode !== 'speed' && question.mode !== mode) return false
    if (settings.difficulty !== 'all' && question.difficulty !== settings.difficulty) return false
    if (settings.category !== 'all') {
      const fallacy = question.correctFallacyId ? fallacies.find((item) => item.id === question.correctFallacyId) : undefined
      if (fallacy?.category !== settings.category) return false
    }
    return true
  })

  const latestByQuestion = new Map<string, AnswerRecord>()
  for (const answer of state.answers) {
    if (!latestByQuestion.has(answer.questionId)) latestByQuestion.set(answer.questionId, answer)
  }

  return [...pool]
    .sort((a, b) => priorityScore(b, state, latestByQuestion) - priorityScore(a, state, latestByQuestion))
    .slice(0, mode === 'speed' ? 30 : settings.count)
}

export function recordAnswer(
  state: AppState,
  answer: Omit<AnswerRecord, 'answeredAt'>,
): AppState {
  return {
    ...state,
    answers: [{ ...answer, answeredAt: Date.now() }, ...state.answers].slice(0, 600),
  }
}

export function addSession(
  state: AppState,
  input: Omit<SessionRecord, 'id' | 'completedAt'>,
): AppState {
  return {
    ...state,
    sessions: [
      { ...input, id: String(Date.now()) + '-' + Math.random().toString(36).slice(2, 7), completedAt: Date.now() },
      ...state.sessions,
    ].slice(0, 60),
  }
}

export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((question) => question.id === id)
}

function priorityScore(
  question: Question,
  state: AppState,
  latestByQuestion: Map<string, AnswerRecord>,
): number {
  const fallacyId = question.correctFallacyId
  const fallacyAnswers = fallacyId ? getFallacyAnswers(state, fallacyId) : []
  const attempts = fallacyAnswers.length
  const accuracy = attempts ? fallacyAnswers.filter((answer) => answer.isCorrect).length / attempts : 0
  const latest = latestByQuestion.get(question.id)

  let score = Math.random() * 0.4
  if (!latest) score += 1.4
  if (latest && !latest.isCorrect) score += 1.8
  if (fallacyId) score += (1 - accuracy) * 1.6
  if (question.difficulty === 'Stretch') score += 0.05
  return score
}

function getCurrentStreak(answers: AnswerRecord[]): number {
  let streak = 0
  for (const answer of answers) {
    if (!answer.isCorrect) break
    streak += 1
  }
  return streak
}

function getBestStreak(answers: AnswerRecord[]): number {
  let best = 0
  let run = 0
  for (const answer of [...answers].reverse()) {
    run = answer.isCorrect ? run + 1 : 0
    best = Math.max(best, run)
  }
  return best
}

function categoriesWithAttempts(state: AppState) {
  return categories.map((category) => {
    const categoryIds = new Set(fallacies.filter((fallacy) => fallacy.category === category).map((fallacy) => fallacy.id))
    const answers = state.answers.filter((answer) => answer.fallacyId && categoryIds.has(answer.fallacyId))
    const correct = answers.filter((answer) => answer.isCorrect).length
    return {
      category,
      attempts: answers.length,
      accuracy: answers.length ? Math.round((correct / answers.length) * 100) : 0,
    }
  })
}

function isPracticeMode(value: unknown): value is PracticeMode {
  return value === 'identify' || value === 'valid' || value === 'scenario' || value === 'speed'
}

function isAnswerMode(value: unknown): value is Exclude<PracticeMode, 'speed'> {
  return value === 'identify' || value === 'valid' || value === 'scenario'
}

function isAnswerRecord(value: unknown): value is AnswerRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<AnswerRecord>
  return typeof record.questionId === 'string'
    && isAnswerMode(record.mode)
    && typeof record.isCorrect === 'boolean'
    && typeof record.answeredAt === 'number'
}

function isSessionRecord(value: unknown): value is SessionRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<SessionRecord>
  return typeof record.id === 'string'
    && isPracticeMode(record.mode)
    && typeof record.correct === 'number'
    && typeof record.total === 'number'
    && typeof record.completedAt === 'number'
}
