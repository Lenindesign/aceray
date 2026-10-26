import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Printer, X } from 'lucide-react'
import { normalizeDesignerName } from '@/data/designerProfiles'
import './ProductSpecSheetPDF.css'

function parseDescriptionBlocks(text) {
  if (!text || typeof text !== 'string') return []
  const rawParagraphs = text.split(/\r?\n\s*\r?\n/)
  const blocks = []

  const isBulletLine = (line) => /^[-•–*]\s*/.test(line)
  const isListHeader = (line) => /:\s*$/.test(line) || /^(available in|edges|options|finishes|sizes)/i.test(line)

  for (const rawP of rawParagraphs) {
    const lines = rawP
      .split(/\r?\n/)
      .map((l) => l.replace(/&nbsp;/g, ' ').trim())
      .filter(Boolean)

    if (lines.length === 0) continue

    let currentListBlock = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const nextLine = lines[i + 1]

      if (isBulletLine(line)) {
        currentListBlock.push(line)
      } else if (isListHeader(line) && nextLine && isBulletLine(nextLine)) {
        if (currentListBlock.length > 0) {
          blocks.push(currentListBlock.join('\n'))
          currentListBlock = []
        }
        currentListBlock.push(line)
      } else {
        if (currentListBlock.length > 0) {
          blocks.push(currentListBlock.join('\n'))
          currentListBlock = []
        }
        blocks.push(line)
      }
    }

    if (currentListBlock.length > 0) {
      blocks.push(currentListBlock.join('\n'))
    }
  }

  return blocks
}

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

  useEffect(() => {
    if (!isOpen) return
    const origOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = origOverflow
    }
  }, [isOpen])

  if (!isOpen || !product) return null

  const modelTitle = product.title || ''
  const designerName = product.designer ? normalizeDesignerName(product.designer) : ''

  const rawSlug = typeof product.slug === 'object' ? (product.slug?.current || '') : (product.slug || '')
  // Robust determination whether product is truly a table base / table top
  const isTable = (() => {
    // If it has seat height, it is unconditionally seating, never a table
    if (product.seatHeight) return false

    const catList = Array.isArray(product.categories) ? product.categories : []
    const catString = catList
      .map((c) => (typeof c === 'string' ? c : c?.title || c?.name || ''))
      .join(' ')
      .toLowerCase()

    // Explicit seating signals rule out table bases
    const hasSeatingSignal =
      catString.includes('chair') ||
      catString.includes('stool') ||
      catString.includes('lounge') ||
      catString.includes('bench') ||
      catString.includes('ottoman') ||
      catString.includes('seating')
    if (hasSeatingSignal) return false

    const title = (product.title || '').toLowerCase()
    const slug = (typeof product.slug === 'string' ? product.slug : product.slug?.current || '').toLowerCase()

    // Explicit table base categories
    if (
      catString.includes('table base') ||
      catString.includes('table top') ||
      catString.includes('tables & bases') ||
      catString.includes('tables')
    ) {
      return true
    }

    return (
      title.includes('table base') ||
      title.includes('table top') ||
      slug.includes('table-base') ||
      slug.includes('table-top') ||
      slug.startsWith('piazza') ||
      slug.startsWith('dsmaxi') ||
      slug.startsWith('dqmaxi')
    )
  })()

  const getImageUrl = (img) => {
    if (!img) return null
    if (typeof img === 'string') return img.includes('aceray.com') ? null : img
    if (img.asset?.url) return img.asset.url
    return null
  }

  const allImages = [
    getImageUrl(product.mainImage),
    ...(product.gallery || []).map(getImageUrl),
    ...(product.galleryUrls || []),
    product.imageUrl
  ].filter(Boolean)

  const uniqueImages = Array.from(new Set(allImages))
  const heroImage = uniqueImages[0] || product.imageUrl || ''
  const galleryThumbnails = uniqueImages.slice(1, 4)

  const formatDimValue = (val) => {
    if (!val) return ''
    const cleaned = String(val).trim().replace(/"+$/g, '').trim()
    return cleaned ? `${cleaned}"` : ''
  }

  const overallHeight = formatDimValue(product.overallHeight)
  const overallDepth = formatDimValue(product.overallDepth)
  const overallWidth = formatDimValue(product.overallWidth)
  const seatHeight = formatDimValue(product.seatHeight)
  const armHeight = formatDimValue(product.armHeight)
  const hasArmHeight = Boolean(armHeight && armHeight !== '–' && armHeight !== '-')

  const baseSize = formatDimValue(product.baseSize)
  const topSize = product.topSize ? String(product.topSize).trim() : ''

  const descriptionBlocks = parseDescriptionBlocks(product.description)

  const handlePrint = () => {
    window.print()
  }

  const modalJSX = (
    <div
      className="spec-sheet-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Spec Sheet for ${modelTitle}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
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
            <span className="spec-sheet-print-text-full">Print / Save PDF</span>
            <span className="spec-sheet-print-text-short">Print PDF</span>
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
              {designerName && (
                <div className="spec-sheet-designer-meta">
                  <span className="spec-sheet-designer-label">Design:</span>
                  <span className="spec-sheet-designer-name">{designerName}</span>
                </div>
              )}
            </div>
          </header>

          {/* Document Body */}
          <div className="spec-sheet-body">
            {/* Vertical Rule Line */}
            <div className="spec-sheet-divider-rule" aria-hidden="true" />

            {/* Left Column (Thumbnails, Hero Photo) */}
            <div className="spec-sheet-main-col">
              {/* Top Row Thumbnails */}
              {galleryThumbnails.length > 0 && (
                <div className="spec-sheet-thumbnails-row">
                  {galleryThumbnails.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${modelTitle} view ${idx + 1}`}
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
              {/* Title Bullet */}
              <div className="spec-sheet-product-title-bullet">
                • {modelTitle}
              </div>

              {/* Exact Architectural Measurement Line Drawings & Coupled Values */}
              <div className="spec-sheet-dims-container">
                {isTable ? (
                  <>
                    <div className="spec-sheet-dims-diagrams-wrap">
                      <img
                        src="/assets/spec-icons/aceray_table_glyphs_clean.png"
                        alt="Aceray Table Measurement Glyphs"
                        className="spec-sheet-uploaded-glyphs-img spec-sheet-table-glyphs-img"
                      />
                    </div>
                    <div className="spec-sheet-dims-values spec-sheet-table-dims-values">
                      <span className="spec-sheet-dim-val">{overallHeight ? 'Dining' : '–'}</span>
                      <span className="spec-sheet-dim-val">{baseSize || '–'}</span>
                      <span className="spec-sheet-dim-val">{topSize || '–'}</span>
                      <span className="spec-sheet-dim-val">{overallHeight || '–'}</span>
                    </div>
                  </>
                ) : (
                  <div className={`spec-sheet-dims-grid ${hasArmHeight ? 'spec-sheet-dims-grid-5' : ''}`}>
                    {[
                      {
                        key: 'overallHeight',
                        label: 'Overall Height',
                        value: overallHeight,
                        d: 'M239.50782-201.5625H224.91895V-215H223V-186.67969H224.91895V-201.1211H239.50782V-186.67969H240.22998V-201.1211-201.5625H239.50782Z',
                        tx: -222.6,
                        ty: 215.8,
                      },
                      {
                        key: 'overallDepth',
                        label: 'Overall Depth',
                        value: overallDepth,
                        d: 'M260.8711-201.5625H245.07813V-215H244.36328V-186.67969H245.07813V-199.8789H260.8711V-186.67969H261.59327V-199.8789-201.5625H260.8711Z',
                        tx: -243.96,
                        ty: 215.8,
                      },
                      {
                        key: 'overallWidth',
                        label: 'Overall Width',
                        value: overallWidth,
                        d: 'M265.68019-201.5625V-214.5586H281.47315V-201.5625H265.68019ZM281.83546-215H281.47315 265.68019 265.20167 264.96534V-186.67969H265.68019V-199.8789H281.47315V-186.67969H282.1953V-199.8789-201.5625-215H281.83546Z',
                        tx: -264.57,
                        ty: 215.8,
                      },
                      {
                        key: 'seatHeight',
                        label: 'Seat Height',
                        value: seatHeight,
                        d: 'M300.9004-201.5625H286.08497V-215H285.37013V-186.67969H286.08497V-201.1211H300.9004V-186.67969H302.53224V-201.1211-201.5625H300.9004Z',
                        tx: -284.97,
                        ty: 215.8,
                      },
                      ...(hasArmHeight
                        ? [
                            {
                              key: 'armHeight',
                              label: 'Arm Height',
                              value: armHeight,
                              d: 'M320.83888-201.5625H306.02345V-206.63574H320.83888V-201.5625ZM320.83888-207.07715H306.02345V-215H305.3086V-186.67969H306.02345V-201.1211H320.83888V-186.67969H322.4707V-201.1211-201.5625-206.63574-207.07715H320.83888Z',
                              tx: -304.91,
                              ty: 215.8,
                            },
                          ]
                        : []),
                    ].map((glyph) => (
                      <div
                        key={glyph.key}
                        className="spec-sheet-dim-unit"
                        title={`${glyph.label}: ${glyph.value || '–'}`}
                      >
                        <svg
                          viewBox="0 0 18 30"
                          className="spec-sheet-dim-glyph"
                          aria-label={glyph.label}
                        >
                          <path
                            transform={`matrix(1,0,0,1,${glyph.tx},${glyph.ty})`}
                            d={glyph.d}
                            fill="#111827"
                          />
                        </svg>
                        <span className="spec-sheet-dim-val">{glyph.value || '–'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications Details - Exact Information from Product Page */}
              <div className="spec-sheet-details-list">
                {descriptionBlocks.length > 0 ? (
                  descriptionBlocks.map((block, idx) => (
                    <p key={idx} className="spec-sheet-detail-p">
                      {block}
                    </p>
                  ))
                ) : (
                  <p className="spec-sheet-detail-p">
                    {modelTitle} commercial grade {isTable ? 'table base' : 'seating'} designed for hospitality, corporate, and dining environments.
                  </p>
                )}

                {product.weight && (
                  <p className="spec-sheet-detail-p">
                    Weight: {product.weight} lbs.
                  </p>
                )}
                {product.com && (
                  <p className="spec-sheet-detail-p">
                    COM: {product.com} yards
                  </p>
                )}
                {product.stacking && product.stacking !== 'No' && (
                  <p className="spec-sheet-detail-p">
                    Stacking: {product.stacking}
                  </p>
                )}
                {product.madeIn && (
                  <p className="spec-sheet-detail-p">
                    Made In: {product.madeIn}
                  </p>
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

              {/* Mobile Action Bar */}
              <div className="spec-sheet-mobile-actions">
                <button
                  type="button"
                  className="spec-sheet-print-btn spec-sheet-mobile-print-btn"
                  onClick={handlePrint}
                  aria-label="Print or save as PDF"
                >
                  <Printer size={16} aria-hidden="true" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalJSX, document.body)
}
