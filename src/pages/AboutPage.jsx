import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Aceray | Premium Commercial Seating'
  }, [])

  return (
    <div className="about-page bg-white w-full">
      {/* 1. Hero Section */}
      <section className="about-hero block w-full py-20 md:py-28 bg-[#F9F8F6] border-b border-[#E5E3DD]">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="cat-badge cat-badge-active mb-6 inline-flex">About Aceray</span>
          <h1
            className="text-3xl md:text-5xl font-medium tracking-wide text-[#222222] mb-6 uppercase leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Design Built for Enduring Commercial Elegance
          </h1>
          <p
            className="text-base md:text-xl text-[#555555] leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Connecting world-class European artisans with North America's leading hospitality, corporate, and residential interior design professionals.
          </p>

          <div
            className="about-hero-image-wrapper overflow-hidden border border-[#E5E3DD] shadow-sm mt-6"
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
      <section className="about-stats block w-full py-16 md:py-24 bg-white border-b border-[#E5E3DD]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-12 px-6 md:px-12 bg-[#F4F3EF] border border-[#E5E3DD] shadow-sm"
            style={{ borderRadius: 'var(--radius-card)' }}
          >
            <div className="text-center py-4">
              <span
                className="block text-3xl md:text-5xl font-bold text-[#718f80] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                700+
              </span>
              <span
                className="text-xs md:text-sm uppercase tracking-widest text-[#666666] font-semibold block"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Commercial Designs
              </span>
            </div>
            <div className="text-center py-4">
              <span
                className="block text-3xl md:text-5xl font-bold text-[#718f80] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                100%
              </span>
              <span
                className="text-xs md:text-sm uppercase tracking-widest text-[#666666] font-semibold block"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Commercial Grade
              </span>
            </div>
            <div className="text-center py-4">
              <span
                className="block text-3xl md:text-5xl font-bold text-[#718f80] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Europe
              </span>
              <span
                className="text-xs md:text-sm uppercase tracking-widest text-[#666666] font-semibold block"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Master Artisanship
              </span>
            </div>
            <div className="text-center py-4">
              <span
                className="block text-3xl md:text-5xl font-bold text-[#718f80] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                RTS
              </span>
              <span
                className="text-xs md:text-sm uppercase tracking-widest text-[#666666] font-semibold block"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Quick Ship Program
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Heritage & Story Section (Global Feature Showcase Module) */}
      <section className="feature-showcase bg-white">
        <div className="container max-w-6xl">
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
      <section className="about-pillars block w-full py-20 md:py-28 bg-[#F5F4F0] border-b border-[#E5E3DD]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <span
              className="text-xs uppercase tracking-[0.15em] font-bold text-[#718f80] block mb-2"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Why Choose Aceray
            </span>
            <h2
              className="text-2xl md:text-4xl font-medium text-[#222222] uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              The Aceray Advantage
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div
              className="p-8 md:p-10 bg-white border border-[#E5E3DD] space-y-4 shadow-sm h-full flex flex-col justify-between"
              style={{ borderRadius: 'var(--radius-card)' }}
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[rgba(113,143,128,0.12)] flex items-center justify-center text-[#718f80] mb-4">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3
                  className="text-lg md:text-xl font-medium text-[#222222] uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  European Precision
                </h3>
                <p
                  className="text-sm text-[#555555] leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Designed and crafted in Europe’s premier factories, combining centuries of woodworking tradition with cutting-edge manufacturing.
                </p>
              </div>
            </div>

            <div
              className="p-8 md:p-10 bg-white border border-[#E5E3DD] space-y-4 shadow-sm h-full flex flex-col justify-between"
              style={{ borderRadius: 'var(--radius-card)' }}
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[rgba(113,143,128,0.12)] flex items-center justify-center text-[#718f80] mb-4">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <h3
                  className="text-lg md:text-xl font-medium text-[#222222] uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Commercial Rigor
                </h3>
                <p
                  className="text-sm text-[#555555] leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Engineered to withstand rigorous commercial wear, backed by structural testing for hospitality and high-traffic spaces.
                </p>
              </div>
            </div>

            <div
              className="p-8 md:p-10 bg-white border border-[#E5E3DD] space-y-4 shadow-sm h-full flex flex-col justify-between"
              style={{ borderRadius: 'var(--radius-card)' }}
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[rgba(113,143,128,0.12)] flex items-center justify-center text-[#718f80] mb-4">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <h3
                  className="text-lg md:text-xl font-medium text-[#222222] uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Trade Customization
                </h3>
                <p
                  className="text-sm text-[#555555] leading-relaxed"
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
      <section className="about-cta block w-full text-center py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2
            className="text-3xl md:text-5xl font-medium text-[#222222] uppercase tracking-wide mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Look of Seating®
          </h2>
          <p
            className="text-base md:text-lg text-[#555555] mb-10 max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Explore our complete catalog or connect with our trade team to request swatches and commercial pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
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
