import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export const NOTE = 'Printed colors cannot be guaranteed for accuracy.'

export const WOOD_FINISHES = [
  ['Bleached Beech', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0005s_0008_Bleached-Beech.jpg'],
  ['Natural Beech', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0005s_0005_natural-beech.jpg'],
  ['Honey', 'https://aceray.com/wp-content/uploads/2019/05/honey.jpg'],
  ['Oak H', 'https://aceray.com/wp-content/uploads/2023/03/aok-H.png'],
  ['Walnut 1', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0005s_0004_Waltnut-1.jpg'],
  ['Walnut 2', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0005s_0003_Waltnut-2.jpg'],
  ['Cherry 1', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0005s_0007_Cherry-1.jpg'],
  ['Wenge', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0005s_0001_wenge.jpg'],
  ['Cherry 2', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0005s_0006_cherry-2.jpg'],
  ['Black', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0005s_0000_black.jpg'],
  ['Mahogany', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0005s_0002_mahogany.jpg'],
  ['Gray', 'https://aceray.com/wp-content/uploads/2019/05/gray.jpg'],
  ['Light Beech', 'https://aceray.com/wp-content/uploads/2020/01/light-beech.jpg'],
  ['Light Wenge', 'https://aceray.com/wp-content/uploads/2020/01/light-wenge.jpg'],
  ['Aged Gray', 'https://aceray.com/wp-content/uploads/2020/01/antique-gray.jpg'],
]

export const UPHOLSTERY_PARTNERS = [
  {
    name: 'Arc-Com',
    logo: 'https://aceray.com/wp-content/uploads/2019/05/arc-300x131.jpg',
    url: 'https://arc-com.com/alliance/partners/aceray',
    grades: 'https://aceray.com/wp-content/uploads/2026/01/Arc-Com-2026.pdf',
  },
  {
    name: 'Architex',
    logo: 'https://aceray.com/wp-content/uploads/2019/05/architex-300x131.jpg',
    url: 'https://www.architex-ljh.com/cgi-bin/cob?CPN=home&SID=2222462508438',
    grades: 'https://aceray.com/wp-content/uploads/2026/07/Archtiex-June-2026.pdf',
  },
  {
    name: 'Designtex',
    logo: 'https://aceray.com/wp-content/uploads/2019/05/designtext-300x131.jpg',
    url: 'https://www.designtex.com',
    grades: 'https://aceray.com/wp-content/uploads/2026/01/2026-designtex.pdf',
  },
  {
    name: 'Maharam',
    logo: 'https://aceray.com/wp-content/uploads/2019/05/maharam-300x131.jpg',
    url: 'https://www.maharam.com',
    grades: 'https://aceray.com/wp-content/uploads/2026/01/2026-Maharam.pdf',
  },
  {
    name: 'Mayer Fabrics',
    logo: 'https://aceray.com/wp-content/uploads/2026/01/Mayer-Fabrics_Stack-logo_Pantone-426.webp',
    url: 'https://www.mayerfabrics.com',
    grades: 'https://aceray.com/wp-content/uploads/2026/02/2026-Mayer.pdf',
  },
  {
    name: 'Momentum Textiles',
    logo: 'https://aceray.com/wp-content/uploads/2019/05/momentum-300x131.jpg',
    url: 'https://www.memosamples.com/momentum_textiles.shtml',
    grades: 'https://aceray.com/wp-content/uploads/2026/01/Momentum-2026.pdf',
  },
  {
    name: 'CF Stinson',
    logo: 'https://aceray.com/wp-content/uploads/2019/09/Stinson-see-sample-spec-logo-e1569859977863.jpg',
    url: 'https://cfstinson.com/Finishes/Samples.jsp?lid=4043',
    grades: 'https://aceray.com/wp-content/uploads/2026/01/CF-Stinson-2026.pdf',
  },
]

export const VINYL_GROUPS = [
  {
    title: 'Planet',
    grade: 'Grade A',
    colors: [
      ['151', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0025_151.jpg'],
      ['1110', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0024_1110.jpg'],
      ['1194', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0023_1194.jpg'],
      ['1307', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0022_1307.jpg'],
      ['71', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0021_71.jpg'],
      ['680', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0020_680.jpg'],
      ['1305', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0018_1305.jpg'],
      ['717', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0017_717.jpg'],
      ['726', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0016_726.jpg'],
      ['1809', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0015_1809.jpg'],
      ['1831', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0014_1831.jpg'],
      ['1830', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0013_1830.jpg'],
      ['1817', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0012_1817.jpg'],
      ['4915', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0011_4915.jpg'],
      ['4947', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0010_4947.jpg'],
      ['4979', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0009_4979.jpg'],
      ['1915', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0008_1915.jpg'],
      ['4975', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0007_4975.jpg'],
      ['4981', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0006_4981.jpg'],
      ['6', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0005_6.jpg'],
      ['4008', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0004_4008.jpg'],
      ['4009', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0003_4009.jpg'],
      ['1955', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0002_1955.jpg'],
      ['1984', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0001_1984.jpg'],
      ['991', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0001s_0000_991.jpg'],
    ],
  },
  {
    title: 'Skill',
    grade: 'Grade A',
    colors: [
      ['1', 'https://aceray.com/wp-content/uploads/2019/05/wgite.jpg'],
      ['2', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0001_2.jpg'],
      ['3', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0002_3.jpg'],
      ['4', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0023_4.jpg'],
      ['5', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0003_5.jpg'],
      ['6', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0004_6.jpg'],
      ['9', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0005_9.jpg'],
      ['10', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0006_10.jpg'],
      ['11', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0007_11.jpg'],
      ['12', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0008_12.jpg'],
      ['7', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0009_7.jpg'],
      ['8', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0010_8.jpg'],
      ['17', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0011_17.jpg'],
      ['18', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0012_18.jpg'],
      ['16', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0013_16.jpg'],
      ['15', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0014_15.jpg'],
      ['13', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0015_13.jpg'],
      ['14', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0016_14.jpg'],
      ['20', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0017_20.jpg'],
      ['19', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0018_19.jpg'],
      ['21', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0019_21.jpg'],
      ['22', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0020_22.jpg'],
      ['23', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0021_23.jpg'],
      ['24', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0000s_0022_24.jpg'],
    ],
  },
  {
    title: 'Aurea',
    grade: 'Grade B',
    colors: [
      ['12', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0000_12.jpg'],
      ['17', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0001_17.jpg'],
      ['22', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0002_22.jpg'],
      ['13', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0003_13.jpg'],
      ['18', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0004_18.jpg'],
      ['23', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0005_23.jpg'],
      ['14', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0006_14.jpg'],
      ['19', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0007_19.jpg'],
      ['24', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0008_24.jpg'],
      ['15', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0009_15.jpg'],
      ['20', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0010_20.jpg'],
      ['25', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0011_25.jpg'],
      ['16', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0012_16.jpg'],
      ['21', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0013_21.jpg'],
      ['26', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0014_26.jpg'],
      ['2', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0015_2.jpg'],
      ['7', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0016_7.jpg'],
      ['3', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0017_3.jpg'],
      ['8', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0018_8.jpg'],
      ['4', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0019_4.jpg'],
      ['1', 'https://aceray.com/wp-content/uploads/2019/05/wgite.jpg'],
      ['9', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0020_9.jpg'],
      ['5', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0021_5.jpg'],
      ['10', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0022_10.jpg'],
      ['6', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0023_6.jpg'],
      ['11', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0004s_0024_11.jpg'],
    ],
  },
  {
    title: 'Extrema Metal',
    grade: 'Grade D',
    colors: [
      ['5350', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0000_5350.jpg'],
      ['5450', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0001_5450.jpg'],
      ['6050', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0002_6050.jpg'],
      ['6750', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0003_6750.jpg'],
      ['6650', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0006_6650.jpg'],
      ['6850', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0004_6850.jpg'],
      ['6350', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0005_6350.jpg'],
      ['6250', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0022_6250.jpg'],
      ['6150', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0007_6150.jpg'],
      ['7150', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0008_7150.jpg'],
      ['7250', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0009_7250.jpg'],
      ['7350', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0021_7350.jpg'],
      ['5050', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0010_5050.jpg'],
      ['5950', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0011_5950.jpg'],
      ['5250', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0012_5250.jpg'],
      ['5150', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0020_5150.jpg'],
      ['6450', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0013_6450.jpg'],
      ['6550', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0014_6550.jpg'],
      ['5750', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0015_5750.jpg'],
      ['5550', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0019_5550.jpg'],
      ['5850', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0016_5850.jpg'],
      ['6950', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0017_6950.jpg'],
      ['7050', 'https://aceray.com/wp-content/uploads/2019/05/fabrics-and-finishes_0002s_0018_7050.jpg'],
    ],
  },
]

export const TABLE_BASE_FINISHES = [
  ['Black', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-black.png'],
  ['Graphite', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-graphite.png'],
  ['Brown', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-brown.png'],
  ['Silver', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-silver.png'],
  ['White', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-white.png'],
  ['Brushed Brass', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-brushed-brass.png'],
  ['Polished Stainless Steel', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-polished-stainless-steel.png'],
  ['Brushed Stainless Steel', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-brushed-stainless-steel.png'],
  ['Chrome', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-chrome.png'],
  ['Aged Brass', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-aged-brass.png'],
  ['Aged Copper', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-aged-copper.png'],
  ['Corten', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-corten.png'],
  ['Distressed Steel', 'https://aceray.com/wp-content/uploads/2020/07/Metal-table-finish-distressed-steel.png'],
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
    document.title = 'Fabrics & Finishes - Aceray | Premium Commercial Furniture'
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
