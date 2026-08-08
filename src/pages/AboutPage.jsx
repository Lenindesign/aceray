import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Aceray | Premium Commercial Seating'
  }, [])

  return (
    <div className="about-page">
      {/* 1. Hero Section */}
      <section className="about-hero">
        <div className="container about-hero-container text-center">
          <span className="cat-badge cat-badge-active about-kicker">About Aceray</span>
          <h1
            className="about-title"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Design Built for Enduring Commercial Elegance
          </h1>
          <p
            className="about-lede"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Connecting world-class European artisans with North America's leading hospitality, corporate, and residential interior design professionals.
          </p>

          <div
            className="about-hero-image-wrapper"
            style={{ borderRadius: 'var(--radius-card)' }}
          >
            <img
              src="https://aceray.com/wp-content/uploads/2026/01/0006s_0000_Arte-UU-horizontal-C.webp"
              alt="Aceray craftsmanship and seating designs"
              className="w-full aspect-[16/9] max-h-[480px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. Key Stats Grid */}
      <section className="about-stats">
        <div className="container about-section-container">
          <div
            className="about-stats-grid"
            style={{ borderRadius: 'var(--radius-card)' }}
          >
            <div className="about-stat">
              <span
                className="about-stat-value"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                700+
              </span>
              <span
                className="about-stat-label"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Commercial Designs
              </span>
            </div>
            <div className="about-stat">
              <span
                className="about-stat-value"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                100%
              </span>
              <span
                className="about-stat-label"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Commercial Grade
              </span>
            </div>
            <div className="about-stat">
              <span
                className="about-stat-value"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Europe
              </span>
              <span
                className="about-stat-label"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Master Artisanship
              </span>
            </div>
            <div className="about-stat">
              <span
                className="about-stat-value"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                RTS
              </span>
              <span
                className="about-stat-label"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Quick Ship Program
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Heritage & Story Section (Global Feature Showcase Module) */}
      <section className="feature-showcase about-feature">
        <div className="container about-section-container">
          <div className="feature-grid">
            <div className="feature-image">
              <img
                src="https://aceray.com/wp-content/uploads/2026/01/0001s_0004_Grande-family-horiz-A.webp"
                alt="Aceray European Seating Collection"
              />
            </div>
            <div className="feature-text">
              <span className="tag">Our Heritage</span>
              <h2>Artisanship Meets Commercial Performance</h2>
              <p>
                Aceray is a premier source for commercial seating and table designs, representing a curated selection of international artisans who share our unwavering commitment to quality, innovation, and enduring design.
              </p>
              <p>
                We work exclusively with interior designers, hospitality purchasers, and design professionals to furnish hotels, restaurants, corporate headquarters, and high-end commercial spaces across North America.
              </p>
              <p>
                Our collection spans side chairs, armchairs, lounge seating, barstools, counter stools, and outdoor furniture — all crafted to meet the rigorous demands of heavy-use commercial environments without sacrificing aesthetic warmth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Pillars (3 Cards) */}
      <section className="about-pillars">
        <div className="container about-section-container">
          <div className="about-section-heading">
            <span
              className="about-section-eyebrow"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Why Choose Aceray
            </span>
            <h2
              className="about-section-title"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              The Aceray Advantage
            </h2>
          </div>

          <div className="about-pillars-grid">
            <div
              className="about-pillar-card"
              style={{ borderRadius: 'var(--radius-card)' }}
            >
              <div>
                <h3
                  className="about-pillar-title"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  European Precision
                </h3>
                <p
                  className="about-pillar-copy"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Designed and crafted in Europe’s premier factories, combining centuries of woodworking tradition with cutting-edge manufacturing.
                </p>
              </div>
            </div>

            <div
              className="about-pillar-card"
              style={{ borderRadius: 'var(--radius-card)' }}
            >
              <div>
                <h3
                  className="about-pillar-title"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Commercial Rigor
                </h3>
                <p
                  className="about-pillar-copy"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Engineered to withstand rigorous commercial wear, backed by structural testing for hospitality and high-traffic spaces.
                </p>
              </div>
            </div>

            <div
              className="about-pillar-card"
              style={{ borderRadius: 'var(--radius-card)' }}
            >
              <div>
                <h3
                  className="about-pillar-title"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Trade Customization
                </h3>
                <p
                  className="about-pillar-copy"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
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
          <h2
            className="about-cta-title"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Look of Seating®
          </h2>
          <p
            className="about-cta-copy"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
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
