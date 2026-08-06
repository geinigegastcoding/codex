import { Award, Check, ExternalLink, Flag, Info, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { certifications, simulationByCertification } from '../content/certifications'
import type { CredentialStatus } from '../domain/course-types'
import { PageHeader } from '../components/layout/PageHeader'
import { ProgressBar } from '../components/progress/ProgressBar'
import { useCourse } from '../state/CourseProvider'
import { certificationReadiness } from '../state/certification-readiness'

const statusLabels: Record<CredentialStatus, string> = {
  active: 'Active target',
  preview: 'Preview / in development',
  'optional-specialist': 'Optional specialist',
  historical: 'Retired / historical',
  closed: 'Exam closed',
}

export function CertificationsPage() {
  const { state, toggleCertificationGoal } = useCourse()
  const selected = new Set(state.certificationGoals.map((goal) => goal.certificationId))
  return (
    <>
      <PageHeader eyebrow="Objective coverage, not promises" title="Certification readiness" description="Choose useful external goals and track evidence against their published domains. A readiness score shows course evidence—not a guarantee that an exam will be passed." />
      <section className="certification-notice"><Info size={18} /><p>Profiles were last checked on July 30, 2026. Questions and exercises in this course are original and mapped to public objectives; protected exam questions are never reproduced.</p></section>
      <div className="certification-list">
        {certifications.map((certification) => {
          const readiness = certificationReadiness(state, certification)
          const isSelected = selected.has(certification.id)
          const canSelect = certification.status === 'active' || certification.status === 'optional-specialist'
          return <article className="certification-card" key={certification.id}>
            <header><div className="certification-provider"><Award size={20} /><div><p className="eyebrow">{certification.provider}{certification.examCode ? ` · ${certification.examCode}` : ''}</p><h2>{certification.title}</h2></div></div><span className={`credential-status credential-status--${certification.status}`}>{statusLabels[certification.status]}</span></header>
            <p>{certification.summary}</p>
            <div className="certification-summary"><ProgressBar label={`${readiness.score}% evidence readiness`} value={readiness.score} /><span>{readiness.mappedEvidence} mapped evidence items</span></div>
            <div className="certification-objectives">
              {certification.objectives.map((objective, index) => {
                const result = readiness.objectives[index]
                return <details key={objective.id}><summary><span><strong>{objective.title}</strong><small>{objective.weight}% of profile</small></span><span>{result.completedEvidence}/{result.totalEvidence} · {result.score}%</span></summary><p>{objective.description}</p>{result.missing.length ? <><strong>Evidence still needed</strong><ul>{result.missing.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul>{result.missing.length > 6 && <small>And {result.missing.length - 6} more mapped items.</small>}</> : <p className="certification-complete"><Check size={15} /> All currently mapped evidence is complete.</p>}</details>
              })}
            </div>
            <footer><div className="certification-actions">{canSelect ? <button className={isSelected ? 'secondary-button' : 'primary-link'} onClick={() => toggleCertificationGoal(certification.id)}><Flag size={16} /> {isSelected ? 'Remove goal' : 'Set as goal'}</button> : <span>This credential cannot be selected as an active goal.</span>}{simulationByCertification[certification.id] && <><Link className="secondary-button" to={`/assessment/${simulationByCertification[certification.id]}`}>Practice simulation</Link><Link className="secondary-button" to={`/assessment/${simulationByCertification[certification.id]}?mode=timed`}><Timer size={15} /> Timed simulation</Link></>}</div><a href={certification.officialUrl} target="_blank" rel="noreferrer">Official profile <ExternalLink size={14} /></a></footer>
          </article>
        })}
      </div>
    </>
  )
}
