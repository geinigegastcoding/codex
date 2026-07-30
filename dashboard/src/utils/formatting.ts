export const dutchDateFormatter = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'short',
})

export const dutchLongDateFormatter = new Intl.DateTimeFormat('nl-NL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export function formatDate(date: string) {
  return dutchDateFormatter.format(new Date(`${date.slice(0, 10)}T12:00:00`))
}

export function formatDateTime(date: string) {
  const value = new Date(date)
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

export function daysBetween(start: string, end: string) {
  const milliseconds = new Date(end).getTime() - new Date(start).getTime()
  return Math.max(0, Math.round(milliseconds / 86_400_000))
}
