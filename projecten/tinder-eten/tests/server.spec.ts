import { expect, test } from '@playwright/test'
import { resolveStaticPath } from '../server-path.mjs'

test('de productie-server serveert index.html voor de root', () => {
  expect(resolveStaticPath('/', 'E:\\app\\dist')).toBe('E:\\app\\dist\\index.html')
})

test('manifest, appiconen en offline worker vormen een installeerbare app-shell', async ({ request }) => {
  const index = await (await request.get('/')).text()
  expect(index).toContain('rel="manifest" href="/manifest.webmanifest"')
  expect(index).toContain('rel="apple-touch-icon" href="/icons/hap-192.png"')

  const manifestResponse = await request.get('/manifest.webmanifest')
  expect(manifestResponse.ok()).toBe(true)
  const manifest = await manifestResponse.json()
  expect(manifest).toMatchObject({ name: 'Hap', display: 'standalone', lang: 'nl-NL', start_url: '/' })
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: '/icons/hap-192.png', sizes: '192x192', type: 'image/png' }),
    expect.objectContaining({ src: '/icons/hap-512.png', sizes: '512x512', type: 'image/png' }),
    expect.objectContaining({ src: '/icons/hap-maskable-512.png', sizes: '512x512', purpose: 'maskable' }),
  ]))
  for (const icon of manifest.icons) expect((await request.get(icon.src)).ok()).toBe(true)

  const worker = await (await request.get('/sw.js')).text()
  expect(worker).toContain('hap-shell-')
  expect(worker).toContain("request.mode === 'navigate'")
  expect(worker).toContain('/api/')
})
