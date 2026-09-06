import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { formatPrice, getProductPricing } from '@/lib/pricing'
import { optimizeSanityUrl } from '@/lib/sanityImageUrl'

export default function ProductStickyNav({
  product,
  hasFinishes = false,
  hasDownloads = false,
  hasCollection = false,
  hasRelated = false,
  onOpenSpecPdf,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('product-overview')

  const pricing = useMemo(() => getProductPricing(product), [product])
  const formattedPrice = pricing?.startingPrice ? formatPrice(pricing.startingPrice) : null

  const sections = useMemo(() => {
    const list = [
      { id: 'product-overview', label: 'Overview' },
      { id: 'product-specs', label: 'Specifications' },
    ]
    if (hasFinishes) list.push({ id: 'product-finishes', label: 'Finishes' })
    if (hasDownloads) list.push({ id: 'product-downloads', label: 'Downloads' })
    if (hasCollection) list.push({ id: 'product-collection', label: 'Collection' })
    if (hasRelated) list.push({ id: 'product-related', label: 'Related' })
    return list
  }, [hasFinishes, hasDownloads, hasCollection, hasRelated])

  // Scroll visibility threshold
  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      setIsVisible(scrollY > 420)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live section IntersectionObserver
  useEffect(() => {
    const sectionIds = sections.map((s) => s.id)
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-90px 0px -60% 0px',
        threshold: 0.1,
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  function handleJump(e, id) {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(id)
    }
  }

  let imageUrl = '/assets/images/placeholder.jpg'
  if (product?.mainImage?.asset?.url) {
    imageUrl = product.mainImage.asset.url
  } else if (product?.imageUrl && !product.imageUrl.includes('aceray.com')) {
    imageUrl = product.imageUrl
  }
  const thumbUrl = optimizeSanityUrl(imageUrl, { width: 80, quality: 75 })
  const quoteUrl = useMemo(() => {
    const params = new URLSearchParams()
    params.set('intent', 'quote')
    if (product?.title) params.set('product', product.title)
    const s = product?.slug?.current || product?.slug
    if (s) params.set('slug', s)
    return `/contact?${params.toString()}`
  }, [product])

  return (
    <nav
      className={`product-sticky-nav ${isVisible ? 'product-sticky-nav-visible' : ''}`}
      aria-label="Product sections navigation"
      aria-hidden={!isVisible}
    >
      <div className="container product-sticky-nav-container">
        {/* Left: Product Identity */}
        <div className="product-sticky-nav-identity">
          <img
            src={thumbUrl}
            alt=""
            aria-hidden="true"
            className="product-sticky-thumb"
            loading="lazy"
          />
          <div className="product-sticky-info">
            <span className="product-sticky-title">{product?.title}</span>
            {formattedPrice && (
              <span className="product-sticky-price">From {formattedPrice}</span>
            )}
          </div>
        </div>

        {/* Center: Jump Links */}
        <ul className="product-sticky-nav-tabs" role="tablist">
          {sections.map((sec) => (
            <li key={sec.id} role="presentation">
              <a
                href={`#${sec.id}`}
                onClick={(e) => handleJump(e, sec.id)}
                className={`product-sticky-tab ${activeSection === sec.id ? 'product-sticky-tab-active' : ''}`}
                role="tab"
                aria-selected={activeSection === sec.id}
                tabIndex={isVisible ? 0 : -1}
              >
                {sec.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: Quick Actions */}
        <div className="product-sticky-nav-actions">
          {onOpenSpecPdf && (
            <button
              type="button"
              className="btn-outline product-sticky-pdf-btn"
              onClick={onOpenSpecPdf}
              aria-label="Download Spec Sheet PDF"
              tabIndex={isVisible ? 0 : -1}
            >
              <FileText className="size-3.5 mr-1" aria-hidden="true" />
              <span>Spec PDF</span>
            </button>
          )}
          <Link
            to={quoteUrl}
            className="btn-primary product-sticky-cta-btn"
            tabIndex={isVisible ? 0 : -1}
          >
            Request Quote
          </Link>
        </div>
      </div>
    </nav>
  )
}
