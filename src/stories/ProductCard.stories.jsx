import ProductCard from '@/components/ProductCard'

const meta = {
  title: 'Aceray Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

const SAMPLE_PRODUCT = {
  _id: 'sample-1',
  title: 'ARENA-B',
  slug: { current: 'arena-b' },
  categories: ['Bar Height Table Base', 'Ready to Ship'],
  imageUrl: 'https://aceray.com/wp-content/uploads/2026/01/0006s_0000_Arte-UU-horizontal-C.webp',
}

export function Default() {
  return (
    <div className="w-[320px] p-4">
      <ProductCard product={SAMPLE_PRODUCT} />
    </div>
  )
}

export function ProductGrid() {
  const products = [
    {
      _id: 'p1',
      title: 'ARENA-B',
      slug: { current: 'arena-b' },
      categories: ['Barstool', 'Ready to Ship'],
      imageUrl: 'https://aceray.com/wp-content/uploads/2026/01/Alba-4.webp',
    },
    {
      _id: 'p2',
      title: 'CORSO',
      slug: { current: 'corso' },
      categories: ['Armchair', 'Wood Frame'],
      imageUrl: 'https://aceray.com/wp-content/uploads/2024/12/corso3.webp',
    },
    {
      _id: 'p3',
      title: 'MIRA-X3',
      slug: { current: 'mira-x3' },
      categories: ['Lounge Seating'],
      imageUrl: 'https://aceray.com/wp-content/uploads/2024/12/mira-x3-2-1.webp',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl p-6 bg-white">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}
