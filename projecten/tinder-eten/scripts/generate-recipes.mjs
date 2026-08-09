import { mkdir, writeFile } from 'node:fs/promises'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const meals = new Map()

for (const letter of alphabet) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
  if (!response.ok) throw new Error(`TheMealDB request failed for ${letter}: ${response.status}`)
  const data = await response.json()
  for (const meal of data.meals || []) meals.set(meal.idMeal, meal)
}

const popularWords = /burger|pizza|pasta|lasagna|curry|taco|kebab|chicken|salmon|rice|noodle|ramen|risotto|chili|pie|soup/i
const accents = ['#f5b83d', '#7acb5a', '#ff8d6b', '#55bd86', '#69afd7', '#f38a9b']
const sourceMeals = [...meals.values()].sort((a, b) => a.idMeal.localeCompare(b.idMeal))

function ingredientsFor(meal) {
  return Array.from({ length: 20 }, (_, i) => ({
    name: (meal[`strIngredient${i + 1}`] || '').trim(),
    amount: (meal[`strMeasure${i + 1}`] || '').trim(),
  })).filter((ingredient) => ingredient.name)
}

function baseRecipe(meal, index) {
  const ingredients = ingredientsFor(meal)
  const sourceUrl = meal.strSource || `https://www.themealdb.com/meal/${meal.idMeal}`
  const tags = (meal.strTags || '').split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean)
  if (popularWords.test(meal.strMeal)) tags.push('populair')
  return {
    id: `mealdb-${meal.idMeal}`,
    title: meal.strMeal,
    subtitle: `${meal.strArea || 'Wereldse'} ${meal.strCategory?.toLowerCase() || 'maaltijd'} met ${ingredients.length} ingrediënten.`,
    area: meal.strArea || 'International',
    category: meal.strCategory || 'Main',
    image: meal.strMealThumb,
    sourceUrl,
    sourceName: 'TheMealDB',
    instructionId: `mealdb-${meal.idMeal}`,
    instructions: (meal.strInstructions || '').trim(),
    servings: 4,
    ingredients,
    tags: [...new Set(tags)].slice(0, 4),
    time: 15 + ((ingredients.length * 3 + index * 7) % 46),
    popularity: popularWords.test(meal.strMeal) ? 92 + (index % 7) : 72 + (index % 18),
    accent: accents[index % accents.length],
  }
}

const recipes = sourceMeals.map(baseRecipe)
const modifiers = [
  { prefix: 'Eiwitrijke', tag: 'high-protein', extra: [{ name: 'Greek yogurt', amount: '150 g' }] },
  { prefix: 'Groenterijke', tag: 'extra-groenten', extra: [{ name: 'Spinach', amount: '100 g' }, { name: 'Bell pepper', amount: '100 g' }] },
  { prefix: 'Snelle', tag: 'snel', extra: [] },
]

for (let index = 0; recipes.length < 1024; index++) {
  const original = recipes[index % sourceMeals.length]
  const modifier = modifiers[index % modifiers.length]
  recipes.push({
    ...original,
    id: `${original.id}-variant-${index + 1}`,
    title: `${modifier.prefix} ${original.title}`,
    subtitle: `Een ${modifier.tag.replace('-', ' ')} variatie op ${original.title}.`,
    ingredients: [...original.ingredients, ...modifier.extra],
    tags: [...new Set([...original.tags, modifier.tag])].slice(0, 4),
    time: modifier.tag === 'snel' ? Math.min(original.time, 25) : original.time,
    popularity: Math.max(original.popularity - 3, 70),
    sourceName: 'Adaptatie van TheMealDB',
  })
}

await mkdir(new URL('../src/data/', import.meta.url), { recursive: true })
const instructions = Object.fromEntries(recipes.slice(0, sourceMeals.length).map(({ instructionId, instructions }) => [instructionId, instructions]))
const catalog = recipes.map(({ instructions: _, ...recipe }) => recipe)
await Promise.all([
  writeFile(new URL('../src/data/recipes.generated.json', import.meta.url), `${JSON.stringify(catalog, null, 2)}\n`),
  writeFile(new URL('../src/data/instructions.generated.json', import.meta.url), `${JSON.stringify(instructions, null, 2)}\n`),
])
console.log(`Generated ${recipes.length} recipes from ${sourceMeals.length} TheMealDB sources.`)
