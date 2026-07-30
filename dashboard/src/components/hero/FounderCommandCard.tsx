import { lazy, Suspense } from 'react'
import { ArrowDown, BrainCircuit, CheckCircle2, Database, Workflow } from 'lucide-react'
import type { FounderFocus } from '../../domain/dashboard-types'
import { StatusBadge } from '../ui/StatusBadge'

const CommandConstellation = lazy(() => import('./CommandConstellation').then((module) => ({ default: module.CommandConstellation })))

type FounderCommandCardProps = {
  focus: FounderFocus
  actionCount: number
}

export function FounderCommandCard({ focus, actionCount }: FounderCommandCardProps) {
  return (
    <section className="founder-hero" aria-labelledby="founder-focus-title">
      <div className="founder-hero__copy">
        <div className="hero-kicker"><span>Founder control</span><small>Persoonlijke demo-werkruimte</small></div>
        <p className="founder-hero__label">Commerciële north star</p>
        <h2 id="founder-focus-title">{focus.priority}</h2>
        <p>Richting voor Daniël, uitvoer voor het systeem en expliciet zicht op wat nog niet met echte data is verbonden.</p>

        <div className="focus-actions" aria-label="Campagnechecklist">
          {focus.supportingActions.map((action) => <div key={action}><CheckCircle2 aria-hidden="true" size={16} /><span>{action}</span></div>)}
        </div>

        <div className="founder-decisions">
          <section aria-labelledby="founder-decides-title">
            <div className="founder-control__heading"><BrainCircuit aria-hidden="true" size={17} /><h3 id="founder-decides-title">Daniël beslist</h3></div>
            <ul>{focus.decisions.founder.map((decision) => <li key={decision}>{decision}</li>)}</ul>
          </section>
          <section aria-labelledby="executor-proceeds-title">
            <div className="founder-control__heading"><Workflow aria-hidden="true" size={17} /><h3 id="executor-proceeds-title">Executor kan door</h3></div>
            <ul>{focus.decisions.executor.map((decision) => <li key={decision}>{decision}</li>)}</ul>
          </section>
        </div>

        <div className="founder-utility">
          <section className="data-readiness" aria-labelledby="data-readiness-title">
            <div className="founder-control__heading"><Database aria-hidden="true" size={17} /><h3 id="data-readiness-title">Datagereedheid</h3></div>
            <div>{focus.evidenceReadiness.map((source) => (
              <div key={source.label}><span>{source.label}</span><StatusBadge tone={source.status === 'demo' ? 'neutral' : 'warning'} label={source.status === 'demo' ? 'Demo' : 'Niet gekoppeld'} /></div>
            ))}</div>
          </section>
          <blockquote><span>Wekelijkse reflectievraag</span>{focus.weeklyReviewPrompt}</blockquote>
        </div>

        <a className="primary-link" href="#sales">Bekijk {actionCount} acties van vandaag <ArrowDown aria-hidden="true" size={16} /></a>
      </div>
      <div className="founder-hero__visual">
        <Suspense fallback={<div className="constellation constellation--loading" aria-hidden="true"><span>Operationeel netwerk laden…</span></div>}>
          <CommandConstellation />
        </Suspense>
      </div>
    </section>
  )
}
