import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  Flame, Droplets, Dumbbell, Trophy, Zap,
  Plus, ChevronRight, Scale, Target, Activity, TrendingUp
} from 'lucide-react'
import { useStore } from '../store/useStore'
import MacroRing from '../components/MacroRing'
import AnimatedNumber from '../components/AnimatedNumber'
import ReadinessWidget from '../components/ReadinessWidget'
import { TODAY, greetingTime, pct, fmt, formatDuration, muscleColor } from '../utils/format'
import { calcStreak, calcWeightTrend } from '../utils/calculations'
import { getRandomQuote } from '../data/quotes'
import { useMemo, useState } from 'react'
import {
  AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip, YAxis, XAxis
} from 'recharts'

const quote = getRandomQuote()

const card = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
}

export default function Dashboard() {
  const isMobile = useIsMobile()
  const {
    user, getMealEntriesForDate, getWaterForDate, workouts,
    activeWorkout, personalRecords, measurements, addWater, settings,
    xp, goals
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

  const weightHistory = useMemo(() =>
    measurements
      .filter(m => m.weight)
      .map(m => ({ date: m.date, weight: m.weight! }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30),
    [measurements]
  )

  const weightTrend = calcWeightTrend(weightHistory)
  const latestWeight = weightHistory[weightHistory.length - 1]?.weight
  const workoutDates = workouts.map(w => w.date)
  const streak = calcStreak(workoutDates)
  const todayWorkout = workouts.find(w => w.date === today)
  const recentPRs = personalRecords.slice(0, 4)

  const level = Math.floor(xp / 500) + 1
  const xpInLevel = xp % 500

  // Weekly volume by muscle
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 7)
  const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekStart)
  const muscleVolume: Record<string, number> = {}
  weekWorkouts.forEach(w => {
    w.exercises.forEach(ex => {
      const v = ex.sets.filter(s => s.completed).reduce((s, st) => s + st.weight * st.reps, 0)
      const mg = ex.exercise.muscleGroup
      muscleVolume[mg] = (muscleVolume[mg] ?? 0) + v
    })
  })
  const topMuscles = Object.entries(muscleVolume).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 3)

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="py-4 space-y-6"
    >
      {/* Header - Greeting */}
      <motion.div custom={0} variants={card}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0 }}>
              {greetingTime()},{' '}
              <span style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
                {user.name}
              </span>
            </h1>
            <p style={{ color: '#6b6b6b', fontSize: 13, marginTop: 6 }}>
              {fmt.date(new Date())} · {fmt.day(new Date())} · {user.experience} athlete
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {streak > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 30,
                background: 'rgba(255,140,66,0.08)', border: '1px solid rgba(255,140,66,0.25)',
              }}>
                <Flame size={16} style={{ color: '#ff8c42' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 800, color: '#ff8c42' }}>{streak}</span>
                <span style={{ fontSize: 12, color: '#6b6b6b' }}>day streak</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Row 1 - 4 stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 14 }}>
        {/* Calories */}
        <motion.div custom={1} variants={card}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Calories</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 900, color: '#00d4ff', lineHeight: 1, marginBottom: 6 }}>
              <AnimatedNumber value={Math.round(totals.calories)} />
            </div>
            <div style={{ fontSize: 11, color: '#525252', marginBottom: 10 }}>/ {macroGoals.calories} kcal</div>
            <div className="progress-track" style={{ height: 6 }}>
              <motion.div
                className="progress-fill progress-fill-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(pct(totals.calories, macroGoals.calories), 100)}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                style={{ height: '100%' }}
              />
            </div>
            <div style={{ fontSize: 11, color: totals.calories > macroGoals.calories ? '#ff3b5c' : '#00ff87', marginTop: 6, fontWeight: 600 }}>
              {Math.abs(Math.round(macroGoals.calories - totals.calories))} {totals.calories > macroGoals.calories ? 'over' : 'left'}
            </div>
          </div>
        </motion.div>

        {/* Protein */}
        <motion.div custom={2} variants={card}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Protein</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 900, color: '#00ff87', lineHeight: 1, marginBottom: 6 }}>
              <AnimatedNumber value={Math.round(totals.protein)} />
            </div>
            <div style={{ fontSize: 11, color: '#525252', marginBottom: 10 }}>/ {macroGoals.protein}g</div>
            <div className="progress-track" style={{ height: 6 }}>
              <motion.div
                className="progress-fill progress-fill-green"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(pct(totals.protein, macroGoals.protein), 100)}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
                style={{ height: '100%' }}
              />
            </div>
            <div style={{ fontSize: 11, color: '#00ff87', marginTop: 6, fontWeight: 600 }}>
              {pct(totals.protein, macroGoals.protein)}%
            </div>
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div custom={3} variants={card}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Streak</div>
            <div style={{ fontSize: 32, marginBottom: 4 }}>🔥</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 900, color: '#ff8c42', lineHeight: 1, marginBottom: 4 }}>
              <AnimatedNumber value={streak} />
            </div>
            <div style={{ fontSize: 11, color: '#525252' }}>day streak</div>
            {streak === 0 && (
              <Link to="/workout" style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: 11, color: '#00d4ff', marginTop: 6 }}>Start today →</div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Level */}
        <motion.div custom={4} variants={card}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Level</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 900, color: '#a855f7', lineHeight: 1, marginBottom: 6 }}>
              {level}
            </div>
            <div style={{ fontSize: 11, color: '#525252', marginBottom: 10 }}>{xpInLevel} / 500 XP</div>
            <div className="progress-track" style={{ height: 6 }}>
              <motion.div
                className="progress-fill progress-fill-purple"
                initial={{ width: 0 }}
                animate={{ width: `${(xpInLevel / 500) * 100}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
                style={{ height: '100%' }}
              />
            </div>
            <Link to="/goals" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: 11, color: '#a855f7', marginTop: 6 }}>View Goals →</div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Row 2 - Readiness Score */}
      <motion.div custom={5} variants={card}>
        <ReadinessWidget />
      </motion.div>

      {/* Row 3 - Calorie Breakdown */}
      <motion.div custom={6} variants={card} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Today's Nutrition</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 2 }}>
              <AnimatedNumber value={Math.round(totals.calories)} className="text-neon-cyan" />
              <span style={{ fontSize: 14, color: '#6b6b6b', fontWeight: 400 }}> / {macroGoals.calories} kcal</span>
            </div>
          </div>
          <Link to="/nutrition" className="btn btn-primary btn-sm">
            <Plus size={13} /> Log Food
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {!isMobile && (
            <MacroRing
              value={totals.calories}
              max={macroGoals.calories}
              size={140}
              strokeWidth={10}
              color="#00d4ff"
              label={`${Math.round(totals.calories)}`}
              sublabel="kcal"
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Protein', val: totals.protein, goal: macroGoals.protein, color: '#00ff87', unit: 'g' },
                { label: 'Carbs', val: totals.carbs, goal: macroGoals.carbs, color: '#00d4ff', unit: 'g' },
                { label: 'Fat', val: totals.fat, goal: macroGoals.fat, color: '#a855f7', unit: 'g' },
              ].map(({ label, val, goal, color, unit }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#6b6b6b' }}>{label}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color }}>
                      {Math.round(val)}<span style={{ color: '#404040' }}>/{goal}{unit}</span>
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 6 }}>
                    <motion.div
                      className="progress-fill"
                      style={{ background: color, width: `${Math.min(pct(val, goal), 100)}%`, height: '100%' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct(val, goal), 100)}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
                    />
                  </div>
                </div>
              ))}

              {/* Water */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#6b6b6b' }}>💧 Water</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#a855f7' }}>
                    {(water / 1000).toFixed(1)}<span style={{ color: '#404040' }}>/{(macroGoals.water / 1000).toFixed(1)}L</span>
                  </span>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <motion.div
                    className="progress-fill progress-fill-purple"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct(water, macroGoals.water), 100)}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
                    style={{ height: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {[250, 500, 750].map(ml => (
                    <button key={ml} onClick={() => addWater(today, ml)} className="btn btn-ghost btn-xs">
                      +{ml}ml
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Row 4 - Workout Status */}
      <motion.div custom={7} variants={card}>
        <div className={`glass-card ${activeWorkout ? 'card-cyan' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Dumbbell size={16} style={{ color: '#00d4ff' }} />
              <span style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {activeWorkout ? 'Active Workout' : "Today's Workout"}
              </span>
              {activeWorkout && <span className="pulse-dot pulse-dot-green" />}
            </div>
            <Link to="/workout" className="btn btn-icon">
              <ChevronRight size={14} />
            </Link>
          </div>

          {activeWorkout ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{activeWorkout.name}</div>
                <div style={{ fontSize: 12, color: '#6b6b6b' }}>
                  {activeWorkout.exercises.length} exercises · In progress
                </div>
              </div>
              <Link to="/workout" className="btn btn-primary btn-sm">
                Continue →
              </Link>
            </div>
          ) : todayWorkout ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Activity size={14} style={{ color: '#00ff87' }} />
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{todayWorkout.name}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6b6b6b' }}>
                  {todayWorkout.exercises.length} exercises · {formatDuration(todayWorkout.duration ?? 0)} · {Math.round(todayWorkout.totalVolume)} kg volume
                </div>
              </div>
              <span className="badge badge-green">Done</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 4 }}>No workout logged yet</div>
                <div style={{ fontSize: 12, color: '#525252' }}>Start a workout to keep your streak going</div>
              </div>
              <Link to="/workout" className="btn btn-primary btn-sm">
                <Plus size={13} /> Start
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Row 5 - Weight trend & Active Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        {/* Weight trend */}
        <motion.div custom={8} variants={card}>
          <div className="glass-card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scale size={15} style={{ color: '#ff8c42' }} />
                <span style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Weight Trend</span>
              </div>
              {weightTrend !== 0 && (
                <span className={`badge ${weightTrend > 0 ? 'badge-orange' : 'badge-green'}`}>
                  {weightTrend > 0 ? '+' : ''}{weightTrend}kg
                </span>
              )}
            </div>

            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 26, fontWeight: 700, color: '#ff8c42', lineHeight: 1, marginBottom: 4 }}>
              {latestWeight
                ? <><AnimatedNumber value={latestWeight} decimals={1} /><span style={{ fontSize: 14, color: '#525252', fontWeight: 400 }}> kg</span></>
                : <span style={{ fontSize: 14, color: '#525252' }}>No data</span>
              }
            </div>
            <div style={{ fontSize: 11, color: '#525252', marginBottom: 12 }}>30-day trend</div>

            {weightHistory.length > 1 ? (
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={weightHistory.slice(-14)}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff8c42" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff8c42" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
                  <Tooltip
                    contentStyle={{ background: '#0d0d0d', border: '1px solid #252525', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(v: number) => [`${v} kg`]}
                  />
                  <Area
                    type="monotone" dataKey="weight"
                    stroke="#ff8c42" strokeWidth={2}
                    fill="url(#weightGrad)"
                    dot={false}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(255,140,66,0.5))' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#404040' }}>
                Log measurements to see trend
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
              <input
                className="input-void"
                type="number"
                placeholder="Log weight (kg)"
                value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <Link to="/progress" className="btn btn-ghost btn-sm">
                <TrendingUp size={13} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Active Goals preview */}
        <motion.div custom={9} variants={card}>
          <div className="glass-card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={15} style={{ color: '#a855f7' }} />
                <span style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Active Goals</span>
              </div>
              <Link to="/goals" className="btn btn-icon">
                <ChevronRight size={14} />
              </Link>
            </div>

            {activeGoals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activeGoals.map(goal => {
                  const pctDone = goal.targetValue > 0
                    ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
                    : 0
                  return (
                    <div key={goal.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: '#b0b0b0', fontWeight: 500 }}>{goal.title}</span>
                        <span style={{ fontSize: 12, color: '#a855f7', fontFamily: 'JetBrains Mono, monospace' }}>{pctDone}%</span>
                      </div>
                      <div className="progress-track" style={{ height: 5 }}>
                        <motion.div
                          className="progress-fill progress-fill-purple"
                          initial={{ width: 0 }}
                          animate={{ width: `${pctDone}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                          style={{ height: '100%' }}
                        />
                      </div>
                    </div>
                  )
                })}
                <Link to="/goals" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  View all goals
                </Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🎯</div>
                <div style={{ fontSize: 13, color: '#525252', marginBottom: 14 }}>Set goals to track your progress</div>
                <Link to="/goals" className="btn btn-primary btn-sm">
                  <Plus size={13} /> Add Goal
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Row 6 - Weekly volume + PRs */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        {/* Weekly volume */}
        <motion.div custom={10} variants={card}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={15} style={{ color: '#a855f7' }} />
                <span style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Weekly Volume</span>
              </div>
              <span style={{ fontSize: 11, color: '#525252' }}>{weekWorkouts.length} sessions</span>
            </div>
            {topMuscles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topMuscles.map(([muscle, vol]) => {
                  const color = muscleColor(muscle)
                  const maxVol = topMuscles[0][1]
                  return (
                    <div key={muscle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color }}>{muscle}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#525252' }}>{Math.round(vol)}kg</span>
                      </div>
                      <div className="progress-track" style={{ height: 5 }}>
                        <motion.div
                          className="progress-fill"
                          style={{ background: color, width: `${pct(vol, maxVol)}%`, height: '100%' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct(vol, maxVol)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#404040' }}>
                Complete workouts to see volume breakdown
              </div>
            )}
          </div>
        </motion.div>

        {/* PR Board */}
        <motion.div custom={11} variants={card}>
          <div className="glass-card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trophy size={15} style={{ color: '#ffd700' }} />
                <span style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Personal Records</span>
              </div>
              <Link to="/progress" className="btn btn-icon">
                <ChevronRight size={14} />
              </Link>
            </div>
            {recentPRs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {recentPRs.map((pr, i) => (
                  <div key={pr.exerciseId} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: i < recentPRs.length - 1 ? '1px solid #1a1a1a' : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{pr.exerciseName}</div>
                      <div style={{ fontSize: 11, color: '#525252' }}>{pr.weight}kg × {pr.reps} reps</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: '#ffd700' }}>
                        {pr.estimatedOneRM}kg
                      </div>
                      <div style={{ fontSize: 10, color: '#404040' }}>e1RM</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#404040' }}>
                Complete workouts to track PRs
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quote */}
      <motion.div custom={12} variants={card}>
        <div className="glass-card" style={{ borderColor: 'rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.02)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: -8, left: -4, fontSize: 48, color: 'rgba(0,212,255,0.08)', fontWeight: 900, lineHeight: 1 }}>"</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Zap size={15} style={{ color: '#00d4ff', flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: '#6b6b6b', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>{quote}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
