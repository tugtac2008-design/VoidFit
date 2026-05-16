import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

interface Props { children: ReactNode }

export default function Layout({ children }: Props) {
  return (
    <div style={{ background: '#080A10', minHeight: '100dvh' }}>
      {/* Sidebar — desktop only */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content — scrolls naturally with page */}
      <main
        className="px-3 py-4 lg:px-6 lg:py-6 lg:ml-[220px]"
        style={{
          paddingBottom: 'calc(110px + env(safe-area-inset-bottom))',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        {children}
      </main>

      {/* Bottom nav — mobile/tablet only, fixed position */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
