import { expect, test } from '@playwright/test'

const routes = [
  ['/today', 'Goedemorgen, Daniël.'],
  ['/inbox', 'Inbox'],
  ['/projects', 'Projecten'],
  ['/decisions', 'Besluiten'],
  ['/review', 'Founder review'],
  ['/sales', 'Sales demo'],
  ['/website', 'Website demo'],
] as const

for (const [route, heading] of routes) {
  test(`${route} renders as a distinct page`, async ({ page }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    page.on('pageerror', (error) => pageErrors.push(error.message))
    await page.goto(`/#${route}`)
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    const active = page.locator('.sidebar nav a[aria-current="page"]')
    await expect(active).toHaveCount(1)
    await expect(active).toHaveAttribute('href', `#${route}`)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    expect(consoleErrors).toEqual([])
    expect(pageErrors).toEqual([])
  })
}

test('personal workspace persists priorities, inbox, decisions, and review', async ({ page }) => {
  await page.goto('/#/today')
  const priorities = page.locator('.priority-item')
  await expect(priorities).toHaveCount(3)
  await priorities.first().getByRole('button', { name: /Verwijder/ }).click()
  await page.getByLabel('Nieuwe prioriteit').fill('Bevestig de outreachboodschap')
  await page.getByRole('button', { name: 'Toevoegen' }).click()
  await expect(page.getByText('Bevestig de outreachboodschap', { exact: true })).toBeVisible()
  await page.getByLabel(/Voltooi Bevestig de outreachboodschap/).click()

  await page.getByLabel('Nieuwe inboxnotitie').fill('Controleer demo voor outreach')
  await page.getByRole('button', { name: 'Vastleggen' }).click()
  await page.goto('/#/inbox')
  await expect(page.getByText('Controleer demo voor outreach', { exact: true })).toBeVisible()

  await page.goto('/#/decisions')
  const firstDecision = page.locator('.decision-card').first()
  await firstDecision.getByLabel('Beslisnotitie').fill('Website wordt na broncontrole gekozen.')
  await firstDecision.getByLabel('Status').selectOption('deferred')

  await page.goto('/#/review')
  await page.getByLabel('Jouw antwoord').fill('De outreachboodschap moet reacties opleveren of worden geschrapt.')
  await page.getByText('Bevestig de primaire commerciële doelstelling.', { exact: true }).click()
  await page.reload()
  await expect(page.getByLabel('Jouw antwoord')).toHaveValue('De outreachboodschap moet reacties opleveren of worden geschrapt.')

  await page.goto('/#/today')
  await expect(page.getByText('Bevestig de outreachboodschap', { exact: true })).toBeVisible()
  await page.goto('/#/inbox')
  await expect(page.getByText('Controleer demo voor outreach', { exact: true })).toBeVisible()
  await page.goto('/#/decisions')
  await page.getByRole('button', { name: 'Uitgesteld' }).click()
  await expect(page.getByLabel('Beslisnotitie').first()).toHaveValue('Website wordt na broncontrole gekozen.')
})

test('command palette navigates and captures', async ({ page }) => {
  await page.goto('/#/today')
  await page.keyboard.press('Control+K')
  await expect(page.getByRole('dialog', { name: 'Ga naar of leg iets vast' })).toBeVisible()
  await page.getByPlaceholder('Zoek pagina of workflow…').fill('Projecten')
  await page.getByRole('button', { name: /Projecten Actief werk/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Projecten' })).toBeVisible()
  await page.keyboard.press('Control+K')
  await page.getByPlaceholder('Nieuwe taak, gedachte of follow-up…').fill('Nieuwe command capture')
  await page.getByRole('button', { name: 'Vastleggen' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Inbox' })).toBeVisible()
  await expect(page.getByText('Nieuwe command capture', { exact: true })).toBeVisible()
})

for (const viewport of [
  { name: 'narrow', width: 320, height: 700 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`${viewport.name} navigation has no icon overlap`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/#/today')
    const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)

    if (viewport.width <= 1250) await expect(page.locator('.brand-copy')).toBeHidden()
    const brand = await page.locator('.brand-mark').boundingBox()
    const firstNav = await page.locator('.sidebar nav a').first().boundingBox()
    expect(brand).not.toBeNull()
    expect(firstNav).not.toBeNull()
    const overlap = brand && firstNav && brand.x < firstNav.x + firstNav.width && brand.x + brand.width > firstNav.x && brand.y < firstNav.y + firstNav.height && brand.y + brand.height > firstNav.y
    expect(overlap).toBeFalsy()

    await page.getByRole('link', { name: 'Projecten' }).click()
    await expect(page.locator('.sidebar nav a[aria-current="page"]')).toHaveText('Projecten')
    await page.screenshot({ path: `screenshots/routes-${viewport.name}.png`, fullPage: true })
  })
}

test('analytics routes retain controls and disclosures', async ({ page }) => {
  await page.goto('/#/sales')
  await expect(page.getByText('Geen live CRM', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '7 dagen' }).click()
  const acquisition = page.locator('article.chart-card', { hasText: 'ACQUISITION PULSE' })
  await acquisition.getByRole('button', { name: 'Tabel' }).click()
  await expect(acquisition.locator('caption')).toBeVisible()

  await page.goto('/#/website')
  await expect(page.getByText('Onbekend / te bevestigen', { exact: true })).toBeVisible()
  await expect(page.getByText('Illustratieve demo · niet live gekoppeld', { exact: true })).toBeVisible()
})
