import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { resolveStaticPath } from './server-path.mjs'

const port = Number(process.env.PORT || 8000)
const dist = join(import.meta.dirname, 'dist')
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' }

createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`)
  if (url.pathname === '/api/prices') {
    const upstream = new URL('https://www.prijsprofeet.nl/api/v1/search')
    upstream.search = url.search
    try {
      const result = await fetch(upstream, { headers: { 'User-Agent': 'Hap/1.0 (local recipe app)' } })
      response.writeHead(result.status, { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' })
      response.end(Buffer.from(await result.arrayBuffer()))
    } catch {
      response.writeHead(502, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ error: 'Prijsdienst niet bereikbaar' }))
    }
    return
  }

  let file = resolveStaticPath(url.pathname, dist)
  if (!existsSync(file) || !statSync(file).isFile()) file = join(dist, 'index.html')
  response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', ...(url.pathname === '/sw.js' ? { 'Cache-Control': 'no-cache' } : {}) })
  createReadStream(file).pipe(response)
}).listen(port, () => console.log(`Hap draait op http://localhost:${port}`))
