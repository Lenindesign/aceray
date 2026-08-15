import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoSvg from '@/assets/logo.svg'

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
              <img src={logoSvg} alt="Aceray" width="143" height="34" loading="lazy" decoding="async" />
            </Link>
            <p>Presenting design professionals with unique contemporary seating and table designs from international artisans.</p>
            
            <address className="footer-contact-details">
              <p className="footer-contact-line">
                <svg className="footer-contact-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>4465 Kipling St., Suite 202, Wheat Ridge, CO 80033</span>
              </p>
              <p className="footer-contact-line">
                <svg className="footer-contact-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href="tel:+13037333404">303 733 3404</a>
              </p>
              <p className="footer-contact-line">
                <svg className="footer-contact-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="mailto:info@aceray.com">info@aceray.com</a>
              </p>
            </address>
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
              <li><Link to="/installations">Installation Gallery</Link></li>
              <li><Link to="/fabrics-finishes">Fabrics &amp; Finishes</Link></li>
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
              <li><a href="tel:+13037333404">Ph: 303 733 3404</a></li>
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
