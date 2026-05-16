import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { useStore } from '../store/useStore'

const SYNC_DEBOUNCE_MS = 3000

export async function loadFromFirestore(uid: string): Promise<boolean> {
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      const data = snap.data()
      useStore.getState().hydrateStore(data)
      return true
    }
    return false
  } catch (e) {
    console.error('Firestore load error:', e)
    return false
  }
}

export async function saveToFirestore(uid: string): Promise<void> {
  try {
    const state = useStore.getState()
    const now = Date.now()
    const cutoff = now - 365 * 24 * 60 * 60 * 1000

    const data = {
      user: state.user,
      isOnboarded: state.isOnboarded,
      settings: state.settings,
      customFoods: state.customFoods,
      supplements: state.supplements,
      personalRecords: state.personalRecords,
      templates: state.templates,
      mealEntries: state.mealEntries.filter(e => new Date(e.date).getTime() > cutoff),
      waterLogs: state.waterLogs.filter(w => new Date(w.date).getTime() > cutoff),
      supplementLogs: state.supplementLogs.filter(s => new Date(s.date).getTime() > cutoff),
      workouts: state.workouts.filter(w => new Date(w.date).getTime() > cutoff),
      measurements: state.measurements,
      goals: state.goals,
      xp: state.xp,
      badges: state.badges,
      programs: state.programs,
      readinessLogs: state.readinessLogs.filter(r => new Date(r.date).getTime() > cutoff),
      lastUpdated: now,
    }

    await setDoc(doc(db, 'users', uid), data)
  } catch (e) {
    console.error('Firestore save error:', e)
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let currentUid: string | null = null

export function startStoreSync(uid: string) {
  currentUid = uid

  return useStore.subscribe(() => {
    if (!currentUid) return
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      if (currentUid) saveToFirestore(currentUid)
    }, SYNC_DEBOUNCE_MS)
  })
}

export function stopStoreSync() {
  currentUid = null
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}
