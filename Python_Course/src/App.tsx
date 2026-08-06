import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CourseShell } from './components/layout/CourseShell'

const AssessmentPage = lazy(() => import('./pages/AssessmentPage').then((module) => ({ default: module.AssessmentPage })))
const TodayPage = lazy(() => import('./pages/TodayPage').then((module) => ({ default: module.TodayPage })))
const CourseMapPage = lazy(() => import('./pages/CourseMapPage').then((module) => ({ default: module.CourseMapPage })))
const CertificationsPage = lazy(() => import('./pages/CertificationsPage').then((module) => ({ default: module.CertificationsPage })))
const LessonPage = lazy(() => import('./pages/LessonPage').then((module) => ({ default: module.LessonPage })))
const PracticePage = lazy(() => import('./pages/PracticePage').then((module) => ({ default: module.PracticePage })))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((module) => ({ default: module.ProjectsPage })))
const ProjectWorkspacePage = lazy(() => import('./pages/ProjectWorkspacePage').then((module) => ({ default: module.ProjectWorkspacePage })))
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((module) => ({ default: module.ProgressPage })))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then((module) => ({ default: module.ResourcesPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))

export function App() {
  return (
    <Suspense fallback={<main className="route-loading" aria-live="polite">Loading course page…</main>}>
      <Routes>
        <Route element={<CourseShell />}>
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="course" element={<CourseMapPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="assessment/:assessmentId" element={<AssessmentPage />} />
          <Route path="lesson/:lessonId" element={<LessonPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectWorkspacePage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
