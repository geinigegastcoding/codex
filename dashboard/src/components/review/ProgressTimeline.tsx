import { knowledgeContext } from '../../data/knowledge-context'
import { SourceNote } from '../context/SourceNote'

export function ProgressTimeline() {
  return (
    <article className="workspace-card progress-card">
      <header className="workspace-card__header"><div><p className="eyebrow">VERIFIED TIMELINE</p><h2>Wat er aantoonbaar is uitgevoerd</h2></div></header>
      <ol>{knowledgeContext.progress.map((entry) => <li key={`${entry.date}-${entry.title}`}><time>{entry.date}</time><span><strong>{entry.title}</strong><small>{entry.detail}</small></span></li>)}</ol>
      <SourceNote source={knowledgeContext.sources.progress} />
    </article>
  )
}
