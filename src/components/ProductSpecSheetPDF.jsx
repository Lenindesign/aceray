import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Printer, X } from 'lucide-react'
import './ProductSpecSheetPDF.css'

export default function ProductSpecSheetPDF({ product, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  const title = product.title || ''
  const modelTitle = product.title || ''
  const designerName = product.designer || 'Studio Tipi'

  const rawSlug = typeof product.slug === 'object' ? (product.slug?.current || '') : (product.slug || '')
  const slugLower = rawSlug.toLowerCase()
  const titleLower = title.toLowerCase()

  const categoriesList = (Array.isArray(product.categories)
    ? product.categories.map(c => (typeof c === 'string' ? c : (c?.title || c?.name || ''))).join(' ')
    : (product.categories || '')
  ).toLowerCase()

  const tagsList = (Array.isArray(product.tags)
    ? product.tags.map(t => (typeof t === 'string' ? t : '')).join(' ')
    : (product.tags || '')
  ).toLowerCase()

  const descriptionLower = (product.description || '').toLowerCase()

  const isTable =
    categoriesList.includes('table') ||
    categoriesList.includes('base') ||
    tagsList.includes('table') ||
    tagsList.includes('base') ||
    titleLower.includes('table') ||
    titleLower.includes('base') ||
    descriptionLower.includes('table base') ||
    descriptionLower.includes('dining table') ||
    slugLower.includes('table') ||
    slugLower.includes('base') ||
    slugLower.includes('piazza') ||
    slugLower.includes('dsmaxi') ||
    slugLower.includes('dqmaxi')

  const heroImage = product.imageUrl || product.mainImage?.asset?.url || ''
  const galleryThumbnails = (product.galleryUrls || []).slice(0, 3)

  const overallHeight = product.overallHeight ? `${product.overallHeight}"` : (isTable ? '28.5"' : '34"')
  const overallDepth = product.overallDepth ? `${product.overallDepth}"` : '21.5"'
  const overallWidth = product.overallWidth ? `${product.overallWidth}"` : '22.5"'
  const seatHeight = product.seatHeight ? `${product.seatHeight}"` : '18"'
  const armHeight = product.armHeight ? `${product.armHeight}"` : '26"'

  const baseSize = product.baseSize || '37.5"'
  const topSize = product.topSize || 'Min64"Sq. / Max86"Sq.'

  const weight = product.weight || (isTable ? '45.0' : '28.5')

  const handlePrint = () => {
    window.print()
  }

  const modalJSX = (
    <div className="spec-sheet-modal-overlay" role="dialog" aria-modal="true" aria-label={`Spec Sheet for ${modelTitle}`}>
      {/* Modal Actions Control Bar */}
      <div className="spec-sheet-modal-header">
        <h2 className="spec-sheet-modal-title">Spec Sheet Preview — {modelTitle}</h2>
        <div className="spec-sheet-actions">
          <button
            type="button"
            className="spec-sheet-print-btn"
            onClick={handlePrint}
            aria-label="Print or save as PDF"
          >
            <Printer size={16} aria-hidden="true" />
            <span>Print / Save PDF</span>
          </button>
          <button
            type="button"
            className="spec-sheet-close-btn"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 8.5" x 11" Letter Document Canvas */}
      <div className="spec-sheet-document-wrapper">
        <div className="spec-sheet-document" id="spec-sheet-pdf">
          {/* Header */}
          <header className="spec-sheet-header">
            <div className="spec-sheet-brand-left">
              <img
                src="/assets/images/logo.svg"
                alt="Aceray"
                className="spec-sheet-brand-logo"
              />
            </div>
            <div className="spec-sheet-header-meta">
              <img
                src="/assets/spec-icons/aceray_slogan_header.png"
                alt="THE LOOK OF SEATING® www.aceray.com"
                className="spec-sheet-slogan-graphic"
              />
              <div className="spec-sheet-designer-meta">
                <span className="spec-sheet-designer-label">Design:</span>
                <span className="spec-sheet-designer-name">{designerName}</span>
              </div>
            </div>
          </header>

          {/* Document Body */}
          <div className="spec-sheet-body">
            {/* Vertical Rule Line */}
            <div className="spec-sheet-divider-rule" aria-hidden="true" />

            {/* Left Column (Thumbnails, Hero Photo, Model Code) */}
            <div className="spec-sheet-main-col">
              {/* Top Row Thumbnails */}
              {galleryThumbnails.length > 0 && (
                <div className="spec-sheet-thumbnails-row">
                  {galleryThumbnails.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${title} view ${idx + 1}`}
                      className="spec-sheet-thumb-item"
                    />
                  ))}
                </div>
              )}

              {/* Center Main Hero Photo */}
              <div className="spec-sheet-hero-container">
                {heroImage && (
                  <img
                    src={heroImage}
                    alt={modelTitle}
                    className="spec-sheet-hero-image"
                  />
                )}
              </div>
            </div>

            {/* Right Column (Specifications & Dimension Diagrams) */}
            <aside className="spec-sheet-sidebar-col">
              {/* Title Bullet matching exact format • #383 83' */}
              <div className="spec-sheet-product-title-bullet">
                • {modelTitle}
              </div>

              {/* Exact Architectural Measurement Line Drawings */}
              <div className="spec-sheet-dims-container">
                <div className="spec-sheet-dims-diagrams-wrap">
                  <img
                    src={isTable ? "/assets/spec-icons/aceray_table_glyphs_clean.png" : "/assets/spec-icons/aceray_chair_glyphs_clean.svg"}
                    alt={isTable ? "Aceray Table Measurement Glyphs" : "Aceray Chair Measurement Glyphs"}
                    className={isTable ? "spec-sheet-uploaded-glyphs-img spec-sheet-table-glyphs-img" : "spec-sheet-uploaded-glyphs-img"}
                  />
                </div>

                {/* Numeric Callout Values under drawings */}
                {isTable ? (
                  <div className="spec-sheet-dims-values spec-sheet-table-dims-values">
                    <span className="spec-sheet-dim-val">Dining</span>
                    <span className="spec-sheet-dim-val">{baseSize}</span>
                    <span className="spec-sheet-dim-val">{topSize}</span>
                    <span className="spec-sheet-dim-val">{overallHeight}</span>
                  </div>
                ) : (
                  <div className="spec-sheet-dims-values">
                    <span className="spec-sheet-dim-val">{overallHeight}</span>
                    <span className="spec-sheet-dim-val">{overallDepth}</span>
                    <span className="spec-sheet-dim-val">{overallWidth}</span>
                    <span className="spec-sheet-dim-val">{seatHeight}</span>
                    <span className="spec-sheet-dim-val">{armHeight}</span>
                  </div>
                )}
              </div>

              {/* Specifications Details */}
              <div className="spec-sheet-details-list">
                {isTable ? (
                  <>
                    <p className="spec-sheet-detail-p">
                      Commercial Grade Table Base with Steel Column and Heavy Duty Base Plate.
                    </p>
                    <p className="spec-sheet-detail-p">
                      Available for Indoor and Outdoor Hospitality Environments.
                    </p>
                    <p className="spec-sheet-detail-p">
                      Finishes: Aceray Standard Powder Coat Finishes or Brushed Stainless Steel.
                    </p>
                    <p className="spec-sheet-detail-p">
                      Option: Adjustable Leveling Glides and Custom Height Columns.
                    </p>
                    <p className="spec-sheet-detail-p">
                      Weight: {weight} Lbs.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="spec-sheet-detail-p">
                      Solid Beech Wood Frame Armchair with Fully Upholstered Seat and Back.
                    </p>
                    <p className="spec-sheet-detail-p">
                      Available in COM, COL or Aceray Graded in Upholstery.
                    </p>
                    <p className="spec-sheet-detail-p">
                      Wood Finishes: Aceray Standard Wood Finishes or Custom Match Wood Finishes.
                    </p>
                    <p className="spec-sheet-detail-p">
                      Option: 3” Brushed Stainless Steel Leg Protectors on Two or all Four Legs.
                    </p>
                    <p className="spec-sheet-detail-p">
                      Weight: {weight} Lbs.
                    </p>
                  </>
                )}
              </div>

              {/* Footer */}
              <footer className="spec-sheet-footer">
                <p className="spec-sheet-footer-company">Aceray LLC</p>
                <p className="spec-sheet-footer-line">4465 Kipling St., Suite 202</p>
                <p className="spec-sheet-footer-line">Wheat Ridge, CO 80033</p>
                <p className="spec-sheet-footer-line">Ph: 303 733 3404</p>
                <p className="spec-sheet-footer-line">info@aceray.com</p>
                <p className="spec-sheet-footer-line">©2026 Aceray</p>
              </footer>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalJSX, document.body)
}
