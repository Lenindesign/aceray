import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function BlogPage() {
  useEffect(() => {
    document.title = 'Blog – Aceray | Commercial Seating Insights'
  }, [])

  return (
    <div className="blog-page">
      <section className="container blog-page-container">
        <div className="blog-page-heading">
          <span className="blog-page-eyebrow">Aceray Blog</span>
          <h1>Design Notes for Commercial Seating</h1>
          <p>
            Product stories, material guidance, and specification notes for hospitality and contract interiors.
          </p>
        </div>

        <div className="blog-empty-panel">
          <h2>Articles are coming soon</h2>
          <p>
            Until the editorial library is published, explore the latest seating collections or connect with our trade team for project support.
          </p>
          <div className="blog-empty-actions">
            <Link to="/catalog?new=1" className="btn-primary">
              What's New
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
