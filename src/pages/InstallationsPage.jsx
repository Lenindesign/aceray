import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, ArrowRight, ExternalLink, Sparkles, Filter, X } from 'lucide-react'
import { sanityFetch } from '@/sanityClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

// Pre-loader cache for instant seamless image rendering without layout shifts
const preloadedUrls = new Set()

function InstallationImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(() => preloadedUrls.has(src))

  useEffect(() => {
    if (!src || loaded) return
    let active = true
    const img = new Image()
    img.src = src
    if (img.complete) {
      preloadedUrls.add(src)
      setLoaded(true)
    } else {
      img.onload = () => {
        if (active) {
          preloadedUrls.add(src)
          setLoaded(true)
        }
      }
    }
    return () => {
      active = false
    }
  }, [src, loaded])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 bg-[#e5e4de] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => {
          preloadedUrls.add(src)
          setLoaded(true)
        }}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-out`}
      />
    </div>
  )
}

// Comprehensive list of studio cutouts, line drawings, wire diagrams, dimensions, swatches, and spec sheets to block
const EXCLUDED_SPEC_PATTERNS = [
  /dimension/i, /dimensions/i, /dim[-_]?\d/i, /wire/i, /line[-_]?drawing/i,
  /drawing/i, /drawings/i, /tech/i, /technical/i, /diagram/i, /diagrams/i,
  /schema/i, /schematic/i, /cad/i, /revit/i, /3d/i, /dwg/i, /dxf/i, /vector/i,
  /pole/i, /poles/i, /table[-_]?base/i, /table[-_]?poles/i, /bar[-_]?height/i,
  /seat[-_]?color/i, /color/i, /colors/i, /swatch/i, /swatches/i,
  /finish/i, /finishes/i, /material/i, /materials/i, /palette/i,
  /cutout/i, /white[-_]?bg/i, /isolated/i, /frontview/i, /backview/i,
  /sideview/i, /topview/i, /profile/i, /option/i,
  /options/i, /overview/i, /measurement/i, /measurements/i, /lbs/i, /inches/i,
  /size/i, /sizes/i, /spec/i, /specs/i, /specification/i, /specifications/i,
  /armchair/i, /stacking/i, /side-chair/i, /chair-blk/i, /rts/i, /shell/i, /technopolymer/i,
  /studio/i, /render/i, /family/i, /lineup/i, /horizontal/i, /main/i,
  /ambient[e]?/i, /web[-_]?jpg/i,
  /[-_]back\./i, /[-_]front\./i, /[-_]side\./i
]

function isSpecOrLineDrawingOrStudioAsset(assetObj) {
  if (!assetObj) return true
  const strToTest = [
    assetObj.originalFilename,
    assetObj.title,
    assetObj.altText,
    assetObj.url ? assetObj.url.split('/').pop() : ''
  ].filter(Boolean).join(' ')

  if (!strToTest) return false
  return EXCLUDED_SPEC_PATTERNS.some((pattern) => pattern.test(strToTest))
}

// Installation project indicators (hotels, resorts, restaurants, state codes, install keyword)
const INSTALLATION_INDICATORS = [
  /hotel/i, /resort/i, /restaurant/i, /suites/i, /inn/i, /lodge/i, /casino/i,
  /bistro/i, /cafe/i, /spa/i, /hospitality/i,
  /install/i, /project/i, /marriott/i, /hilton/i, /hyatt/i, /omni/i, /westin/i,
  /sheraton/i, /intercontinental/i, /fairmont/i, /wyndham/i, /radisson/i, /loews/i,
  /kimpton/i, /edition/i, /ritz/i, /st-regis/i, /four-seasons/i,
  /[-_]([A-Z]{2})\.(jpg|jpeg|png|webp)/i, // e.g. -CA.jpg, -FL.jpg, -NY.jpg, -IL.jpg
  /[-_](chicago|los-angeles|san-diego|las-vegas|miami|new-york|boston|dallas|austin|denver|seattle|atlanta|nashville|orlando)/i
]

function isVerifiedInstallationAsset(assetObj) {
  if (!assetObj || !assetObj.url) return false
  if (isSpecOrLineDrawingOrStudioAsset(assetObj)) return false

  const strToTest = [
    assetObj.originalFilename,
    assetObj.title,
    assetObj.altText,
    assetObj.url.split('/').pop()
  ].filter(Boolean).join(' ')

  const hasInstallIndicator = INSTALLATION_INDICATORS.some((pat) => pat.test(strToTest))
  return hasInstallIndicator
}

// Helper to format clean project name from image filename or product title
function formatProjectName(url, originalFilename, productTitle) {
  const filename = originalFilename || url?.split('/').pop() || ''
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')

  // Filter out hex hashes or dimension strings like 1200x1200
  if (/^[a-f0-9]{16,}/i.test(nameWithoutExt) || /\d{3,4}x\d{3,4}/i.test(nameWithoutExt)) {
    return `${productTitle} Hospitality Project`
  }

  // Remove generic suffixes or clean hyphenated names
  let cleaned = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b(frontview|backview|sideview|topview|highres|scaled|jpg|png|webp|1200x1200|800x800)\b/gi, '')
    .trim()

  // If filename is just the product name, raw hash, or very short, use formatted product name
  if (cleaned.toUpperCase() === productTitle.toUpperCase() || cleaned.length < 3 || /^[a-f0-9]+$/i.test(cleaned)) {
    return `${productTitle} Hospitality Project`
  }

  // Capitalize words
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const CATEGORY_FILTERS = ['All', 'Chairs & Armchairs', 'Barstools & Stools', 'Lounge & Sofas', 'Tables & Bases']
const MASONRY_TILE_VARIANTS = [
  'installation-card--portrait',
  'installation-card--square',
  'installation-card--landscape',
  'installation-card--tall',
  'installation-card--square',
  'installation-card--portrait',
  'installation-card--landscape',
]

function getMasonryTileVariant(index) {
  return MASONRY_TILE_VARIANTS[index % MASONRY_TILE_VARIANTS.length]
}

export default function InstallationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [visibleCount, setVisibleCount] = useState(24)
  const sentinelRef = useRef(null)

  useEffect(() => {
    setSeoMetadata({
      title: 'Installation Gallery | Aceray Commercial Furniture',
      description: 'Browse Aceray hospitality and commercial furniture installations, product applications, designer seating, and project imagery for contract interiors.',
      path: '/installations',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: 'Aceray Installation Gallery',
        description: 'Commercial furniture installation images and project examples from Aceray.',
        url: 'https://aceray.com/installations',
      },
    })
    removeSeoJsonLd('product-jsonld')

    async function fetchInstallations() {
      setLoading(true)
      try {
        const query = `*[_type == "product" && (defined(imageUrl) || defined(mainImage.asset) || count(galleryUrls) > 0 || count(gallery) > 0)] {
          _id, title, "slug": slug.current, designer, categories,
          imageUrl, galleryUrls,
          "mainImageUrl": mainImage.asset->url,
          "galleryAssets": gallery[]{
            "url": asset->url,
            "originalFilename": asset->originalFilename,
            "title": asset->title,
            "altText": asset->altText
          }
        }`

        const products = await sanityFetch(query)
        const allPhotos = []
        const seenDesigners = new Set()

        products?.forEach((product) => {
          const category = product.categories?.[0] || 'Seating'
          const gallery = (product.galleryAssets || []).filter(a => a && a.url && !a.url.includes('aceray.com'))

          // Filter ONLY verified installation photos. Do not fall back to studio/product imagery:
          // white-background cutouts break the Pinterest-style installation experience.
          const installationAssets = gallery.filter((asset) => isVerifiedInstallationAsset(asset))

          const uniqueAssets = Array.from(new Set(installationAssets.map(a => a.url)))
            .map(url => installationAssets.find(a => a.url === url))

          const designerKey = (product.designer || 'Aceray Design Team').trim().toLowerCase()

          // Only keep 1 product photo per designer
          if (uniqueAssets.length > 0 && !seenDesigners.has(designerKey)) {
            seenDesigners.add(designerKey)
            const assetObj = uniqueAssets[0]
            allPhotos.push({
              id: `${product._id}-0`,
              url: assetObj.url,
              productTitle: product.title,
              productSlug: product.slug,
              designer: product.designer || 'Aceray Design Team',
              category,
              projectName: formatProjectName(assetObj.url, assetObj.originalFilename, product.title),
            })
          }
        })

        // Shuffle slightly for varied visual masonry display
        const shuffled = allPhotos.sort(() => 0.5 - Math.random())
        setItems(shuffled)
      } catch (err) {
        console.error('Failed to load installation showcase:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInstallations()
  }, [])

  // Filter items based on search query and category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesCategory = true
      if (activeCategory === 'Chairs & Armchairs') {
        matchesCategory = /chair|armchair|seating/i.test(item.category) || /chair|armchair|side/i.test(item.productTitle)
      } else if (activeCategory === 'Barstools & Stools') {
        matchesCategory = /stool|barstool|counter/i.test(item.category) || /stool|barstool|counter/i.test(item.productTitle)
      } else if (activeCategory === 'Lounge & Sofas') {
        matchesCategory = /lounge|sofa|pouf|bench/i.test(item.category) || /lounge|sofa|bench/i.test(item.productTitle)
      } else if (activeCategory === 'Tables & Bases') {
        matchesCategory = /table|base/i.test(item.category) || /table|base/i.test(item.productTitle)
      }

      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, activeCategory])

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount)
  }, [filteredItems, visibleCount])

  // IntersectionObserver Sentinel for automatic infinite scroll lazy-loading
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredItems.length) {
          setVisibleCount((prev) => {
            const nextCount = Math.min(prev + 24, filteredItems.length)
            // Proactively pre-fetch image assets for the newly visible items in background
            filteredItems.slice(prev, nextCount).forEach((item) => {
              if (item.url && !preloadedUrls.has(item.url)) {
                const img = new Image()
                img.src = item.url
                img.onload = () => preloadedUrls.add(item.url)
              }
            })
            return nextCount
          })
        }
      },
      { rootMargin: '1200px 0px' }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [visibleCount, filteredItems])

  return (
    <div className="installations-page min-h-screen bg-[#faf9f6] text-[#222]">
      {/* Hero Banner */}
      <section className="installations-hero">
        <div className="installations-hero-content">
          <Badge className="installations-hero-badge">
            Project Showcase
          </Badge>
          <h1 className="installations-hero-title">
            Installation Gallery
          </h1>
          <p className="installations-hero-subtitle">
            Explore real-world hospitality installations featuring Aceray seating, tables, and custom furniture across premier hotels, resorts, and dining spaces.
          </p>

          {/* Search & Filter Bar */}
          <div className="installations-search-wrap">
            <Search className="installations-search-icon" />
            <input
              type="text"
              placeholder="Search projects, hotels, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="installations-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="installations-search-clear"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container">
        <div className="installations-filter-bar">
          <div className="installations-filter-pills">
            <Filter className="size-4 text-[#718f80] mr-1 flex-shrink-0" />
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setVisibleCount(24)
                }}
                className={`installations-pill ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="installations-count-text">
            Showing {filteredItems.length} installation photos
          </span>
        </div>
      </section>

      {/* Masonry Image Gallery Section */}
      <section className="container installations-section">
        {loading ? (
          <div className="installations-masonry-grid">
            {[...Array(12)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-full h-64 rounded-[16px] break-inside-avoid bg-gray-200 animate-pulse mb-4"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[16px] border border-gray-200 p-8 max-w-xl mx-auto my-12">
            <Sparkles className="size-10 text-[#718f80] mx-auto mb-4 opacity-60" />
            <h3 className="text-xl font-medium text-gray-800 font-heading uppercase">No installations found</h3>
            <p className="text-sm text-gray-500 mt-2 font-sans">
              Try adjusting your search query or choosing a different filter category.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
              }}
              className="btn-primary mt-6"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Masonry Columns */}
            <div className="installations-masonry-grid">
              {visibleItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`installation-card ${getMasonryTileVariant(index)}`}
                >
                  <div className="installation-card-img-wrap">
                    <InstallationImage
                      src={item.url}
                      alt={`${item.projectName} - ${item.productTitle}`}
                      className="installation-card-img"
                    />
                    <div className="installation-card-overlay">
                      <span className="installation-card-badge">
                        {item.productTitle}
                      </span>
                      <h4 className="installation-card-title">
                        {item.projectName}
                      </h4>
                      <p className="installation-card-meta">
                        <MapPin className="size-3 text-[#718f80]" />
                        <span>Featured Product: {item.productTitle}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Sentinel & Load More */}
            {visibleCount < filteredItems.length && (
              <div ref={sentinelRef} className="text-center pt-12">
                <Button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredItems.length))}
                  className="btn-primary px-8 py-3 text-sm rounded-full tracking-wider uppercase"
                >
                  Load More Installations ({filteredItems.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Interactive Lightbox Dialog Modal (Shadcn UI) */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="installation-lightbox-dialog">
          {selectedItem && (
            <div className="installation-lightbox-grid">
              {/* High-Res Image Column */}
              <div className="installation-lightbox-media">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.projectName}
                  className="installation-lightbox-img"
                />
              </div>

              {/* Information Column */}
              <div className="installation-lightbox-info">
                <div className="installation-lightbox-body">
                  <DialogHeader className="installation-lightbox-header">
                    <Badge className="installation-lightbox-badge">
                      {selectedItem.category}
                    </Badge>
                    <DialogTitle className="installation-lightbox-title">
                      {selectedItem.projectName}
                    </DialogTitle>
                    <DialogDescription className="installation-lightbox-description">
                      Featured in luxury hospitality and commercial installations.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="installation-lightbox-specs">
                    <div className="installation-lightbox-spec-item">
                      <span className="installation-lightbox-spec-label">Product Model:</span>
                      <span className="installation-lightbox-spec-val">{selectedItem.productTitle}</span>
                    </div>
                    <div className="installation-lightbox-spec-item">
                      <span className="installation-lightbox-spec-label">Designer:</span>
                      <span className="installation-lightbox-spec-val">{selectedItem.designer}</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="installation-lightbox-ctas">
                  <Button asChild className="btn-primary installation-lightbox-button">
                    <Link
                      to={`/product/${selectedItem.productSlug}`}
                      onClick={() => setSelectedItem(null)}
                    >
                      <span>View Product Page</span>
                      <ArrowRight className="installation-lightbox-button-icon" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="btn-outline installation-lightbox-button">
                    <Link
                      to="/contact"
                      onClick={() => setSelectedItem(null)}
                    >
                      <span>Request Quote / Specs</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
