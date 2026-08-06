import { Check, ChevronRight, ClipboardCheck, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { modules, stages, lessons } from '../content/catalog'
import { projectById } from '../content/projects'
import { PageHeader } from '../components/layout/PageHeader'
import { ProgressBar } from '../components/progress/ProgressBar'
import { useCourse } from '../state/CourseProvider'
import { stageCompletion } from '../state/selectors'

export function CourseMapPage() {
  const { state } = useCourse()
  return (
    <>
      <PageHeader eyebrow="Complete personalized Python path" title="Course map" description="Twelve stages and 170+ lessons move from diagnostic repair through professional Python, data, AI, projects, and certification readiness." />
      <div className="stage-list">
        {stages.map((stage) => {
          const stageModules = modules.filter((item) => stage.moduleIds.includes(item.id))
          const completion = stageCompletion(state, stage.id)
          return (
            <section className="stage-card" key={stage.id} style={{ '--stage-accent': stage.accent } as React.CSSProperties}>
              <header><div className="stage-number">{String(stage.order + 1).padStart(2, '0')}</div><div><p className="eyebrow">Stage {stage.order}</p><h2>{stage.title}</h2><p>{stage.description}</p>{stage.assessmentId && <Link className="stage-assessment-link" to={`/assessment/${stage.assessmentId}`}><ClipboardCheck size={14} /> Stage readiness assessment</Link>}</div><ProgressBar label="Stage progress" value={completion} /></header>
              <div className="module-grid">
                {stageModules.map((item) => {
                  const moduleLessons = item.lessonIds.map((id) => lessons.find((lesson) => lesson.id === id)).filter(Boolean)
                  const complete = moduleLessons.every((lesson) => lesson && state.completedLessons.includes(lesson.id))
                  const ready = item.prerequisiteIds.every((prerequisiteId) => {
                    const prerequisite = modules.find((module) => module.id === prerequisiteId)
                    return prerequisite?.lessonIds.every((lessonId) => state.completedLessons.includes(lessonId))
                  })
                  const project = projectById[item.projectId]
                  return <article className="module-card" key={item.id}>
                    <div><span className={`module-status ${complete ? 'complete' : ''}`}>{complete ? <Check size={14} /> : ready ? <ChevronRight size={13} /> : <LockKeyhole size={13} />}{complete ? 'Complete' : ready ? 'Ready' : 'Prerequisite locked'}</span><small>{moduleLessons.reduce((sum, lesson) => sum + (lesson?.minutes ?? 0), 0)} min</small></div>
                    <h3>{item.title}</h3><p>{item.description}</p>
                    <ul>{moduleLessons.map((lesson) => lesson && <li key={lesson.id}>{ready || complete ? <Link to={`/lesson/${lesson.id}`}><span>{state.completedLessons.includes(lesson.id) ? <Check size={14} /> : <ChevronRight size={14} />}{lesson.title}</span><small>{lesson.minutes}m</small></Link> : <span className="locked-lesson"><span><LockKeyhole size={13} />{lesson.title}</span><small>{lesson.minutes}m</small></span>}</li>)}</ul>
                    <footer><strong>Boss challenge</strong><p>{item.bossChallenge}</p>{item.bossAssessmentId && <Link className="module-assessment-link" to={`/assessment/${item.bossAssessmentId}`}><ClipboardCheck size={14} /> Open assessment</Link>}{project && <Link to={`/projects/${project.id}`}>Project: {project.title}</Link>}</footer>
                  </article>
                })}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
