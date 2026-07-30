import { knowledgeContext } from '../../data/knowledge-context'
import { useWorkspace } from '../../state/useWorkspace'
import { ProvenanceBadge } from '../context/ProvenanceBadge'

export function WeeklyReviewForm() {
  const { state, updateWeeklyReview, toggleReviewStep } = useWorkspace()
  return (
    <article className="workspace-card review-form">
      <header className="workspace-card__header"><div><p className="eyebrow">FOUNDER REVIEW</p><h2>De vraag die telt</h2></div><ProvenanceBadge provenance="local" compact /></header>
      <blockquote>{knowledgeContext.weeklyPrompt}</blockquote>
      <label><span>Jouw antwoord</span><textarea value={state.weeklyReview.answer} onChange={(event) => updateWeeklyReview(event.target.value)} placeholder="Wat wil je bewijzen, hoe ziet bewijs eruit en wat schrap je als het niet werkt?" /></label>
      <div className="review-steps">
        {knowledgeContext.reviewSteps.map((step) => <label key={step.id}><input type="checkbox" checked={Boolean(state.weeklyReview.checklist[step.id])} onChange={() => toggleReviewStep(step.id)} /><span>{step.title}</span></label>)}
      </div>
    </article>
  )
}
