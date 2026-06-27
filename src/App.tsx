import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectData from './pages/ProjectData'
import PageAnalytics from './pages/PageAnalytics'
import NutricostDaily from './pages/NutricostDaily'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project-data" element={<ProjectData />} />
          <Route path="page-analytics" element={<PageAnalytics />} />
          <Route path="nutricost" element={<NutricostDaily />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
