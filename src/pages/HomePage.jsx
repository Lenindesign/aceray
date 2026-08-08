import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { sanityFetch } from '@/sanityClient'
import ProductCard from '@/components/ProductCard'
import { FullscreenImageViewer } from '@/components/FullscreenImageViewer'

const FEATURED_QUERY = `*[_type == "product" && (defined(imageUrl) || defined(mainImage.asset))] | order(_updatedAt desc) [0..7] {
  _id, title, slug, designer, categories, imageUrl, mainImage{asset->{_id, url}}
}`

const FEATURED_CATEGORIES = [
  {
    title: 'Side Chairs',
    subtitle: 'Explore Collection',
    cat: 'side-chairs',
    image: '/assets/migrated/Alba-4.webp',
  },
  {
    title: 'Armchairs',
    subtitle: 'Explore Collection',
    cat: 'armchairs',
    image: '/assets/migrated/0001s_0004_Grande-family-horiz-A.webp',
  },
  {
    title: 'Lounge Seating',
    subtitle: 'Explore Collection',
    cat: 'lounge',
    image: '/assets/migrated/riva-1.webp',
  },
  {
    title: 'Outdoor Living',
    subtitle: 'Explore Collection',
    cat: 'outdoors',
    image: '/assets/migrated/0003s_0002_Bora-horizontal-A.webp',
  },
]

const NEW_ARRIVALS_SLIDES = [
  { title: "ARTE", designer: "Balutto Associates", src: "/assets/migrated/0006s_0000_Arte-UU-horizontal-C.webp" },
  { title: "ALBA", designer: "E. & P. Ciani Design", src: "/assets/migrated/Alba-4.webp" },
  { title: "CIAO", designer: "Massimo Iosa Ghini", src: "/assets/migrated/0002s_0000_Ciao-UU-horizontal-C.webp" },
  { title: "SOLO-V", designer: "Gentian Elezi", src: "/assets/migrated/colo-v.webp" },
  { title: "BORA", designer: "E. & P. Ciani Design", src: "/assets/migrated/0003s_0002_Bora-horizontal-A.webp" },
  { title: "MIRA-X3", designer: "A & T Studio", src: "/assets/migrated/mira-x3-2-1.webp" },
  { title: "CORSO", designer: "Balutto Associates", src: "/assets/migrated/corso3.webp" },
  { title: "SPAZIO-R", designer: "A & T Studio", src: "/assets/migrated/Spazio-R-2M-2.webp" }
]

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [initialIndex, setInitialIndex] = useState(0)

  useEffect(() => {
    document.title = 'Aceray – The Look of Seating | Premium Commercial & Upholstered Furniture'
    sanityFetch(FEATURED_QUERY)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home-page">
      {/* Hero Banner (Bottom CTA Layout) */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-slogan-img-wrapper">
            <img
              src="/assets/migrated/slogan-888x85.png"
              alt="The LOOK of Seating"
              className="hero-slogan-img"
            />
          </h1>
        </div>

        <div className="hero-bottom-cta">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setInitialIndex(0)
              setFullscreenOpen(true)
            }}
          >
            Explore New Arrivals
          </button>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="home-section category-section container">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Curated collections designed for timeless performance and aesthetic distinction.</p>

        <div className="category-card-grid">
          {FEATURED_CATEGORIES.map(({ title, subtitle, cat, image }) => (
            <div key={cat} className="category-card">
              <Link to={`/catalog?cat=${cat}`}>
                <img src={image} alt={`Aceray ${title}`} />
                <div className="category-info">
                  <h3 className="category-title">{title}</h3>
                  <span className="category-link">{subtitle}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Asymmetric Feature Showcase */}
      <section className="feature-showcase home-feature">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-image">
              <img
                src="/assets/images/aceray-craft-collage.jpg"
                alt="Aceray workshop craft process with wood shaping and metal fabrication"
                className="home-craft-image"
              />
            </div>
            <div className="feature-text">
              <span className="tag">Unmatched Craftsmanship</span>
              <h2>Designed for Distinction. Built for Longevity.</h2>
              <p>Built by master craftsmen using sustainably sourced hardwoods, precision steel bases, and high-performance commercial upholstery. Every Aceray design brings extraordinary comfort and character to high-traffic environments.</p>
              <Link to="/about" className="btn-primary">
                Learn Our Craft Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer / Catalog Favorites Section */}
      <section className="home-section products-section container">
        <h2 className="section-title">Featured Highlights</h2>
        <p className="section-subtitle">Discover our latest released contemporary furniture models.</p>

        {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square rounded-xs mb-3" />
                <Skeleton className="h-4 w-3/4 mb-1.5" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        <div className="products-section-actions">
          <Link to="/catalog" className="btn-outline">
            View All Products
          </Link>
        </div>
      </section>


      {/* Fullscreen New Arrivals Viewer */}
      {fullscreenOpen && (
        <FullscreenImageViewer
          images={NEW_ARRIVALS_SLIDES}
          initialIndex={initialIndex}
          title="New Arrivals"
          onClose={() => setFullscreenOpen(false)}
        />
      )}
    </div>
  )
}
