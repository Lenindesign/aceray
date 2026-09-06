import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { removeSeoJsonLd, setSeoMetadata, createBreadcrumbJsonLd, ACERAY_ORGANIZATION_SCHEMA } from '@/lib/seo'
import { sanityFetch } from '@/sanityClient'
import { getEnrichedProductTitle, formatProductTitleWithCategory } from '@/lib/productFamilies'

export default function ContactPage() {
  const [searchParams] = useSearchParams()

  const rawIntent = searchParams.get('intent') || searchParams.get('request') || ''
  const rawProduct = searchParams.get('product') || ''
  const rawSlug = searchParams.get('slug') || ''
  const rawSubject = searchParams.get('subject') || ''
  const rawCategory = searchParams.get('category') || ''

  const [enrichedProductName, setEnrichedProductName] = useState(() => {
    if (rawProduct && rawCategory) {
      return getEnrichedProductTitle(rawProduct, [rawCategory])
    }
    return formatProductTitleWithCategory(rawProduct)
  })

  // If slug is provided and current product title does not have category indicator, fetch from Sanity
  useEffect(() => {
    if (!rawSlug) return
    const hasCategorySignal = /\b(chair|armchair|stool|table|lounge|bench|sofa)\b/i.test(enrichedProductName)
    if (hasCategorySignal && enrichedProductName) return

    let isMounted = true
    sanityFetch(
      `*[_type == "product" && slug.current == $slug][0]{ title, categories }`,
      { slug: rawSlug }
    ).then((p) => {
      if (isMounted && p && p.title) {
        const fullTitle = getEnrichedProductTitle(p.title, p.categories)
        if (fullTitle) {
          setEnrichedProductName(fullTitle)
        }
      }
    }).catch(() => {
      // Graceful fallback to rawProduct
    })

    return () => {
      isMounted = false
    }
  }, [rawSlug, enrichedProductName])

  // Determine inquiry type
  const defaultInquiryType = useMemo(() => {
    if (rawIntent === 'quote' || rawProduct || rawSubject.toLowerCase().includes('quote')) return 'quote'
    if (rawIntent === 'catalog' || rawIntent === 'catalog-request') return 'catalog'
    if (rawIntent === 'samples' || rawIntent === 'sample') return 'samples'
    return 'general'
  }, [rawIntent, rawProduct, rawSubject])

  // Format active product name: uppercase model + Title Case category
  const activeProductName = useMemo(() => {
    return formatProductTitleWithCategory(enrichedProductName || rawProduct)
  }, [enrichedProductName, rawProduct])
  const defaultMessage = useMemo(() => {
    if (activeProductName) {
      return `Hello, I would like to request trade pricing, finish options, and lead-time information for the ${activeProductName} for an upcoming commercial project.\n\nProject Location: \nEstimated Quantity: \nRequired Delivery: `
    }
    if (rawIntent === 'catalog') {
      return `Hello, please send me the latest Aceray Commercial Furniture architectural catalog and digital binder.\n\nMailing Address (if print desired): `
    }
    if (rawIntent === 'samples') {
      return `Hello, I would like to request material and finish sample swatches for an upcoming project.\n\nFinishes/Fabrics of Interest: \nProject Name: `
    }
    return ''
  }, [activeProductName, rawIntent])

  const [inquiryType, setInquiryType] = useState(defaultInquiryType)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState(defaultMessage)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // If URL params or enriched product change, update defaults
  useEffect(() => {
    setInquiryType(defaultInquiryType)
    setMessage(defaultMessage)
  }, [defaultInquiryType, defaultMessage])

  useEffect(() => {
    setSeoMetadata({
      title: 'Contact Aceray | Trade Pricing & Representatives',
      description: 'Contact Aceray for trade pricing, commercial furniture specification support, catalog requests, finish samples, and representative assistance.',
      path: '/contact',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ContactPage',
            name: 'Contact Aceray',
            description: 'Contact Aceray for trade pricing, commercial furniture specification support, catalog requests, finish samples, and representative assistance.',
            publisher: { '@id': 'https://aceray.com/#organization' },
          },
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          ACERAY_ORGANIZATION_SCHEMA,
        ],
      },
    })
    removeSeoJsonLd('product-jsonld')
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitted(true)
  }

  function handleReset() {
    setIsSubmitted(false)
    setName('')
    setEmail('')
    setCompany('')
    setPhone('')
    setMessage(defaultMessage)
  }

  return (
    <div className="contact-page">
      <section className="container contact-page-container">
        <div className="contact-page-heading">
          <span className="contact-page-eyebrow">Get In Touch</span>
          <h1>Contact &amp; Trade Pricing</h1>
        </div>

        <div className="contact-layout">
          <div className="contact-panel">
            {isSubmitted ? (
              <div className="contact-success-panel">
                <CheckCircle2 className="size-12 text-[var(--color-primary)]" aria-hidden="true" />
                <h2 className="contact-success-title">Inquiry Received</h2>
                <p className="contact-success-copy">
                  Thank you for reaching out{name ? `, ${name}` : ''}. Our dedicated trade sales team will review your {inquiryType === 'quote' ? 'quote request' : 'inquiry'} and respond within one business day.
                </p>
                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                  <button type="button" onClick={handleReset} className="btn-outline">
                    Send Another Inquiry
                  </button>
                  {rawSlug ? (
                    <Link to={`/product/${rawSlug}`} className="btn-primary">
                      Return to Product
                    </Link>
                  ) : (
                    <Link to="/catalog" className="btn-primary">
                      Browse Catalog
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h2 className="contact-section-title">Send a Message</h2>

                {activeProductName && (
                  <div className="contact-product-badge">
                    <div className="contact-product-badge-info">
                      <span className="contact-product-badge-label">Item for Quote</span>
                      <strong className="contact-product-badge-title">{activeProductName}</strong>
                    </div>
                    {rawSlug && (
                      <Link to={`/product/${rawSlug}`} className="contact-product-badge-link">
                        <span>View Item</span>
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-field">
                    <label htmlFor="inquiry-type">Inquiry Type</label>
                    <select
                      id="inquiry-type"
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                    >
                      <option value="quote">Trade Quote / Specification</option>
                      <option value="samples">Finish &amp; Material Samples</option>
                      <option value="catalog">Architectural Catalog Request</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="company">Company / Studio</label>
                    <input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your firm name"
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="phone">Phone (Optional)</label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project or request..."
                    />
                  </div>

                  <button type="submit" className="btn-primary contact-submit">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="contact-info">
            <div className="contact-info-block">
              <h2 className="contact-section-title">Trade Program</h2>
              <p>
                Aceray works exclusively with interior designers, hospitality purchasers, and design professionals. Trade accounts receive exclusive pricing, complimentary swatches, and dedicated representative support.
              </p>
            </div>
            <div className="contact-info-block">
              <h2 className="contact-section-title">Contact</h2>
              <dl className="contact-details">
                <div>
                  <dt>Email</dt>
                  <dd><a href="mailto:info@aceray.com">info@aceray.com</a></dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd><a href="tel:+13037333404">303 733 3404</a></dd>
                </div>
                <div>
                  <dt>Corporate Office</dt>
                  <dd>4465 Kipling St., Suite 202<br />Wheat Ridge, CO 80033</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
