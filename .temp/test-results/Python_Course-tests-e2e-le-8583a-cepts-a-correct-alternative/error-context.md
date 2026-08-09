# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Python_Course\tests\e2e\lesson-checker.spec.ts >> Python checker gives guided feedback and accepts a correct alternative
- Location: Python_Course\tests\e2e\lesson-checker.spec.ts:3:1

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/#/lesson/truthiness-slices", waiting until "load"

```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test'
  2  | 
  3  | test('Python checker gives guided feedback and accepts a correct alternative', async ({ page }) => {
  4  |   test.setTimeout(120_000)
  5  |   const consoleErrors: string[] = []
  6  |   page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  7  |   page.on('pageerror', (error) => consoleErrors.push(error.message))
> 8  |   await page.goto('/#/lesson/truthiness-slices')
     |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  9  |   await expect(page.getByText('Python ready')).toBeVisible({ timeout: 90_000 })
  10 |   expect(consoleErrors).toEqual([])
  11 |   const editor = page.getByLabel('Python solution')
  12 |   await editor.fill('def count_truthy(values):\n    return 99')
  13 |   await page.getByRole('button', { name: 'Run checks' }).click()
  14 |   await expect(page.getByText('One more case needs work')).toBeVisible({ timeout: 15_000 })
  15 |   await expect(page.getByText(/Which assumption/)).toBeVisible()
  16 |   await editor.fill('def count_truthy(values):\n    count = 0\n    for item in values:\n        if item:\n            count += 1\n    return count')
  17 |   await page.getByRole('button', { name: 'Run checks' }).click()
  18 |   await expect(page.getByText('All checks passed')).toBeVisible({ timeout: 15_000 })
  19 |   await page.reload()
  20 |   await expect(editor).toContainText('return count')
  21 | })
  22 | 
```