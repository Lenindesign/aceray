import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { removeSeoJsonLd, setSeoMetadata, createBreadcrumbJsonLd, ACERAY_ORGANIZATION_SCHEMA } from '@/lib/seo'

export default function AboutPage() {
  useEffect(() => {
    setSeoMetadata({
      title: 'About Aceray | European Artisan Seating & Commercial Excellence',
      description: "Discover Aceray's heritage of bringing world-class European seating craftsmanship and commercial-grade furniture solutions to North American designers.",
      path: '/about',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'AboutPage',
            name: 'About Aceray',
            description: "Discover Aceray's heritage of bringing world-class European seating craftsmanship and commercial-grade furniture solutions to North American designers.",
            publisher: { '@id': 'https://aceray.com/#organization' },
          },
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
          ACERAY_ORGANIZATION_SCHEMA,
        ],
      },
    })
    return () => removeSeoJsonLd()
  }, [])

  return (
    <div className="about-page">
      {/* 1. Hero Section */}
      <section className="about-hero">
        <div className="container about-hero-container text-center">
          <span className="cat-badge cat-badge-active about-kicker">About Aceray</span>
          <h1 className="about-title">
            Design Built for Enduring Commercial Elegance
          </h1>
          <p className="about-lede">
            Connecting world-class European artisans with North America's leading hospitality, corporate, and residential interior design professionals.
          </p>

          <div className="about-hero-image-wrapper">
            <img
              src="/assets/migrated/0006s_0000_Arte-UU-horizontal-C.webp"
              alt="Aceray craftsmanship and seating designs"
              className="w-full aspect-[16/9] max-h-[480px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. Key Stats Grid */}
      <section className="about-stats">
        <div className="container about-section-container">
          <div className="about-stats-grid">
            <div className="about-stat">
              <span className="about-stat-value">700+</span>
              <span className="about-stat-label">Commercial Designs</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">100%</span>
              <span className="about-stat-label">Commercial Grade</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">Europe</span>
              <span className="about-stat-label">Master Artisanship</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">RTS</span>
              <span className="about-stat-label">Quick Ship Program</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Heritage & Craftsmanship Feature Block */}
      <section className="about-feature">
        <div className="container about-section-container">
          <div className="feature-grid">
            <div className="feature-media">
              <img
                src="/assets/migrated/0006s_0000_Arte-UU-horizontal-C.webp"
                alt="European furniture workshop and craftsmanship"
                className="feature-image"
              />
            </div>
            <div className="feature-text">
              <span className="cat-badge cat-badge-active">Heritage &amp; Quality</span>
              <h2 className="about-feature-title">
                European Artisanship Meets Modern Commercial Specification
              </h2>
              <p>
                At Aceray, our mission is simple yet uncompromising: to provide interior designers, architects, and purchasing agents with extraordinary contemporary seating and table collections crafted by master European artisans.
              </p>
              <p>
                From hand-carved beechwood frames to precision injection-molded lounge armchairs, every piece in our portfolio reflects decades of specialized craftsmanship. We carefully select international design partners who share our dedication to structural integrity, ergonomic comfort, and timeless aesthetic beauty.
              </p>
              <p>
                Whether specifying for high-traffic hotel lobbies, fine dining restaurants, corporate headquarters, or luxury residential projects, Aceray delivers reliable commercial performance backed by custom COM/COL options and fast-turnaround stocking programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Pillars (3 Cards) */}
      <section className="about-pillars">
        <div className="container about-section-container">
          <div className="about-section-heading">
            <span className="about-section-eyebrow">Why Choose Aceray</span>
            <h2 className="about-section-title">The Aceray Advantage</h2>
          </div>

          <div className="about-pillars-grid">
            <div className="about-pillar-card">
              <div>
                <h3 className="about-pillar-title">European Precision</h3>
                <p className="about-pillar-copy">
                  Designed and crafted in Europe’s premier factories, combining centuries of woodworking tradition with cutting-edge manufacturing.
                </p>
              </div>
            </div>

            <div className="about-pillar-card">
              <div>
                <h3 className="about-pillar-title">Commercial Rigor</h3>
                <p className="about-pillar-copy">
                  Engineered to withstand rigorous commercial wear, backed by structural testing for hospitality and high-traffic spaces.
                </p>
              </div>
            </div>

            <div className="about-pillar-card">
              <div>
                <h3 className="about-pillar-title">Trade Customization</h3>
                <p className="about-pillar-copy">
                  Comprehensive COM/COL upholstery options, custom stain matching, and tailored project assistance for A&amp;D specification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Closing CTA Banner */}
      <section className="about-cta">
        <div className="container about-cta-container">
          <h2 className="about-cta-title">The Look of Seating®</h2>
          <p className="about-cta-copy">
            Explore our complete catalog or connect with our trade team to request swatches and commercial pricing.
          </p>
          <div className="about-cta-actions">
            <Link to="/catalog" className="btn-primary">
              Explore Collection
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
