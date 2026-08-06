import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import { CourseProvider } from './state/CourseProvider'
import { validateCatalog } from './content/catalog'
import './styles/globals.css'

validateCatalog()

createRoot(document.getElementById('root')!).render(
  <StrictMode><HashRouter><CourseProvider><App /></CourseProvider></HashRouter></StrictMode>,
)
