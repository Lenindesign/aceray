import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { sanityFetch } from '@/sanityClient'
import { CATEGORIES } from '@/constants'
import { getCollectionFamily } from '@/lib/productFamilies'
import { getDesignerProfile, getDesignerSlug } from '@/data/designerProfiles'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'

const DESIGNERS_QUERY = `*[
  _type == "product" &&
  defined(designer) &&
  designer != "" &&
  (defined(imageUrl) || defined(mainImage.asset))
] | order(designer asc, title asc) [0...1000] {
  _id, title, slug, designer, categories, imageUrl, mainImage{asset->{_id, url}}
}`

const PLACEHOLDER_IMAGE = '/assets/images/placeholder.jpg'

function cleanLabel(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function getProductImageUrl(product) {
  return product.mainImage?.asset?.url || product.imageUrl || PLACEHOLDER_IMAGE
}

function formatList(items = []) {
  if (items.length <= 2) return items.join(' and ')
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function getDesignerSummary(designer) {
  const categoryText = formatList(designer.productTypes.slice(0, 3))
  const collectionText = formatList(designer.collections.slice(0, 3))

  if (categoryText && collectionText) {
    return `Aceray products by ${designer.name} span ${categoryText}, with representation across ${collectionText}.`
  }

  if (categoryText) {
    return `Aceray products by ${designer.name} include ${categoryText} for commercial hospitality and workplace environments.`
  }

  return `Explore Aceray products designed by ${designer.name}.`
}

export default function DesignersPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSeoMetadata({
      title: 'Designers - Aceray | Products by Designer',
      description: 'Explore Aceray commercial furniture by designer, with profiles, product families, disciplines, and products from international design studios.',
      path: '/designers',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Aceray Designers',
        description: 'Aceray products organized by designer and design studio.',
        url: 'https://aceray.com/designers',
      },
    })
    removeSeoJsonLd('product-jsonld')

    sanityFetch(DESIGNERS_QUERY)
      .then((items) => setProducts(items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const designers = useMemo(() => {
    const byDesigner = new Map()

    products.forEach((product) => {
      const name = cleanLabel(product.designer)
      if (!name) return

      if (!byDesigner.has(name)) {
        byDesigner.set(name, {
          name,
          products: [],
          productTypes: new Set(),
          collections: new Set(),
        })
      }

      const designer = byDesigner.get(name)
      designer.products.push(product)

      const categories = product.categories || []

      categories.forEach((category) => {
        const cleanCategory = cleanLabel(category)
        if (CATEGORIES.includes(cleanCategory)) designer.productTypes.add(cleanCategory)
      })

      const family = cleanLabel(getCollectionFamily(product))
      if (family) designer.collections.add(family)
    })

    return Array.from(byDesigner.values())
      .map((designer) => ({
        ...designer,
        count: designer.products.length,
        profile: getDesignerProfile(designer.name),
        slug: getDesignerSlug(designer.name),
        productTypes: Array.from(designer.productTypes).sort((left, right) => left.localeCompare(right)),
        collections: Array.from(designer.collections).sort((left, right) => left.localeCompare(right)),
        images: designer.products.slice(0, 4).map(getProductImageUrl),
      }))
      .sort((left, right) => left.name.localeCompare(right.name))
  }, [products])

  return (
    <div className="designers-page">
      <section className="container designers-page-container">
        <div className="designers-page-heading">
          <span className="designers-page-eyebrow">Designers</span>
          <h1>Products by Designer</h1>
          <p>
            Explore Aceray products through the designers and studios behind the collection, with profile notes,
            disciplines, and product families connected to each name.
          </p>
        </div>

        {loading ? (
          <div className="designers-loading" aria-live="polite">Loading designers...</div>
        ) : designers.length === 0 ? (
          <div className="catalog-empty">
            <h2 className="catalog-empty-title">No designers found</h2>
            <p className="catalog-empty-copy">
              Designer information will appear here when product records include a designer name.
            </p>
            <Link to="/catalog" className="btn-outline">Browse All Products</Link>
          </div>
        ) : (
          <div className="designers-grid">
            {designers.map((designer) => (
              <article key={designer.name} className="designer-card">
                <div className="designer-card-images" aria-hidden="true">
                  {designer.images.map((image, index) => (
                    <img
                      key={`${designer.name}-${image}-${index}`}
                      src={image}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = PLACEHOLDER_IMAGE
                      }}
                    />
                  ))}
                </div>

                <div className="designer-card-body">
                  <span className="designer-card-eyebrow">Designer</span>
                  <h2>{designer.name}</h2>
                  <p className="designer-card-meta">{designer.count} products</p>

                  {designer.profile && (
                    <div className="designer-card-profile-meta">
                      {designer.profile.location && <span>{designer.profile.location}</span>}
                      {designer.profile.disciplines?.length > 0 && (
                        <span>{designer.profile.disciplines.slice(0, 3).join(' / ')}</span>
                      )}
                    </div>
                  )}

                  <p className="designer-card-copy">
                    {designer.profile?.bio || getDesignerSummary(designer)}
                  </p>

                  {designer.profile && designer.collections.length > 0 && (
                    <p className="designer-card-collections">
                      Aceray collections: {designer.collections.slice(0, 4).join(', ')}
                    </p>
                  )}

                  {designer.productTypes.length > 0 && (
                    <div className="designer-card-tags" aria-label={`${designer.name} product types`}>
                      {designer.productTypes.slice(0, 4).map((type) => (
                        <span key={type}>{type}</span>
                      ))}
                    </div>
                  )}

                  <Link
                    to={`/designers/${designer.slug}`}
                    className="designer-card-link"
                  >
                    View Profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
