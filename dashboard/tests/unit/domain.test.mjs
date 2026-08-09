import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeLead, parseCsv, summarizeSources } from '../../server/domain.mjs'

test('parseCsv handles quoted commas and preserves empty optional fields', () => {
  assert.deepEqual(parseCsv('company,email,note\n"Studio, West",a@example.com,"Needs follow-up"'), [
    { company: 'Studio, West', email: 'a@example.com', note: 'Needs follow-up' },
  ])
})

test('normalizeLead rejects records without the minimum CRM identity', () => {
  assert.throws(() => normalizeLead({ company: '', email: 'a@example.com' }), /company/i)
  assert.throws(() => normalizeLead({ company: 'Studio West', email: '' }), /email/i)
})

test('summarizeSources never turns missing data into a metric', () => {
  assert.deepEqual(summarizeSources({
    ga4: { status: 'not-connected' },
    youtube: { status: 'connected', views: 42 },
  }), {
    ga4: { status: 'not-connected' },
    youtube: { status: 'connected', views: 42 },
  })
})
