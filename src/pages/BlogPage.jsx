import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { fetchSanityResult } from '@/lib/sanityHttp'
import { urlFor } from '@/lib/sanityImageUrl'
import { removeSeoJsonLd, setSeoMetadata } from '@/lib/seo'
import { BLOG_POSTS } from '@/data/blogPosts'

const BLOG_QUERY = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  readTime,
  category,
  featured,
  excerpt,
  mainImage,
  author->{
    name,
    role,
    avatar
  }
}`

const CATEGORIES = ['All', 'Material Guides', 'Design Notes', 'Hospitality Insights', 'Case Studies']

export default function BlogPage() {
  const [posts, setPosts] = useState(BLOG_POSTS)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setSeoMetadata({
      title: 'Aceray Blog | Commercial Seating Insights & Material Guides',
      description:
        'Read Aceray design notes, material engineering guides, double-rub ratings, and hospitality specification insights for architects and interior designers.',
      path: '/blog',
    })
    removeSeoJsonLd('product-jsonld')

    fetchSanityResult(BLOG_QUERY)
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((p) => ({
            ...p,
            imageUrl: p.mainImage ? urlFor(p.mainImage).url() : p.imageUrl,
            author: {
              name: p.author?.name || 'Aceray Editorial',
              role: p.author?.role || 'Contract Furniture Team',
              avatarUrl: p.author?.avatar ? urlFor(p.author.avatar).url() : null,
            },
          }))
          setPosts(formatted)
        }
      })
      .catch((err) => {
        console.warn('Sanity blog fetch fallback to local posts:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  // Filtering
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      post.title?.toLowerCase().includes(q) ||
      post.excerpt?.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q)

    return matchesCategory && matchesSearch
  })

  const featuredPost = posts.find((p) => p.featured) || posts[0]
  const gridPosts = filteredPosts.filter((p) => p._id !== featuredPost?._id)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="blog-page">
      <section className="container blog-page-container">
        {/* Header */}
        <div className="blog-page-heading">
          <span className="designer-eyebrow">EDITORIAL &amp; SPECIFICATION NOTES</span>
          <h1>Aceray Contract Furniture Journal</h1>
          <p>
            Technical engineering notes, fabric double-rub ratings, space planning guidelines, and hospitality material insights for architects and interior specifiers.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="blog-toolbar">
          <div className="blog-categories-pills" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`guide-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="blog-search-wrap">
            <Search className="blog-search-icon" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="blog-search-input"
              aria-label="Search articles"
            />
          </div>
        </div>

        {/* Featured Hero Article (when showing all / no search) */}
        {featuredPost && activeCategory === 'All' && !searchQuery && (
          <article className="blog-hero-card">
            <div className="blog-hero-image-wrap">
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="blog-hero-img"
              />
              <span className="blog-hero-badge">FEATURED ARTICLE</span>
            </div>
            <div className="blog-hero-content">
              <div className="blog-meta-tags">
                <span className="tag">{featuredPost.category}</span>
                <span className="blog-meta-item">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                  {formatDate(featuredPost.publishedAt)}
                </span>
                <span className="blog-meta-item">
                  <Clock className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                  {featuredPost.readTime}
                </span>
              </div>
              <h2 className="blog-hero-title">
                <Link to={`/blog/${featuredPost.slug?.current || featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="blog-hero-excerpt">{featuredPost.excerpt}</p>
              <div className="blog-card-footer">
                {featuredPost.author && (
                  <div className="blog-author-block">
                    {featuredPost.author.avatarUrl && (
                      <img
                        src={featuredPost.author.avatarUrl}
                        alt={featuredPost.author.name}
                        className="blog-author-avatar"
                      />
                    )}
                    <div>
                      <span className="blog-author-name">{featuredPost.author.name}</span>
                      <span className="blog-author-role">{featuredPost.author.role}</span>
                    </div>
                  </div>
                )}
                <Link
                  to={`/blog/${featuredPost.slug?.current || featuredPost.slug}`}
                  className="btn-primary"
                >
                  Read Article
                  <ArrowRight className="ml-2 w-4 h-4 inline" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* Article Grid */}
        {filteredPosts.length > 0 ? (
          <div className="blog-grid">
            {(activeCategory === 'All' && !searchQuery ? gridPosts : filteredPosts).map(
              (post) => {
                const slugStr = post.slug?.current || post.slug
                return (
                  <article key={post._id || post.id} className="blog-card">
                    <Link to={`/blog/${slugStr}`} className="blog-card-image-link">
                      <div className="blog-card-image-wrap">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="blog-card-img"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                    <div className="blog-card-body">
                      <div className="blog-meta-tags">
                        <span className="tag">{post.category}</span>
                        <span className="blog-meta-item">{post.readTime}</span>
                      </div>
                      <h3 className="blog-card-title">
                        <Link to={`/blog/${slugStr}`}>{post.title}</Link>
                      </h3>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                      <div className="blog-card-footer">
                        <span className="blog-card-date">
                          <Calendar className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <Link to={`/blog/${slugStr}`} className="blog-read-more">
                          Read Story <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              }
            )}
          </div>
        ) : (
          <div className="blog-empty-panel">
            <BookOpen className="w-12 h-12 text-[#718f80] mx-auto mb-4" aria-hidden="true" />
            <h2>No articles found</h2>
            <p>We couldn't find any articles matching your search criteria.</p>
            <button
              type="button"
              className="btn-outline mt-4"
              onClick={() => {
                setActiveCategory('All')
                setSearchQuery('')
              }}
            >
              Clear Search &amp; Filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
