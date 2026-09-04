import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Layers, ShieldCheck, Armchair, Utensils, Sun, ArrowRight } from 'lucide-react'

const TABS = [
  {
    id: 'chairs',
    title: 'Side & Armchairs',
    icon: Utensils,
    eyebrow: 'CONTRACT DINING & SIDE CHAIRS',
    headline: 'Structural Engineering for High-Turn Dining Environments',
    description:
      "Commercial dining chairs endure relentless daily traffic, water rings, and harsh sanitizers. Aceray's solid wood side chairs and armchairs are crafted from kiln-dried European beech and oak (dried to 6–8% moisture content to eliminate warping). Joints are constructed with mortise-and-tenon framing and corner-blocked stress reinforcement, preventing the wobbles common in dowel-only residential construction.",
    specs: [
      {
        term: 'BIFMA Certification & Load Ratings',
        definition: 'Engineered for 400–500 lb static and dynamic weight loads for high-traffic contract dining venues.'
      },
      {
        term: 'Kiln-Dried European Hardwood',
        definition: 'Dried to 6–8% moisture content to eliminate frame warping or joint loosening in variable humidity.'
      },
      {
        term: 'Catalyzed Lacquer Protective Finishes',
        definition: 'Multi-stage protective clear coats resistant to alcohol, liquid spills, and commercial sanitizing cleaners.'
      },
      {
        term: 'Stackable Efficiency',
        definition: 'Select dining and side chair models stack 6 to 10 high for seamless space reconfiguration and storage.'
      }
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
    specs: [
      {
        term: 'Wyzenbeek Abrasion Standards',
        definition: 'Contract upholstery rated from 30,000 up to 100,000+ double rubs for extreme commercial durability.'
      },
      {
        term: 'Molded Polyurethane Foam Density',
        definition: '1.8 to 2.5 lb density cast foam maintaining structural memory and firm shape retention over years of heavy use.'
      },
      {
        term: 'Heavy-Duty Swivel Mechanisms',
        definition: 'Smooth 360-degree or auto-return swivel bases built with heavy-gauge steel ball bearings.'
      },
      {
        term: 'COM / COL Support',
        definition: 'Customer’s Own Material (COM) and Leather (COL) custom tailoring available across all upholstered seating.'
      }
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
    specs: [
      {
        term: 'Seat Height Specifications',
        definition: '30" seat height for 42" bar rails; 24" seat height for 36" counter tops (maintaining 10"–12" lap clearance).'
      },
      {
        term: 'Fully Welded Steel & Aluminum Frames',
        definition: 'Single-unit welded joints that never loosen or require retightening over years of daily service.'
      },
      {
        term: 'Integrated Heel Kickplates',
        definition: 'Stainless steel and brass footrest protection against scuffs, shoe abrasion, and finish wear.'
      },
      {
        term: 'Backless & Backed Options',
        definition: 'Low-profile backless stools for compact bar rails or supportive backs for long dining sessions.'
      }
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
    specs: [
      {
        term: 'Heavy Cast Iron & Steel Base Columns',
        definition: 'Low center of gravity prevents tipping even under heavy edge pressure or guest lean.'
      },
      {
        term: 'Extrema Compact Tops',
        definition: 'Heat, scratch, and impact resistant compact laminate surfaces engineered for indoor and outdoor commercial venues.'
      },
      {
        term: 'Anti-Wobble Floor Glides',
        definition: 'Adjustable leveling glides preventing table rock on uneven venue flooring.'
      },
      {
        term: 'Custom Stains & Edging Details',
        definition: 'Solid wood knife-edge, flat-edge, and brass inlay detailing tailored to project architectural specs.'
      }
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
    specs: [
      {
        term: 'Rust-Proof Aluminum & Steel Alloys',
        definition: 'Corrosion-resistant frame alloys suited for coastal, oceanfront, and poolside hospitality environments.'
      },
      {
        term: 'UV-Protected Synthetic Fibers',
        definition: 'Woven synthetic fibers that resist fading, cracking, and moisture absorption over years of sun exposure.'
      },
      {
        term: 'Quick-Drain Upholstery Foam',
        definition: 'Open-cell reticulated foam lets rainwater pass through rapidly, dramatically reducing drying time.'
      },
      {
        term: 'Baked Powder Coating',
        definition: '2+ mil protective baked coating resistant to chipping, scratching, and salt spray exposure.'
      }
    ],
    ctaText: 'Explore Outdoor Living',
    ctaLink: '/catalog?cat=outdoors'
  }
]

const FAQS = [
  {
    question: 'What weight capacity and durability standards do Aceray commercial chairs meet?',
    answer:
      'Aceray contract seating is engineered to meet or exceed BIFMA X5.1 (office/dining) and BIFMA X5.4 (lounge) standards, supporting static and dynamic weight capacities of 400 to 500+ lbs. Frames are constructed with kiln-dried European hardwood (6–8% moisture content), mortise-and-tenon joinery, and fully welded steel or aluminum alloys for high-traffic commercial environments.'
  },
  {
    question: 'What double-rub abrasion rating is required for commercial hospitality seating?',
    answer:
      'While residential fabrics rate around 15,000 double rubs, high-traffic contract commercial environments require a minimum of 30,000 double rubs (Wyzenbeek method). For hotel lobbies, restaurants, and corporate spaces, Aceray offers high-performance upholstery, commercial vinyls, and faux leathers rated from 50,000 to 100,000+ double rubs engineered to withstand daily sanitizing cleaners and abrasion.'
  },
  {
    question: 'What are the lead times for Aceray commercial seating, and are Quick Ship options available?',
    answer:
      'Aceray maintains a Ready-to-Ship (Quick Ship) program featuring select contract side chairs, barstools, and lounge models available to ship within 1 to 2 business weeks. Standard factory lead times for custom COM orders, custom wood stains, and tailored table bases typically range from 6 to 10 weeks depending on order volume.'
  },
  {
    question: 'What is the correct seat height for 42" bar counters vs. 36" counter tops?',
    answer:
      'Standard 42" high bar counters require 30" seat-height commercial barstools. Standard 36" high counters or kitchen islands require 24" seat-height counter stools. Maintaining an optimal 10" to 12" clearance between the top of the seat cushion and the underside of the counter ensures proper posture and guest comfort.'
  },
  {
    question: 'Does Aceray support COM/COL upholstery and custom wood stain matching?',
    answer:
      'Yes. Aceray accommodates Customer’s Own Material (COM) and Customer’s Own Leather (COL) across all upholstered seating. Additionally, we provide custom wood stain matching to align with project millwork samples, custom powder-coat metal frame finishes, and custom-sized table top surfaces for trade specifiers.'
  },
  {
    question: 'Why does Aceray use molded polyurethane foam for commercial lounge seating?',
    answer:
      'Aceray utilizes high-density molded polyurethane foam (1.8 to 2.5 lb density) cast in custom steel molds. Unlike low-density residential cut foam that sags under repeated use, molded foam develops a protective outer skin and structural memory, preserving its firm ergonomic shape, comfort, and crisp upholstery appearance through years of heavy daily dwell time.'
  },
  {
    question: 'Can Aceray seating be specified to meet CAL 133 fire safety standards?',
    answer:
      'Yes. Upon request, Aceray seating can be manufactured to comply with California Technical Bulletin 133 (CAL 133) flammability requirements for public spaces, healthcare facilities, and high-occupancy commercial venues when specified with approved fire-retardant barrier materials and COM fabrics.'
  },
  {
    question: 'Where can interior designers and architects download 3D CAD files and Revit BIM models?',
    answer:
      'Architects, interior designers, and procurement specifiers can download 2D/3D CAD models (.DWG, .3DS), Revit BIM families (.RFA), high-resolution finish swatches, and technical specification tear sheets directly from each product page or through our Resources hub.'
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

        {/* Specification Card Container with Integrated Tab Header Bar */}
        <div className="guide-content-card" role="tabpanel">
          {/* Integrated Category Navigation Tab Bar */}
          <div className="guide-card-tabbar" role="tablist" aria-label="Commercial furniture categories">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`guide-card-tab ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.title}</span>
                </button>
              )
            })}
          </div>

          <div className="guide-content-body">
            <span className="guide-tag">{currentTab.eyebrow}</span>
            <h3 className="guide-headline">{currentTab.headline}</h3>
            <p className="guide-description">{currentTab.description}</p>

            {/* Semantic Definition List for Technical Specifications */}
            <dl className="guide-specs-dl mt-6 space-y-4">
              {currentTab.specs.map((spec, index) => (
                <div key={index} className="guide-spec-item py-3 border-b border-[var(--color-border)] last:border-b-0">
                  <dt className="guide-spec-term font-semibold text-[var(--color-text-main)] text-sm">
                    {spec.term}
                  </dt>
                  <dd className="guide-spec-desc text-[var(--color-text-muted)] text-sm mt-1 leading-relaxed">
                    {spec.definition}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="guide-actions mt-8">
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
            <div>
              <span className="designer-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
              <h2>Contract Seating &amp; Table FAQs</h2>
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
                    <h3 className="faq-question-title">{faq.question}</h3>
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
