const toneCycle = ['cobalt', 'violet', 'mint', 'amber']

function readCsv(text) {
  const rows = []
  let cell = ''
  let row = []
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (character === ',' && !quoted) {
      row.push(cell.trim())
      cell = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(cell.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += character
    }
  }

  row.push(cell.trim())
  if (row.some(Boolean)) rows.push(row)
  return rows
}

function valueFor(record, names) {
  return names.map((name) => record[name]).find(Boolean) || ''
}

function initialsFor(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'LD'
}

function parseDealValue(value) {
  if (!value) return 0
  const compact = String(value).replace(/[^\d,.-]/g, '')
  if (!compact) return 0
  const normalized = compact.includes(',') && compact.includes('.')
    ? compact.replace(/,/g, '')
    : compact.replace(',', '.')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

export function parseLeadFile(text) {
  const rows = readCsv(text)
  if (rows.length < 2) return { leads: [], errors: ['Your CSV needs a header row and at least one lead.'] }

  const headers = rows[0].map((header) => header.toLowerCase().trim().replace(/[\s-]+/g, '_'))
  const leads = []
  const errors = []

  rows.slice(1).forEach((cells, rowIndex) => {
    const record = Object.fromEntries(headers.map((header, index) => [header, cells[index]?.trim() || '']))
    const name = valueFor(record, ['name', 'contact', 'contact_name', 'full_name'])
    const company = valueFor(record, ['company', 'company_name', 'account'])
    const action = valueFor(record, ['next_action', 'next_step', 'action'])

    if (!name || !company || !action) {
      errors.push(`Row ${rowIndex + 2}: company, contact/name, and next_action are required.`)
      return
    }

    const urgency = valueFor(record, ['urgency', 'priority']) || 'New'
    leads.push({
      id: `${Date.now()}-${rowIndex}`,
      initials: initialsFor(name), name, company, action,
      time: valueFor(record, ['next_action_time', 'time', 'due_time']) || 'Today',
      tone: toneCycle[rowIndex % toneCycle.length], badge: urgency,
      hot: /overdue|high|urgent/i.test(urgency),
      stage: valueFor(record, ['pipeline_stage', 'stage']) || 'New',
      dealValue: parseDealValue(valueFor(record, ['deal_value', 'value', 'amount', 'opportunity_value'])),
      source: valueFor(record, ['lead_source', 'source']) || 'Imported CSV',
      demoStatus: valueFor(record, ['demo_status', 'demo']) || 'Not set',
      tags: valueFor(record, ['tags', 'tag']),
      email: valueFor(record, ['email']),
    })
  })

  return { leads, errors }
}
