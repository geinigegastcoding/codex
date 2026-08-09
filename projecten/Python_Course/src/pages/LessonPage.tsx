import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Gauge, LockKeyhole, Target } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { lessonById, lessons, moduleById } from '../content/catalog'
import { exerciseById } from '../content/exercises'
import { useCourse } from '../state/CourseProvider'
import { LessonRunner } from '../components/lesson/LessonRunner'
import { ResourceLinks } from '../components/lesson/ResourceLinks'

export function LessonPage() {
  const { lessonId } = useParams()
  const { state, completeLesson } = useCourse()
  const current = lessonId ? lessonById[lessonId] : undefined
  if (!current) return <Navigate to="/course" replace />
  const module = moduleById[current.moduleId]
  const moduleReady = module.prerequisiteIds.every((prerequisiteId) => moduleById[prerequisiteId]?.lessonIds.every((id) => state.completedLessons.includes(id)))
  if (!moduleReady) return <section className="locked-content"><LockKeyhole size={28} /><p className="eyebrow">Prerequisite locked</p><h1 tabIndex={-1}>{current.title}</h1><p>Complete the prerequisite modules before opening this lesson. The course map shows the next available path.</p><Link className="primary-link" to="/course">Return to course map</Link></section>
  const index = lessons.findIndex((item) => item.id === current.id)
  const previous = lessons[index - 1]
  const next = lessons[index + 1]
  const exercise = current.exerciseId ? exerciseById[current.exerciseId] : undefined
  const evidenceAssessment = current.evidence?.find((evidence) => evidence.required && evidence.kind === 'assessment')
  const exercisePassed = !exercise || state.exerciseProgress[exercise.id]?.passed === true
  const complete = state.completedLessons.includes(current.id)
  return (
    <>
      <nav className="lesson-breadcrumb" aria-label="Lesson breadcrumb"><Link to="/course">Course map</Link><span>/</span><span>{module.title}</span></nav>
      <header className="lesson-header">
        <div><p className="eyebrow">{current.kind.replace('-', ' ')} · {module.title}</p><h1 tabIndex={-1}>{current.title}</h1><p>{current.subtitle}</p></div>
        <div className="lesson-meta"><span><Clock3 size={15} />{current.minutes} min</span><span><Gauge size={15} />Difficulty {current.difficulty}/5</span><span><Target size={15} />{current.skillIds.join(' · ')}</span></div>
      </header>
      <section className="lesson-overview">
        <article><p className="eyebrow">Challenge first</p><h2>Try before the explanation</h2><p>{current.challenge}</p></article>
        <article><p className="eyebrow">Learning goals</p><ul>{current.objectives.map((objective) => <li key={objective}><CheckCircle2 size={15} />{objective}</li>)}</ul></article>
      </section>
      {exercise && <LessonRunner key={exercise.id} exercise={exercise} />}
      <section className="lesson-theory">
        <div><p className="eyebrow">Build the mental model</p><h2>Why this works</h2>{current.explanation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <pre><code>{current.example}</code></pre>
      </section>
      <ResourceLinks ids={current.resourceIds} />
      <section className="lesson-complete">
        <div><p className="eyebrow">Evidence check</p><h2>{evidenceAssessment ? 'Pass the module assessment' : exercise ? 'Prove the exercise first' : 'Explain it without looking'}</h2><p>{evidenceAssessment ? 'This lesson is completed automatically when you pass the shared module boss assessment.' : exercise ? 'The completion control unlocks only after the browser checker accepts your solution.' : 'Say the central rule aloud and name one edge case before recording this retrieval check.'}</p></div>
        {evidenceAssessment ? <Link className={complete ? 'complete-button is-complete' : 'complete-button'} to={`/assessment/${evidenceAssessment.referenceId}`}><CheckCircle2 size={18} />{complete ? 'Assessment passed' : 'Open module assessment'}</Link> : <button className={complete ? 'complete-button is-complete' : 'complete-button'} onClick={() => completeLesson(current.id)} disabled={complete || !exercisePassed}><CheckCircle2 size={18} />{complete ? 'Lesson completed' : exercisePassed ? 'Record lesson evidence' : 'Pass exercise to continue'}</button>}
      </section>
      <nav className="lesson-pagination" aria-label="Lesson navigation">
        {previous ? <Link to={`/lesson/${previous.id}`}><ArrowLeft size={16} /><span><small>Previous</small>{previous.title}</span></Link> : <span />}
        {next && <Link to={`/lesson/${next.id}`}><span><small>Next</small>{next.title}</span><ArrowRight size={16} /></Link>}
      </nav>
    </>
  )
}
