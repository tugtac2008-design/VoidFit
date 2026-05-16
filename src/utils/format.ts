import { format, formatDistanceToNow, parseISO, isToday, isYesterday } from 'date-fns'

export const fmt = {
  date: (d: string | Date) => format(typeof d === 'string' ? parseISO(d) : d, 'MMM d, yyyy'),
  dateShort: (d: string | Date) => format(typeof d === 'string' ? parseISO(d) : d, 'MMM d'),
  dateNum: (d: string | Date) => format(typeof d === 'string' ? parseISO(d) : d, 'yyyy-MM-dd'),
  time: (d: string | Date) => format(typeof d === 'string' ? new Date(d) : d, 'h:mm a'),
  day: (d: string | Date) => format(typeof d === 'string' ? parseISO(d) : d, 'EEEE'),
  monthYear: (d: string | Date) => format(typeof d === 'string' ? parseISO(d) : d, 'MMMM yyyy'),
  relativeDate: (d: string): string => {
    const date = parseISO(d)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return formatDistanceToNow(date, { addSuffix: true })
  },
}

export function formatWeight(value: number, unit: 'kg' | 'lbs'): string {
  if (unit === 'lbs') return `${(value * 2.20462).toFixed(1)} lbs`
  return `${value} kg`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function formatSeconds(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatCalories(n: number): string {
  return n.toLocaleString()
}

export function formatMacro(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(1)
}

export function formatVolume(kg: number, unit: 'kg' | 'lbs' = 'kg'): string {
  const val = unit === 'lbs' ? kg * 2.20462 : kg
  if (val >= 1000) return `${(val / 1000).toFixed(1)}k ${unit}`
  return `${Math.round(val)} ${unit}`
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

export function pct(val: number, total: number): number {
  if (!total) return 0
  return clamp(Math.round((val / total) * 100), 0, 100)
}

export function genId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}

export const TODAY = (): string => new Date().toISOString().split('T')[0]

export function greetingTime(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export function muscleColor(muscle: string): string {
  const map: Record<string, string> = {
    Chest: '#ff3b5c',
    Back: '#ff9028',
    Shoulders: '#a855f7',
    Biceps: '#00ff87',
    Triceps: '#ffd700',
    Legs: '#ff8c42',
    Glutes: '#f472b6',
    Core: '#f472b6',
    Calves: '#818cf8',
    Forearms: '#34d399',
    'Full Body': '#ffffff',
    Cardio: '#fb923c',
  }
  return map[muscle] ?? '#b0b0b0'
}

export function mealColor(mealType: string): string {
  const map: Record<string, string> = {
    breakfast: '#ffd700',
    lunch: '#ff9028',
    dinner: '#a855f7',
    snack: '#ff8c42',
    'pre-workout': '#00ff87',
    'post-workout': '#ff3b5c',
  }
  return map[mealType] ?? '#b0b0b0'
}

export function getRpeLabel(rpe: number): string {
  const labels: Record<number, string> = {
    6: 'Very Easy', 7: 'Easy', 7.5: 'Moderate',
    8: 'Hard', 8.5: 'Very Hard', 9: 'Near Max',
    9.5: 'Max Effort-', 10: 'Absolute Max',
  }
  return labels[rpe] ?? `RPE ${rpe}`
}
