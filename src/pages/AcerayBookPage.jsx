import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { removeSeoJsonLd, setSeoMetadata, createBreadcrumbJsonLd, ACERAY_ORGANIZATION_SCHEMA } from '@/lib/seo'

const ACERAY_BOOK_EMBED = 'https://www.yumpu.com/en/embed/view/ZI39gtkPjLQN7e5M'

export default function AcerayBookPage() {
  useEffect(() => {
    setSeoMetadata({
      title: 'Aceray Book | Digital Commercial Furniture Catalog',
      description: 'Browse the Aceray digital catalog online or request a printed commercial furniture catalog from the trade team.',
      path: '/aceray-book',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ItemPage',
            name: 'Aceray Book Catalog',
            description: 'Browse the Aceray digital catalog online or request a printed commercial furniture catalog from the trade team.',
            publisher: { '@id': 'https://aceray.com/#organization' },
          },
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Aceray Book', path: '/aceray-book' },
          ]),
          ACERAY_ORGANIZATION_SCHEMA,
        ],
      },
    })
    removeSeoJsonLd('product-jsonld')
  }, [])

  return (
    <div className="aceray-book-page">
      <section className="container aceray-book-hero">
        <div className="aceray-book-heading">
          <span className="aceray-book-eyebrow">Digital Catalog</span>
          <h1>Aceray Book</h1>
          <p>
            Browse the current Aceray catalog online or request a catalog from the trade team.
          </p>
        </div>

        <div className="aceray-book-actions">
          <Link to="/contact?request=catalog" className="btn-primary">
            Request a Catalog
          </Link>
          <a href={ACERAY_BOOK_EMBED} target="_blank" rel="noreferrer" className="btn-outline">
            Open Reader
          </a>
        </div>
      </section>

      <section className="container aceray-book-reader-section">
        <div className="aceray-book-reader-card">
          <div className="aceray-book-reader-toolbar">
            <div>
              <span>Aceray Catalog</span>
              <p>Interactive digital book</p>
            </div>
            <a href={ACERAY_BOOK_EMBED} target="_blank" rel="noreferrer">
              Open full screen
            </a>
          </div>

          <div className="aceray-book-iframe-frame">
            <iframe
              src={ACERAY_BOOK_EMBED}
              title="Aceray digital catalog"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
