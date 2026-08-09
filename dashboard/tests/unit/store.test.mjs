import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeCrmSnapshot } from '../../server/store.mjs'

test('normalizeCrmSnapshot keeps a valid empty CRM empty', () => {
  assert.deepEqual(normalizeCrmSnapshot({ leads: [] }), { leads: [] })
})

test('normalizeCrmSnapshot rejects a non-array lead collection', () => {
  assert.throws(() => normalizeCrmSnapshot({ leads: 'not-a-list' }), /leads/i)
})
