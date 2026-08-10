// Curated Aceray Editorial Blog Dataset with Sanity GROQ Integration
export const BLOG_POSTS = [
  {
    id: 'post-1',
    _id: 'post-1',
    title: 'Engineering Commercial Seating: Beechwood vs. Welded Steel Frames',
    slug: { current: 'engineering-commercial-seating-beechwood-vs-metal' },
    category: 'Material Guides',
    publishedAt: '2026-08-01T10:00:00Z',
    readTime: '5 min read',
    featured: true,
    author: {
      name: 'Aceray Technical Editorial',
      role: 'Contract Engineering Team',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
    },
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200',
    excerpt:
      'Discover how kiln-dried European beechwood joinery compares to single-unit welded steel frames in high-turn hospitality and corporate environments.',
    bodyBlocks: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ text: 'The Demands of Contract Furniture Engineering' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text:
              'Commercial dining chairs, barstools, and lounge seating endure relentless daily traffic, chemical sanitizers, and dynamic weight loads. Unlike residential furniture, which is designed for moderate home usage, contract furniture must maintain structural integrity under continuous, heavy-turn operations.',
          },
        ],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ text: 'Kiln-Dried European Beechwood Joinery' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text:
              "Aceray's solid wood side chairs and armchairs are crafted from kiln-dried European beech and oak, dried to an exact 6% to 8% moisture content. This precise moisture control eliminates wood warping and splitting under HVAC humidity fluctuations. Joints are constructed with true mortise-and-tenon framing and corner-blocked stress reinforcement, preventing the wobbles common in dowel-only construction.",
          },
        ],
      },
      {
        _type: 'block',
        style: 'blockquote',
        children: [
          {
            text:
              'BIFMA static load testing requires commercial seating to withstand minimum 400 to 500 lb static drops without frame deflection or joint separation.',
          },
        ],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ text: 'Welded Steel & Aluminum Construction' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text:
              'For high-turn bar counters and outdoor venues, fully welded steel and aluminum frames offer single-unit rigidity that never requires hardware retightening. Stainless steel or brass kickplates on wood footrests prevent heel wear and maintain premium aesthetics over years of service.',
          },
        ],
      },
    ],
    relatedProductSlugs: ['550r-01', 'mira-6'],
  },
  {
    id: 'post-2',
    _id: 'post-2',
    title: 'Demystifying Double Rub Ratings for Hospitality Upholstery',
    slug: { current: 'demystifying-double-rub-ratings-contract-upholstery' },
    category: 'Design Notes',
    publishedAt: '2026-07-15T14:30:00Z',
    readTime: '4 min read',
    featured: false,
    author: {
      name: 'Elena Vasquez',
      role: 'Hospitality Textiles Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300',
    },
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200',
    excerpt:
      'Why Wyzenbeek 30,000 double rub minimums are essential for commercial dining, and when to specify 100,000+ double rub vinyls or performance leathers.',
    bodyBlocks: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ text: 'Understanding Wyzenbeek & Martindale Abrasion Tests' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text:
              'When specifying upholstery for hotel lobbies, wine bars, or executive boardrooms, fabric longevity is paramount. The Wyzenbeek method measures abrasion resistance by rubbing cotton duck fabric back and forth against test upholstery until noticeable wear occurs.',
          },
        ],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text:
              'While residential upholstery typically rates around 15,000 double rubs, contract commercial environments require a minimum of 30,000 double rubs. High-volume operations, hospital waiting areas, and high-turn dining rooms benefit from 50,000 to 100,000+ double rub performance fabrics, coated vinyls, or performance faux leathers.',
          },
        ],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ text: 'COM & COL Tailoring Support' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text:
              "Aceray provides comprehensive Customer's Own Material (COM) and Customer's Own Leather (COL) tailoring across all upholstered seating collections, enabling interior designers to seamlessly match custom colorways while maintaining commercial warranty standards.",
          },
        ],
      },
    ],
    relatedProductSlugs: ['alba-swiv5pc'],
  },
  {
    id: 'post-3',
    _id: 'post-3',
    title: 'Designing High-Turn Restaurant Interiors: Seat Heights & Flow',
    slug: { current: 'designing-high-turn-restaurant-dining-spaces' },
    category: 'Hospitality Insights',
    publishedAt: '2026-06-28T09:15:00Z',
    readTime: '6 min read',
    featured: false,
    author: {
      name: 'Marco Rossi',
      role: 'A&D Trade Consultant',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
    },
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200',
    excerpt:
      'Optimal clearance ratios between counter seats and table tops, stackable seating storage logistics, and anti-wobble table base selection.',
    bodyBlocks: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ text: 'Precision Clearance Ratios for Guest Comfort' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text:
              'Proper seat height alignment is essential for guest posture and dining satisfaction. For standard 42" bar counters or bar rails, specify 30" seat-height commercial barstools (allowing 12" of lap clearance). For 36" kitchen or hospitality counters, specify 24" seat-height counter stools.',
          },
        ],
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ text: 'Anti-Wobble Table Base Engineering' }],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text:
              'A shaky table immediately ruins the guest experience. Aceray commercial table base systems utilize heavy-duty cast iron and precision steel columns fitted with adjustable anti-wobble floor glides, providing low center-of-gravity stability even under heavy edge pressure.',
          },
        ],
      },
    ],
    relatedProductSlugs: ['mira-6', '550r-01'],
  },
]

export function getBlogPostBySlug(slug) {
  if (!slug) return null
  const clean = slug.toLowerCase().trim()
  return (
    BLOG_POSTS.find(
      (p) => p.slug?.current?.toLowerCase() === clean || p.id === clean
    ) || null
  )
}
