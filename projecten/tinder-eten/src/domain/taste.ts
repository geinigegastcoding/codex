export type TasteMeal = { id: string; area: string; category: string; tags: string[]; protein: number; time: number }
export type TasteProfile = { interactions: number; weights: Record<string, number> }

export const createTasteProfile = (): TasteProfile => ({ interactions: 0, weights: {} })

const features = (meal: TasteMeal) => [
  `area:${meal.area}`,
  `category:${meal.category}`,
  ...meal.tags.map((tag) => `tag:${tag}`),
  `protein:${meal.protein >= 30 ? 'high' : meal.protein >= 15 ? 'medium' : 'low'}`,
  `time:${meal.time <= 25 ? 'fast' : meal.time <= 45 ? 'medium' : 'slow'}`,
]

export function updateTasteProfile(profile: TasteProfile, meal: TasteMeal, action: 'like' | 'skip'): TasteProfile {
  const interactions = profile.interactions + 1
  const delta = (action === 'like' ? 1 : -.45) * (.8 / Math.sqrt(interactions))
  const weights = { ...profile.weights }
  for (const feature of features(meal)) weights[feature] = (weights[feature] || 0) + delta
  return { interactions, weights }
}

function stableNoise(id: string, interactions: number) {
  let hash = interactions + 17
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) | 0
  return ((Math.abs(hash) % 1000) / 1000) * Math.max(.35 - interactions * .008, .05)
}

export function tasteScore(meal: TasteMeal, profile: TasteProfile) {
  return features(meal).reduce((score, feature) => score + (profile.weights[feature] || 0), 0) + stableNoise(meal.id, profile.interactions)
}

export function rankMeals<T extends TasteMeal>(meals: T[], profile: TasteProfile): T[] {
  return [...meals].sort((a, b) => tasteScore(b, profile) - tasteScore(a, profile))
}
