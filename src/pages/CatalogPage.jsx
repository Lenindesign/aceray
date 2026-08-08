import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { sanityFetch } from '@/sanityClient'
import ProductCard from '@/components/ProductCard'
import { CATEGORIES, getCategorySlug } from '@/constants'
import { FAVORITES_CHANGED_EVENT, getFavoriteSlugs } from '@/lib/favorites'
const PAGE_SIZE = 24
const HAS_PRODUCT_IMAGE = `(defined(imageUrl) || defined(mainImage.asset))`

function toTitleCase(value) {
  return value.replace(/\b[a-z]/g, (char) => char.toUpperCase())
}

function getCatalogCategoryMatch(value) {
  const matchedCategory = CATEGORIES.find((category) => getCategorySlug(category) === value)
  const readableValue = matchedCategory || value.replace(/-/g, ' ')
  const titleValue = toTitleCase(readableValue)

  return {
    candidates: Array.from(new Set([matchedCategory, readableValue, titleValue].filter(Boolean))),
    lower: readableValue.toLowerCase(),
  }
}

function orderProductsBySlug(products = [], slugs = []) {
  const bySlug = new Map(products.map((product) => [product.slug?.current || product.slug, product]))
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean)
}

function getCategoryFilter(value) {
  if (!value) return { expression: '', params: {} }

  if (value === 'lounge') {
    return { expression: `("Lounge Seating" in categories || "Lounge Seating RTS" in categories)`, params: {} }
  }

  if (value === 'outdoor' || value === 'outdoors') {
    return { expression: `("Outdoors" in categories || "Outdoor Powder Coat Steel" in categories || "Outdoor Powder Coat Steel 2" in categories || count((categories[])[lower(@) match "outdoor*"]) > 0)`, params: {} }
  }

  if (value === 'ready-to-ship') {
    return { expression: `("Ready to Ship" in categories || "Ready to Ship" in tags || "Lounge Seating RTS" in categories)`, params: {} }
  }

  if (value === 'low-stools-ottomans') {
    return { expression: `("Low Stools" in categories || "Ottomans" in categories || count((categories[])[lower(@) match "*ottoman*"]) > 0 || count((categories[])[lower(@) match "*low stool*"]) > 0)`, params: {} }
  }

  if (value === 'benches') {
    return { expression: `("Benches" in categories || "Bench" in categories || count((categories[])[lower(@) match "bench*"]) > 0)`, params: {} }
  }

  if (value === 'tables-bases') {
    return { expression: `("Tables" in categories || "Table Bases" in categories || "Bar Height Table Base" in categories || count((categories[])[lower(@) match "*table*"]) > 0 || count((categories[])[lower(@) match "*base*"]) > 0)`, params: {} }
  }

  const categoryMatch = getCatalogCategoryMatch(value)
  return {
    expression: `count((categories[])[@ in $catCandidates || lower(@) == $catLower]) > 0`,
    params: {
      catCandidates: categoryMatch.candidates,
      catLower: categoryMatch.lower,
    },
  }
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cat = searchParams.get('cat') || ''
  const q = searchParams.get('q') || ''
  const tag = searchParams.get('tag') || ''
  const isNew = searchParams.get('new') === '1'
  const isFavorites = tag === 'favorites'

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState({})

  const fetchProducts = useCallback((pageNum = 0) => {
    setLoading(true)
    const offset = pageNum * PAGE_SIZE
    const limit = offset + PAGE_SIZE

    if (isFavorites) {
      const favoriteSlugs = getFavoriteSlugs()
      const pageSlugs = favoriteSlugs.slice(offset, limit)

      if (pageSlugs.length === 0) {
        if (pageNum === 0) {
          setProducts([])
          setTotal(0)
        }
        setPage(pageNum)
        setLoading(false)
        return
      }

      const favoritesQuery = `*[
        _type == "product" &&
        ${HAS_PRODUCT_IMAGE} &&
        slug.current in $favoriteSlugs
      ] {
        _id, title, slug, categories, imageUrl, mainImage{asset-> {_id, url}}, designer, madeIn
      }`

      sanityFetch(favoritesQuery, { favoriteSlugs: pageSlugs })
        .then((items) => {
          const orderedItems = orderProductsBySlug(items || [], pageSlugs)
          setProducts(pageNum === 0 ? orderedItems : (prev) => [...prev, ...orderedItems])
          setTotal(favoriteSlugs.length)
          setPage(pageNum)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
      return
    }

    let filters = `_type == "product" && ${HAS_PRODUCT_IMAGE}`
    const queryParams = {}

    if (cat) {
      const categoryFilter = getCategoryFilter(cat)
      if (categoryFilter.expression) filters += ` && ${categoryFilter.expression}`
      Object.assign(queryParams, categoryFilter.params)
    }

    if (isNew) {
      filters += ` && isNewArrival == true`
    }

    if (tag) {
      filters += ` && count((tags[])[lower(@) match $tag]) > 0`
      queryParams.tag = tag.toLowerCase() + '*'
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
  }, [cat, q, tag, isNew, isFavorites, total])

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
    document.title = `${isFavorites ? 'Favorites' : isNew ? "What's New" : 'Products'}${cat ? ` – ${cat}` : tag && !isFavorites ? ` – ${tag}` : ''} | Aceray`
    fetchProducts(0)
  }, [cat, q, tag, isNew, isFavorites])

  useEffect(() => {
    let cancelled = false
    const allProductsQuery = `count(*[_type == "product" && ${HAS_PRODUCT_IMAGE}])`
    const categoryCountRequests = CATEGORIES.map((category) => {
      const slug = getCategorySlug(category)
      const categoryFilter = getCategoryFilter(slug)
      const countQuery = `count(*[_type == "product" && ${HAS_PRODUCT_IMAGE} && ${categoryFilter.expression}])`

      return sanityFetch(countQuery, categoryFilter.params)
        .then((count) => [slug, count || 0])
        .catch(() => [slug, 0])
    })

    Promise.all([
      sanityFetch(allProductsQuery).catch(() => 0),
      ...categoryCountRequests,
    ]).then(([allProductsCount, ...categoryEntries]) => {
      if (cancelled) return

      setCategoryCounts({
        all: allProductsCount || 0,
        favorites: getFavoriteSlugs().length,
        ...Object.fromEntries(categoryEntries),
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function handleFavoritesChange() {
      setCategoryCounts((current) => ({
        ...current,
        favorites: getFavoriteSlugs().length,
      }))

      if (isFavorites) fetchProducts(0)
    }

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange)
    window.addEventListener('storage', handleFavoritesChange)
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange)
      window.removeEventListener('storage', handleFavoritesChange)
    }
  }, [isFavorites, fetchProducts])

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('q') // reset search on cat change
    next.delete('tag')
    next.delete('new')
    setSearchParams(next)
  }

  function setFavoritesFilter() {
    setSearchParams({ tag: 'favorites' })
  }

  return (
    <div className="catalog-page">
      {/* Header */}
      <div className="catalog-heading">
        <h1 className="catalog-title">
          {isNew ? "What's New" : cat ? cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : tag ? tag.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All Products'}
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
                  className={`catalog-filter-button ${!cat && !tag && !isNew && !q ? 'active' : ''}`}
                >
                  <span>All Products</span>
                  <span className="catalog-filter-count">{categoryCounts.all ?? ''}</span>
                </button>
              </li>
              {CATEGORIES.map((c) => {
                const slug = getCategorySlug(c)
                const active = cat === slug || (slug.startsWith('outdoor') && (cat === 'outdoor' || cat === 'outdoors'))
                return (
                  <li key={c}>
                    <button
                      onClick={() => setFilter('cat', slug)}
                      className={`catalog-filter-button ${active ? 'active' : ''}`}
                    >
                      <span>{c}</span>
                      <span className="catalog-filter-count">{categoryCounts[slug] ?? ''}</span>
                    </button>
                  </li>
                )
              })}
              <li>
                <button
                  onClick={setFavoritesFilter}
                  className={`catalog-filter-button ${isFavorites ? 'active' : ''}`}
                >
                  <span>Favorites</span>
                  <span className="catalog-filter-count">{categoryCounts.favorites ?? 0}</span>
                </button>
              </li>
            </ul>
          </div>

        </aside>

        {/* Mobile filter pills */}
        <div className="catalog-mobile-filters">
          <button type="button" onClick={() => setFilter('cat', '')}>
            <span className={`cat-badge ${!cat && !tag && !isNew && !q ? 'cat-badge-active' : 'cat-badge-inactive'}`}>
              All Products
            </span>
          </button>
          {CATEGORIES.map((c) => {
            const slug = getCategorySlug(c)
            const active = cat === slug || (slug.startsWith('outdoor') && (cat === 'outdoor' || cat === 'outdoors'))
            return (
              <button type="button" key={c} onClick={() => setFilter('cat', active ? '' : slug)}>
                <span className={`cat-badge ${active ? 'cat-badge-active' : 'cat-badge-inactive'}`}>
                  {c}
                </span>
              </button>
            )
          })}
          <button type="button" onClick={setFavoritesFilter}>
            <span className={`cat-badge ${isFavorites ? 'cat-badge-active' : 'cat-badge-inactive'}`}>
              Favorites
            </span>
          </button>
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
              <h2 className="catalog-empty-title">
                {isFavorites ? 'No favorites yet' : 'No products found'}
              </h2>
              <p className="catalog-empty-copy">
                {isFavorites
                  ? 'Use the heart button on product cards to save pieces here for quick reference.'
                  : 'Try another category or clear the current filters to browse the full Aceray collection.'}
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="btn-outline"
              >
                {isFavorites ? 'Browse All Products' : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <>
              <div className="catalog-grid">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              <div ref={loadMoreRef}></div>
{hasMore && (
                <div className="catalog-load-more">
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
