import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Scale, Ruler, Trophy, ChevronDown, Plus, Trash2,
  BarChart2, Activity, Target
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine, Area, AreaChart
} from 'recharts'
import { useStore } from '../store/useStore'
import Modal from '../components/Modal'
import { fmt, TODAY, muscleColor, formatDuration } from '../utils/format'
import { movingAverage, calcStreak } from '../utils/calculations'
import { EXERCISE_DATABASE } from '../data/exercises'

type Range = '7d' | '30d' | '90d' | '1y'
type MeasureKey = 'chest' | 'waist' | 'hips' | 'leftArm' | 'rightArm' | 'leftThigh' | 'rightThigh' | 'shoulders'

const RANGE_DAYS: Record<Range, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }

const CustomTooltip = ({ active, payload, label }: {active?: boolean, payload?: Array<{value: number, name: string, color: string}>, label?: string}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-2.5" style={{ borderColor: '#252525', minWidth: '120px' }}>
      <div className="text-[10px] text-void-600 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="mono text-xs font-bold" style={{ color: p.color }}>
          {p.value} {p.name === 'weight' ? 'kg' : p.name === 'volume' ? 'kg' : p.name === 'calories' ? 'kcal' : ''}
        </div>
      ))}
    </div>
  )
}

export default function Progress() {
  const { measurements, addMeasurement, deleteMeasurement, workouts, personalRecords, mealEntries, user } = useStore()
  const [range, setRange] = useState<Range>('30d')
  const [measureModal, setMeasureModal] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(EXERCISE_DATABASE.find(e => e.name === 'Barbell Bench Press')?.id ?? '')
  const [measureForm, setMeasureForm] = useState({
    date: TODAY(),
    weight: '' as string | number,
    bodyFat: '' as string | number,
    chest: '' as string | number,
    waist: '' as string | number,
    hips: '' as string | number,
    leftArm: '' as string | number,
    rightArm: '' as string | number,
    leftThigh: '' as string | number,
    rightThigh: '' as string | number,
    shoulders: '' as string | number,
    neck: '' as string | number,
    notes: '',
  })
  const [activeTab, setActiveTab] = useState<'weight' | 'body' | 'strength' | 'workouts'>('weight')

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - RANGE_DAYS[range])
  const cutoffStr = cutoff.toISOString().split('T')[0]

  const weightData = useMemo(() =>
    measurements
      .filter(m => m.weight && m.date >= cutoffStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(m => ({ date: fmt.dateShort(m.date), weight: m.weight!, bodyFat: m.bodyFat })),
    [measurements, cutoffStr]
  )

  const maData = useMemo(() => {
    if (weightData.length < 3) return []
    const ma = movingAverage(weightData.map(d => d.weight), 7)
    return weightData.map((d, i) => ({ ...d, ma: ma[i] }))
  }, [weightData])

  const strengthData = useMemo(() => {
    if (!selectedExercise) return []
    return workouts
      .filter(w => w.date >= cutoffStr)
      .flatMap(w => w.exercises.filter(e => e.exerciseId === selectedExercise)
        .flatMap(ex => ex.sets.filter(s => s.completed && !s.isWarmup && s.weight > 0 && s.reps > 0)
          .map(s => ({ date: fmt.dateShort(w.date), weight: s.weight, reps: s.reps, e1rm: parseFloat((s.weight * (1 + s.reps/30)).toFixed(1)) }))))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [workouts, selectedExercise, cutoffStr])

  const volumeData = useMemo(() => {
    const byWeek: Record<string, number> = {}
    workouts.filter(w => w.date >= cutoffStr).forEach(w => {
      const weekStart = new Date(w.date)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const key = fmt.dateShort(weekStart.toISOString().split('T')[0])
      byWeek[key] = (byWeek[key] ?? 0) + w.totalVolume
    })
    return Object.entries(byWeek).sort(([a], [b]) => a.localeCompare(b))
      .map(([date, volume]) => ({ date, volume: Math.round(volume) }))
  }, [workouts, cutoffStr])

  const calorieData = useMemo(() => {
    const byDate: Record<string, number> = {}
    mealEntries.filter(e => e.date >= cutoffStr).forEach(e => {
      byDate[e.date] = (byDate[e.date] ?? 0) + e.food.calories * e.servings
    })
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b))
      .slice(-RANGE_DAYS[range])
      .map(([date, calories]) => ({ date: fmt.dateShort(date), calories: Math.round(calories) }))
  }, [mealEntries, cutoffStr, range])

  const handleAddMeasurement = () => {
    const m = {
      date: measureForm.date,
      weight: measureForm.weight ? parseFloat(String(measureForm.weight)) : undefined,
      bodyFat: measureForm.bodyFat ? parseFloat(String(measureForm.bodyFat)) : undefined,
      chest: measureForm.chest ? parseFloat(String(measureForm.chest)) : undefined,
      waist: measureForm.waist ? parseFloat(String(measureForm.waist)) : undefined,
      hips: measureForm.hips ? parseFloat(String(measureForm.hips)) : undefined,
      leftArm: measureForm.leftArm ? parseFloat(String(measureForm.leftArm)) : undefined,
      rightArm: measureForm.rightArm ? parseFloat(String(measureForm.rightArm)) : undefined,
      leftThigh: measureForm.leftThigh ? parseFloat(String(measureForm.leftThigh)) : undefined,
      rightThigh: measureForm.rightThigh ? parseFloat(String(measureForm.rightThigh)) : undefined,
      shoulders: measureForm.shoulders ? parseFloat(String(measureForm.shoulders)) : undefined,
      neck: measureForm.neck ? parseFloat(String(measureForm.neck)) : undefined,
      notes: measureForm.notes,
    }
    addMeasurement(m)
    setMeasureModal(false)
  }

  const latest = measurements[0]
  const prev = measurements[1]

  const diff = (key: keyof typeof latest) => {
    if (!latest || !prev) return null
    const a = latest[key] as number
    const b = prev[key] as number
    if (!a || !b) return null
    return parseFloat((a - b).toFixed(2))
  }

  const streak = calcStreak(workouts.map(w => w.date))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="py-2 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Progress</h1>
          <p className="text-void-600 text-xs">{measurements.length} measurements · {workouts.length} workouts</p>
        </div>
        <button onClick={() => setMeasureModal(true)} className="btn btn-primary">
          <Plus size={14} /> Log Measurement
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Current Weight', val: latest?.weight ? `${latest.weight}kg` : '—', color: '#ff8c42', icon: Scale },
          { label: 'Body Fat', val: latest?.bodyFat ? `${latest.bodyFat}%` : '—', color: '#00d4ff', icon: Activity },
          { label: 'Workout Streak', val: streak > 0 ? `${streak}d 🔥` : '0d', color: '#00ff87', icon: Target },
          { label: 'Total Workouts', val: workouts.length, color: '#a855f7', icon: BarChart2 },
        ].map(({ label, val, color, icon: Icon }, i) => (
          <motion.div key={label} className="card p-4"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={13} style={{ color }} />
              <span className="text-xs text-void-600">{label}</span>
            </div>
            <div className="mono text-xl font-bold text-white">{val}</div>
          </motion.div>
        ))}
      </div>

      {/* Range selector */}
      <div className="flex gap-1.5 items-center">
        <span className="text-xs text-void-600 mr-1">Range:</span>
        {(['7d', '30d', '90d', '1y'] as Range[]).map(r => (
          <button key={r} onClick={() => setRange(r)} className={`tab ${range === r ? 'active' : ''}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-void-100 rounded-10" style={{ borderRadius: '10px' }}>
        {(['weight', 'body', 'strength', 'workouts'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`tab flex-1 capitalize text-xs ${activeTab === t ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── WEIGHT TAB ── */}
      {activeTab === 'weight' && (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Body Weight Trend</span>
              {weightData.length > 0 && (
                <div className="flex items-center gap-2">
                  {latest?.weight && prev?.weight && (
                    <span className={`badge ${latest.weight > prev.weight ? 'badge-orange' : 'badge-green'}`}>
                      {latest.weight > prev.weight ? '+' : ''}{diff('weight')}kg
                    </span>
                  )}
                </div>
              )}
            </div>
            {maData.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={maData}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff8c42" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ff8c42" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="weight" stroke="#ff8c42" strokeWidth={2}
                    fill="url(#wGrad)" dot={{ fill: '#ff8c42', strokeWidth: 0, r: 2 }} />
                  <Line type="monotone" dataKey="ma" stroke="#ff8c4280" strokeWidth={1.5}
                    dot={false} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-void-600 text-sm">
                Log measurements to see your weight trend
              </div>
            )}
          </div>

          {/* Body fat chart if data exists */}
          {measurements.some(m => m.bodyFat) && (
            <div className="card p-4">
              <div className="text-sm font-semibold text-white mb-4">Body Fat %</div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={measurements.filter(m => m.bodyFat && m.date >= cutoffStr).sort((a, b) => a.date.localeCompare(b.date)).map(m => ({ date: fmt.dateShort(m.date), bodyFat: m.bodyFat }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <YAxis stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="bodyFat" name="bodyFat" stroke="#00d4ff" strokeWidth={2}
                    dot={{ fill: '#00d4ff', strokeWidth: 0, r: 3 }}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.4))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent measurements table */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-void-300 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Measurement History</span>
            </div>
            <div className="overflow-x-auto">
              <table className="table-void">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Body Fat</th>
                    <th>Waist</th>
                    <th>Notes</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {measurements.slice(0, 15).map(m => (
                    <tr key={m.id}>
                      <td className="mono text-xs">{fmt.date(m.date)}</td>
                      <td className="mono text-neon-orange">{m.weight ? `${m.weight}kg` : '—'}</td>
                      <td className="mono text-neon-cyan">{m.bodyFat ? `${m.bodyFat}%` : '—'}</td>
                      <td className="mono text-void-600">{m.waist ? `${m.waist}cm` : '—'}</td>
                      <td className="text-void-600 text-xs">{m.notes || '—'}</td>
                      <td>
                        <button onClick={() => deleteMeasurement(m.id)} className="btn btn-icon">
                          <Trash2 size={11} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── BODY TAB ── */}
      {activeTab === 'body' && (
        <div className="space-y-4">
          {latest ? (
            <div className="grid grid-cols-2 gap-3">
              {([
                ['Chest', 'chest', '#ff3b5c'],
                ['Waist', 'waist', '#ff8c42'],
                ['Hips', 'hips', '#a855f7'],
                ['Shoulders', 'shoulders', '#00d4ff'],
                ['Left Arm', 'leftArm', '#00ff87'],
                ['Right Arm', 'rightArm', '#00ff87'],
                ['Left Thigh', 'leftThigh', '#ffd700'],
                ['Right Thigh', 'rightThigh', '#ffd700'],
              ] as [string, keyof typeof latest, string][]).map(([label, key, color]) => {
                const val = latest[key]
                const d = diff(key)
                return (
                  <div key={key} className="card p-3">
                    <div className="text-xs text-void-600 mb-0.5">{label}</div>
                    <div className="mono text-xl font-bold" style={{ color }}>
                      {val ? `${val}cm` : '—'}
                    </div>
                    {d !== null && (
                      <div className={`text-xs mono ${d < 0 ? 'text-neon-green' : d > 0 ? 'text-neon-orange' : 'text-void-600'}`}>
                        {d > 0 ? '+' : ''}{d}cm
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Ruler size={24} className="text-void-500 mx-auto mb-3" />
              <div className="text-void-600 text-sm">Log body measurements to track composition</div>
              <button onClick={() => setMeasureModal(true)} className="btn btn-primary mt-4">
                <Plus size={14} /> Add First Measurement
              </button>
            </div>
          )}

          {/* Arm trend */}
          {measurements.some(m => m.leftArm) && (
            <div className="card p-4">
              <div className="text-sm font-semibold text-white mb-4">Arm Size</div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={measurements.filter(m => m.leftArm && m.date >= cutoffStr)
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map(m => ({ date: fmt.dateShort(m.date), left: m.leftArm, right: m.rightArm }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <YAxis stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="left" name="Left" stroke="#00ff87" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="right" name="Right" stroke="#00ff8780" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── STRENGTH TAB ── */}
      {activeTab === 'strength' && (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-white">Strength Progress:</span>
              <select
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
                className="input-void flex-1"
                style={{ padding: '6px 10px' }}
              >
                {EXERCISE_DATABASE.filter(e => e.type !== 'cardio').map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            {strengthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={strengthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <YAxis stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="weight" name="weight" stroke="#00d4ff" strokeWidth={2}
                    dot={{ fill: '#00d4ff', strokeWidth: 0, r: 3 }}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.5))' }} />
                  <Line type="monotone" dataKey="e1rm" name="e1RM" stroke="#a855f780" strokeWidth={1.5}
                    dot={false} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-void-600 text-sm">
                No data for this exercise in the selected range
              </div>
            )}
          </div>

          {/* PR Board */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={15} className="text-neon-yellow" />
              <span className="text-sm font-semibold text-white">Personal Records</span>
            </div>
            <div className="space-y-2">
              {personalRecords.length === 0 ? (
                <div className="text-void-600 text-sm text-center py-4">Complete workouts to set PRs</div>
              ) : personalRecords.sort((a, b) => b.estimatedOneRM - a.estimatedOneRM).map(pr => (
                <div key={pr.exerciseId} className="flex items-center justify-between py-2 border-b border-void-300 last:border-0">
                  <div>
                    <div className="text-sm text-white font-medium">{pr.exerciseName}</div>
                    <div className="text-xs text-void-600">{pr.weight}kg × {pr.reps} · {fmt.date(pr.date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="mono text-lg font-bold text-neon-yellow">{pr.estimatedOneRM}kg</div>
                    <div className="text-[10px] text-void-600">e1RM</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── WORKOUTS TAB ── */}
      {activeTab === 'workouts' && (
        <div className="space-y-4">
          {/* Volume chart */}
          <div className="card p-4">
            <div className="text-sm font-semibold text-white mb-4">Weekly Volume (kg)</div>
            {volumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <YAxis stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="volume" name="volume" fill="#a855f7" radius={[4, 4, 0, 0]}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.3))' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 flex items-center justify-center text-void-600 text-sm">No workout data</div>
            )}
          </div>

          {/* Calorie adherence */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Calorie Intake</span>
              <span className="badge badge-cyan">Goal: {user.macroGoals.calories} kcal</span>
            </div>
            {calorieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={calorieData}>
                  <defs>
                    <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <YAxis stroke="#333" tick={{ fill: '#6b6b6b', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={user.macroGoals.calories} stroke="#00d4ff40" strokeDasharray="6 3" />
                  <Area type="monotone" dataKey="calories" name="calories" stroke="#00d4ff"
                    strokeWidth={2} fill="url(#calGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-void-600 text-sm">Log nutrition to see adherence</div>
            )}
          </div>
        </div>
      )}

      {/* Log Measurement Modal */}
      <Modal open={measureModal} onClose={() => setMeasureModal(false)} title="Log Measurement" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Date</label>
            <input type="date" className="input-void" value={measureForm.date}
              onChange={e => setMeasureForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'weight', label: 'Weight', unit: 'kg', color: '#ff8c42' },
              { key: 'bodyFat', label: 'Body Fat', unit: '%', color: '#00d4ff' },
            ].map(({ key, label, unit, color }) => (
              <div key={key}>
                <label className="block text-xs mb-1" style={{ color }}>{label} ({unit})</label>
                <input type="number" step="0.1" className="input-void"
                  value={(measureForm as Record<string, string | number>)[key]}
                  placeholder="—"
                  onChange={e => setMeasureForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div className="text-xs text-void-600 uppercase tracking-widest mt-2 mb-1">Circumference (cm)</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'chest', label: 'Chest', color: '#ff3b5c' },
              { key: 'waist', label: 'Waist', color: '#ff8c42' },
              { key: 'hips', label: 'Hips', color: '#a855f7' },
              { key: 'shoulders', label: 'Shoulders', color: '#00d4ff' },
              { key: 'leftArm', label: 'Left Arm', color: '#00ff87' },
              { key: 'rightArm', label: 'Right Arm', color: '#00ff87' },
              { key: 'leftThigh', label: 'Left Thigh', color: '#ffd700' },
              { key: 'rightThigh', label: 'Right Thigh', color: '#ffd700' },
              { key: 'neck', label: 'Neck', color: '#818cf8' },
            ].map(({ key, label, color }) => (
              <div key={key}>
                <label className="block text-xs mb-1" style={{ color }}>{label}</label>
                <input type="number" step="0.1" className="input-void"
                  value={(measureForm as Record<string, string | number>)[key]}
                  placeholder="—"
                  onChange={e => setMeasureForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Notes</label>
            <textarea className="input-void" rows={2} value={measureForm.notes}
              onChange={e => setMeasureForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <button onClick={handleAddMeasurement} className="btn btn-primary w-full btn-lg">
            <Plus size={16} /> Save Measurement
          </button>
        </div>
      </Modal>
    </motion.div>
  )
}
