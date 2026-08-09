import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'

export default function NotFoundPage() {
  useEffect(() => {
    setSeoMetadata({
      title: 'Page Not Found | Aceray',
      description: 'The requested Aceray page was not found. Browse the catalog or return to the homepage.',
      path: window.location.pathname,
      robots: 'noindex, follow',
    })
    removeSeoJsonLd('product-jsonld')
  }, [])

  return (
    <div className="not-found-page">
      <section className="container not-found-page-container">
        <span className="not-found-page-eyebrow">404 Error</span>
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">Return to Home</Link>
          <Link to="/catalog" className="btn-outline">Browse Catalog</Link>
        </div>
      </section>
    </div>
  )
}
