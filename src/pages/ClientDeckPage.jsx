import React from 'react';
import { Link } from 'react-router-dom';

export default function ClientDeckPage() {
  return (
    <div className="client-deck-page" style={{ padding: 'var(--space-4) 0', maxWidth: '1200px', margin: '0 auto' }}>
      <section className="deck-slide" id="slide-1" style={{ marginBottom: 'var(--space-4)' }}>
        <h1 className="section-title">Aceray Redesign Overview</h1>
        <p className="deck-copy" style={{ marginBottom: 'var(--space-3)' }}>
          A modern, high-performance static site built with Vite and React, showcasing the premium furniture catalog while utilizing Sanity CMS for modern content authoring.
        </p>
        <Link to="/catalog" className="btn btn-primary" style={{ display: 'inline-block' }}>View Catalog</Link>
      </section>

      <section className="deck-slide" id="slide-2" style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="section-title">Architecture Diagram</h2>
        <div style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-light)', marginBottom: 'var(--space-3)', borderRadius: 'var(--radius-card)', textAlign: 'center' }}>
          <em>[Architecture Diagram Visualization]</em>
        </div>
        <p className="deck-copy">The site is a React front-end (Vite) that pulls structured content via the Sanity CMS. All assets are optimized and hosted on a static edge CDN (Netlify) for lightning-fast performance.</p>
      </section>

      <section className="deck-slide" id="slide-3" style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="section-title">Design System</h2>
        <ul className="deck-list" style={{ listStyleType: 'disc', paddingLeft: 'var(--space-3)' }}>
          <li><strong>Primary Color:</strong> <code>#718f80</code> (Sage Green)</li>
          <li><strong>Typography:</strong> Montserrat / Futura standard for headings.</li>
          <li><strong>Spacing:</strong> 8pt grid (4px, 8px, 12px, 16px, ...)</li>
          <li><strong>Cards & Containers:</strong> 16px border-radius standard for all cards.</li>
        </ul>
      </section>

      <section className="deck-slide" id="slide-4" style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="section-title">CMS Integration (Sanity)</h2>
        <p className="deck-copy">
          Content editors use the modern Sanity Studio to manage products, categories, finishes, and promotional blocks. The front-end fetches this structured data directly, ensuring a decoupled, resilient, and scalable architecture.
        </p>
      </section>
    </div>
  );
}
