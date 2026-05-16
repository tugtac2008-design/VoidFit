import { motion } from 'framer-motion'

interface Props {
  icon: string
  title: string
  subtitle: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        gap: 16,
      }}
    >
      <div style={{
        fontSize: 56,
        lineHeight: 1,
        filter: 'drop-shadow(0 0 20px rgba(255, 144, 40,0.3))',
        marginBottom: 8,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: 6,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 13,
          color: '#6b6b6b',
          maxWidth: 280,
          lineHeight: 1.6,
        }}>
          {subtitle}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary btn-lg"
          style={{ marginTop: 8 }}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
