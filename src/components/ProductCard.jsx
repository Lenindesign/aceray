import { Link } from 'react-router-dom'
import { urlFor } from '@/lib/sanityImageUrl'

export default function ProductCard({ product, className = '' }) {
  if (!product) return null

  const slug = product.slug?.current || product.slug || ''
  const cat = Array.isArray(product.categories)
    ? product.categories.slice(0, 2).join(' / ')
    : (product.category || 'Seating')

  const imageUrl = product.mainImage
    ? urlFor(product.mainImage).url()
    : (product.imageUrl || '/assets/images/placeholder.jpg')

  return (
    <Link to={`/product/${encodeURIComponent(slug)}`} className={`product-card ${className}`}>
      <div className="product-image-wrapper">
        <img
          src={imageUrl}
          alt={product.title || 'Aceray Product'}
          loading="lazy"
        />
      </div>
      <h3 className="product-name">{product.title}</h3>
      <p className="product-category">{cat}</p>
    </Link>
  )
}
