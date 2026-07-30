import { DecisionQueue } from '../components/decisions/DecisionQueue'
import { PageHeader } from '../components/layout/PageHeader'

export default function DecisionsPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="BRAIN QUEUE" title="Besluiten" description="Strategische keuzes horen niet verstopt te zitten tussen uitvoertaken. Leg keuze, reden en ontbrekend bewijs vast." provenance="verified" />
      <DecisionQueue />
    </div>
  )
}
