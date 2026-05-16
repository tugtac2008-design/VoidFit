import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, Trash2, Edit3, Trophy, ChevronDown, ChevronUp, X, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useSounds } from '../hooks/useSounds'
import { Goal, GoalType, GoalStatus } from '../types'
import { TODAY, fmt } from '../utils/format'

const card = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.32, ease: [0.4, 0, 0.2, 1] },
  }),
}

const GOAL_META: Record<GoalType, { icon: string; color: string; label: string }> = {
  weight_loss:  { icon: '⚖️', color: '#ff3b5c',  label: 'Weight Loss' },
  weight_gain:  { icon: '📈', color: '#00ff87',  label: 'Weight Gain' },
  strength:     { icon: '🏋️', color: '#00d4ff',  label: 'Strength' },
  habit:        { icon: '📅', color: '#a855f7',  label: 'Habit' },
  endurance:    { icon: '🏃', color: '#ff8c42',  label: 'Endurance' },
  body_comp:    { icon: '👤', color: '#ffd700',  label: 'Body Comp' },
}

function daysLeft(deadline: string): number {
  const d = new Date(deadline)
  const now = new Date()
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

interface GoalCardProps {
  goal: Goal
  index: number
  onEdit: (g: Goal) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Goal>) => void
}

function GoalCard({ goal, index, onEdit, onDelete, onUpdate }: GoalCardProps) {
  const meta = GOAL_META[goal.type]
  const pctDone = goal.targetValue > 0
    ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
    : 0
  const days = daysLeft(goal.deadline)
  const isOverdue = days < 0

  return (
    <motion.div
      custom={index}
      variants={card}
      className="glass-card"
      style={{ position: 'relative' }}
    >
      {/* Type badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{meta.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{goal.title}</div>
            <span className="badge" style={{
              background: `${meta.color}18`,
              color: meta.color,
              border: `1px solid ${meta.color}33`,
              marginTop: 4,
              display: 'inline-flex',
            }}>
              {meta.label}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {goal.status === 'active' && (
            <button
              onClick={() => onUpdate(goal.id, { status: 'completed' as GoalStatus })}
              className="btn btn-icon"
              title="Mark complete"
            >
              <Check size={14} style={{ color: '#00ff87' }} />
            </button>
          )}
          <button onClick={() => onEdit(goal)} className="btn btn-icon">
            <Edit3 size={13} />
          </button>
          <button onClick={() => onDelete(goal.id)} className="btn btn-icon">
            <Trash2 size={13} style={{ color: '#ff3b5c' }} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#6b6b6b' }}>Progress</span>
          <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: meta.color, fontWeight: 600 }}>
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </span>
        </div>
        <div className="progress-track" style={{ height: 8, borderRadius: 4 }}>
          <motion.div
            className="progress-fill"
            style={{ background: meta.color, height: '100%', borderRadius: 4 }}
            initial={{ width: 0 }}
            animate={{ width: `${pctDone}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: index * 0.1 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: '#404040' }}>0</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>{pctDone}%</span>
          <span style={{ fontSize: 11, color: '#404040' }}>{goal.targetValue} {goal.unit}</span>
        </div>
      </div>

      {/* Deadline */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#6b6b6b' }}>Deadline: {fmt.date(goal.deadline)}</span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: isOverdue ? '#ff3b5c' : days < 14 ? '#ffd700' : '#00ff87',
        }}>
          {isOverdue ? `${Math.abs(days)}d overdue` : `${days}d left`}
        </span>
      </div>

      {/* Description */}
      {goal.description && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#525252', borderTop: '1px solid #1a1a1a', paddingTop: 10 }}>
          {goal.description}
        </div>
      )}

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {goal.milestones.map((ms, i) => (
            <span key={i} style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 20,
              background: ms.reached ? `${meta.color}22` : '#111',
              color: ms.reached ? meta.color : '#404040',
              border: `1px solid ${ms.reached ? meta.color + '44' : '#1a1a1a'}`,
            }}>
              {ms.label}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

interface GoalFormData {
  title: string
  type: GoalType
  targetValue: string
  currentValue: string
  unit: string
  deadline: string
  description: string
  milestoneValues: string
}

const EMPTY_FORM: GoalFormData = {
  title: '',
  type: 'strength',
  targetValue: '',
  currentValue: '',
  unit: 'kg',
  deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  description: '',
  milestoneValues: '',
}

function parseMilestones(str: string, unit: string) {
  if (!str.trim()) return []
  return str.split(',').map(s => {
    const v = parseFloat(s.trim())
    return isNaN(v) ? null : { value: v, label: `${v} ${unit}`, reached: false }
  }).filter(Boolean) as { value: number; label: string; reached: boolean }[]
}

export default function Goals() {
  const snd = useSounds()
  const { goals, addGoal, updateGoal, deleteGoal, xp, badges } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [editGoal, setEditGoal] = useState<Goal | null>(null)
  const [form, setForm] = useState<GoalFormData>(EMPTY_FORM)
  const [showCompleted, setShowCompleted] = useState(false)

  const level = Math.floor(xp / 500) + 1
  const xpInLevel = xp % 500
  const xpToNext = 500

  const activeGoals = useMemo(() => goals.filter(g => g.status === 'active'), [goals])
  const completedGoals = useMemo(() => goals.filter(g => g.status === 'completed'), [goals])

  const openNew = () => {
    setEditGoal(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (g: Goal) => {
    setEditGoal(g)
    setForm({
      title: g.title,
      type: g.type,
      targetValue: String(g.targetValue),
      currentValue: String(g.currentValue),
      unit: g.unit,
      deadline: g.deadline.slice(0, 10),
      description: g.description,
      milestoneValues: g.milestones.map(m => m.value).join(', '),
    })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.title || !form.targetValue) return
    const milestones = parseMilestones(form.milestoneValues, form.unit)
    const goalData = {
      title: form.title,
      type: form.type,
      targetValue: parseFloat(form.targetValue),
      currentValue: parseFloat(form.currentValue) || 0,
      unit: form.unit,
      deadline: form.deadline,
      description: form.description,
      milestones,
    }
    if (editGoal) {
      updateGoal(editGoal.id, goalData)
      snd.success()
    } else {
      addGoal(goalData)
      snd.success()
    }
    setShowModal(false)
  }

  const setField = <K extends keyof GoalFormData>(k: K, v: GoalFormData[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="py-2 space-y-8"
    >
      {/* Header */}
      <motion.div custom={0} variants={card}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="text-heading" style={{ color: '#fff' }}>Goals</h1>
            <p style={{ color: '#6b6b6b', fontSize: 13, marginTop: 4 }}>Track your SMART fitness objectives</p>
          </div>
          <button onClick={openNew} className="btn btn-primary btn-lg">
            <Plus size={16} /> New Goal
          </button>
        </div>
      </motion.div>

      {/* Level / XP Bar */}
      <motion.div custom={1} variants={card} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(0,212,255,0.08)', border: '2px solid rgba(0,212,255,0.3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
            }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 900, color: '#00d4ff', lineHeight: 1 }}>{level}</div>
              <div style={{ fontSize: 9, color: '#6b6b6b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Level</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>XP Progress</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#00d4ff' }}>
                {xpInLevel} / {xpToNext} XP
              </span>
            </div>
            <div className="progress-track" style={{ height: 10, borderRadius: 5 }}>
              <motion.div
                className="progress-fill progress-fill-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${(xpInLevel / xpToNext) * 100}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                style={{ height: '100%', borderRadius: 5 }}
              />
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#525252' }}>
              Total XP: {xp} · Next level at {level * 500} XP
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Badges</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700, color: '#ffd700' }}>{badges.length}</div>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      {badges.length > 0 && (
        <motion.div custom={2} variants={card}>
          <div className="text-overline" style={{ marginBottom: 12 }}>Earned Badges</div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {badges.map(badge => (
              <div key={badge.id} className="glass-card" style={{
                minWidth: 100, padding: '14px 16px', textAlign: 'center', flexShrink: 0,
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{badge.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{badge.name}</div>
                <div style={{ fontSize: 10, color: '#525252' }}>{fmt.dateShort(badge.earnedAt)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Goals */}
      <motion.div custom={3} variants={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Target size={16} style={{ color: '#00d4ff' }} />
          <span className="text-overline">Active Goals</span>
          <span className="badge badge-cyan">{activeGoals.length}</span>
        </div>

        {activeGoals.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>No active goals</div>
            <div style={{ fontSize: 13, color: '#6b6b6b', marginBottom: 20 }}>
              Set your first SMART goal to start tracking progress
            </div>
            <button onClick={openNew} className="btn btn-primary btn-lg">
              <Plus size={16} /> Create Your First Goal
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
            {activeGoals.map((goal, i) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                index={i}
                onEdit={openEdit}
                onDelete={deleteGoal}
                onUpdate={(id, updates) => { updateGoal(id, updates); if (updates.status === 'completed') snd.celebrate() }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <motion.div custom={4} variants={card}>
          <button
            onClick={() => setShowCompleted(s => !s)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
              width: '100%',
            }}
          >
            <Trophy size={16} style={{ color: '#ffd700' }} />
            <span className="text-overline">Completed Goals</span>
            <span className="badge badge-yellow">{completedGoals.length}</span>
            <span style={{ marginLeft: 'auto', color: '#525252' }}>
              {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: 16 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 12 }}>
                  {completedGoals.map(goal => {
                    const meta = GOAL_META[goal.type]
                    return (
                      <div key={goal.id} className="glass-card" style={{ opacity: 0.7 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: 20 }}>{meta.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{goal.title}</div>
                            <div style={{ fontSize: 11, color: '#00ff87' }}>✓ Completed</div>
                          </div>
                          <button onClick={() => deleteGoal(goal.id)} className="btn btn-icon">
                            <Trash2 size={12} style={{ color: '#ff3b5c' }} />
                          </button>
                        </div>
                        <div style={{ fontSize: 11, color: '#525252' }}>
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.25 }}
              style={{
                background: '#0d0d0d',
                border: '1px solid #252525',
                borderRadius: 20,
                padding: 28,
                width: '100%',
                maxWidth: 540,
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Modal header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
                  {editGoal ? 'Edit Goal' : 'New Goal'}
                </div>
                <button onClick={() => setShowModal(false)} className="btn btn-icon">
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                    Goal Title *
                  </label>
                  <input
                    className="input-void"
                    placeholder="e.g. Bench Press 100kg"
                    value={form.title}
                    onChange={e => setField('title', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                    Goal Type
                  </label>
                  <select
                    className="input-void"
                    value={form.type}
                    onChange={e => setField('type', e.target.value as GoalType)}
                  >
                    {(Object.keys(GOAL_META) as GoalType[]).map(t => (
                      <option key={t} value={t}>{GOAL_META[t].icon} {GOAL_META[t].label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 100%), 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                      Current *
                    </label>
                    <input
                      className="input-void"
                      type="number"
                      placeholder="0"
                      value={form.currentValue}
                      onChange={e => setField('currentValue', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                      Target *
                    </label>
                    <input
                      className="input-void"
                      type="number"
                      placeholder="100"
                      value={form.targetValue}
                      onChange={e => setField('targetValue', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                      Unit
                    </label>
                    <input
                      className="input-void"
                      placeholder="kg"
                      value={form.unit}
                      onChange={e => setField('unit', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                    Deadline
                  </label>
                  <input
                    className="input-void"
                    type="date"
                    value={form.deadline}
                    min={TODAY()}
                    onChange={e => setField('deadline', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                    Description
                  </label>
                  <textarea
                    className="input-void"
                    placeholder="Describe your goal..."
                    value={form.description}
                    onChange={e => setField('description', e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                    Milestones (comma-separated values, e.g. 25, 50, 75)
                  </label>
                  <input
                    className="input-void"
                    placeholder="e.g. 25, 50, 75"
                    value={form.milestoneValues}
                    onChange={e => setField('milestoneValues', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 2, justifyContent: 'center' }}
                    disabled={!form.title || !form.targetValue}
                  >
                    {editGoal ? 'Save Changes' : 'Create Goal'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
