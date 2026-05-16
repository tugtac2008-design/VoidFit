import { motion } from 'framer-motion'

interface Props {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  label?: string
  sublabel?: string
  className?: string
}

export default function MacroRing({
  value,
  max,
  size = 160,
  strokeWidth = 12,
  color = '#ff9028',
  bgColor = '#1a1a1a',
  label,
  sublabel,
  className = '',
}: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(Math.max(value / max, 0), 1)
  const offset = circumference * (1 - pct)

  const isOver = value > max
  const displayColor = isOver ? '#ff3b5c' : color

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={displayColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            filter: `drop-shadow(0 0 6px ${displayColor}80)`,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mono font-bold text-white"
            style={{ fontSize: size * 0.145, lineHeight: 1 }}
          >
            {label}
          </motion.div>
        )}
        {sublabel && (
          <div
            className="text-void-600 font-medium uppercase tracking-widest mt-0.5"
            style={{ fontSize: size * 0.07 }}
          >
            {sublabel}
          </div>
        )}
        <div
          className="font-medium mt-1"
          style={{ fontSize: size * 0.07, color: isOver ? '#ff3b5c' : color }}
        >
          {Math.round(pct * 100)}%
        </div>
      </div>
    </div>
  )
}

interface SmallRingProps {
  value: number
  max: number
  color: string
  size?: number
}

export function SmallRing({ value, max, color, size = 40 }: SmallRingProps) {
  const sw = 4
  const radius = (size - sw) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(Math.max(value / max, 0), 1)
  const offset = circumference * (1 - pct)

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1a1a1a" strokeWidth={sw} />
      <motion.circle
        cx={size/2} cy={size/2} r={radius}
        fill="none" stroke={color} strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        style={{ filter: `drop-shadow(0 0 3px ${color}80)` }}
      />
    </svg>
  )
}
