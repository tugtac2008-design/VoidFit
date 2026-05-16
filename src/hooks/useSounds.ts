import { useStore } from '../store/useStore'
import * as sounds from '../lib/sounds'

const noop = () => {}

export function useSounds() {
  const enabled = useStore(s => s.settings.soundEnabled)
  return enabled ? sounds : {
    tap: noop, navigate: noop, success: noop,
    check: noop, achievement: noop, dismiss: noop,
    error: noop, celebrate: noop,
  }
}
