import { PageHeader } from '../components/layout/PageHeader'
import { ProjectCard } from '../components/projects/ProjectCard'
import { knowledgeContext } from '../data/knowledge-context'

export default function ProjectsPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="RELEVANCE OVER VOLUME" title="Projecten" description="Alleen werk dat nu richting, omzet of uitvoeringskwaliteit ondersteunt. Geen fictieve voortgangsbalken." provenance="verified" />
      <div className="project-grid">{knowledgeContext.projects.map((project) => <ProjectCard project={project} key={project.id} />)}</div>
    </div>
  )
}
