import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Utensils, Dumbbell, TrendingUp, User } from 'lucide-react'
import { useStore } from '../store/useStore'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const { activeWorkout } = useStore()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(8,8,8,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid #1a1a1a',
      display: 'flex',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV.map(({ to, icon: Icon, label }) => {
        const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
        return (
          <NavLink
            key={to}
            to={to}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px 8px',
              color: isActive ? '#00d4ff' : '#525252',
              textDecoration: 'none',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.3px',
              gap: '4px',
              transition: 'color 0.15s ease',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={22}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 5px rgba(0,212,255,0.6))' : 'none',
                  transition: 'filter 0.15s ease',
                }}
              />
              {label === 'Workout' && activeWorkout && (
                <div style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#00ff87',
                  boxShadow: '0 0 5px rgba(0,255,135,0.7)',
                }} />
              )}
            </div>
            <span>{label}</span>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 32,
                height: 2,
                borderRadius: '0 0 2px 2px',
                background: '#00d4ff',
                boxShadow: '0 0 6px rgba(0,212,255,0.6)',
              }} />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
