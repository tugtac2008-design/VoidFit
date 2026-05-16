import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

interface Props { children: ReactNode }

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen" style={{ background: '#080A10' }}>
      {/* Sidebar — desktop only */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main
        className="flex-1 px-3 py-4 lg:px-6 lg:py-6"
        style={{ marginLeft: 0, paddingBottom: 'calc(110px + env(safe-area-inset-bottom))' }}
      >
        {/* On desktop, offset for sidebar */}
        <div className="lg:ml-[220px]">
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {children}
          </div>
        </div>
      </main>

      {/* Bottom nav — mobile/tablet only */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
