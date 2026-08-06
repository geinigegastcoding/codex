import { useState } from 'react'
import { Award, BarChart3, BookCheck, Flame, FolderCheck, Lightbulb, List, Trophy } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { diagnosticSkills, placement } from '../content/diagnostic'
import { lessons } from '../content/catalog'
import { exercises } from '../content/exercises'
import { certificationById } from '../content/certifications'
import { projects } from '../content/projects'
import { PageHeader } from '../components/layout/PageHeader'
import { StatTile } from '../components/progress/StatTile'
import { ActivityHeatmap } from '../components/progress/ActivityHeatmap'
import { useCourse } from '../state/CourseProvider'
import { addLocalDays, localDateKey } from '../state/adaptive-review'
import { certificationReadiness } from '../state/certification-readiness'
import { courseCompletion, levelForXp } from '../state/selectors'

export function ProgressPage() {
  const { state } = useCourse()
  const [weeklyView, setWeeklyView] = useState<'chart' | 'table'>('chart')
  const [masteryView, setMasteryView] = useState<'chart' | 'table'>(() => window.matchMedia('(max-width: 560px)').matches ? 'table' : 'chart')
  const weekly = Array.from({ length: 7 }, (_, index) => {
    const date = addLocalDays(localDateKey(), index - 6)
    const activity = state.activityByDate[date]
    return { date: date.slice(5), minutes: activity?.minutes ?? 0, attempts: activity?.attempts ?? 0, passed: activity?.passed ?? 0 }
  })
  const mastery = diagnosticSkills.map((skill) => ({ skill: skill.label, mastery: Math.round((state.skillMastery[skill.skillId] ?? 0) * 100), status: skill.status }))
  const passed = Object.values(state.exerciseProgress).filter((item) => item.passed).length
  const hintUses = Object.values(state.exerciseProgress).reduce((sum, item) => sum + item.hintLevel, 0)
  const verifiedProjects = projects.filter((project) => state.projectProgress[project.id]?.status === 'verified-complete').length
  const goalScores = state.certificationGoals.map((goal) => certificationById[goal.certificationId]).filter(Boolean).map((certification) => certificationReadiness(state, certification).score)
  const goalReadiness = goalScores.length ? Math.round(goalScores.reduce((sum, score) => sum + score, 0) / goalScores.length) : 0
  return (
    <>
      <PageHeader eyebrow="Evidence, not pressure" title="Your progress" description="Use these statistics to choose the next useful challenge—not to punish rest or chase empty numbers." />
      <section className="stat-grid">
        <StatTile label="Current streak" value={`${state.currentStreak} days`} detail={`Longest: ${state.longestStreak} days. Protected rest is healthy.`} icon={Flame} tone="positive" />
        <StatTile label="Level" value={levelForXp(state.xp)} detail={`${state.xp} XP from practice and projects.`} icon={Trophy} />
        <StatTile label="Lessons" value={`${state.completedLessons.length}/${lessons.length}`} detail={`${courseCompletion(state)}% of the complete course path.`} icon={BookCheck} />
        <StatTile label="Exercises passed" value={`${passed}/${exercises.length}`} detail={`${hintUses} guided hint steps used.`} icon={Lightbulb} />
        <StatTile label="Verified projects" value={`${verifiedProjects}/${projects.length}`} detail="Completion requires milestone evidence, not a manual checkbox." icon={FolderCheck} />
        <StatTile label="Goal readiness" value={`${goalReadiness}%`} detail={goalScores.length ? `${goalScores.length} selected certification goal${goalScores.length === 1 ? '' : 's'}.` : 'Select a certification goal to track objective evidence.'} icon={Award} />
      </section>
      <section className="progress-grid">
        <article className="chart-card chart-card--wide">
          <header><div><p className="eyebrow">Consistency</p><h2>Last 12 weeks</h2><p>Activity intensity uses attempts or active minutes. Empty days are neutral.</p></div></header>
          <ActivityHeatmap activity={state.activityByDate} />
        </article>
        <article className="chart-card">
          <header><div><p className="eyebrow">Weekly activity</p><h2>Minutes and practice</h2><p>A single-axis time trend. Attempt counts remain in the table.</p></div><button onClick={() => setWeeklyView(weeklyView === 'chart' ? 'table' : 'chart')}>{weeklyView === 'chart' ? <List size={15} /> : <BarChart3 size={15} />}{weeklyView === 'chart' ? 'Table' : 'Chart'}</button></header>
          {weeklyView === 'chart' ? <div className="chart-frame"><ResponsiveContainer><LineChart data={weekly}><CartesianGrid stroke="#1a3026" vertical={false} /><XAxis dataKey="date" stroke="#7f9588" /><YAxis stroke="#7f9588" allowDecimals={false} /><Tooltip contentStyle={{ background:'#0b1812', border:'1px solid #315443', borderRadius:10 }} /><Line type="monotone" dataKey="minutes" stroke="#25825a" strokeWidth={2} dot={{ r: 4, fill:'#25825a' }} /></LineChart></ResponsiveContainer></div> : <DataTable rows={weekly} columns={['date','minutes','attempts','passed']} caption="Activity during the last seven days" />}
        </article>
        <article className="chart-card chart-card--wide">
          <header><div><p className="eyebrow">Diagnostic + attempts</p><h2>Skill mastery</h2><p>{state.placementCalibrated ? 'Placement calibrated from at least ten passed exercises.' : placement.calibration}</p></div><button onClick={() => setMasteryView(masteryView === 'chart' ? 'table' : 'chart')}>{masteryView === 'chart' ? <List size={15} /> : <BarChart3 size={15} />}{masteryView === 'chart' ? 'Table' : 'Chart'}</button></header>
          {masteryView === 'chart' ? <div className="chart-frame chart-frame--tall"><ResponsiveContainer><BarChart data={mastery} layout="vertical" margin={{ left: 110, right: 24 }}><CartesianGrid stroke="#1a3026" horizontal={false} /><XAxis type="number" domain={[0,100]} stroke="#7f9588" /><YAxis type="category" dataKey="skill" width={105} stroke="#b1c2b8" tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ background:'#0b1812', border:'1px solid #315443', borderRadius:10 }} /><Bar dataKey="mastery" fill="#45b97c" radius={[0,4,4,0]} /></BarChart></ResponsiveContainer></div> : <DataTable rows={mastery} columns={['skill','mastery','status']} caption="Current mastery by skill" />}
        </article>
      </section>
      <section className="rubric-list"><header><p className="eyebrow">Why you started here</p><h2>Diagnostic evidence</h2></header>{diagnosticSkills.map((skill) => <article key={skill.skillId}><div><strong>{skill.label}</strong><span className={`rubric-status rubric-status--${skill.status}`}>{skill.status.replace('-', ' ')}</span></div><p>{skill.evidence}</p></article>)}</section>
    </>
  )
}

function DataTable({ rows, columns, caption }: { rows: Record<string, unknown>[]; columns: string[]; caption: string }) {
  return <div className="chart-table-wrap"><table className="chart-table"><caption>{caption}</caption><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{columns.map((column) => <td key={column}>{String(row[column] ?? '')}</td>)}</tr>)}</tbody></table></div>
}
