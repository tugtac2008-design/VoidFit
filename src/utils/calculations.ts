import { UserProfile, FitnessGoal, MacroGoals, WorkoutSet, MuscleGroup } from '../types'

// ─── Body / TDEE ─────────────────────────────────────────────────────────────

export function calcBMR(profile: Pick<UserProfile, 'weight' | 'height' | 'age' | 'gender'>): number {
  const { weight, height, age, gender } = profile
  if (gender === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
  }
  return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age
}

export function calcTDEE(profile: UserProfile): number {
  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
  return Math.round(calcBMR(profile) * multipliers[profile.activityLevel])
}

export function calcCalorieTarget(tdee: number, goal: FitnessGoal): number {
  const adjustments: Record<FitnessGoal, number> = {
    lose_fat: -500,
    maintain: 0,
    build_muscle: 250,
    aggressive_bulk: 500,
    recomp: 0,
  }
  return tdee + adjustments[goal]
}

export function calcMacros(calories: number, weight: number, goal: FitnessGoal): MacroGoals {
  const proteinRatios: Record<FitnessGoal, number> = {
    lose_fat: 2.4,       // g/kg — high protein on cut
    maintain: 2.0,
    build_muscle: 2.2,
    aggressive_bulk: 2.0,
    recomp: 2.6,
  }

  const protein = Math.round(weight * proteinRatios[goal])
  const proteinCals = protein * 4

  const fatPercent: Record<FitnessGoal, number> = {
    lose_fat: 0.25, maintain: 0.27, build_muscle: 0.25, aggressive_bulk: 0.30, recomp: 0.30,
  }
  const fat = Math.round((calories * fatPercent[goal]) / 9)
  const fatCals = fat * 9

  const carbs = Math.round((calories - proteinCals - fatCals) / 4)

  return {
    calories,
    protein,
    carbs: Math.max(carbs, 0),
    fat,
    fiber: Math.round(calories / 1000 * 14), // 14g/1000kcal
    water: Math.round(weight * 35),           // 35ml/kg
  }
}

export function calcBMI(weight: number, height: number): number {
  return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1))
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export function calcBodyFatNavy(gender: 'male' | 'female', waist: number, neck: number, height: number, hips?: number): number {
  if (gender === 'male') {
    return parseFloat((86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76).toFixed(1))
  }
  return parseFloat((163.205 * Math.log10(waist + (hips ?? waist) - neck) - 97.684 * Math.log10(height) - 78.387).toFixed(1))
}

export function leanMass(weight: number, bodyFat: number): number {
  return parseFloat((weight * (1 - bodyFat / 100)).toFixed(1))
}

// ─── Lifting calculations ─────────────────────────────────────────────────────

export function calc1RM(weight: number, reps: number): number {
  if (reps === 1) return weight
  // Epley formula
  return parseFloat((weight * (1 + reps / 30)).toFixed(1))
}

export function calcWeightForReps(oneRM: number, reps: number): number {
  return parseFloat((oneRM / (1 + reps / 30)).toFixed(1))
}

export function calcVolume(sets: WorkoutSet[]): number {
  return sets
    .filter(s => s.completed && !s.isWarmup)
    .reduce((sum, s) => sum + s.weight * s.reps, 0)
}

export function muscleGroupVolume(exercises: { sets: WorkoutSet[]; exercise: { muscleGroup: MuscleGroup } }[]): Record<string, number> {
  return exercises.reduce((acc, ex) => {
    const vol = calcVolume(ex.sets)
    acc[ex.exercise.muscleGroup] = (acc[ex.exercise.muscleGroup] ?? 0) + vol
    return acc
  }, {} as Record<string, number>)
}

// ─── Plate calculator ─────────────────────────────────────────────────────────

export interface PlateResult {
  plateWeight: number
  plates: Array<{ weight: number; count: number }>
  remainder: number
}

const STANDARD_PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25]
const STANDARD_PLATES_LBS = [45, 35, 25, 10, 5, 2.5]

export function calcPlates(totalWeight: number, barWeight: number, unit: 'kg' | 'lbs'): PlateResult {
  const available = unit === 'kg' ? STANDARD_PLATES_KG : STANDARD_PLATES_LBS
  const perSide = (totalWeight - barWeight) / 2
  const plates: Array<{ weight: number; count: number }> = []
  let remaining = perSide

  for (const plate of available) {
    if (remaining >= plate) {
      const count = Math.floor(remaining / plate)
      plates.push({ weight: plate, count })
      remaining -= count * plate
    }
  }

  return {
    plateWeight: perSide,
    plates,
    remainder: parseFloat(remaining.toFixed(2)),
  }
}

// ─── Nutrition helpers ────────────────────────────────────────────────────────

export function scaleNutrition<T extends Record<string, number>>(base: T, servings: number): T {
  return Object.fromEntries(
    Object.entries(base).map(([k, v]) => [k, typeof v === 'number' ? parseFloat((v * servings).toFixed(1)) : v])
  ) as T
}

export function caloriesFromMacros(protein: number, carbs: number, fat: number): number {
  return Math.round(protein * 4 + carbs * 4 + fat * 9)
}

export function macroPercentages(protein: number, carbs: number, fat: number) {
  const total = caloriesFromMacros(protein, carbs, fat)
  if (!total) return { protein: 0, carbs: 0, fat: 0 }
  return {
    protein: Math.round((protein * 4 / total) * 100),
    carbs: Math.round((carbs * 4 / total) * 100),
    fat: Math.round((fat * 9 / total) * 100),
  }
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

export function calcStreak(dates: string[]): number {
  if (!dates.length) return 0
  const sorted = [...new Set(dates)].sort((a, b) => b.localeCompare(a))
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (prev.getTime() - curr.getTime()) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

// ─── Weight trend ─────────────────────────────────────────────────────────────

export function calcWeightTrend(weights: Array<{ date: string; weight: number }>, days: number = 7): number {
  if (weights.length < 2) return 0
  const sorted = weights.sort((a, b) => a.date.localeCompare(b.date))
  const recent = sorted.slice(-days)
  if (recent.length < 2) return 0
  const first = recent[0].weight
  const last = recent[recent.length - 1].weight
  return parseFloat((last - first).toFixed(2))
}

export function movingAverage(values: number[], window: number): number[] {
  return values.map((_, i) => {
    const start = Math.max(0, i - window + 1)
    const slice = values.slice(start, i + 1)
    return parseFloat((slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(2))
  })
}
