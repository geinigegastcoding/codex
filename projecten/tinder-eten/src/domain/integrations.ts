export type CartIngredient = { name: string; amount: string }
export type JumboProduct = { product_id: string; name: string; price: number; original_price?: number; quantity?: string; product_url: string; image_url?: string }

const translations: Array<[RegExp, string]> = [
  [/chicken breast|chicken fillet/i, 'kipfilet'], [/chicken thigh/i, 'kipdijfilet'], [/chicken/i, 'kip'],
  [/minced beef|ground beef/i, 'rundergehakt'], [/beef|steak/i, 'rundvlees'], [/pork/i, 'varkensvlees'], [/lamb/i, 'lamsvlees'], [/turkey/i, 'kalkoen'],
  [/salmon/i, 'zalm'], [/tuna/i, 'tonijn'], [/cod|haddock/i, 'kabeljauw'], [/prawns|shrimp/i, 'garnalen'],
  [/rice stick noodles|rice noodles/i, 'rijstnoedels'], [/noodles/i, 'noedels'], [/cooked rice|basmati rice|rice/i, 'rijst'],
  [/spaghetti/i, 'spaghetti'], [/penne/i, 'penne'], [/pasta/i, 'pasta'], [/potatoes|potato/i, 'aardappelen'],
  [/chickpeas/i, 'kikkererwten'], [/lentils/i, 'linzen'], [/kidney beans/i, 'kidneybonen'], [/beans/i, 'bonen'],
  [/greek yogurt|yogh?urt/i, 'Griekse yoghurt'], [/coconut milk/i, 'kokosmelk'], [/double cream|cream/i, 'kookroom'],
  [/parmesan/i, 'Parmezaanse kaas'], [/cheddar/i, 'cheddar'], [/mozzarella/i, 'mozzarella'], [/cheese/i, 'kaas'], [/eggs?|egg/i, 'eieren'],
  [/bell pepper/i, 'paprika'], [/pepper/i, 'peper'], [/spinach/i, 'spinazie'], [/broccoli/i, 'broccoli'], [/cauliflower/i, 'bloemkool'],
  [/courgette|zucchini/i, 'courgette'], [/aubergine|eggplant/i, 'aubergine'], [/mushrooms?/i, 'champignons'], [/carrots?/i, 'wortelen'],
  [/tomato paste|tomato puree/i, 'tomatenpuree'], [/tomatoes|tomato/i, 'tomaten'], [/onions?|shallots?/i, 'uien'], [/garlic/i, 'knoflook'],
  [/sesame seed oil|sesame oil/i, 'sesamolie'], [/olive oil/i, 'olijfolie'], [/vegetable oil|oil/i, 'olie'],
  [/soy sauce/i, 'sojasaus'], [/fish sauce/i, 'vissaus'], [/stock/i, 'bouillon'], [/flour/i, 'bloem'], [/sugar/i, 'suiker'],
]

export function toDutchIngredient(name: string) {
  return translations.find(([pattern]) => pattern.test(name))?.[1] || name.trim()
}

export const buildPriceUrl = (query: string) => `/api/prices?q=${encodeURIComponent(toDutchIngredient(query))}&retailer=jumbo`
export const buildCartPayload = (ingredients: CartIngredient[]) => ({
  shopping_list: ingredients.map(({ name, amount }) => `${amount} ${toDutchIngredient(name)}`.trim()).join('\n'),
  locale: 'nl-NL',
})

export async function fetchJumboPrices(query: string): Promise<JumboProduct[]> {
  const response = await fetch(buildPriceUrl(query))
  if (!response.ok) throw new Error('Jumbo-prijzen zijn tijdelijk niet bereikbaar.')
  const data = await response.json()
  return data.results || []
}

export async function createJumboCart(ingredients: CartIngredient[]) {
  const response = await fetch('https://s.pepesto.com/api/predirect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildCartPayload(ingredients)),
  })
  if (!response.ok) throw new Error('De Jumbo-winkelwagen kon niet worden gemaakt.')
  const data = await response.json() as { redirect_url?: string }
  if (!data.redirect_url) throw new Error('Pepesto gaf geen winkelwagenlink terug.')
  return data.redirect_url
}
