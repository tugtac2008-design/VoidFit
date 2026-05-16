import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch {
      setError('Sign in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Ambient glow top */}
      <div style={{
        position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(255,144,40,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Ambient glow bottom */}
      <div style={{
        position: 'fixed', bottom: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(255,107,26,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 380, textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        {/* Hero orb */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}
        >
          <div style={{ position: 'relative', width: 120, height: 120 }}>
            {/* Outer ring */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1px solid rgba(255,144,40,0.15)',
              animation: 'orbPulse 3s ease-in-out infinite',
            }} />
            {/* Mid ring */}
            <div style={{
              position: 'absolute', inset: 12, borderRadius: '50%',
              border: '1px solid rgba(255,144,40,0.25)',
            }} />
            {/* Inner filled orb */}
            <div style={{
              position: 'absolute', inset: 24, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(255,178,96,0.9), rgba(255,107,26,0.85))',
              boxShadow: '0 0 30px rgba(255,144,40,0.6), 0 0 60px rgba(255,144,40,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}>
              {/* Lightning bolt */}
              <svg viewBox="0 0 24 24" fill="none" style={{ width: '60%', height: '60%', position: 'absolute', top: '20%', left: '20%' }}>
                <path d="M13 2L4.5 13.5H11L10 22L19.5 10H13L13 2Z" fill="white" fillOpacity="0.95" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 8 }}
        >
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 38, fontWeight: 900,
            letterSpacing: '-1px', color: '#fff',
            lineHeight: 1,
          }}>
            VOID<span style={{
              color: '#ff9028',
              textShadow: '0 0 20px rgba(255,144,40,0.5), 0 0 40px rgba(255,144,40,0.2)',
            }}>FIT</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            color: '#4a4a4a', fontSize: 12, letterSpacing: '2.5px',
            textTransform: 'uppercase', marginBottom: 44, fontWeight: 500,
          }}
        >
          Elite Performance Tracker
        </motion.p>

        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, padding: '28px 24px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p style={{ color: '#5a5a5a', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
            Sign in to sync your training data across all devices
          </p>

          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 20px',
              background: loading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, color: '#fff',
              fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.2px',
            }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.16)' } }}
            onMouseLeave={e => { if (!loading) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' } }}
          >
            {loading ? (
              <div style={{
                width: 18, height: 18, border: '2px solid #333',
                borderTopColor: '#ff9028', borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {error && (
            <p style={{ color: '#ff4d4d', fontSize: 13, marginTop: 16 }}>{error}</p>
          )}

          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <p style={{ color: '#2e2e2e', fontSize: 11, letterSpacing: '0.5px' }}>
              PRIVATE & SECURE
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </motion.div>

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}
        >
          {['Nutrition', 'Workouts', 'Progress', 'Goals'].map(tag => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '1.2px',
              textTransform: 'uppercase', color: '#333',
              padding: '4px 10px', border: '1px solid #1a1a1a', borderRadius: 20,
            }}>{tag}</span>
          ))}
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.06); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
