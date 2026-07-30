import { Navigate, Route, Routes } from 'react-router-dom'
import './styles/globals.css'
import { DashboardShell } from './components/layout/DashboardShell'
import DecisionsPage from './pages/DecisionsPage'
import InboxPage from './pages/InboxPage'
import ProjectsPage from './pages/ProjectsPage'
import ReviewPage from './pages/ReviewPage'
import SalesPage from './pages/SalesPage'
import TodayPage from './pages/TodayPage'
import WebsitePage from './pages/WebsitePage'

function App() {
  return (
    <Routes>
      <Route element={<DashboardShell />}>
        <Route index element={<Navigate replace to="/today" />} />
        <Route path="today" element={<TodayPage />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="decisions" element={<DecisionsPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="website" element={<WebsitePage />} />
        <Route path="*" element={<Navigate replace to="/today" />} />
      </Route>
    </Routes>
  )
}

export default App
