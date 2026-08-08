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

const mockProduct = {
  id: 'wp-product-9116',
  title: 'ALBA-1W',
  slug: 'alba-1w',
  familySlug: 'alba',
  categories: ['Side Chairs'],
  imageUrl: '/assets/migrated/Alba_4.webp',
  designer: 'E. & P. Ciani Design',
}

export const Standard = () => (
  <div className="max-w-xs p-4">
    <ProductCard product={mockProduct} />
  </div>
)

export const ProductGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 max-w-5xl bg-[#FAF9F6] rounded-2xl">
    <ProductCard product={mockProduct} />
    <ProductCard product={{ ...mockProduct, id: 'wp-product-7982', title: 'BALLO-3', slug: 'ballo-3', familySlug: 'ballo', categories: ['Armchairs'], imageUrl: '/assets/migrated/Aceray-Ballo-chairs-setting.jpg', designer: 'Calesi/Tonelli' }} />
    <ProductCard product={{ ...mockProduct, id: 'wp-product-277', title: 'MIRA-7', slug: 'mira-7', familySlug: 'mira', categories: ['Lounge Seating'], imageUrl: '/assets/migrated/Mira-X3-horizontal.webp', designer: 'Area 44' }} />
  </div>
)
