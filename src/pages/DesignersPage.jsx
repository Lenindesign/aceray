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
  (defined(imageUrl) || defined(mainImage.asset) || count(gallery) > 0)
] | order(designer asc, title asc) [0...1000] {
  _id, title, slug, designer, categories, imageUrl,
  "mainImageUrl": mainImage.asset->url,
  galleryUrls,
  "galleryAssets": gallery[]{
    "url": asset->url,
    "originalFilename": asset->originalFilename,
    "isInstallation": (
      isInstallation == true ||
      asset->isInstallation == true ||
      "installation" in asset->opt.media.tags[]->name.current ||
      "installation" in asset->tags[]->name.current ||
      "installation" in asset->tags[]->title
    )
  }
}`

const PLACEHOLDER_IMAGE = '/assets/images/placeholder.jpg'

function cleanLabel(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
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
          installationPhotos: [],
          studioPhotos: [],
        })
      }

      const designer = byDesigner.get(name)
      designer.products.push(product)

      // Collect main image as studio photo
      const mainImg = product.mainImageUrl || product.imageUrl
      if (mainImg && !designer.studioPhotos.includes(mainImg)) {
        designer.studioPhotos.push(mainImg)
      }

      // Collect gallery assets & installation photos
      if (product.galleryAssets && product.galleryAssets.length > 0) {
        product.galleryAssets.forEach((asset) => {
          if (asset && asset.url) {
            const isInstall = asset.isInstallation || /install|venue|project|hotel|resort/i.test(asset.originalFilename || '')
            if (isInstall) {
              if (!designer.installationPhotos.includes(asset.url)) {
                designer.installationPhotos.push(asset.url)
              }
            } else {
              if (!designer.studioPhotos.includes(asset.url)) {
                designer.studioPhotos.push(asset.url)
              }
            }
          }
        })
      }

      // Collect galleryUrls string links
      if (product.galleryUrls && product.galleryUrls.length > 0) {
        product.galleryUrls.forEach((url) => {
          if (url && typeof url === 'string') {
            const isInstall = /install|venue|project|hotel|resort/i.test(url)
            if (isInstall) {
              if (!designer.installationPhotos.includes(url)) designer.installationPhotos.push(url)
            } else {
              if (!designer.studioPhotos.includes(url)) designer.studioPhotos.push(url)
            }
          }
        })
      }

      const categories = product.categories || []

      categories.forEach((category) => {
        const cleanCategory = cleanLabel(category)
        if (CATEGORIES.includes(cleanCategory)) designer.productTypes.add(cleanCategory)
      })

      const family = cleanLabel(getCollectionFamily(product))
      if (family) designer.collections.add(family)
    })

    return Array.from(byDesigner.values())
      .map((designer) => {
        // Prioritize installation photo as main image if available
        const orderedImages = [
          ...designer.installationPhotos,
          ...designer.studioPhotos
        ]

        // Deduplicate
        const uniqueImages = Array.from(new Set(orderedImages)).filter(Boolean)

        return {
          ...designer,
          count: designer.products.length,
          profile: getDesignerProfile(designer.name),
          slug: getDesignerSlug(designer.name),
          productTypes: Array.from(designer.productTypes).sort((left, right) => left.localeCompare(right)),
          collections: Array.from(designer.collections).sort((left, right) => left.localeCompare(right)),
          images: uniqueImages.length > 0 ? uniqueImages.slice(0, 4) : [PLACEHOLDER_IMAGE],
        }
      })
      .sort((left, right) => left.name.localeCompare(right.name))
  }, [products])

  return (
    <div className="designers-page">
      <section className="container designers-page-container">
        <div className="designers-page-heading">
          <span className="tag">INTERNATIONAL DESIGNERS &amp; STUDIOS</span>
          <h1>Products by Designer</h1>
          <p>
            Discover the visionaries behind Aceray's commercial seating and furniture collection.
            Explore award-winning international designers, their design philosophies, and signature product families.
          </p>
        </div>

        {loading ? (
          <div className="designers-loading" aria-live="polite">
            <div className="animate-pulse space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : designers.length === 0 ? (
          <div className="catalog-empty">
            <h2 className="catalog-empty-title">No designers found</h2>
            <p className="catalog-empty-copy">
              Designer information will appear here when product records include a designer name.
            </p>
            <Link to="/catalog" className="btn-outline">Browse All Products</Link>
          </div>
        ) : (
          <div className="designer-showcase-list">
            {designers.map((designer, idx) => {
              const isEven = idx % 2 === 0
              const mainImage = designer.images[0] || PLACEHOLDER_IMAGE
              const secondaryImages = designer.images.slice(1, 4)

              return (
                <article
                  key={designer.name}
                  className={`designer-showcase-row ${isEven ? 'row-normal' : 'row-reverse'}`}
                >
                  {/* Media / Image Collage Column */}
                  <div className="designer-showcase-media">
                    <div className="designer-main-image-wrap">
                      <img
                        src={mainImage}
                        alt={`${designer.name} product`}
                        className="designer-main-image"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = PLACEHOLDER_IMAGE
                        }}
                      />
                    </div>

                    {secondaryImages.length > 0 && (
                      <div className="designer-secondary-images">
                        {secondaryImages.map((img, i) => (
                          <div key={i} className="designer-secondary-image-wrap">
                            <img
                              src={img}
                              alt=""
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.onerror = null
                                event.currentTarget.src = PLACEHOLDER_IMAGE
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Information Column */}
                  <div className="designer-showcase-content">
                    <span className="tag">Designer &amp; Studio</span>
                    <h2 className="designer-showcase-title">{designer.name}</h2>

                    <div className="designer-showcase-meta">
                      {designer.profile?.location && (
                        <span className="designer-meta-location">
                          📍 {designer.profile.location}
                        </span>
                      )}
                      <span className="designer-meta-badge">
                        {designer.count} {designer.count === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>

                    <p className="designer-showcase-bio">
                      {designer.profile?.bio || getDesignerSummary(designer)}
                    </p>

                    {designer.collections.length > 0 && (
                      <div className="designer-showcase-collections">
                        <span className="collections-label">Collections:</span>
                        <span className="collections-text">{designer.collections.slice(0, 4).join(', ')}</span>
                      </div>
                    )}

                    {designer.productTypes.length > 0 && (
                      <div className="designer-showcase-tags">
                        {designer.productTypes.slice(0, 4).map((type) => (
                          <span key={type} className="designer-type-pill">{type}</span>
                        ))}
                      </div>
                    )}

                    <div className="designer-showcase-actions">
                      <Link
                        to={`/designers/${designer.slug}`}
                        className="btn-primary designer-cta-btn"
                      >
                        Explore {designer.name} Collection &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
