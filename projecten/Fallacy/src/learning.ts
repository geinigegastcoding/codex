import { fallacies, questions, type Category, type Difficulty, type Question } from './data'

export const STORAGE_KEY = 'fallacy-lab-state-v1'

export type Mastery = 'Nieuw' | 'Aan het leren' | 'Redelijk' | 'Beheerst'
export type DifficultyFilter = Difficulty | 'all'
export type QuestionSource = 'all' | 'learned' | 'errors'

export interface PracticeSettings {
  questionCount: 5 | 10 | 20
  difficulty: DifficultyFilter
  source: QuestionSource
  category: Category | 'all'
}

export interface AnswerRecord {
  questionId: string
  fallacyId: string | null
  selectedFallacyId: string | null
  classification: 'fallacy' | 'none'
  isCorrect: boolean
  answeredAt: number
  nextReviewAt: number
  reviewStage: number
}

export interface AppState {
  answers: AnswerRecord[]
  bookmarkedIds: string[]
  learnedIds: string[]
  settings: PracticeSettings
}

export const defaultSettings: PracticeSettings = {
  questionCount: 5,
  difficulty: 'all',
  source: 'all',
  category: 'all',
}

export function createDefaultState(): AppState {
  return {
    answers: [],
    bookmarkedIds: [],
    learnedIds: [],
    settings: { ...defaultSettings },
  }
}

export function loadState(): AppState {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return createDefaultState()

  try {
    const parsed = JSON.parse(stored) as Partial<AppState>
    return {
      answers: Array.isArray(parsed.answers) ? (parsed.answers as AnswerRecord[]) : [],
      bookmarkedIds: Array.isArray(parsed.bookmarkedIds) ? parsed.bookmarkedIds : [],
      learnedIds: Array.isArray(parsed.learnedIds) ? parsed.learnedIds : [],
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
    }
  } catch {
    console.warn('Fallacy Lab kon de lokale voortgang niet lezen en start opnieuw.')
    return createDefaultState()
  }
}

export function getLatestAnswers(state: AppState): Map<string, AnswerRecord> {
  const latest = new Map<string, AnswerRecord>()
  for (const answer of state.answers) {
    if (!latest.has(answer.questionId)) latest.set(answer.questionId, answer)
  }
  return latest
}

export function getFallacyAnswers(state: AppState, fallacyId: string): AnswerRecord[] {
  return state.answers.filter((answer) => answer.fallacyId === fallacyId)
}

export function getMastery(state: AppState, fallacyId: string): Mastery {
  const answers = getFallacyAnswers(state, fallacyId)
  if (answers.length === 0) return 'Nieuw'

  const accuracy = answers.filter((answer) => answer.isCorrect).length / answers.length
  if (answers.length >= 6 && accuracy >= 0.85) return 'Beheerst'
  if (answers.length >= 4 && accuracy >= 0.7) return 'Redelijk'
  return 'Aan het leren'
}

export function isLearned(state: AppState, fallacyId: string): boolean {
  return state.learnedIds.includes(fallacyId) || getMastery(state, fallacyId) !== 'Nieuw'
}

export function getOverallStats(state: AppState) {
  const totalAnswered = state.answers.length
  const correct = state.answers.filter((answer) => answer.isCorrect).length
  const mastered = fallacies.filter((fallacy) => getMastery(state, fallacy.id) === 'Beheerst').length
  const learning = fallacies.filter((fallacy) => getMastery(state, fallacy.id) === 'Aan het leren').length
  const redelijk = fallacies.filter((fallacy) => getMastery(state, fallacy.id) === 'Redelijk').length

  return {
    totalAnswered,
    correct,
    accuracy: totalAnswered ? Math.round((correct / totalAnswered) * 100) : 0,
    mastered,
    learning,
    redelijk,
    learned: fallacies.filter((fallacy) => isLearned(state, fallacy.id)).length,
  }
}

export function getWeakestFallacies(state: AppState) {
  return fallacies
    .map((fallacy) => {
      const answers = getFallacyAnswers(state, fallacy.id)
      const correct = answers.filter((answer) => answer.isCorrect).length
      return {
        fallacy,
        attempts: answers.length,
        accuracy: answers.length ? Math.round((correct / answers.length) * 100) : null,
        mastery: getMastery(state, fallacy.id),
      }
    })
    .filter((item) => item.attempts > 0)
    .sort((a, b) => {
      if (a.accuracy !== b.accuracy) return (a.accuracy ?? 0) - (b.accuracy ?? 0)
      return b.attempts - a.attempts
    })
}

export function getCategoryStats(state: AppState) {
  return [...new Set(fallacies.map((fallacy) => fallacy.category))].map((category) => {
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

export function recordAnswer(
  state: AppState,
  input: Omit<AnswerRecord, 'answeredAt' | 'nextReviewAt' | 'reviewStage'>,
): AppState {
  const previous = getLatestAnswers(state).get(input.questionId)
  const reviewStage = input.isCorrect ? Math.min((previous?.reviewStage ?? 0) + 1, 3) : 0
  const reviewDelay = input.isCorrect ? [24, 72, 168][reviewStage - 1] ?? 168 : 0
  const record: AnswerRecord = {
    ...input,
    answeredAt: Date.now(),
    nextReviewAt: Date.now() + reviewDelay * 60 * 60 * 1000,
    reviewStage,
  }

  return {
    ...state,
    answers: [record, ...state.answers].slice(0, 500),
  }
}

export function buildQuestionQueue(state: AppState, settings: PracticeSettings): Question[] {
  const latest = getLatestAnswers(state)
  const filtered = questions.filter((question) => {
    if (settings.difficulty !== 'all' && question.difficulty !== settings.difficulty) return false
    if (settings.category !== 'all' && question.category !== settings.category) return false
    if (settings.source === 'errors') return latest.get(question.id)?.isCorrect === false
    if (settings.source === 'learned') return Boolean(question.correctFallacyId && isLearned(state, question.correctFallacyId))
    return true
  })

  if (filtered.length === 0) return []

  const now = Date.now()
  const dueErrors = filtered.filter((question) => {
    const answer = latest.get(question.id)
    return answer && !answer.isCorrect
  })
  const dueReviews = filtered.filter((question) => {
    const answer = latest.get(question.id)
    return answer && answer.isCorrect && answer.nextReviewAt <= now
  })
  const unseen = filtered.filter((question) => !latest.has(question.id))
  const remainder = filtered.filter((question) => !dueErrors.includes(question) && !dueReviews.includes(question) && !unseen.includes(question))

  return [...shuffle(dueErrors), ...shuffle(dueReviews), ...shuffle(unseen), ...shuffle(remainder)].slice(0, settings.questionCount)
}

export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((question) => question.id === id)
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}
