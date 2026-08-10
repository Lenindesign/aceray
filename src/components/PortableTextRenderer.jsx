import { Link } from 'react-router-dom'
import { Quote } from 'lucide-react'

export default function PortableTextRenderer({ blocks = [] }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <div className="portable-text-content">
      {blocks.map((block, index) => {
        const key = block._key || `block-${index}`

        // Handle Image blocks
        if (block._type === 'image') {
          const src = block.asset?.url || block.url
          if (!src) return null
          return (
            <figure key={key} className="portable-image-figure">
              <img src={src} alt={block.alt || 'Blog illustration'} loading="lazy" />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          )
        }

        // Handle Product Embed blocks
        if (block._type === 'productEmbed' || block.product) {
          const prod = block.product
          if (!prod) return null
          return (
            <div key={key} className="portable-product-embed">
              <div className="portable-product-embed-info">
                <span className="tag">FEATURED PRODUCT</span>
                <h4>{prod.title}</h4>
                {prod.designer && <p>Design: {prod.designer}</p>}
                <Link to={`/product/${prod.slug?.current || prod.slug}`} className="btn-outline">
                  View Product Specs
                </Link>
              </div>
            </div>
          )
        }

        // Handle standard text blocks
        if (block._type === 'block') {
          const style = block.style || 'normal'
          const text = block.children?.map((child) => child.text).join('') || ''

          if (!text.trim()) return null

          if (style === 'h2') {
            return <h2 key={key} className="portable-h2">{text}</h2>
          }
          if (style === 'h3') {
            return <h3 key={key} className="portable-h3">{text}</h3>
          }
          if (style === 'h4') {
            return <h4 key={key} className="portable-h4">{text}</h4>
          }
          if (style === 'blockquote') {
            return (
              <blockquote key={key} className="portable-blockquote">
                <Quote className="portable-quote-icon" aria-hidden="true" />
                <p>{text}</p>
              </blockquote>
            )
          }

          // Bullet list items
          if (block.listItem === 'bullet') {
            return (
              <ul key={key} className="portable-ul">
                <li>{text}</li>
              </ul>
            )
          }

          return <p key={key} className="portable-paragraph">{text}</p>
        }

        return null
      })}
    </div>
  )
}
