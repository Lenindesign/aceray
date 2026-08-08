import { Link, Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Top Announcement Bar (Production Class) */}
      <div className="top-banner">
        <Link to="/contact?request=catalog">Request a Catalog</Link>
        <span aria-hidden="true">/</span>
        <Link to="/aceray-book">View Aceray Catalog</Link>
      </div>

      <Header />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
