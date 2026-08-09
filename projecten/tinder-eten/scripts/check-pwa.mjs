import { spawn } from 'node:child_process'
import { chromium } from 'playwright'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const port = 4192
const baseUrl = `http://127.0.0.1:${port}`
const server = spawn(process.execPath, [join(root, 'server.mjs')], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' })

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(baseUrl)).ok) return } catch { /* production server is still starting */ }
    await new Promise((resolveWait) => setTimeout(resolveWait, 100))
  }
  throw new Error(`Production server did not start at ${baseUrl}`)
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(baseUrl)
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
  await page.locator('.app-shell').waitFor()

  await context.setOffline(true)
  await page.reload()
  await page.locator('.app-shell').waitFor()
  await page.evaluate(() => window.dispatchEvent(new Event('offline')))
  if (!(await page.getByRole('heading', { name: 'Waar heb je trek in?' }).isVisible())) throw new Error('Offline app-shell did not render the discovery view')
  await page.locator('.offline-banner').waitFor()
  if (!((await page.locator('.offline-banner').textContent()) || '').includes('Je werkt offline')) throw new Error('Offline status was not announced')
  await context.setOffline(false)
  await context.close()
} finally {
  await browser?.close()
  server.kill()
}

console.log('Production PWA installs, controls the page, and reloads offline')
