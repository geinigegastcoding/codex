import { readdir, stat } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const assets = resolve(import.meta.dirname, '..', 'dist', 'assets')
const maximumBytes = 1_200_000
const files = (await readdir(assets)).filter((name) => name.endsWith('.js')).sort()
if (!files.length) throw new Error('Geen productie-JavaScript gevonden. Draai eerst npm run build.')

const sizes = await Promise.all(files.map(async (name) => {
  const path = join(assets, name)
  const raw = (await stat(path)).size
  const gzip = gzipSync(await readFile(path)).length
  return { name, raw, gzip }
}))

for (const size of sizes) console.log(`${size.name}: ${size.raw} bytes (${size.gzip} gzip)`)
const oversized = sizes.filter(({ raw }) => raw > maximumBytes)
if (oversized.length) throw new Error(`Chunk groter dan ${maximumBytes} bytes: ${oversized.map(({ name, raw }) => `${name} (${raw})`).join(', ')}`)
console.log(`Bundlecontract geslaagd: ${sizes.length} JavaScriptchunks, allemaal onder ${maximumBytes} bytes`)
