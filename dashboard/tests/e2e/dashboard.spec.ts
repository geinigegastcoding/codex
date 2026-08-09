import { expect, test } from '@playwright/test'

test.beforeEach(async ({ request }) => {
  await request.put('/api/crm', { data: { leads: [] } })
})

test('overview makes real-data boundaries visible without demo metrics', async ({ page }) => {
  await page.goto('/#/overview')
  await expect(page.getByRole('heading', { level: 1, name: 'Business command center' })).toBeVisible()
  await expect(page.getByText('Not connected', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Sample', { exact: true })).toHaveCount(0)
  await expect(page.locator('body')).not.toContainText('Studio Kanaal')
})

test('CRM can create and persist a real lead record', async ({ page }) => {
  await page.goto('/#/crm')
  await page.getByRole('button', { name: 'Add lead' }).click()
  await page.getByLabel('Company').fill('Test Company')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByRole('button', { name: 'Save lead' }).click()
  await expect(page.getByText('Test Company', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Test Company', { exact: true })).toBeVisible()
})

test('mobile layout has no horizontal overflow', async ({ page }) => {
  await page.goto('/#/overview')
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  await page.screenshot({ path: 'screenshots/overview-mobile.png', fullPage: true })
})

test('active navigation follows each route', async ({ page }) => {
  for (const route of ['/overview', '/analytics', '/crm', '/tasks', '/integrations']) {
    await page.goto(`/#${route}`)
    await expect(page.locator('.nav-item.is-active')).toHaveAttribute('href', `#${route}`)
    await expect(page.locator('.nav-item.is-active')).toHaveCSS('background-color', 'rgb(233, 237, 255)')
  }
})
