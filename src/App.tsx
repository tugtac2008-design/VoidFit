import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Nutrition from './pages/Nutrition'
import Workout from './pages/Workout'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import { useStore } from './store/useStore'

export default function App() {
  const { isOnboarded, seedDemoData } = useStore()

  useEffect(() => {
    // Seed demo data on first load
    if (!isOnboarded) {
      seedDemoData()
    }
  }, [])

  if (!isOnboarded) {
    return (
      <Router>
        <Onboarding />
      </Router>
    )
  }

  return (
    <Router>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  )
}
