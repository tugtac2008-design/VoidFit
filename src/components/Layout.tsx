import { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface Props { children: ReactNode }

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="main-content flex-1">
        <div className="page-wrapper">
          {children}
        </div>
      </main>
    </div>
  )
}
