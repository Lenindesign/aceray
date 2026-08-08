import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { sanityFetch } from '@/sanityClient'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { CATEGORIES, getCategorySlug } from '@/constants'
import { FAMILY_HERO_IMAGES } from '@/lib/productFamilies'

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

    if (options.dropdown && (location.pathname === '/collections' || location.pathname.startsWith('/collections/'))) return true
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
    if (trimmed.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(() => {
      setIsSearching(true)
      const term = trimmed + '*'
      const searchQuery = `*[_type == "product" && (defined(imageUrl) || defined(mainImage.asset)) && (
        title match $term ||
        designer match $term ||
        description match $term ||
        count((categories[])[@ match $term]) > 0 ||
        count((tags[])[@ match $term]) > 0 ||
        slug.current match $term
      )][0...5]{
        _id, title, slug, imageUrl, mainImage{asset->{_id, url}}, categories, designer
      }`

      sanityFetch(searchQuery, { term })
        .then((res) => {
          setSearchResults(res || [])
          setShowDropdown(true)
        })
        .catch(console.error)
        .finally(() => setIsSearching(false))
    }, 250)

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
          <img src="/assets/images/logo.svg" alt="Aceray" />
        </Link>

        <nav id="main-nav" className={`nav-wrapper ${menuOpen ? 'active' : ''}`}>
          <NavigationMenu className="nav-menu" align="center">
            <NavigationMenuList className="nav-links nav-menu-list">
              {NAV_LINKS.map(({ label, to, dropdown }) => (
                <NavigationMenuItem
                  key={label}
                  className={dropdown ? 'nav-item nav-item-has-dropdown' : 'nav-item'}
                >
                  {dropdown ? (
                    <>
	                      <NavigationMenuTrigger
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
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((item) => {
                      const imgUrl = item.mainImage?.asset?.url || (item.imageUrl && !item.imageUrl.includes('aceray.com') ? item.imageUrl : '/assets/images/placeholder.jpg')
                      const category = item.categories?.[0] || 'Product'
                      return (
                        <div
                          key={item._id}
                          onClick={() => handleSelectResult(item.slug?.current)}
                          className="nav-search-item"
                          style={{ cursor: 'pointer' }}
                        >
                          <img src={imgUrl} alt={item.title} className="nav-search-thumb" />
                          <div className="nav-search-info">
                            <span className="nav-search-title">{item.title}</span>
                            <span className="nav-search-sub">{category}{item.designer ? ` • ${item.designer}` : ''}</span>
                          </div>
                        </div>
                      )
                    })}
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
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
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
