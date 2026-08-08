import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, FileText } from 'lucide-react'
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
import { sanityFetch } from '@/sanityClient'
import { urlFor } from '@/lib/sanityImageUrl'
import { getCollectionFamily, getFamilySlug, normalizeCategory } from '@/lib/productFamilies'
import { FAVORITES_CHANGED_EVENT, isFavoriteProduct, toggleFavoriteProduct } from '@/lib/favorites'
import { FullscreenImageViewer } from '@/components/FullscreenImageViewer'
import { CATEGORIES } from '@/constants'
import curatedProductRelationships from '@/data/curatedProductRelationships.json'
import {
  NOTE as FINISH_NOTE,
  TABLE_BASE_FINISHES,
  UPHOLSTERY_PARTNERS,
  VINYL_GROUPS,
  WOOD_FINISHES,
} from '@/pages/FabricsFinishesPage'


// ── GROQ ─────────────────────────────────────────────────────
const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id, title, slug, designer, madeIn, categories, tags,
  imageUrl, galleryUrls, description,
  overallHeight, overallWidth, overallDepth, seatHeight, weight, com, stacking,
  "mainImage": mainImage{asset->{_id, url}},
  "gallery": gallery[]{asset->{_id, url}},
  productPdfs[]{title, sourceUrl, file{asset->{_id, url, originalFilename}}}
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

function getProductFinishSections(product) {
  const sections = []
  const text = getProductFinishText(product)

  if (/leather straps? available in black,\s*dark brown or natural/i.test(text)) {
    sections.push({
      id: 'leather-straps',
      title: 'Leather Strap Colors',
      subtitle: 'Available in Black, Dark Brown, or Natural.',
      swatches: LEATHER_STRAP_COLORS,
    })
  }

  if (/saddle leather colors/i.test(text)) {
    sections.push({
      id: 'saddle-leather',
      title: 'Saddle Leather Colors',
      subtitle: 'Available in Cream, Black, Tobacco, or Espresso.',
      swatches: SADDLE_LEATHER_COLORS,
    })
  }

  if (hasFinishSignal(product, /\bwood\b|beech|ash|stains?|wood finishes?|custom stains?|custom wood/i)) {
    sections.push({
      id: 'wood-finishes',
      title: 'Wood Finishes',
      subtitle: 'Aceray standard wood stains or custom match finishes.',
      swatches: WOOD_FINISHES.slice(0, PRODUCT_FINISH_LIMITS.wood).map(([label, src]) => ({ label, src })),
      href: '/fabrics-finishes#wood-finishes',
      hrefLabel: 'View all wood finishes',
    })
  }

  if (hasFinishSignal(product, /\bCOM\b|\bCOL\b|graded[- ]?in|upholster|fabric/i)) {
    sections.push({
      id: 'upholstery',
      title: 'Upholstery',
      subtitle: 'COM, COL, or Aceray graded-in upholstery resources.',
      partners: UPHOLSTERY_PARTNERS.slice(0, PRODUCT_FINISH_LIMITS.upholsteryPartners),
      href: '/fabrics-finishes#upholstery',
      hrefLabel: 'View upholstery partners',
    })
  }

  getMatchedVinylGroups(product).forEach((group) => {
    sections.push({
      id: `vinyl-${normalizeCategory(group.title)}`,
      title: `${group.title} Vinyl`,
      subtitle: group.grade,
      swatches: group.colors
        .slice(0, PRODUCT_FINISH_LIMITS.vinylColors)
        .map(([label, src]) => ({ label, src })),
      href: '/fabrics-finishes#vinyl',
      hrefLabel: 'View vinyl colors',
    })
  })

  const tableBaseFinishes = getTableBaseFinishMatches(product)
  if (tableBaseFinishes.length) {
    sections.push({
      id: 'metal-finishes',
      title: /leg protectors/i.test(text) ? 'Leg Protector Finish' : 'Metal Finishes',
      subtitle: /leg protectors/i.test(text) ? 'Optional brushed stainless steel leg protectors.' : 'Aceray table base and metal finish options.',
      swatches: tableBaseFinishes.map(([label, src]) => ({ label, src })),
      href: '/fabrics-finishes#table-bases',
      hrefLabel: 'View metal finishes',
    })
  }

  return sections
}

// ── Skeleton Loading ──────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="product-skeleton-page">
      <div className="container product-skeleton-layout">
        <Skeleton className="aspect-square rounded-sm" />
        <div className="product-skeleton-copy">
          <div className="product-skeleton-pills">
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

// ── Image Gallery (inline on product page) ──────────────────────
function Gallery({ images, title, designer }) {
  const [active, setActive] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)

  if (!images.length) return null

  return (
    <div className="product-gallery-stack">
      {/* Main image — click to open fullscreen gallery */}
      <div
        className="product-main-image-wrap product-main-image-wrap-clickable"
        onClick={() => setFullscreenOpen(true)}
      >
        <img
          src={images[active]}
          alt={title}
          className="product-main-img"
          key={active}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="product-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`product-thumb-btn ${i === active ? 'active' : ''}`}
            >
              <img src={src} alt={`${title} view ${i + 1}`} loading="lazy" />
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
      {src ? (
        <img className="product-finish-swatch" src={src} alt={`${label} finish swatch`} loading="lazy" />
      ) : (
        <span className="product-finish-color" style={{ backgroundColor: color }} aria-hidden="true" />
      )}
      <h4>{label}</h4>
    </article>
  )
}

function ProductFinishModule({ product }) {
  const finishSections = getProductFinishSections(product)

  if (!finishSections.length) return null

  return (
    <section className="related-section product-finishes-section container">
      <h2 className="section-title">Fabrics &amp; Finishes</h2>
      <p className="section-subtitle">Available materials and finish options for this product</p>

      <div className="product-finish-groups">
        {finishSections.map((section) => (
          <article className="product-finish-group" key={section.id}>
            <div className="product-finish-group-heading">
              <h3>{section.title}</h3>
              <p>{section.subtitle || FINISH_NOTE}</p>
            </div>

            {section.swatches?.length > 0 && (
              <div className="product-finish-swatch-grid">
                {section.swatches.map((swatch) => (
                  <ProductFinishSwatch
                    key={`${section.id}-${swatch.label}`}
                    label={swatch.label}
                    src={swatch.src}
                    color={swatch.color}
                  />
                ))}
              </div>
            )}

            {section.partners?.length > 0 && (
              <div className="product-finish-partner-grid">
                {section.partners.map((partner) => (
                  <a
                    className="product-finish-partner-card"
                    href={partner.url}
                    target="_blank"
                    rel="noreferrer"
                    key={partner.name}
                  >
                    <img src={partner.logo} alt={`${partner.name} logo`} loading="lazy" />
                    <span>{partner.name}</span>
                  </a>
                ))}
              </div>
            )}

            {section.href && (
              <Link className="product-finish-link" to={section.href}>
                {section.hrefLabel}
              </Link>
            )}
          </article>
        ))}
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

// ── Main Page ─────────────────────────────────────────────────
export default function ProductPage() {
  const [searchParams] = useSearchParams()
  const routeParams = useParams()
  const slug = routeParams.slug || searchParams.get('slug')

  const [product, setProduct] = useState(null)
  const [collectionFamily, setCollectionFamily] = useState('')
  const [collectionProducts, setCollectionProducts] = useState([])
  const [related, setRelated] = useState([])
  const [relatedSubtitle, setRelatedSubtitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

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

        // Update page title
        document.title = `${p.title} – Aceray | Premium Commercial Seating`

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
          <h1>Product not found</h1>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/catalog">Browse All Products</Link>
        </section>
      </div>
    )
  }

  const getSanityUrl = (image) => image ? urlFor(image).url() : null
  const images = [product.mainImage, ...(product.gallery || [])]
    .map(getSanityUrl)
    .filter(Boolean)
  // legacy fallback for any missing assets
  const legacyImage = product.imageUrl
  const displayCategories = getProductDisplayCategories(product)
  const firstCat = displayCategories[0] || product.categories?.[0] || ''
  const dimsLabel = product.overallHeight && product.overallWidth && product.overallDepth
    ? `${product.overallHeight}" H × ${product.overallWidth}" W × ${product.overallDepth}" D`
    : null

  return (
    <div className="product-page">
      {/* Breadcrumb */}
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
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product Layout */}
      <section className="container product-page-container">
        <div className="product-layout">

          {/* Gallery */}
          <div className="product-gallery">
            <Gallery images={images} title={product.title} designer={product.designer} />
          </div>

          {/* Info */}
          <div className="product-info">
            {/* Title */}
            <div className="product-detail-header">
              <h1 className="product-detail-title">
                {product.title}
              </h1>
              <button
                type="button"
                className={`product-detail-favorite ${isFavorite ? 'product-detail-favorite-active' : ''}`}
                onClick={handleFavoriteClick}
                aria-label={`${isFavorite ? 'Remove' : 'Add'} ${product.title || 'product'} ${isFavorite ? 'from' : 'to'} favorites`}
                aria-pressed={isFavorite}
              >
                <Heart aria-hidden="true" />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {(product.designer || product.madeIn) && (
              <p className="product-detail-meta">
                {product.designer && (
                  <span>Design: {product.designer}</span>
                )}
                {product.designer && product.madeIn && (
                  <span className="product-detail-meta-separator" aria-hidden="true">|</span>
                )}
                {product.madeIn && (
                  <span className="product-detail-madein">Made in {product.madeIn}</span>
                )}
              </p>
            )}

            <hr className="product-divider" />

            {product.description && (
              <div>
                <p className="product-description">
                  {product.description}
                </p>
                <hr className="product-divider" />
              </div>
            )}

            <div className="product-detail-stack">
              <div>
                <h2 className="product-specs-title">Specifications</h2>
                <dl className="product-specs-list">
                  <SpecRow label="Overall Dimensions" value={dimsLabel} />
                  <SpecRow label="Seat Height" value={product.seatHeight ? `${product.seatHeight}"` : null} />
                  <SpecRow label="Weight" value={product.weight ? `${product.weight} lbs` : null} />
                  <SpecRow label="COM" value={product.com ? `${product.com} yards` : null} />
                  <SpecRow label="Stacking" value={product.stacking} />
                  <SpecRow label="Designer" value={product.designer} />
                  <SpecRow label="Made In" value={product.madeIn} />
                </dl>
              </div>

              <div className="product-cta">
                <Link to="/contact" className="btn-primary product-cta-btn">
                  Request Quote / Trade Info
                </Link>
                {product.productPdfs?.length > 0 && (
                  <div className="product-pdf-links" aria-label="Product PDF files">
                    {product.productPdfs.map((pdf) => {
                      const href = pdf.file?.asset?.url || pdf.sourceUrl
                      if (!href) return null
                      return (
                        <Button
                          key={pdf.sourceUrl || pdf.file?.asset?._id || pdf.title}
                          asChild
                          variant="outline"
                          className="btn-outline w-full"
                        >
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FileText className="mr-2 h-4.5 w-4.5 shrink-0" />
                            {pdf.title || 'PDF File'}
                          </a>
                        </Button>
                      )
                    })}
                  </div>
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
        <section className="related-section collection-family-section container">
          <h2 className="section-title">From This Collection</h2>
          <p className="section-subtitle">
            <Link className="collection-family-link" to={`/collections/${getFamilySlug(collectionFamily)}`}>
              {collectionFamily} Collection
            </Link>
          </p>
          <ProductCarousel products={collectionProducts} label="collection products" />
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="related-section container">
          <h2 className="section-title">You May Also Like</h2>
          <p className="section-subtitle">{relatedSubtitle}</p>
          <ProductCarousel products={related} label="related products" />
        </section>
      )}

      <ProductFinishModule product={product} />
    </div>
  )
}
