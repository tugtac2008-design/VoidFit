import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Chrome } from 'lucide-react'
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
    } catch (e: unknown) {
      setError('Sign in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0,212,255,0.15)',
          }}>
            <Zap size={36} style={{ color: '#00d4ff', filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.8))' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 32, fontWeight: 900,
            letterSpacing: '-0.5px', color: '#fff',
            margin: '0 0 8px',
          }}>
            VOID<span style={{ color: '#00d4ff', filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.6))' }}>FIT</span>
          </h1>
          <p style={{ color: '#525252', fontSize: 14, margin: '0 0 40px', letterSpacing: '0.3px' }}>
            Elite fitness tracking for serious athletes
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #1a1a1a',
            borderRadius: 16, padding: '32px 24px',
          }}
        >
          <p style={{ color: '#737373', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
            Sign in to sync your data across all your devices
          </p>

          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 20px',
              background: loading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12, color: '#fff',
              fontSize: 15, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => !loading && ((e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => !loading && ((e.target as HTMLElement).style.background = 'rgba(255,255,255,0.06)')}
          >
            {loading ? (
              <div style={{
                width: 18, height: 18, border: '2px solid #333',
                borderTopColor: '#00d4ff', borderRadius: '50%',
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

          <p style={{ color: '#3a3a3a', fontSize: 11, marginTop: 24, lineHeight: 1.6 }}>
            Your data is private and stored securely in your account
          </p>
        </motion.div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
