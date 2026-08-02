import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Footer() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/">
              <img src="/assets/images/logo.svg" alt="Aceray" style={{ filter: 'brightness(0) invert(1)', height: '32px' }} />
            </Link>
            <p>Presenting design professionals with unique contemporary seating and table designs from international artisans.</p>
          </div>

          <div className="footer-column">
            <h4>Products</h4>
            <ul>
              <li><Link to="/catalog?cat=side-chairs">Side Chairs</Link></li>
              <li><Link to="/catalog?cat=armchairs">Armchairs</Link></li>
              <li><Link to="/catalog?cat=lounge">Lounge Seating</Link></li>
              <li><Link to="/catalog?cat=barstools">Barstools &amp; Counter Stools</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/resources">2026 Catalog Request</Link></li>
              <li><Link to="/resources">Fabrics &amp; Finishes</Link></li>
              <li><Link to="/resources">3D Models &amp; CAD Downloads</Link></li>
              <li><Link to="/resources">Care &amp; Upholstery</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Aceray</Link></li>
              <li><Link to="/contact">Trade Representatives</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-social-search-section">
          <div className="footer-social-wrapper">
            <span className="social-label">FOLLOW US ON</span>
            <div className="social-icons">
              <a href="https://twitter.com/acerayllc" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon">
                <i className="fa fa-twitter" aria-hidden="true"></i>
              </a>
              <a href="https://www.facebook.com/Acerayllc" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
                <i className="fa fa-facebook-square" aria-hidden="true"></i>
              </a>
              <a href="http://www.pinterest.com/acerayllc/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="social-icon">
                <i className="fa fa-pinterest" aria-hidden="true"></i>
              </a>
              <a href="https://www.linkedin.com/company/aceray/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">
                <i className="fa fa-linkedin-square" aria-hidden="true"></i>
              </a>
              <a href="https://www.instagram.com/aceray_thelookofseating/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          <form onSubmit={handleSearch} className="footer-search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search catalog..."
                className="footer-search-input"
                aria-label="Search furniture catalog"
              />
              <button type="submit" className="footer-search-btn" aria-label="Submit Search">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className="footer-bottom">
          &copy; 2026 Aceray LLC. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
