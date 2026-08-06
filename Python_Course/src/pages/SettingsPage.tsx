import { useRef, useState } from 'react'
import { CalendarOff, Download, RotateCcw, ShieldCheck, Upload } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { useCourse } from '../state/CourseProvider'
import { exportCourseState, parseImportedState } from '../state/course-storage'

const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export function SettingsPage() {
  const { state, updatePreferences, importState, reset } = useCourse()
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function downloadProgress() {
    const blob = new Blob([exportCourseState(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `python-path-progress-${new Date().toISOString().slice(0,10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function importProgress(file?: File) {
    if (!file) return
    try { importState(parseImportedState(await file.text())); setMessage('Progress imported successfully.') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Import failed.') }
  }

  function toggleRest(day: number) {
    const current = state.preferences.restDays
    const next = current.includes(day) ? current.filter((item) => item !== day) : current.length < 2 ? [...current, day] : current
    updatePreferences({ restDays: next })
  }

  return (
    <>
      <PageHeader eyebrow="Local and under your control" title="Course settings" description="Progress stays in this browser. Configure a sustainable routine and export backups before clearing browser data." />
      <div className="settings-grid">
        <section className="settings-card"><div className="section-title"><CalendarOff size={20} /><div><p className="eyebrow">Sustainable streaks</p><h2>Rest days</h2></div></div><p>Choose up to two recurring rest days. They preserve the streak without adding a study day.</p><div className="weekday-picker">{weekdays.map((day,index) => <button key={day} aria-pressed={state.preferences.restDays.includes(index)} onClick={() => toggleRest(index)}>{day}</button>)}</div></section>
        <section className="settings-card"><div className="section-title"><ShieldCheck size={20} /><div><p className="eyebrow">Pause without punishment</p><h2>Vacation protection</h2></div></div><p>Vacation dates preserve the streak and award no fake activity or XP.</p><div className="date-grid"><label>Start<input type="date" value={state.preferences.vacationStart} onChange={(event) => updatePreferences({ vacationStart: event.target.value })} /></label><label>End<input type="date" value={state.preferences.vacationEnd} onChange={(event) => updatePreferences({ vacationEnd: event.target.value })} /></label></div><label className="check-row"><input type="checkbox" checked={state.preferences.streakShields} onChange={(event) => updatePreferences({ streakShields: event.target.checked })} />Use earned streak shields automatically</label></section>
        <section className="settings-card"><div className="section-title"><Download size={20} /><div><p className="eyebrow">Browser-local data</p><h2>Backup and restore</h2></div></div><p>Export creates a readable state-v2 JSON backup containing progress, drafts, assessment attempts, certification goals, project notes, and evidence metadata. It never contains API keys or project file contents, and v1 backups migrate on import.</p><div className="button-row"><button className="secondary-button" onClick={downloadProgress}><Download size={16} />Export progress</button><button className="secondary-button" onClick={() => fileRef.current?.click()}><Upload size={16} />Import progress</button><input ref={fileRef} hidden type="file" accept="application/json" onChange={(event) => void importProgress(event.target.files?.[0])} /></div>{message && <p role="status" className="settings-message">{message}</p>}</section>
        <section className="settings-card settings-card--danger"><div className="section-title"><RotateCcw size={20} /><div><p className="eyebrow">Danger zone</p><h2>Reset the course</h2></div></div><p>This removes local progress, drafts, streaks, and settings. Export first if you may want them later.</p><button className="danger-button" onClick={() => { if (window.confirm('Reset all local Python Path progress? This cannot be undone without an export.')) reset() }}><RotateCcw size={16} />Reset local progress</button></section>
      </div>
    </>
  )
}
