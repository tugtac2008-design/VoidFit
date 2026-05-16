import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Utensils, Dumbbell, Target, User } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useSounds } from '../hooks/useSounds'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/nutrition', icon: Utensils, label: 'Food' },
  { to: '/workout', icon: Dumbbell, label: 'Train' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/profile', icon: User, label: 'You' },
]

export default function BottomNav() {
  const location = useLocation()
  const { activeWorkout } = useStore()
  const snd = useSounds()

  return (
    <nav className="bottom-dock">
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
              padding: '10px 4px 10px',
              color: isActive ? '#ff9028' : 'rgba(255,255,255,0.28)',
              textDecoration: 'none',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              gap: '4px',
              transition: 'color 0.15s ease',
              position: 'relative',
            }}
          >
            {/* Active indicator dot above icon */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 6,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 20,
                height: 2,
                borderRadius: 2,
                background: '#ff9028',
                boxShadow: '0 0 8px rgba(255,144,40,0.7)',
              }} />
            )}

            <div style={{ position: 'relative' }}>
              {isWorkout ? (
                <div style={{
                  width: 42, height: 26,
                  borderRadius: 13,
                  background: isActive
                    ? 'rgba(255,144,40,0.18)'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? 'rgba(255,144,40,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 14px rgba(255,144,40,0.2)' : 'none',
                }}>
                  <Icon size={15} style={{
                    filter: isActive ? 'drop-shadow(0 0 4px rgba(255,144,40,0.8))' : 'none',
                    transition: 'filter 0.15s ease',
                  }} />
                  {activeWorkout && (
                    <div style={{
                      position: 'absolute', top: -3, right: -3,
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#00ff87',
                      boxShadow: '0 0 6px rgba(0,255,135,0.9)',
                      border: '1.5px solid #080A10',
                    }} />
                  )}
                </div>
              ) : (
                <Icon size={20} style={{
                  filter: isActive ? 'drop-shadow(0 0 5px rgba(255,144,40,0.6))' : 'none',
                  transition: 'filter 0.15s ease',
                }} />
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
