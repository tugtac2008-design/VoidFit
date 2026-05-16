import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Nutrition from './pages/Nutrition'
import Workout from './pages/Workout'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import { useStore } from './store/useStore'
import { useAuth } from './contexts/AuthContext'
import { loadFromFirestore, startStoreSync, stopStoreSync } from './lib/syncStore'

export default function App() {
  const { isOnboarded, seedDemoData } = useStore()
  const { user, loading } = useAuth()
  const syncUnsub = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!user) {
      stopStoreSync()
      if (syncUnsub.current) { syncUnsub.current(); syncUnsub.current = null }
      return
    }

    loadFromFirestore(user.uid).then(hadData => {
      if (!hadData && !isOnboarded) seedDemoData()
    })

    syncUnsub.current = startStoreSync(user.uid)
    return () => {
      if (syncUnsub.current) { syncUnsub.current(); syncUnsub.current = null }
    }
  }, [user?.uid])

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 32, height: 32, border: '2px solid #1a1a1a',
          borderTopColor: '#00d4ff', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!user) {
    return (
      <Router>
        <Login />
      </Router>
    )
  }

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
