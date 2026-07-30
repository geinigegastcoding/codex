import type { ReactNode } from 'react'
import { ProvenanceBadge } from '../context/ProvenanceBadge'
import type { Provenance } from '../../domain/workspace-types'

export function PageHeader({ eyebrow, title, description, provenance, actions }: { eyebrow: string; title: string; description: string; provenance?: Provenance; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <div className="page-header__meta"><p className="eyebrow">{eyebrow}</p>{provenance && <ProvenanceBadge provenance={provenance} compact />}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  )
}
