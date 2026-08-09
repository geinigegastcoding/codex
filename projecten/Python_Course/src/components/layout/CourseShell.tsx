import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function CourseShell() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true }))
  }, [location.pathname])
  return (
    <div className="course-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Sidebar />
      <main id="main-content" tabIndex={-1}><Outlet /></main>
    </div>
  )
}
