import { randomUUID } from 'node:crypto'

export function parseCsv(input) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    const next = input[index + 1]

    if (character === '"' && quoted && next === '"') {
      cell += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += character
    }
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) ?? []
  return rows
    .filter((values) => values.some((value) => value.trim() !== ''))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] ?? '').trim()])))
}

export function normalizeLead(input) {
  const company = String(input.company ?? input.companyName ?? '').trim()
  const email = String(input.email ?? '').trim().toLowerCase()

  if (!company) throw new Error('Company is required')
  if (!email || !email.includes('@')) throw new Error('Email is required')

  const stage = ['new', 'qualified', 'proposal', 'won', 'lost'].includes(input.stage) ? input.stage : 'new'
  const notes = Array.isArray(input.notes)
    ? input.notes.filter(Boolean).map(String)
    : String(input.notes ?? input.note ?? '').trim() ? [String(input.notes ?? input.note).trim()] : []

  return {
    id: String(input.id ?? randomUUID()),
    company,
    name: String(input.name ?? input.contactName ?? '').trim(),
    email,
    stage,
    source: String(input.source ?? 'manual').trim() || 'manual',
    nextAction: String(input.nextAction ?? input.next_action ?? '').trim(),
    nextActionAt: String(input.nextActionAt ?? input.next_action_at ?? '').trim(),
    notes,
    value: input.value === '' || input.value == null ? null : Number(input.value),
    createdAt: String(input.createdAt ?? new Date().toISOString()),
    updatedAt: new Date().toISOString(),
  }
}

export function summarizeSources(sources) {
  return { ...sources }
}
