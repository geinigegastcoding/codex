import { mkdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'

const root = resolve(import.meta.dirname, '..')
const iconDir = join(root, 'public', 'icons')
const svg = await readFile(join(iconDir, 'hap-icon.svg'), 'utf8')
const sources = {
  regular: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
  maskable: `data:image/svg+xml;base64,${Buffer.from(svg.replace('rx="116"', 'rx="0"')).toString('base64')}`,
}

await mkdir(iconDir, { recursive: true })
const browser = await chromium.launch()
try {
  for (const { size, file, source } of [
    { size: 192, file: 'hap-192.png', source: sources.regular },
    { size: 512, file: 'hap-512.png', source: sources.regular },
    { size: 512, file: 'hap-maskable-512.png', source: sources.maskable },
  ]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
    await page.setContent(`<style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}img{display:block;width:100%;height:100%}</style><img src="${source}" alt="">`)
    await page.locator('img').evaluate((image) => image.decode())
    await page.screenshot({ path: join(iconDir, file), omitBackground: true })
    await page.close()
  }
} finally {
  await browser.close()
}

console.log(`Hap icons written to ${iconDir}`)
