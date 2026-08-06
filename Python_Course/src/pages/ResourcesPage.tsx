import { ExternalLink } from 'lucide-react'
import { resources } from '../content/resources'
import { PageHeader } from '../components/layout/PageHeader'

export function ResourcesPage() {
  const groups = resources.reduce<Record<string, typeof resources>>((result, resource) => {
    ;(result[resource.topic] ??= []).push(resource)
    return result
  }, {})
  return (
    <>
      <PageHeader eyebrow="Curated, not dumped" title="Learning resources" description="Every link has a specific job. Use videos for intuition, documentation for precision, and this course for deliberate practice." />
      <div className="resource-sections">
        {Object.entries(groups).map(([topic, items]) => <section key={topic}><header><p className="eyebrow">Topic</p><h2>{topic}</h2></header><div className="resource-grid">{items?.map((resource) => <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer"><div><span>{resource.provider}</span><ExternalLink size={15} /></div><strong>{resource.title}</strong><p>{resource.reason}</p><small>{resource.duration} · External resource</small></a>)}</div></section>)}
      </div>
    </>
  )
}
