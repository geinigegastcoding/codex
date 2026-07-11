export type Article = {
  id: string
  source_name: string
  title: string
  description: string | null
  url: string
  published_at: string
  tags: string[]
  is_breaking: boolean
}

export type UserPreference = {
  tag_name: string
  weight: number
}

/**
 * Heuristic scoring formula:
 * S = (W_source) + Sum(W_interest) + PriorityBoost - Decay(t)
 */
export function calculateScore(
  article: Article,
  preferences: UserPreference[],
  currentTimeMs: number = Date.now()
): number {
  let score = 0

  // 1. Source Preference (assuming neutral source is +1.0 as per PRD)
  // In a full implementation, users can adjust source weights. Defaulting to 1.0.
  const sourceWeight = 1.0
  score += sourceWeight

  // 2. Interest Match Weight
  let interestScore = 0
  for (const tag of article.tags) {
    const pref = preferences.find((p) => p.tag_name === tag)
    if (pref) {
      if (pref.weight === -1.0) {
        // Muted tag -> Filter out immediately (we return a very low score)
        return -9999
      }
      interestScore += pref.weight
    }
  }
  score += interestScore

  // 3. Priority Boost
  if (article.is_breaking) {
    score += 8.0
  }

  // 4. Time Decay
  // Decay(t) = lambda * t^1.5 (where t is age in hours, lambda = 0.2)
  const ageMs = currentTimeMs - new Date(article.published_at).getTime()
  const ageHours = Math.max(0, ageMs / (1000 * 60 * 60))
  const decay = 0.2 * Math.pow(ageHours, 1.5)
  
  score -= decay

  return score
}

export function sortArticlesByScore(
  articles: Article[],
  preferences: UserPreference[]
): Article[] {
  const scoredArticles = articles.map((article) => ({
    article,
    score: calculateScore(article, preferences),
  }))

  // Filter out muted articles (score <= -9000)
  const validArticles = scoredArticles.filter((item) => item.score > -9000)

  // Sort descending
  validArticles.sort((a, b) => b.score - a.score)

  return validArticles.map((item) => item.article)
}
