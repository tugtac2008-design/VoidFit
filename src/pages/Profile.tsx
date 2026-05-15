import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Target, Calculator, Dumbbell, ChevronRight, Save, RefreshCw, Info, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import Modal from '../components/Modal'
import { ActivityLevel, FitnessGoal, ExperienceLevel, UserProfile } from '../types'
import { calcBMR, calcTDEE, calcCalorieTarget, calcMacros, calcBMI, bmiCategory, calcPlates, calc1RM, calcWeightForReps } from '../utils/calculations'

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (desk job)',
  light: 'Light (1-3x/week)',
  moderate: 'Moderate (3-5x/week)',
  active: 'Active (6-7x/week)',
  very_active: 'Very Active (2x/day)',
}

const goalLabels: Record<FitnessGoal, { label: string; calAdj: string; color: string }> = {
  lose_fat: { label: 'Lose Fat', calAdj: '−500 kcal', color: '#ff3b5c' },
  maintain: { label: 'Maintain', calAdj: 'TDEE', color: '#b0b0b0' },
  build_muscle: { label: 'Build Muscle', calAdj: '+250 kcal', color: '#00d4ff' },
  aggressive_bulk: { label: 'Aggressive Bulk', calAdj: '+500 kcal', color: '#a855f7' },
  recomp: { label: 'Body Recomp', calAdj: 'TDEE ±0', color: '#00ff87' },
}

export default function Profile() {
  const { user, setUser, recalcMacros, settings, updateSettings, supplements, addSupplement, removeSupplement,
    toggleSupplementLog, isSupplementTaken } = useStore()
  const today = new Date().toISOString().split('T')[0]

  const [tab, setTab] = useState<'profile' | 'goals' | 'calculators' | 'supplements'>('profile')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UserProfile>({ ...user })

  // Plate calculator
  const [plateWeight, setPlateWeight] = useState(100)
  const [plateBar, setPlateBar] = useState(20)
  const [plateUnit, setPlateUnit] = useState<'kg' | 'lbs'>('kg')

  // 1RM calculator
  const [ormWeight, setOrmWeight] = useState(100)
  const [ormReps, setOrmReps] = useState(5)

  // Supplement modal
  const [suppModal, setSuppModal] = useState(false)
  const [suppForm, setSuppForm] = useState({ name: '', dosage: '', timing: 'morning', category: 'morning' as const, color: '#00d4ff' })

  const handleSave = () => {
    setUser(form)
    recalcMacros()
    setEditing(false)
  }

  const bmr = calcBMR(user)
  const tdee = calcTDEE(user)
  const bmi = calcBMI(user.weight, user.height)
  const plates = calcPlates(plateWeight, plateBar, plateUnit)
  const e1rm = calc1RM(ormWeight, ormReps)

  const repChart = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map(r => ({
    reps: r,
    weight: calcWeightForReps(e1rm, r),
    pct: Math.round((calcWeightForReps(e1rm, r) / e1rm) * 100),
  }))

  const supplementCategories = ['morning', 'pre-workout', 'intra-workout', 'post-workout', 'evening', 'with-meals'] as const
  const categoryColors: Record<string, string> = {
    'morning': '#ffd700',
    'pre-workout': '#00ff87',
    'intra-workout': '#00d4ff',
    'post-workout': '#ff3b5c',
    'evening': '#a855f7',
    'with-meals': '#ff8c42',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="py-2 space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Profile</h1>
          <p className="text-void-600 text-xs capitalize">{user.experience} athlete · {user.trainingDays}x/week</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-void-100 rounded-10" style={{ borderRadius: '10px' }}>
        {(['profile', 'goals', 'calculators', 'supplements'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`tab flex-1 capitalize text-xs ${tab === t ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-void-400 flex items-center justify-center">
                  <span className="text-2xl font-black text-neon-cyan">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  {editing ? (
                    <input className="input-void text-lg font-bold" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '4px 8px' }} />
                  ) : (
                    <div className="text-lg font-bold text-white">{user.name}</div>
                  )}
                  <div className="text-xs text-void-600 capitalize">{user.experience} · {user.goal.replace('_', ' ')}</div>
                </div>
              </div>
              <button onClick={() => editing ? handleSave() : setEditing(true)}
                className={`btn ${editing ? 'btn-success' : 'btn-ghost'} btn-sm`}>
                {editing ? <><Save size={13} /> Save</> : <><User size={13} /> Edit</>}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Age', key: 'age', type: 'number', unit: 'years' },
                { label: 'Height', key: 'height', type: 'number', unit: 'cm' },
                { label: 'Weight', key: 'weight', type: 'number', unit: 'kg', step: 0.1 },
              ].map(({ label, key, type, unit, step }) => (
                <div key={key}>
                  <div className="text-xs text-void-600 mb-1">{label}</div>
                  {editing ? (
                    <input type={type} step={step ?? 1} className="input-void"
                      value={(form as Record<string, unknown>)[key] as string | number}
                      onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) }))} />
                  ) : (
                    <div className="mono text-base font-bold text-white">{(user as Record<string, unknown>)[key] as string | number} <span className="text-void-600 text-xs font-normal">{unit}</span></div>
                  )}
                </div>
              ))}
              <div>
                <div className="text-xs text-void-600 mb-1">Gender</div>
                {editing ? (
                  <select className="input-void" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as 'male' | 'female' }))}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                ) : (
                  <div className="mono text-base font-bold text-white capitalize">{user.gender}</div>
                )}
              </div>
            </div>

            {editing && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs text-void-600 mb-1.5">Activity Level</label>
                  <select className="input-void" value={form.activityLevel}
                    onChange={e => setForm(f => ({ ...f, activityLevel: e.target.value as ActivityLevel }))}>
                    {Object.entries(activityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-void-600 mb-1.5">Experience Level</label>
                  <select className="input-void" value={form.experience}
                    onChange={e => setForm(f => ({ ...f, experience: e.target.value as ExperienceLevel }))}>
                    {['beginner', 'intermediate', 'advanced', 'elite'].map(e => (
                      <option key={e} value={e} className="capitalize">{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-void-600 mb-1.5">Training Days/Week: <span className="text-neon-cyan mono">{form.trainingDays}</span></label>
                  <input type="range" min="1" max="7" className="slider-void" value={form.trainingDays}
                    onChange={e => setForm(f => ({ ...f, trainingDays: parseInt(e.target.value) }))} />
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'BMR', val: `${Math.round(bmr)}`, unit: 'kcal/day', color: '#ff8c42' },
              { label: 'TDEE', val: `${Math.round(tdee)}`, unit: 'kcal/day', color: '#00d4ff' },
              { label: 'BMI', val: bmi, unit: bmiCategory(bmi), color: bmi < 25 ? '#00ff87' : '#ff8c42' },
            ].map(({ label, val, unit, color }) => (
              <div key={label} className="card p-3 text-center">
                <div className="mono text-xl font-bold" style={{ color }}>{val}</div>
                <div className="text-xs text-void-600">{label}</div>
                <div className="text-[10px] text-void-600 mt-0.5">{unit}</div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="card p-4">
            <div className="text-sm font-semibold text-white mb-3">App Settings</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-void-600">Weight Unit</span>
                <div className="flex gap-1.5">
                  {(['kg', 'lbs'] as const).map(u => (
                    <button key={u} onClick={() => updateSettings({ weightUnit: u })}
                      className={`tab text-xs ${settings.weightUnit === u ? 'active' : ''}`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-void-600">Default Rest Timer</span>
                <div className="flex gap-1.5">
                  {[60, 90, 120, 180].map(s => (
                    <button key={s} onClick={() => updateSettings({ restTimerDefault: s })}
                      className={`tab text-xs ${settings.restTimerDefault === s ? 'active' : ''}`}>
                      {s < 60 ? `${s}s` : `${s/60}m`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-void-600">Micronutrients</span>
                <button onClick={() => updateSettings({ showMicronutrients: !settings.showMicronutrients })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${settings.showMicronutrients ? 'bg-neon-cyan/30 border-neon-cyan/50' : 'bg-void-300 border-void-400'} border`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${settings.showMicronutrients ? 'left-5 bg-neon-cyan' : 'left-0.5 bg-void-600'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GOALS TAB ── */}
      {tab === 'goals' && (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-sm font-semibold text-white mb-3">Current Goal</div>
            <div className="space-y-2">
              {(Object.entries(goalLabels) as [FitnessGoal, typeof goalLabels[FitnessGoal]][]).map(([k, v]) => (
                <button key={k} onClick={() => { setUser({ goal: k }); recalcMacros() }}
                  className={`w-full p-3 rounded-10 border text-left transition-all flex items-center justify-between ${
                    user.goal === k ? 'border-neon-cyan bg-neon-cyan/5' : 'border-void-300 hover:border-void-400'
                  }`} style={{ borderRadius: '10px' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: v.color, boxShadow: `0 0 6px ${v.color}80` }} />
                    <div>
                      <div className="text-sm font-semibold text-white">{v.label}</div>
                      <div className="text-xs text-void-600">{v.calAdj}</div>
                    </div>
                  </div>
                  {user.goal === k && <span className="badge badge-cyan">Active</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">Daily Targets</span>
              <button onClick={recalcMacros} className="btn btn-ghost btn-sm">
                <RefreshCw size={13} /> Recalculate
              </button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'calories', label: 'Calories', unit: 'kcal', color: '#00d4ff', step: 50 },
                { key: 'protein', label: 'Protein', unit: 'g', color: '#00ff87', step: 5 },
                { key: 'carbs', label: 'Carbohydrates', unit: 'g', color: '#00d4ff', step: 5 },
                { key: 'fat', label: 'Fat', unit: 'g', color: '#a855f7', step: 2 },
                { key: 'fiber', label: 'Fiber', unit: 'g', color: '#00ff87', step: 1 },
                { key: 'water', label: 'Water', unit: 'ml', color: '#818cf8', step: 100 },
              ].map(({ key, label, unit, color, step }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs w-24 flex-shrink-0" style={{ color }}>{label}</span>
                  <input
                    type="number" step={step} min="0"
                    className="input-void flex-1 mono"
                    style={{ padding: '6px 10px' }}
                    value={(user.macroGoals as Record<string, number>)[key]}
                    onChange={e => setUser({ macroGoals: { ...user.macroGoals, [key]: parseFloat(e.target.value) || 0 } })}
                  />
                  <span className="text-xs text-void-600 w-8">{unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 card-cyan text-center">
            <div className="text-xs text-void-600 uppercase tracking-widest mb-3">Protein Per Bodyweight</div>
            <div className="mono text-2xl font-bold text-neon-cyan">{(user.macroGoals.protein / user.weight).toFixed(2)}g/kg</div>
            <div className="text-xs text-void-600 mt-1">
              {user.macroGoals.protein / user.weight >= 2 ? '✅ Optimal for muscle building' : '⚠ Consider increasing for better muscle protein synthesis'}
            </div>
          </div>
        </div>
      )}

      {/* ── CALCULATORS TAB ── */}
      {tab === 'calculators' && (
        <div className="space-y-4">
          {/* 1RM Calculator */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={15} className="text-neon-yellow" />
              <span className="text-sm font-semibold text-white">1RM Calculator</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs text-void-600 mb-1.5">Weight Lifted (kg)</label>
                <input type="number" step="2.5" className="input-void" value={ormWeight}
                  onChange={e => setOrmWeight(parseFloat(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs text-void-600 mb-1.5">Reps Performed</label>
                <input type="number" min="1" max="30" className="input-void" value={ormReps}
                  onChange={e => setOrmReps(parseInt(e.target.value))} />
              </div>
            </div>
            <div className="card p-4 card-cyan text-center mb-4">
              <div className="text-xs text-void-600 mb-1">Estimated 1RM</div>
              <div className="mono text-3xl font-black text-neon-cyan">{e1rm} kg</div>
            </div>
            <div className="overflow-x-auto">
              <table className="table-void text-xs">
                <thead>
                  <tr>
                    <th>Reps</th>
                    <th>Weight (kg)</th>
                    <th>% of 1RM</th>
                  </tr>
                </thead>
                <tbody>
                  {repChart.map(({ reps, weight, pct }) => (
                    <tr key={reps}>
                      <td className="mono">{reps}</td>
                      <td className="mono font-bold text-neon-cyan">{weight}</td>
                      <td className="mono text-void-600">{pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Plate Calculator */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={15} className="text-neon-purple" />
              <span className="text-sm font-semibold text-white">Plate Calculator</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs text-void-600 mb-1.5">Total Weight</label>
                <input type="number" step="2.5" className="input-void" value={plateWeight}
                  onChange={e => setPlateWeight(parseFloat(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs text-void-600 mb-1.5">Bar Weight</label>
                <input type="number" step="0.5" className="input-void" value={plateBar}
                  onChange={e => setPlateBar(parseFloat(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs text-void-600 mb-1.5">Unit</label>
                <select className="input-void" value={plateUnit} onChange={e => setPlateUnit(e.target.value as 'kg' | 'lbs')}>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
            <div className="card p-4 card-purple mb-3">
              <div className="text-xs text-void-600 mb-2">Per side ({plates.plateWeight}{plateUnit})</div>
              <div className="flex gap-2 flex-wrap">
                {plates.plates.map(({ weight, count }) => (
                  Array.from({ length: count }, (_, i) => (
                    <div key={`${weight}-${i}`}
                      className="px-3 py-2 rounded-8 text-sm font-mono font-bold bg-neon-purple/10 border border-neon-purple/30 text-neon-purple"
                      style={{ borderRadius: '8px' }}>
                      {weight}
                    </div>
                  ))
                ))}
                {plates.plates.length === 0 && (
                  <span className="text-void-600 text-sm">Bar only</span>
                )}
              </div>
              {plates.remainder > 0 && (
                <div className="text-xs text-neon-orange mt-2">+{plates.remainder}{plateUnit} remainder</div>
              )}
            </div>
          </div>

          {/* TDEE info */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target size={15} className="text-neon-green" />
              <span className="text-sm font-semibold text-white">Your Energy Stats</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Basal Metabolic Rate (BMR)', val: Math.round(bmr), desc: 'Calories at complete rest' },
                { label: 'TDEE', val: Math.round(tdee), desc: 'Total daily energy expenditure' },
                { label: 'Calorie Target', val: user.macroGoals.calories, desc: `Adjusted for ${user.goal.replace('_', ' ')}` },
                { label: 'Deficit / Surplus', val: user.macroGoals.calories - Math.round(tdee), desc: 'vs TDEE' },
              ].map(({ label, val, desc }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-void-300 last:border-0">
                  <div>
                    <div className="text-sm text-white">{label}</div>
                    <div className="text-xs text-void-600">{desc}</div>
                  </div>
                  <div className={`mono text-base font-bold ${
                    label.includes('Deficit') && val < 0 ? 'text-neon-red' :
                    label.includes('Deficit') && val > 0 ? 'text-neon-green' :
                    'text-neon-cyan'
                  }`}>
                    {val > 0 && label.includes('Deficit') ? '+' : ''}{val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUPPLEMENTS TAB ── */}
      {tab === 'supplements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-void-600">{supplements.length} supplements tracked</span>
            <button onClick={() => setSuppModal(true)} className="btn btn-primary btn-sm">
              <Plus size={14} /> Add
            </button>
          </div>

          {supplementCategories.map(category => {
            const catSupps = supplements.filter(s => s.category === category)
            if (!catSupps.length) return null
            const color = categoryColors[category]
            return (
              <div key={category} className="card overflow-hidden">
                <div className="p-3 border-b border-void-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-xs font-semibold capitalize">{category.replace('-', ' ')}</span>
                </div>
                <div className="divide-y divide-void-300">
                  {catSupps.map(s => {
                    const taken = isSupplementTaken(s.id, today)
                    return (
                      <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                        <button
                          onClick={() => toggleSupplementLog(s.id, today)}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                            taken ? 'border-neon-green bg-neon-green/15 text-neon-green' : 'border-void-400'
                          }`}
                        >
                          {taken && <span className="text-[10px]">✓</span>}
                        </button>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white" style={{ textDecoration: taken ? 'line-through' : 'none', opacity: taken ? 0.6 : 1 }}>
                            {s.name}
                          </div>
                          <div className="text-xs text-void-600">{s.dosage} · {s.timing}</div>
                        </div>
                        <button onClick={() => removeSupplement(s.id)} className="btn btn-icon" style={{ color: '#ff3b5c' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {supplements.length === 0 && (
            <div className="card p-8 text-center">
              <div className="text-void-600 text-sm mb-3">No supplements tracked yet</div>
              <button onClick={() => setSuppModal(true)} className="btn btn-primary">
                <Plus size={14} /> Add First Supplement
              </button>
            </div>
          )}
        </div>
      )}

      {/* Supplement Modal */}
      <Modal open={suppModal} onClose={() => setSuppModal(false)} title="Add Supplement" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-void-600 mb-1.5">Name</label>
            <input className="input-void" placeholder="e.g. Creatine Monohydrate" value={suppForm.name}
              onChange={e => setSuppForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-void-600 mb-1.5">Dosage</label>
            <input className="input-void" placeholder="e.g. 5g" value={suppForm.dosage}
              onChange={e => setSuppForm(f => ({ ...f, dosage: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-void-600 mb-1.5">Timing</label>
            <input className="input-void" placeholder="e.g. With breakfast, post-workout" value={suppForm.timing}
              onChange={e => setSuppForm(f => ({ ...f, timing: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-void-600 mb-1.5">Category</label>
            <select className="input-void" value={suppForm.category}
              onChange={e => setSuppForm(f => ({ ...f, category: e.target.value as typeof suppForm.category }))}>
              {supplementCategories.map(c => (
                <option key={c} value={c} className="capitalize">{c.replace('-', ' ')}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => { addSupplement(suppForm); setSuppModal(false); setSuppForm({ name: '', dosage: '', timing: '', category: 'morning', color: '#00d4ff' }) }}
            disabled={!suppForm.name.trim()}
            className="btn btn-primary w-full"
          >
            <Plus size={14} /> Save Supplement
          </button>
        </div>
      </Modal>
    </motion.div>
  )
}
