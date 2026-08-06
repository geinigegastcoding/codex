import { expect, test } from '@playwright/test'

const routes = [
  ['/today', 'Ready for your next Python challenge?'],
  ['/course', 'Course map'],
  ['/certifications', 'Certification readiness'],
  ['/practice', 'Practice queue'],
  ['/projects', 'Project laboratory'],
  ['/progress', 'Your progress'],
  ['/resources', 'Learning resources'],
  ['/settings', 'Course settings'],
] as const

for (const [route, heading] of routes) {
  test(`${route} renders and survives reload`, async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    await page.goto(`/#${route}`)
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    await expect(page.locator('.sidebar nav a[aria-current="page"]')).toHaveCount(1)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    expect(consoleErrors).toEqual([])
  })
}

test('lesson completion and settings persist after reload', async ({ page }) => {
  await page.goto('/#/lesson/trace-values')
  await page.getByRole('button', { name: 'Record lesson evidence' }).click()
  await expect(page.getByRole('button', { name: 'Lesson completed' })).toBeDisabled()
  await page.goto('/#/settings')
  await page.getByRole('button', { name: 'Mon' }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Mon' })).toHaveAttribute('aria-pressed', 'true')
  await page.goto('/#/lesson/trace-values')
  await expect(page.getByRole('button', { name: 'Lesson completed' })).toBeDisabled()
})

test('project workspace and certification goals persist', async ({ page }) => {
  await page.goto('/#/projects/word-insight')
  await expect(page.getByRole('heading', { level: 1, name: 'Word Insight Analyzer' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Complete prerequisites first' })).toBeDisabled()
  await page.goto('/#/certifications')
  const pcep = page.locator('.certification-card').filter({ hasText: 'PCEP – Certified Entry-Level Python Programmer' })
  await pcep.getByRole('button', { name: 'Set as goal' }).click()
  await page.reload()
  await expect(pcep.getByRole('button', { name: 'Remove goal' })).toBeVisible()
})

test('course contains every planned stage and personalized placement', async ({ page }) => {
  await page.goto('/#/course')
  await expect(page.locator('.stage-card')).toHaveCount(12)
  await page.goto('/#/today')
  await expect(page.getByRole('heading', { name: 'Foundation Refresh — accelerated path' })).toBeVisible()
})

const screenshotRoutes = [
  { name: 'today', route: '/today', heading: 'Ready for your next Python challenge?' },
  { name: 'course-map', route: '/course', heading: 'Course map' },
  { name: 'lesson', route: '/lesson/truthiness-slices', heading: 'Truthiness and slices' },
  { name: 'progress', route: '/progress', heading: 'Your progress' },
  { name: 'projects', route: '/projects', heading: 'Project laboratory' },
  { name: 'project-workspace', route: '/projects/word-insight', heading: 'Word Insight Analyzer' },
  { name: 'certifications', route: '/certifications', heading: 'Certification readiness' },
  { name: 'assessment', route: '/assessment/boss-m0-exam', heading: 'Exam literacy and precise tracing boss assessment' },
  { name: 'settings', route: '/settings', heading: 'Course settings' },
] as const

for (const viewport of [
  { name: 'narrow', width: 320, height: 700 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`${viewport.name} layouts have no page overflow`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    for (const screenshotRoute of screenshotRoutes) {
      await page.goto(`/#${screenshotRoute.route}`)
      await expect(page.getByRole('heading', { level: 1, name: screenshotRoute.heading })).toBeVisible()
      if (screenshotRoute.name === 'lesson') await expect(page.getByText('Python ready')).toBeVisible({ timeout: 90_000 })
      const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }))
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
      await page.screenshot({ path: `screenshots/${screenshotRoute.name}-${viewport.name}.png`, fullPage: true })
    }
  })
}
