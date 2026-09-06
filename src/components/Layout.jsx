import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Top Announcement Bar (Production Class) */}
      <div className="top-banner">
        <span>CONTEMPORARY COMMERCIAL FURNISHINGS</span>
      </div>

      <Header />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
