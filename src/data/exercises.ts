import { Exercise } from '../types'

export const EXERCISE_DATABASE: Exercise[] = [
  // ─── Chest ─────────────────────────────────────────────────────────────────
  { id: 'e001', name: 'Barbell Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: 'Barbell', type: 'compound', description: 'Flat barbell press — king of chest exercises.' },
  { id: 'e002', name: 'Incline Barbell Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: 'Barbell', type: 'compound' },
  { id: 'e003', name: 'Decline Barbell Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Triceps'], equipment: 'Barbell', type: 'compound' },
  { id: 'e004', name: 'Dumbbell Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e005', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e006', name: 'Dumbbell Fly', muscleGroup: 'Chest', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e007', name: 'Incline Dumbbell Fly', muscleGroup: 'Chest', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e008', name: 'Cable Fly (low to high)', muscleGroup: 'Chest', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e009', name: 'Cable Fly (high to low)', muscleGroup: 'Chest', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e010', name: 'Chest Dips', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: 'Bodyweight', type: 'compound' },
  { id: 'e011', name: 'Push-Ups', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders', 'Core'], equipment: 'Bodyweight', type: 'compound' },
  { id: 'e012', name: 'Pec Deck (Machine Fly)', muscleGroup: 'Chest', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e013', name: 'Smith Machine Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: 'Smith Machine', type: 'compound' },
  { id: 'e014', name: 'Landmine Press', muscleGroup: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], equipment: 'Barbell', type: 'compound' },

  // ─── Back ──────────────────────────────────────────────────────────────────
  { id: 'e020', name: 'Conventional Deadlift', muscleGroup: 'Back', secondaryMuscles: ['Legs', 'Glutes', 'Core'], equipment: 'Barbell', type: 'compound', description: 'Full-body king movement.' },
  { id: 'e021', name: 'Sumo Deadlift', muscleGroup: 'Back', secondaryMuscles: ['Legs', 'Glutes'], equipment: 'Barbell', type: 'compound' },
  { id: 'e022', name: 'Barbell Row (Bent Over)', muscleGroup: 'Back', secondaryMuscles: ['Biceps', 'Rear Delts'], equipment: 'Barbell', type: 'compound' },
  { id: 'e023', name: 'Pendlay Row', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], equipment: 'Barbell', type: 'compound' },
  { id: 'e024', name: 'Pull-Ups', muscleGroup: 'Back', secondaryMuscles: ['Biceps', 'Core'], equipment: 'Bodyweight', type: 'compound', description: 'Wide grip for lat width.' },
  { id: 'e025', name: 'Chin-Ups', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], equipment: 'Bodyweight', type: 'compound' },
  { id: 'e026', name: 'Lat Pulldown (wide grip)', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], equipment: 'Cable', type: 'compound' },
  { id: 'e027', name: 'Lat Pulldown (close grip)', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], equipment: 'Cable', type: 'compound' },
  { id: 'e028', name: 'Seated Cable Row', muscleGroup: 'Back', secondaryMuscles: ['Biceps', 'Rear Delts'], equipment: 'Cable', type: 'compound' },
  { id: 'e029', name: 'Single Arm Dumbbell Row', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e030', name: 'T-Bar Row', muscleGroup: 'Back', secondaryMuscles: ['Biceps', 'Rear Delts'], equipment: 'Barbell', type: 'compound' },
  { id: 'e031', name: 'Straight Arm Pulldown', muscleGroup: 'Back', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e032', name: 'Face Pull', muscleGroup: 'Back', secondaryMuscles: ['Shoulders'], equipment: 'Cable', type: 'isolation', description: 'Great for rear delts and external rotation.' },
  { id: 'e033', name: 'Hyperextension (Back Extension)', muscleGroup: 'Back', secondaryMuscles: ['Glutes'], equipment: 'Machine', type: 'isolation' },
  { id: 'e034', name: 'Rack Pull', muscleGroup: 'Back', secondaryMuscles: ['Legs', 'Glutes'], equipment: 'Barbell', type: 'compound' },
  { id: 'e035', name: 'Dumbbell Pullover', muscleGroup: 'Back', secondaryMuscles: ['Chest'], equipment: 'Dumbbell', type: 'isolation' },

  // ─── Shoulders ─────────────────────────────────────────────────────────────
  { id: 'e040', name: 'Overhead Press (Barbell)', muscleGroup: 'Shoulders', secondaryMuscles: ['Triceps', 'Core'], equipment: 'Barbell', type: 'compound', description: 'Seated or standing OHP.' },
  { id: 'e041', name: 'Seated Dumbbell Press', muscleGroup: 'Shoulders', secondaryMuscles: ['Triceps'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e042', name: 'Arnold Press', muscleGroup: 'Shoulders', secondaryMuscles: ['Triceps'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e043', name: 'Lateral Raise (Dumbbell)', muscleGroup: 'Shoulders', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e044', name: 'Lateral Raise (Cable)', muscleGroup: 'Shoulders', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e045', name: 'Front Raise', muscleGroup: 'Shoulders', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e046', name: 'Rear Delt Fly (Dumbbell)', muscleGroup: 'Shoulders', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e047', name: 'Rear Delt Fly (Cable)', muscleGroup: 'Shoulders', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e048', name: 'Upright Row', muscleGroup: 'Shoulders', secondaryMuscles: ['Biceps', 'Triceps'], equipment: 'Barbell', type: 'compound' },
  { id: 'e049', name: 'Shrugs (Barbell)', muscleGroup: 'Shoulders', secondaryMuscles: [], equipment: 'Barbell', type: 'isolation' },
  { id: 'e050', name: 'Shrugs (Dumbbell)', muscleGroup: 'Shoulders', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e051', name: 'Machine Shoulder Press', muscleGroup: 'Shoulders', secondaryMuscles: ['Triceps'], equipment: 'Machine', type: 'compound' },

  // ─── Biceps ────────────────────────────────────────────────────────────────
  { id: 'e060', name: 'Barbell Curl', muscleGroup: 'Biceps', secondaryMuscles: ['Forearms'], equipment: 'Barbell', type: 'isolation' },
  { id: 'e061', name: 'EZ Bar Curl', muscleGroup: 'Biceps', secondaryMuscles: ['Forearms'], equipment: 'EZ Bar', type: 'isolation' },
  { id: 'e062', name: 'Dumbbell Curl (alternating)', muscleGroup: 'Biceps', secondaryMuscles: ['Forearms'], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e063', name: 'Hammer Curl', muscleGroup: 'Biceps', secondaryMuscles: ['Forearms'], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e064', name: 'Concentration Curl', muscleGroup: 'Biceps', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e065', name: 'Preacher Curl (Machine)', muscleGroup: 'Biceps', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e066', name: 'Preacher Curl (EZ Bar)', muscleGroup: 'Biceps', secondaryMuscles: [], equipment: 'EZ Bar', type: 'isolation' },
  { id: 'e067', name: 'Cable Curl', muscleGroup: 'Biceps', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e068', name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e069', name: 'Reverse Curl', muscleGroup: 'Biceps', secondaryMuscles: ['Forearms'], equipment: 'Barbell', type: 'isolation' },
  { id: 'e070', name: 'Spider Curl', muscleGroup: 'Biceps', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },

  // ─── Triceps ───────────────────────────────────────────────────────────────
  { id: 'e080', name: 'Skull Crushers (EZ Bar)', muscleGroup: 'Triceps', secondaryMuscles: [], equipment: 'EZ Bar', type: 'isolation' },
  { id: 'e081', name: 'Skull Crushers (Dumbbell)', muscleGroup: 'Triceps', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e082', name: 'Tricep Pushdown (Cable)', muscleGroup: 'Triceps', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e083', name: 'Overhead Tricep Extension (Dumbbell)', muscleGroup: 'Triceps', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e084', name: 'Overhead Tricep Extension (Cable)', muscleGroup: 'Triceps', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e085', name: 'Tricep Dips (bench)', muscleGroup: 'Triceps', secondaryMuscles: ['Chest', 'Shoulders'], equipment: 'Bodyweight', type: 'compound' },
  { id: 'e086', name: 'Close Grip Bench Press', muscleGroup: 'Triceps', secondaryMuscles: ['Chest', 'Shoulders'], equipment: 'Barbell', type: 'compound' },
  { id: 'e087', name: 'Kickback (Dumbbell)', muscleGroup: 'Triceps', secondaryMuscles: [], equipment: 'Dumbbell', type: 'isolation' },
  { id: 'e088', name: 'Rope Pushdown', muscleGroup: 'Triceps', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e089', name: 'Diamond Push-Ups', muscleGroup: 'Triceps', secondaryMuscles: ['Chest'], equipment: 'Bodyweight', type: 'compound' },
  { id: 'e090', name: 'JM Press', muscleGroup: 'Triceps', secondaryMuscles: [], equipment: 'Barbell', type: 'isolation' },

  // ─── Legs ──────────────────────────────────────────────────────────────────
  { id: 'e100', name: 'Back Squat (Barbell)', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Core', 'Back'], equipment: 'Barbell', type: 'compound', description: 'The king of leg exercises.' },
  { id: 'e101', name: 'Front Squat', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Core'], equipment: 'Barbell', type: 'compound' },
  { id: 'e102', name: 'Goblet Squat', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Core'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e103', name: 'Leg Press', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], equipment: 'Machine', type: 'compound' },
  { id: 'e104', name: 'Hack Squat', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], equipment: 'Machine', type: 'compound' },
  { id: 'e105', name: 'Romanian Deadlift', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Back'], equipment: 'Barbell', type: 'compound' },
  { id: 'e106', name: 'Romanian Deadlift (Dumbbell)', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e107', name: 'Leg Curl (Lying)', muscleGroup: 'Legs', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e108', name: 'Leg Curl (Seated)', muscleGroup: 'Legs', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e109', name: 'Leg Extension', muscleGroup: 'Legs', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e110', name: 'Bulgarian Split Squat', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e111', name: 'Walking Lunges', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e112', name: 'Step-Ups', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e113', name: 'Sissy Squat', muscleGroup: 'Legs', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e114', name: 'Smith Machine Squat', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], equipment: 'Smith Machine', type: 'compound' },

  // ─── Glutes ────────────────────────────────────────────────────────────────
  { id: 'e120', name: 'Hip Thrust (Barbell)', muscleGroup: 'Glutes', secondaryMuscles: ['Legs'], equipment: 'Barbell', type: 'compound' },
  { id: 'e121', name: 'Hip Thrust (Machine)', muscleGroup: 'Glutes', secondaryMuscles: ['Legs'], equipment: 'Machine', type: 'compound' },
  { id: 'e122', name: 'Glute Bridge', muscleGroup: 'Glutes', secondaryMuscles: ['Legs'], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e123', name: 'Cable Kickback', muscleGroup: 'Glutes', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e124', name: 'Abduction Machine', muscleGroup: 'Glutes', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e125', name: 'Sumo Squat', muscleGroup: 'Glutes', secondaryMuscles: ['Legs'], equipment: 'Dumbbell', type: 'compound' },

  // ─── Calves ────────────────────────────────────────────────────────────────
  { id: 'e130', name: 'Standing Calf Raise', muscleGroup: 'Calves', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e131', name: 'Seated Calf Raise', muscleGroup: 'Calves', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e132', name: 'Donkey Calf Raise', muscleGroup: 'Calves', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e133', name: 'Single Leg Calf Raise', muscleGroup: 'Calves', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e134', name: 'Leg Press Calf Raise', muscleGroup: 'Calves', secondaryMuscles: [], equipment: 'Machine', type: 'isolation' },
  { id: 'e135', name: 'Tibialis Raise', muscleGroup: 'Calves', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },

  // ─── Core ──────────────────────────────────────────────────────────────────
  { id: 'e140', name: 'Plank', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e141', name: 'Side Plank', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e142', name: 'Crunches', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e143', name: 'Bicycle Crunches', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e144', name: 'Leg Raises (hanging)', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e145', name: 'Ab Wheel Rollout', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Other', type: 'isolation' },
  { id: 'e146', name: 'Cable Crunch', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e147', name: 'Russian Twist', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e148', name: 'Dragon Flag', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e149', name: 'V-Ups', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },
  { id: 'e150', name: 'Pallof Press', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Cable', type: 'isolation' },
  { id: 'e151', name: 'Woodchop', muscleGroup: 'Core', secondaryMuscles: ['Shoulders'], equipment: 'Cable', type: 'compound' },
  { id: 'e152', name: 'Dead Bug', muscleGroup: 'Core', secondaryMuscles: [], equipment: 'Bodyweight', type: 'isolation' },

  // ─── Forearms ──────────────────────────────────────────────────────────────
  { id: 'e160', name: 'Wrist Curl (Barbell)', muscleGroup: 'Forearms', secondaryMuscles: [], equipment: 'Barbell', type: 'isolation' },
  { id: 'e161', name: 'Reverse Wrist Curl', muscleGroup: 'Forearms', secondaryMuscles: [], equipment: 'Barbell', type: 'isolation' },
  { id: 'e162', name: 'Farmer\'s Walk', muscleGroup: 'Forearms', secondaryMuscles: ['Core', 'Legs'], equipment: 'Dumbbell', type: 'compound' },
  { id: 'e163', name: 'Plate Pinch', muscleGroup: 'Forearms', secondaryMuscles: [], equipment: 'Other', type: 'isolation' },
  { id: 'e164', name: 'Grip Squeezer', muscleGroup: 'Forearms', secondaryMuscles: [], equipment: 'Other', type: 'isolation' },

  // ─── Cardio ────────────────────────────────────────────────────────────────
  { id: 'e170', name: 'Treadmill Run', muscleGroup: 'Cardio', secondaryMuscles: ['Legs', 'Core'], equipment: 'Machine', type: 'cardio' },
  { id: 'e171', name: 'Cycling (stationary)', muscleGroup: 'Cardio', secondaryMuscles: ['Legs'], equipment: 'Machine', type: 'cardio' },
  { id: 'e172', name: 'Rowing Machine', muscleGroup: 'Cardio', secondaryMuscles: ['Back', 'Legs', 'Core'], equipment: 'Machine', type: 'cardio' },
  { id: 'e173', name: 'Elliptical', muscleGroup: 'Cardio', secondaryMuscles: ['Legs'], equipment: 'Machine', type: 'cardio' },
  { id: 'e174', name: 'Jump Rope', muscleGroup: 'Cardio', secondaryMuscles: ['Calves', 'Core'], equipment: 'Other', type: 'cardio' },
  { id: 'e175', name: 'Stair Climber', muscleGroup: 'Cardio', secondaryMuscles: ['Legs', 'Glutes'], equipment: 'Machine', type: 'cardio' },
  { id: 'e176', name: 'Battle Ropes', muscleGroup: 'Cardio', secondaryMuscles: ['Shoulders', 'Core'], equipment: 'Other', type: 'cardio' },
  { id: 'e177', name: 'Sled Push', muscleGroup: 'Cardio', secondaryMuscles: ['Legs', 'Core'], equipment: 'Other', type: 'cardio' },
  { id: 'e178', name: 'Box Jumps', muscleGroup: 'Cardio', secondaryMuscles: ['Legs', 'Glutes'], equipment: 'Bodyweight', type: 'cardio' },

  // ─── Full Body ─────────────────────────────────────────────────────────────
  { id: 'e190', name: 'Barbell Clean', muscleGroup: 'Full Body', secondaryMuscles: ['Legs', 'Back', 'Shoulders'], equipment: 'Barbell', type: 'compound' },
  { id: 'e191', name: 'Power Clean', muscleGroup: 'Full Body', secondaryMuscles: ['Legs', 'Back', 'Shoulders'], equipment: 'Barbell', type: 'compound' },
  { id: 'e192', name: 'Turkish Get-Up', muscleGroup: 'Full Body', secondaryMuscles: ['Shoulders', 'Core'], equipment: 'Kettlebell', type: 'compound' },
  { id: 'e193', name: 'Kettlebell Swing', muscleGroup: 'Full Body', secondaryMuscles: ['Glutes', 'Back', 'Core'], equipment: 'Kettlebell', type: 'compound' },
  { id: 'e194', name: 'Burpees', muscleGroup: 'Full Body', secondaryMuscles: ['Chest', 'Legs', 'Core'], equipment: 'Bodyweight', type: 'compound' },
  { id: 'e195', name: 'Thruster', muscleGroup: 'Full Body', secondaryMuscles: ['Shoulders', 'Legs'], equipment: 'Barbell', type: 'compound' },
]

export const getExerciseById = (id: string): Exercise | undefined =>
  EXERCISE_DATABASE.find(e => e.id === id)

export const searchExercises = (query: string): Exercise[] => {
  if (!query.trim()) return EXERCISE_DATABASE
  const q = query.toLowerCase()
  return EXERCISE_DATABASE.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.muscleGroup.toLowerCase().includes(q) ||
    e.equipment.toLowerCase().includes(q)
  )
}

export const getExercisesByMuscle = (muscle: string): Exercise[] =>
  EXERCISE_DATABASE.filter(e => e.muscleGroup === muscle || e.secondaryMuscles.includes(muscle as never))

export const MUSCLE_GROUPS = [...new Set(EXERCISE_DATABASE.map(e => e.muscleGroup))].sort()
