import { calculateNutrition, estimateGrams } from './nutrition'
import { classifyDiet, type DietInfo } from './diet'

export type RawRecipe = {
  id: string
  title: string
  subtitle: string
  area: string
  category: string
  image: string
  sourceUrl: string
  sourceName: string
  instructionId?: string
  servings?: number
  ingredients: Array<{ name: string; amount: string }>
  tags: string[]
  time: number
  popularity: number
  accent: string
}

export type Meal = Omit<RawRecipe, 'ingredients' | 'servings'> & DietInfo & {
  servings: number
  ingredients: Array<{ name: string; amount: string; grams: number; totalGrams: number }>
  kcal: number
  protein: number
  carbs: number
  fat: number
  grams: number
  nutritionCoverage: number
  estimatedPrice: number
  score: number
}

export function buildMeal(recipe: RawRecipe): Meal {
  const servings = recipe.servings || 1
  const ingredients = recipe.ingredients.map((ingredient) => {
    const totalGrams = estimateGrams(ingredient.amount, ingredient.name)
    return { ...ingredient, totalGrams, grams: Math.max(Math.round(totalGrams / servings), 1) }
  })
  const nutrition = calculateNutrition(ingredients)
  const diet = classifyDiet(recipe.category, ingredients)
  const tags = recipe.tags.filter((tag) => tag !== 'high-protein')
  if (nutrition.kcal > 0 && nutrition.protein * 4 / nutrition.kcal >= .2) tags.unshift('high-protein')
  if (recipe.time <= 25 && !tags.includes('snel')) tags.push('snel')
  return {
    ...recipe,
    ...diet,
    servings,
    ingredients,
    tags: [...new Set(tags)].slice(0, 4),
    kcal: nutrition.kcal,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,
    grams: nutrition.grams,
    nutritionCoverage: nutrition.coverage,
    estimatedPrice: Math.round((1.6 + nutrition.protein * .065 + ingredients.length * .16) * 100) / 100,
    score: recipe.popularity,
  }
}

export const buildCatalog = (recipes: RawRecipe[]) => recipes.map(buildMeal)
