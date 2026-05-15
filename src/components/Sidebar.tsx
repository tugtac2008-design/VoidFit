import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Utensils, Dumbbell, TrendingUp, User,
  Zap, Activity
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { pct } from '../utils/format'
import { TODAY } from '../utils/format'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, getMealEntriesForDate, getWaterForDate, activeWorkout } = useStore()
  const today = TODAY()

  const entries = getMealEntriesForDate(today)
  const totalCals = entries.reduce((sum, e) => sum + e.food.calories * e.servings, 0)
  const calPct = pct(totalCals, user.macroGoals.calories)
  const water = getWaterForDate(today)
  const waterPct = pct(water, user.macroGoals.water)

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-void-300 border border-void-400 flex items-center justify-center">
              <Zap size={18} className="text-neon-cyan" style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.6))' }} />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon-green"
              style={{ boxShadow: '0 0 6px rgba(0,255,135,0.7)' }} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-widest text-white">VOIDFIT</div>
            <div className="text-[10px] tracking-widest text-void-600 uppercase">Elite Tracker</div>
          </div>
        </div>
      </div>

      <div className="px-3 mb-2">
        <div className="h-px bg-void-300" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        <div className="section-title px-5 pb-2">Menu</div>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <NavLink key={to} to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={16} />
              <span>{label}</span>
              {label === 'Workout' && activeWorkout && (
                <span className="ml-auto">
                  <span className="pulse-dot pulse-dot-orange" />
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Today's stats */}
      <div className="px-3 mb-2">
        <div className="h-px bg-void-300" />
      </div>
      <div className="px-4 py-4 space-y-3">
        <div className="section-title mb-2">Today</div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1.5">
              <Activity size={11} className="text-neon-cyan" />
              <span className="text-[11px] text-void-600">Calories</span>
            </div>
            <span className="mono text-[11px] text-white">{totalCals} / {user.macroGoals.calories}</span>
          </div>
          <div className="progress-track h-1.5">
            <motion.div
              className="progress-fill progress-fill-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(calPct, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">💧</span>
              <span className="text-[11px] text-void-600">Water</span>
            </div>
            <span className="mono text-[11px] text-white">{(water / 1000).toFixed(1)}L</span>
          </div>
          <div className="progress-track h-1.5">
            <motion.div
              className="progress-fill progress-fill-purple"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(waterPct, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4">
        <NavLink to="/profile" className="flex items-center gap-3 p-3 rounded-10 hover:bg-void-300 transition-colors cursor-pointer"
          style={{ borderRadius: '10px' }}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-void-400 flex items-center justify-center">
            <span className="text-xs font-bold text-neon-cyan">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-void-600 capitalize">{user.experience}</div>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
