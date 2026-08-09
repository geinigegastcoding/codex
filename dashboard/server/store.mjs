import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { ROOT } from './env.mjs'
import { normalizeLead } from './domain.mjs'

export const CRM_FILE = path.join(ROOT, 'data', 'crm.json')

export function normalizeCrmSnapshot(value) {
  if (!value || !Array.isArray(value.leads)) throw new Error('CRM leads must be an array')
  return {
    leads: value.leads.map((lead) => normalizeLead(lead)),
  }
}

export async function readCrm() {
  try {
    const raw = await readFile(CRM_FILE, 'utf8')
    return normalizeCrmSnapshot(JSON.parse(raw))
  } catch (error) {
    if (error.code === 'ENOENT') return { leads: [] }
    throw error
  }
}

export async function writeCrm(value) {
  const snapshot = normalizeCrmSnapshot(value)
  await mkdir(path.dirname(CRM_FILE), { recursive: true })
  await writeFile(CRM_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
  return snapshot
}
