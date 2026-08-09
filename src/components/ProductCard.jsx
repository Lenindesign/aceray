import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FAVORITES_CHANGED_EVENT, isFavoriteProduct, toggleFavoriteProduct } from '@/lib/favorites'

import { optimizeSanityUrl } from '@/lib/sanityImageUrl'

export default function ProductCard({ product, className = '' }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const slug = product?.slug?.current || product?.slug || ''

  useEffect(() => {
    setIsFavorite(isFavoriteProduct(slug))

    function handleFavoritesChange() {
      setIsFavorite(isFavoriteProduct(slug))
    }

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange)
    window.addEventListener('storage', handleFavoritesChange)
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange)
      window.removeEventListener('storage', handleFavoritesChange)
    }
  }, [slug])

  if (!product) return null

  const cat = Array.isArray(product.categories)
    ? product.categories.slice(0, 2).join(' / ')
    : (product.category || 'Seating')

  let imageUrl = '/assets/images/placeholder.jpg'
  if (product.mainImage?.asset?.url) {
    imageUrl = product.mainImage.asset.url
  } else if (product.mainImage?.asset?._ref || product.mainImage?.asset?._id) {
    imageUrl = product.imageUrl && !product.imageUrl.includes('aceray.com') ? product.imageUrl : '/assets/images/placeholder.jpg'
  } else if (product.imageUrl && !product.imageUrl.includes('aceray.com')) {
    imageUrl = product.imageUrl
  } else if (Array.isArray(product.gallery) && product.gallery[0]?.asset?.url) {
    imageUrl = product.gallery[0].asset.url
  }

  function handleFavoriteClick() {
    setIsFavorite(toggleFavoriteProduct(slug))
  }

  const finalImageUrl = optimizeSanityUrl(imageUrl, { width: 450, quality: 75 })

  return (
    <article className={`product-card ${className}`}>
      <button
        type="button"
        className={`product-favorite-button ${isFavorite ? 'product-favorite-button-active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={`${isFavorite ? 'Remove' : 'Add'} ${product.title || 'product'} ${isFavorite ? 'from' : 'to'} favorites`}
        aria-pressed={isFavorite}
      >
        <Heart aria-hidden="true" />
      </button>

      <Link to={`/product/${encodeURIComponent(slug)}`} className="product-card-link">
        <div className="product-image-wrapper">
          <img
            src={finalImageUrl}
            alt={product.title ? `${product.title} commercial seating by Aceray` : 'Aceray Commercial Furniture'}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/assets/images/placeholder.jpg'
            }}
          />
        </div>
        <h3 className="product-name">{product.title}</h3>
        <p className="product-category">{cat}</p>
      </Link>
    </article>
  )
}
