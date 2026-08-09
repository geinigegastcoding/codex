import type { CrmSnapshot, DashboardSnapshot } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null
    throw new Error(body?.error ?? `Request failed (${response.status})`)
  }

  return response.json() as Promise<T>
}

export function getSnapshot(range: DashboardSnapshot['range']) {
  return request<DashboardSnapshot>(`/snapshot?range=${range}`)
}

export function getCrm() {
  return request<CrmSnapshot>('/crm')
}

export function saveCrm(snapshot: CrmSnapshot) {
  return request<CrmSnapshot>('/crm', { method: 'PUT', body: JSON.stringify(snapshot) })
}

export function syncConnectors() {
  return request<DashboardSnapshot>('/sync', { method: 'POST' })
}
