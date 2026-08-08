import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/components/ProductCard'
import { sanityFetch } from '@/sanityClient'
import { CATEGORIES } from '@/constants'
import { getFamilySlug, getPreferredFamilyHeroImage, productBelongsToFamily } from '@/lib/productFamilies'

const FAMILY_PRODUCTS_QUERY = `*[_type == "product" && (defined(imageUrl) || defined(mainImage.asset))] | order(title asc) [0...1000] {
  _id, title, slug, categories, tags, imageUrl, galleryUrls, designer, madeIn,
  mainImage{asset->{_id, url}}
}`

const FAMILY_MATERIALS = [
  'Wood',
  'Upholstery',
  'Chrome',
  'Chrome + Black',
  'Extrema Metal',
  'Matte + Chrome',
  'Outdoors',
]

function titleFromSlug(value = '') {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getFamilyName(products, familySlug) {
  for (const product of products) {
    const match = product.categories?.find((category) => getFamilySlug(category) === familySlug)
    if (match) return match
  }

  return titleFromSlug(familySlug)
}

function countCategoryMatches(products, categories) {
  return categories
    .map((category) => ({
      label: category,
      count: products.filter((product) => product.categories?.includes(category)).length,
    }))
    .filter((item) => item.count > 0)
}

export default function FamilyLandingPage() {
  const { familySlug = '' } = useParams()
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    sanityFetch(FAMILY_PRODUCTS_QUERY)
      .then((products) => setAllProducts(products || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [familySlug])

  const familyProducts = useMemo(() => (
    allProducts.filter((product) => productBelongsToFamily(product, familySlug))
  ), [allProducts, familySlug])

  const familyName = getFamilyName(familyProducts, familySlug)
  const productTypes = countCategoryMatches(familyProducts, CATEGORIES)
  const materials = countCategoryMatches(familyProducts, FAMILY_MATERIALS)
  const heroImage = getPreferredFamilyHeroImage(familyProducts, familySlug)

  useEffect(() => {
    document.title = `${familyName} Collection | Aceray`
  }, [familyName])

  if (loading) {
    return (
      <div className="family-page">
        <section className="container family-page-skeleton">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-5 w-96" />
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

  if (error || familyProducts.length === 0) {
    return (
      <div className="family-page">
        <section className="container family-empty">
          <span className="family-eyebrow">Collection</span>
          <h1>{familyName}</h1>
          <p>No products were found for this collection.</p>
          <Link to="/catalog" className="btn-primary">Browse All Products</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="family-page">
      <section className="family-hero">
        {heroImage && (
          <img className="family-hero-image" src={heroImage} alt={`${familyName} collection product`} />
        )}

        <div className="container family-hero-inner">
          <div className="family-hero-title">
            <span className="family-eyebrow">Collection</span>
            <h1>{familyName}</h1>
          </div>
        </div>
      </section>

      <section className="container family-products-section">
        <div className="family-section-heading">
          <div>
            <span className="family-eyebrow">Products</span>
            <h2>{familyName} Products</h2>
            <p className="family-section-description">
              Explore the full {familyName} collection across available product types, materials, and related configurations.
            </p>
          </div>
          <Link to="/catalog" className="btn-outline">All Products</Link>
        </div>



        <div className="products-grid">
          {familyProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
