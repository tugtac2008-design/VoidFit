import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  duration?: number
  decimals?: number
  className?: string
  suffix?: string
  prefix?: string
}

export default function AnimatedNumber({
  value,
  duration = 800,
  decimals = 0,
  className = '',
  suffix = '',
  prefix = '',
}: Props) {
  const [display, setDisplay] = useState(value)
  const startRef = useRef(value)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    const startValue = startRef.current
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (value - startValue) * eased
      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        startRef.current = value
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  )
}
