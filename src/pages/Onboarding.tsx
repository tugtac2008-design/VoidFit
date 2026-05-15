import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { UserProfile, ActivityLevel, FitnessGoal, ExperienceLevel } from '../types'
import { useStore } from '../store/useStore'
import { calcTDEE, calcCalorieTarget, calcMacros } from '../utils/calculations'

const STEPS = ['Welcome', 'About You', 'Training', 'Goals', 'Done']

export default function Onboarding() {
  const { completeOnboarding } = useStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    gender: 'male',
    height: 178,
    weight: 82,
    activityLevel: 'active',
    goal: 'build_muscle',
    experience: 'intermediate',
    trainingDays: 5,
  })

  const update = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleFinish = () => {
    const profile = form as UserProfile
    const tdee = calcTDEE(profile)
    const calories = calcCalorieTarget(tdee, profile.goal)
    const macroGoals = calcMacros(calories, profile.weight, profile.goal)
    completeOnboarding({ ...profile, tdee, macroGoals })
  }

  const goalLabels: Record<FitnessGoal, { label: string; desc: string; color: string }> = {
    lose_fat: { label: 'Lose Fat', desc: 'Caloric deficit, preserve muscle', color: '#ff3b5c' },
    maintain: { label: 'Maintain', desc: 'Stay at current weight', color: '#b0b0b0' },
    build_muscle: { label: 'Build Muscle', desc: 'Lean bulk, moderate surplus', color: '#00d4ff' },
    aggressive_bulk: { label: 'Aggressive Bulk', desc: 'Max mass, larger surplus', color: '#a855f7' },
    recomp: { label: 'Body Recomp', desc: 'Cut fat & build muscle simultaneously', color: '#00ff87' },
  }

  const activityLabels: Record<ActivityLevel, string> = {
    sedentary: 'Sedentary (desk job, no exercise)',
    light: 'Light (1-3x/week)',
    moderate: 'Moderate (3-5x/week)',
    active: 'Active (6-7x/week)',
    very_active: 'Very Active (2x/day, athlete)',
  }

  const expLabels: Record<ExperienceLevel, { label: string; desc: string }> = {
    beginner: { label: 'Beginner', desc: '< 1 year' },
    intermediate: { label: 'Intermediate', desc: '1-3 years' },
    advanced: { label: 'Advanced', desc: '3-6 years' },
    elite: { label: 'Elite', desc: '6+ years' },
  }

  const tdeePreview = form.weight && form.height && form.age && form.gender && form.activityLevel
    ? calcTDEE(form as UserProfile) : null
  const calTarget = tdeePreview && form.goal ? calcCalorieTarget(tdeePreview, form.goal) : null

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 grid-bg">
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(0,212,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.04) 0%, transparent 50%)',
        }} />

      <div className="relative w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${
              i <= step ? 'bg-neon-cyan' : 'bg-void-300'
            }`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-void-300 border border-void-400 flex items-center justify-center"
                >
                  <Zap size={36} className="text-neon-cyan" style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.7))' }} />
                </motion.div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">VOIDFIT</h1>
                <p className="text-void-600 mb-1">Elite Fitness Tracking System</p>
                <p className="text-sm text-void-600 mb-8">For serious athletes who want to maximize every gain.</p>
                <div className="space-y-2 text-left mb-8">
                  {['Precision macro & micro nutrition tracking', 'Advanced workout logging with progressive overload', 'Body composition analytics & trends', 'Personal records & strength benchmarks', 'Custom workouts & meal plans'].map(f => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-neon-cyan" />
                      </div>
                      <span className="text-sm text-void-600">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: About You */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">About You</h2>
                <p className="text-void-600 text-sm mb-6">This is used to calculate your TDEE and macros.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Name</label>
                    <input className="input-void" placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Age</label>
                      <input className="input-void" type="number" min="14" max="80" value={form.age} onChange={e => update('age', parseInt(e.target.value))} />
                    </div>
                    <div>
                      <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Gender</label>
                      <select className="input-void" value={form.gender} onChange={e => update('gender', e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Height (cm)</label>
                      <input className="input-void" type="number" min="140" max="230" value={form.height} onChange={e => update('height', parseInt(e.target.value))} />
                    </div>
                    <div>
                      <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Weight (kg)</label>
                      <input className="input-void" type="number" min="40" max="200" value={form.weight} onChange={e => update('weight', parseFloat(e.target.value))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Activity Level</label>
                    <select className="input-void" value={form.activityLevel} onChange={e => update('activityLevel', e.target.value)}>
                      {Object.entries(activityLabels).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Training */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Training Background</h2>
                <p className="text-void-600 text-sm mb-6">Tailor the app to your level.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-void-600 mb-2 uppercase tracking-widest">Experience Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.entries(expLabels) as [ExperienceLevel, { label: string; desc: string }][]).map(([k, v]) => (
                        <button
                          key={k}
                          onClick={() => update('experience', k)}
                          className={`p-3 rounded-10 border text-left transition-all ${
                            form.experience === k
                              ? 'border-neon-cyan bg-neon-cyan/5 text-white'
                              : 'border-void-300 text-void-600 hover:border-void-400'
                          }`}
                          style={{ borderRadius: '10px' }}
                        >
                          <div className="text-sm font-semibold">{v.label}</div>
                          <div className="text-xs opacity-70">{v.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">
                      Training Days Per Week: <span className="text-neon-cyan mono">{form.trainingDays}</span>
                    </label>
                    <input
                      type="range" min="1" max="7" value={form.trainingDays}
                      onChange={e => update('trainingDays', parseInt(e.target.value))}
                      className="slider-void"
                    />
                    <div className="flex justify-between text-[10px] text-void-600 mt-1">
                      <span>1</span><span>3</span><span>5</span><span>7</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Your Goal</h2>
                <p className="text-void-600 text-sm mb-6">This determines your calorie target and macro split.</p>
                <div className="space-y-2 mb-5">
                  {(Object.entries(goalLabels) as [FitnessGoal, (typeof goalLabels)[FitnessGoal]][]).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => update('goal', k)}
                      className={`w-full p-3.5 rounded-10 border text-left transition-all flex items-center gap-3 ${
                        form.goal === k
                          ? 'border-neon-cyan bg-neon-cyan/5'
                          : 'border-void-300 hover:border-void-400'
                      }`}
                      style={{ borderRadius: '10px' }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: v.color, boxShadow: `0 0 6px ${v.color}80` }} />
                      <div>
                        <div className="text-sm font-semibold text-white">{v.label}</div>
                        <div className="text-xs text-void-600">{v.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {tdeePreview && calTarget && (
                  <div className="card p-4 card-cyan">
                    <div className="text-xs text-void-600 uppercase tracking-widest mb-2">Your Targets (estimated)</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="mono text-xl font-bold text-neon-cyan">{calTarget}</div>
                        <div className="text-xs text-void-600">kcal / day</div>
                      </div>
                      <div>
                        <div className="mono text-xl font-bold text-neon-purple">{tdeePreview}</div>
                        <div className="text-xs text-void-600">TDEE</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Done */}
            {step === 4 && (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 mx-auto mb-5 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center"
                >
                  <Check size={28} className="text-neon-green" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,135,0.6))' }} />
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-2">You're All Set</h2>
                <p className="text-void-600 text-sm mb-6">Welcome to VoidFit, {form.name || 'Athlete'}.<br />Your elite fitness journey starts now.</p>
                {tdeePreview && calTarget && (
                  <div className="card p-4 mb-6 text-left">
                    <div className="text-xs text-void-600 uppercase tracking-widest mb-3">Your Daily Targets</div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: 'Calories', value: calTarget, color: '#00d4ff', unit: 'kcal' },
                        { label: 'TDEE', value: tdeePreview, color: '#a855f7', unit: 'kcal' },
                        { label: 'Protein', value: Math.round((form.weight ?? 80) * 2.2), color: '#00ff87', unit: 'g' },
                      ].map(({ label, value, color, unit }) => (
                        <div key={label}>
                          <div className="mono text-lg font-bold" style={{ color }}>{value}</div>
                          <div className="text-[10px] text-void-600">{unit} {label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost flex-1">
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="btn btn-primary flex-1"
              disabled={step === 1 && !form.name?.trim()}
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleFinish} className="btn btn-success flex-1 btn-lg">
              <Zap size={16} /> Start Training
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
