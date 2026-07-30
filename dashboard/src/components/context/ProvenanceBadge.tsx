import { CircleHelp, Database, HardDrive, TestTube2 } from 'lucide-react'
import type { Provenance } from '../../domain/workspace-types'

const content = {
  verified: { label: 'Geverifieerde context', Icon: Database },
  local: { label: 'Lokaal opgeslagen', Icon: HardDrive },
  demo: { label: 'Illustratieve demo', Icon: TestTube2 },
  unknown: { label: 'Onbekend', Icon: CircleHelp },
}

export function ProvenanceBadge({ provenance, compact = false }: { provenance: Provenance; compact?: boolean }) {
  const { label, Icon } = content[provenance]
  return <span className={`provenance-badge provenance-badge--${provenance}${compact ? ' provenance-badge--compact' : ''}`}><Icon aria-hidden="true" size={12} />{label}</span>
}
