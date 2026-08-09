import test from 'node:test'
import assert from 'node:assert/strict'
import {
  emptyConnector,
  normalizeGa4Report,
  normalizeStripePaymentIntents,
  normalizeYouTubeChannel,
} from '../../server/connectors.mjs'

test('normalizes a YouTube channel response without inventing trend data', () => {
  const result = normalizeYouTubeChannel({
    items: [{ statistics: { viewCount: '1234', subscriberCount: '56', videoCount: '9' } }],
  })

  assert.equal(result.status, 'connected')
  assert.deepEqual(result.metrics, { views: 1234, subscribers: 56, videos: 9 })
  assert.deepEqual(result.series, [])
})

test('normalizes GA4 daily rows into totals and a chart series', () => {
  const result = normalizeGa4Report({
    rows: [
      { dimensionValues: [{ value: '20260801' }], metricValues: [{ value: '12' }, { value: '9' }, { value: '3' }, { value: '1' }] },
    ],
  })

  assert.deepEqual(result.totals, { users: 12, sessions: 9, events: 3, leads: 1 })
  assert.deepEqual(result.series, [{ date: '2026-08-01', users: 12, sessions: 9, events: 3, leads: 1 }])
})

test('normalizes Stripe only from succeeded payment intents and keeps currency in cents', () => {
  const result = normalizeStripePaymentIntents({
    data: [
      { amount_received: 1099, status: 'succeeded' },
      { amount_received: 4500, status: 'succeeded' },
      { amount_received: 9999, status: 'processing' },
    ],
  })

  assert.deepEqual(result, { status: 'connected', payments: 2, revenueCents: 5599 })
})

test('emptyConnector reports missing setup without a fake value', () => {
  assert.deepEqual(emptyConnector('GA4', 'GA4_PROPERTY_ID'), {
    status: 'not-connected',
    source: 'GA4',
    detail: 'Add GA4_PROPERTY_ID to dashboard/.env',
  })
})
