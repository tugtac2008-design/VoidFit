import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, X, ChevronLeft, ChevronRight, Droplets, Flame, Edit2, Trash2, ChevronDown } from 'lucide-react'
import { useStore } from '../store/useStore'
import Modal from '../components/Modal'
import { FoodItem, MealType, MEAL_LABELS } from '../types'
import { FOOD_DATABASE, searchFoods } from '../data/foods'
import { fmt, TODAY, pct, formatMacro, mealColor, genId } from '../utils/format'
import { caloriesFromMacros } from '../utils/calculations'
import MacroRing from '../components/MacroRing'

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout']

function offsetDate(base: string, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export default function Nutrition() {
  const { user, getMealEntriesForDate, addMealEntry, removeMealEntry, updateMealEntry,
    customFoods, addCustomFood, getWaterForDate, addWater, setWaterForDate, settings } = useStore()

  const [date, setDate] = useState(TODAY())
  const [addModal, setAddModal] = useState<MealType | null>(null)
  const [customFoodModal, setCustomFoodModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [servings, setServings] = useState(1)
  const [expandedMeals, setExpandedMeals] = useState<Set<MealType>>(new Set(MEAL_ORDER))
  const [editEntry, setEditEntry] = useState<string | null>(null)
  const [editServings, setEditServings] = useState(1)
  const [showMicros, setShowMicros] = useState(false)

  // Custom food form
  const [cf, setCf] = useState({ name: '', brand: '', servingSize: 100, servingUnit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 })

  const entries = getMealEntriesForDate(date)
  const water = getWaterForDate(date)
  const goals = user.macroGoals
  const isToday = date === TODAY()

  const totals = useMemo(() => entries.reduce((acc, e) => {
    const s = e.servings
    return {
      calories: acc.calories + e.food.calories * s,
      protein: acc.protein + e.food.protein * s,
      carbs: acc.carbs + e.food.carbs * s,
      fat: acc.fat + e.food.fat * s,
      fiber: acc.fiber + (e.food.fiber ?? 0) * s,
      sodium: acc.sodium + (e.food.sodium ?? 0) * s,
      sugar: acc.sugar + (e.food.sugar ?? 0) * s,
    }
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0 }), [entries])

  const searchResults = useMemo(() => {
    const db = [...FOOD_DATABASE, ...customFoods]
    if (!searchQuery.trim()) return db.slice(0, 20)
    return searchFoods(searchQuery).concat(
      customFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 30)
  }, [searchQuery, customFoods])

  const openAddModal = (meal: MealType) => {
    setAddModal(meal)
    setSelectedFood(null)
    setServings(1)
    setSearchQuery('')
  }

  const handleAddFood = () => {
    if (!selectedFood || !addModal) return
    addMealEntry(selectedFood, servings, addModal, date)
    setAddModal(null)
    setSelectedFood(null)
    setServings(1)
    setSearchQuery('')
  }

  const handleSaveEdit = (id: string) => {
    updateMealEntry(id, { servings: editServings })
    setEditEntry(null)
  }

  const toggleMeal = (meal: MealType) => {
    setExpandedMeals(prev => {
      const next = new Set(prev)
      if (next.has(meal)) next.delete(meal)
      else next.add(meal)
      return next
    })
  }

  const scaledNutrition = (food: FoodItem, s: number) => ({
    calories: food.calories * s,
    protein: food.protein * s,
    carbs: food.carbs * s,
    fat: food.fat * s,
  })

  const handleSaveCustomFood = () => {
    if (!cf.name.trim()) return
    addCustomFood({ ...cf, category: 'Other' })
    setCustomFoodModal(false)
    setCf({ name: '', brand: '', servingSize: 100, servingUnit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 })
  }

  const macroCalc = caloriesFromMacros(cf.protein, cf.carbs, cf.fat)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="py-2 space-y-5"
    >
      {/* Header + Date Nav */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Nutrition</h1>
          <p className="text-void-600 text-xs">{isToday ? 'Today' : fmt.date(date)}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setDate(d => offsetDate(d, -1))} className="btn btn-ghost btn-sm px-2">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setDate(TODAY())} className={`btn btn-sm ${isToday ? 'btn-primary' : 'btn-ghost'}`}>
            Today
          </button>
          <button onClick={() => setDate(d => offsetDate(d, 1))} className="btn btn-ghost btn-sm px-2"
            disabled={date >= TODAY()}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="card p-4">
        <div className="flex items-center gap-4 mb-4">
          <MacroRing
            value={totals.calories}
            max={goals.calories}
            size={96}
            strokeWidth={8}
            color="#00d4ff"
            label={`${Math.round(totals.calories)}`}
            sublabel="kcal"
          />
          <div className="flex-1 grid grid-cols-3 gap-3">
            {[
              { label: 'Protein', val: totals.protein, goal: goals.protein, color: '#00ff87', unit: 'g' },
              { label: 'Carbs', val: totals.carbs, goal: goals.carbs, color: '#00d4ff', unit: 'g' },
              { label: 'Fat', val: totals.fat, goal: goals.fat, color: '#a855f7', unit: 'g' },
            ].map(({ label, val, goal, color, unit }) => (
              <div key={label} className="text-center">
                <div className="mono text-base font-bold" style={{ color }}>
                  {Math.round(val)}{unit}
                </div>
                <div className="text-[10px] text-void-600 mb-1.5">{label} / {goal}{unit}</div>
                <div className="progress-track h-1">
                  <motion.div
                    className="progress-fill"
                    style={{ background: color, width: `${Math.min(pct(val, goal), 100)}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct(val, goal), 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-right">
            <div className={`mono text-xl font-bold ${goals.calories - totals.calories < 0 ? 'text-neon-red' : 'text-neon-green'}`}>
              {Math.round(goals.calories - totals.calories)}
            </div>
            <div className="text-[10px] text-void-600">{goals.calories - totals.calories < 0 ? 'over' : 'remaining'}</div>
          </div>
        </div>

        {/* Micros toggle */}
        <button onClick={() => setShowMicros(v => !v)}
          className="flex items-center gap-1.5 text-xs text-void-600 hover:text-void-400 transition-colors">
          <ChevronDown size={12} className={`transition-transform ${showMicros ? 'rotate-180' : ''}`} />
          {showMicros ? 'Hide' : 'Show'} micronutrients
        </button>
        <AnimatePresence>
          {showMicros && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-void-300">
                {[
                  { label: 'Fiber', val: totals.fiber, goal: goals.fiber, unit: 'g', color: '#00ff87' },
                  { label: 'Sodium', val: totals.sodium, goal: 2300, unit: 'mg', color: '#ff8c42' },
                  { label: 'Sugar', val: totals.sugar, goal: 50, unit: 'g', color: '#ffd700' },
                ].map(({ label, val, goal, unit, color }) => (
                  <div key={label} className="card p-3 text-center">
                    <div className="mono text-sm font-bold" style={{ color }}>{Math.round(val)}{unit}</div>
                    <div className="text-[10px] text-void-600">{label}</div>
                    <div className="progress-track h-1 mt-1.5">
                      <div className="progress-fill" style={{ background: color, width: `${Math.min(pct(val, goal), 100)}%`, height: '100%', borderRadius: '6px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Water tracker */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets size={15} className="text-neon-purple" />
            <span className="text-sm font-semibold text-white">Water Intake</span>
            <span className="mono text-sm text-neon-purple">{(water / 1000).toFixed(2)}L</span>
            <span className="text-void-600 text-xs">/ {(goals.water / 1000).toFixed(1)}L</span>
          </div>
          <span className="badge badge-purple">{pct(water, goals.water)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 progress-track h-2.5">
            <motion.div
              className="progress-fill progress-fill-purple"
              animate={{ width: `${Math.min(pct(water, goals.water), 100)}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {[150, 250, 330, 500].map(ml => (
            <button key={ml} onClick={() => addWater(date, ml)} className="btn btn-secondary btn-sm flex-1">
              +{ml}ml
            </button>
          ))}
          <button onClick={() => setWaterForDate(date, 0)} className="btn btn-ghost btn-sm px-2">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Meal Sections */}
      {MEAL_ORDER.map(mealType => {
        const mealEntries = entries.filter(e => e.mealType === mealType)
        const mealCals = mealEntries.reduce((s, e) => s + e.food.calories * e.servings, 0)
        const mealProtein = mealEntries.reduce((s, e) => s + e.food.protein * e.servings, 0)
        const color = mealColor(mealType)
        const expanded = expandedMeals.has(mealType)

        return (
          <div key={mealType} className="card overflow-hidden">
            {/* Meal header */}
            <button
              onClick={() => toggleMeal(mealType)}
              className="w-full flex items-center justify-between p-4 hover:bg-void-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
                <span className="font-semibold text-white text-sm">{MEAL_LABELS[mealType]}</span>
                {mealEntries.length > 0 && (
                  <span className="badge badge-gray">{mealEntries.length} items</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {mealCals > 0 && (
                  <div className="text-right">
                    <span className="mono text-sm font-bold" style={{ color }}>{Math.round(mealCals)}</span>
                    <span className="text-void-600 text-xs"> kcal</span>
                    {mealProtein > 0 && (
                      <span className="text-void-600 text-xs ml-2">· {Math.round(mealProtein)}g P</span>
                    )}
                  </div>
                )}
                <ChevronDown size={14} className={`text-void-600 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-void-300">
                    {mealEntries.length === 0 && (
                      <div className="px-4 py-3 text-xs text-void-600">Nothing logged yet</div>
                    )}
                    {mealEntries.map(entry => {
                      const scaled = scaledNutrition(entry.food, entry.servings)
                      const isEditing = editEntry === entry.id
                      return (
                        <div key={entry.id} className="px-4 py-3 border-b border-void-300 last:border-0 hover:bg-void-300 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white font-medium truncate">{entry.food.name}</span>
                                {entry.food.isCustom && <span className="badge badge-purple text-[9px]">Custom</span>}
                              </div>
                              <div className="text-xs text-void-600 mt-0.5">
                                {entry.servings} × {entry.food.servingSize}{entry.food.servingUnit}
                              </div>
                              <div className="flex gap-3 mt-1.5 text-xs">
                                <span className="mono text-neon-cyan">{Math.round(scaled.calories)} kcal</span>
                                <span className="mono text-neon-green">{formatMacro(scaled.protein)}g P</span>
                                <span className="mono text-neon-cyan/70">{formatMacro(scaled.carbs)}g C</span>
                                <span className="mono text-neon-purple/70">{formatMacro(scaled.fat)}g F</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number" step="0.25" min="0.25" value={editServings}
                                    onChange={e => setEditServings(parseFloat(e.target.value))}
                                    className="input-void w-16 text-center"
                                    style={{ padding: '4px 6px', fontSize: '12px' }}
                                  />
                                  <button onClick={() => handleSaveEdit(entry.id)} className="btn btn-success btn-xs">✓</button>
                                  <button onClick={() => setEditEntry(null)} className="btn btn-ghost btn-xs">✕</button>
                                </div>
                              ) : (
                                <>
                                  <button onClick={() => { setEditEntry(entry.id); setEditServings(entry.servings) }} className="btn btn-icon">
                                    <Edit2 size={12} />
                                  </button>
                                  <button onClick={() => removeMealEntry(entry.id)} className="btn btn-icon" style={{ color: '#ff3b5c' }}>
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="p-3 flex gap-2">
                      <button onClick={() => openAddModal(mealType)} className="btn btn-primary btn-sm flex-1">
                        <Plus size={13} /> Add Food
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Custom food button */}
      <button onClick={() => setCustomFoodModal(true)} className="btn btn-ghost w-full">
        <Plus size={14} /> Create Custom Food
      </button>

      {/* Add Food Modal */}
      <Modal open={!!addModal} onClose={() => setAddModal(null)}
        title={addModal ? `Add to ${MEAL_LABELS[addModal]}` : ''} size="lg">
        {addModal && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-600" />
              <input
                className="input-void pl-9"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {selectedFood ? (
              <div className="space-y-4">
                <div className="card p-4 card-cyan">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-white">{selectedFood.name}</div>
                      {selectedFood.brand && <div className="text-xs text-void-600">{selectedFood.brand}</div>}
                      <div className="text-xs text-void-600 mt-0.5">Per {selectedFood.servingSize}{selectedFood.servingUnit}</div>
                    </div>
                    <button onClick={() => setSelectedFood(null)} className="btn btn-icon">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      { label: 'Calories', val: selectedFood.calories, color: '#00d4ff' },
                      { label: 'Protein', val: `${selectedFood.protein}g`, color: '#00ff87' },
                      { label: 'Carbs', val: `${selectedFood.carbs}g`, color: '#00d4ff' },
                      { label: 'Fat', val: `${selectedFood.fat}g`, color: '#a855f7' },
                    ].map(({ label, val, color }) => (
                      <div key={label}>
                        <div className="mono text-base font-bold" style={{ color }}>{val}</div>
                        <div className="text-[10px] text-void-600">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Servings</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setServings(s => Math.max(0.25, s - 0.25))} className="btn btn-ghost px-3">−</button>
                    <input
                      type="number" step="0.25" min="0.25" value={servings}
                      onChange={e => setServings(parseFloat(e.target.value) || 1)}
                      className="input-void text-center flex-1"
                    />
                    <button onClick={() => setServings(s => s + 0.25)} className="btn btn-ghost px-3">+</button>
                  </div>
                  <div className="text-xs text-void-600 mt-1.5 text-center">
                    = {(selectedFood.servingSize * servings).toFixed(0)}{selectedFood.servingUnit} ·{' '}
                    <span className="text-neon-cyan mono">{Math.round(selectedFood.calories * servings)} kcal</span>
                    {' · '}<span className="text-neon-green mono">{(selectedFood.protein * servings).toFixed(1)}g protein</span>
                  </div>
                </div>

                <button onClick={handleAddFood} className="btn btn-primary btn-lg w-full">
                  <Plus size={16} /> Add to {MEAL_LABELS[addModal]}
                </button>
              </div>
            ) : (
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {searchResults.map(food => (
                  <button
                    key={food.id}
                    onClick={() => { setSelectedFood(food); setServings(1) }}
                    className="w-full text-left p-3 rounded-10 hover:bg-void-300 transition-colors border border-transparent hover:border-void-400"
                    style={{ borderRadius: '10px' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium truncate">{food.name}</div>
                        <div className="text-xs text-void-600">{food.servingSize}{food.servingUnit} · {food.category}</div>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="mono text-sm font-bold text-neon-cyan">{food.calories}</div>
                        <div className="text-[10px] text-void-600">kcal</div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs">
                      <span className="text-neon-green mono">{food.protein}g P</span>
                      <span className="text-void-600 mono">{food.carbs}g C</span>
                      <span className="text-neon-purple mono">{food.fat}g F</span>
                    </div>
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <div className="text-center py-6 text-void-600 text-sm">
                    No foods found. Try a different search or create a custom food.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Custom Food Modal */}
      <Modal open={customFoodModal} onClose={() => setCustomFoodModal(false)} title="Create Custom Food" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Food Name *</label>
              <input className="input-void" placeholder="e.g. My Protein Shake" value={cf.name} onChange={e => setCf(c => ({ ...c, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Brand (optional)</label>
              <input className="input-void" placeholder="Brand name" value={cf.brand} onChange={e => setCf(c => ({ ...c, brand: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Size</label>
                <input type="number" className="input-void" value={cf.servingSize} onChange={e => setCf(c => ({ ...c, servingSize: parseInt(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-xs text-void-600 mb-1.5 uppercase tracking-widest">Unit</label>
                <input className="input-void" placeholder="g" value={cf.servingUnit} onChange={e => setCf(c => ({ ...c, servingUnit: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="divider" />
          <div className="text-xs text-void-600 uppercase tracking-widest mb-2">Macros per serving</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'calories', label: 'Calories', unit: 'kcal', color: '#00d4ff' },
              { key: 'protein', label: 'Protein', unit: 'g', color: '#00ff87' },
              { key: 'carbs', label: 'Carbohydrates', unit: 'g', color: '#00d4ff' },
              { key: 'fat', label: 'Fat', unit: 'g', color: '#a855f7' },
              { key: 'fiber', label: 'Fiber', unit: 'g', color: '#00ff87' },
              { key: 'sodium', label: 'Sodium', unit: 'mg', color: '#ff8c42' },
            ].map(({ key, label, unit, color }) => (
              <div key={key}>
                <label className="block text-xs mb-1" style={{ color }}>{label} ({unit})</label>
                <input
                  type="number" min="0" step="0.1" className="input-void"
                  value={(cf as unknown as Record<string, number>)[key]}
                  onChange={e => setCf(c => ({ ...c, [key]: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            ))}
          </div>
          {macroCalc > 0 && cf.calories > 0 && Math.abs(macroCalc - cf.calories) > 50 && (
            <div className="text-xs text-neon-orange p-2 rounded-8 bg-neon-orange/10 border border-neon-orange/20" style={{ borderRadius: '8px' }}>
              ⚠ Macro calories ({macroCalc} kcal) differ from entered calories ({cf.calories} kcal)
            </div>
          )}
          <button onClick={handleSaveCustomFood} disabled={!cf.name.trim()} className="btn btn-primary w-full">
            <Plus size={14} /> Save Custom Food
          </button>
        </div>
      </Modal>
    </motion.div>
  )
}
