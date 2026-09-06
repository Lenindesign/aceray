import { Component, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Heart, FileText, Download, Layers, Box, Archive } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import ProductCard from '@/components/ProductCard'
import ProductStickyNav from '@/components/ProductStickyNav'
import ProductSpecSheetPDF from '@/components/ProductSpecSheetPDF'
import { sanityFetch } from '@/sanityClient'
import { urlFor } from '@/lib/sanityImageUrl'
import { getCollectionFamily, getFamilySlug, normalizeCategory, getEnrichedProductTitle, getCategorySuffix, getCanonicalCategory } from '@/lib/productFamilies'
import { FAVORITES_CHANGED_EVENT, isFavoriteProduct, toggleFavoriteProduct } from '@/lib/favorites'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'
import { FullscreenImageViewer } from '@/components/FullscreenImageViewer'
import { getDesignerSlug, normalizeDesignerName } from '@/data/designerProfiles'
import { getProductPricing, formatPrice, calculatePriceForGrade } from '@/lib/pricing'
import { CATEGORIES } from '@/constants'
import curatedProductRelationships from '@/data/curatedProductRelationships.json'
import {
  NOTE as FINISH_NOTE,
  TABLE_BASE_FINISHES,
  UPHOLSTERY_PARTNERS,
  VINYL_GROUPS,
  WOOD_FINISHES,
} from '@/pages/FabricsFinishesPage'

class ProductPageErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ProductPage caught an unhandled rendering error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="product-error container py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-semibold mb-3">Product Specs Unavailable</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            We encountered a temporary issue displaying this product details.
          </p>
          <Link to="/catalog" className="btn-primary">
            Browse All Products
          </Link>
        </div>
      )
    }
    return this.props.children
  }
}

export { getEnrichedProductTitle, getCategorySuffix }

// ── GROQ ─────────────────────────────────────────────────────
const PRODUCT_QUERY = `*[_type == "product" && (slug.current == $slug || lower(slug.current) == lower($slug))][0] {
  _id, title, slug, designer, madeIn, categories, tags,
  imageUrl, galleryUrls, description,
  overallHeight, overallWidth, overallDepth, seatHeight, weight, com, stacking,
  "mainImage": mainImage{asset->{_id, url}},
  "gallery": gallery[]{asset->{_id, url}},
  productPdfs[]{_key, title, sourceUrl, file{asset->{_id, url, originalFilename}}},
  technicalDrawings[]{_key, title, file{asset->{_id, url, originalFilename}}},
  files3d[]{_key, title, file{asset->{_id, url, originalFilename}}},
  zipFiles[]{_key, title, file{asset->{_id, url, originalFilename}}}
}`

const COLLECTION_FAMILY_QUERY = `*[_type == "product" && slug.current != $slug && (defined(imageUrl) || defined(mainImage.asset)) && $family in categories] | order(_updatedAt desc) [0..11] {
  _id, title, slug, imageUrl, categories, mainImage{asset->{_id, url}}
}`

const RELATED_CANDIDATES_QUERY = `*[
  _type == "product" &&
  slug.current != $slug &&
  (defined(imageUrl) || defined(mainImage.asset)) &&
  !($family in categories) &&
  (
    count((categories[])[@ in $categories]) > 0 ||
    count((tags[])[@ in $tags]) > 0 ||
    ($designer != "" && designer == $designer)
  )
] | order(_updatedAt desc) [0..119] {
  _id, title, slug, imageUrl, categories, tags, designer, madeIn, stacking, mainImage{asset->{_id, url}}
}`

const CURATED_PRODUCTS_BY_SLUG_QUERY = `*[
  _type == "product" &&
  slug.current in $slugs &&
  (defined(imageUrl) || defined(mainImage.asset))
] {
  _id, title, slug, imageUrl, categories, tags, designer, madeIn, stacking, mainImage{asset->{_id, url}}
}`

const MATERIAL_CATEGORIES = [
  'Wood',
  'Upholstery',
  'Chrome',
  'Chrome + Black',
  'Extrema Metal',
  'Matte + Chrome',
]

const LEATHER_STRAP_COLORS = [
  { label: 'Black', color: '#161412' },
  { label: 'Dark Brown', color: '#3a2519' },
  { label: 'Natural', color: '#b98558' },
]

const SADDLE_LEATHER_COLORS = [
  { label: 'Cream', color: '#e8dac2' },
  { label: 'Black', color: '#161412' },
  { label: 'Tobacco', color: '#93572e' },
  { label: 'Espresso', color: '#2b1a13' },
]

const PRODUCT_FINISH_LIMITS = {
  wood: 10,
  upholsteryPartners: 4,
  vinylColors: 6,
}

const COLLECTION_CAROUSEL_LIMIT = 12
const RELATED_CAROUSEL_LIMIT = 10

const HIDDEN_PRODUCT_CHIP_CATEGORIES = new Set([
  'Aurea',
  'Extrema Metal',
  'Planet',
  'Skill',
  'Uncategorized',
  "What's New",
])

function getSlugValue(product) {
  return product?.slug?.current || product?.slug || ''
}

function asList(value) {
  return Array.isArray(value) ? value : []
}

function getRelatedCategory(categories = [], family = '') {
  const categoryList = asList(categories)
  return CATEGORIES.find((cat) => cat !== family && categoryList.includes(cat)) ||
    categoryList.find((cat) => cat && cat !== family) ||
    ''
}

function getPrimaryProductType(categories = [], family = '') {
  const categoryList = asList(categories)
  return CATEGORIES.find((cat) => cat !== family && categoryList.includes(cat)) || ''
}

function getPrimaryMaterial(categories = []) {
  const categoryList = asList(categories)
  return MATERIAL_CATEGORIES.find((cat) => categoryList.includes(cat)) || ''
}

function hasIntentTerm(product, matcher) {
  const values = [
    ...(product?.categories || []),
    ...(product?.tags || []),
    product?.stacking || '',
    product?.description || '',
  ]

  return values.some((value) => matcher.test(value))
}

function sharedCount(left = [], right = []) {
  const rightValues = new Set(asList(right).map(normalizeCategory))
  return asList(left).filter((value) => rightValues.has(normalizeCategory(value))).length
}

function scoreRelatedProduct(product, candidate, family) {
  const productType = getPrimaryProductType(product.categories, family)
  const material = getPrimaryMaterial(product.categories)
  let score = 0

  if (productType && candidate.categories?.includes(productType)) score += 50
  if (material && candidate.categories?.includes(material)) score += 25
  if (product.designer && candidate.designer === product.designer) score += 8
  if (product.madeIn && candidate.madeIn === product.madeIn) score += 4

  score += Math.min(sharedCount(product.tags, candidate.tags) * 6, 30)
  score += Math.min(sharedCount(product.categories, candidate.categories) * 4, 20)

  const intentMatchers = [
    /\bstack/i,
    /\bswivel/i,
    /\boutdoor/i,
    /\bready to ship\b|\bRTS\b/i,
    /\bupholster/i,
    /\bleather/i,
    /\bwood/i,
  ]

  intentMatchers.forEach((matcher) => {
    if (hasIntentTerm(product, matcher) && hasIntentTerm(candidate, matcher)) score += 10
  })

  return score
}

function getIntentRelatedProducts(product, candidates, family) {
  return candidates
    .map((candidate) => ({
      product: candidate,
      score: scoreRelatedProduct(product, candidate, family),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.product.title.localeCompare(b.product.title))
    .slice(0, RELATED_CAROUSEL_LIMIT)
    .map(({ product }) => product)
}

function filterRenderableProducts(products = [], currentSlug = '') {
  return products.filter((candidate) => (
    candidate &&
    getSlugValue(candidate) !== currentSlug &&
    (candidate.imageUrl || candidate.mainImage?.asset)
  ))
}

function getStaticCuratedSlugs(product, field) {
  const slugValue = getSlugValue(product)
  return curatedProductRelationships[slugValue]?.[field] || []
}

function getResolvedCuratedProducts(product, field) {
  return filterRenderableProducts(product?.[field], getSlugValue(product))
}

function orderProductsBySlug(products = [], slugs = []) {
  const bySlug = new Map(products.map((candidate) => [getSlugValue(candidate), candidate]))
  return slugs.map((slugValue) => bySlug.get(slugValue)).filter(Boolean)
}

function formatRelatedCategory(category = '') {
  return category.toLowerCase().replace(/\s*&\s*/g, ' and ')
}

function getRelatedSubtitle(product, family) {
  const productType = getPrimaryProductType(product.categories, family)
  const material = getPrimaryMaterial(product.categories)

  if (productType && material) {
    return `More ${formatRelatedCategory(material)} ${formatRelatedCategory(productType)} selected for similar applications`
  }

  if (productType) {
    return `Related ${formatRelatedCategory(productType)} selected for similar applications`
  }

  return 'Related pieces selected for similar applications'
}

function getProductDisplayCategories(product) {
  const categories = product?.categories || []
  const family = getCollectionFamily(product)
  const prioritized = [
    getPrimaryProductType(categories, family),
    family,
    ...MATERIAL_CATEGORIES.filter((cat) => (
      categories.includes(cat) &&
      !HIDDEN_PRODUCT_CHIP_CATEGORIES.has(cat)
    )),
  ]
  const remaining = categories.filter((cat) => (
    !prioritized.includes(cat) &&
    !HIDDEN_PRODUCT_CHIP_CATEGORIES.has(cat)
  ))

  return Array.from(new Set([...prioritized, ...remaining].filter(Boolean))).slice(0, 4)
}

function getProductFinishText(product) {
  return [
    product?.title,
    product?.description,
    product?.com,
    ...(product?.categories || []),
    ...(product?.tags || []),
  ].filter(Boolean).join(' ')
}

function hasFinishSignal(product, matcher) {
  return matcher.test(getProductFinishText(product))
}

function getMatchedVinylGroups(product) {
  const categorySet = new Set((product?.categories || []).map(normalizeCategory))

  return VINYL_GROUPS.filter((group) => categorySet.has(normalizeCategory(group.title)))
}

function getTableBaseFinishMatches(product) {
  const text = getProductFinishText(product)
  const matched = TABLE_BASE_FINISHES.filter(([label]) => (
    new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(text)
  ))

  if (!matched.length && /table base|powder coated|steel|metal finish/i.test(text)) {
    return TABLE_BASE_FINISHES.slice(0, 6)
  }

  return matched
}

function isTableBaseOrTopProduct(product) {
  const primaryCat = getCanonicalCategory(product?.categories)
  const seatingCategories = [
    'Side Chairs',
    'Armchairs',
    'Lounge Seating',
    'Barstools',
    'Counter Stools',
    'Low Stools / Ottomans',
    'Benches',
    'Outdoors',
  ]
  if (seatingCategories.includes(primaryCat)) {
    return false
  }

  if (
    primaryCat === 'Table Bases' ||
    primaryCat === 'Table Tops' ||
    primaryCat === 'Tables & Bases'
  ) {
    return true
  }

  const catList = Array.isArray(product?.categories) ? product.categories : []
  const title = (product?.title || '').toLowerCase()
  const slug = (typeof product?.slug === 'string' ? product.slug : product?.slug?.current || '').toLowerCase()

  const hasSeatingSignal = catList.some((c) => {
    const s = (typeof c === 'string' ? c : c?.title || '').toLowerCase()
    return (
      s.includes('chair') ||
      s.includes('stool') ||
      s.includes('lounge') ||
      s.includes('bench') ||
      s.includes('ottoman')
    )
  })
  if (hasSeatingSignal) return false

  return (
    title.includes('table base') ||
    title.includes('table top') ||
    slug.includes('table-base') ||
    slug.includes('table-top')
  )
}

function getProductFinishSections(product) {
  const sections = []
  const text = getProductFinishText(product)
  const isTable = isTableBaseOrTopProduct(product)

  if (!isTable && /leather straps? available in black,\s*dark brown or natural/i.test(text)) {
    sections.push({
      id: 'leather-straps',
      title: 'Aceray Leather Strap',
      subtitle: 'Available in Black, Dark Brown, or Natural.',
      swatches: LEATHER_STRAP_COLORS,
    })
  }

  if (!isTable && /saddle leather colors/i.test(text)) {
    sections.push({
      id: 'saddle-leather',
      title: 'Aceray Saddle Leather',
      subtitle: 'Available in Cream, Black, Tobacco, or Espresso.',
      swatches: SADDLE_LEATHER_COLORS,
    })
  }

  if (hasFinishSignal(product, /\bwood\b|beech|ash|stains?|wood finishes?|custom stains?|custom wood/i)) {
    sections.push({
      id: 'wood-finishes',
      title: 'Aceray Wood Finishes',
      subtitle: 'Digital colors cannot be guaranteed for accuracy.',
      swatches: WOOD_FINISHES.map(([label, src]) => ({ label, src })),
    })
  }

  if (!isTable && hasFinishSignal(product, /\bCOM\b|\bCOL\b|graded[- ]?in|upholster|fabric/i)) {
    sections.push({
      id: 'upholstery',
      title: 'Aceray Upholstery',
      subtitle: 'COM, COL, or Aceray graded-in upholstery resources.',
      partners: UPHOLSTERY_PARTNERS,
    })
  }

  if (!isTable) {
    getMatchedVinylGroups(product).forEach((group) => {
      sections.push({
        id: `vinyl-${normalizeCategory(group.title)}`,
        title: group.grade ? `Aceray ${group.title} Vinyl - ${group.grade}` : `Aceray ${group.title} Vinyl`,
        subtitle: 'Digital colors cannot be guaranteed for accuracy.',
        swatches: group.colors.map(([label, src]) => ({ label, src })),
        initialLimit: PRODUCT_FINISH_LIMITS.vinylColors,
      })
    })
  }

  const tableBaseFinishes = getTableBaseFinishMatches(product)
  if (tableBaseFinishes.length) {
    sections.push({
      id: 'metal-finishes',
      title: /leg protectors/i.test(text) ? 'Aceray Leg Protector Finish' : 'Aceray Indoor Metal Finishes',
      subtitle: /leg protectors/i.test(text) ? 'Optional brushed stainless steel leg protectors.' : 'Aceray table base and metal finish options.',
      swatches: tableBaseFinishes.map(([label, src]) => ({ label, src })),
      href: '/fabrics-finishes#table-bases',
      hrefLabel: 'View indoor metal finishes',
    })
  }

  return sections
}

// ── Skeleton Loading ──────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="product-skeleton-page container py-8 md:py-12">
      <div className="product-skeleton-layout grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
        <div className="lg:col-span-8">
          <Skeleton className="aspect-square w-full rounded-[var(--radius-card)]" />
        </div>
        <div className="product-skeleton-copy lg:col-span-4 flex flex-col gap-4">
          <div className="product-skeleton-pills flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-px w-full" />
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Image Gallery (inline on product page with native swipe, wraparound loop & scroll-snap) ──────
function Gallery({ images, title, designer }) {
  const [active, setActive] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const scrollRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const scrollStartX = useRef(0)
  const isMouseDown = useRef(false)
  const wasDragged = useRef(false)

  if (!images.length) return null

  // Update active index on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const width = container.clientWidth
    if (width === 0) return
    const index = Math.round(container.scrollLeft / width)
    if (index !== active && index >= 0 && index < images.length) {
      setActive(index)
    }
  }

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: 'smooth',
    })
    setActive(index)
  }

  const handleNext = (e) => {
    e?.stopPropagation()
    const nextIdx = (active + 1) % images.length
    scrollToIndex(nextIdx)
  }

  const handlePrev = (e) => {
    e?.stopPropagation()
    const prevIdx = (active - 1 + images.length) % images.length
    scrollToIndex(prevIdx)
  }

  // Handle Touch Swipe (including Infinite Loop / Wraparound)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
    wasDragged.current = false
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
    if (Math.abs(touchEndX.current - touchStartX.current) > 10) {
      wasDragged.current = true
    }
  }

  const handleTouchEnd = () => {
    if (images.length <= 1) return
    const diff = touchStartX.current - touchEndX.current
    const threshold = 35

    if (diff > threshold) {
      // Swiped Left -> go to Next (wraps to 0 when on last image)
      const nextIdx = (active + 1) % images.length
      scrollToIndex(nextIdx)
    } else if (diff < -threshold) {
      // Swiped Right -> go to Prev (wraps to last image when on 1st image)
      const prevIdx = (active - 1 + images.length) % images.length
      scrollToIndex(prevIdx)
    }
  }

  // Handle Mouse Drag for desktop swipe
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return
    isMouseDown.current = true
    wasDragged.current = false
    touchStartX.current = e.clientX
    touchEndX.current = e.clientX
    scrollStartX.current = e.clientX + scrollRef.current.scrollLeft
  }

  const handleMouseMove = (e) => {
    if (!isMouseDown.current || !scrollRef.current) return
    touchEndX.current = e.clientX
    const delta = scrollStartX.current - e.clientX
    if (Math.abs(delta - scrollRef.current.scrollLeft) > 5) {
      wasDragged.current = true
    }
    scrollRef.current.scrollLeft = delta
  }

  const handleMouseUpOrLeave = () => {
    if (!isMouseDown.current) return
    isMouseDown.current = false
    if (images.length > 1) {
      const diff = touchStartX.current - touchEndX.current
      const threshold = 35
      if (diff > threshold) {
        scrollToIndex((active + 1) % images.length)
      } else if (diff < -threshold) {
        scrollToIndex((active - 1 + images.length) % images.length)
      }
    }
  }

  const handleImageClick = (index) => {
    if (wasDragged.current) {
      wasDragged.current = false
      return
    }
    setActive(index)
    setFullscreenOpen(true)
  }

  return (
    <div className="product-gallery-stack">
      {/* Scroll-Snap Hero Carousel Container */}
      <div className="product-hero-carousel-wrap">
        <div
          ref={scrollRef}
          className="product-hero-scroll-container"
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="product-hero-slide"
              onClick={() => handleImageClick(i)}
            >
              <img
                src={src}
                alt={`${title} commercial contract seating by Aceray${images.length > 1 ? ` - view ${i + 1}` : ''}`}
                className="product-main-img"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Swipe & Arrow navigation controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-nav-btn gallery-nav-prev"
              onClick={handlePrev}
              aria-label="Previous product image"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              className="gallery-nav-btn gallery-nav-next"
              onClick={handleNext}
              aria-label="Next product image"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="gallery-slide-indicator" aria-hidden="true">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="product-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`product-thumb-btn ${i === active ? 'active' : ''}`}
            >
              <img
                src={src}
                alt={`${title} commercial seating - view ${i + 1}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Edge-to-Edge Viewer */}
      {fullscreenOpen && (
        <FullscreenImageViewer
          images={images}
          initialIndex={active}
          title={title}
          designer={designer}
          onClose={() => setFullscreenOpen(false)}
        />
      )}
    </div>
  )
}

// ── Spec Row ──────────────────────────────────────────────────
function SpecRow({ label, value }) {
  if (!value) return null
  return (
    <div className="spec-row">
      <dt className="spec-label">{label}</dt>
      <dd className="spec-value">{value}</dd>
    </div>
  )
}

function ProductFinishSwatch({ label, src, color }) {
  return (
    <article className="product-finish-swatch-card">
      <div className="product-finish-swatch-box">
        {src ? (
          <img className="product-finish-swatch-img" src={src} alt={`${label} finish swatch`} loading="lazy" />
        ) : (
          <span className="product-finish-color-fill" style={{ backgroundColor: color }} aria-hidden="true" />
        )}
      </div>
      <span className="product-finish-swatch-label">{label}</span>
    </article>
  )
}

function ProductFinishGroupCard({ section }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const initialLimit = section.initialLimit || null
  const hasAccordion = Boolean(initialLimit && section.swatches && section.swatches.length > initialLimit)
  const visibleSwatches = hasAccordion && !isExpanded
    ? section.swatches.slice(0, initialLimit)
    : section.swatches

  return (
    <article className="product-finish-group" key={section.id}>
      <div className="product-finish-group-heading">
        <h3>{section.title}</h3>
        {section.subtitle ? <p>{section.subtitle}</p> : null}
      </div>

      {visibleSwatches?.length > 0 && (
        <div className="product-finish-swatch-grid">
          {visibleSwatches.map((swatch) => (
            <ProductFinishSwatch
              key={`${section.id}-${swatch.label}`}
              label={swatch.label}
              src={swatch.src}
              color={swatch.color}
            />
          ))}
        </div>
      )}

      {hasAccordion && (
        <button
          type="button"
          className="product-finish-toggle-btn"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Show Less' : `View All Vinyl Colors (${section.swatches.length})`}</span>
          {isExpanded ? (
            <ChevronUp className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
          )}
        </button>
      )}

      {section.partners?.length > 0 && (
        <div className="product-finish-partner-grid upholstery-partner-grid">
          {section.partners.map((partner) => (
            <article className="product-finish-partner-card upholstery-partner-card" key={partner.name}>
              <img src={partner.logo} alt={`${partner.name} logo`} loading="lazy" />
              <h3>{partner.name}</h3>
              <div className="product-finish-partner-actions upholstery-partner-actions">
                <a href={partner.url} target="_blank" rel="noreferrer" className="btn-outline">
                  Visit
                </a>
                {partner.grades && (
                  <a href={partner.grades} target="_blank" rel="noreferrer" className="btn-outline">
                    Grades
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {section.href && (
        <Link className="product-finish-link" to={section.href}>
          {section.hrefLabel}
        </Link>
      )}
    </article>
  )
}

function ProductFinishModule({ product }) {
  const finishSections = getProductFinishSections(product)
  if (!finishSections.length) return null

  const isTable = isTableBaseOrTopProduct(product)
  const hasFabric = finishSections.some(
    (section) =>
      section.id === 'upholstery' ||
      section.id.startsWith('vinyl-') ||
      section.id === 'leather-straps' ||
      section.id === 'saddle-leather'
  )

  const isFinishesOnly = isTable || !hasFabric
  const sectionTitle = isFinishesOnly ? 'Finishes' : 'Fabrics & Finishes'
  const sectionSubtitle = isFinishesOnly
    ? 'Available finish options for this product'
    : 'Available materials and finish options for this product'

  return (
    <section id="product-finishes" className="related-section product-finishes-section container">
      <h2 className="section-title">{sectionTitle}</h2>
      <p className="section-subtitle">{sectionSubtitle}</p>

      <div className="product-finish-groups">
        {finishSections.map((section) => (
          <ProductFinishGroupCard key={section.id} section={section} />
        ))}
      </div>
    </section>
  )
}

// ── Downloads Section ──────────────────────────────────────────
function DownloadRow({ icon: Icon, href, label, ext, onClick }) {
  if (!href && !onClick) return null

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="product-download-row w-full text-left cursor-pointer"
        aria-label={`Download ${label}`}
      >
        <span className="product-download-icon-wrap">
          <Icon aria-hidden="true" className="product-download-icon" />
        </span>
        <span className="product-download-label">
          {label}
          {ext && <span className="product-download-ext">{ext}</span>}
        </span>
        <span className="product-download-action">
          <Download aria-hidden="true" className="product-download-dl-icon" />
          <span className="product-download-action-text">View PDF</span>
        </span>
      </button>
    )
  }

  return (
    <a
      href={href}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="product-download-row"
      aria-label={`Download ${label}`}
    >
      <span className="product-download-icon-wrap">
        <Icon aria-hidden="true" className="product-download-icon" />
      </span>
      <span className="product-download-label">
        {label}
        {ext && <span className="product-download-ext">{ext}</span>}
      </span>
      <span className="product-download-action">
        <Download aria-hidden="true" className="product-download-dl-icon" />
        <span className="product-download-action-text">Download</span>
      </span>
    </a>
  )
}

function DownloadCategory({ title, icon, items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="product-download-category">
      <h3 className="product-download-category-title">{title}</h3>
      <div className="product-download-rows">
        {items.map((item, i) => {
          const href = item.file?.asset?.url || null
          const filename = item.file?.asset?.originalFilename || item.title
          const extMatch = filename?.match(/\.(\w+)$/i)
          const ext = extMatch ? `.${extMatch[1].toUpperCase()}` : ''
          return (
            <DownloadRow
              key={item._key || (item.file?.asset?._id ? `${item.file.asset._id}-${i}` : `${title}-${i}`)}
              icon={icon}
              href={href}
              label={item.title}
              ext={ext}
            />
          )
        })}
      </div>
    </div>
  )
}

function ProductDownloadsSection({ product, onOpenSpecPdf }) {
  const specSheets = (() => {
    if (!product?.productPdfs?.length) return []
    const seen = new Set()
    return product.productPdfs.filter((pdf) => {
      const href = pdf.file?.asset?.url || (pdf.sourceUrl && !pdf.sourceUrl.includes('aceray.com') ? pdf.sourceUrl : null)
      if (!href) return false
      if (seen.has(href)) return false
      seen.add(href)
      return true
    })
  })()

  const technicalDrawings = product?.technicalDrawings || []
  const files3d = product?.files3d || []
  const zipFiles = product?.zipFiles || []

  return (
    <section id="product-downloads" className="product-downloads-section related-section container" aria-label="Product downloads">
      <h2 className="section-title">Downloads</h2>
      <p className="section-subtitle">Specification sheets, technical drawings, and 3D assets for this product.</p>

      <div className="product-downloads-grid">
        <div className="product-download-category">
          <h3 className="product-download-category-title">Spec Sheets</h3>
          <div className="product-download-rows">
            <DownloadRow
              icon={FileText}
              label={`${product?.title || 'Product'} 2026 Spec Sheet`}
              ext=".PDF"
              onClick={onOpenSpecPdf}
            />
            {specSheets.map((pdf, i) => (
              <DownloadRow
                key={pdf._key || i}
                icon={FileText}
                href={pdf.file?.asset?.url || pdf.sourceUrl}
                label={(pdf.title || `${product?.title} Spec Sheet`)
                  .replace(/\s*PDF\s*File$/i, ' Spec Sheet')
                  .replace(/\s*PDF$/i, ' Spec Sheet')}
                ext=".PDF"
              />
            ))}
          </div>
        </div>

        <DownloadCategory
          title="Technical Drawings"
          icon={Layers}
          items={technicalDrawings}
        />
        <DownloadCategory
          title="3D Files"
          icon={Box}
          items={files3d}
        />
        <DownloadCategory
          title="Archives & Revit"
          icon={Archive}
          items={zipFiles}
        />
      </div>
    </section>
  )
}

function ProductCarousel({ products, label }) {
  const trackRef = useRef(null)

  function scrollTrack(direction) {
    const track = trackRef.current
    if (!track) return

    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.8),
      behavior: 'smooth',
    })
  }

  return (
    <div className="product-carousel" aria-label={label}>
      <div className="product-carousel-controls">
        <button
          type="button"
          className="product-carousel-button"
          onClick={() => scrollTrack(-1)}
          aria-label={`Previous ${label}`}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="product-carousel-button"
          onClick={() => scrollTrack(1)}
          aria-label={`Next ${label}`}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="product-carousel-track" ref={trackRef}>
        {products.map((p) => (
          <ProductCard key={p._id} product={p} className="product-carousel-card" />
        ))}
      </div>
    </div>
  )
}

// ── Pricing Calculator ─────────────────────────────────────────
function ProductPricingCalculator({ product }) {
  const pricing = getProductPricing(product)
  if (!pricing || !pricing.startingPrice) return null

  const tiers = []
  if (pricing.woodSeatPrice) tiers.push({ id: 'WOOD', label: 'Wood Seat', price: pricing.woodSeatPrice })
  if (pricing.comPrice) tiers.push({ id: 'COM', label: 'COM', price: pricing.comPrice })
  if (pricing.colPrice) tiers.push({ id: 'COL', label: 'COL', price: pricing.colPrice })
  if (pricing.grades) {
    Object.entries(pricing.grades).forEach(([grade, price]) => {
      tiers.push({ id: grade, label: `Grade ${grade}`, price })
    })
  }
  if (pricing.leatherPrice) tiers.push({ id: 'LEATHER', label: 'Leather', price: pricing.leatherPrice })

  const validPrices = tiers.map((t) => t.price).filter((p) => typeof p === 'number' && p > 0)
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : pricing.startingPrice

  return (
    <div className="product-pricing-card">
      <div className="pricing-header-row">
        <span className="pricing-eyebrow">List Price Starting At</span>
        <div className="pricing-display-amount">
          {formatPrice(minPrice)}
        </div>
      </div>

      {tiers.length > 1 && (
        <div className="pricing-tiers-section">
          <div className="pricing-tiers-grid">
            {tiers.map((tier) => (
              <div key={tier.id} className="pricing-tier-chip">
                <span className="tier-name">{tier.label}</span>
                <span className="tier-cost">{formatPrice(tier.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pricing.yds && (
        <p className="pricing-yardage-note">
          <strong>Fabric Requirement:</strong> {pricing.yds} YDS (based on 54" plain fabric)
        </p>
      )}
    </div>
  )
}

function parseDescriptionBlocks(text) {
  if (!text || typeof text !== 'string') return []
  const rawParagraphs = text.split(/\r?\n\s*\r?\n/)
  const blocks = []

  const isBulletLine = (line) => /^[-•–*]\s*/.test(line)
  const isListHeader = (line) => /:\s*$/.test(line) || /^(available in|edges|options|finishes|sizes)/i.test(line)

  for (const rawP of rawParagraphs) {
    const lines = rawP
      .split(/\r?\n/)
      .map((l) => l.replace(/&nbsp;/g, ' ').trim())
      .filter(Boolean)

    if (lines.length === 0) continue

    let currentListBlock = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const nextLine = lines[i + 1]

      if (isBulletLine(line)) {
        currentListBlock.push(line)
      } else if (isListHeader(line) && nextLine && isBulletLine(nextLine)) {
        if (currentListBlock.length > 0) {
          blocks.push(currentListBlock.join('\n'))
          currentListBlock = []
        }
        currentListBlock.push(line)
      } else {
        if (currentListBlock.length > 0) {
          blocks.push(currentListBlock.join('\n'))
          currentListBlock = []
        }
        blocks.push(line)
      }
    }

    if (currentListBlock.length > 0) {
      blocks.push(currentListBlock.join('\n'))
    }
  }

  return blocks
}

// ── Main Page ─────────────────────────────────────────────────
function ProductPage() {
  const [searchParams] = useSearchParams()
  const routeParams = useParams()
  const rawSlug = routeParams.slug || searchParams.get('slug') || ''
  const slug = decodeURIComponent(rawSlug).trim()

  const [product, setProduct] = useState(null)
  const [collectionFamily, setCollectionFamily] = useState('')
  const [collectionProducts, setCollectionProducts] = useState([])
  const [related, setRelated] = useState([])
  const [relatedSubtitle, setRelatedSubtitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showSpecPdf, setShowSpecPdf] = useState(false)

  useEffect(() => {
    const paramSlug = searchParams.get('slug') || searchParams.get('id')
    if (paramSlug && slug) {
      window.history.replaceState(null, '', `/product/${encodeURIComponent(slug)}`)
    }
  }, [searchParams, slug])

  useEffect(() => {
    if (!slug) { setError(true); setLoading(false); return }

    setLoading(true)
    setError(false)

    sanityFetch(PRODUCT_QUERY, { slug })
      .then((p) => {
        if (!p) { setError(true); return }
        setProduct(p)
        setCollectionProducts([])
        setRelated([])
        setRelatedSubtitle('')

        const enrichedTitle = getEnrichedProductTitle(p.title, p.categories)
        const productImage = p.imageUrl || (p.mainImage?.asset?.url ? `${p.mainImage.asset.url}?auto=format&w=1200` : '')
        const productDescription = `${enrichedTitle} designed by ${p.designer || 'Aceray'}. Explore commercial specifications, CAD dimensions, finish options, and hospitality photography.`

        removeSeoJsonLd('page-jsonld')
        setSeoMetadata({
          title: `${enrichedTitle} - ${p.designer ? `${p.designer} | ` : ''}Aceray Commercial Furniture`,
          description: productDescription,
          path: `/product/${slug}`,
          image: productImage || undefined,
          type: 'product',
          jsonLdId: 'product-jsonld',
          jsonLd: {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Product',
                name: enrichedTitle,
                sku: slug,
                mpn: p.title,
                image: productImage,
                description: p.description || `${enrichedTitle} commercial contract seating furniture by Aceray.`,
                brand: {
                  '@type': 'Brand',
                  name: 'Aceray',
                },
                designer: p.designer ? { '@type': 'Person', name: p.designer } : undefined,
                category: p.categories?.[0] || 'Commercial Furniture',
                material: p.tags?.length ? p.tags.join(', ') : 'Kiln-dried European hardwood, contract upholstery, precision metal',
                ...(p.overallWidth ? { width: { '@type': 'QuantitativeValue', value: parseFloat(p.overallWidth), unitText: 'in' } } : {}),
                ...(p.overallHeight ? { height: { '@type': 'QuantitativeValue', value: parseFloat(p.overallHeight), unitText: 'in' } } : {}),
                ...(p.overallDepth ? { depth: { '@type': 'QuantitativeValue', value: parseFloat(p.overallDepth), unitText: 'in' } } : {}),
                ...(p.weight ? { weight: { '@type': 'QuantitativeValue', value: parseFloat(p.weight), unitText: 'lbs' } } : {}),
                additionalProperty: [
                  p.seatHeight ? { '@type': 'PropertyValue', name: 'Seat Height', value: p.seatHeight } : null,
                  p.com ? { '@type': 'PropertyValue', name: 'COM Requirement', value: p.com } : null,
                  p.stacking ? { '@type': 'PropertyValue', name: 'Stacking Capacity', value: p.stacking } : null,
                  p.madeIn ? { '@type': 'PropertyValue', name: 'Country of Origin', value: p.madeIn } : null,
                  { '@type': 'PropertyValue', name: 'Compliance', value: 'CAL 133 / Commercial Grade Seating' },
                ].filter(Boolean),
                priceRange: '$$ - $$$ (Trade Pricing on Request)',
                audience: {
                  '@type': 'Audience',
                  audienceType: 'Commercial & Hospitality Interior Designers',
                },
                manufacturer: {
                  '@type': 'Organization',
                  name: 'Aceray',
                  url: 'https://aceray.com',
                },
                offers: {
                  '@type': 'AggregateOffer',
                  priceCurrency: 'USD',
                  priceRange: '$$ - $$$ (Trade Quote Required)',
                  lowPrice: '100',
                  highPrice: '1500',
                  offerCount: '1',
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  url: `https://aceray.com/contact?subject=${encodeURIComponent(`Quote Request: ${enrichedTitle}`)}`,
                  seller: {
                    '@type': 'Organization',
                    name: 'Aceray',
                    url: 'https://aceray.com',
                  },
                },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://aceray.com/',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Catalog',
                    item: 'https://aceray.com/catalog',
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: p.categories?.[0] || 'Products',
                    item: `https://aceray.com/catalog?cat=${encodeURIComponent((p.categories?.[0] || 'products').toLowerCase())}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 4,
                    name: p.title,
                    item: `https://aceray.com/product/${slug}`,
                  },
                ],
              },
            ],
          },
        })

        const family = getCollectionFamily(p)
        setCollectionFamily(family)
        const loadFamilyFallback = () => {
          if (!family) {
            setCollectionProducts([])
            return
          }

          sanityFetch(COLLECTION_FAMILY_QUERY, { slug, family })
            .then(setCollectionProducts)
            .catch(() => setCollectionProducts([]))
        }
        const loadIntentFallback = () => {
          if (!getRelatedCategory(p.categories, family)) {
            setRelated([])
            setRelatedSubtitle('')
            return
          }

          sanityFetch(RELATED_CANDIDATES_QUERY, {
            slug,
            family,
            categories: p.categories || [],
            tags: p.tags || [],
            designer: p.designer || '',
          })
            .then((candidates) => {
              setRelated(getIntentRelatedProducts(p, candidates, family))
              setRelatedSubtitle(getRelatedSubtitle(p, family))
            })
            .catch(() => {
              setRelated([])
              setRelatedSubtitle('')
            })
        }

        const curatedCollectionProducts = getResolvedCuratedProducts(p, 'fromThisCollection')
        const curatedCollectionSlugs = getStaticCuratedSlugs(p, 'fromThisCollection')
        const curatedRelatedProducts = getResolvedCuratedProducts(p, 'youMayAlsoLike')
        const curatedRelatedSlugs = getStaticCuratedSlugs(p, 'youMayAlsoLike')

        if (curatedCollectionProducts.length) {
          setCollectionProducts(curatedCollectionProducts.slice(0, COLLECTION_CAROUSEL_LIMIT))
        } else if (curatedCollectionSlugs.length) {
          sanityFetch(CURATED_PRODUCTS_BY_SLUG_QUERY, { slugs: curatedCollectionSlugs })
            .then((products) => {
              const ordered = orderProductsBySlug(products, curatedCollectionSlugs).slice(0, COLLECTION_CAROUSEL_LIMIT)
              if (ordered.length) {
                setCollectionProducts(ordered)
              } else {
                loadFamilyFallback()
              }
            })
            .catch(loadFamilyFallback)
        } else {
          loadFamilyFallback()
        }

        if (curatedRelatedProducts.length) {
          setRelated(curatedRelatedProducts.slice(0, RELATED_CAROUSEL_LIMIT))
          setRelatedSubtitle('Curated pieces selected to pair with this product')
        } else if (curatedRelatedSlugs.length) {
          sanityFetch(CURATED_PRODUCTS_BY_SLUG_QUERY, { slugs: curatedRelatedSlugs })
            .then((products) => {
              const ordered = orderProductsBySlug(products, curatedRelatedSlugs).slice(0, RELATED_CAROUSEL_LIMIT)
              if (ordered.length) {
                setRelated(ordered)
                setRelatedSubtitle('Curated pieces selected to pair with this product')
              } else {
                loadIntentFallback()
              }
            })
            .catch(loadIntentFallback)
        } else {
          loadIntentFallback()
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    setIsFavorite(isFavoriteProduct(slug))

    function handleFavoritesChange() {
      setIsFavorite(isFavoriteProduct(slug))
    }

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange)
    window.addEventListener('storage', handleFavoritesChange)
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange)
      window.removeEventListener('storage', handleFavoritesChange)
    }
  }, [slug])

  function handleFavoriteClick() {
    setIsFavorite(toggleFavoriteProduct(slug))
  }

  if (loading) return <ProductSkeleton />

  if (error || !product) {
    return (
      <div className="product-error">
        <section className="container product-error-container">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/catalog">Browse All Products</Link>
        </section>
      </div>
    )
  }

  const getSanityUrl = (image) => {
    if (!image) return null
    if (typeof image === 'string') return image.includes('aceray.com') ? null : image
    if (image.asset?.url) return image.asset.url
    if (image.asset?._ref) return urlFor(image).url()
    return null
  }
  const images = [product.mainImage, ...(product.gallery || [])]
    .map(getSanityUrl)
    .filter(Boolean)
  if (images.length === 0 && product.imageUrl && !product.imageUrl.includes('aceray.com')) {
    images.push(product.imageUrl)
  }
  const formatDimValue = (val) => {
    if (!val) return ''
    const cleaned = String(val).trim().replace(/"+$/g, '').trim()
    return cleaned ? `${cleaned}"` : ''
  }

  const displayCategories = getProductDisplayCategories(product)
  const firstCat = displayCategories[0] || product.categories?.[0] || ''
  const enrichedTitle = getEnrichedProductTitle(product.title, product.categories)
  const dimsParts = [
    product.overallHeight && `${formatDimValue(product.overallHeight)} H`,
    product.overallDepth && `${formatDimValue(product.overallDepth)} D`,
    product.overallWidth && `${formatDimValue(product.overallWidth)} W`,
  ].filter(Boolean)
  const dimsLabel = dimsParts.length > 0 ? dimsParts.join(' × ') : null
  const finishSections = getProductFinishSections(product)

  return (
    <div className="product-page">
      {/* Sticky Section Jump Navigation */}
      <ProductStickyNav
        product={product}
        hasFinishes={finishSections.length > 0}
        hasDownloads={true}
        hasCollection={collectionProducts.length > 0}
        hasRelated={related.length > 0}
        onOpenSpecPdf={() => setShowSpecPdf(true)}
      />

      {/* Breadcrumb & Actions Bar */}
      <div className="breadcrumb-nav container">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/catalog">Products</Link></BreadcrumbLink>
            </BreadcrumbItem>
            {firstCat && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/catalog?cat=${encodeURIComponent(firstCat.toLowerCase())}`}>{firstCat}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{enrichedTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <button
          type="button"
          className={`product-detail-favorite ${isFavorite ? 'product-detail-favorite-active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={`${isFavorite ? 'Remove' : 'Add'} ${enrichedTitle} ${isFavorite ? 'from' : 'to'} favorites`}
          aria-pressed={isFavorite}
        >
          <Heart aria-hidden="true" />
          <span>{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Product Layout */}
      <section id="product-overview" className="container product-page-container">
        <div className="product-layout grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">

          {/* Gallery */}
          <div className="product-gallery lg:col-span-8">
            <Gallery images={images} title={enrichedTitle} designer={product.designer} />
          </div>

          {/* Info */}
          <div className="product-info lg:col-span-4 flex flex-col gap-6">
            {/* Title */}
            <div className="product-detail-header">
              <h1 className="product-detail-title">
                <span className="product-detail-name">{product.title}</span>
                {getCategorySuffix(product.title, product.categories) && (
                  <span className="product-detail-category-suffix">
                    {getCategorySuffix(product.title, product.categories)}
                  </span>
                )}
              </h1>
            </div>



            {product.designer && (
              <p className="product-detail-meta">
                <span>
                  Design:{' '}
                  <Link
                    to={`/designers/${getDesignerSlug(product.designer)}`}
                    className="product-designer-link"
                  >
                    {normalizeDesignerName(product.designer)}
                  </Link>
                </span>
              </p>
            )}

            <ProductPricingCalculator product={product} />

            <hr className="product-divider" />

            {product.description && (
              <div>
                <div className="product-description">
                  {parseDescriptionBlocks(product.description).map((block, idx) => (
                    <p key={idx}>{block}</p>
                  ))}
                </div>
                <hr className="product-divider" />
              </div>
            )}

            <div id="product-specs" className="product-detail-stack">
              <div>
                <h2 className="product-specs-title">Specifications</h2>
                <dl className="product-specs-list">
                  <SpecRow label="Overall Dimensions" value={dimsLabel} />
                  <SpecRow label="Seat Height" value={product.seatHeight ? formatDimValue(product.seatHeight) : null} />
                  <SpecRow label="Weight" value={product.weight ? `${product.weight} lbs` : null} />
                  <SpecRow label="COM" value={product.com ? `${product.com} yards` : null} />
                  <SpecRow label="Stacking" value={product.stacking} />
                  <SpecRow
                    label="Designer"
                    value={
                      product.designer ? (
                        <Link
                          to={`/designers/${getDesignerSlug(product.designer)}`}
                          className="product-designer-link"
                        >
                          {normalizeDesignerName(product.designer)}
                        </Link>
                      ) : null
                    }
                  />
                  <SpecRow label="Made In" value={product.madeIn} />
                </dl>
              </div>

              <div className="product-cta">
                <Link
                  to={`/contact?intent=quote&product=${encodeURIComponent(enrichedTitle)}&slug=${encodeURIComponent(product.slug?.current || slug)}`}
                  className="btn-primary product-cta-btn"
                >
                  Request Quote / Trade Info
                </Link>
                <button
                  type="button"
                  className="btn-outline product-cta-btn"
                  onClick={() => setShowSpecPdf(true)}
                >
                  <FileText className="size-4 mr-2" aria-hidden="true" />
                  Download Spec Sheet PDF
                </button>
                {(product.productPdfs?.length > 0 || product.technicalDrawings?.length > 0 || product.files3d?.length > 0 || product.zipFiles?.length > 0) && (
                  <a
                    href="#product-downloads"
                    className="btn-outline product-cta-btn"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('product-downloads')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <Download className="size-4 mr-2" aria-hidden="true" />
                    View Downloads
                  </a>
                )}
                <p className="product-cta-note text-center">
                  Trade pricing available for design professionals. Contact us for COM/COL options.
                </p>
              </div>
            </div>

            {/* Category pills */}
            {displayCategories.length > 0 && (
              <div className="product-cat-pills">
                {displayCategories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/catalog?cat=${encodeURIComponent(cat.toLowerCase())}`}
                    className="cat-pill"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Collection */}
      {collectionProducts.length > 0 && (
        <section id="product-collection" className="related-section collection-family-section container">
          <h2 className="section-title">From This Collection</h2>
          <p className="section-subtitle">
            <Link className="collection-family-link" to={`/collections/${getFamilySlug(collectionFamily)}`}>
              {collectionFamily} Collection
            </Link>
          </p>
          <ProductCarousel products={collectionProducts} label="collection products" />
        </section>
      )}

      {/* Fabrics & Finishes */}
      <ProductFinishModule product={product} />

      {/* Downloads Section */}
      <ProductDownloadsSection product={product} onOpenSpecPdf={() => setShowSpecPdf(true)} />

      {/* Related */}
      {related.length > 0 && (
        <section id="product-related" className="related-section container">
          <h2 className="section-title">You May Also Like</h2>
          <p className="section-subtitle">{relatedSubtitle}</p>
          <ProductCarousel products={related} label="related products" />
        </section>
      )}

      {/* Spec Sheet PDF Modal */}
      <ProductSpecSheetPDF
        product={product}
        isOpen={showSpecPdf}
        onClose={() => setShowSpecPdf(false)}
      />
    </div>
  )
}

export default function ProductPageWrapper(props) {
  return (
    <ProductPageErrorBoundary>
      <ProductPage {...props} />
    </ProductPageErrorBoundary>
  )
}
