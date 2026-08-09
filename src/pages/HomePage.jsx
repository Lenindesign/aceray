import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchSanityResult } from '@/lib/sanityHttp'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'
import ProductCard from '@/components/ProductCard'

const FEATURED_QUERY = `*[_type == "product" && (defined(imageUrl) || defined(mainImage.asset))] | order(_updatedAt desc) [0..7] {
  _id, title, slug, designer, categories, imageUrl, mainImage{asset->{_id, url}}
}`

const FEATURED_CATEGORIES = [
  {
    title: 'Side Chairs',
    subtitle: 'Explore Collection',
    cat: 'side-chairs',
    image: '/assets/migrated/Alba-4.webp',
  },
  {
    title: 'Armchairs',
    subtitle: 'Explore Collection',
    cat: 'armchairs',
    image: '/assets/migrated/0001s_0004_Grande-family-horiz-A.webp',
  },
  {
    title: 'Lounge Seating',
    subtitle: 'Explore Collection',
    cat: 'lounge',
    image: '/assets/migrated/riva-1.webp',
  },
  {
    title: 'Outdoor Living',
    subtitle: 'Explore Collection',
    cat: 'outdoors',
    image: '/assets/migrated/0003s_0002_Bora-horizontal-A.webp',
  },
]

const NEW_ARRIVALS_SLIDES = [
  { title: "ARTE", designer: "Balutto Associates", src: "/assets/migrated/0006s_0000_Arte-UU-horizontal-C.webp", familySlug: "arte" },
  { title: "ALBA", designer: "E. & P. Ciani Design", src: "/assets/migrated/Alba-4.webp", familySlug: "alba" },
  { title: "CIAO", designer: "Massimo Iosa Ghini", src: "/assets/migrated/0002s_0000_Ciao-UU-horizontal-C.webp", familySlug: "ciao" },
  { title: "SOLO-V", designer: "Gentian Elezi", src: "/assets/migrated/colo-v.webp", familySlug: "solo" },
  { title: "BORA", designer: "E. & P. Ciani Design", src: "/assets/migrated/0003s_0002_Bora-horizontal-A.webp", familySlug: "bora" },
  { title: "MIRA-X3", designer: "A & T Studio", src: "/assets/migrated/mira-x3-2-1.webp", familySlug: "mira" },
  { title: "CORSO", designer: "Balutto Associates", src: "/assets/migrated/corso3.webp", familySlug: "corso" },
  { title: "SPAZIO-R", designer: "A & T Studio", src: "/assets/migrated/Spazio-R-2M-2.webp", familySlug: "spazio" }
]

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)
  const [loadedSlides, setLoadedSlides] = useState(() => new Set([0]))
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setSeoMetadata({
      title: 'Aceray - The Look of Seating | Premium Commercial Furniture',
      description: 'Explore Aceray commercial seating, lounge furniture, table bases, designer collections, finishes, and installation resources for hospitality and contract interiors.',
      path: '/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Aceray',
        url: 'https://aceray.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://aceray.com/catalog?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    })
    removeSeoJsonLd('product-jsonld')

    fetchSanityResult(FEATURED_QUERY)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    setPrefersReducedMotion(mediaQuery.matches)

    const handleMotionPreferenceChange = (event) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleMotionPreferenceChange)
    return () => mediaQuery.removeEventListener('change', handleMotionPreferenceChange)
  }, [])

  // Ensure active slide image is loaded
  useEffect(() => {
    setLoadedSlides((prev) => {
      if (prev.has(heroIndex)) return prev
      const next = new Set(prev)
      next.add(heroIndex)
      return next
    })
  }, [heroIndex])

  // Progressive background preloading of remaining hero images after main page render
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedSlides(new Set(NEW_ARRIVALS_SLIDES.map((_, i) => i)))
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Automated 5-second Hero transition loop
  useEffect(() => {
    if (prefersReducedMotion) return undefined

    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % NEW_ARRIVALS_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [prefersReducedMotion])

  const currentSlide = NEW_ARRIVALS_SLIDES[heroIndex]

  return (
    <div className="home-page">
      {/* Hero Banner with 5-Second Automated Cross-Fade Transition (Clickable Module) */}
      <section className="hero-banner">
        {/* Dynamic Cross-Fading Background Slides with Progressive Loading */}
        {NEW_ARRIVALS_SLIDES.map((slide, idx) => (
          <div
            key={slide.title}
            className={`hero-bg-slide ${idx === heroIndex ? 'active' : ''}`}
            style={loadedSlides.has(idx) ? { backgroundImage: `url(${slide.src})` } : undefined}
            aria-hidden="true"
          />
        ))}
        <div className="hero-overlay" />

        {/* Hero Content & Active Slide Info */}
        <div className="hero-content">
          <div className="hero-slide-info">
            <span className="hero-slide-tag">COLLECTION</span>
            <h1 className="hero-slide-title">{currentSlide.title}</h1>
            <p className="hero-slide-designer">Designed by {currentSlide.designer}</p>
          </div>
        </div>

        {/* CTA Button & Slide Indicators Below */}
        <div className="hero-bottom-wrap">
          <div className="hero-bottom-cta">
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/collections/${currentSlide.familySlug}`)
              }}
            >
              Explore {currentSlide.title} Collection
            </button>
          </div>

          <div className="hero-slide-indicators">
            {NEW_ARRIVALS_SLIDES.map((slide, idx) => (
              <button
                key={slide.title}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setHeroIndex(idx)
                }}
                className={`hero-indicator-dot ${idx === heroIndex ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="home-section category-section container">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Curated collections designed for timeless performance and aesthetic distinction.</p>

        <div className="category-card-grid">
          {FEATURED_CATEGORIES.map(({ title, subtitle, cat, image }) => (
            <div key={cat} className="category-card">
              <Link to={`/catalog?cat=${cat}`}>
                <img src={image} alt={`Aceray ${title}`} width="400" height="300" loading="lazy" decoding="async" />
                <div className="category-info">
                  <h3 className="category-title">{title}</h3>
                  <span className="category-link">{subtitle}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Asymmetric Feature Showcase */}
      <section className="feature-showcase home-feature">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-image">
              <img
                src="/assets/migrated/Epoca_Ambiente_almea_web-jpg.webp"
                alt="Aceray commercial seating installation in premier venue"
                width="700"
                height="394"
                loading="lazy"
                decoding="async"
                className="home-craft-image"
              />
            </div>
            <div className="feature-text">
              <span className="tag">Unmatched Craftsmanship</span>
              <h2>Designed for Distinction. Built for Longevity.</h2>
              <p>Built by master craftsmen using sustainably sourced hardwoods, precision steel bases, and high-performance commercial upholstery. Every Aceray design brings extraordinary comfort and character to high-traffic environments.</p>
              <Link to="/installations" className="btn-primary">
                View Installation Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer / Catalog Favorites Section */}
      <section className="home-section products-section container">
        <h2 className="section-title">Featured Highlights</h2>
        <p className="section-subtitle">Discover our latest released contemporary furniture models.</p>

        {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square rounded-xs mb-3" />
                <Skeleton className="h-4 w-3/4 mb-1.5" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        <div className="products-section-actions">
          <Link to="/catalog" className="btn-outline">
            View All Products
          </Link>
        </div>
      </section>

    </div>
  )
}
