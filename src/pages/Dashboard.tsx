import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Flame, Droplets, TrendingUp, Dumbbell, Trophy, Zap,
  Plus, ChevronRight, Scale, Target, Activity
} from 'lucide-react'
import { useStore } from '../store/useStore'
import MacroRing, { SmallRing } from '../components/MacroRing'
import AnimatedNumber from '../components/AnimatedNumber'
import { TODAY, greetingTime, pct, fmt, formatWeight, formatDuration, muscleColor } from '../utils/format'
import { calcStreak, calcWeightTrend } from '../utils/calculations'
import { getRandomQuote } from '../data/quotes'
import { useMemo, useState } from 'react'
import {
  LineChart, Line, ResponsiveContainer, Tooltip, YAxis
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
  const {
    user, getMealEntriesForDate, getWaterForDate, workouts,
    activeWorkout, personalRecords, measurements, addWater, settings
  } = useStore()
  const today = TODAY()

  const entries = getMealEntriesForDate(today)
  const water = getWaterForDate(today)
  const goals = user.macroGoals

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

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="py-2 space-y-6"
    >
      {/* Header */}
      <motion.div custom={0} variants={card}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {greetingTime()}, <span className="text-neon-cyan" style={{ textShadow: '0 0 16px rgba(0,212,255,0.4)' }}>{user.name}</span>
            </h1>
            <p className="text-void-600 text-sm mt-0.5">{fmt.date(new Date())} · {user.experience} athlete</p>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,140,66,0.08)', border: '1px solid rgba(255,140,66,0.2)' }}>
                <Flame size={14} className="text-neon-orange" />
                <span className="mono text-sm font-bold text-neon-orange">{streak}</span>
                <span className="text-xs text-void-600">streak</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">

        {/* Calorie Ring — main focal point */}
        <motion.div custom={1} variants={card} className="col-span-12 md:col-span-5">
          <div className="card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-void-600 uppercase tracking-widest">Today's Calories</div>
                <div className="mono text-2xl font-bold text-white mt-0.5">
                  <AnimatedNumber value={Math.round(totals.calories)} className="text-neon-cyan" />
                  <span className="text-void-600 text-base font-normal"> / {goals.calories}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-void-600">Remaining</div>
                <div className={`mono text-lg font-bold ${goals.calories - totals.calories < 0 ? 'text-neon-red' : 'text-neon-green'}`}>
                  {Math.abs(Math.round(goals.calories - totals.calories))} kcal
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <MacroRing
                value={totals.calories}
                max={goals.calories}
                size={148}
                strokeWidth={11}
                color="#00d4ff"
                label={`${Math.round(totals.calories)}`}
                sublabel="kcal"
              />
              <div className="flex-1 space-y-3">
                {[
                  { label: 'Protein', val: totals.protein, goal: goals.protein, color: '#00ff87', unit: 'g' },
                  { label: 'Carbs', val: totals.carbs, goal: goals.carbs, color: '#00d4ff', unit: 'g' },
                  { label: 'Fat', val: totals.fat, goal: goals.fat, color: '#a855f7', unit: 'g' },
                ].map(({ label, val, goal, color, unit }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-void-600">{label}</span>
                      <span className="mono text-xs" style={{ color }}>
                        {Math.round(val)}<span className="text-void-600">/{goal}{unit}</span>
                      </span>
                    </div>
                    <div className="progress-track h-1.5">
                      <motion.div
                        className="progress-fill"
                        style={{ background: color, width: `${Math.min(pct(val, goal), 100)}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct(val, goal), 100)}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/nutrition" className="mt-4 w-full btn btn-ghost btn-sm flex items-center justify-center gap-1">
              <Plus size={13} /> Log Food
            </Link>
          </div>
        </motion.div>

        {/* Right column — stats */}
        <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4">
          {/* Water */}
          <motion.div custom={2} variants={card}>
            <div className="card p-4 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets size={15} className="text-neon-purple" />
                  <span className="text-xs text-void-600 uppercase tracking-widest">Hydration</span>
                </div>
                <span className="badge badge-purple">{pct(water, goals.water)}%</span>
              </div>
              <div className="mono text-2xl font-bold text-white mb-0.5">
                <AnimatedNumber value={water / 1000} decimals={1} className="text-neon-purple" />
                <span className="text-base text-void-600 font-normal"> L</span>
              </div>
              <div className="text-xs text-void-600 mb-3">Goal: {(goals.water / 1000).toFixed(1)}L</div>
              <div className="progress-track h-2 mb-3">
                <motion.div
                  className="progress-fill progress-fill-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pct(water, goals.water), 100)}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[250, 500, 750].map(ml => (
                  <button key={ml} onClick={() => addWater(today, ml)}
                    className="btn btn-ghost btn-xs justify-center">
                    +{ml < 1000 ? `${ml}ml` : `${ml/1000}L`}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weight */}
          <motion.div custom={3} variants={card}>
            <div className="card p-4 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Scale size={15} className="text-neon-orange" />
                  <span className="text-xs text-void-600 uppercase tracking-widest">Weight</span>
                </div>
                {weightTrend !== 0 && (
                  <span className={`badge ${weightTrend > 0 ? 'badge-orange' : 'badge-green'}`}>
                    {weightTrend > 0 ? '+' : ''}{weightTrend}kg
                  </span>
                )}
              </div>
              <div className="mono text-2xl font-bold text-white mb-0.5">
                {latestWeight ? <><AnimatedNumber value={latestWeight} decimals={1} className="text-neon-orange" /><span className="text-base text-void-600 font-normal"> kg</span></> : <span className="text-void-600 text-base">No data</span>}
              </div>
              <div className="text-xs text-void-600 mb-2">7d trend</div>
              {weightHistory.length > 1 ? (
                <ResponsiveContainer width="100%" height={52}>
                  <LineChart data={weightHistory.slice(-14)}>
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
                    <Tooltip
                      contentStyle={{ background: '#0d0d0d', border: '1px solid #252525', borderRadius: '8px', fontSize: '11px' }}
                      formatter={(v: number) => [`${v} kg`]}
                      labelFormatter={(l) => fmt.dateShort(l)}
                    />
                    <Line
                      type="monotone" dataKey="weight"
                      stroke="#ff8c42" strokeWidth={2} dot={false}
                      style={{ filter: 'drop-shadow(0 0 4px rgba(255,140,66,0.5))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[52px] flex items-center justify-center text-xs text-void-600">
                  Log measurements to see trend
                </div>
              )}
            </div>
          </motion.div>

          {/* Today's Workout */}
          <motion.div custom={4} variants={card} className="col-span-2">
            <div className={`card p-4 ${activeWorkout ? 'card-cyan' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Dumbbell size={15} className="text-neon-cyan" />
                  <span className="text-xs text-void-600 uppercase tracking-widest">
                    {activeWorkout ? 'Active Workout' : 'Workout'}
                  </span>
                  {activeWorkout && <span className="pulse-dot pulse-dot-green" />}
                </div>
                <Link to="/workout" className="btn btn-icon">
                  <ChevronRight size={14} />
                </Link>
              </div>
              {activeWorkout ? (
                <div>
                  <div className="font-semibold text-white">{activeWorkout.name}</div>
                  <div className="text-xs text-void-600 mt-0.5">
                    {activeWorkout.exercises.length} exercises · In progress
                  </div>
                </div>
              ) : todayWorkout ? (
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
                      <Activity size={10} className="text-neon-green" />
                    </div>
                    <span className="font-semibold text-white">{todayWorkout.name}</span>
                  </div>
                  <div className="text-xs text-void-600 mt-1">
                    {todayWorkout.exercises.length} exercises · {formatDuration(todayWorkout.duration ?? 0)} · {Math.round(todayWorkout.totalVolume)} kg volume
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-void-600 text-sm">No workout logged today</span>
                  <Link to="/workout" className="btn btn-primary btn-sm">
                    <Plus size={13} /> Start
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Weekly volume heatmap */}
        <motion.div custom={5} variants={card} className="col-span-12 md:col-span-6">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={15} className="text-neon-purple" />
                <span className="text-xs text-void-600 uppercase tracking-widest">Weekly Volume</span>
              </div>
              <span className="text-xs text-void-600">{weekWorkouts.length} sessions</span>
            </div>
            {topMuscles.length > 0 ? (
              <div className="space-y-2.5">
                {topMuscles.map(([muscle, vol]) => {
                  const color = muscleColor(muscle)
                  const maxVol = topMuscles[0][1]
                  return (
                    <div key={muscle}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs" style={{ color }}>{muscle}</span>
                        <span className="mono text-xs text-void-600">{Math.round(vol)}kg</span>
                      </div>
                      <div className="progress-track h-1.5">
                        <motion.div
                          className="progress-fill"
                          style={{ background: color, width: `${pct(vol, maxVol)}%` }}
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
              <div className="text-center py-4 text-void-600 text-sm">
                Complete workouts to see volume breakdown
              </div>
            )}
          </div>
        </motion.div>

        {/* Personal Records */}
        <motion.div custom={6} variants={card} className="col-span-12 md:col-span-6">
          <div className="card p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy size={15} className="text-neon-yellow" />
                <span className="text-xs text-void-600 uppercase tracking-widest">Personal Records</span>
              </div>
              <Link to="/progress" className="btn btn-icon">
                <ChevronRight size={14} />
              </Link>
            </div>
            {recentPRs.length > 0 ? (
              <div className="space-y-2">
                {recentPRs.map(pr => (
                  <div key={pr.exerciseId} className="flex items-center justify-between py-1.5 border-b border-void-300 last:border-0">
                    <div>
                      <div className="text-sm text-white font-medium truncate max-w-[180px]">{pr.exerciseName}</div>
                      <div className="text-xs text-void-600">{pr.weight}kg × {pr.reps} reps</div>
                    </div>
                    <div className="text-right">
                      <div className="mono text-sm font-bold text-neon-yellow">{pr.estimatedOneRM}kg</div>
                      <div className="text-[10px] text-void-600">e1RM</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-void-600 text-sm">
                Complete workouts to track PRs
              </div>
            )}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div custom={7} variants={card} className="col-span-12">
          <div className="card p-4 relative overflow-hidden"
            style={{ borderColor: 'rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.02)' }}>
            <div className="absolute top-2 left-4 text-4xl text-neon-cyan/10 font-black leading-none">"</div>
            <div className="flex items-center gap-3">
              <Zap size={16} className="text-neon-cyan flex-shrink-0" />
              <p className="text-sm text-void-600 italic">{quote}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
