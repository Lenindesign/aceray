import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/components/ProductCard'
import { sanityFetch } from '@/sanityClient'
import { CATEGORIES } from '@/constants'
import { getCollectionFamily } from '@/lib/productFamilies'
import { getDesignerProfile, getDesignerSlug, normalizeDesignerName } from '@/data/designerProfiles'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'
import { optimizeSanityUrl } from '@/lib/sanityImageUrl'

const DESIGNER_PRODUCTS_QUERY = `*[
  _type == "product" &&
  defined(designer) &&
  designer != "" &&
  (defined(imageUrl) || defined(mainImage.asset) || count(gallery) > 0)
] | order(title asc) [0...1000] {
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

function getFallbackBio(name, productTypes, collections) {
  const typeText = formatList(productTypes.slice(0, 4))
  const collectionText = formatList(collections.slice(0, 4))

  if (typeText && collectionText) {
    return `Explore Aceray products by ${name}, including ${typeText} across ${collectionText}.`
  }

  if (typeText) return `Explore Aceray products by ${name}, including ${typeText}.`

  return `Explore Aceray products by ${name}.`
}

export default function DesignerLandingPage() {
  const { designerSlug = '' } = useParams()
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    sanityFetch(DESIGNER_PRODUCTS_QUERY)
      .then((items) => setAllProducts(items || []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false))
  }, [designerSlug])

  const designerProducts = useMemo(() => (
    allProducts.filter((product) => getDesignerSlug(product.designer) === designerSlug)
  ), [allProducts, designerSlug])

  const designerName = normalizeDesignerName(cleanLabel(designerProducts[0]?.designer)) || designerSlug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  const profile = getDesignerProfile(designerName)

  const productTypes = useMemo(() => {
    const types = new Set()
    designerProducts.forEach((product) => {
      ;(product.categories || []).forEach((category) => {
        const label = cleanLabel(category)
        if (CATEGORIES.includes(label)) types.add(label)
      })
    })
    return Array.from(types).sort((left, right) => left.localeCompare(right))
  }, [designerProducts])

  const collections = useMemo(() => {
    const families = new Set()
    designerProducts.forEach((product) => {
      const family = cleanLabel(getCollectionFamily(product))
      if (family) families.add(family)
    })
    return Array.from(families).sort((left, right) => left.localeCompare(right))
  }, [designerProducts])

  const installationItems = useMemo(() => {
    const items = []
    const seenUrls = new Set()

    designerProducts.forEach((product) => {
      if (product.galleryAssets && product.galleryAssets.length > 0) {
        product.galleryAssets.forEach((asset) => {
          if (asset && asset.url) {
            const isInstall = asset.isInstallation || /install|venue|project|hotel|resort/i.test(asset.originalFilename || '')
            if (isInstall && !seenUrls.has(asset.url)) {
              seenUrls.add(asset.url)
              items.push({
                url: asset.url,
                productTitle: product.title,
                productSlug: product.slug?.current || product.slug,
              })
            }
          }
        })
      }

      if (product.galleryUrls && product.galleryUrls.length > 0) {
        product.galleryUrls.forEach((url) => {
          if (url && typeof url === 'string') {
            const isInstall = /install|venue|project|hotel|resort/i.test(url)
            if (isInstall && !seenUrls.has(url)) {
              seenUrls.add(url)
              items.push({
                url,
                productTitle: product.title,
                productSlug: product.slug?.current || product.slug,
              })
            }
          }
        })
      }
    })

    return items
  }, [designerProducts])

  const bio = profile?.bio || getFallbackBio(designerName, productTypes, collections)
  const heroImage = installationItems[0]?.url || designerProducts[0]?.mainImageUrl || designerProducts[0]?.imageUrl || '/assets/images/placeholder.jpg'
  const schemaEntityType = /studio|design|associates|partners|producks|erc/i.test(designerName) ? 'Organization' : 'Person'

  useEffect(() => {
    setSeoMetadata({
      title: `${designerName} Designer Products | Aceray`,
      description: `${bio.slice(0, 150)}${bio.length > 150 ? '...' : ''}`,
      path: `/designers/${designerSlug}`,
      image: heroImage,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: `${designerName} Aceray Products`,
        description: bio,
        url: `https://aceray.com/designers/${designerSlug}`,
        mainEntity: {
          '@type': schemaEntityType,
          name: designerName,
          description: bio,
        },
      },
    })
    removeSeoJsonLd('product-jsonld')
  }, [bio, designerName, designerSlug, heroImage, schemaEntityType])

  if (loading) {
    return (
      <div className="designer-detail-page">
        <section className="container designer-detail-skeleton">
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-5 w-full max-w-2xl" />
          <div className="products-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index}>
                <Skeleton className="aspect-square rounded-sm mb-3" />
                <Skeleton className="h-4 w-3/4 mb-1.5" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  if (designerProducts.length === 0) {
    return (
      <div className="designer-detail-page">
        <section className="container catalog-empty">
          <h1 className="catalog-empty-title">Designer not found</h1>
          <p className="catalog-empty-copy">No Aceray products were found for this designer.</p>
          <Link to="/designers" className="btn-outline">Browse Designers</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="designer-detail-page">
      <section className="container designer-detail-hero">
        <div className="designer-detail-copy">
          <span className="designer-eyebrow">DESIGNER STUDIO</span>
          <h1>{designerName}</h1>
          <p className="designer-detail-bio">{bio}</p>

          {profile?.disciplines?.length > 0 && (
            <p className="designer-detail-disciplines">
              {profile.disciplines.join(' / ')}
            </p>
          )}

          <div className="designer-detail-meta">
            {profile?.location && (
              <span className="designer-meta-location">
                <MapPin className="designer-location-icon" aria-hidden="true" />
                {profile.location}
              </span>
            )}
            <span className="designer-meta-badge">{designerProducts.length} Products</span>
          </div>

          <div className="designer-detail-actions">
            <Link to={`/catalog?designer=${encodeURIComponent(designerName)}`} className="btn-primary">
              View Catalog Filter
            </Link>
            <Link to="/designers" className="btn-outline">
              All Designers
            </Link>
          </div>
        </div>
      </section>

      {(productTypes.length > 0 || collections.length > 0) && (
        <section className="container designer-detail-summary">
          {productTypes.length > 0 && (
            <div>
              <span className="designer-eyebrow">Product Types</span>
              <p>{productTypes.join(', ')}</p>
            </div>
          )}
          {collections.length > 0 && (
            <div>
              <span className="designer-eyebrow">Aceray Collections</span>
              <p>{collections.slice(0, 12).join(', ')}</p>
            </div>
          )}
        </section>
      )}

      {installationItems.length > 0 && (
        <section className="container designer-detail-installations">
          <div className="family-section-heading">
            <div>
              <span className="designer-eyebrow">PROJECT GALLERY</span>
              <h2>{designerName} Installations</h2>
            </div>
            <Link to="/installations" className="btn-outline">
              View All Installations &rarr;
            </Link>
          </div>

          <div className="designer-installations-grid">
            {installationItems.map((item, index) => {
              const CardTag = item.productSlug ? Link : 'div'
              const cardProps = item.productSlug
                ? {
                  to: `/product/${item.productSlug}`,
                  'aria-label': `View ${item.productTitle || designerName} product page`,
                }
                : {}

              return (
                <CardTag key={index} className="designer-installation-card" {...cardProps}>
                  <img
                    src={optimizeSanityUrl(item.url, { width: 600, quality: 78 })}
                    alt={`${designerName} installation`}
                    loading="lazy"
                  />
                  {item.productTitle && (
                    <div className="designer-installation-overlay">
                      <span className="designer-installation-tag">Installation</span>
                      <span className="designer-installation-model">{item.productTitle}</span>
                    </div>
                  )}
                </CardTag>
              )
            })}
          </div>
        </section>
      )}

      <section className="container designer-detail-products">
        <div className="family-section-heading">
          <div>
            <span className="designer-eyebrow">PRODUCTS COLLECTION</span>
            <h2>{designerName} Products</h2>
          </div>
        </div>

        <div className="products-grid">
          {designerProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
