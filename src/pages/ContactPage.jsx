import { useEffect } from 'react'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'

export default function ContactPage() {
  useEffect(() => {
    setSeoMetadata({
      title: 'Contact Aceray | Trade Pricing & Representatives',
      description: 'Contact Aceray for trade pricing, commercial furniture specification support, catalog requests, finish samples, and representative assistance.',
      path: '/contact',
    })
    removeSeoJsonLd('product-jsonld')
  }, [])

  return (
    <div className="contact-page">
      <section className="container contact-page-container">
        <div className="contact-page-heading">
          <span className="contact-page-eyebrow">Get In Touch</span>
          <h1>Contact &amp; Trade Pricing</h1>
        </div>

        <div className="contact-layout">
          <div className="contact-panel">
            <h2 className="contact-section-title">Send a Message</h2>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="contact-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="company">Company / Studio</label>
                <input
                  id="company"
                  type="text"
                  placeholder="Your firm name"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us about your project or request..."
                />
              </div>
              <button type="submit" className="btn-primary contact-submit">
                Send Message
              </button>
            </form>
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
                  <dd>+1 (305) 000-0000</dd>
                </div>
                <div>
                  <dt>Showroom</dt>
                  <dd>Miami, FL - By Appointment</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
