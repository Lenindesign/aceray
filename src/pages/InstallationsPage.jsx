import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, ArrowRight, ExternalLink, Sparkles, Filter, X } from 'lucide-react'
import { sanityFetch } from '@/sanityClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy-loaded Image component with shimmer skeleton placeholder
function InstallationImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative w-full h-full bg-[#e8e7e2]">
      {!loaded && (
        <div className="absolute inset-0 bg-[#e8e7e2] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-400 ease-out`}
      />
    </div>
  )
}

// Helper to format clean project name from image filename or product title
function formatProjectName(url, productTitle) {
  if (!url) return `${productTitle} Installation`
  const filename = url.split('/').pop() || ''
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')

  // Remove generic suffixes or clean hyphenated names
  let cleaned = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b(frontview|backview|sideview|topview|highres|scaled|jpg|png|webp)\b/gi, '')
    .trim()

  // If filename is just the product name or very short, use formatted product name
  if (cleaned.toUpperCase() === productTitle.toUpperCase() || cleaned.length < 3) {
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

export default function InstallationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [visibleCount, setVisibleCount] = useState(24)
  const sentinelRef = useRef(null)

  useEffect(() => {
    async function fetchInstallations() {
      setLoading(true)
      try {
        const query = `*[_type == "product" && (defined(imageUrl) || defined(mainImage.asset) || count(galleryUrls) > 0 || count(gallery) > 0)] {
          _id, title, "slug": slug.current, designer, categories,
          imageUrl, galleryUrls,
          "mainImageUrl": mainImage.asset->url,
          "galleryAssetUrls": gallery[].asset->url
        }`

        const products = await sanityFetch(query)
        const allPhotos = []

        products?.forEach((product) => {
          const category = product.categories?.[0] || 'Seating'
          const mainImg = product.mainImageUrl || (product.imageUrl && !product.imageUrl.includes('aceray.com') ? product.imageUrl : null)
          const gallery = [
            ...(product.galleryAssetUrls || []),
            ...(product.galleryUrls || [])
          ].filter(url => url && !url.includes('aceray.com')) // ensure valid URLs

          // Combine main and gallery photos
          const urls = mainImg ? [mainImg, ...gallery] : gallery
          const uniqueUrls = Array.from(new Set(urls))

          uniqueUrls.forEach((url, idx) => {
            allPhotos.push({
              id: `${product._id}-${idx}`,
              url,
              productTitle: product.title,
              productSlug: product.slug,
              designer: product.designer || 'Aceray Design Team',
              category,
              projectName: formatProjectName(url, product.title),
            })
          })
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
          setVisibleCount((prev) => Math.min(prev + 24, filteredItems.length))
        }
      },
      { rootMargin: '400px' }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [visibleCount, filteredItems.length])

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
      <section className="container max-w-7xl mx-auto px-6">
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
      <section className="container max-w-7xl mx-auto px-6 installations-section">
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
              {visibleItems.map((item, idx) => {
                const aspectClass = [
                  'aspect-ratio-square',
                  'aspect-ratio-tall',
                  'aspect-ratio-wide',
                  'aspect-ratio-wide',
                  'aspect-ratio-square',
                  'aspect-ratio-portrait',
                  'aspect-ratio-square',
                  'aspect-ratio-tall'
                ][idx % 8]

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="installation-card"
                  >
                    <div className={`installation-card-img-wrap ${aspectClass}`}>
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
                )
              })}
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
        <DialogContent className="max-w-4xl bg-white border border-gray-200 rounded-[16px] overflow-hidden p-0 gap-0 shadow-2xl">
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* High-Res Image Column */}
              <div className="md:col-span-8 bg-black flex items-center justify-center p-4 max-h-[75vh]">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.projectName}
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />
              </div>

              {/* Information Column */}
              <div className="md:col-span-4 p-6 md:p-8 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-gray-100">
                <div className="space-y-6">
                  <DialogHeader className="p-0 space-y-2 text-left">
                    <Badge className="w-fit bg-[#718f80]/10 text-[#718f80] border-none text-[10px] uppercase font-semibold tracking-wider">
                      {selectedItem.category}
                    </Badge>
                    <DialogTitle className="font-heading text-2xl font-medium text-gray-900 uppercase">
                      {selectedItem.projectName}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-gray-500 font-sans">
                      Featured in luxury hospitality and commercial installations.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 pt-2 border-t border-gray-100 text-sm font-sans">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Product Model:</span>
                      <span className="font-semibold text-gray-900">{selectedItem.productTitle}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Designer:</span>
                      <span className="font-medium text-gray-700">{selectedItem.designer}</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-8 space-y-3">
                  <Button asChild className="btn-primary w-full justify-center">
                    <Link
                      to={`/product/${selectedItem.productSlug}`}
                      onClick={() => setSelectedItem(null)}
                    >
                      <span>View Product Page</span>
                      <ArrowRight className="size-4 ml-2" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="btn-outline w-full justify-center">
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
