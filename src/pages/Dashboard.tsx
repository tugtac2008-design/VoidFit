import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  Plus, Dumbbell, Target, ChevronRight, Zap, Flame, Activity, Droplets
} from 'lucide-react'
import { useStore } from '../store/useStore'
import AnimatedNumber from '../components/AnimatedNumber'
import { TODAY, greetingTime, pct, fmt, formatDuration, muscleColor } from '../utils/format'
import { calcStreak } from '../utils/calculations'
import { useMemo, useState } from 'react'

// ── Hero metric ring ──────────────────────────────────────────────────────────
function HeroRing({
  value, max, color, glow, label, sublabel, size = 100
}: {
  value: number; max: number; color: string; glow: string
  label: string; sublabel: string; size?: number
}) {
  const sw = 8
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const pctVal = Math.min(Math.max(value / max, 0), 1)
  const offset = circ * (1 - pctVal)
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>
          {Math.round(pctVal * 100)}
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>%</span>
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 3 }}>{sublabel}</div>
      </div>
    </div>
  )
}

// ── Muscle mini ring ──────────────────────────────────────────────────────────
function MuscleRing({ label, color, value, max }: { label: string; color: string; value: number; max: number }) {
  const size = 52
  const sw = 4
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const pctVal = max > 0 ? Math.min(value / max, 1) : 0
  const offset = circ * (1 - pctVal)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 56 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
          <motion.circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
            style={{ filter: `drop-shadow(0 0 4px ${color}90)` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color, fontWeight: 700,
        }}>
          {Math.round(pctVal * 100)}%
        </div>
      </div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>
        {label}
      </div>
    </div>
  )
}

// ── Quick stat pill ───────────────────────────────────────────────────────────
function QuickStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: '12px 10px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <div style={{ color, opacity: 0.85 }}>{icon}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: [0.4,0,0.2,1] } }),
}

export default function Dashboard() {
  const isMobile = useIsMobile()
  const {
    user, getMealEntriesForDate, getWaterForDate, workouts,
    activeWorkout, measurements, addWater, xp, goals, getTodayReadiness
  } = useStore()
  const today = TODAY()
  const [weightInput, setWeightInput] = useState('')

  const entries = getMealEntriesForDate(today)
  const water = getWaterForDate(today)
  const macroGoals = user.macroGoals

  const totals = useMemo(() => entries.reduce((acc, e) => {
    const s = e.servings
    acc.calories += e.food.calories * s
    acc.protein += e.food.protein * s
    acc.carbs += e.food.carbs * s
    acc.fat += e.food.fat * s
    return acc
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 }), [entries])

  const workoutDates = workouts.map(w => w.date)
  const streak = calcStreak(workoutDates)
  const todayWorkout = workouts.find(w => w.date === today)
  const level = Math.floor(xp / 500) + 1
  const xpInLevel = xp % 500
  const readiness = getTodayReadiness()
  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 3)

  // Weekly muscle volume
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7)
  const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekStart)
  const muscleVolume: Record<string, number> = {}
  weekWorkouts.forEach(w => w.exercises.forEach(ex => {
    const v = ex.sets.filter(s => s.completed).reduce((s, st) => s + st.weight * st.reps, 0)
    muscleVolume[ex.exercise.muscleGroup] = (muscleVolume[ex.exercise.muscleGroup] ?? 0) + v
  }))
  const maxVol = Math.max(...Object.values(muscleVolume), 1)
  const MUSCLE_DISPLAY = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps']
  const muscleRings = MUSCLE_DISPLAY.map(m => ({
    label: m,
    color: muscleColor(m),
    value: muscleVolume[m] ?? 0,
    max: maxVol
  }))

  const recentWorkouts = workouts.slice(-3).reverse()

  return (
    <motion.div initial="hidden" animate="show" className="py-4 space-y-5">

      {/* ── Header ── */}
      <motion.div custom={0} variants={fadeUp}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>
              {fmt.date(new Date())} · {greetingTime()}
            </div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 26 : 34, fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Hey,{' '}
              <span style={{
                background: 'linear-gradient(90deg, #fff 0%, #ffb260 60%, #ff9028 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {user.name}
              </span>
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            {streak > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 20,
                background: 'rgba(255,140,66,0.1)', border: '1px solid rgba(255,140,66,0.25)',
              }}>
                <Flame size={13} style={{ color: '#ff8c42' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 800, color: '#ff8c42' }}>{streak}</span>
              </div>
            )}
            <div style={{
              padding: '5px 10px', borderRadius: 20,
              background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
              fontSize: 11, color: '#a855f7', fontWeight: 600,
            }}>
              LVL {level}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 3 Hero Ring Cards ── */}
      <motion.div custom={1} variants={fadeUp}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {/* Recovery */}
          <div className="ring-card">
            <HeroRing
              value={readiness?.score ?? 0}
              max={100}
              color="#00ff87"
              glow="rgba(0,255,135,0.5)"
              label="Recovery"
              sublabel="score"
              size={isMobile ? 88 : 100}
            />
            <div className="ring-label">Recovery</div>
            <div className="ring-value">{readiness ? readiness.score : '—'}</div>
          </div>

          {/* Macros */}
          <div className="ring-card" style={{ borderColor: 'rgba(255,144,40,0.15)' }}>
            <HeroRing
              value={totals.calories}
              max={macroGoals.calories}
              color="#ff9028"
              glow="rgba(255,144,40,0.5)"
              label="Macros"
              sublabel="cals"
              size={isMobile ? 88 : 100}
            />
            <div className="ring-label">Macros</div>
            <div className="ring-value">{Math.round(totals.calories)}</div>
          </div>

          {/* Hydration */}
          <div className="ring-card">
            <HeroRing
              value={water}
              max={macroGoals.water}
              color="#00d4ff"
              glow="rgba(0,212,255,0.5)"
              label="Hydration"
              sublabel="water"
              size={isMobile ? 88 : 100}
            />
            <div className="ring-label">Hydration</div>
            <div className="ring-value">{(water/1000).toFixed(1)}L</div>
          </div>
        </div>
      </motion.div>

      {/* ── Muscle Mini Rings ── */}
      <motion.div custom={2} variants={fadeUp}>
        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
              Weekly Muscle Volume
            </div>
            <Link to="/workout" style={{ fontSize: 10, color: '#ff9028', textDecoration: 'none', letterSpacing: '0.5px' }}>
              View →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {muscleRings.map(m => (
              <MuscleRing key={m.label} {...m} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Log Meal CTA ── */}
      <motion.div custom={3} variants={fadeUp}>
        <Link to="/nutrition" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            width: '100%', padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(255,178,96,0.15), rgba(255,144,40,0.1))',
            border: '1px solid rgba(255,144,40,0.3)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(255,144,40,0.08)',
            transition: 'all 0.2s ease',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,144,40,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Plus size={18} style={{ color: '#ff9028' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '0.3px' }}>LOG MEAL</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>
                {Math.round(macroGoals.calories - totals.calories)} kcal remaining
              </div>
            </div>
            <ChevronRight size={16} style={{ color: 'rgba(255,144,40,0.5)', marginLeft: 'auto' }} />
          </div>
        </Link>
      </motion.div>

      {/* ── Quick Stats Row ── */}
      <motion.div custom={4} variants={fadeUp}>
        <div style={{ display: 'flex', gap: 8 }}>
          <QuickStat icon={<Zap size={14} />} label="Protein" value={`${Math.round(totals.protein)}g`} color="#00ff87" />
          <QuickStat icon={<Activity size={14} />} label="Carbs" value={`${Math.round(totals.carbs)}g`} color="#ff9028" />
          <QuickStat icon={<Droplets size={14} />} label="Water" value={`${(water/1000).toFixed(1)}L`} color="#00d4ff" />
          <QuickStat icon={<Dumbbell size={14} />} label="Streak" value={`${streak}d`} color="#ff8c42" />
        </div>
      </motion.div>

      {/* ── Water Quick-Add + Workout ── */}
      <motion.div custom={5} variants={fadeUp}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Water quick-add */}
          <div className="glass-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Droplets size={13} style={{ color: '#00d4ff' }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 700 }}>Add Water</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[250, 500, 750].map(ml => (
                <button
                  key={ml}
                  onClick={() => addWater(today, ml)}
                  style={{
                    background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)',
                    borderRadius: 10, padding: '7px 10px',
                    color: '#00d4ff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.15s ease',
                  }}
                >
                  +{ml}ml
                </button>
              ))}
            </div>
          </div>

          {/* Workout status */}
          <div className={`glass-card ${activeWorkout ? 'card-cyan' : ''}`} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Dumbbell size={13} style={{ color: '#ff9028' }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 700 }}>Workout</span>
              {activeWorkout && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff87', boxShadow: '0 0 6px rgba(0,255,135,0.8)', marginLeft: 'auto' }} />}
            </div>
            {activeWorkout ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{activeWorkout.name}</div>
                <Link to="/workout" style={{ textDecoration: 'none' }}>
                  <div style={{
                    marginTop: 8, padding: '8px', background: 'rgba(255,144,40,0.12)',
                    border: '1px solid rgba(255,144,40,0.25)', borderRadius: 10,
                    textAlign: 'center', color: '#ff9028', fontSize: 12, fontWeight: 600,
                  }}>Continue →</div>
                </Link>
              </div>
            ) : todayWorkout ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{todayWorkout.name}</div>
                <div style={{ fontSize: 10, color: '#00ff87', fontWeight: 600 }}>✓ Completed</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{formatDuration(todayWorkout.duration ?? 0)}</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>No workout today</div>
                <Link to="/workout" style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '8px', background: 'rgba(255,144,40,0.1)',
                    border: '1px solid rgba(255,144,40,0.2)', borderRadius: 10,
                    textAlign: 'center', color: '#ff9028', fontSize: 12, fontWeight: 600,
                  }}>Start →</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Active Goal / Challenge card ── */}
      {activeGoals.length > 0 && (
        <motion.div custom={6} variants={fadeUp}>
          <div className="challenge-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,45,120,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={14} style={{ color: '#ff2d78' }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Active Goal</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{activeGoals[0].title}</div>
                </div>
              </div>
              <Link to="/goals" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                <ChevronRight size={16} />
              </Link>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  {activeGoals[0].currentValue} / {activeGoals[0].targetValue} {activeGoals[0].unit}
                </span>
                <span style={{ fontSize: 11, color: '#ff2d78', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                  {activeGoals[0].targetValue > 0 ? Math.round((activeGoals[0].currentValue / activeGoals[0].targetValue) * 100) : 0}%
                </span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, #ff9028, #ff2d78)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${activeGoals[0].targetValue > 0 ? Math.min((activeGoals[0].currentValue / activeGoals[0].targetValue) * 100, 100) : 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                />
              </div>
            </div>
            {activeGoals[0].deadline && (
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>⏱</span>
                <span>Deadline: {new Date(activeGoals[0].deadline).toLocaleDateString()}</span>
                <Link to="/goals" style={{ marginLeft: 'auto', color: '#ff2d78', textDecoration: 'none', fontWeight: 600 }}>View details →</Link>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Recent Activity ── */}
      <motion.div custom={7} variants={fadeUp}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
              Recent Activity
            </div>
            <Link to="/workout" style={{ fontSize: 10, color: '#ff9028', textDecoration: 'none' }}>See all</Link>
          </div>

          {recentWorkouts.length > 0 ? (
            <div>
              {recentWorkouts.map((workout, i) => (
                <div key={workout.id} className="log-row">
                  <div style={{
                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                    background: `rgba(${i===0?'255,144,40':i===1?'168,85,247':'0,255,135'},0.12)`,
                    border: `1px solid rgba(${i===0?'255,144,40':i===1?'168,85,247':'0,255,135'},0.2)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Dumbbell size={16} style={{ color: i===0?'#ff9028':i===1?'#a855f7':'#00ff87' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {workout.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                      {workout.exercises.length} exercises · {formatDuration(workout.duration ?? 0)}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
                    {new Date(workout.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🏋️</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>No recent workouts</div>
              <Link to="/workout" className="btn btn-primary btn-sm" style={{ display: 'inline-flex' }}>
                <Plus size={12} /> Start Workout
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── XP progress ── */}
      <motion.div custom={8} variants={fadeUp}>
        <div style={{
          background: 'rgba(168,85,247,0.06)',
          border: '1px solid rgba(168,85,247,0.15)',
          borderRadius: 16, padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(168,85,247,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Zap size={18} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Level {level}</span>
              <span style={{ fontSize: 11, color: '#a855f7', fontFamily: 'JetBrains Mono, monospace' }}>{xpInLevel} / 500 XP</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 5, background: 'linear-gradient(90deg, #a855f7, #7c3aed)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(xpInLevel/500)*100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  )
}
