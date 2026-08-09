import type { LucideIcon } from 'lucide-react'

export function StatTile({ label, value, detail, icon: Icon, tone = 'default' }: { label: string; value: string | number; detail: string; icon: LucideIcon; tone?: 'default' | 'positive' | 'attention' }) {
  return (
    <article className={`stat-tile stat-tile--${tone}`}>
      <div><span>{label}</span><Icon size={18} aria-hidden="true" /></div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  )
}
