function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function toDate(value) {
  const text = String(value ?? '')
  return text.length === 8 && /^\d{8}$/.test(text)
    ? `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6)}`
    : text
}

export function emptyConnector(source, envName) {
  return {
    status: 'not-connected',
    source,
    detail: `Add ${envName} to dashboard/.env`,
  }
}

export function normalizeYouTubeChannel(payload) {
  const statistics = payload?.items?.[0]?.statistics
  if (!statistics) {
    return { status: 'error', source: 'YouTube', detail: 'No channel statistics were returned', metrics: null, series: [] }
  }

  return {
    status: 'connected',
    source: 'YouTube',
    metrics: {
      views: toNumber(statistics.viewCount),
      subscribers: toNumber(statistics.subscriberCount),
      videos: toNumber(statistics.videoCount),
    },
    series: [],
  }
}

export function normalizeYouTubeAnalytics(payload) {
  const rows = payload?.rows ?? []
  const series = rows.map((row) => ({
    date: toDate(row[0]),
    views: toNumber(row[1]),
    watchMinutes: toNumber(row[2]),
    subscribers: toNumber(row[3]),
    likes: toNumber(row[4]),
    comments: toNumber(row[5]),
  }))

  return {
    status: 'connected',
    source: 'YouTube Analytics',
    series,
    totals: series.reduce((totals, point) => ({
      views: totals.views + point.views,
      watchMinutes: totals.watchMinutes + point.watchMinutes,
      subscribers: totals.subscribers + point.subscribers,
      likes: totals.likes + point.likes,
      comments: totals.comments + point.comments,
    }), { views: 0, watchMinutes: 0, subscribers: 0, likes: 0, comments: 0 }),
  }
}

export function normalizeGa4Report(payload) {
  const series = (payload?.rows ?? []).map((row) => {
    const metrics = row.metricValues ?? []
    return {
      date: toDate(row.dimensionValues?.[0]?.value),
      users: toNumber(metrics[0]?.value),
      sessions: toNumber(metrics[1]?.value),
      events: toNumber(metrics[2]?.value),
      leads: toNumber(metrics[3]?.value),
    }
  })

  return {
    status: 'connected',
    source: 'GA4',
    totals: series.reduce((totals, point) => ({
      users: totals.users + point.users,
      sessions: totals.sessions + point.sessions,
      events: totals.events + point.events,
      leads: totals.leads + point.leads,
    }), { users: 0, sessions: 0, events: 0, leads: 0 }),
    series,
  }
}

export function normalizeStripePaymentIntents(payload) {
  const succeeded = (payload?.data ?? []).filter((payment) => payment.status === 'succeeded')
  return {
    status: 'connected',
    payments: succeeded.length,
    revenueCents: succeeded.reduce((total, payment) => total + toNumber(payment.amount_received), 0),
  }
}

export function normalizeFormspreeSubmissions(payload) {
  const submissions = Array.isArray(payload) ? payload : payload?.submissions ?? []
  return {
    status: 'connected',
    signups: submissions.length,
    submissions,
  }
}
