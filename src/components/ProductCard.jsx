import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FAVORITES_CHANGED_EVENT, isFavoriteProduct, toggleFavoriteProduct } from '@/lib/favorites'

import { optimizeSanityUrl } from '@/lib/sanityImageUrl'

import { getProductPricing, formatPrice } from '@/lib/pricing'

export default function ProductCard({ product, className = '', layout = 'grid' }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const slug = product?.slug?.current || product?.slug || ''
  const pricing = getProductPricing(product)
  const formattedStartingPrice = pricing?.startingPrice ? formatPrice(pricing.startingPrice) : null

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

  if (layout === 'list') {
    return (
      <article className={`product-card product-card-list ${className}`}>
        <button
          type="button"
          className={`product-favorite-button ${isFavorite ? 'product-favorite-button-active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={`${isFavorite ? 'Remove' : 'Add'} ${product.title || 'product'} ${isFavorite ? 'from' : 'to'} favorites`}
          aria-pressed={isFavorite}
        >
          <Heart aria-hidden="true" />
        </button>

        <Link to={`/product/${encodeURIComponent(slug)}`} className="product-image-wrapper product-list-image-wrapper">
          <img
            src={finalImageUrl}
            alt={
              product.mainImage?.alt ||
              product.alt ||
              (product.title
                ? `${product.title}${product.designer ? ` designed by ${product.designer}` : ''} commercial ${cat} for hospitality & contract interiors by Aceray`
                : 'Aceray Commercial Contract Seating Furniture')
            }
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/assets/images/placeholder.jpg'
            }}
          />
        </Link>

        <div className="product-list-content">
          <div className="product-list-info">
            <h3 className="product-name">
              <Link to={`/product/${encodeURIComponent(slug)}`}>{product.title}</Link>
            </h3>
            <p className="product-category">{cat}</p>
            {formattedStartingPrice && (
              <p className="product-card-price product-card-list-price">Starting at {formattedStartingPrice}</p>
            )}
            {product.designer && (
              <p className="product-designer">Designed by {product.designer}</p>
            )}

            {/* Quick Specifications & Dimensions */}
            <div className="product-list-specs">
              {(product.overallWidth || product.overallHeight || product.overallDepth) && (
                <div className="product-spec-row">
                  <span className="product-spec-label">Dimensions:</span>
                  <span className="product-spec-value">
                    {[
                      product.overallWidth && `W ${product.overallWidth}"`,
                      product.overallDepth && `D ${product.overallDepth}"`,
                      product.overallHeight && `H ${product.overallHeight}"`,
                      product.seatHeight && `SH ${product.seatHeight}"`,
                    ].filter(Boolean).join('  ·  ')}
                  </span>
                </div>
              )}

              {Array.isArray(product.materials) && product.materials.length > 0 && (
                <div className="product-spec-row">
                  <span className="product-spec-label">Materials:</span>
                  <span className="product-spec-value">{product.materials.join(' · ')}</span>
                </div>
              )}

              {product.madeIn && (
                <div className="product-spec-row">
                  <span className="product-spec-label">Origin:</span>
                  <span className="product-spec-value">Made in {product.madeIn}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    )
  }

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
            alt={
              product.mainImage?.alt ||
              product.alt ||
              (product.title
                ? `${product.title}${product.designer ? ` designed by ${product.designer}` : ''} commercial ${cat} for hospitality & contract interiors by Aceray`
                : 'Aceray Commercial Contract Seating Furniture')
            }
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
        {formattedStartingPrice && (
          <p className="product-card-price">Starting at {formattedStartingPrice}</p>
        )}
      </Link>
    </article>
  )
}
