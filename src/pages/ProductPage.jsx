import { useEffect, useState } from 'react'
import { useSearchParams, useParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
import { FullscreenImageViewer } from '@/components/FullscreenImageViewer'


// ── GROQ ─────────────────────────────────────────────────────
const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id, title, slug, designer, madeIn, categories, tags,
  imageUrl, galleryUrls, description,
  overallHeight, overallWidth, overallDepth, seatHeight, weight, com, stacking,
  "mainImage": mainImage{asset->{_id, url}},
  "gallery": gallery[]{asset->{_id, url}}
}`

const RELATED_QUERY = `*[_type == "product" && slug.current != $slug && defined(imageUrl) && $cat in categories] | order(_updatedAt desc) [0..3] {
  _id, title, slug, imageUrl, categories, mainImage{asset->{_id, url}}
}`

// ── Skeleton Loading ──────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-square rounded-sm" />
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex gap-2">
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
    <div className="flex flex-col gap-3">
      {/* Main image — click to open fullscreen gallery */}
      <div
        className="product-main-image-wrap cursor-zoom-in"
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



// ── Main Page ─────────────────────────────────────────────────
export default function ProductPage() {
  const [searchParams] = useSearchParams()
  const routeParams = useParams()
  const slug = routeParams.slug || searchParams.get('slug')

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) { setError(true); setLoading(false); return }

    setLoading(true)
    setError(false)

    sanityFetch(PRODUCT_QUERY, { slug })
      .then((p) => {
        if (!p) { setError(true); return }
        setProduct(p)

        // Update page title
        document.title = `${p.title} – Aceray | Premium Commercial Seating`

        // Fetch related non-blocking
        const cat = p.categories?.[0]
        if (cat) {
          sanityFetch(RELATED_QUERY, { slug, cat })
            .then(setRelated)
            .catch(() => {})
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <ProductSkeleton />

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-8">
        <h1 className="text-2xl font-medium tracking-wide">Product not found</h1>
        <p className="text-[#767676] text-sm">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="bg-[#718f80] hover:bg-[#5a6e5e] text-white mt-2">
          <Link to="/catalog">Browse All Products</Link>
        </Button>
      </div>
    )
  }

  const getSanityUrl = (image) => image ? urlFor(image).url() : null
const images = [product.mainImage, ...(product.gallery || [])]
  .map(getSanityUrl)
  .filter(Boolean)
// legacy fallback for any missing assets
const legacyImage = product.imageUrl
  const firstCat = product.categories?.[0] || ''
  const dimsLabel = product.overallHeight && product.overallWidth && product.overallDepth
    ? `${product.overallHeight}" H × ${product.overallWidth}" W × ${product.overallDepth}" D`
    : null

  return (
    <div>
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
      <section className="container">
        <div className="product-layout">

          {/* Gallery */}
          <div className="product-gallery">
            <Gallery images={images} title={product.title} designer={product.designer} />
          </div>

          {/* Info */}
          <div className="product-info">
            {/* Category pills */}
            {product.categories?.length > 0 && (
              <div className="product-cat-pills">
                {product.categories.slice(0, 4).map((cat) => (
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

            {/* Title */}
            <h1 className="product-detail-title">
              {product.title}
            </h1>

            <p className="product-detail-designer">
              {product.designer && `Design: ${product.designer}`}
            </p>
            <p className="product-detail-madein">
              {product.madeIn && `Made in ${product.madeIn}`}
            </p>

            <hr className="product-divider" />

            {product.description && (
              <div>
                <p className="product-description">
                  {product.description}
                </p>
                <hr className="product-divider" />
              </div>
            )}

            <div className="space-y-6">
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
                <p className="product-cta-note text-center">
                  Trade pricing available for design professionals. Contact us for COM/COL options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="related-section container">
          <h2 className="text-center text-2xl font-light tracking-[0.06em] text-[#222] mb-2">You May Also Like</h2>
          <p className="text-center text-sm text-[#767676] mb-10">More pieces from the same collection</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
