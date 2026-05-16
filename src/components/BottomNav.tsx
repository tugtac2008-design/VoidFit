import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Utensils, Target, TrendingUp, User, Dumbbell } from 'lucide-react'
import { useStore } from '../store/useStore'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { activeWorkout } = useStore()

  return (
    <>
      {/* FAB */}
      <div style={{
        position: 'fixed',
        bottom: 72,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
      }}>
        <button
          onClick={() => navigate('/workout')}
          style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00d4ff, #0088aa)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,212,255,0.5), 0 4px 12px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            position: 'relative',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0,212,255,0.7), 0 6px 20px rgba(0,0,0,0.6)'
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,212,255,0.5), 0 4px 12px rgba(0,0,0,0.5)'
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
          }}
        >
          <Dumbbell size={24} color="#000" />
          {activeWorkout && (
            <div style={{
              position: 'absolute', top: 2, right: 2,
              width: 10, height: 10, borderRadius: '50%',
              background: '#00ff87',
              boxShadow: '0 0 6px rgba(0,255,135,0.8)',
              border: '2px solid #000',
            }} />
          )}
        </button>
      </div>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(8,8,8,0.97)',
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
    </>
  )
}
