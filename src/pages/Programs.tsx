import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, Star, Clock, Calendar, Trash2, Play, X, CheckCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Program } from '../types'
import { fmt, genId } from '../utils/format'

const card = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.32, ease: [0.4, 0, 0.2, 1] },
  }),
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: '#00ff87',
  intermediate: '#ff9028',
  advanced: '#a855f7',
}

const CATEGORY_COLOR: Record<string, string> = {
  strength: '#ff9028',
  hypertrophy: '#a855f7',
  powerlifting: '#ff3b5c',
  cardio: '#ff8c42',
  general: '#ffd700',
}

interface BuiltinProgram {
  id: string
  name: string
  description: string
  durationWeeks: number
  daysPerWeek: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'strength' | 'hypertrophy' | 'powerlifting' | 'cardio' | 'general'
  tags: string[]
}

const BUILTIN_PROGRAMS: BuiltinProgram[] = [
  {
    id: 'builtin_strength_12',
    name: '12-Week Strength Builder',
    description: 'A comprehensive strength program focusing on the big 3 lifts with progressive overload. Perfect for intermediate lifters looking to maximize strength gains.',
    durationWeeks: 12,
    daysPerWeek: 4,
    difficulty: 'intermediate',
    category: 'strength',
    tags: ['Powerlifting', 'Progressive Overload', 'Big 3'],
  },
  {
    id: 'builtin_hypertrophy_8',
    name: '8-Week Hypertrophy',
    description: 'High volume hypertrophy training designed to maximize muscle growth. Uses a push/pull/legs split with emphasis on time under tension.',
    durationWeeks: 8,
    daysPerWeek: 5,
    difficulty: 'intermediate',
    category: 'hypertrophy',
    tags: ['PPL', 'High Volume', 'Muscle Building'],
  },
  {
    id: 'builtin_beginner_8',
    name: "Beginner's Foundation",
    description: 'A full-body program for newcomers to resistance training. Builds foundational strength, movement patterns, and habits for long-term success.',
    durationWeeks: 8,
    daysPerWeek: 3,
    difficulty: 'beginner',
    category: 'general',
    tags: ['Full Body', 'Beginner', 'Fundamentals'],
  },
  {
    id: 'builtin_ppl',
    name: 'PPL Program',
    description: 'The classic Push/Pull/Legs 6-day split. Train each muscle group twice per week for optimal frequency and volume balance.',
    durationWeeks: 999,
    daysPerWeek: 6,
    difficulty: 'intermediate',
    category: 'hypertrophy',
    tags: ['PPL', '6-Day Split', 'Frequency'],
  },
  {
    id: 'builtin_powerlifting_16',
    name: 'Advanced Powerlifting',
    description: 'A 16-week peaking cycle for competitive powerlifters. Periodized programming leading to a peak performance on competition day.',
    durationWeeks: 16,
    daysPerWeek: 4,
    difficulty: 'advanced',
    category: 'powerlifting',
    tags: ['Competition Prep', 'Peaking', 'Advanced'],
  },
]

interface ProgramCardProps {
  program: BuiltinProgram | Program
  isUserProgram?: boolean
  isActive?: boolean
  onStart: () => void
  onDelete?: () => void
  onDeactivate?: () => void
}

function ProgramCard({ program, isUserProgram, isActive, onStart, onDelete, onDeactivate }: ProgramCardProps) {
  const diffColor = DIFFICULTY_COLOR[program.difficulty] ?? '#b0b0b0'
  const catColor = CATEGORY_COLOR[program.category] ?? '#b0b0b0'
  const isOngoing = program.durationWeeks >= 99

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{program.name}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="badge" style={{
              background: `${diffColor}18`, color: diffColor,
              border: `1px solid ${diffColor}33`, fontSize: 10,
            }}>
              {program.difficulty}
            </span>
            <span className="badge" style={{
              background: `${catColor}18`, color: catColor,
              border: `1px solid ${catColor}33`, fontSize: 10,
            }}>
              {program.category}
            </span>
            {isActive && (
              <span className="badge badge-green" style={{ fontSize: 10 }}>
                ● Active
              </span>
            )}
          </div>
        </div>
        {isUserProgram && (
          <div style={{ display: 'flex', gap: 4 }}>
            {isActive && onDeactivate && (
              <button onClick={onDeactivate} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                Pause
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="btn btn-icon">
                <Trash2 size={13} style={{ color: '#ff3b5c' }} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: 12, color: '#6b6b6b', lineHeight: 1.6, marginBottom: 14, flex: 1 }}>
        {program.description}
      </p>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={12} style={{ color: '#525252' }} />
          <span style={{ fontSize: 12, color: '#b0b0b0' }}>
            {isOngoing ? 'Ongoing' : `${program.durationWeeks}w`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Calendar size={12} style={{ color: '#525252' }} />
          <span style={{ fontSize: 12, color: '#b0b0b0' }}>{program.daysPerWeek}x / week</span>
        </div>
      </div>

      {/* Tags */}
      {'tags' in program && program.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {program.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 20,
              background: '#111', color: '#525252', border: '1px solid #1a1a1a',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress (user programs only) */}
      {'completedWeeks' in program && !isOngoing && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#6b6b6b' }}>Progress</span>
            <span style={{ fontSize: 11, color: '#ff9028', fontFamily: 'JetBrains Mono, monospace' }}>
              Week {(program as Program).completedWeeks} / {program.durationWeeks}
            </span>
          </div>
          <div className="progress-track" style={{ height: 6 }}>
            <div
              className="progress-fill progress-fill-cyan"
              style={{
                width: `${((program as Program).completedWeeks / program.durationWeeks) * 100}%`,
                height: '100%',
              }}
            />
          </div>
        </div>
      )}

      {/* Action */}
      <button
        onClick={onStart}
        className={`btn btn-lg ${isActive ? 'btn-success' : 'btn-primary'}`}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {isActive ? (
          <><CheckCircle size={15} /> Continue Program</>
        ) : (
          <><Play size={15} /> Start Program</>
        )}
      </button>
    </div>
  )
}

interface FormData {
  name: string
  description: string
  durationWeeks: string
  daysPerWeek: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'strength' | 'hypertrophy' | 'powerlifting' | 'cardio' | 'general'
  tags: string
}

const EMPTY_FORM: FormData = {
  name: '',
  description: '',
  durationWeeks: '12',
  daysPerWeek: '4',
  difficulty: 'intermediate',
  category: 'strength',
  tags: '',
}

export default function Programs() {
  const { programs, addProgram, updateProgram, deleteProgram } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)

  const activeProgram = programs.find(p => p.isActive)

  const setField = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleCreate = () => {
    if (!form.name) return
    addProgram({
      name: form.name,
      description: form.description,
      durationWeeks: parseInt(form.durationWeeks) || 12,
      daysPerWeek: parseInt(form.daysPerWeek) || 4,
      difficulty: form.difficulty,
      category: form.category,
      schedule: {},
      isActive: false,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setForm(EMPTY_FORM)
    setShowModal(false)
  }

  const handleStartBuiltin = (bp: BuiltinProgram) => {
    // Deactivate any existing active
    programs.filter(p => p.isActive).forEach(p => updateProgram(p.id, { isActive: false }))
    addProgram({
      name: bp.name,
      description: bp.description,
      durationWeeks: bp.durationWeeks,
      daysPerWeek: bp.daysPerWeek,
      difficulty: bp.difficulty,
      category: bp.category,
      schedule: {},
      isActive: true,
      startedAt: new Date().toISOString(),
      tags: bp.tags,
    })
  }

  const handleStartUserProgram = (p: Program) => {
    programs.filter(pr => pr.isActive).forEach(pr => updateProgram(pr.id, { isActive: false }))
    updateProgram(p.id, { isActive: true, startedAt: new Date().toISOString() })
  }

  const handleDeactivate = (id: string) => {
    updateProgram(id, { isActive: false })
  }

  // Filter out user programs that match builtin IDs
  const userPrograms = programs

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
            <h1 className="text-heading" style={{ color: '#fff' }}>Programs</h1>
            <p style={{ color: '#6b6b6b', fontSize: 13, marginTop: 4 }}>Structured training plans for systematic progress</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-lg">
            <Plus size={16} /> Create Program
          </button>
        </div>
      </motion.div>

      {/* Active Program */}
      {activeProgram && (
        <motion.div custom={1} variants={card}>
          <div className="text-overline" style={{ marginBottom: 12 }}>Currently Active</div>
          <div className="glass-card" style={{
            borderColor: 'rgba(255, 144, 40,0.25)',
            background: 'rgba(255, 144, 40,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="pulse-dot pulse-dot-cyan" />
                  <span style={{ fontSize: 13, color: '#ff9028', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Active Program
                  </span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{activeProgram.name}</h2>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#6b6b6b' }}>
                    <Clock size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                    {activeProgram.durationWeeks >= 99 ? 'Ongoing' : `${activeProgram.durationWeeks} weeks`}
                  </span>
                  <span style={{ fontSize: 12, color: '#6b6b6b' }}>
                    <Calendar size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                    {activeProgram.daysPerWeek} days / week
                  </span>
                  {activeProgram.startedAt && (
                    <span style={{ fontSize: 12, color: '#6b6b6b' }}>
                      Started {fmt.dateShort(activeProgram.startedAt)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeactivate(activeProgram.id)}
                className="btn btn-ghost btn-sm"
              >
                Pause
              </button>
            </div>

            {/* Week Progress */}
            {activeProgram.durationWeeks < 99 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#6b6b6b' }}>Program Progress</span>
                  <span style={{ fontSize: 13, color: '#ff9028', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                    Week {activeProgram.completedWeeks} / {activeProgram.durationWeeks}
                  </span>
                </div>
                <div className="progress-track" style={{ height: 10, borderRadius: 5 }}>
                  <motion.div
                    className="progress-fill progress-fill-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeProgram.completedWeeks / activeProgram.durationWeeks) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 5 }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => updateProgram(activeProgram.id, { completedWeeks: activeProgram.completedWeeks + 1 })}
                className="btn btn-success btn-lg"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <CheckCircle size={15} /> Complete Week {activeProgram.completedWeeks + 1}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* My Programs */}
      {userPrograms.length > 0 && (
        <motion.div custom={2} variants={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Star size={15} style={{ color: '#ffd700' }} />
            <span className="text-overline">My Programs</span>
            <span className="badge badge-yellow">{userPrograms.length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
            {userPrograms.map((p, i) => (
              <motion.div key={p.id} custom={i} variants={card}>
                <ProgramCard
                  program={p}
                  isUserProgram
                  isActive={p.isActive}
                  onStart={() => handleStartUserProgram(p)}
                  onDelete={() => deleteProgram(p.id)}
                  onDeactivate={() => handleDeactivate(p.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Browse Built-in Programs */}
      <motion.div custom={3} variants={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <BookOpen size={15} style={{ color: '#ff9028' }} />
          <span className="text-overline">Program Library</span>
          <span className="badge badge-cyan">{BUILTIN_PROGRAMS.length}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
          {BUILTIN_PROGRAMS.map((bp, i) => (
            <motion.div key={bp.id} custom={i + 4} variants={card}>
              <ProgramCard
                program={bp}
                onStart={() => handleStartBuiltin(bp)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Create Program Modal */}
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
                maxWidth: 520,
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Create Custom Program</div>
                <button onClick={() => setShowModal(false)} className="btn btn-icon">
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                    Program Name *
                  </label>
                  <input
                    className="input-void"
                    placeholder="e.g. My Strength Program"
                    value={form.name}
                    onChange={e => setField('name', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                    Description
                  </label>
                  <textarea
                    className="input-void"
                    placeholder="Describe the program..."
                    value={form.description}
                    onChange={e => setField('description', e.target.value)}
                    rows={2}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                      Duration (weeks)
                    </label>
                    <input
                      className="input-void"
                      type="number"
                      min={1} max={52}
                      value={form.durationWeeks}
                      onChange={e => setField('durationWeeks', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                      Days / Week
                    </label>
                    <input
                      className="input-void"
                      type="number"
                      min={1} max={7}
                      value={form.daysPerWeek}
                      onChange={e => setField('daysPerWeek', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                      Difficulty
                    </label>
                    <select
                      className="input-void"
                      value={form.difficulty}
                      onChange={e => setField('difficulty', e.target.value as FormData['difficulty'])}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                      Category
                    </label>
                    <select
                      className="input-void"
                      value={form.category}
                      onChange={e => setField('category', e.target.value as FormData['category'])}
                    >
                      <option value="strength">Strength</option>
                      <option value="hypertrophy">Hypertrophy</option>
                      <option value="powerlifting">Powerlifting</option>
                      <option value="cardio">Cardio</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                    Tags (comma-separated)
                  </label>
                  <input
                    className="input-void"
                    placeholder="e.g. PPL, High Volume"
                    value={form.tags}
                    onChange={e => setField('tags', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 2, justifyContent: 'center' }}
                    disabled={!form.name}
                  >
                    Create Program
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
