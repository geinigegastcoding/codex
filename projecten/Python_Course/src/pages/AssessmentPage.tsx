import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { assessmentById } from '../content/assessments'
import { PageHeader } from '../components/layout/PageHeader'
import { useCourse } from '../state/CourseProvider'

export function AssessmentPage() {
  const { assessmentId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const assessment = assessmentById[assessmentId]
  const timed = searchParams.get('mode') === 'timed'
  const { state, completeAssessment } = useCourse()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [startedAt] = useState(() => new Date().toISOString())
  const [elapsed, setElapsed] = useState(0)
  const [submittedScore, setSubmittedScore] = useState<number | null>(null)

  useEffect(() => {
    if (submittedScore !== null) return
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)), 1000)
    return () => window.clearInterval(timer)
  }, [startedAt, submittedScore])

  const questions = useMemo(() => assessment?.questionPool ?? [], [assessment])
  if (!assessment) return <Navigate to="/certifications" replace />
  const prerequisitesComplete = assessment.prerequisiteIds.every((id) => state.assessmentAttempts.some((attempt) => attempt.assessmentId === id && attempt.passed))
  if (!prerequisitesComplete) return <section className="locked-content"><Clock3 size={28} /><p className="eyebrow">Assessment locked</p><h1 tabIndex={-1}>{assessment.title}</h1><p>Pass the prerequisite module assessments before attempting this stage readiness check.</p><Link className="primary-link" to="/course">Return to course map</Link></section>

  function submit() {
    if (Object.keys(answers).length !== questions.length) return
    const correct = questions.filter((item) => answers[item.id] === String(item.correctIndex)).length
    const score = Math.round((correct / questions.length) * 100)
    completeAssessment(assessment, answers, score, timed, startedAt)
    setSubmittedScore(score)
  }

  return (
    <>
      <Link className="back-link" to="/certifications"><ArrowLeft size={16} /> Certification readiness</Link>
      <PageHeader eyebrow={`${assessment.kind.replace('-', ' ')} · ${timed ? 'timed' : 'untimed'}`} title={assessment.title} description={assessment.description} />
      <section className="assessment-meta"><span><Clock3 size={16} /> {timed ? `${assessment.minutes} minute target` : 'No time limit'}</span><span>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} elapsed</span><span>Pass at {assessment.passingScore}%</span></section>
      <div className="assessment-layout">
        <section className="assessment-questions">
          {questions.map((item, index) => {
            const chosen = answers[item.id]
            return <fieldset className="assessment-question" key={item.id} disabled={submittedScore !== null}><legend><span>{index + 1}</span>{item.prompt}</legend>{item.choices.map((choice, choiceIndex) => <label key={choice}><input type="radio" name={item.id} value={choiceIndex} checked={chosen === String(choiceIndex)} onChange={(event) => setAnswers((current) => ({ ...current, [item.id]: event.target.value }))} />{choice}</label>)}{submittedScore !== null && <div className={chosen === String(item.correctIndex) ? 'answer-feedback answer-feedback--correct' : 'answer-feedback answer-feedback--wrong'}>{chosen === String(item.correctIndex) ? <CheckCircle2 size={16} /> : <XCircle size={16} />}<p><strong>{chosen === String(item.correctIndex) ? 'Correct' : `Correct answer: ${item.choices[item.correctIndex]}`}</strong>{item.explanation}</p></div>}</fieldset>
          })}
        </section>
        <aside className="assessment-submit settings-card"><p className="eyebrow">Attempt evidence</p><h2>{submittedScore === null ? 'Ready to score?' : `${submittedScore}%`}</h2>{submittedScore === null ? <><p>Answer every question. Submitting stores the mode, score, answers, and completion time in your local progress.</p><button className="primary-link" disabled={Object.keys(answers).length !== questions.length} onClick={submit}>Submit {timed ? 'timed' : 'practice'} attempt</button></> : <><p>{submittedScore >= assessment.passingScore ? 'Passed. Review every explanation, including correct answers you guessed.' : 'Not passed yet. Review the explanations, revisit weak lessons, and retry with a fresh attempt.'}</p><Link className="secondary-button" to="/certifications">Return to readiness</Link></>}</aside>
      </div>
    </>
  )
}
