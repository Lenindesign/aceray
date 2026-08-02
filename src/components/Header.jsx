import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { sanityFetch } from '@/sanityClient'

const NAV_LINKS = [
  { label: 'Products', to: '/catalog' },
  { label: 'Side Chairs', to: '/catalog?cat=side-chairs' },
  { label: 'Armchairs', to: '/catalog?cat=armchairs' },
  { label: 'Lounge', to: '/catalog?cat=lounge' },
  { label: 'Outdoor', to: '/catalog?cat=outdoors' },
  { label: 'About Us', to: '/about' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

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
      const searchQuery = `*[_type == "product" && defined(imageUrl) && (
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
          <ul className="nav-links">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
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
                      const imgUrl = item.mainImage?.asset?.url || item.imageUrl
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
