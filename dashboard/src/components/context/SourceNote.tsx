import type { SourceReference } from '../../domain/workspace-types'
import { ProvenanceBadge } from './ProvenanceBadge'

export function SourceNote({ source }: { source: SourceReference }) {
  return (
    <footer className="source-note">
      <ProvenanceBadge provenance={source.provenance} compact />
      <span>{source.repositoryPath}</span>
      <time dateTime={source.asOf}>Snapshot {source.asOf}</time>
    </footer>
  )
}
