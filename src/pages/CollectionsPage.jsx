import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { sanityFetch } from '@/sanityClient'
import { FAMILY_HERO_IMAGES, productBelongsToFamily } from '@/lib/productFamilies'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'

const COLLECTION_COUNTS_QUERY = `*[_type == "product" && (defined(imageUrl) || defined(mainImage.asset))][0...1000] {
  categories
}`

function titleFromSlug(value = '') {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function CollectionsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    setSeoMetadata({
      title: 'Aceray Collections | Commercial Seating Families',
      description: 'Browse Aceray product collections by shared design language, material expression, designer family, and commercial application.',
      path: '/collections',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Aceray Collections',
        description: 'Aceray product collections and furniture families.',
        url: 'https://aceray.com/collections',
      },
    })
    removeSeoJsonLd('product-jsonld')

    sanityFetch(COLLECTION_COUNTS_QUERY)
      .then((items) => setProducts(items || []))
      .catch(() => setProducts([]))
  }, [])

  const collections = useMemo(() => (
    Object.entries(FAMILY_HERO_IMAGES)
      .map(([slug, image]) => {
        const count = products.filter((product) => (
          productBelongsToFamily(product, slug)
        )).length

        return {
          slug,
          image,
          name: titleFromSlug(slug),
          count,
        }
      })
      .sort((left, right) => left.name.localeCompare(right.name))
  ), [products])

  return (
    <div className="collections-page">
      <section className="container collections-page-container">
        <div className="collections-page-heading">
          <span className="collections-page-eyebrow">Collections</span>
          <h1>Explore Aceray Collections</h1>
          <p>
            Browse product collections by shared design language, material expression, and commercial application.
          </p>
        </div>

        <div className="collections-grid">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              to={`/collections/${collection.slug}`}
              className="collection-card"
            >
              <img src={collection.image} alt={`${collection.name} collection`} loading="lazy" />
              <div className="collection-card-body">
                <div>
                  <span className="collection-card-eyebrow">Collection</span>
                  <h2>{collection.name}</h2>
                </div>
                {collection.count > 0 && (
                  <span className="collection-card-count">{collection.count} products</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
