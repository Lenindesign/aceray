import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, FileText } from 'lucide-react'

export default function PromotionalPublications() {
  return (
    <section className="promotional-publications-section container">
      <div className="promotional-publications-grid">

        {/* Card 1: A BOOK (The Aceray Lookbook) */}
        <article className="promo-pub-card promo-pub-card-book">
          <div className="promo-pub-header">
            <h2 className="promo-pub-title">A BOOK</h2>
            <p className="promo-pub-subtitle">The Aceray Lookbook</p>
          </div>

          <div className="promo-pub-stage promo-pub-stage-book">
            <div className="promo-pub-image-frame">
              <img
                src="/assets/promotions/a-book-lookbook-cover.png"
                alt="A BOOK - The Aceray Lookbook Cover"
                width="340"
                height="450"
                loading="lazy"
                decoding="async"
                className="promo-pub-cover-img"
              />
            </div>
            <div className="promo-pub-card-actions">
              <Link to="/aceray-book" className="promo-pub-btn promo-pub-btn-solid">
                <span>View Lookbook</span>
                <ArrowRight className="w-4 h-4 ml-2 inline" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>

        {/* Card 2: ACERAY CATALOG */}
        <article className="promo-pub-card promo-pub-card-catalog">
          <div className="promo-pub-header">
            <h2 className="promo-pub-title">ACERAY CATALOG</h2>
            <p className="promo-pub-subtitle">Request a Copy | View Online</p>
          </div>

          <div className="promo-pub-stage promo-pub-stage-catalog">
            <div className="promo-pub-image-frame">
              <img
                src="/assets/promotions/aceray-2026-catalog-cover.png"
                alt="Aceray 2026 Commercial Furniture Catalog Cover"
                width="500"
                height="350"
                loading="lazy"
                decoding="async"
                className="promo-pub-cover-img"
              />
            </div>

            <div className="promo-pub-card-actions promo-pub-dual-actions">
              <Link to="/contact?request=catalog" className="promo-pub-btn promo-pub-btn-light">
                <span>Catalog Request</span>
              </Link>
              <Link to="/aceray-book" className="promo-pub-btn promo-pub-btn-light">
                <span>Online Catalog</span>
              </Link>
            </div>
          </div>
        </article>

      </div>
    </section>
  )
}
