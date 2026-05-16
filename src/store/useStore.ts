import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  UserProfile, MealEntry, FoodItem, WaterLog, Workout, WorkoutTemplate,
  WorkoutExercise, WorkoutSet, Exercise, BodyMeasurement, PersonalRecord,
  AppSettings, MealType, Supplement, SupplementLog
} from '../types'
import { genId, TODAY } from '../utils/format'
import { calc1RM, calcVolume, calcTDEE, calcCalorieTarget, calcMacros } from '../utils/calculations'
import { EXERCISE_DATABASE } from '../data/exercises'
import { DEFAULT_TEMPLATES } from '../data/templates'

const DEFAULT_PROFILE: UserProfile = {
  name: 'Athlete',
  age: 25,
  gender: 'male',
  height: 180,
  weight: 85,
  activityLevel: 'active',
  goal: 'build_muscle',
  experience: 'intermediate',
  tdee: 3000,
  trainingDays: 5,
  macroGoals: {
    calories: 3250,
    protein: 187,
    carbs: 390,
    fat: 90,
    fiber: 35,
    water: 2975,
  },
}

const DEFAULT_SETTINGS: AppSettings = {
  weightUnit: 'kg',
  lengthUnit: 'cm',
  weekStartsMonday: true,
  restTimerDefault: 90,
  showMicronutrients: false,
  autoRestTimer: true,
}

interface StoreState {
  // ─── User ──────────────────────────────────────────────────────────────────
  user: UserProfile
  isOnboarded: boolean
  setUser: (user: Partial<UserProfile>) => void
  completeOnboarding: (profile: UserProfile) => void
  recalcMacros: () => void

  // ─── Nutrition ─────────────────────────────────────────────────────────────
  mealEntries: MealEntry[]
  customFoods: FoodItem[]
  getMealEntriesForDate: (date: string) => MealEntry[]
  addMealEntry: (food: FoodItem, servings: number, mealType: MealType, date: string) => void
  updateMealEntry: (id: string, updates: Partial<MealEntry>) => void
  removeMealEntry: (id: string) => void
  addCustomFood: (food: Omit<FoodItem, 'id' | 'isCustom'>) => void
  removeCustomFood: (id: string) => void

  // ─── Water ─────────────────────────────────────────────────────────────────
  waterLogs: WaterLog[]
  getWaterForDate: (date: string) => number
  setWaterForDate: (date: string, amount: number) => void
  addWater: (date: string, ml: number) => void

  // ─── Supplements ───────────────────────────────────────────────────────────
  supplements: Supplement[]
  supplementLogs: SupplementLog[]
  addSupplement: (s: Omit<Supplement, 'id'>) => void
  removeSupplement: (id: string) => void
  toggleSupplementLog: (supplementId: string, date: string) => void
  isSupplementTaken: (supplementId: string, date: string) => boolean

  // ─── Workout ───────────────────────────────────────────────────────────────
  workouts: Workout[]
  activeWorkout: Workout | null
  templates: WorkoutTemplate[]
  startWorkout: (name: string, bodyWeight?: number) => void
  startFromTemplate: (tpl: WorkoutTemplate) => void
  addExerciseToActive: (exercise: Exercise) => void
  removeExerciseFromActive: (exerciseId: string) => void
  addSetToExercise: (workoutExerciseId: string) => void
  updateSet: (workoutExerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void
  removeSet: (workoutExerciseId: string, setId: string) => void
  toggleSetComplete: (workoutExerciseId: string, setId: string) => void
  updateExerciseNotes: (workoutExerciseId: string, notes: string) => void
  finishWorkout: () => void
  discardWorkout: () => void
  deleteWorkout: (id: string) => void
  addTemplate: (tpl: Omit<WorkoutTemplate, 'id'>) => void
  deleteTemplate: (id: string) => void

  // ─── Body ──────────────────────────────────────────────────────────────────
  measurements: BodyMeasurement[]
  addMeasurement: (m: Omit<BodyMeasurement, 'id'>) => void
  updateMeasurement: (id: string, updates: Partial<BodyMeasurement>) => void
  deleteMeasurement: (id: string) => void
  getLatestMeasurement: () => BodyMeasurement | null
  getWeightHistory: () => Array<{ date: string; weight: number }>

  // ─── PRs ───────────────────────────────────────────────────────────────────
  personalRecords: PersonalRecord[]
  checkAndUpdatePR: (workout: Workout) => void

  // ─── Settings ──────────────────────────────────────────────────────────────
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void

  // ─── Seed ──────────────────────────────────────────────────────────────────
  seedDemoData: () => void

  // ─── Cloud Sync ────────────────────────────────────────────────────────────
  hydrateStore: (data: Record<string, unknown>) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ─── User ──────────────────────────────────────────────────────────────
      user: DEFAULT_PROFILE,
      isOnboarded: false,

      setUser: (updates) => set(s => ({ user: { ...s.user, ...updates } })),

      completeOnboarding: (profile) => {
        const tdee = calcTDEE(profile)
        const calories = calcCalorieTarget(tdee, profile.goal)
        const macroGoals = calcMacros(calories, profile.weight, profile.goal)
        set({ user: { ...profile, tdee, macroGoals }, isOnboarded: true })
      },

      recalcMacros: () => {
        const { user } = get()
        const tdee = calcTDEE(user)
        const calories = calcCalorieTarget(tdee, user.goal)
        const macroGoals = calcMacros(calories, user.weight, user.goal)
        set(s => ({ user: { ...s.user, tdee, macroGoals } }))
      },

      // ─── Nutrition ─────────────────────────────────────────────────────────
      mealEntries: [],
      customFoods: [],

      getMealEntriesForDate: (date) =>
        get().mealEntries.filter(e => e.date === date),

      addMealEntry: (food, servings, mealType, date) => {
        const entry: MealEntry = {
          id: genId(),
          foodId: food.id,
          food,
          servings,
          mealType,
          date,
          time: new Date().toTimeString().slice(0, 5),
        }
        set(s => ({ mealEntries: [...s.mealEntries, entry] }))
      },

      updateMealEntry: (id, updates) =>
        set(s => ({
          mealEntries: s.mealEntries.map(e => e.id === id ? { ...e, ...updates } : e),
        })),

      removeMealEntry: (id) =>
        set(s => ({ mealEntries: s.mealEntries.filter(e => e.id !== id) })),

      addCustomFood: (food) => {
        const newFood: FoodItem = { ...food, id: `custom_${genId()}`, isCustom: true }
        set(s => ({ customFoods: [...s.customFoods, newFood] }))
      },

      removeCustomFood: (id) =>
        set(s => ({ customFoods: s.customFoods.filter(f => f.id !== id) })),

      // ─── Water ─────────────────────────────────────────────────────────────
      waterLogs: [],

      getWaterForDate: (date) => {
        const log = get().waterLogs.find(w => w.date === date)
        return log?.amount ?? 0
      },

      setWaterForDate: (date, amount) =>
        set(s => {
          const existing = s.waterLogs.find(w => w.date === date)
          if (existing) {
            return { waterLogs: s.waterLogs.map(w => w.date === date ? { ...w, amount } : w) }
          }
          return { waterLogs: [...s.waterLogs, { date, amount }] }
        }),

      addWater: (date, ml) => {
        const current = get().getWaterForDate(date)
        get().setWaterForDate(date, current + ml)
      },

      // ─── Supplements ───────────────────────────────────────────────────────
      supplements: [],
      supplementLogs: [],

      addSupplement: (s) =>
        set(state => ({
          supplements: [...state.supplements, { ...s, id: genId() }],
        })),

      removeSupplement: (id) =>
        set(s => ({
          supplements: s.supplements.filter(x => x.id !== id),
          supplementLogs: s.supplementLogs.filter(x => x.supplementId !== id),
        })),

      toggleSupplementLog: (supplementId, date) =>
        set(s => {
          const existing = s.supplementLogs.find(
            x => x.supplementId === supplementId && x.date === date
          )
          if (existing) {
            return {
              supplementLogs: s.supplementLogs.map(x =>
                x.supplementId === supplementId && x.date === date
                  ? { ...x, taken: !x.taken }
                  : x
              ),
            }
          }
          return {
            supplementLogs: [...s.supplementLogs, { supplementId, date, taken: true }],
          }
        }),

      isSupplementTaken: (supplementId, date) => {
        const log = get().supplementLogs.find(
          x => x.supplementId === supplementId && x.date === date
        )
        return log?.taken ?? false
      },

      // ─── Workout ───────────────────────────────────────────────────────────
      workouts: [],
      activeWorkout: null,
      templates: DEFAULT_TEMPLATES,

      startWorkout: (name, bodyWeight) => {
        const workout: Workout = {
          id: genId(),
          name,
          date: TODAY(),
          startTime: new Date().toISOString(),
          exercises: [],
          totalVolume: 0,
          totalSets: 0,
          bodyWeight,
        }
        set({ activeWorkout: workout })
      },

      startFromTemplate: (tpl) => {
        const workout: Workout = {
          id: genId(),
          name: tpl.name,
          date: TODAY(),
          startTime: new Date().toISOString(),
          totalVolume: 0,
          totalSets: 0,
          exercises: tpl.exercises.map(te => {
            const exercise = EXERCISE_DATABASE.find(e => e.id === te.exerciseId)
            if (!exercise) return null
            const sets: WorkoutSet[] = Array.from({ length: te.targetSets }, () => ({
              id: genId(),
              weight: 0,
              reps: te.targetRepsMin,
              rpe: te.targetRpe,
              isWarmup: false,
              completed: false,
            }))
            return {
              id: genId(),
              exerciseId: te.exerciseId,
              exercise,
              sets,
              notes: te.notes,
            } as WorkoutExercise
          }).filter(Boolean) as WorkoutExercise[],
        }
        set({ activeWorkout: workout })
      },

      addExerciseToActive: (exercise) =>
        set(s => {
          if (!s.activeWorkout) return {}
          const newExercise: WorkoutExercise = {
            id: genId(),
            exerciseId: exercise.id,
            exercise,
            sets: [{
              id: genId(),
              weight: 0,
              reps: 10,
              isWarmup: false,
              completed: false,
            }],
          }
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: [...s.activeWorkout.exercises, newExercise],
            },
          }
        }),

      removeExerciseFromActive: (exerciseId) =>
        set(s => {
          if (!s.activeWorkout) return {}
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.filter(e => e.id !== exerciseId),
            },
          }
        }),

      addSetToExercise: (workoutExerciseId) =>
        set(s => {
          if (!s.activeWorkout) return {}
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.map(ex => {
                if (ex.id !== workoutExerciseId) return ex
                const lastSet = ex.sets[ex.sets.length - 1]
                const newSet: WorkoutSet = {
                  id: genId(),
                  weight: lastSet?.weight ?? 0,
                  reps: lastSet?.reps ?? 10,
                  rpe: lastSet?.rpe,
                  isWarmup: false,
                  completed: false,
                }
                return { ...ex, sets: [...ex.sets, newSet] }
              }),
            },
          }
        }),

      updateSet: (workoutExerciseId, setId, updates) =>
        set(s => {
          if (!s.activeWorkout) return {}
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.map(ex => {
                if (ex.id !== workoutExerciseId) return ex
                return {
                  ...ex,
                  sets: ex.sets.map(st => st.id === setId ? { ...st, ...updates } : st),
                }
              }),
            },
          }
        }),

      removeSet: (workoutExerciseId, setId) =>
        set(s => {
          if (!s.activeWorkout) return {}
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.map(ex => {
                if (ex.id !== workoutExerciseId) return ex
                return { ...ex, sets: ex.sets.filter(st => st.id !== setId) }
              }),
            },
          }
        }),

      toggleSetComplete: (workoutExerciseId, setId) =>
        set(s => {
          if (!s.activeWorkout) return {}
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.map(ex => {
                if (ex.id !== workoutExerciseId) return ex
                return {
                  ...ex,
                  sets: ex.sets.map(st =>
                    st.id === setId ? { ...st, completed: !st.completed } : st
                  ),
                }
              }),
            },
          }
        }),

      updateExerciseNotes: (workoutExerciseId, notes) =>
        set(s => {
          if (!s.activeWorkout) return {}
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.map(ex =>
                ex.id === workoutExerciseId ? { ...ex, notes } : ex
              ),
            },
          }
        }),

      finishWorkout: () => {
        const { activeWorkout } = get()
        if (!activeWorkout) return
        const endTime = new Date().toISOString()
        const start = new Date(activeWorkout.startTime)
        const end = new Date(endTime)
        const duration = Math.round((end.getTime() - start.getTime()) / 60000)
        const totalVolume = activeWorkout.exercises.reduce(
          (sum, ex) => sum + calcVolume(ex.sets), 0
        )
        const totalSets = activeWorkout.exercises.reduce(
          (sum, ex) => sum + ex.sets.filter(s => s.completed && !s.isWarmup).length, 0
        )
        const finished: Workout = {
          ...activeWorkout,
          endTime,
          duration,
          totalVolume,
          totalSets,
        }
        get().checkAndUpdatePR(finished)
        set(s => ({
          workouts: [finished, ...s.workouts],
          activeWorkout: null,
        }))
      },

      discardWorkout: () => set({ activeWorkout: null }),

      deleteWorkout: (id) =>
        set(s => ({ workouts: s.workouts.filter(w => w.id !== id) })),

      addTemplate: (tpl) =>
        set(s => ({ templates: [...s.templates, { ...tpl, id: genId() }] })),

      deleteTemplate: (id) =>
        set(s => ({ templates: s.templates.filter(t => t.id !== id) })),

      // ─── Body ──────────────────────────────────────────────────────────────
      measurements: [],

      addMeasurement: (m) =>
        set(s => ({
          measurements: [{ ...m, id: genId() }, ...s.measurements]
            .sort((a, b) => b.date.localeCompare(a.date)),
        })),

      updateMeasurement: (id, updates) =>
        set(s => ({
          measurements: s.measurements.map(m => m.id === id ? { ...m, ...updates } : m),
        })),

      deleteMeasurement: (id) =>
        set(s => ({ measurements: s.measurements.filter(m => m.id !== id) })),

      getLatestMeasurement: () => {
        const { measurements } = get()
        return measurements.length > 0 ? measurements[0] : null
      },

      getWeightHistory: () =>
        get().measurements
          .filter(m => m.weight !== undefined)
          .map(m => ({ date: m.date, weight: m.weight! }))
          .sort((a, b) => a.date.localeCompare(b.date)),

      // ─── PRs ───────────────────────────────────────────────────────────────
      personalRecords: [],

      checkAndUpdatePR: (workout) => {
        const prs = [...get().personalRecords]
        for (const ex of workout.exercises) {
          for (const set of ex.sets) {
            if (!set.completed || set.isWarmup || !set.weight || !set.reps) continue
            const e1rm = calc1RM(set.weight, set.reps)
            const existing = prs.find(p => p.exerciseId === ex.exerciseId)
            if (!existing || e1rm > existing.estimatedOneRM) {
              const idx = prs.findIndex(p => p.exerciseId === ex.exerciseId)
              const newPR: PersonalRecord = {
                exerciseId: ex.exerciseId,
                exerciseName: ex.exercise.name,
                weight: set.weight,
                reps: set.reps,
                date: workout.date,
                estimatedOneRM: e1rm,
              }
              if (idx >= 0) prs[idx] = newPR
              else prs.push(newPR)
            }
          }
        }
        set({ personalRecords: prs })
      },

      // ─── Settings ──────────────────────────────────────────────────────────
      settings: DEFAULT_SETTINGS,
      updateSettings: (updates) =>
        set(s => ({ settings: { ...s.settings, ...updates } })),

      // ─── Seed ──────────────────────────────────────────────────────────────
      hydrateStore: (data) => {
        set(s => ({
          user: (data.user as typeof s.user) ?? s.user,
          isOnboarded: (data.isOnboarded as boolean) ?? s.isOnboarded,
          settings: (data.settings as typeof s.settings) ?? s.settings,
          customFoods: (data.customFoods as typeof s.customFoods) ?? s.customFoods,
          supplements: (data.supplements as typeof s.supplements) ?? s.supplements,
          personalRecords: (data.personalRecords as typeof s.personalRecords) ?? s.personalRecords,
          templates: (data.templates as typeof s.templates) ?? s.templates,
          mealEntries: (data.mealEntries as typeof s.mealEntries) ?? s.mealEntries,
          waterLogs: (data.waterLogs as typeof s.waterLogs) ?? s.waterLogs,
          supplementLogs: (data.supplementLogs as typeof s.supplementLogs) ?? s.supplementLogs,
          workouts: (data.workouts as typeof s.workouts) ?? s.workouts,
          measurements: (data.measurements as typeof s.measurements) ?? s.measurements,
        }))
      },

      seedDemoData: () => {
        const today = TODAY()
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]

        // Seed measurements
        const demoMeasurements: BodyMeasurement[] = [
          { id: 'm1', date: today, weight: 85.2, bodyFat: 14.5, chest: 105, waist: 83, hips: 99, leftArm: 39, rightArm: 39.5, leftThigh: 62, rightThigh: 62 },
          { id: 'm2', date: yesterday, weight: 85.0, bodyFat: 14.6, chest: 105, waist: 83 },
          { id: 'm3', date: twoDaysAgo, weight: 85.4, bodyFat: 14.8 },
          { id: 'm4', date: '2026-05-01', weight: 84.5 },
          { id: 'm5', date: '2026-04-25', weight: 84.1 },
          { id: 'm6', date: '2026-04-18', weight: 83.8 },
          { id: 'm7', date: '2026-04-10', weight: 83.3 },
        ]

        set(s => ({
          measurements: [...demoMeasurements, ...s.measurements.filter(m =>
            !demoMeasurements.some(d => d.id === m.id)
          )],
          isOnboarded: true,
          waterLogs: [
            { date: today, amount: 1800 },
            { date: yesterday, amount: 2600 },
          ],
        }))
      },
    }),
    {
      name: 'voidfit-store',
      version: 1,
    }
  )
)
