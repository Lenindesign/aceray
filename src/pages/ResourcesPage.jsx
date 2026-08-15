import { removeSeoJsonLd, setSeoMetadata, createBreadcrumbJsonLd, ACERAY_ORGANIZATION_SCHEMA } from '@/lib/seo'

const RESOURCES = [
  {
    title: '2026 Catalog Request',
    copy: 'Browse the latest Aceray master catalog featuring contemporary seating collections.',
    cta: 'View Aceray Book',
    to: '/aceray-book',
    buttonClass: 'btn-primary',
  },
  {
    title: 'Fabrics & Finishes',
    copy: 'Explore graded-in textiles, wood stains, powder coat metals, and custom COM/COL options.',
    cta: 'Order Physical Swatches',
    to: '/contact',
    buttonClass: 'btn-outline',
  },
  {
    title: '3D Models & CAD Downloads',
    copy: 'Revit, OBJ, DWG, and SketchUp 3D assets for interior architects and space planners.',
    cta: 'Browse Products for CAD',
    to: '/catalog',
    buttonClass: 'btn-outline',
  },
  {
    title: 'Care & Maintenance',
    copy: 'Comprehensive care instructions for solid hardwoods, upholstered leathers, and outdoor finishes.',
    cta: 'Read Care Guide',
    to: '/about',
    buttonClass: 'btn-outline',
  },
]

export default function ResourcesPage() {
  useEffect(() => {
    setSeoMetadata({
      title: 'Resources & Downloads | Aceray Commercial Furniture',
      description: 'Access Aceray catalogs, finish resources, 3D model guidance, CAD download paths, care information, and commercial furniture support resources.',
      path: '/resources',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ItemPage',
            name: 'Aceray Design Resources',
            description: 'Access Aceray catalogs, finish resources, 3D model guidance, CAD download paths, care information, and commercial furniture support resources.',
            publisher: { '@id': 'https://aceray.com/#organization' },
          },
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Resources', path: '/resources' },
          ]),
          ACERAY_ORGANIZATION_SCHEMA,
        ],
      },
    })
    removeSeoJsonLd('product-jsonld')
  }, [])

  return (
    <div className="resources-page">
      <section className="container resources-page-container">
        <div className="resources-page-heading">
          <span className="resources-page-eyebrow">Design Resources</span>
          <h1>Catalogs, Finishes &amp; 3D Models</h1>
          <p>
            Access our complete library of design resources, digital swatches, architectural CAD files, and care guides.
          </p>
        </div>

        <div className="resources-grid">
          {RESOURCES.map((resource) => (
            <article className="resources-card" key={resource.title}>
              <h2>{resource.title}</h2>
              <p>{resource.copy}</p>
              <Link to={resource.to} className={resource.buttonClass}>
                {resource.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
