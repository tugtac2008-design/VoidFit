// Programmatic sound effects using Web Audio API — no audio files needed
let _ctx: AudioContext | null = null

function ctx(): AudioContext | null {
  try {
    if (!_ctx) _ctx = new AudioContext()
    if (_ctx.state === 'suspended') _ctx.resume()
    return _ctx
  } catch {
    return null
  }
}

function play(freq: number, type: OscillatorType, duration: number, volume = 0.06, delay = 0) {
  const ac = ctx()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = type
  osc.frequency.value = freq
  const t = ac.currentTime + delay
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.start(t)
  osc.stop(t + duration)
}

// Very subtle tap — every button press
export const tap = () => play(1100, 'sine', 0.055, 0.055)

// Nav tab switch
export const navigate = () => {
  play(800, 'sine', 0.07, 0.04)
  play(1000, 'sine', 0.05, 0.035, 0.04)
}

// Positive confirmation (food logged, goal updated)
export const success = () => {
  play(523, 'sine', 0.12, 0.07)
  play(659, 'sine', 0.12, 0.07, 0.1)
}

// Set completed in workout
export const check = () => {
  play(880, 'triangle', 0.1, 0.08)
  play(1108, 'triangle', 0.08, 0.06, 0.08)
}

// Workout finished — satisfying chord
export const achievement = () => {
  play(523, 'triangle', 0.25, 0.08)
  play(659, 'triangle', 0.25, 0.07, 0.09)
  play(784, 'triangle', 0.28, 0.07, 0.18)
  play(1046, 'triangle', 0.3, 0.06, 0.27)
}

// Soft delete/dismiss
export const dismiss = () => play(400, 'sine', 0.1, 0.04)

// Error / warning
export const error = () => {
  play(220, 'sawtooth', 0.08, 0.04)
  play(200, 'sawtooth', 0.08, 0.04, 0.1)
}

// Goal completed — celebration
export const celebrate = () => {
  [523, 659, 784, 1046, 1318].forEach((f, i) => play(f, 'triangle', 0.2, 0.07, i * 0.07))
}
