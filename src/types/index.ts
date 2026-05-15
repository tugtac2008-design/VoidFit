// ─── Nutrition ───────────────────────────────────────────────────────────────

export interface MacroGoals {
  calories: number
  protein: number   // g
  carbs: number     // g
  fat: number       // g
  fiber: number     // g
  water: number     // ml
}

export interface FoodItem {
  id: string
  name: string
  brand?: string
  category: FoodCategory
  servingSize: number
  servingUnit: string
  calories: number
  protein: number     // g per serving
  carbs: number       // g per serving
  fat: number         // g per serving
  fiber?: number      // g
  sugar?: number      // g
  sodium?: number     // mg
  cholesterol?: number // mg
  saturatedFat?: number // g
  potassium?: number  // mg
  calcium?: number    // mg
  iron?: number       // mg
  isCustom?: boolean
}

export type FoodCategory =
  | 'Protein' | 'Grains & Carbs' | 'Vegetables' | 'Fruits'
  | 'Dairy' | 'Fats & Oils' | 'Supplements' | 'Beverages'
  | 'Snacks' | 'Fast Food' | 'Condiments' | 'Other'

export type MealType =
  | 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout' | 'post-workout'

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
  'pre-workout': 'Pre-Workout',
  'post-workout': 'Post-Workout',
}

export interface MealEntry {
  id: string
  foodId: string
  food: FoodItem
  servings: number
  mealType: MealType
  date: string // YYYY-MM-DD
  time: string // HH:MM
}

export interface NutritionTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
}

// ─── Workout ─────────────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps'
  | 'Legs' | 'Glutes' | 'Calves' | 'Core' | 'Forearms'
  | 'Full Body' | 'Cardio'

export type EquipmentType =
  | 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight'
  | 'Kettlebell' | 'Resistance Band' | 'Smith Machine' | 'EZ Bar' | 'Other'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  secondaryMuscles: MuscleGroup[]
  equipment: EquipmentType
  type: 'compound' | 'isolation' | 'cardio'
  description?: string
}

export interface WorkoutSet {
  id: string
  weight: number      // kg or lbs
  reps: number
  rpe?: number        // 1-10
  isWarmup: boolean
  completed: boolean
  restSeconds?: number
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  exercise: Exercise
  sets: WorkoutSet[]
  notes?: string
  supersetWith?: string // exercise id
}

export interface Workout {
  id: string
  name: string
  date: string        // YYYY-MM-DD
  startTime: string   // ISO string
  endTime?: string    // ISO string
  duration?: number   // minutes
  exercises: WorkoutExercise[]
  notes?: string
  rating?: 1 | 2 | 3 | 4 | 5
  bodyWeight?: number
  totalVolume: number // kg
  totalSets: number
}

export interface WorkoutTemplate {
  id: string
  name: string
  description?: string
  muscleGroups: MuscleGroup[]
  exercises: TemplateExercise[]
  estimatedDuration?: number // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface TemplateExercise {
  exerciseId: string
  targetSets: number
  targetRepsMin: number
  targetRepsMax: number
  targetRpe?: number
  notes?: string
}

export interface PersonalRecord {
  exerciseId: string
  exerciseName: string
  weight: number
  reps: number
  date: string        // YYYY-MM-DD
  estimatedOneRM: number
}

// ─── Body ─────────────────────────────────────────────────────────────────────

export interface BodyMeasurement {
  id: string
  date: string        // YYYY-MM-DD
  weight?: number     // kg
  bodyFat?: number    // %
  chest?: number      // cm
  waist?: number      // cm
  hips?: number       // cm
  neck?: number       // cm
  leftArm?: number    // cm
  rightArm?: number   // cm
  leftThigh?: number  // cm
  rightThigh?: number // cm
  leftCalf?: number   // cm
  rightCalf?: number  // cm
  shoulders?: number  // cm
  notes?: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type FitnessGoal = 'lose_fat' | 'maintain' | 'build_muscle' | 'aggressive_bulk' | 'recomp'
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite'

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export interface UserProfile {
  name: string
  age: number
  gender: 'male' | 'female'
  height: number      // cm
  weight: number      // kg
  activityLevel: ActivityLevel
  goal: FitnessGoal
  experience: ExperienceLevel
  tdee: number
  macroGoals: MacroGoals
  trainingDays: number // per week
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface AppSettings {
  weightUnit: 'kg' | 'lbs'
  lengthUnit: 'cm' | 'in'
  weekStartsMonday: boolean
  restTimerDefault: number  // seconds
  showMicronutrients: boolean
  autoRestTimer: boolean
}

// ─── Water ────────────────────────────────────────────────────────────────────

export interface WaterLog {
  date: string        // YYYY-MM-DD
  amount: number      // ml
}

// ─── Supplement ───────────────────────────────────────────────────────────────

export interface Supplement {
  id: string
  name: string
  dosage: string
  timing: string
  category: 'pre-workout' | 'intra-workout' | 'post-workout' | 'morning' | 'evening' | 'with-meals'
  color: string
}

export interface SupplementLog {
  supplementId: string
  date: string
  taken: boolean
}
