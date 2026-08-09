import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseEnv(text) {
  return Object.fromEntries(text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const separator = line.indexOf('=')
      const key = line.slice(0, separator).trim()
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
      return [key, value]
    }))
}

export async function loadEnv() {
  try {
    const file = await readFile(path.join(ROOT, '.env'), 'utf8')
    for (const [key, value] of Object.entries(parseEnv(file))) {
      if (process.env[key] == null) process.env[key] = value
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  return process.env
}

export function getEnv(name) {
  return process.env[name]?.trim() || ''
}
