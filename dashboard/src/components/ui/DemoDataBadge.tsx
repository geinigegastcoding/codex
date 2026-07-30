import { FlaskConical } from 'lucide-react'

type DemoDataBadgeProps = {
  compact?: boolean
}

export function DemoDataBadge({ compact = false }: DemoDataBadgeProps) {
  return (
    <span className={`demo-badge${compact ? ' demo-badge--compact' : ''}`}>
      <FlaskConical aria-hidden="true" size={14} />
      Illustratieve demo
    </span>
  )
}
