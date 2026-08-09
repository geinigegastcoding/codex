export type WeightedIngredient = { name: string; grams: number }

type Nutrients = { kcal: number; protein: number; carbs: number; fat: number }

const foods: Array<[string[], Nutrients]> = [
  [['chicken breast', 'chicken breasts', 'kipfilet'], { kcal: 165, protein: 31, carbs: 0, fat: 3.6 }],
  [['chicken', 'kip', 'turkey', 'kalkoen'], { kcal: 170, protein: 28, carbs: 0, fat: 6 }],
  [['beef', 'steak', 'minced beef', 'gehakt', 'rund'], { kcal: 250, protein: 26, carbs: 0, fat: 17 }],
  [['pork', 'ham', 'bacon', 'varken', 'spek'], { kcal: 242, protein: 27, carbs: 0, fat: 14 }],
  [['lamb', 'lam'], { kcal: 258, protein: 25, carbs: 0, fat: 17 }],
  [['salmon', 'zalm'], { kcal: 208, protein: 20, carbs: 0, fat: 13 }],
  [['tuna', 'tonijn'], { kcal: 132, protein: 29, carbs: 0, fat: 1 }],
  [['cod', 'haddock', 'white fish', 'kabeljauw', 'vis'], { kcal: 105, protein: 23, carbs: 0, fat: 1 }],
  [['prawn', 'shrimp', 'garnalen'], { kcal: 99, protein: 24, carbs: .2, fat: .3 }],
  [['egg', 'eggs', 'ei', 'eieren'], { kcal: 143, protein: 13, carbs: .7, fat: 9.5 }],
  [['tofu'], { kcal: 144, protein: 17, carbs: 3, fat: 9 }],
  [['lentil', 'lentils', 'linzen'], { kcal: 116, protein: 9, carbs: 20, fat: .4 }],
  [['chickpea', 'chickpeas', 'kikkererwten'], { kcal: 164, protein: 9, carbs: 27, fat: 2.6 }],
  [['beans', 'bean', 'kidney beans', 'black beans', 'bonen'], { kcal: 127, protein: 8.7, carbs: 23, fat: .5 }],
  [['cooked rice', 'rice', 'rijst'], { kcal: 130, protein: 2.7, carbs: 28, fat: .3 }],
  [['pasta', 'spaghetti', 'penne', 'noodles', 'macaroni'], { kcal: 158, protein: 5.8, carbs: 31, fat: .9 }],
  [['potato', 'potatoes', 'aardappel', 'fries'], { kcal: 87, protein: 1.9, carbs: 20, fat: .1 }],
  [['bread', 'bun', 'rolls', 'tortilla', 'wrap', 'naan'], { kcal: 265, protein: 9, carbs: 49, fat: 3.2 }],
  [['flour', 'bloem'], { kcal: 364, protein: 10, carbs: 76, fat: 1 }],
  [['oats', 'oatmeal', 'havermout'], { kcal: 379, protein: 13, carbs: 68, fat: 6.5 }],
  [['quinoa', 'couscous'], { kcal: 120, protein: 4.3, carbs: 21, fat: 1.9 }],
  [['olive oil', 'vegetable oil', 'oil', 'olie'], { kcal: 884, protein: 0, carbs: 0, fat: 100 }],
  [['butter', 'boter'], { kcal: 717, protein: .9, carbs: .1, fat: 81 }],
  [['cream', 'creme fraiche', 'double cream', 'room'], { kcal: 340, protein: 2.1, carbs: 2.8, fat: 36 }],
  [['greek yogurt', 'yoghurt', 'yogurt'], { kcal: 97, protein: 9, carbs: 3.9, fat: 5 }],
  [['milk', 'melk'], { kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3 }],
  [['cheese', 'cheddar', 'parmesan', 'feta', 'mozzarella', 'kaas'], { kcal: 350, protein: 23, carbs: 3, fat: 27 }],
  [['coconut milk', 'kokosmelk'], { kcal: 197, protein: 2, carbs: 3, fat: 20 }],
  [['avocado'], { kcal: 160, protein: 2, carbs: 8.5, fat: 15 }],
  [['peanut', 'almond', 'cashew', 'nuts', 'walnut', 'noten'], { kcal: 590, protein: 21, carbs: 20, fat: 50 }],
  [['tomato paste', 'tomato puree'], { kcal: 82, protein: 4.3, carbs: 19, fat: .5 }],
  [['tomato', 'tomatoes', 'tomaat'], { kcal: 18, protein: .9, carbs: 3.9, fat: .2 }],
  [['onion', 'onions', 'shallot', 'ui'], { kcal: 40, protein: 1.1, carbs: 9.3, fat: .1 }],
  [['garlic', 'knoflook'], { kcal: 149, protein: 6.4, carbs: 33, fat: .5 }],
  [['spinach', 'spinazie'], { kcal: 23, protein: 2.9, carbs: 3.6, fat: .4 }],
  [['broccoli', 'cauliflower', 'bloemkool'], { kcal: 34, protein: 2.8, carbs: 7, fat: .4 }],
  [['carrot', 'wortel'], { kcal: 41, protein: .9, carbs: 10, fat: .2 }],
  [['pepper', 'bell pepper', 'paprika', 'chilli'], { kcal: 31, protein: 1, carbs: 6, fat: .3 }],
  [['mushroom', 'champignon'], { kcal: 22, protein: 3.1, carbs: 3.3, fat: .3 }],
  [['courgette', 'zucchini', 'aubergine', 'eggplant'], { kcal: 22, protein: 1, carbs: 4, fat: .2 }],
  [['cabbage', 'lettuce', 'cucumber', 'sla', 'komkommer'], { kcal: 18, protein: 1, carbs: 3.5, fat: .2 }],
  [['peas', 'sweetcorn', 'corn', 'erwten', 'mais'], { kcal: 82, protein: 4.5, carbs: 15, fat: .8 }],
  [['apple', 'pear', 'orange', 'banana', 'mango', 'fruit'], { kcal: 70, protein: .7, carbs: 18, fat: .3 }],
  [['sugar', 'honey', 'syrup', 'suiker', 'honing'], { kcal: 387, protein: 0, carbs: 100, fat: 0 }],
  [['chocolate', 'cocoa', 'chocolade'], { kcal: 500, protein: 6, carbs: 58, fat: 30 }],
  [['stock', 'water', 'vinegar', 'soy sauce', 'fish sauce', 'bouillon'], { kcal: 12, protein: 1, carbs: 2, fat: 0 }],
  [['herb', 'spice', 'salt', 'pepper', 'parsley', 'basil', 'coriander', 'cumin', 'paprika'], { kcal: 25, protein: 1, carbs: 4, fat: .5 }],
]

const fallback: Nutrients = { kcal: 90, protein: 3, carbs: 12, fat: 3.5 }
const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

function findFood(name: string) {
  const normalized = clean(name)
  const exact = foods.find(([aliases]) => aliases.some((alias) => normalized === alias))
  if (exact) return { nutrition: exact[1], confidence: 1 }
  const partial = foods.find(([aliases]) => aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized)))
  return partial ? { nutrition: partial[1], confidence: .8 } : { nutrition: fallback, confidence: .35 }
}

export function calculateNutrition(ingredients: WeightedIngredient[]) {
  const total = ingredients.reduce((sum, ingredient) => {
    const { nutrition, confidence } = findFood(ingredient.name)
    const factor = Math.max(ingredient.grams, 0) / 100
    sum.kcal += nutrition.kcal * factor
    sum.protein += nutrition.protein * factor
    sum.carbs += nutrition.carbs * factor
    sum.fat += nutrition.fat * factor
    sum.grams += Math.max(ingredient.grams, 0)
    sum.covered += Math.max(ingredient.grams, 0) * confidence
    return sum
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, grams: 0, covered: 0 })

  return {
    kcal: Math.round(total.kcal),
    protein: Math.round(total.protein),
    carbs: Math.round(total.carbs),
    fat: Math.round(total.fat),
    grams: Math.round(total.grams),
    coverage: total.grams ? Math.round((total.covered / total.grams) * 100) : 0,
  }
}

const unicodeFractions: Record<string, string> = {
  '¼': ' 1/4', '½': ' 1/2', '¾': ' 3/4', '⅓': ' 1/3', '⅔': ' 2/3',
  '⅛': ' 1/8', '⅜': ' 3/8', '⅝': ' 5/8', '⅞': ' 7/8',
}

const normalizeMeasure = (measure: string) => Object.entries(unicodeFractions)
  .reduce((value, [fraction, replacement]) => value.replaceAll(fraction, replacement), measure)
  .replace(',', '.')

export function estimateGrams(measure: string, ingredient: string) {
  const normalizedMeasure = normalizeMeasure(measure)
  const metric = normalizedMeasure.match(/(\d+(?:\.\d+)?)\s*(kg|g|ml|l)\b/i)
  if (metric) return Math.round(Number(metric[1]) * (/^(kg|l)$/i.test(metric[2]) ? 1000 : 1))

  const value = clean(normalizedMeasure).replace(/(\d)\s+(\d)/, '$1.$2')
  const mixed = normalizedMeasure.match(/(\d+)\s+(\d+)\/(\d+)/)
  const fraction = normalizedMeasure.match(/(\d+)\/(\d+)/)
  const numeric = mixed ? Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]) : fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(value.match(/[\d.]+/)?.[0] || 1)
  if (/\b(oz|ounce)/.test(value)) return Math.round(numeric * 28.35)
  if (/\b(lb|pound)/.test(value)) return Math.round(numeric * 453.6)
  if (/\b(tbs|tbsp|tablespoon)/.test(value)) return Math.round(numeric * 15)
  if (/\b(tsp|teaspoon)/.test(value)) return Math.round(numeric * 5)
  if (/\bcup/.test(value)) return Math.round(numeric * (/flour|sugar|rice|pasta/i.test(ingredient) ? 150 : 220))
  if (/\b(clove)/.test(value)) return Math.round(numeric * 4)
  if (/\b(can|tin)/.test(value)) return Math.round(numeric * 400)
  if (/\b(slice)/.test(value)) return Math.round(numeric * 30)
  if (/\b(bunch|handful)/.test(value)) return Math.round(numeric * 40)
  if (/egg/i.test(ingredient)) return Math.round(numeric * 50)
  if (/onion|tomato|pepper|potato|apple|banana/i.test(ingredient)) return Math.round(numeric * 120)
  return Math.round(numeric * 30)
}
