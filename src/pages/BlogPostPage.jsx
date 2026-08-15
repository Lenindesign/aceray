import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, Share2, Tag, ShieldCheck } from 'lucide-react'
import { fetchSanityResult } from '@/lib/sanityHttp'
import { urlFor } from '@/lib/sanityImageUrl'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'
import { getBlogPostBySlug } from '@/data/blogPosts'
import PortableTextRenderer from '@/components/PortableTextRenderer'
import ProductCard from '@/components/ProductCard'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'

const POST_DETAIL_QUERY = `*[_type == "post" && (slug.current == $slug || lower(slug.current) == lower($slug))][0]{
  _id,
  title,
  slug,
  publishedAt,
  readTime,
  category,
  excerpt,
  mainImage,
  body,
  relatedProducts[]->{
    _id, title, slug, imageUrl, mainImage{asset->{_id, url}}, categories, designer
  },
  author->{
    name,
    role,
    bio,
    avatar
  }
}`

const RELATED_PRODUCTS_QUERY = `*[_type == "product" && (slug.current in $slugs || lower(slug.current) in $slugs)][0...4]{
  _id, title, slug, imageUrl, mainImage{asset->{_id, url}}, categories, designer
}`

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadPost() {
      setLoading(true)
      try {
        const sanityPost = await fetchSanityResult(POST_DETAIL_QUERY, { slug })
        if (sanityPost && isMounted) {
          const formatted = {
            ...sanityPost,
            imageUrl: sanityPost.mainImage ? urlFor(sanityPost.mainImage).url() : null,
            author: {
              name: sanityPost.author?.name || 'Aceray Technical Editorial',
              role: sanityPost.author?.role || 'Contract Furniture Team',
              bio: sanityPost.author?.bio,
              avatarUrl: sanityPost.author?.avatar ? urlFor(sanityPost.author.avatar).url() : null,
            },
          }
          setPost(formatted)
          if (sanityPost.relatedProducts?.length) {
            setRelatedProducts(sanityPost.relatedProducts)
          }
          setSeo(formatted)
          return
        }
      } catch (err) {
        console.warn('Sanity blog post detail query fallback:', err)
      }

      // Fallback to local dataset
      const localPost = getBlogPostBySlug(slug)
      if (localPost && isMounted) {
        setPost(localPost)
        setSeo(localPost)

        if (localPost.relatedProductSlugs?.length) {
          fetchSanityResult(RELATED_PRODUCTS_QUERY, { slugs: localPost.relatedProductSlugs })
            .then((prods) => {
              if (isMounted && prods) setRelatedProducts(prods)
            })
            .catch(() => {})
        }
      }
      if (isMounted) setLoading(false)
    }

    function setSeo(p) {
      setSeoMetadata({
        title: `${p.title} | Aceray Commercial Seating Journal`,
        description: p.excerpt || 'Read contract seating specifications and design notes from Aceray.',
        path: `/blog/${slug}`,
        image: p.imageUrl,
      })

      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.excerpt,
        image: p.imageUrl ? [p.imageUrl] : [],
        datePublished: p.publishedAt,
        author: {
          '@type': 'Person',
          name: p.author?.name || 'Aceray Editorial',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Aceray',
          logo: {
            '@type': 'ImageObject',
            url: 'https://aceray.com/wp-content/uploads/2021/04/aceray-logo.svg',
          },
        },
      }

      let script = document.getElementById('article-jsonld')
      if (!script) {
        script = document.createElement('script')
        script.id = 'article-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(articleSchema)
      setLoading(false)
    }

    loadPost()

    return () => {
      isMounted = false
      document.getElementById('article-jsonld')?.remove()
    }
  }, [slug])

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="blog-post-page container py-16">
        <div className="animate-pulse max-w-3xl mx-auto space-y-6">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-post-page container py-20 text-center">
        <h2 className="text-3xl font-heading text-[var(--color-text-main)] mb-4">Article Not Found</h2>
        <p className="text-[var(--color-text-muted)] mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="btn-primary">
          Back to Journal Index
        </Link>
      </div>
    )
  }

  return (
    <article className="blog-post-page">
      {/* Breadcrumbs */}
      <div className="breadcrumb-nav container">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/blog">Journal</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container blog-post-container">
        {/* Article Header */}
        <header className="blog-post-header">
          <div className="blog-meta-tags">
            <span className="tag">{post.category}</span>
            <span className="blog-meta-item">
              <Calendar className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="blog-meta-item">
              <Clock className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
              {post.readTime}
            </span>
          </div>

          <h1 className="blog-post-title">{post.title}</h1>

          {post.excerpt && <p className="blog-post-subtitle">{post.excerpt}</p>}

          {/* Author info & Share button */}
          <div className="blog-post-author-bar">
            {post.author && (
              <div className="blog-author-block">
                {post.author.avatarUrl && (
                  <img
                    src={post.author.avatarUrl}
                    alt={`${post.author.name} - ${post.author.role || 'Aceray Technical Editorial'}`}
                    className="blog-author-avatar"
                  />
                )}
                <div>
                  <span className="blog-author-name">{post.author.name}</span>
                  <span className="blog-author-role">{post.author.role}</span>
                </div>
              </div>
            )}

            <button type="button" onClick={handleShare} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </header>

        {/* Hero Cover Image */}
        {post.imageUrl && (
          <div className="blog-post-cover-wrap">
            <img src={post.imageUrl} alt={post.mainImage?.alt || post.title} className="blog-post-cover-img" />
          </div>
        )}

        {/* Body Content */}
        <div className="blog-post-body">
          {post.body ? (
            <PortableTextRenderer blocks={post.body} />
          ) : post.bodyBlocks ? (
            <PortableTextRenderer blocks={post.bodyBlocks} />
          ) : null}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="blog-post-related-products">
            <div className="blog-related-heading">
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
              <h2>Featured Products in this Story</h2>
            </div>
            <div className="blog-related-grid">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod._id || prod.slug} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog Index Button */}
        <div className="blog-post-footer-nav">
          <Link to="/blog" className="btn-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Editorial Articles</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
