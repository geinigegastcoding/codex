import { CircleHelp } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { ProgressTimeline } from '../components/review/ProgressTimeline'
import { WeeklyReviewForm } from '../components/review/WeeklyReviewForm'
import { useWorkspace } from '../state/useWorkspace'

export default function ReviewPage() {
  const { state, resetWorkspace } = useWorkspace()
  const completed = state.priorities.filter((priority) => priority.complete).length + state.checklist.filter((item) => item.complete).length
  return (
    <div className="page">
      <PageHeader eyebrow="WEEKLY RESET" title="Founder review" description="Verbind dagelijkse uitvoering aan de commerciële richting, zonder een kunstmatige productiviteitsscore." provenance="local" actions={<button className="ghost-button" type="button" onClick={resetWorkspace}>Reset lokale werkruimte</button>} />
      <div className="page-grid page-grid--review"><WeeklyReviewForm /><article className="workspace-card review-summary"><p className="eyebrow">LOCAL SIGNALS</p><h2>Wat deze browser weet</h2><div className="review-number"><strong>{completed}</strong><span>lokale items afgerond</span></div><div className="unknown-panel"><CircleHelp aria-hidden="true" size={18} /><span><strong>Businessresultaat: onbekend</strong><small>Geen live funnel, omzet, ranking of analyticsbron gekoppeld.</small></span></div></article></div>
      <ProgressTimeline />
    </div>
  )
}
