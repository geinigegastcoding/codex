import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('een gerecht kan worden gekozen, teruggevonden en weggefilterd', async ({ page }) => {
  await page.goto('/')
  const title = await page.locator('.meal-card h2').textContent()
  expect(title).toBeTruthy()

  await page.getByRole('button', { name: 'Opslaan' }).click()
  await expect(page.locator('.toast')).toContainText(/Opgeslagen · smaakprofiel/)
  await page.reload()
  await expect(page.getByText('1 keer geleerd')).toBeVisible()
  await page.getByRole('button', { name: /Opgeslagen/ }).click()
  await expect(page.getByRole('heading', { name: title! })).toBeVisible()

  await page.getByRole('button', { name: 'Ontdekken', exact: true }).click()
  await page.getByRole('button', { name: 'Controleer live Jumbo-prijs' }).click()
  await expect(page.locator('.deal[href*="jumbo.com"]').first()).toBeVisible()
  await page.getByRole('button', { name: /Filters/ }).click()
  await page.locator('.range-field input').first().fill('3')
  await page.locator('.range-field input').nth(1).fill('300')
  await page.locator('.range-field input').nth(2).fill('60')
  await page.locator('.range-field input').nth(3).fill('15')
  await page.locator('.primary-button').click()
  await expect(page.getByRole('heading', { name: 'Geen hap gevonden' })).toBeVisible()
  await page.getByRole('button', { name: 'Wis filters' }).click()
  await expect(page.locator('.meal-card')).toBeVisible()
})

test('eetvoorkeuren blijven bewaard en sturen de swipe-selectie', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Filters/ }).click()
  await page.getByRole('radio', { name: 'Vegan' }).check()
  await page.getByRole('checkbox', { name: 'Pinda' }).check()
  await page.getByRole('button', { name: 'Snel klaar' }).click()
  await page.getByRole('button', { name: /Toon .* gerechten/ }).click()

  await expect(page.locator('.filter-button span')).toHaveText('3')
  await expect(page.locator('.active-filter-chip', { hasText: 'Vegan' })).toBeVisible()
  await expect(page.locator('.meal-card .diet-card-badge', { hasText: 'Vegan' })).toBeVisible()

  await page.reload()
  await page.getByRole('button', { name: /Filters/ }).click()
  await expect(page.getByRole('radio', { name: 'Vegan' })).toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Pinda' })).toBeChecked()
  await expect(page.getByRole('button', { name: 'Snel klaar' })).toHaveAttribute('aria-pressed', 'true')
})

test('persoonlijke ingrediënten en vetlimiet filteren en blijven lokaal bewaard', async ({ page }) => {
  await page.goto('/')
  const matchCount = async () => {
    const label = await page.locator('.discover-head .eyebrow').textContent()
    return Number(label?.match(/· ([\d.]+) MATCHES/)?.[1].replaceAll('.', ''))
  }
  const before = await matchCount()

  await page.getByRole('button', { name: /Filters/ }).click()
  await page.getByRole('combobox', { name: 'Ingrediënt vermijden' }).fill('Chicken')
  await page.getByRole('button', { name: 'Voeg ingrediëntuitsluiting toe' }).click()
  await page.getByRole('button', { name: /Toon .* gerechten/ }).click()
  expect(await matchCount()).toBeLessThan(before)
  await expect(page.locator('.active-filter-chip', { hasText: 'Zonder ingrediënt Chicken' })).toBeVisible()

  await page.reload()
  await expect(page.locator('.active-filter-chip', { hasText: 'Zonder ingrediënt Chicken' })).toBeVisible()
  await page.getByRole('button', { name: 'Verwijder filter Zonder ingrediënt Chicken' }).click()
  await expect(page.locator('.active-filter-chip', { hasText: 'Zonder ingrediënt Chicken' })).toHaveCount(0)
  expect(await matchCount()).toBe(before)
  await page.getByRole('button', { name: /Filters/ }).click()
  await page.getByRole('slider', { name: 'Maximaal vet' }).fill('20')
  await page.getByRole('button', { name: /Toon .* gerechten/ }).click()
  await expect(page.locator('.active-filter-chip', { hasText: 'Max 20g vet' })).toBeVisible()
  await page.getByRole('button', { name: 'Verwijder filter Max 20g vet' }).click()
  await expect(page.locator('.active-filter-chip', { hasText: 'Max 20g vet' })).toHaveCount(0)
})

test('dieetinformatie toont bewijs, alle ingrediënten en bereiding', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Bekijk details' }).click()
  const dialog = page.getByRole('dialog', { name: /.+/ })

  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Eetprofiel' })).toBeVisible()
  await expect(dialog.getByText(/Allergenen gedetecteerd|Geen van de 14 EU-allergenen gedetecteerd/)).toBeVisible()
  await expect(dialog.getByText(/Controleer altijd het volledige recept/)).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Bereiding' })).toBeVisible()

  const ingredientLabel = await dialog.locator('.ingredient-section .section-title small').textContent()
  const expectedIngredients = Number(ingredientLabel?.match(/\d+/)?.[0])
  expect(await dialog.locator('.ingredient-list > span').count()).toBe(expectedIngredients)
})

test('ongedaan maken herstelt gerecht, smaakmodel en opgeslagen lijst', async ({ page }) => {
  await page.goto('/')
  const title = await page.locator('.meal-card h2').textContent()
  expect(title).toBeTruthy()

  await page.getByRole('button', { name: 'Opslaan' }).click()
  await expect(page.getByText('1 keer geleerd')).toBeVisible()
  await page.getByRole('button', { name: 'Vorige' }).click()

  await expect(page.locator('.meal-card h2')).toHaveText(title!)
  await expect(page.getByText('0 keer geleerd')).toBeVisible()
  await page.getByRole('button', { name: /Opgeslagen/ }).click()
  await expect(page.getByRole('heading', { name: 'Nog niets opgeslagen' })).toBeVisible()
})

test('een opgeslagen kaart opent het juiste volledige recept', async ({ page }) => {
  await page.goto('/')
  const title = await page.locator('.meal-card h2').textContent()
  expect(title).toBeTruthy()
  await page.getByRole('button', { name: 'Opslaan' }).click()
  await page.getByRole('button', { name: /Opgeslagen/ }).click()

  await page.getByRole('button', { name: `Bekijk ${title}` }).click()
  const dialog = page.getByRole('dialog', { name: title! })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Bereiding' })).toBeVisible()
})

test('zoeken en toetsenbordbediening werken zonder typen als swipe te tellen', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Zoeken' }).click()
  const search = page.getByRole('dialog', { name: 'Recept zoeken' })
  const input = search.getByRole('searchbox', { name: 'Zoek gerechten' })
  await input.fill('Moussaka')
  const result = search.locator('.search-result').first()
  const title = await result.locator('strong').textContent()
  expect(title).toBeTruthy()
  await result.click()

  await expect(page.getByRole('dialog', { name: title! })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: title! })).toBeHidden()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByText('1 keer geleerd')).toBeVisible()
  await expect(page.locator('[aria-live="polite"]')).toContainText(/opgeslagen/i)

  await page.getByRole('button', { name: 'Zoeken' }).click()
  await input.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByText('1 keer geleerd')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(search).toBeHidden()
})

test('het profiel is voor iedere gebruiker en geeft toegang tot het eetprofiel', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Mijn smaak' }).click()
  await expect(page.getByRole('heading', { name: 'Hap leert je kennen.' })).toBeVisible()
  await expect(page.getByText('Daniel')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Mijn eetprofiel' })).toBeVisible()
  await page.getByRole('button', { name: 'Pas eetprofiel aan' }).click()
  await expect(page.getByRole('dialog', { name: 'Filters' })).toBeVisible()
})

test('porties aanpassen schaalt ingrediënten en bewaart het recept', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Bekijk details' }).click()
  const dialog = page.getByRole('dialog', { name: /.+/ })
  const firstIngredient = dialog.locator('.ingredient-list > span').first()
  const originalAmount = await firstIngredient.textContent()

  await dialog.getByRole('button', { name: 'Meer porties' }).click()
  await expect(dialog.getByLabel('Aantal porties')).toHaveText('5 porties')
  await expect(firstIngredient).not.toHaveText(originalAmount!)
  await dialog.getByRole('button', { name: 'Voeg 5 porties toe aan boodschappenlijst' }).click()
  await expect(page.locator('.toast')).toContainText(/boodschappenlijst/i)

  const shopping = await page.evaluate(() => JSON.parse(localStorage.getItem('hap:shopping') || '{}'))
  expect(shopping.selections).toHaveLength(1)
  expect(shopping.selections[0].servings).toBe(5)
})

test('boodschappenlijst groepeert, onthoudt en verwijdert recepten', async ({ page }) => {
  await page.goto('/')
  const title = await page.locator('.meal-card h2').textContent()
  expect(title).toBeTruthy()
  await page.getByRole('button', { name: 'Bekijk details' }).click()
  await page.getByRole('button', { name: 'Voeg 4 porties toe aan boodschappenlijst' }).click()
  await page.getByRole('button', { name: 'Sluit details' }).click()
  await page.getByRole('button', { name: /Boodschappen/ }).click()

  await expect(page.getByRole('heading', { name: 'Boodschappenlijst' })).toBeVisible()
  await expect(page.locator('.shopping-recipe-card h2')).toHaveText(title!)
  const items = page.locator('.shopping-item input[type="checkbox"]')
  expect(await items.count()).toBeGreaterThan(0)
  await items.first().check()
  await expect(page.locator('.shopping-progress')).toContainText(/1 van \d+ afgevinkt/)

  await page.reload()
  await page.getByRole('button', { name: /Boodschappen/ }).click()
  await expect(page.locator('.shopping-item input[type="checkbox"]').first()).toBeChecked()
  await page.getByRole('button', { name: `Verwijder ${title} uit boodschappenlijst` }).click()
  await expect(page.getByRole('heading', { name: 'Je boodschappenlijst is leeg' })).toBeVisible()
})

test('handmatige boodschappen en vaste voorraad blijven lokaal bewaard', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: /Boodschappen/ }).click()
  await page.getByRole('textbox', { name: 'Artikel' }).fill('Bananen')
  await page.getByRole('textbox', { name: 'Hoeveelheid' }).fill('6 stuks')
  await page.getByRole('button', { name: 'Voeg handmatig artikel toe' }).click()

  const item = page.locator('.shopping-item', { hasText: 'Bananen' })
  await expect(item).toContainText('6 stuks')
  await item.getByRole('button', { name: 'Markeer Bananen als altijd in huis' }).click()
  await expect(item.getByRole('button', { name: 'Haal Bananen uit vaste voorraad' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: /Open Jumbo-winkelwagen \(0\)/ })).toBeDisabled()

  await page.reload()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: /Boodschappen/ }).click()
  await expect(page.getByRole('button', { name: 'Haal Bananen uit vaste voorraad' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Verwijder handmatig artikel Bananen' }).click()
  await expect(page.getByRole('heading', { name: 'Je boodschappenlijst is leeg' })).toBeVisible()
})

test('een recept wordt in de week gepland en als week aan boodschappen toegevoegd', async ({ page }) => {
  await page.goto('/')
  const title = await page.locator('.meal-card h2').textContent()
  expect(title).toBeTruthy()

  await page.getByRole('button', { name: 'Bekijk details' }).click()
  await page.getByRole('button', { name: 'Plan deze maaltijd' }).click()
  await page.locator('.planner-day-option').first().click()
  await page.getByRole('button', { name: 'Sluit details' }).click()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Weekplanner' }).click()

  await expect(page.getByRole('heading', { name: 'Mijn week' })).toBeVisible()
  await expect(page.locator('.planner-meal-card h3')).toHaveText(title!)
  await page.reload()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Weekplanner' }).click()
  await expect(page.locator('.planner-meal-card h3')).toHaveText(title!)

  await page.getByRole('button', { name: 'Voeg week toe aan boodschappenlijst' }).click()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: /Boodschappen/ }).click()
  await expect(page.locator('.shopping-recipe-card h2')).toHaveText(title!)
})

test('week automatisch vullen respecteert eetfilters en handmatige keuzes', async ({ page }) => {
  await page.goto('/')
  const chosenTitle = await page.locator('.meal-card h2').textContent()
  await page.getByRole('button', { name: 'Bekijk details' }).click()
  await page.getByRole('button', { name: 'Plan deze maaltijd' }).click()
  await page.locator('.planner-day-option').first().click()
  await page.getByRole('button', { name: 'Sluit details' }).click()

  await page.getByRole('button', { name: /Filters/ }).click()
  await page.getByRole('radio', { name: 'Vegan' }).check()
  await page.getByRole('button', { name: /Toon .* gerechten/ }).click()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Weekplanner' }).click()
  await page.getByRole('button', { name: 'Vul lege dagen' }).click()

  const planned = page.locator('.planner-meal-card')
  await expect(planned).toHaveCount(7)
  await expect(planned.locator('h3').first()).toHaveText(chosenTitle!)
  const dietLabels = await planned.locator('small').allTextContents()
  expect(dietLabels.filter((label) => label.startsWith('Vegan'))).toHaveLength(6)
  const titles = await planned.locator('h3').allTextContents()
  expect(new Set(titles).size).toBe(7)
})

test('een gegeten recept wordt expliciet gelogd en blijft in het voedingslog', async ({ page }) => {
  await page.goto('/')
  const title = await page.locator('.meal-card h2').textContent()
  expect(title).toBeTruthy()
  await page.getByRole('button', { name: 'Bekijk details' }).click()
  await page.getByRole('button', { name: 'Log in voedingslog' }).click()
  await page.getByRole('button', { name: 'Log 1 portie in voedingslog' }).click()
  await page.getByRole('button', { name: 'Sluit details' }).click()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Voedingslog' }).click()

  await expect(page.getByRole('heading', { name: 'Voedingslog' })).toBeVisible()
  const entry = page.locator('.tracker-entry', { hasText: title! })
  await expect(entry).toBeVisible()
  await expect(entry).toContainText(/1 portie/)
  await expect(page.locator('.tracker-energy-card')).toContainText(/kcal gebruikt/)

  await page.reload()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Voedingslog' }).click()
  const persistedEntry = page.locator('.tracker-entry', { hasText: title! })
  await expect(persistedEntry).toBeVisible()
  const originalKcal = Number((await persistedEntry.textContent())?.match(/(\d+) kcal/)?.[1])
  await page.getByRole('button', { name: `Bewerk ${title}` }).click()
  const editForm = page.getByRole('form', { name: `Bewerk ${title}` })
  await editForm.getByRole('spinbutton', { name: 'Gegeten porties bewerken' }).fill('.5')
  await editForm.getByRole('button', { name: `Bewaar wijzigingen voor ${title}` }).click()
  await expect(persistedEntry).toContainText('0.5 porties')
  await expect(persistedEntry).toContainText(`${Math.round(originalKcal / 2)} kcal`)
  await page.getByRole('button', { name: `Verwijder ${title} uit voedingslog` }).click()
  await expect(page.getByRole('heading', { name: 'Nog niets gelogd op deze dag' })).toBeVisible()
})

test('voedingsdoelen, handmatige macro’s en zeven dagen historie werken samen', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Voedingslog' }).click()
  await page.getByRole('button', { name: 'Doelen aanpassen' }).click()
  await page.getByRole('spinbutton', { name: 'Dagdoel calorieën' }).fill('1800')
  await page.getByRole('spinbutton', { name: 'Dagdoel eiwit' }).fill('120')
  await page.getByRole('button', { name: 'Bewaar voedingsdoelen' }).click()

  await page.getByRole('textbox', { name: 'Naam maaltijd' }).fill('Havermout met fruit')
  await page.getByRole('spinbutton', { name: 'Calorieën' }).fill('420')
  await page.getByRole('spinbutton', { name: 'Eiwit' }).fill('24')
  await page.getByRole('spinbutton', { name: 'Koolhydraten' }).fill('58')
  await page.getByRole('spinbutton', { name: 'Vet' }).fill('11')
  await page.getByRole('combobox', { name: 'Maaltijdtype' }).selectOption('breakfast')
  await page.getByRole('button', { name: 'Voeg handmatig toe aan voedingslog' }).click()

  await expect(page.locator('.tracker-energy-card')).toContainText('420 kcal gebruikt')
  await expect(page.locator('.tracker-entry', { hasText: 'Havermout met fruit' })).toContainText('24g eiwit')
  await expect(page.locator('.tracker-history-bar')).toHaveCount(7)
  await expect(page.locator('.tracker-goal-summary')).toContainText('1.800 kcal')
  await expect(page.getByRole('progressbar', { name: 'Calorieën' })).toHaveAttribute('aria-valuenow', '420')
  await expect(page.getByRole('progressbar', { name: 'Eiwit' })).toHaveAttribute('aria-valuetext', /24g van 120g/)

  await page.reload()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Voedingslog' }).click()
  await expect(page.locator('.tracker-energy-card')).toContainText('420 kcal gebruikt')
  await expect(page.locator('.tracker-goal-summary')).toContainText('1.800 kcal')
})

test('een geplande week telt niet als gegeten zonder expliciete logactie', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Weekplanner' }).click()
  await page.getByRole('button', { name: 'Vul lege dagen' }).click()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Voedingslog' }).click()

  await expect(page.getByRole('heading', { name: 'Nog niets gelogd op deze dag' })).toBeVisible()
  await expect(page.locator('.tracker-energy-card')).toContainText('0 kcal gebruikt')
})

test('voedingslogregels kunnen worden bewerkt, herhaald en veilig geëxporteerd', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Voedingslog' }).click()
  await page.getByRole('textbox', { name: 'Naam maaltijd' }).fill('Havermout')
  await page.getByRole('spinbutton', { name: 'Calorieën' }).fill('420')
  await page.getByRole('spinbutton', { name: 'Eiwit' }).fill('24')
  await page.getByRole('spinbutton', { name: 'Koolhydraten' }).fill('58')
  await page.getByRole('spinbutton', { name: 'Vet' }).fill('11')
  await page.getByRole('button', { name: 'Voeg handmatig toe aan voedingslog' }).click()

  await page.getByRole('button', { name: 'Bewerk Havermout' }).click()
  const editForm = page.getByRole('form', { name: 'Bewerk Havermout' })
  await editForm.getByRole('textbox', { name: 'Naam bewerken' }).fill('Havermout groot')
  await editForm.getByRole('spinbutton', { name: 'Calorieën bewerken' }).fill('500')
  await editForm.getByRole('button', { name: 'Bewaar wijzigingen voor Havermout' }).click()
  await expect(page.locator('.tracker-entry', { hasText: 'Havermout groot' })).toContainText('500 kcal')
  await expect(page.locator('.tracker-insights')).toContainText('1 gelogde dag')

  await page.reload()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Voedingslog' }).click()
  await expect(page.locator('.tracker-entry', { hasText: 'Havermout groot' })).toContainText('500 kcal')
  await page.getByRole('button', { name: 'Volgende dag' }).click()
  await page.getByRole('button', { name: 'Log Havermout groot opnieuw' }).click()
  await expect(page.locator('.tracker-entry', { hasText: 'Havermout groot' })).toContainText('500 kcal')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exporteer voedingslog als CSV' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/^hap-voedingslog-\d{4}-\d{2}-\d{2}\.csv$/)
  const path = await download.path()
  expect(path).toBeTruthy()
  const contents = await readFile(path!, 'utf8')
  expect(contents).toContain('Datum;Maaltijdtype;Naam;Bron')
  expect(contents.match(/Havermout groot/g)).toHaveLength(2)
})

test('doelbewuste receptsuggesties respecteren filters en tellen pas na loggen mee', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Filters/ }).click()
  await page.getByRole('radio', { name: 'Vegan' }).check()
  await page.getByRole('button', { name: /Toon .* gerechten/ }).click()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Voedingslog' }).click()

  const suggestions = page.locator('.tracker-suggestion-card')
  await expect(suggestions).toHaveCount(3)
  await expect(suggestions.locator('.diet-card-badge')).toHaveText(['Vegan', 'Vegan', 'Vegan'])
  const title = await suggestions.first().locator('h3').textContent()
  expect(title).toBeTruthy()
  await suggestions.first().getByRole('button', { name: `Bekijk passende suggestie ${title}` }).click()
  const dialog = page.getByRole('dialog', { name: title! })
  await dialog.getByRole('button', { name: 'Log in voedingslog' }).click()
  await dialog.getByRole('button', { name: 'Log 1 portie in voedingslog' }).click()
  await dialog.getByRole('button', { name: 'Sluit details' }).click()
  await expect(page.locator('.tracker-entry', { hasText: title! })).toBeVisible()

  await page.getByRole('button', { name: 'Doelen aanpassen' }).click()
  await page.getByRole('spinbutton', { name: 'Dagdoel calorieën' }).fill('1')
  await page.getByRole('button', { name: 'Bewaar voedingsdoelen' }).click()
  await expect(page.getByRole('heading', { name: 'Dagreferentie bereikt' })).toBeVisible()
  await expect(suggestions).toHaveCount(0)
})

test('offline blijven lokale functies zichtbaar en Jumbo-acties worden eerlijk uitgezet', async ({ page, context }) => {
  await page.goto('/')
  await context.setOffline(true)
  await page.evaluate(() => window.dispatchEvent(new Event('offline')))
  await expect(page.locator('.offline-banner')).toContainText('Je werkt offline')

  await page.getByRole('button', { name: 'Bekijk details' }).click()
  const dialog = page.getByRole('dialog', { name: /.+/ })
  await expect(dialog.getByRole('button', { name: 'Jumbo-prijzen vereisen internet' })).toBeDisabled()
  await expect(dialog.getByRole('button', { name: 'Jumbo-winkelwagen vereist internet' })).toBeDisabled()
  await expect(dialog.getByRole('heading', { name: 'Bereiding' })).toBeVisible()
  await context.setOffline(false)
})

test('de browser-installprompt is bereikbaar vanuit het profiel', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    const promptEvent = new Event('beforeinstallprompt') as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
    promptEvent.prompt = async () => { (window as typeof window & { __hapPrompted?: boolean }).__hapPrompted = true }
    promptEvent.userChoice = Promise.resolve({ outcome: 'accepted' })
    window.dispatchEvent(promptEvent)
  })
  await page.locator('.avatar').click()
  await page.getByRole('button', { name: 'Installeer Hap' }).click()
  expect(await page.evaluate(() => (window as typeof window & { __hapPrompted?: boolean }).__hapPrompted)).toBe(true)
})

test('alle lokale data kan worden gedownload en pas na bevestiging hersteld', async ({ page }) => {
  await page.goto('/')
  const title = await page.locator('.meal-card h2').textContent()
  expect(title).toBeTruthy()
  await page.getByRole('button', { name: 'Opslaan' }).click()
  await page.locator('.avatar').click()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download Hap-back-up' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/^hap-backup-\d{4}-\d{2}-\d{2}\.json$/)
  const path = await download.path()
  expect(path).toBeTruthy()
  const contents = await readFile(path!, 'utf8')
  expect(JSON.parse(contents)).toMatchObject({ app: 'Hap', version: 1, data: { saved: [expect.any(String)] } })

  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: /Opgeslagen/ }).click()
  await page.getByRole('button', { name: `Verwijder ${title}` }).click()
  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Mijn smaak' }).click()
  await page.getByLabel('Kies Hap-back-up').setInputFiles({ name: 'hap-backup.json', mimeType: 'application/json', buffer: Buffer.from(contents) })
  await expect(page.locator('.backup-preview')).toContainText('1 opgeslagen recept')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Herstel back-up' }).click()
  await expect(page.locator('.toast')).toContainText('Back-up hersteld')

  await page.getByLabel('Hoofdnavigatie').getByRole('button', { name: /Opgeslagen/ }).click()
  await expect(page.locator('.saved-card h2')).toHaveText(title!)
})

test('modals maken de achtergrond inert en navigatie meldt de actieve pagina', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Hoofdnavigatie').getByRole('button', { name: 'Ontdekken' })).toHaveAttribute('aria-current', 'page')
  await page.getByRole('button', { name: 'Bekijk details' }).click()
  await expect(page.locator('main')).toHaveAttribute('inert', '')
  await expect(page.locator('.sidebar')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Sluit details' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('main')).not.toHaveAttribute('inert', '')
  await expect(page.getByRole('button', { name: 'Bekijk details' })).toBeFocused()
})

test('alle hoofdschermen passen zonder horizontale scroll op 320 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 })
  await page.goto('/')
  for (const name of ['Ontdek', 'Bewaard', 'Week', 'Log', 'Lijst']) {
    await page.getByRole('button', { name: new RegExp(name) }).last().click()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
})
