import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { sanityFetch } from '@/sanityClient'
import ProductCard from '@/components/ProductCard'
import { CATEGORIES } from '@/constants'
const PAGE_SIZE = 24


export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cat = searchParams.get('cat') || ''
  const q = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback((pageNum = 0) => {
    setLoading(true)
    const offset = pageNum * PAGE_SIZE
    const limit = offset + PAGE_SIZE

    let filters = `_type == "product" && defined(imageUrl)`
    const queryParams = {}

    if (cat) {
      // Special handling for lounge to include both lounge categories
      if (cat === 'lounge') {
        filters += ` && ("Lounge Seating" in categories || "Lounge Seating RTS" in categories)`;
      } else if (cat === 'outdoor' || cat === 'outdoors') {
        filters += ` && ("Outdoors" in categories || "Outdoor Powder Coat Steel" in categories || "Outdoor Powder Coat Steel 2" in categories || count((categories[])[lower(@) match "outdoor*"]) > 0)`;
      } else {
        // Find matching standard category name
        const matchedCat = CATEGORIES.find(c => c.toLowerCase().replace(/\s+/g, '-') === cat) || cat;
        filters += ` && $cat in categories`;
        queryParams.cat = matchedCat;
      }
    }

    if (q) {
      filters += ` && (
        title match $term ||
        designer match $term ||
        description match $term ||
        count((categories[])[@ match $term]) > 0 ||
        count((tags[])[@ match $term]) > 0 ||
        slug.current match $term
      )`
      queryParams.term = q + '*'
    }

    const itemsQuery = `*[${filters}] | order(_updatedAt desc) [${offset}...${limit}] {
       _id, title, slug, categories, imageUrl, mainImage{asset-> {_id, url}}, designer, madeIn
    }`

    const countQuery = `count(*[${filters}])`

    Promise.all([
      sanityFetch(itemsQuery, queryParams),
      pageNum === 0 ? sanityFetch(countQuery, queryParams) : Promise.resolve(total),
    ])
      .then(([items, count]) => {
        setProducts(pageNum === 0 ? items : (prev) => [...prev, ...items])
        if (pageNum === 0) setTotal(count)
        setPage(pageNum)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [cat, q])

  const hasMore = total > 0 && products.length < total

  // IntersectionObserver for infinite scrolling
  const loadMoreRef = useRef(null)
  useEffect(() => {
    if (!hasMore || loading) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fetchProducts(page + 1)
        }
      })
    }, { root: null, rootMargin: '200px', threshold: 0 })
    const current = loadMoreRef.current
    if (current) observer.observe(current)
    return () => {
      if (current) observer.unobserve(current)
    }
  }, [hasMore, loading, page, fetchProducts])

  useEffect(() => {
    document.title = `Products${cat ? ` – ${cat}` : ''} | Aceray`
    fetchProducts(0)
  }, [cat, q])

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('q') // reset search on cat change
    setSearchParams(next)
  }

  return (
    <div className="catalog-page">
      {/* Header */}
      <div className="catalog-heading">
        <h1 className="catalog-title">
          {cat ? cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All Products'}
        </h1>
        <p className="catalog-count">{total} products</p>
      </div>

      <div className="catalog-layout">
        {/* Filters Sidebar */}
        <aside className="catalog-sidebar">
          <div>
            <h3 className="catalog-filter-title">Category</h3>
            <ul className="catalog-filter-list">
              <li>
                <button
                  onClick={() => setFilter('cat', '')}
                  className={`catalog-filter-button ${!cat ? 'active' : ''}`}
                >
                  All Products
                </button>
              </li>
              {CATEGORIES.map((c) => {
                const slug = c.toLowerCase().replace(/\s+/g, '-')
                const active = cat === slug || (slug.startsWith('outdoor') && (cat === 'outdoor' || cat === 'outdoors'))
                return (
                  <li key={c}>
                    <button
                      onClick={() => setFilter('cat', slug)}
                      className={`catalog-filter-button ${active ? 'active' : ''}`}
                    >
                      {c}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <Separator className="bg-[#E5E3DD]" />

          {(cat || q) && (
            <button
              onClick={() => setSearchParams({})}
              className="catalog-clear"
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Mobile filter pills */}
        <div className="catalog-mobile-filters">
          <button type="button" onClick={() => setFilter('cat', '')}>
            <span className={`cat-badge ${!cat ? 'cat-badge-active' : 'cat-badge-inactive'}`}>
              All Products
            </span>
          </button>
          {CATEGORIES.map((c) => {
            const slug = c.toLowerCase().replace(/\s+/g, '-')
            const active = cat === slug || (slug.startsWith('outdoor') && (cat === 'outdoor' || cat === 'outdoors'))
            return (
              <button type="button" key={c} onClick={() => setFilter('cat', active ? '' : slug)}>
                <span className={`cat-badge ${active ? 'cat-badge-active' : 'cat-badge-inactive'}`}>
                  {c}
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div>
          {q && (
            <p className="catalog-results-note">
              Showing results for <strong>"{q}"</strong>
              <button onClick={() => setFilter('q', '')}>clear</button>
            </p>
          )}

          {loading && products.length === 0 ? (
            <div className="catalog-grid">
              {[...Array(12)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-square rounded-sm mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-1.5" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="catalog-empty">
              <h2 className="catalog-empty-title">No products found</h2>
              <p className="catalog-empty-copy">
                Try another category or clear the current filters to browse the full Aceray collection.
              </p>
              <Button
                onClick={() => setSearchParams({})}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="catalog-grid">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              <div ref={loadMoreRef}></div>
{hasMore && (
                <div className="catalog-load-more flex justify-center my-6">
                  <button
                    onClick={() => fetchProducts(page + 1)}
                    disabled={loading}
                    className="btn-outline"
                  >
                    {loading ? 'Loading…' : `Load More (${total - products.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
