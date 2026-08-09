import { join, normalize, resolve, sep } from 'node:path'

export function resolveStaticPath(pathname, dist) {
  if (pathname === '/') return join(dist, 'index.html')
  const relative = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '')
  const candidate = resolve(dist, relative)
  return candidate.startsWith(`${resolve(dist)}${sep}`) ? candidate : join(dist, 'index.html')
}
