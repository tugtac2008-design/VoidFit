import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { TODAY } from '../utils/format'

function ScoreArc({ score }: { score: number }) {
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(Math.max(score / 100, 0), 1)
  const offset = circumference * (1 - pct)

  const color = score >= 75 ? '#00ff87' : score >= 50 ? '#ffd700' : '#ff3b5c'
  const label = score >= 75 ? 'Great' : score >= 50 ? 'Okay' : 'Low'

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1a1a1a" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 10, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  )
}

interface SliderRowProps {
  label: string
  emoji: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  color?: string
  reversed?: boolean
}

function SliderRow({ label, emoji, value, min, max, onChange, color = '#00d4ff', reversed }: SliderRowProps) {
  const displayVal = reversed ? `${value}/10 (${value <= 3 ? 'Low' : value <= 6 ? 'Med' : 'High'})` : label === 'Sleep' ? `${value}h` : `${value}/10`
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>{emoji}</span>
          <span style={{ fontSize: 12, color: '#b0b0b0', fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: 12, color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{displayVal}</span>
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-void"
        style={{ accentColor: color }}
      />
    </div>
  )
}

export default function ReadinessWidget() {
  const { getTodayReadiness, logReadiness, addXP } = useStore()
  const todayLog = getTodayReadiness()
  const [expanded, setExpanded] = useState(!todayLog)
  const [soreness, setSoreness] = useState(5)
  const [sleep, setSleep] = useState(7)
  const [stress, setStress] = useState(5)
  const [energy, setEnergy] = useState(7)

  const handleLog = () => {
    logReadiness({ date: TODAY(), soreness, sleep, stress, energy })
    addXP(50)
    setExpanded(false)
  }

  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="text-overline">Readiness Score</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 2 }}>How's your body today?</div>
        </div>
        {todayLog && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="btn btn-ghost btn-sm"
          >
            {expanded ? 'Close' : 'Update'}
          </button>
        )}
      </div>

      {todayLog && !expanded ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ScoreArc score={todayLog.score} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Soreness', value: todayLog.soreness, max: 10, color: '#ff3b5c', emoji: '💪' },
              { label: 'Sleep', value: todayLog.sleep, max: 9, color: '#a855f7', emoji: '😴' },
              { label: 'Stress', value: todayLog.stress, max: 10, color: '#ff8c42', emoji: '🧠' },
              { label: 'Energy', value: todayLog.energy, max: 10, color: '#00ff87', emoji: '⚡' },
            ].map(({ label, value, max, color, emoji }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: '#6b6b6b' }}>{emoji} {label}</span>
                  <span style={{ fontSize: 11, color, fontFamily: 'JetBrains Mono, monospace' }}>{value}/{max}</span>
                </div>
                <div className="progress-track" style={{ height: 4 }}>
                  <div className="progress-fill" style={{ background: color, width: `${(value / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SliderRow label="Soreness" emoji="💪" value={soreness} min={1} max={10} onChange={setSoreness} color="#ff3b5c" reversed />
            <SliderRow label="Sleep" emoji="😴" value={sleep} min={4} max={12} onChange={setSleep} color="#a855f7" />
            <SliderRow label="Stress" emoji="🧠" value={stress} min={1} max={10} onChange={setStress} color="#ff8c42" reversed />
            <SliderRow label="Energy" emoji="⚡" value={energy} min={1} max={10} onChange={setEnergy} color="#00ff87" />
            <button onClick={handleLog} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
              Log Readiness · +50 XP
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
