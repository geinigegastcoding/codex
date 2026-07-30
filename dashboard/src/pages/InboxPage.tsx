import { InboxList } from '../components/inbox/InboxList'
import { PageHeader } from '../components/layout/PageHeader'
import { QuickCapture } from '../components/planning/QuickCapture'
import { useWorkspace } from '../state/useWorkspace'

export default function InboxPage() {
  const { state } = useWorkspace()
  const archived = state.inbox.filter((item) => item.destination === 'archived').length
  const moved = state.inbox.filter((item) => item.destination === 'today' || item.destination === 'decision').length
  return (
    <div className="page">
      <PageHeader eyebrow="CAPTURE & TRIAGE" title="Inbox" description="Leg werk snel vast. Beslis pas daarna of het Vandaag, een Besluit of het Archief wordt." provenance="local" />
      <div className="page-grid page-grid--inbox"><QuickCapture /><article className="workspace-card inbox-summary"><p className="eyebrow">LOCAL WORKSPACE</p><h2>Alles blijft op dit apparaat</h2><dl><div><dt>Totaal vastgelegd</dt><dd>{state.inbox.length}</dd></div><div><dt>Verwerkt</dt><dd>{moved}</dd></div><div><dt>Gearchiveerd</dt><dd>{archived}</dd></div></dl><p>Geen account, synchronisatie of externe databron. Dit is bewust een lokale persoonlijke werklaag.</p></article></div>
      <InboxList />
    </div>
  )
}
