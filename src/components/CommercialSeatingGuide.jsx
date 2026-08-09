import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Layers, ShieldCheck, Armchair, Utensils, Sun, HelpCircle, ArrowRight } from 'lucide-react'

const TABS = [
  {
    id: 'chairs',
    title: 'Side & Armchairs',
    icon: Utensils,
    eyebrow: 'CONTRACT DINING & SIDE CHAIRS',
    headline: 'Structural Engineering for High-Turn Dining Environments',
    description:
      "Commercial dining chairs endure relentless daily traffic, water rings, and harsh sanitizers. Aceray's solid wood side chairs and armchairs are crafted from kiln-dried European beech and oak (dried to 6–8% moisture content to eliminate warping). Joints are constructed with mortise-and-tenon framing and corner-blocked stress reinforcement, preventing the wobbles common in dowel-only residential construction.",
    bulletPoints: [
      'BIFMA Tested & Certified: Engineered for 400–500 lb static and dynamic weight loads.',
      'Catalyzed Lacquer Finishes: Multi-stage protective clear coats resistant to alcohol, liquids, and commercial cleaners.',
      'Stackable Efficiency: Select dining and side chair models stack 6 to 10 high for seamless space reconfiguration.'
    ],
    ctaText: 'Browse Dining & Armchairs',
    ctaLink: '/catalog?cat=side-chairs'
  },
  {
    id: 'lounge',
    title: 'Lounge & Swivel',
    icon: Armchair,
    eyebrow: 'HOSPITALITY LOUNGE & EXECUTIVE SEATING',
    headline: 'Ergonomic Comfort with High-Rub Commercial Upholstery',
    description:
      'Lounge seating in hotel lobbies, wine bars, and corporate suites demands deep ergonomic support and exceptional fabric longevity. Aceray utilizes commercial-grade molded polyurethane foam (1.8 to 2.5 lb density) that maintains shape memory under heavy dwell time, outperforming residential cut foam.',
    bulletPoints: [
      'Wyzenbeek Abrasion Standards: Contract upholstery rated from 30,000 up to 100,000+ double rubs for extreme durability.',
      'Heavy-Duty Swivel Mechanisms: Smooth 360-degree or auto-return swivel bases built with heavy-gauge steel ball bearings.',
      'COM / COL Support: Customer’s Own Material (COM) and Leather (COL) tailoring available across all upholstered seating.'
    ],
    ctaText: 'Explore Lounge Seating',
    ctaLink: '/catalog?cat=lounge'
  },
  {
    id: 'stools',
    title: 'Barstools & Counter',
    icon: Layers,
    eyebrow: 'BARSTOOLS & COUNTER SEATING',
    headline: 'Precision Height Rules & Reinforced Footrest Systems',
    description:
      'Proper seat height alignment is essential for guest posture and comfort. Standard 42" bar counters require 30" seat-height commercial barstools, while 36" kitchen or hospitality counters require 24" seat-height counter stools. Aceray stools feature stainless steel or brass protective kickplates on wood footrests to prevent heel wear.',
    bulletPoints: [
      'Fully Welded Steel & Aluminum Frames: Single-unit welded joints that never loosen or require retightening.',
      'Integrated Heel Kickplates: Stainless steel footrest protection against scuffs and shoe abrasion.',
      'Backless & Backed Options: Low-profile backless stools for compact bar rails or supportive backs for long dining sessions.'
    ],
    ctaText: 'View Barstools & Counter Stools',
    ctaLink: '/catalog?cat=barstools'
  },
  {
    id: 'tables',
    title: 'Tables & Base Systems',
    icon: ShieldCheck,
    eyebrow: 'CONTRACT TABLE TOPS & BASES',
    headline: 'Anti-Wobble Stability with Versatile Commercial Tops',
    description:
      'A shaky table ruins the guest experience. Aceray commercial table base systems utilize heavy-duty cast iron and precision steel columns fitted with adjustable anti-wobble floor glides. Pair with solid wood, laminate, or weather-resistant Extrema compact tops engineered for high-turn contract venues.',
    bulletPoints: [
      'Heavy Cast Iron & Steel Bases: Low center of gravity prevents tipping even under heavy edge pressure.',
      'Extrema Compact Tops: Heat, scratch, and impact resistant surfaces engineered for indoor and outdoor commercial use.',
      'Custom Stains & Edging: Solid wood knife-edge, flat-edge, and brass inlay detailing tailored to project specs.'
    ],
    ctaText: 'Explore Table Collections',
    ctaLink: '/catalog?cat=tables'
  },
  {
    id: 'outdoor',
    title: 'Outdoor Living',
    icon: Sun,
    eyebrow: 'ALL-WEATHER OUTDOOR FURNITURE',
    headline: 'UV-Inhibited Materials & Weather-Resistant Hardware',
    description:
      'Outdoor patio dining and resort pool decks require furniture impervious to salt spray, humidity, and intense sun exposure. Aceray outdoor collections feature rust-proof aluminum frames, 2+ mil baked powder coating, UV-treated synthetic weaves, and fast-drying reticulated foam cushions.',
    bulletPoints: [
      'Rust-Proof Aluminum & Steel: Corrosion-resistant frame alloys suited for coastal and poolside hospitality environments.',
      'UV-Protected Synthetic Fibers: Weaves that resist fading, cracking, and moisture absorption over years of sun exposure.',
      'Quick-Drain Upholstery: Open-cell reticulated foam lets rainwater pass through rapidly, reducing drying time.'
    ],
    ctaText: 'Explore Outdoor Living',
    ctaLink: '/catalog?cat=outdoors'
  }
]

const FAQS = [
  {
    question: 'What commercial durability standards do Aceray chairs and tables meet?',
    answer:
      'Aceray seating and table systems are engineered to pass rigorous BIFMA (Business and Institutional Furniture Manufacturers Association) static load, impact, fatigue, and stability tests. Seating models feature minimum 400 to 500 lb weight capacities, mortise-and-tenon wood joinery, and fully welded metal frames for high-traffic contract applications.'
  },
  {
    question: 'What double-rub count is recommended for commercial hospitality upholstery?',
    answer:
      'While residential upholstery typically rates around 15,000 double rubs, contract commercial environments require a minimum of 30,000 double rubs (Wyzenbeek method). High-volume operations, hotel lobbies, and dining rooms benefit from 50,000 to 100,000+ double-rub fabrics, commercial vinyls, or performance faux leathers that withstand frequent cleaning.'
  },
  {
    question: 'How do I determine the correct seat height for barstools and counter stools?',
    answer:
      'For 42" high bar counters or bar rails, specify 30" seat-height barstools (allowing 12" of lap clearance). For 36" high counters or kitchen islands, specify 24" seat-height counter stools. Maintaining an 10" to 12" gap between the seat top and table underside ensures optimal guest comfort.'
  },
  {
    question: 'Does Aceray offer COM (Customer’s Own Material) and custom wood finishes?',
    answer:
      'Yes. Aceray supports Customer’s Own Material (COM) and Customer’s Own Leather (COL) across upholstered collections. We also offer custom wood staining to match architectural millwork samples, custom powder-coat metal finishes, and tailored table top dimensions for trade professionals.'
  },
  {
    question: 'What is the difference between molded commercial foam and cut residential foam?',
    answer:
      'Commercial molded foam (typically 1.8 to 2.5 lb density) is cast in individual molds, creating a supportive outer skin that holds structural shape and firmness over years of heavy daily use. Residential cut foam (around 1.5 lb density) compresses prematurely, causing sagging and upholstery wrinkling.'
  },
  {
    question: 'Are 3D CAD files, Revit BIM models, and spec sheets available for A&D specifiers?',
    answer:
      'Yes. Aceray provides downloadable spec sheets, 2D/3D CAD files, Revit BIM objects, and high-resolution finish swatches directly on individual product pages to assist architects, interior designers, and procurement teams during space planning.'
  }
]

export default function CommercialSeatingGuide() {
  const [activeTab, setActiveTab] = useState('chairs')
  const [openFaq, setOpenFaq] = useState(null)

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0]

  // Inject Schema.org FAQPage JSON-LD for AI search engines & Google Rich Snippets
  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }

    let script = document.getElementById('faq-jsonld')
    if (!script) {
      script = document.createElement('script')
      script.id = 'faq-jsonld'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(faqSchema)

    return () => {
      document.getElementById('faq-jsonld')?.remove()
    }
  }, [])

  return (
    <section className="commercial-guide-section">
      <div className="container">
        {/* Section Header */}
        <div className="commercial-guide-header">
          <span className="designer-eyebrow">SPECIFICATION GUIDE &amp; RESOURCES</span>
          <h2>Commercial Seating &amp; Table Specifications</h2>
          <p className="commercial-guide-subtitle">
            Technical guidance for interior designers, architects, and hospitality procurement specialists on frame engineering, upholstery double-rub ratings, and venue selection.
          </p>
        </div>

        {/* Interactive Category Tabs */}
        <div className="commercial-guide-tabs" role="tablist" aria-label="Commercial furniture categories">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`guide-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="guide-tab-icon" aria-hidden="true" />
                <span>{tab.title}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content Display Card */}
        <div className="guide-content-card" role="tabpanel">
          <div className="guide-content-body">
            <span className="guide-tag">{currentTab.eyebrow}</span>
            <h3 className="guide-headline">{currentTab.headline}</h3>
            <p className="guide-description">{currentTab.description}</p>

            <ul className="guide-bullets">
              {currentTab.bulletPoints.map((point, index) => (
                <li key={index}>
                  <ShieldCheck className="guide-bullet-icon" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="guide-actions">
              <Link to={currentTab.ctaLink} className="btn-primary">
                {currentTab.ctaText}
                <ArrowRight className="ml-2 w-4 h-4 inline" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="commercial-faq-wrap">
          <div className="faq-header">
            <HelpCircle className="faq-header-icon" aria-hidden="true" />
            <div>
              <span className="designer-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
              <h3>Contract Seating &amp; Table FAQs</h3>
            </div>
          </div>

          <div className="faq-accordion-list">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={index} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`faq-chevron ${isOpen ? 'rotate' : ''}`} aria-hidden="true" />
                  </button>

                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
