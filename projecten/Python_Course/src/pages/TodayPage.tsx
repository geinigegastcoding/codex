import { ArrowRight, Award, BookOpenCheck, BrainCircuit, Flame, FolderKanban, Gauge, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons } from '../content/catalog'
import { exercises } from '../content/exercises'
import { placement } from '../content/diagnostic'
import { certificationById, simulationByCertification } from '../content/certifications'
import { projects } from '../content/projects'
import { useCourse } from '../state/CourseProvider'
import { courseCompletion, levelForXp } from '../state/selectors'
import { recommendedExerciseIds } from '../state/adaptive-review'
import { PageHeader } from '../components/layout/PageHeader'
import { StatTile } from '../components/progress/StatTile'
import { ProgressBar } from '../components/progress/ProgressBar'

export function TodayPage() {
  const { state } = useCourse()
  const nextLesson = lessons.find((item) => !state.completedLessons.includes(item.id)) ?? lessons[0]
  const recommended = recommendedExerciseIds(state, exercises, 3)
  const due = state.reviewQueue.filter((item) => item.dueDate <= new Date().toISOString().slice(0, 10)).length
  const activeProject = projects.find((project) => state.projectProgress[project.id]?.status === 'in-progress')
  const activeMilestone = activeProject?.milestones.find((item) => state.projectProgress[activeProject.id]?.milestones[item.id]?.status !== 'verified-complete')
  const certificationGoal = state.certificationGoals[0] ? certificationById[state.certificationGoals[0].certificationId] : undefined
  return (
    <>
      <PageHeader eyebrow="Personal learning dashboard" title="Ready for your next Python challenge?" description="A focused 60-minute path: warm up, learn one idea, then build something with it." />
      <section className="stat-grid" aria-label="Learning summary">
        <StatTile label="Current streak" value={`${state.currentStreak} days`} detail="Rest and vacation days can protect it." icon={Flame} tone="positive" />
        <StatTile label="Level" value={levelForXp(state.xp)} detail={`${state.xp} experience points earned.`} icon={Trophy} />
        <StatTile label="Course" value={`${courseCompletion(state)}%`} detail={`${state.completedLessons.length} of ${lessons.length} lessons complete.`} icon={Gauge} />
        <StatTile label="Review queue" value={due} detail="Due exercises are mixed into today’s session." icon={BrainCircuit} tone={due ? 'attention' : 'default'} />
      </section>
      <section className="today-grid">
        <article className="focus-card">
          <div className="focus-card__top"><span className="status-pill">Next lesson</span><span>{nextLesson.minutes} min · difficulty {nextLesson.difficulty}/5</span></div>
          <p className="eyebrow">{placement.title}</p>
          <h2>{nextLesson.title}</h2>
          <p>{nextLesson.subtitle}</p>
          <div className="session-steps">
            <div><span>01</span><div><strong>Warm-up</strong><p>Trace one short program and retrieve yesterday’s idea.</p></div><small>10 min</small></div>
            <div className="is-active"><span>02</span><div><strong>{nextLesson.title}</strong><p>{nextLesson.challenge}</p></div><small>{nextLesson.minutes} min</small></div>
            <div><span>03</span><div><strong>Adaptive practice</strong><p>Three exercises selected from weak or due skills.</p></div><small>20 min</small></div>
          </div>
          <Link className="primary-link" to={`/lesson/${nextLesson.id}`}>Start lesson <ArrowRight size={17} /></Link>
        </article>
        <aside className="today-side">
          <article className="panel placement-card">
            <p className="eyebrow">Diagnostic result</p><h2>{placement.title}</h2><p>{placement.summary}</p>
            <ProgressBar label={state.placementCalibrated ? 'Placement calibrated' : 'Calibration evidence'} value={state.placementCalibrated ? 100 : Math.min(100, Object.values(state.exerciseProgress).filter((item) => item.passed).length * 10)} />
            <Link to="/progress">See full skill rubric <ArrowRight size={15} /></Link>
          </article>
          <article className="panel review-card">
            <div className="section-title"><BookOpenCheck size={18} /><div><p className="eyebrow">Recommended</p><h2>Practice next</h2></div></div>
            <ol>{recommended.map((id) => { const exercise = exercises.find((item) => item.id === id); const related = lessons.find((item) => item.exerciseId === id); return exercise && related ? <li key={id}><Link to={`/lesson/${related.id}`}><span>{exercise.title}</span><small>{exercise.skillIds.join(' · ')}</small></Link></li> : null })}</ol>
          </article>
          {activeProject && activeMilestone && <article className="panel placement-card"><div className="section-title"><FolderKanban size={18} /><div><p className="eyebrow">Active project</p><h2>{activeMilestone.title}</h2></div></div><p>{activeProject.title} · {activeMilestone.summary}</p><Link to={`/projects/${activeProject.id}`}>Continue milestone <ArrowRight size={15} /></Link></article>}
          {certificationGoal && simulationByCertification[certificationGoal.id] && <article className="panel placement-card"><div className="section-title"><Award size={18} /><div><p className="eyebrow">Certification drill</p><h2>{certificationGoal.title}</h2></div></div><p>Use an original objective-based practice attempt to update readiness evidence.</p><Link to={`/assessment/${simulationByCertification[certificationGoal.id]}`}>Start practice simulation <ArrowRight size={15} /></Link></article>}
        </aside>
      </section>
    </>
  )
}
