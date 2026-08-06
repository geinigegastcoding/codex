import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Braces, CheckCircle2, ChevronRight, Circle, Clock3, Lightbulb, ListChecks, LoaderCircle, Play, RotateCcw, TestTube2 } from 'lucide-react'
import type { Exercise } from '../../domain/course-types'
import type { CheckerResult } from '../../checker/worker-protocol'
import { feedbackFor } from '../../checker/feedback'
import { pythonChecker } from '../../checker/checker-client'
import { useCourse } from '../../state/CourseProvider'
import { buildExerciseBrief } from './exercise-brief'

export function LessonRunner({ exercise }: { exercise: Exercise }) {
  const { state, recordAttempt, unlockHint } = useCourse()
  const saved = state.exerciseProgress[exercise.id]
  const [code, setCode] = useState(saved?.draft || exercise.starterCode)
  const [checkerState, setCheckerState] = useState<'loading' | 'ready' | 'running' | 'error'>('loading')
  const [startupError, setStartupError] = useState('')
  const [result, setResult] = useState<CheckerResult | null>(null)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    let active = true
    pythonChecker.start().then(() => { if (active) setCheckerState('ready') }).catch((error: unknown) => {
      if (!active) return
      setStartupError(error instanceof Error ? error.message : String(error))
      setCheckerState('error')
    })
    return () => { active = false }
  }, [])

  const feedback = result ? feedbackFor(result) : null
  const brief = useMemo(() => buildExerciseBrief(exercise), [exercise])
  const hintLevel = saved?.hintLevel ?? 0
  const visibleHints = exercise.hints.slice(0, hintLevel)
  const allPassed = result?.status === 'passed'

  function handleEditorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Tab') return

    event.preventDefault()
    const editor = event.currentTarget
    const start = editor.selectionStart
    const end = editor.selectionEnd
    const indentation = '    '
    setCode(`${code.slice(0, start)}${indentation}${code.slice(end)}`)
    requestAnimationFrame(() => editor.setSelectionRange(start + indentation.length, start + indentation.length))
  }

  async function runCode() {
    setCheckerState('running')
    const nextResult = await pythonChecker.run(code, exercise)
    setResult(nextResult)
    setCheckerState('ready')
    const passed = nextResult.status === 'passed'
    recordAttempt({ exercise, passed, code, seconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)) })
    if (!passed) {
      const nextHint = Math.min(3, (saved?.hintLevel ?? 0) + 1) as 1 | 2 | 3
      unlockHint(exercise.id, nextHint)
    }
  }

  const statusLabel = useMemo(() => {
    if (checkerState === 'loading') return 'Starting Python…'
    if (checkerState === 'running') return 'Running checks…'
    if (checkerState === 'error') return 'Python failed to start'
    return 'Python ready'
  }, [checkerState])

  return (
    <section className="runner" aria-labelledby="challenge-heading">
      <div className="runner__brief">
        <p className="eyebrow">Coding challenge</p>
        <h2 id="challenge-heading">{exercise.title}</h2>

        <section className="challenge-section challenge-section--task" aria-labelledby={`task-${exercise.id}`}>
          <h3 id={`task-${exercise.id}`}>Your task</h3>
          <p>{exercise.prompt}</p>
        </section>

        <section className="challenge-section" aria-labelledby={`contract-${exercise.id}`}>
          <div className="challenge-section__heading"><Braces size={17} /><h3 id={`contract-${exercise.id}`}>Function contract</h3></div>
          <pre className="function-signature"><code>{brief.signature}</code></pre>
          <p>{brief.contract}</p>
        </section>

        <section className="challenge-section" aria-labelledby={`checklist-${exercise.id}`}>
          <div className="challenge-section__heading"><ListChecks size={17} /><h3 id={`checklist-${exercise.id}`}>Implementation checklist</h3><span>{brief.checklist.length} requirements</span></div>
          <ul className="requirement-list">
            {brief.checklist.map((item) => <li key={item.title}><Circle size={13} /><div><strong>{item.title}</strong><code>{item.behavior}</code>{item.note && <small>{item.note}</small>}</div></li>)}
          </ul>
        </section>

        <section className="challenge-section" aria-labelledby={`example-${exercise.id}`}>
          <div className="challenge-section__heading"><TestTube2 size={17} /><h3 id={`example-${exercise.id}`}>Concrete example</h3></div>
          <code className="challenge-example">{brief.example}</code>
        </section>

        <section className="challenge-section" aria-labelledby={`checking-${exercise.id}`}>
          <div className="challenge-section__heading"><TestTube2 size={17} /><h3 id={`checking-${exercise.id}`}>How checking works</h3></div>
          <ul className="checking-notes">{brief.checkingNotes.map((note) => <li key={note}>{note}</li>)}</ul>
        </section>

        <div className="hint-stack">
          <div className="hint-heading"><Lightbulb size={17} /><strong>Guided hints</strong><span>{hintLevel}/3 unlocked</span></div>
          {visibleHints.length === 0 ? <p>One conceptual hint unlocks after your first unsuccessful attempt.</p> : visibleHints.map((hint, index) => <div className="hint" key={hint}><span>{index + 1}</span><p>{hint}</p></div>)}
        </div>
      </div>
      <div className="runner__workspace">
        <div className="editor-toolbar">
          <div className={`runtime-status runtime-status--${checkerState}`}><span />{statusLabel}</div>
          <button type="button" className="ghost-button" onClick={() => { setCode(exercise.starterCode); setResult(null) }}><RotateCcw size={14} /> Reset</button>
        </div>
        <label className="editor-label" htmlFor={`editor-${exercise.id}`}>Python solution</label>
        <textarea id={`editor-${exercise.id}`} className="code-editor" value={code} onChange={(event) => setCode(event.target.value)} onKeyDown={handleEditorKeyDown} spellCheck={false} aria-describedby={`editor-help-${exercise.id}`} />
        {checkerState === 'error' && <p className="runtime-error" role="alert">Python could not start: {startupError || 'Unknown startup error'}</p>}
        <div className="editor-actions">
          <span id={`editor-help-${exercise.id}`}><Clock3 size={14} /> Automatic timeout: {(exercise.timeoutMs ?? 3000) / 1000}s</span>
          <button type="button" className="primary-button" disabled={checkerState !== 'ready'} onClick={runCode}>
            {checkerState === 'running' ? <LoaderCircle className="spin" size={17} /> : <Play size={17} />} Run checks
          </button>
        </div>
        {result && feedback && (
          <div className={`feedback feedback--${feedback.tone}`} role={feedback.tone === 'error' ? 'alert' : 'status'} aria-live="polite">
            <div>{allPassed ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}<div><strong>{feedback.title}</strong><p>{feedback.message}</p></div></div>
            {result.tests.length > 0 && <ul>{result.tests.map((test) => <li key={test.name} className={test.passed ? 'passed' : 'failed'}><span>{test.passed ? 'Pass' : 'Check'}</span><div><strong>{test.name}</strong><small>{test.message}</small></div></li>)}</ul>}
            {result.stdout && <details><summary>Program output</summary><pre>{result.stdout}</pre></details>}
          </div>
        )}
      </div>
    </section>
  )
}
