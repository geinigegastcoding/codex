import { ArrowRight, ExternalLink, Flag, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '../content/projects'
import { PageHeader } from '../components/layout/PageHeader'
import { ProgressBar } from '../components/progress/ProgressBar'
import { useCourse } from '../state/CourseProvider'

export function ProjectsPage() {
  const { state } = useCourse()
  return (
    <>
      <PageHeader eyebrow="Build things worth showing" title="Project laboratory" description="Each project is a guided workspace with prerequisites, setup, milestone evidence, deliverables, tests, and a 100-point rubric." />
      <div className="project-grid">
        {projects.map((project) => {
          const progress = state.projectProgress[project.id]
          const completed = Object.values(progress?.milestones ?? {}).filter((item) => item.status === 'verified-complete').length
          const percentage = Math.round((completed / project.milestones.length) * 100)
          return <article className="project-card" key={project.id}>
            <header><span>{project.stageId.replace('stage-', 'Stage ')}</span>{project.localOnly ? <span><ExternalLink size={13} /> Local environment</span> : <span><LockKeyhole size={13} /> Browser + local</span>}</header>
            <h2>{project.title}</h2><p>{project.summary}</p>
            <div className="project-outcome"><Flag size={17} /><div><strong>Outcome</strong><p>{project.outcome}</p></div></div>
            <ProgressBar label={`${completed} of ${project.milestones.length} milestones verified`} value={percentage} />
            <div className="tag-row"><span>{project.estimatedHours} hours</span>{project.skills.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}</div>
            <Link className="primary-link" to={`/projects/${project.id}`}>{progress?.status === 'not-started' ? 'Open project' : 'Continue project'} <ArrowRight size={17} /></Link>
          </article>
        })}
      </div>
    </>
  )
}
