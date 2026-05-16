import { lazy, Suspense, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import { useStore } from './store/useStore'
import { useAuth } from './contexts/AuthContext'
import { loadFromFirestore, startStoreSync, stopStoreSync } from './lib/syncStore'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Nutrition = lazy(() => import('./pages/Nutrition'))
const Workout = lazy(() => import('./pages/Workout'))
const Progress = lazy(() => import('./pages/Progress'))
const Profile = lazy(() => import('./pages/Profile'))
const Goals = lazy(() => import('./pages/Goals'))
const Programs = lazy(() => import('./pages/Programs'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Login = lazy(() => import('./pages/Login'))

function PageLoader() {
  return (
    <div style={{
      minHeight: '60dvh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 28, height: 28, border: '2px solid #1a1a1a',
        borderTopColor: '#ff9028', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function AppSpinner() {
  return (
    <div style={{
      minHeight: '100dvh', background: '#060608',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 32, height: 32, border: '2px solid #1a1a1a',
        borderTopColor: '#ff9028', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

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

  if (loading) return <AppSpinner />

  if (!user) {
    return (
      <Router>
        <Suspense fallback={<AppSpinner />}>
          <Login />
        </Suspense>
      </Router>
    )
  }

  if (!isOnboarded) {
    return (
      <Router>
        <Suspense fallback={<AppSpinner />}>
          <Onboarding />
        </Suspense>
      </Router>
    )
  }

  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Layout>
    </Router>
  )
}
