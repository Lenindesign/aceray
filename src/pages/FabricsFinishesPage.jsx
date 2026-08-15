import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { removeSeoJsonLd, setSeoMetadata, createBreadcrumbJsonLd, ACERAY_ORGANIZATION_SCHEMA } from '@/lib/seo'

export const NOTE = 'Printed colors cannot be guaranteed for accuracy.'

export const WOOD_FINISHES = [
  ['Bleached Beech', '/assets/migrated/fabrics-and-finishes_0005s_0008_Bleached-Beech.jpg'],
  ['Natural Beech', '/assets/migrated/fabrics-and-finishes_0005s_0005_natural-beech.jpg'],
  ['Honey', '/assets/migrated/honey.jpg'],
  ['Oak H', '/assets/migrated/aok-H.png'],
  ['Walnut 1', '/assets/migrated/fabrics-and-finishes_0005s_0004_Waltnut-1.jpg'],
  ['Walnut 2', '/assets/migrated/fabrics-and-finishes_0005s_0003_Waltnut-2.jpg'],
  ['Cherry 1', '/assets/migrated/fabrics-and-finishes_0005s_0007_Cherry-1.jpg'],
  ['Wenge', '/assets/migrated/fabrics-and-finishes_0005s_0001_wenge.jpg'],
  ['Cherry 2', '/assets/migrated/fabrics-and-finishes_0005s_0006_cherry-2.jpg'],
  ['Black', '/assets/migrated/fabrics-and-finishes_0005s_0000_black.jpg'],
  ['Mahogany', '/assets/migrated/fabrics-and-finishes_0005s_0002_mahogany.jpg'],
  ['Gray', '/assets/migrated/gray.jpg'],
  ['Light Beech', '/assets/migrated/light-beech.jpg'],
  ['Light Wenge', '/assets/migrated/light-wenge.jpg'],
  ['Aged Gray', '/assets/migrated/antique-gray.jpg'],
]

export const UPHOLSTERY_PARTNERS = [
  {
    name: 'Arc-Com',
    logo: '/assets/migrated/arc-300x131.jpg',
    url: 'https://arc-com.com/alliance/partners/aceray',
    grades: '/assets/migrated/Arc-Com-2026.pdf',
  },
  {
    name: 'Architex',
    logo: '/assets/migrated/architex-300x131.jpg',
    url: 'https://www.architex-ljh.com/cgi-bin/cob?CPN=home&SID=2222462508438',
    grades: '/assets/migrated/Archtiex-June-2026.pdf',
  },
  {
    name: 'Designtex',
    logo: '/assets/migrated/designtext-300x131.jpg',
    url: 'https://www.designtex.com',
    grades: '/assets/migrated/2026-designtex.pdf',
  },
  {
    name: 'Maharam',
    logo: '/assets/migrated/maharam-300x131.jpg',
    url: 'https://www.maharam.com',
    grades: '/assets/migrated/2026-Maharam.pdf',
  },
  {
    name: 'Mayer Fabrics',
    logo: '/assets/migrated/Mayer-Fabrics_Stack-logo_Pantone-426.webp',
    url: 'https://www.mayerfabrics.com',
    grades: '/assets/migrated/2026-Mayer.pdf',
  },
  {
    name: 'Momentum Textiles',
    logo: '/assets/migrated/momentum-300x131.jpg',
    url: 'https://www.memosamples.com/momentum_textiles.shtml',
    grades: '/assets/migrated/Momentum-2026.pdf',
  },
  {
    name: 'CF Stinson',
    logo: '/assets/migrated/Stinson-see-sample-spec-logo-e1569859977863.jpg',
    url: 'https://cfstinson.com/Finishes/Samples.jsp?lid=4043',
    grades: '/assets/migrated/CF-Stinson-2026.pdf',
  },
]

export const VINYL_GROUPS = [
  {
    title: 'Planet',
    grade: 'Grade A',
    colors: [
      ['151', '/assets/migrated/fabrics-and-finishes_0001s_0025_151.jpg'],
      ['1110', '/assets/migrated/fabrics-and-finishes_0001s_0024_1110.jpg'],
      ['1194', '/assets/migrated/fabrics-and-finishes_0001s_0023_1194.jpg'],
      ['1307', '/assets/migrated/fabrics-and-finishes_0001s_0022_1307.jpg'],
      ['71', '/assets/migrated/fabrics-and-finishes_0001s_0021_71.jpg'],
      ['680', '/assets/migrated/fabrics-and-finishes_0001s_0020_680.jpg'],
      ['1305', '/assets/migrated/fabrics-and-finishes_0001s_0018_1305.jpg'],
      ['717', '/assets/migrated/fabrics-and-finishes_0001s_0017_717.jpg'],
      ['726', '/assets/migrated/fabrics-and-finishes_0001s_0016_726.jpg'],
      ['1809', '/assets/migrated/fabrics-and-finishes_0001s_0015_1809.jpg'],
      ['1831', '/assets/migrated/fabrics-and-finishes_0001s_0014_1831.jpg'],
      ['1830', '/assets/migrated/fabrics-and-finishes_0001s_0013_1830.jpg'],
      ['1817', '/assets/migrated/fabrics-and-finishes_0001s_0012_1817.jpg'],
      ['4915', '/assets/migrated/fabrics-and-finishes_0001s_0011_4915.jpg'],
      ['4947', '/assets/migrated/fabrics-and-finishes_0001s_0010_4947.jpg'],
      ['4979', '/assets/migrated/fabrics-and-finishes_0001s_0009_4979.jpg'],
      ['1915', '/assets/migrated/fabrics-and-finishes_0001s_0008_1915.jpg'],
      ['4975', '/assets/migrated/fabrics-and-finishes_0001s_0007_4975.jpg'],
      ['4981', '/assets/migrated/fabrics-and-finishes_0001s_0006_4981.jpg'],
      ['6', '/assets/migrated/fabrics-and-finishes_0001s_0005_6.jpg'],
      ['4008', '/assets/migrated/fabrics-and-finishes_0001s_0004_4008.jpg'],
      ['4009', '/assets/migrated/fabrics-and-finishes_0001s_0003_4009.jpg'],
      ['1955', '/assets/migrated/fabrics-and-finishes_0001s_0002_1955.jpg'],
      ['1984', '/assets/migrated/fabrics-and-finishes_0001s_0001_1984.jpg'],
      ['991', '/assets/migrated/fabrics-and-finishes_0001s_0000_991.jpg'],
    ],
  },
  {
    title: 'Skill',
    grade: 'Grade A',
    colors: [
      ['1', '/assets/migrated/wgite.jpg'],
      ['2', '/assets/migrated/fabrics-and-finishes_0000s_0001_2.jpg'],
      ['3', '/assets/migrated/fabrics-and-finishes_0000s_0002_3.jpg'],
      ['4', '/assets/migrated/fabrics-and-finishes_0000s_0023_4.jpg'],
      ['5', '/assets/migrated/fabrics-and-finishes_0000s_0003_5.jpg'],
      ['6', '/assets/migrated/fabrics-and-finishes_0000s_0004_6.jpg'],
      ['9', '/assets/migrated/fabrics-and-finishes_0000s_0005_9.jpg'],
      ['10', '/assets/migrated/fabrics-and-finishes_0000s_0006_10.jpg'],
      ['11', '/assets/migrated/fabrics-and-finishes_0000s_0007_11.jpg'],
      ['12', '/assets/migrated/fabrics-and-finishes_0000s_0008_12.jpg'],
      ['7', '/assets/migrated/fabrics-and-finishes_0000s_0009_7.jpg'],
      ['8', '/assets/migrated/fabrics-and-finishes_0000s_0010_8.jpg'],
      ['17', '/assets/migrated/fabrics-and-finishes_0000s_0011_17.jpg'],
      ['18', '/assets/migrated/fabrics-and-finishes_0000s_0012_18.jpg'],
      ['16', '/assets/migrated/fabrics-and-finishes_0000s_0013_16.jpg'],
      ['15', '/assets/migrated/fabrics-and-finishes_0000s_0014_15.jpg'],
      ['13', '/assets/migrated/fabrics-and-finishes_0000s_0015_13.jpg'],
      ['14', '/assets/migrated/fabrics-and-finishes_0000s_0016_14.jpg'],
      ['20', '/assets/migrated/fabrics-and-finishes_0000s_0017_20.jpg'],
      ['19', '/assets/migrated/fabrics-and-finishes_0000s_0018_19.jpg'],
      ['21', '/assets/migrated/fabrics-and-finishes_0000s_0019_21.jpg'],
      ['22', '/assets/migrated/fabrics-and-finishes_0000s_0020_22.jpg'],
      ['23', '/assets/migrated/fabrics-and-finishes_0000s_0021_23.jpg'],
      ['24', '/assets/migrated/fabrics-and-finishes_0000s_0022_24.jpg'],
    ],
  },
  {
    title: 'Aurea',
    grade: 'Grade B',
    colors: [
      ['12', '/assets/migrated/fabrics-and-finishes_0004s_0000_12.jpg'],
      ['17', '/assets/migrated/fabrics-and-finishes_0004s_0001_17.jpg'],
      ['22', '/assets/migrated/fabrics-and-finishes_0004s_0002_22.jpg'],
      ['13', '/assets/migrated/fabrics-and-finishes_0004s_0003_13.jpg'],
      ['18', '/assets/migrated/fabrics-and-finishes_0004s_0004_18.jpg'],
      ['23', '/assets/migrated/fabrics-and-finishes_0004s_0005_23.jpg'],
      ['14', '/assets/migrated/fabrics-and-finishes_0004s_0006_14.jpg'],
      ['19', '/assets/migrated/fabrics-and-finishes_0004s_0007_19.jpg'],
      ['24', '/assets/migrated/fabrics-and-finishes_0004s_0008_24.jpg'],
      ['15', '/assets/migrated/fabrics-and-finishes_0004s_0009_15.jpg'],
      ['20', '/assets/migrated/fabrics-and-finishes_0004s_0010_20.jpg'],
      ['25', '/assets/migrated/fabrics-and-finishes_0004s_0011_25.jpg'],
      ['16', '/assets/migrated/fabrics-and-finishes_0004s_0012_16.jpg'],
      ['21', '/assets/migrated/fabrics-and-finishes_0004s_0013_21.jpg'],
      ['26', '/assets/migrated/fabrics-and-finishes_0004s_0014_26.jpg'],
      ['2', '/assets/migrated/fabrics-and-finishes_0004s_0015_2.jpg'],
      ['7', '/assets/migrated/fabrics-and-finishes_0004s_0016_7.jpg'],
      ['3', '/assets/migrated/fabrics-and-finishes_0004s_0017_3.jpg'],
      ['8', '/assets/migrated/fabrics-and-finishes_0004s_0018_8.jpg'],
      ['4', '/assets/migrated/fabrics-and-finishes_0004s_0019_4.jpg'],
      ['1', '/assets/migrated/wgite.jpg'],
      ['9', '/assets/migrated/fabrics-and-finishes_0004s_0020_9.jpg'],
      ['5', '/assets/migrated/fabrics-and-finishes_0004s_0021_5.jpg'],
      ['10', '/assets/migrated/fabrics-and-finishes_0004s_0022_10.jpg'],
      ['6', '/assets/migrated/fabrics-and-finishes_0004s_0023_6.jpg'],
      ['11', '/assets/migrated/fabrics-and-finishes_0004s_0024_11.jpg'],
    ],
  },
  {
    title: 'Extrema Metal',
    grade: 'Grade D',
    colors: [
      ['5350', '/assets/migrated/fabrics-and-finishes_0002s_0000_5350.jpg'],
      ['5450', '/assets/migrated/fabrics-and-finishes_0002s_0001_5450.jpg'],
      ['6050', '/assets/migrated/fabrics-and-finishes_0002s_0002_6050.jpg'],
      ['6750', '/assets/migrated/fabrics-and-finishes_0002s_0003_6750.jpg'],
      ['6650', '/assets/migrated/fabrics-and-finishes_0002s_0006_6650.jpg'],
      ['6850', '/assets/migrated/fabrics-and-finishes_0002s_0004_6850.jpg'],
      ['6350', '/assets/migrated/fabrics-and-finishes_0002s_0005_6350.jpg'],
      ['6250', '/assets/migrated/fabrics-and-finishes_0002s_0022_6250.jpg'],
      ['6150', '/assets/migrated/fabrics-and-finishes_0002s_0007_6150.jpg'],
      ['7150', '/assets/migrated/fabrics-and-finishes_0002s_0008_7150.jpg'],
      ['7250', '/assets/migrated/fabrics-and-finishes_0002s_0009_7250.jpg'],
      ['7350', '/assets/migrated/fabrics-and-finishes_0002s_0021_7350.jpg'],
      ['5050', '/assets/migrated/fabrics-and-finishes_0002s_0010_5050.jpg'],
      ['5950', '/assets/migrated/fabrics-and-finishes_0002s_0011_5950.jpg'],
      ['5250', '/assets/migrated/fabrics-and-finishes_0002s_0012_5250.jpg'],
      ['5150', '/assets/migrated/fabrics-and-finishes_0002s_0020_5150.jpg'],
      ['6450', '/assets/migrated/fabrics-and-finishes_0002s_0013_6450.jpg'],
      ['6550', '/assets/migrated/fabrics-and-finishes_0002s_0014_6550.jpg'],
      ['5750', '/assets/migrated/fabrics-and-finishes_0002s_0015_5750.jpg'],
      ['5550', '/assets/migrated/fabrics-and-finishes_0002s_0019_5550.jpg'],
      ['5850', '/assets/migrated/fabrics-and-finishes_0002s_0016_5850.jpg'],
      ['6950', '/assets/migrated/fabrics-and-finishes_0002s_0017_6950.jpg'],
      ['7050', '/assets/migrated/fabrics-and-finishes_0002s_0018_7050.jpg'],
    ],
  },
]

export const TABLE_BASE_FINISHES = [
  ['Black', '/assets/migrated/Metal-table-finish-black.png'],
  ['Graphite', '/assets/migrated/Metal-table-finish-graphite.png'],
  ['Brown', '/assets/migrated/Metal-table-finish-brown.png'],
  ['Silver', '/assets/migrated/Metal-table-finish-silver.png'],
  ['White', '/assets/migrated/Metal-table-finish-white.png'],
  ['Brushed Brass', '/assets/migrated/Metal-table-finish-brushed-brass.png'],
  ['Polished Stainless Steel', '/assets/migrated/Metal-table-finish-polished-stainless-steel.png'],
  ['Brushed Stainless Steel', '/assets/migrated/Metal-table-finish-brushed-stainless-steel.png'],
  ['Chrome', '/assets/migrated/Metal-table-finish-chrome.png'],
  ['Aged Brass', '/assets/migrated/Metal-table-finish-aged-brass.png'],
  ['Aged Copper', '/assets/migrated/Metal-table-finish-aged-copper.png'],
  ['Corten', '/assets/migrated/Metal-table-finish-corten.png'],
  ['Distressed Steel', '/assets/migrated/Metal-table-finish-distressed-steel.png'],
]

function SwatchCard({ label, src }) {
  return (
    <article className="finish-swatch-card">
      <img className="finish-swatch" src={src} alt={`${label} finish swatch`} loading="lazy" />
      <h3>{label}</h3>
    </article>
  )
}

function FinishSection({ id, eyebrow, title, children }) {
  return (
    <section className="finish-section" id={id}>
      <div className="finish-section-heading">
        <span className="finish-section-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{NOTE}</p>
      </div>
      {children}
    </section>
  )
}

export default function FabricsFinishesPage() {
  useEffect(() => {
    setSeoMetadata({
      title: 'Fabrics & Finishes | Aceray Commercial Furniture',
      description: 'Explore Aceray wood finishes, graded-in upholstery partners, vinyl qualities, metal table finishes, and finish sample options for contract projects.',
      path: '/fabrics-finishes',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ItemPage',
            name: 'Fabrics & Finishes',
            description: 'Explore Aceray wood finishes, graded-in upholstery partners, vinyl qualities, metal table finishes, and finish sample options for contract projects.',
            publisher: { '@id': 'https://aceray.com/#organization' },
          },
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Fabrics & Finishes', path: '/fabrics-finishes' },
          ]),
          ACERAY_ORGANIZATION_SCHEMA,
        ],
      },
    })
    removeSeoJsonLd('product-jsonld')
  }, [])

  return (
    <div className="fabrics-page">
      <section className="container fabrics-page-hero">
        <div className="fabrics-page-heading">
          <span className="fabrics-page-eyebrow">Design Resources</span>
          <h1>Fabrics &amp; Finishes</h1>
          <p>
            Explore Aceray wood finishes, graded-in upholstery partners, vinyl qualities, and table base finish options for contract seating and hospitality projects.
          </p>
        </div>

        <div className="finish-jump-nav" aria-label="Fabrics and finishes sections">
          <a href="#wood-finishes">Wood</a>
          <a href="#upholstery">Upholstery</a>
          <a href="#vinyl">Vinyl</a>
          <a href="#table-bases">Table Bases</a>
        </div>
      </section>

      <div className="container fabrics-page-content">
        <FinishSection id="wood-finishes" eyebrow="Aceray Standard" title="Wood Finishes">
          <div className="finish-swatch-grid finish-swatch-grid-wood">
            {WOOD_FINISHES.map(([label, src]) => (
              <SwatchCard key={label} label={label} src={src} />
            ))}
          </div>
        </FinishSection>

        <section className="finish-section" id="upholstery">
          <div className="finish-section-heading">
            <span className="finish-section-eyebrow">Aceray Graded In</span>
            <h2>Upholstery</h2>
            <p>Use partner textile libraries and grade references when specifying fabric for Aceray products.</p>
          </div>

          <div className="upholstery-partner-grid">
            {UPHOLSTERY_PARTNERS.map((partner) => (
              <article className="upholstery-partner-card" key={partner.name}>
                <img src={partner.logo} alt={`${partner.name} logo`} loading="lazy" />
                <h3>{partner.name}</h3>
                <div className="upholstery-partner-actions">
                  <a href={partner.url} target="_blank" rel="noreferrer" className="btn-outline">
                    Visit
                  </a>
                  <a href={partner.grades} target="_blank" rel="noreferrer" className="btn-outline">
                    Grades
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="finish-section" id="vinyl">
          <div className="finish-section-heading">
            <span className="finish-section-eyebrow">Aceray Graded In</span>
            <h2>Vinyl Quality</h2>
            <p>{NOTE}</p>
          </div>

          <div className="vinyl-group-stack">
            {VINYL_GROUPS.map((group) => (
              <article className="vinyl-group" key={group.title}>
                <div className="vinyl-group-heading">
                  <h3>{group.title}</h3>
                  <span>{group.grade}</span>
                </div>
                <div className="finish-swatch-grid finish-swatch-grid-compact">
                  {group.colors.map(([label, src]) => (
                    <SwatchCard key={`${group.title}-${label}`} label={label} src={src} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <FinishSection id="table-bases" eyebrow="Table Base" title="Indoor Finishes">
          <div className="finish-swatch-grid">
            {TABLE_BASE_FINISHES.map(([label, src]) => (
              <SwatchCard key={label} label={label} src={src} />
            ))}
          </div>
        </FinishSection>

        <section className="fabrics-cta">
          <h2>Need Finish Samples?</h2>
          <p>
            Contact the Aceray team for current grade information, physical samples, COM/COL details, and project-specific finish guidance.
          </p>
          <div className="fabrics-cta-actions">
            <Link to="/contact" className="btn-primary">Request Samples</Link>
            <Link to="/catalog" className="btn-outline">Browse Products</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
