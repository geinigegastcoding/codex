import { ExternalLink, PlayCircle } from 'lucide-react'
import { resourceById } from '../../content/resources'

export function ResourceLinks({ ids }: { ids: string[] }) {
  const items = ids.map((id) => resourceById[id]).filter(Boolean)
  if (!items.length) return null
  return (
    <section className="resource-links" aria-labelledby="resources-heading">
      <div className="section-title"><PlayCircle size={18} /><div><p className="eyebrow">Learn another way</p><h2 id="resources-heading">Recommended resources</h2></div></div>
      <div className="resource-grid">
        {items.map((resource) => (
          <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer">
            <div><span>{resource.provider}</span><ExternalLink size={15} /></div>
            <strong>{resource.title}</strong>
            <p>{resource.reason}</p>
            <small>{resource.duration} · External</small>
          </a>
        ))}
      </div>
    </section>
  )
}
