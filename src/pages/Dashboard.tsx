import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'
import { Plus, Dumbbell, ChevronRight, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import AnimatedNumber from '../components/AnimatedNumber'
import { TODAY, fmt, formatDuration } from '../utils/format'
import { calcStreak } from '../utils/calculations'
import { useMemo } from 'react'

// ── System status line ────────────────────────────────────────────────────────
function statusLine(score: number, waterPct: number): { text: string; color: string } {
  if (score === 0) return { text: 'AWAITING BIOMETRIC INPUT', color: 'rgba(255,144,40,0.45)' }
  if (score >= 80 && waterPct >= 0.7) return { text: 'ALL SYSTEMS NOMINAL', color: '#00c870' }
  if (score < 40) return { text: 'CNS LOAD · CRITICAL', color: '#ff3b5c' }
  if (waterPct < 0.35) return { text: 'HYDRATION DEFICIT DETECTED', color: '#ff9028' }
  if (score < 60) return { text: 'CNS LOAD · ELEVATED', color: '#ffd700' }
  return { text: 'SYSTEM NOMINAL', color: '#ff9028' }
}

// ── Biometric Core (dominant hero) ───────────────────────────────────────────
function BiometricCore({ score, size }: { score: number; size: number }) {
  const pctVal = Math.min(score / 100, 1)
  const color = score >= 75 ? '#ff9028' : score >= 50 ? '#ffd700' : score > 0 ? '#ff4d6a' : 'rgba(255,144,40,0.25)'
  const glow = `${color}80`
  const sw = 7
  const r1 = size / 2 - 5
  const r2 = size / 2 - 18
  const r3 = size / 2 - 33
  const c2 = 2 * Math.PI * r2
  const c3 = 2 * Math.PI * r3

  const label = score >= 80 ? 'PEAK' : score >= 60 ? 'NOMINAL' : score >= 40 ? 'DEGRADED' : score > 0 ? 'CRITICAL' : 'NO DATA'

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: -30, pointerEvents: 'none',
        background: `radial-gradient(circle, ${color}12 0%, transparent 62%)`,
      }} className="ambient-pulse" />

      {/* Scan lines overlay */}
      <div className="scan-lines" />

      {/* Rotating scanner ring */}
      <div style={{ position: 'absolute', inset: 0, animation: 'scannerRotate 14s linear infinite' }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r1} fill="none" stroke="rgba(255,144,40,0.14)" strokeWidth={1} strokeDasharray="3 10" />
        </svg>
      </div>

      {/* Counter-rotating inner scanner */}
      <div style={{ position: 'absolute', inset: 0, animation: 'scannerRotate 22s linear infinite reverse' }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r3 - 4} fill="none" stroke="rgba(255,144,40,0.08)" strokeWidth={1} strokeDasharray="2 14" />
        </svg>
      </div>

      {/* Main SVG arcs */}
      <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        {/* Outer ring track */}
        <circle cx={size/2} cy={size/2} r={r2} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
        {/* Outer ring fill */}
        <motion.circle
          cx={size/2} cy={size/2} r={r2}
          fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c2}
          initial={{ strokeDashoffset: c2 }}
          animate={{ strokeDashoffset: c2 * (1 - pctVal) }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
        />
        {/* Inner ring track */}
        <circle cx={size/2} cy={size/2} r={r3} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={3.5} />
        {/* Inner ring fill (slightly ahead) */}
        <motion.circle
          cx={size/2} cy={size/2} r={r3}
          fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round"
          strokeDasharray={c3}
          initial={{ strokeDashoffset: c3 }}
          animate={{ strokeDashoffset: c3 * (1 - Math.min(pctVal * 1.2, 1)) }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1], delay: 0.45 }}
          style={{ opacity: 0.4, filter: `drop-shadow(0 0 6px ${glow})` }}
        />
      </svg>

      {/* Core readout */}
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <div style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: score > 0 ? size * 0.275 : size * 0.16,
          fontWeight: 700, color, lineHeight: 1,
          textShadow: `0 0 28px ${color}55`,
          letterSpacing: '-1px',
        }}>
          {score > 0 ? score : '—'}
        </div>
        <div style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 8.5,
          fontWeight: 600, color, opacity: 0.65,
          letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: 2,
        }}>
          {label}
        </div>
      </div>
    </div>
  )
}

// ── Macro vial (liquid fuel column) ──────────────────────────────────────────
function MacroVial({ label, value, goal, unit }: { label: string; value: number; goal: number; unit: string }) {
  const pctVal = goal > 0 ? Math.min(value / goal, 1) : 0
  const isOver = value > goal * 1.05
  return (
    <div className="vial-wrap">
      <div className="vial-container">
        {[0.25, 0.5, 0.75].map(t => (
          <div key={t} className="vial-tick" style={{ bottom: `${t * 100}%` }} />
        ))}
        <motion.div
          className={`vial-fill${isOver ? ' over' : ''}`}
          initial={{ height: 0 }}
          animate={{ height: `${pctVal * 100}%` }}
          transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1], delay: 0.6 }}
        />
        <div className="vial-pct">{Math.round(pctVal * 100)}%</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700,
          color: isOver ? '#ff4d6a' : '#fff', lineHeight: 1,
        }}>
          {Math.round(value)}<span style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>{unit}</span>
        </div>
        <div style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 9, fontWeight: 600,
          color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase',
          letterSpacing: '1.2px', marginTop: 2,
        }}>{label}</div>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.14)', marginTop: 1 }}>/{goal}{unit}</div>
      </div>
    </div>
  )
}

// ── Muscle mini ring ──────────────────────────────────────────────────────────
function MuscleRing({ label, value, max }: { label: string; value: number; max: number }) {
  const size = 52
  const sw = 4
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const pctVal = max > 0 ? Math.min(value / max, 1) : 0
  const color = pctVal > 0.65 ? '#ff9028' : pctVal > 0.35 ? '#ffb260' : 'rgba(255,144,40,0.3)'

  return (
    <div className="muscle-ring-item">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
          <motion.circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pctVal) }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
            style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Rajdhani, sans-serif', fontSize: 9, fontWeight: 700, color,
        }}>
          {Math.round(pctVal * 100)}%
        </div>
      </div>
      <div style={{
        fontFamily: 'Rajdhani, sans-serif', fontSize: 8, fontWeight: 600,
        color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.8px',
      }}>
        {label}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.42, ease: [0.4, 0, 0.2, 1] } }),
}

const MUSCLES = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps']

export default function Dashboard() {
  const isMobile = useIsMobile()
  const {
    user, getMealEntriesForDate, getWaterForDate, workouts,
    activeWorkout, addWater, xp, goals, getTodayReadiness
  } = useStore()
  const today = TODAY()

  const entries = getMealEntriesForDate(today)
  const water = getWaterForDate(today)
  const { calories: calGoal, protein: protGoal, carbs: carbGoal, fat: fatGoal, water: waterGoal } = user.macroGoals

  const totals = useMemo(() => entries.reduce((acc, e) => {
    const s = e.servings
    acc.calories += e.food.calories * s
    acc.protein += e.food.protein * s
    acc.carbs += e.food.carbs * s
    acc.fat += e.food.fat * s
    return acc
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 }), [entries])

  const streak = calcStreak(workouts.map(w => w.date))
  const todayWorkout = workouts.find(w => w.date === today)
  const level = Math.floor(xp / 500) + 1
  const xpInLevel = xp % 500
  const readiness = getTodayReadiness()
  const score = readiness?.score ?? 0
  const activeGoal = goals.filter(g => g.status === 'active')[0]

  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7)
  const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekStart)
  const muscleVolume: Record<string, number> = {}
  weekWorkouts.forEach(w => w.exercises.forEach(ex => {
    const v = ex.sets.filter(s => s.completed).reduce((sum, st) => sum + st.weight * st.reps, 0)
    muscleVolume[ex.exercise.muscleGroup] = (muscleVolume[ex.exercise.muscleGroup] ?? 0) + v
  }))
  const maxVol = Math.max(...Object.values(muscleVolume), 1)

  const waterPct = waterGoal > 0 ? water / waterGoal : 0
  const status = statusLine(score, waterPct)
  const recentWorkouts = workouts.slice(-3).reverse()
  const heroSize = isMobile ? 152 : 172

  return (
    <motion.div initial="hidden" animate="show" style={{ paddingTop: 8, paddingBottom: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── 1. OPERATOR HEADER ── */}
      <motion.div custom={0} variants={fadeUp}>
        <div className="sys-bar">
          <div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 3 }}>
              OPERATOR · {fmt.date(new Date())}
            </div>
            <div style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: isMobile ? 22 : 26, fontWeight: 700, lineHeight: 1,
              background: 'linear-gradient(90deg, #fff 0%, #ffb260 55%, #ff9028 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              letterSpacing: '0.5px',
            }}>
              {user.name.toUpperCase()}
            </div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {streak > 0 && (
              <div style={{
                fontFamily: 'Rajdhani, sans-serif', fontSize: 11, fontWeight: 700,
                color: '#ff9028', letterSpacing: '1px',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                🔥 <span>{streak}D STREAK</span>
              </div>
            )}
            <div style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: 10, fontWeight: 600,
              color: 'rgba(168,85,247,0.9)', letterSpacing: '1.5px',
            }}>
              LVL {level}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. BIOMETRIC CORE (dominant hero) ── */}
      <motion.div custom={1} variants={fadeUp}>
        <div className="biometric-hero">
          <BiometricCore score={score} size={heroSize} />

          {/* System status line below hero */}
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: status.color, boxShadow: `0 0 6px ${status.color}` }} />
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, fontWeight: 600, color: status.color, letterSpacing: '2px' }}>
              {status.text}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── 3. SECONDARY METRICS (2 chips) ── */}
      <motion.div custom={2} variants={fadeUp}>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Macros */}
          <div className="metric-chip">
            <div className="tech-label" style={{ marginBottom: 5 }}>Macros</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, fontWeight: 700, color: '#ff9028', lineHeight: 1, textShadow: '0 0 14px rgba(255,144,40,0.4)' }}>
              <AnimatedNumber value={Math.round(totals.calories)} />
            </div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 3, letterSpacing: '1px' }}>
              / {calGoal} KCAL
            </div>
            <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 2, background: '#ff9028', boxShadow: '0 0 6px rgba(255,144,40,0.5)' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totals.calories / calGoal) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
          </div>

          {/* Hydration */}
          <div className="metric-chip">
            <div className="tech-label" style={{ marginBottom: 5 }}>Hydration</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, fontWeight: 700, color: '#00c4e8', lineHeight: 1, textShadow: '0 0 14px rgba(0,196,232,0.4)' }}>
              {(water / 1000).toFixed(1)}L
            </div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 3, letterSpacing: '1px' }}>
              / {(waterGoal / 1000).toFixed(1)} TARGET
            </div>
            <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 2, background: '#00c4e8', boxShadow: '0 0 6px rgba(0,196,232,0.4)' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(waterPct * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
              />
            </div>
            {/* Quick-add water */}
            <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
              {[250, 500].map(ml => (
                <button key={ml} onClick={() => addWater(today, ml)} style={{
                  flex: 1, background: 'rgba(0,196,232,0.07)', border: '1px solid rgba(0,196,232,0.18)',
                  borderRadius: 7, padding: '5px 0', color: '#00c4e8',
                  fontFamily: 'Rajdhani, sans-serif', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '0.5px',
                }}>+{ml}ml</button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 4. FUEL RESERVES (macro vials) ── */}
      <motion.div custom={3} variants={fadeUp}>
        <div className="fuel-section">
          <div style={{ marginBottom: 16 }}>
            <div className="section-divider">
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, fontWeight: 700, color: 'rgba(255,144,40,0.55)', letterSpacing: '2.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                FUEL RESERVES
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 20 : 28 }}>
            <MacroVial label="Protein" value={totals.protein} goal={protGoal} unit="g" />
            <MacroVial label="Carbs" value={totals.carbs} goal={carbGoal} unit="g" />
            <MacroVial label="Fat" value={totals.fat} goal={fatGoal} unit="g" />
          </div>
        </div>
      </motion.div>

      {/* ── 5. ACTION CTAs ── */}
      <motion.div custom={4} variants={fadeUp}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link to="/nutrition" className="cta-amber">
            <Plus size={16} style={{ color: '#ff9028', flexShrink: 0 }} />
            <span>Log Meal</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: 'rgba(255,144,40,0.5)', letterSpacing: '0.5px' }}>
              {Math.max(0, Math.round(calGoal - totals.calories))} KCAL LEFT
            </span>
          </Link>

          <Link to="/workout" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '13px 20px',
            background: activeWorkout
              ? 'linear-gradient(135deg, rgba(0,255,135,0.08), rgba(0,200,100,0.04))'
              : 'rgba(255,255,255,0.025)',
            border: `1px solid ${activeWorkout ? 'rgba(0,255,135,0.2)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s ease',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: activeWorkout ? 'rgba(0,255,135,0.12)' : 'rgba(255,144,40,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Dumbbell size={14} style={{ color: activeWorkout ? '#00ff87' : '#ff9028' }} />
              {activeWorkout && <div style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, borderRadius: '50%', background: '#00ff87', boxShadow: '0 0 6px rgba(0,255,135,0.9)' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                {activeWorkout ? activeWorkout.name : todayWorkout ? todayWorkout.name : 'Start Workout'}
              </div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '1px', marginTop: 1, textTransform: 'uppercase' }}>
                {activeWorkout ? '· In progress' : todayWorkout ? `· Completed · ${formatDuration(todayWorkout.duration ?? 0)}` : '· No session logged today'}
              </div>
            </div>
            <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
          </Link>
        </div>
      </motion.div>

      {/* ── 6. MUSCLE VOLUME ANALYSIS ── */}
      <motion.div custom={5} variants={fadeUp}>
        <div className="wave-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="section-divider" style={{ flex: 1, marginRight: 12 }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, fontWeight: 700, color: 'rgba(255,144,40,0.5)', letterSpacing: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                MUSCLE TELEMETRY
              </span>
            </div>
            <Link to="/workout" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: 'rgba(255,144,40,0.6)', textDecoration: 'none', letterSpacing: '1px', flexShrink: 0 }}>
              DETAIL →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' as const }}>
            {MUSCLES.map(m => (
              <MuscleRing key={m} label={m} value={muscleVolume[m] ?? 0} max={maxVol} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── 7. ACTIVE MISSION (goal card) ── */}
      {activeGoal && (
        <motion.div custom={6} variants={fadeUp}>
          <div className="challenge-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff9028', boxShadow: '0 0 8px rgba(255,144,40,0.8)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, color: 'rgba(255,144,40,0.6)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 2 }}>
                  ACTIVE MISSION
                </div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeGoal.title.toUpperCase()}
                </div>
              </div>
              <Link to="/goals" style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}><ChevronRight size={16} /></Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
                {activeGoal.currentValue} / {activeGoal.targetValue} {activeGoal.unit}
              </span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: '#ff9028', fontWeight: 700, letterSpacing: '1px' }}>
                {activeGoal.targetValue > 0 ? Math.round((activeGoal.currentValue / activeGoal.targetValue) * 100) : 0}%
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #ff9028, #ff2d78)', boxShadow: '0 0 8px rgba(255,144,40,0.4)' }}
                initial={{ width: 0 }}
                animate={{ width: `${activeGoal.targetValue > 0 ? Math.min((activeGoal.currentValue / activeGoal.targetValue) * 100, 100) : 0}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.7 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 8. RECENT OPERATIONS ── */}
      <motion.div custom={7} variants={fadeUp}>
        <div className="wave-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="section-divider" style={{ flex: 1, marginRight: 12 }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, fontWeight: 700, color: 'rgba(255,144,40,0.5)', letterSpacing: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                RECENT OPERATIONS
              </span>
            </div>
            <Link to="/workout" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: 'rgba(255,144,40,0.6)', textDecoration: 'none', letterSpacing: '1px', flexShrink: 0 }}>
              ALL →
            </Link>
          </div>

          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout, i) => (
              <div key={workout.id} className="ops-row">
                <div className="ops-icon" style={{
                  background: i === 0 ? 'rgba(255,144,40,0.1)' : 'rgba(255,255,255,0.05)',
                  borderColor: i === 0 ? 'rgba(255,144,40,0.2)' : 'rgba(255,255,255,0.07)',
                }}>
                  <Dumbbell size={14} style={{ color: i === 0 ? '#ff9028' : 'rgba(255,255,255,0.35)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700,
                    color: '#fff', letterSpacing: '0.3px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {workout.name.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '1px', marginTop: 1, textTransform: 'uppercase' }}>
                    {workout.exercises.length} EX · {formatDuration(workout.duration ?? 0)}
                  </div>
                </div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.5px', flexShrink: 0 }}>
                  {new Date(workout.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }).toUpperCase()}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '2px', marginBottom: 12, textTransform: 'uppercase' }}>
                No operations logged
              </div>
              <Link to="/workout" className="btn btn-primary btn-sm" style={{ display: 'inline-flex' }}>
                <Plus size={12} /> Initialize Session
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── 9. NEURAL PROGRESSION (XP) ── */}
      <motion.div custom={8} variants={fadeUp}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(100,50,180,0.04))',
          border: '1px solid rgba(168,85,247,0.13)',
          borderRadius: 16, padding: '13px 18px',
          display: 'flex', alignItems: 'center', gap: 13,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={15} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>
                LEVEL {level}
              </span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: 'rgba(168,85,247,0.8)', letterSpacing: '1px' }}>
                <AnimatedNumber value={xpInLevel} /> / 500 XP
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #a855f7, #7c3aed)', boxShadow: '0 0 8px rgba(168,85,247,0.4)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(xpInLevel / 500) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  )
}
