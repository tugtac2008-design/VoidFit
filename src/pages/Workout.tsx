import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, X, Dumbbell, Play, Square, Clock, ChevronDown, ChevronUp,
  Trash2, Timer, Check, Trophy, BookOpen, Layers, Edit2, Flame
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { useSounds } from '../hooks/useSounds'
import Modal from '../components/Modal'
import RestTimer from '../components/RestTimer'
import { Exercise, WorkoutTemplate } from '../types'
import { EXERCISE_DATABASE, searchExercises, MUSCLE_GROUPS } from '../data/exercises'
import { fmt, TODAY, formatDuration, muscleColor, formatVolume } from '../utils/format'
import { calc1RM, calcVolume } from '../utils/calculations'

export default function Workout() {
  const snd = useSounds()
  const {
    activeWorkout, workouts, templates, settings, personalRecords,
    startWorkout, startFromTemplate, addExerciseToActive, removeExerciseFromActive,
    addSetToExercise, updateSet, removeSet, toggleSetComplete, finishWorkout, discardWorkout,
    deleteWorkout, updateExerciseNotes,
  } = useStore()

  const [tab, setTab] = useState<'active' | 'history' | 'templates'>('active')
  const [exModal, setExModal] = useState(false)
  const [exSearch, setExSearch] = useState('')
  const [exFilter, setExFilter] = useState<string>('All')
  const [startModal, setStartModal] = useState(false)
  const [workoutName, setWorkoutName] = useState('')
  const [bodyweight, setBodyweight] = useState('')
  const [restTimerOpen, setRestTimerOpen] = useState(false)
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set())
  const [confirmFinish, setConfirmFinish] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Workout timer
  useEffect(() => {
    if (!activeWorkout) { setElapsedSeconds(0); return }
    const start = new Date(activeWorkout.startTime).getTime()
    const update = () => setElapsedSeconds(Math.floor((Date.now() - start) / 1000))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [activeWorkout?.startTime])

  const exerciseResults = useMemo(() => {
    let list = EXERCISE_DATABASE
    if (exFilter !== 'All') list = list.filter(e => e.muscleGroup === exFilter)
    if (exSearch.trim()) list = searchExercises(exSearch).filter(e => exFilter === 'All' || e.muscleGroup === exFilter)
    return list
  }, [exSearch, exFilter])

  const today = TODAY()
  const recentWorkouts = workouts.slice(0, 20)

  const toggleExpand = (id: string) => {
    setExpandedExercises(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const handleStartBlank = () => {
    if (!workoutName.trim()) return
    startWorkout(workoutName, bodyweight ? parseFloat(bodyweight) : undefined)
    setStartModal(false)
    setWorkoutName('')
    setBodyweight('')
    setTab('active')
  }

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
    return `${m}:${s.toString().padStart(2,'0')}`
  }

  const totalVolume = activeWorkout ? activeWorkout.exercises.reduce((s, ex) => s + calcVolume(ex.sets), 0) : 0
  const completedSets = activeWorkout ? activeWorkout.exercises.reduce((s, ex) => s + ex.sets.filter(st => st.completed).length, 0) : 0

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
          <h1 className="text-xl font-black text-white">Workout</h1>
          <p className="text-void-600 text-xs">
            {activeWorkout ? <span className="flex items-center gap-1.5"><span className="pulse-dot pulse-dot-green inline-block" /> Active session</span> : `${workouts.length} sessions logged`}
          </p>
        </div>
        {!activeWorkout && (
          <button onClick={() => setStartModal(true)} className="btn btn-primary">
            <Play size={14} /> Start Workout
          </button>
        )}
        {activeWorkout && (
          <div className="flex items-center gap-2">
            <div className="card px-3 py-1.5 card-cyan flex items-center gap-2">
              <Clock size={13} className="text-neon-cyan" />
              <span className="mono text-sm font-bold text-neon-cyan">{formatTimer(elapsedSeconds)}</span>
            </div>
            <button onClick={() => setConfirmFinish(true)} className="btn btn-success btn-sm">
              <Check size={14} /> Finish
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-void-100 rounded-10" style={{ borderRadius: '10px' }}>
        {(['active', 'history', 'templates'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`tab flex-1 capitalize ${tab === t ? 'active' : ''}`}>
            {t === 'active' && activeWorkout && <span className="pulse-dot pulse-dot-green mr-1.5 inline-block" />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'history' && ` (${workouts.length})`}
          </button>
        ))}
      </div>

      {/* ── ACTIVE TAB ── */}
      {tab === 'active' && (
        <div className="space-y-4">
          {!activeWorkout ? (
            <div className="card p-8 text-center">
              <Dumbbell size={32} className="text-void-500 mx-auto mb-3" />
              <div className="text-white font-semibold mb-1">No Active Workout</div>
              <div className="text-void-600 text-sm mb-4">Start a new workout or pick a template</div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setStartModal(true)} className="btn btn-primary">
                  <Play size={14} /> Start Blank
                </button>
                <button onClick={() => setTab('templates')} className="btn btn-ghost">
                  <BookOpen size={14} /> Templates
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Workout stats bar */}
              <div className="card p-4 card-cyan">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-white">{activeWorkout.name}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setRestTimerOpen(r => !r)} className="btn btn-ghost btn-sm">
                      <Timer size={14} /> Rest Timer
                    </button>
                    <button onClick={() => discardWorkout()} className="btn btn-danger btn-sm">
                      <X size={14} /> Discard
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="mono text-xl font-bold text-neon-cyan">{formatTimer(elapsedSeconds)}</div>
                    <div className="text-[10px] text-void-600 uppercase tracking-widest">Duration</div>
                  </div>
                  <div>
                    <div className="mono text-xl font-bold text-neon-green">{completedSets}</div>
                    <div className="text-[10px] text-void-600 uppercase tracking-widest">Sets Done</div>
                  </div>
                  <div>
                    <div className="mono text-xl font-bold text-neon-purple">{Math.round(totalVolume)}</div>
                    <div className="text-[10px] text-void-600 uppercase tracking-widest">Volume (kg)</div>
                  </div>
                </div>
              </div>

              {/* Exercises */}
              {activeWorkout.exercises.map((ex, exIdx) => {
                const expanded = !expandedExercises.has(ex.id)
                const exVol = calcVolume(ex.sets)
                const color = muscleColor(ex.exercise.muscleGroup)
                const pr = personalRecords.find(p => p.exerciseId === ex.exerciseId)

                return (
                  <motion.div key={ex.id} className="card overflow-hidden"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: exIdx * 0.05 }}>
                    {/* Exercise header */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-10 rounded-full" style={{ background: color }} />
                          <div>
                            <div className="font-semibold text-white">{ex.exercise.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs" style={{ color }}>{ex.exercise.muscleGroup}</span>
                              <span className="text-void-600 text-xs">· {ex.exercise.equipment}</span>
                              {exVol > 0 && <span className="mono text-xs text-void-600">· {Math.round(exVol)}kg vol</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleExpand(ex.id)} className="btn btn-icon">
                            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          <button onClick={() => removeExerciseFromActive(ex.id)} className="btn btn-icon" style={{ color: '#ff3b5c' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {pr && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-neon-yellow">
                          <Trophy size={10} />
                          PR: {pr.weight}kg × {pr.reps} reps ({pr.estimatedOneRM}kg e1RM)
                        </div>
                      )}
                    </div>

                    {expanded && (
                      <div className="border-t border-void-300">
                        {/* Set header */}
                        <div className="grid grid-cols-[28px_1fr_1fr_1fr_40px] gap-2 px-4 py-2 text-[10px] text-void-600 uppercase tracking-widest">
                          <span>#</span>
                          <span>Weight (kg)</span>
                          <span>Reps</span>
                          <span>RPE</span>
                          <span />
                        </div>

                        {ex.sets.map((set, si) => {
                          const e1rm = set.weight > 0 && set.reps > 0 ? calc1RM(set.weight, set.reps) : null
                          return (
                            <div
                              key={set.id}
                              className={`set-row px-4 ${set.completed ? 'completed' : ''} ${set.isWarmup ? 'warmup' : ''}`}
                            >
                              <div className="flex items-center justify-center">
                                {set.isWarmup ? (
                                  <span className="text-[10px] text-void-600">W</span>
                                ) : (
                                  <span className="mono text-xs text-void-600">{si + 1}</span>
                                )}
                              </div>
                              <input
                                type="number" step="2.5" min="0"
                                value={set.weight || ''}
                                placeholder="0"
                                onChange={e => updateSet(ex.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                                className="input-void text-center mono"
                                style={{ padding: '5px 6px', fontSize: '16px' }}
                              />
                              <input
                                type="number" step="1" min="1"
                                value={set.reps || ''}
                                placeholder="0"
                                onChange={e => updateSet(ex.id, set.id, { reps: parseInt(e.target.value) || 0 })}
                                className="input-void text-center mono"
                                style={{ padding: '5px 6px', fontSize: '16px' }}
                              />
                              <input
                                type="number" step="0.5" min="6" max="10"
                                value={set.rpe || ''}
                                placeholder="—"
                                onChange={e => updateSet(ex.id, set.id, { rpe: parseFloat(e.target.value) || undefined })}
                                className="input-void text-center mono"
                                style={{ padding: '5px 6px', fontSize: '16px' }}
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => { toggleSetComplete(ex.id, set.id); set.completed ? snd.dismiss() : snd.check() }}
                                  className={`w-7 h-7 rounded-6 border flex items-center justify-center transition-all ${
                                    set.completed
                                      ? 'bg-neon-green/15 border-neon-green/40 text-neon-green'
                                      : 'border-void-400 text-void-600 hover:border-void-500'
                                  }`}
                                  style={{ borderRadius: '6px' }}
                                >
                                  <Check size={12} />
                                </button>
                              </div>
                            </div>
                          )
                        })}

                        {/* e1RM row (if last completed set has data) */}
                        {(() => {
                          const last = ex.sets.filter(s => s.completed && s.weight > 0 && s.reps > 0).pop()
                          if (!last) return null
                          return (
                            <div className="px-4 py-2 flex items-center gap-1.5 text-xs text-void-600">
                              <Trophy size={10} className="text-neon-yellow" />
                              e1RM: <span className="mono text-neon-yellow font-bold">{calc1RM(last.weight, last.reps)}kg</span>
                            </div>
                          )
                        })()}

                        <div className="flex gap-2 p-3 border-t border-void-300">
                          <button onClick={() => addSetToExercise(ex.id)} className="btn btn-ghost btn-sm flex-1">
                            <Plus size={13} /> Add Set
                          </button>
                          <button
                            onClick={() => {
                              // Add warmup set
                              addSetToExercise(ex.id)
                              // Mark last set as warmup
                              const updated = useStore.getState().activeWorkout
                              if (updated) {
                                const exFound = updated.exercises.find(e => e.id === ex.id)
                                if (exFound) {
                                  const lastSet = exFound.sets[exFound.sets.length - 1]
                                  updateSet(ex.id, lastSet.id, { isWarmup: true })
                                }
                              }
                            }}
                            className="btn btn-ghost btn-sm"
                          >
                            W+
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}

              <button onClick={() => setExModal(true)} className="btn btn-primary w-full btn-lg">
                <Plus size={16} /> Add Exercise
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === 'history' && (
        <div className="space-y-3">
          {recentWorkouts.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-void-600 text-sm">No workouts logged yet</div>
            </div>
          ) : (
            recentWorkouts.map(w => (
              <motion.div key={w.id} className="card p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-white">{w.name}</div>
                    <div className="text-xs text-void-600 mt-0.5">{fmt.date(w.date)}</div>
                  </div>
                  <button onClick={() => deleteWorkout(w.id)} className="btn btn-icon" style={{ color: '#ff3b5c' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {[
                    { label: 'Duration', val: formatDuration(w.duration ?? 0), color: '#ff9028' },
                    { label: 'Exercises', val: w.exercises.length, color: '#a855f7' },
                    { label: 'Sets', val: w.totalSets, color: '#00ff87' },
                    { label: 'Volume', val: `${Math.round(w.totalVolume)}kg`, color: '#ff8c42' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="text-center">
                      <div className="mono text-sm font-bold" style={{ color }}>{val}</div>
                      <div className="text-[10px] text-void-600">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {[...new Set(w.exercises.map(e => e.exercise.muscleGroup))].map(mg => (
                    <span key={mg} className="badge badge-gray text-[10px]" style={{ color: muscleColor(mg) }}>
                      {mg}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ── TEMPLATES TAB ── */}
      {tab === 'templates' && (
        <div className="space-y-3">
          {templates.map(tpl => (
            <div key={tpl.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-white">{tpl.name}</div>
                  {tpl.description && <div className="text-xs text-void-600 mt-0.5">{tpl.description}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${tpl.difficulty === 'advanced' ? 'badge-red' : tpl.difficulty === 'intermediate' ? 'badge-orange' : 'badge-green'} capitalize`}>
                    {tpl.difficulty}
                  </span>
                  {tpl.estimatedDuration && (
                    <span className="badge badge-gray">~{tpl.estimatedDuration}m</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tpl.muscleGroups.map(mg => (
                  <span key={mg} className="badge badge-gray" style={{ color: muscleColor(mg), borderColor: `${muscleColor(mg)}30` }}>
                    {mg}
                  </span>
                ))}
              </div>
              <div className="text-xs text-void-600 mb-3">
                {tpl.exercises.length} exercises
              </div>
              <button
                onClick={() => { startFromTemplate(tpl); setTab('active') }}
                className="btn btn-primary w-full"
              >
                <Play size={14} /> Start This Workout
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Start Workout Modal */}
      <Modal open={startModal} onClose={() => setStartModal(false)} title="Start Workout" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Workout Name</label>
            <input
              className="input-void" placeholder="e.g. Push Day, Chest & Tri..." autoFocus
              value={workoutName} onChange={e => setWorkoutName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStartBlank()}
            />
          </div>
          <div>
            <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Body Weight (kg, optional)</label>
            <input className="input-void" type="number" step="0.1" placeholder="—" value={bodyweight}
              onChange={e => setBodyweight(e.target.value)} />
          </div>
          <div className="divider" />
          <div className="text-xs text-void-600 mb-2">Or start from template:</div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {templates.map(tpl => (
              <button key={tpl.id} onClick={() => { startFromTemplate(tpl); setStartModal(false); setTab('active') }}
                className="w-full text-left p-3 rounded-10 hover:bg-void-300 transition-colors border border-transparent hover:border-void-400"
                style={{ borderRadius: '10px' }}>
                <div className="text-sm font-semibold text-white">{tpl.name}</div>
                <div className="text-xs text-void-600">{tpl.exercises.length} exercises · ~{tpl.estimatedDuration}m</div>
              </button>
            ))}
          </div>
          <button onClick={handleStartBlank} disabled={!workoutName.trim()} className="btn btn-primary w-full btn-lg">
            <Play size={16} /> Start Blank Workout
          </button>
        </div>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal open={exModal} onClose={() => setExModal(false)} title="Add Exercise" size="lg" noPadding>
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-600" />
            <input className="input-void pl-9" placeholder="Search exercises..." autoFocus
              value={exSearch} onChange={e => setExSearch(e.target.value)} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['All', ...MUSCLE_GROUPS].map(mg => (
              <button key={mg} onClick={() => setExFilter(mg)}
                className={`tab text-xs ${exFilter === mg ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: '11px' }}>
                {mg}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto max-h-96 px-4 pb-4 space-y-1">
          {exerciseResults.map(ex => {
            const color = muscleColor(ex.muscleGroup)
            const alreadyAdded = activeWorkout?.exercises.some(e => e.exerciseId === ex.id)
            return (
              <button
                key={ex.id}
                onClick={() => { if (!alreadyAdded) { addExerciseToActive(ex); setExModal(false) } }}
                disabled={alreadyAdded}
                className="w-full text-left p-3 rounded-10 transition-colors border border-transparent hover:bg-void-300 hover:border-void-400 disabled:opacity-40"
                style={{ borderRadius: '10px' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{ex.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color }}>{ex.muscleGroup}</span>
                      <span className="text-void-600 text-xs">· {ex.equipment}</span>
                      <span className={`badge ${ex.type === 'compound' ? 'badge-cyan' : 'badge-gray'} text-[9px]`}>
                        {ex.type}
                      </span>
                    </div>
                  </div>
                  {alreadyAdded && <span className="badge badge-green text-[10px]">Added</span>}
                </div>
              </button>
            )
          })}
        </div>
      </Modal>

      {/* Confirm Finish Modal */}
      <Modal open={confirmFinish} onClose={() => setConfirmFinish(false)} title="Finish Workout?" size="sm">
        <div className="space-y-4">
          <p className="text-void-600 text-sm">
            Save this workout? {completedSets} sets completed · {Math.round(totalVolume)}kg total volume
          </p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmFinish(false)} className="btn btn-ghost flex-1">Cancel</button>
            <button onClick={() => { finishWorkout(); snd.achievement(); setConfirmFinish(false); setTab('history') }} className="btn btn-success flex-1">
              <Check size={14} /> Save & Finish
            </button>
          </div>
        </div>
      </Modal>

      {/* Rest timer float */}
      <AnimatePresence>
        {restTimerOpen && (
          <RestTimer
            defaultSeconds={useStore.getState().settings.restTimerDefault}
            onClose={() => setRestTimerOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
