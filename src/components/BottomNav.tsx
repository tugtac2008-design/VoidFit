import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Utensils, Dumbbell, Target, User } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useSounds } from '../hooks/useSounds'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const { activeWorkout } = useStore()
  const snd = useSounds()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(8,8,8,0.97)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid #1a1a1a',
      display: 'flex',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV.map(({ to, icon: Icon, label }) => {
        const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
        const isWorkout = to === '/workout'
        return (
          <NavLink
            key={to}
            to={to}
            onClick={() => snd.navigate()}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isWorkout ? '6px 4px 8px' : '10px 4px 8px',
              color: isActive ? '#00d4ff' : '#525252',
              textDecoration: 'none',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.3px',
              gap: '3px',
              transition: 'color 0.15s ease',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              {isWorkout ? (
                // Workout tab gets a special pill background
                <div style={{
                  width: 46, height: 30,
                  borderRadius: 15,
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(0,212,255,0.1))'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 12px rgba(0,212,255,0.25)' : 'none',
                }}>
                  <Icon
                    size={18}
                    style={{
                      filter: isActive ? 'drop-shadow(0 0 4px rgba(0,212,255,0.8))' : 'none',
                      transition: 'filter 0.15s ease',
                    }}
                  />
                  {activeWorkout && (
                    <div style={{
                      position: 'absolute', top: -2, right: -2,
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#00ff87',
                      boxShadow: '0 0 6px rgba(0,255,135,0.8)',
                      border: '1.5px solid #080808',
                    }} />
                  )}
                </div>
              ) : (
                <Icon
                  size={22}
                  style={{
                    filter: isActive ? 'drop-shadow(0 0 5px rgba(0,212,255,0.6))' : 'none',
                    transition: 'filter 0.15s ease',
                  }}
                />
              )}
            </div>
            <span>{label}</span>
            {isActive && !isWorkout && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 28,
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
