import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found – Aceray'
  }, [])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[55vh] py-16 text-center space-y-4">
      <span className="text-xs font-bold uppercase tracking-widest text-[#718f80]">404 Error</span>
      <h1 className="text-3xl sm:text-4xl font-serif">Page Not Found</h1>
      <p className="text-sm text-[#666666] max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4 pt-2">
        <Link to="/" className="btn-primary">Return to Home</Link>
        <Link to="/catalog" className="btn-outline">Browse Catalog</Link>
      </div>
    </div>
  )
}
