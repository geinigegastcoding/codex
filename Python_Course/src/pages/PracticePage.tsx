import { ArrowRight, BrainCircuit, CalendarClock, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { exercises } from '../content/exercises'
import { lessons } from '../content/catalog'
import { PageHeader } from '../components/layout/PageHeader'
import { useCourse } from '../state/CourseProvider'
import { recommendedExerciseIds } from '../state/adaptive-review'

export function PracticePage() {
  const { state } = useCourse()
  const recommendations = recommendedExerciseIds(state, exercises, 8)
  return (
    <>
      <PageHeader eyebrow="Adaptive repetition" title="Practice queue" description="Due skills come back at useful intervals. Weak areas are divided into smaller steps instead of hidden behind easier goals." />
      <section className="practice-intro">
        <div><BrainCircuit size={24} /><div><strong>Today’s mix</strong><p>40% due review · 30% current stage · 20% weak prerequisites · 10% interest challenge</p></div></div>
        <div><CalendarClock size={24} /><div><strong>{state.reviewQueue.filter((item) => item.dueDate <= new Date().toISOString().slice(0, 10)).length} due now</strong><p>Passing without hints moves an exercise farther into the future.</p></div></div>
        <div><Sparkles size={24} /><div><strong>Difficulty stays high</strong><p>After repeated misses, the app reveals decomposition—not the final answer.</p></div></div>
      </section>
      <div className="practice-list">
        {recommendations.map((id, index) => {
          const exercise = exercises.find((item) => item.id === id)
          const relatedLesson = lessons.find((item) => item.exerciseId === id)
          const progress = state.exerciseProgress[id]
          if (!exercise || !relatedLesson) return null
          return <article key={id}><span className="practice-index">{String(index + 1).padStart(2, '0')}</span><div><p className="eyebrow">{progress?.passed ? 'Spaced review' : 'Skill builder'}</p><h2>{exercise.title}</h2><p>{exercise.prompt}</p><div className="tag-row">{exercise.skillIds.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="practice-meta"><span>{progress?.attempts ?? 0} attempts</span><span>{progress?.hintLevel ?? 0}/3 hints used</span><Link to={`/lesson/${relatedLesson.id}`}>Practice <ArrowRight size={15} /></Link></div></article>
        })}
      </div>
    </>
  )
}
