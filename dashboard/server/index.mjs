import { createSign } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { URL } from 'node:url'
import {
  emptyConnector,
  normalizeFormspreeSubmissions,
  normalizeGa4Report,
  normalizeStripePaymentIntents,
  normalizeYouTubeAnalytics,
  normalizeYouTubeChannel,
} from './connectors.mjs'
import { getEnv, loadEnv, ROOT } from './env.mjs'
import { readCrm, writeCrm } from './store.mjs'

await loadEnv()

const port = Number(getEnv('API_PORT') || 8787)
const ranges = { '7d': 7, '30d': 30, '90d': 90 }

function json(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5173',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  })
  response.end(JSON.stringify(body))
}

function dateRange(range) {
  const days = ranges[range] ?? ranges['30d']
  const end = new Date()
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - days + 1)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

async function requestJson(url, init = {}) {
  const response = await fetch(url, init)
  const text = await response.text()
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 240)}`)
  return text ? JSON.parse(text) : {}
}

async function readBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 2_000_000) throw new Error('Request body is too large')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function base64Url(value) {
  return Buffer.from(value).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

async function googleAccessToken() {
  if (getEnv('GA4_ACCESS_TOKEN')) return getEnv('GA4_ACCESS_TOKEN')
  const configuredPath = getEnv('GOOGLE_APPLICATION_CREDENTIALS')
  if (!configuredPath) return ''

  const credentialsPath = path.isAbsolute(configuredPath) ? configuredPath : path.resolve(ROOT, configuredPath)
  const credentials = JSON.parse(await readFile(credentialsPath, 'utf8'))
  const now = Math.floor(Date.now() / 1000)
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))
  const unsigned = `${header}.${payload}`
  const signer = createSign('RSA-SHA256')
  signer.update(unsigned)
  const assertion = `${unsigned}.${signer.sign(credentials.private_key, 'base64')}`
    .replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
  const token = await requestJson('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  return token.access_token ?? ''
}

async function fetchYouTube(range) {
  const channelId = getEnv('YOUTUBE_CHANNEL_ID')
  const apiKey = getEnv('YOUTUBE_API_KEY')
  if (!channelId || !apiKey) return emptyConnector('YouTube', 'YOUTUBE_CHANNEL_ID + YOUTUBE_API_KEY')

  const channelUrl = new URL('https://www.googleapis.com/youtube/v3/channels')
  channelUrl.search = new URLSearchParams({ part: 'statistics,snippet', id: channelId, key: apiKey }).toString()
  const channel = normalizeYouTubeChannel(await requestJson(channelUrl))
  const accessToken = getEnv('YOUTUBE_ACCESS_TOKEN')
  if (!accessToken) {
    return { ...channel, detail: 'Channel totals connected. Add YOUTUBE_ACCESS_TOKEN for date-range charts.' }
  }

  const { startDate, endDate } = dateRange(range)
  const analyticsUrl = new URL('https://youtubeanalytics.googleapis.com/v2/reports')
  analyticsUrl.search = new URLSearchParams({
    ids: 'channel==MINE',
    startDate,
    endDate,
    metrics: 'views,estimatedMinutesWatched,subscribersGained,likes,comments',
    dimensions: 'day',
    sort: 'day',
  }).toString()
  try {
    const analytics = normalizeYouTubeAnalytics(await requestJson(analyticsUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }))
    return {
      ...channel,
      detail: 'Date-range views and engagement connected through YouTube Analytics.',
      metrics: { ...channel.metrics, ...analytics.totals, lifetimeViews: channel.metrics.views },
      series: analytics.series,
    }
  } catch (error) {
    return { ...channel, detail: `Channel totals connected; daily report unavailable: ${error.message}` }
  }
}

async function fetchGa4(range) {
  const propertyId = getEnv('GA4_PROPERTY_ID')
  if (!propertyId) return emptyConnector('GA4', 'GA4_PROPERTY_ID')
  const token = await googleAccessToken()
  if (!token) return emptyConnector('GA4', 'GA4_ACCESS_TOKEN or GOOGLE_APPLICATION_CREDENTIALS')

  const { startDate, endDate } = dateRange(range)
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`
  const report = normalizeGa4Report(await requestJson(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'eventCount' },
        { name: 'conversions' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date', orderType: 'NUMERIC', desc: false } }],
    }),
  }))

  return {
    ...report,
    metrics: report.totals,
    detail: 'Leads use GA4 conversions. Mark generate_lead as a key event for exact signup reporting.',
  }
}

async function fetchStripe(range) {
  const secret = getEnv('STRIPE_SECRET_KEY')
  if (!secret) return emptyConnector('Stripe', 'STRIPE_SECRET_KEY')

  const { startDate } = dateRange(range)
  const startSeconds = Math.floor(new Date(`${startDate}T00:00:00Z`).getTime() / 1000)
  const payments = []
  let startingAfter = ''

  for (let page = 0; page < 100; page += 1) {
    const url = new URL('https://api.stripe.com/v1/payment_intents')
    url.searchParams.set('limit', '100')
    url.searchParams.set('created[gte]', String(startSeconds))
    if (startingAfter) url.searchParams.set('starting_after', startingAfter)
    const pageData = await requestJson(url, {
      headers: { Authorization: `Bearer ${secret}` },
    })
    payments.push(...(pageData.data ?? []))
    if (!pageData.has_more || !pageData.data?.length) break
    startingAfter = pageData.data.at(-1).id
  }

  const normalized = normalizeStripePaymentIntents({ data: payments })
  return {
    status: normalized.status,
    source: 'Stripe',
    metrics: { revenue: normalized.revenueCents / 100, payments: normalized.payments },
    detail: `Loaded ${payments.length} payment intents in the selected range.`,
  }
}

async function fetchFormspree() {
  const formId = getEnv('FORMSPREE_FORM_ID')
  const token = getEnv('FORMSPREE_API_TOKEN')
  if (!formId || !token) return emptyConnector('Formspree', 'FORMSPREE_FORM_ID + FORMSPREE_API_TOKEN')
  const payload = await requestJson(`https://formspree.io/api/0/forms/${encodeURIComponent(formId)}/submissions`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const normalized = normalizeFormspreeSubmissions(payload)
  return {
    ...normalized,
    source: 'Formspree',
    metrics: { signups: normalized.signups },
    detail: 'Form submissions loaded from the contact form endpoint.',
  }
}

async function safeSource(source, load) {
  try {
    return await load()
  } catch (error) {
    return { status: 'error', source, detail: error instanceof Error ? error.message : String(error) }
  }
}

function metric(value, unit, sourceReport, detail) {
  const number = typeof value === 'number' && Number.isFinite(value) ? value : null
  return {
    value: number,
    unit,
    source: sourceReport.source,
    status: number == null ? sourceReport.status : sourceReport.status,
    detail: detail ?? sourceReport.detail,
  }
}

async function buildSnapshot(range) {
  const [ga4, youtube, stripe, formspree] = await Promise.all([
    safeSource('GA4', () => fetchGa4(range)),
    safeSource('YouTube', () => fetchYouTube(range)),
    safeSource('Stripe', () => fetchStripe(range)),
    safeSource('Formspree', fetchFormspree),
  ])

  const leadSource = formspree.status === 'connected' ? formspree : ga4
  const leadValue = formspree.metrics?.signups ?? ga4.metrics?.leads
  const youtubeValue = youtube.metrics?.views
  const snapshot = {
    generatedAt: new Date().toISOString(),
    range,
    metrics: {
      visitors: metric(ga4.metrics?.users, 'count', ga4),
      leads: metric(leadValue, 'count', leadSource, formspree.status === 'connected'
        ? 'Formspree submissions in the connected form.'
        : ga4.detail),
      youtubeViews: metric(youtubeValue, 'count', youtube),
      revenue: metric(stripe.metrics?.revenue, 'currency', stripe),
    },
    acquisition: (ga4.series ?? []).map((point) => ({
      date: point.date,
      users: point.users,
      sessions: point.sessions,
      leads: point.leads,
    })),
    sources: { ga4, youtube, stripe, formspree },
  }
  return snapshot
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return json(response, 204, {})
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`)

  try {
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return json(response, 200, { status: 'ok', mode: 'local', generatedAt: new Date().toISOString() })
    }

    if (url.pathname === '/api/crm' && request.method === 'GET') {
      const snapshot = await readCrm()
      return json(response, 200, { ...snapshot, updatedAt: snapshot.updatedAt ?? null })
    }

    if (url.pathname === '/api/crm' && request.method === 'PUT') {
      const value = JSON.parse(await readBody(request))
      const saved = await writeCrm(value)
      return json(response, 200, { ...saved, updatedAt: new Date().toISOString() })
    }

    if (url.pathname === '/api/snapshot' && request.method === 'GET') {
      const range = ranges[url.searchParams.get('range')] ? url.searchParams.get('range') : '30d'
      return json(response, 200, await buildSnapshot(range))
    }

    if (url.pathname === '/api/sync' && request.method === 'POST') {
      return json(response, 200, await buildSnapshot('30d'))
    }

    return json(response, 404, { error: 'Route not found' })
  } catch (error) {
    return json(response, 400, { error: error instanceof Error ? error.message : String(error) })
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`MagisData API listening on http://127.0.0.1:${port}`)
})
