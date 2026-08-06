import { Flame, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigation } from '../../app/navigation'
import { useCourse } from '../../state/CourseProvider'
import { levelForXp } from '../../state/selectors'

export function Sidebar() {
  const { state } = useCourse()
  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/today" aria-label="Python Path home">
        <span className="brand-mark">Py</span>
        <span className="brand-copy"><strong>Python Path</strong><small>Personal course</small></span>
      </NavLink>
      <nav aria-label="Course navigation">
        {navigation.map(({ to, label, description, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'is-active' : undefined}>
            <Icon size={18} aria-hidden="true" />
            <span><strong>{label}</strong><small>{description}</small></span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-shortcut"><Search size={15} /><span>Navigate with the course map</span></div>
      <div className="sidebar-profile">
        <span className="avatar">D</span>
        <div><strong>Level {levelForXp(state.xp)}</strong><span>{state.xp} XP · {state.currentStreak} day streak</span></div>
        <Flame size={17} aria-label={`${state.currentStreak} day streak`} />
      </div>
    </aside>
  )
}
