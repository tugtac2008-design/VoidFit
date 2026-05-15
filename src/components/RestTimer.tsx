import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, X } from 'lucide-react'
import { formatSeconds } from '../utils/format'

interface Props {
  defaultSeconds?: number
  onClose: () => void
}

export default function RestTimer({ defaultSeconds = 90, onClose }: Props) {
  const [total, setTotal] = useState(defaultSeconds)
  const [remaining, setRemaining] = useState(defaultSeconds)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          setRunning(false)
          clearInterval(id)
          // Play beep
          try {
            const ctx = new AudioContext()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.value = 880
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
            osc.start()
            osc.stop(ctx.currentTime + 0.5)
          } catch {}
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const reset = useCallback(() => {
    setRemaining(total)
    setRunning(true)
  }, [total])

  const pct = remaining / total
  const circumference = 2 * Math.PI * 54
  const offset = circumference * pct
  const isDone = remaining === 0

  const PRESETS = [30, 60, 90, 120, 180]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 card p-5 w-64"
      style={{ borderColor: isDone ? 'rgba(0,255,135,0.4)' : 'rgba(0,212,255,0.2)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-void-600 uppercase tracking-widest">Rest Timer</span>
        <button onClick={onClose} className="btn btn-icon">
          <X size={14} />
        </button>
      </div>

      {/* Ring */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="120" height="120" className="-rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#1a1a1a" strokeWidth="6" />
            <motion.circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={isDone ? '#00ff87' : '#00d4ff'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference - offset }}
              transition={{ duration: 0.5 }}
              style={{ filter: `drop-shadow(0 0 4px ${isDone ? '#00ff8780' : '#00d4ff80'})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`mono text-2xl font-bold ${isDone ? 'text-neon-green' : 'text-white'}`}>
              {isDone ? 'GO!' : formatSeconds(remaining)}
            </span>
            <span className="text-[10px] text-void-600">
              {isDone ? 'Rest Done' : 'remaining'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button onClick={() => setRunning(!running)} className="btn btn-primary btn-sm">
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="btn btn-ghost btn-sm">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Presets */}
      <div className="flex gap-1.5 justify-center">
        {PRESETS.map(s => (
          <button
            key={s}
            onClick={() => { setTotal(s); setRemaining(s); setRunning(true) }}
            className={`text-[10px] px-2 py-1 rounded-md font-mono transition-colors ${
              total === s
                ? 'bg-void-400 text-neon-cyan border border-void-500'
                : 'bg-void-300 text-void-600 border border-void-300 hover:text-white'
            }`}
          >
            {s < 60 ? `${s}s` : `${s/60}m`}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
