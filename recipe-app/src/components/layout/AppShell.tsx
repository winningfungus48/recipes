import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-[#FAF8F5] text-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        <main className="flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
