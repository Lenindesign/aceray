import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fetchSanityResult } from '@/lib/sanityHttp'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { CATEGORIES, getCategorySlug } from '@/constants'
import { FAMILY_HERO_IMAGES } from '@/lib/productFamilies'

import logoSvg from '@/assets/logo.svg'

const NAV_LINKS = [
  { label: "What's New", to: '/catalog?new=1' },
  { label: 'Products', to: '/catalog', dropdown: true },
  { label: 'Ready to Ship', to: '/catalog?cat=ready-to-ship' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
]

const PRODUCT_CATEGORY_LINKS = [
  ...CATEGORIES.map((label) => ({ label, to: `/catalog?cat=${getCategorySlug(label)}` })),
]

const FAMILY_LINKS = Object.keys(FAMILY_HERO_IMAGES).map((familySlug) => ({
  label: familySlug.charAt(0).toUpperCase() + familySlug.slice(1),
  to: `/collections/${familySlug}`,
}))

const PRODUCT_RESOURCE_LINKS = [
  { label: 'Designers', to: '/designers' },
  { label: 'Fabrics & Finishes', to: '/fabrics-finishes' },
  { label: 'Installation Gallery', to: '/installations' },
  { label: 'Favorites', to: '/catalog?tag=favorites' },
  { label: 'Request a Sample', to: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  function isLinkActive(to, options = {}) {
    const [pathname, search = ''] = to.split('?')

    if (options.dropdown && (
      location.pathname === '/designers' ||
      location.pathname === '/collections' ||
      location.pathname.startsWith('/collections/')
    )) return true
    if (location.pathname !== pathname) return false
    if (pathname !== '/catalog') return true

    if (options.dropdown) {
      const params = new URLSearchParams(location.search)
      return !params.has('new') && params.get('cat') !== 'ready-to-ship'
    }

    const targetSearch = search ? `?${search}` : ''
    return location.search === targetSearch
  }

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 1) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(() => {
      setIsSearching(true)
      const isShortQuery = trimmed.length < 4
      const term = trimmed + '*'

      // Short queries (< 4 chars) match title, family, slug, designer, categories
      const matchConditions = isShortQuery
        ? `title match $term || family match $term || slug.current match $term || designer match $term || count((categories[])[@ match $term]) > 0`
        : `title match $term || family match $term || slug.current match $term || designer match $term || count((categories[])[@ match $term]) > 0 || count((tags[])[@ match $term]) > 0 || description match $term`

      const searchQuery = `*[_type == "product" && (defined(imageUrl) || defined(mainImage.asset)) && (${matchConditions})] | order(select(title match $term => 0, family match $term => 0, slug.current match $term => 1, designer match $term => 2, 3), title asc) [0...100]{
        _id, title, slug, imageUrl, mainImage{asset->{_id, url}}, categories, designer, family
      }`

      fetchSanityResult(searchQuery, { term })
        .then((res) => {
          const rawItems = res || []
          const qLower = trimmed.toLowerCase()

          // Calculate match relevance score for each item:
          // 0: Product Title, Family, or Slug STARTS WITH query (e.g. AMPIO for "am")
          // 1: Word boundary in Title or Family STARTS WITH query (e.g. "SEATING AMPIO" for "am")
          // 2: Title, Family, or Slug CONTAINS query anywhere (e.g. CAMPO for "am")
          // 3: Designer or Category CONTAINS query
          // 4: Full-text body description match
          function getItemScore(item) {
            const title = (item.title || '').toLowerCase()
            const family = (item.family || '').toLowerCase()
            const slug = (item.slug?.current || '').toLowerCase()
            const designer = (item.designer || '').toLowerCase()

            if (title.startsWith(qLower) || family.startsWith(qLower) || slug.startsWith(qLower)) return 0

            const titleWords = title.split(/[\s-]+/)
            const familyWords = family.split(/[\s-]+/)
            if (titleWords.some(w => w.startsWith(qLower)) || familyWords.some(w => w.startsWith(qLower))) return 1

            if (title.includes(qLower) || family.includes(qLower) || slug.includes(qLower)) return 2
            if (designer.includes(qLower)) return 3
            return 4
          }

          const scored = rawItems.map(item => ({ item, score: getItemScore(item) }))
          const hasStartsWithMatches = scored.some(s => s.score === 0 || s.score === 1)

          // EXCLUSIVELY prioritize items starting with the typed characters if any exist
          const relevantItems = hasStartsWithMatches
            ? scored.filter(s => s.score <= 1).map(s => s.item)
            : scored.filter(s => s.score <= 3).map(s => s.item)

          // Group relevant products by family name to prevent single-family saturation
          const familyGroups = new Map()
          for (const item of relevantItems) {
            const familyName = (item.family || (item.title ? item.title.split('-')[0].split(' ')[0] : 'Other')).toUpperCase()
            if (!familyGroups.has(familyName)) {
              familyGroups.set(familyName, [])
            }
            familyGroups.get(familyName).push(item)
          }

          // Sort families by best relevance score first
          const sortedFamilyEntries = Array.from(familyGroups.entries()).sort(([famA, itemsA], [famB, itemsB]) => {
            const scoreA = Math.min(...itemsA.map(getItemScore))
            const scoreB = Math.min(...itemsB.map(getItemScore))
            if (scoreA !== scoreB) return scoreA - scoreB
            return famA.localeCompare(famB)
          })

          // Interleave results across families for a diverse dropdown list
          const interleaved = []
          let maxLen = 0
          for (const [, items] of sortedFamilyEntries) {
            if (items.length > maxLen) maxLen = items.length
          }

          for (let i = 0; i < maxLen; i++) {
            for (const [, items] of sortedFamilyEntries) {
              if (items[i]) interleaved.push(items[i])
            }
          }

          setSearchResults(interleaved.slice(0, 30))
          setShowDropdown(true)
        })
        .catch(console.error)
        .finally(() => setIsSearching(false))
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      setShowDropdown(false)
      navigate(`/catalog?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  function handleSelectResult(slug) {
    setShowDropdown(false)
    setQuery('')
    navigate(`/product/${slug}`)
  }

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src={logoSvg} alt="Aceray" width="160" height="38" decoding="async" />
        </Link>

        <nav id="main-nav" className={`nav-wrapper ${menuOpen ? 'active' : ''}`}>
          <NavigationMenu className="nav-menu" align="center">
            <NavigationMenuList className="nav-links nav-menu-list flex items-center gap-8 md:gap-9">
              {NAV_LINKS.map(({ label, to, dropdown }) => (
                <NavigationMenuItem
                  key={label}
                  className={dropdown ? 'nav-item nav-item-has-dropdown' : 'nav-item'}
                >
                  {dropdown ? (
                    <>
	                      <NavigationMenuTrigger
	                        href={to}
	                        className={`nav-menu-trigger ${isLinkActive(to, { dropdown }) ? 'active' : ''}`}
	                        onClick={() => {
	                          setMenuOpen(false)
	                          navigate(to)
	                        }}
                      >
                        {label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="nav-dropdown">
                        <div className="nav-dropdown-section">
                          <span className="nav-dropdown-title">Product Types</span>
                          {PRODUCT_CATEGORY_LINKS.map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              className={`nav-dropdown-link ${isLinkActive(item.to) ? 'nav-dropdown-link-active' : ''}`}
                              onClick={() => setMenuOpen(false)}
                              role="menuitem"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>

                        <div className="nav-dropdown-section nav-dropdown-section-wide">
                          <Link
                            to="/collections"
                            className="nav-dropdown-title nav-dropdown-title-link"
                            onClick={() => setMenuOpen(false)}
                          >
                            Collections
                          </Link>
                          <div className="nav-dropdown-grid">
                            {FAMILY_LINKS.map((item) => (
                              <Link
                                key={item.label}
                                to={item.to}
                                className={`nav-dropdown-link ${isLinkActive(item.to) ? 'nav-dropdown-link-active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                                role="menuitem"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="nav-dropdown-section">
                          <span className="nav-dropdown-title">Resources</span>
                          {PRODUCT_RESOURCE_LINKS.map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              className={`nav-dropdown-link ${isLinkActive(item.to) ? 'nav-dropdown-link-active' : ''}`}
                              onClick={() => setMenuOpen(false)}
                              role="menuitem"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={isLinkActive(to, { dropdown }) ? 'active' : ''}
                    >
                      {label}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="header-actions">
          <form onSubmit={handleSearch} className="nav-search-form" role="search" ref={searchRef}>
            <div className="nav-search-input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true)
                }}
                placeholder="Search products..."
                className="nav-search-input"
                aria-label="Search catalog"
              />
              <button type="submit" className="nav-search-btn" aria-label="Submit search">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>

            {showDropdown && (
              <div className="nav-search-dropdown">
                {isSearching ? (
                  <div className="nav-search-status">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="nav-search-results-list">
                      {searchResults.map((item) => {
                        const imgUrl = item.mainImage?.asset?.url || (item.imageUrl && !item.imageUrl.includes('aceray.com') ? item.imageUrl : '/assets/images/placeholder.jpg')
                        const category = item.categories?.[0] || 'Product'
                        return (
                          <div
                            key={item._id}
                            onClick={() => handleSelectResult(item.slug?.current)}
                            className="nav-search-item"
                          >
                            <img src={imgUrl} alt={item.title} className="nav-search-thumb" />
                            <div className="nav-search-info">
                              <span className="nav-search-title">{item.title}</span>
                              <span className="nav-search-sub">{category}{item.designer ? ` • ${item.designer}` : ''}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <Link
                      to={`/catalog?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => {
                        setShowDropdown(false)
                        setQuery('')
                      }}
                      className="nav-search-view-all"
                    >
                      View all results for "{query.trim()}"
                    </Link>
                  </>
                ) : (
                  <div className="nav-search-status">
                    No products found for "{query.trim()}"
                  </div>
                )}
              </div>
            )}
          </form>

          <button
            type="button"
            id="mobile-menu-toggle"
            className={`hamburger-btn ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle Navigation Menu"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
