import { useEffect, useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchSanityResult } from '@/lib/sanityHttp'
import { optimizeSanityUrl } from '@/lib/sanityImageUrl'
import { removeSeoJsonLd, setSeoMetadata, ACERAY_ORGANIZATION_SCHEMA, ACERAY_WEBSITE_SCHEMA } from '@/lib/seo'
import ProductCard from '@/components/ProductCard'
import CommercialSeatingGuide from '@/components/CommercialSeatingGuide'

const FEATURED_QUERY = `*[_type == "product" && (defined(imageUrl) || defined(mainImage.asset))] | order(select(isFeatured == true => 0, 1), _updatedAt desc) [0..7] {
  _id, title, slug, designer, categories, imageUrl, mainImage{asset->{_id, url}}
}`

const FEATURED_CATEGORIES = [
  {
    title: 'Side Chairs',
    subtitle: 'Explore Side Chairs',
    cat: 'side-chairs',
    image: 'https://cdn.sanity.io/images/xm9au2qy/production/054fbffa1a0463309c052104e5822df887e02e5a-1143x1040.jpg?w=480&h=360&fit=crop&auto=format&q=75',
  },
  {
    title: 'Armchairs',
    subtitle: 'Explore Armchairs',
    cat: 'armchairs',
    image: 'https://cdn.sanity.io/images/xm9au2qy/production/80507990300523c51d933524657b70e031fc475a-1094x989.jpg?w=480&h=360&fit=crop&auto=format&q=75',
  },
  {
    title: 'Lounge Seating',
    subtitle: 'Explore Lounge Seating',
    cat: 'lounge',
    image: '/assets/migrated/Aceray_Ciao-family-jpg.webp',
  },
  {
    title: 'Outdoor Living',
    subtitle: 'Explore Outdoor Living',
    cat: 'outdoors',
    image: 'https://cdn.sanity.io/images/xm9au2qy/production/d33dc5f444f69b04e476f7e4b738a1e2cd853108-1152x1152.jpg?w=480&h=360&fit=crop&auto=format&q=75',
  },
]

const NEW_ARRIVALS_SLIDES = [
  { title: "ARTE", designer: "Balutto Associates", src: "/assets/migrated/0006s_0000_Arte-UU-horizontal-C.webp", familySlug: "arte", productSlug: "arte-1u" },
  { title: "ALBA", designer: "E. & P. Ciani Design", src: "/assets/migrated/Alba-4.webp", familySlug: "alba", productSlug: "alba-1w" },
  { title: "CIAO", designer: "Massimo Iosa Ghini", src: "/assets/migrated/0002s_0000_Ciao-UU-horizontal-C.webp", familySlug: "ciao", productSlug: "ciao-1u" },
  { title: "SOLO-V", designer: "Gentian Elezi", src: "/assets/migrated/colo-v.webp", familySlug: "solo", productSlug: "solo-v" },
  { title: "BORA", designer: "E. & P. Ciani Design", src: "/assets/migrated/0003s_0002_Bora-horizontal-A.webp", familySlug: "bora", productSlug: "bora-lbw" },
  { title: "MIRA-X3", designer: "A & T Studio", src: "/assets/migrated/mira-x3-2-1.webp", familySlug: "mira", productSlug: "mira-1s" },
  { title: "CORSO", designer: "Balutto Associates", src: "/assets/migrated/corso3.webp", familySlug: "corso", productSlug: "corso-1" },
  { title: "SPAZIO-R", designer: "A & T Studio", src: "/assets/migrated/Spazio-R-2M-2.webp", familySlug: "spazio", productSlug: "spazio-r" }
]

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)
  const [dragDeltaX, setDragDeltaX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const bannerRef = useRef(null)
  const swipeStartRef = useRef(null)
  const swipeLastRef = useRef(null)
  const pointerIdRef = useRef(null)
  const isSwipingRef = useRef(false)
  const wheelGestureRef = useRef(null)
  const wheelResetTimerRef = useRef(null)
  const wheelCooldownUntilRef = useRef(0)
  const autoplayTimerRef = useRef(null)

  const navigate = useNavigate()

  // Select slide helper
  const selectSlide = useCallback((nextIndex) => {
    const total = NEW_ARRIVALS_SLIDES.length
    const normalized = (nextIndex + total) % total
    setHeroIndex(normalized)
  }, [])

  // Autoplay loop control with pause/resume support
  const startAutoplay = useCallback(() => {
    if (prefersReducedMotion) return
    clearInterval(autoplayTimerRef.current)
    autoplayTimerRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % NEW_ARRIVALS_SLIDES.length)
    }, 5000)
  }, [prefersReducedMotion])

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    startAutoplay()
    return () => stopAutoplay()
  }, [startAutoplay, stopAutoplay])

  useEffect(() => {
    fetchSanityResult(FEATURED_QUERY)
      .then((items) => {
        const prodList = items || []
        setProducts(prodList)

        const productItemList = {
          '@type': 'ItemList',
          name: 'Aceray Featured Commercial Seating Highlights',
          numberOfItems: prodList.length,
          itemListElement: prodList.map((p, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': 'Product',
              name: p.title,
              url: `https://aceray.com/product/${p.slug?.current || p.slug}`,
              image: p.imageUrl || p.mainImage?.asset?.url,
              brand: { '@type': 'Brand', name: 'Aceray' },
              offers: {
                '@type': 'Offer',
                priceCurrency: 'USD',
                price: '0.00',
                availability: 'https://schema.org/InStock',
                url: `https://aceray.com/product/${p.slug?.current || p.slug}`,
              },
              ...(p.designer ? { designer: { '@type': 'Person', name: p.designer } } : {}),
            },
          })),
        }

        setSeoMetadata({
          title: 'Aceray | Premium Commercial & Hospitality Seating',
          description: 'Explore Aceray commercial seating, lounge furniture, table bases, designer collections, finishes, and installation resources for hospitality and contract interiors.',
          path: '/',
          jsonLd: {
            '@context': 'https://schema.org',
            '@graph': [
              ACERAY_WEBSITE_SCHEMA,
              ACERAY_ORGANIZATION_SCHEMA,
              productItemList,
            ],
          },
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))

    removeSeoJsonLd('product-jsonld')
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

  // Pointer event handlers for touch / mouse swipe (matching FullscreenImageViewer logic)
  const handlePointerDown = useCallback((event) => {
    if (event.button !== 0) return
    if (event.target.closest('.hero-thumb-dot') || event.target.closest('button')) return

    stopAutoplay()

    if (event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch (_) {}
    }

    pointerIdRef.current = event.pointerId
    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    }
    swipeLastRef.current = { x: event.clientX, y: event.clientY }
    isSwipingRef.current = false
    setIsDragging(true)
  }, [stopAutoplay])

  const handlePointerMove = useCallback((event) => {
    const start = swipeStartRef.current
    if (!start) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    swipeLastRef.current = { x: event.clientX, y: event.clientY }

    if (Math.abs(deltaX) > 6) {
      isSwipingRef.current = true
    }

    // Pass vertical gestures through to allow natural page scrolling
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.25 && !isSwipingRef.current) return

    const containerWidth = bannerRef.current?.clientWidth || window.innerWidth || 1000
    const maxOffset = containerWidth * 0.4
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, deltaX))
    setDragDeltaX(clampedOffset)
  }, [])

  const handlePointerUp = useCallback((event) => {
    const start = swipeStartRef.current
    const end = swipeLastRef.current ?? { x: event.clientX, y: event.clientY }

    if (pointerIdRef.current !== null && event.currentTarget.releasePointerCapture) {
      try {
        event.currentTarget.releasePointerCapture(pointerIdRef.current)
      } catch (_) {}
    }
    pointerIdRef.current = null
    swipeStartRef.current = null
    swipeLastRef.current = null

    if (start) {
      const deltaX = end.x - start.x
      const deltaY = end.y - start.y
      const elapsed = Math.max(event.timeStamp - start.time, 1)
      const velocity = Math.abs(deltaX) / elapsed
      const containerWidth = bannerRef.current?.clientWidth || window.innerWidth || 1000
      const threshold = Math.min(64, containerWidth * 0.14)

      const isHorizontalSwipe =
        Math.abs(deltaX) > Math.abs(deltaY) * 1.1 &&
        (Math.abs(deltaX) >= threshold || (Math.abs(deltaX) >= 20 && velocity >= 0.30))

      if (isHorizontalSwipe) {
        selectSlide(heroIndex + (deltaX < 0 ? 1 : -1))
      }
    }

    setIsAnimating(true)
    setDragDeltaX(0)
    setIsDragging(false)

    setTimeout(() => {
      setIsAnimating(false)
      isSwipingRef.current = false
    }, 350)

    startAutoplay()
  }, [heroIndex, selectSlide, startAutoplay])

  const handlePointerCancel = useCallback((event) => {
    if (pointerIdRef.current !== null && event.currentTarget.releasePointerCapture) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch (_) {}
    }
    pointerIdRef.current = null
    swipeStartRef.current = null
    swipeLastRef.current = null

    setIsAnimating(true)
    setDragDeltaX(0)
    setIsDragging(false)
    setTimeout(() => {
      setIsAnimating(false)
      isSwipingRef.current = false
    }, 350)
    startAutoplay()
  }, [startAutoplay])

  // Trackpad / Wheel horizontal swipe handler (matching FullscreenImageViewer logic)
  const handleWheel = useCallback((event) => {
    const width = bannerRef.current?.clientWidth ?? window.innerWidth
    const deltaScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width : 1
    const deltaX = event.deltaX * deltaScale
    const deltaY = event.deltaY * deltaScale
    const isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && Math.abs(deltaX) > 4

    if (!isHorizontalGesture) return

    stopAutoplay()

    const now = performance.now()
    if (now < wheelCooldownUntilRef.current) return

    if (!wheelGestureRef.current || now - wheelGestureRef.current.lastTime > 240) {
      wheelGestureRef.current = { offsetX: 0, lastTime: now }
    }

    wheelGestureRef.current.offsetX += deltaX
    wheelGestureRef.current.lastTime = now

    const threshold = Math.min(64, width * 0.14)
    const maxOffset = width * 0.3
    const visualOffset = Math.max(-maxOffset, Math.min(maxOffset, -wheelGestureRef.current.offsetX))
    setIsDragging(true)
    setDragDeltaX(visualOffset)

    if (Math.abs(wheelGestureRef.current.offsetX) >= threshold) {
      const direction = wheelGestureRef.current.offsetX > 0 ? 1 : -1
      wheelCooldownUntilRef.current = now + 650
      selectSlide(heroIndex + direction)
      wheelGestureRef.current = null
      setIsDragging(false)
      setDragDeltaX(0)
      startAutoplay()
      return
    }

    if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current)
    wheelResetTimerRef.current = setTimeout(() => {
      wheelGestureRef.current = null
      wheelResetTimerRef.current = null
      setIsDragging(false)
      setDragDeltaX(0)
      startAutoplay()
    }, 180)
  }, [heroIndex, selectSlide, startAutoplay, stopAutoplay])

  useEffect(() => {
    const banner = bannerRef.current
    if (!banner) return
    banner.addEventListener('wheel', handleWheel, { passive: true })
    return () => banner.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const handleBannerClick = (e) => {
    if (isSwipingRef.current) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    navigate(`/collections/${currentSlide.familySlug}`)
  }

  const currentSlide = NEW_ARRIVALS_SLIDES[heroIndex]
  const prevHeroIndex = (heroIndex - 1 + NEW_ARRIVALS_SLIDES.length) % NEW_ARRIVALS_SLIDES.length
  const nextHeroIndex = (heroIndex + 1) % NEW_ARRIVALS_SLIDES.length

  return (
    <div className="home-page">
      {/* Consolidated Primary H1 for Page Level SEO & AIO */}
      <h1 className="sr-only">Aceray | Premium Commercial &amp; Hospitality Seating</h1>

      {/* Hero Banner with Gesture Engine, Continuous Drag & Flick/Swipe Detection */}
      <div className="hero-container container">
        <section
          ref={bannerRef}
          className={`hero-banner ${isDragging ? 'is-dragging' : ''} ${isAnimating ? 'is-animating' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClick={handleBannerClick}
          title={`Explore ${currentSlide.title} Collection`}
          style={{
            touchAction: 'pan-y',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* Preloaded Horizontal Slide Track for Seamless Dragging & Snapping */}
          <div
            className={`hero-slide-track ${isDragging ? 'dragging' : ''}`}
            style={{
              transform: `translate3d(calc(-${heroIndex * 100}% + ${dragDeltaX}px), 0, 0)`,
            }}
          >
            {NEW_ARRIVALS_SLIDES.map((slide, idx) => {
              const isActive = idx === heroIndex
              const isAdjacent = Math.abs(idx - heroIndex) <= 1 || (heroIndex === 0 && idx === NEW_ARRIVALS_SLIDES.length - 1) || (heroIndex === NEW_ARRIVALS_SLIDES.length - 1 && idx === 0)

              return (
                <div
                  key={slide.title}
                  className={`hero-slide-item ${isActive ? 'active' : ''}`}
                  aria-hidden={!isActive}
                >
                  <img
                    src={slide.src}
                    alt={`${slide.title} commercial seating collection designed by ${slide.designer} for Aceray`}
                    className="hero-bg-slide-img"
                    loading={idx === 0 || isAdjacent ? 'eager' : 'lazy'}
                    fetchpriority={idx === 0 || isAdjacent ? 'high' : 'auto'}
                    decoding="async"
                    width="1920"
                    height="1080"
                    draggable={false}
                  />
                </div>
              )
            })}
          </div>
          <div className="hero-overlay" />

          {/* Hero Content & Active Slide Info */}
          <div
            className="hero-content"
            style={{
              transform: isDragging && dragDeltaX !== 0 ? `translateX(${dragDeltaX * 0.4}px)` : undefined,
              transition: isDragging ? 'none' : undefined,
            }}
          >
            <div className="hero-slide-info">
              <span className="hero-slide-tag">COLLECTION</span>
              <h2 className="hero-slide-title">{currentSlide.title}</h2>
              <p className="hero-slide-designer">Designed by {currentSlide.designer}</p>
            </div>
          </div>

          {/* Circular Product Thumbnail Markers */}
          <div className="hero-bottom-wrap">
            <div className="hero-slide-indicators hero-thumb-markers">
              {NEW_ARRIVALS_SLIDES.map((slide, idx) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    stopAutoplay()
                    setHeroIndex(idx)
                    startAutoplay()
                  }}
                  className={`hero-thumb-dot ${idx === heroIndex ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  title={`${slide.title} Collection by ${slide.designer}`}
                >
                  <img
                    src={slide.src}
                    alt={`${slide.title} seating collection`}
                    width="52"
                    height="52"
                    loading="eager"
                    decoding="async"
                    className="hero-thumb-img"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Shop by Category Section */}
      <section className="home-section category-section container">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Curated collections designed for timeless performance and aesthetic distinction.</p>

        <div className="category-card-grid">
          {FEATURED_CATEGORIES.map(({ title, subtitle, cat, image }) => (
            <div key={cat} className="category-card">
              <Link to={`/catalog?cat=${cat}`}>
                <img
                  src={optimizeSanityUrl(image, { width: 600, quality: 75 })}
                  alt={`Aceray ${title}`}
                  width="400"
                  height="300"
                  loading="lazy"
                  decoding="async"
                />
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

      {/* Commercial Furniture Specification & Buying Guide (SEO & AIO Optimization) */}
      <CommercialSeatingGuide />

    </div>
  )
}
