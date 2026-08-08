import React from 'react'
import ProductCard from '@/components/ProductCard'

export default {
  title: 'Atomic Design/Molecules/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  argTypes: {
    product: {
      control: 'object',
      description: 'The product data object to populate the card.',
    },
    className: {
      control: 'text',
      description: 'Additional custom classes for styling layout.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Universal Product Card System enforcing Rule 6 & Rule 7: Transparent image background wrapper (zero #fafafa inner box) and var(--radius-card) 16px corner radius.',
      },
    },
  },
}

const mockProduct = {
  id: 'wp-product-9116',
  title: 'ALBA-1W',
  slug: 'alba-1w',
  familySlug: 'alba',
  categories: ['Side Chairs'],
  imageUrl: '/assets/migrated/Alba-4.webp',
  mainImage: { asset: { url: '/assets/migrated/Alba-4.webp' } },
  designer: 'E. & P. Ciani Design',
}

const Template = (args) => (
  <div className="max-w-xs p-4">
    <ProductCard {...args} />
  </div>
)

export const Standard = Template.bind({})
Standard.args = {
  product: mockProduct,
}

export const ProductGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 max-w-5xl bg-[#FAF9F6] rounded-2xl">
    <ProductCard product={mockProduct} />
    <ProductCard product={{ ...mockProduct, id: 'wp-product-7982', title: 'BALLO-3', slug: 'ballo-3', familySlug: 'ballo', categories: ['Armchairs'], imageUrl: '/assets/migrated/Aceray-Ballo-chairs-setting.jpg', designer: 'Calesi/Tonelli' }} />
    <ProductCard product={{ ...mockProduct, id: 'wp-product-277', title: 'MIRA-7', slug: 'mira-7', familySlug: 'mira', categories: ['Lounge Seating'], imageUrl: '/assets/migrated/Mira-X3-horizontal.webp', designer: 'Area 44' }} />
  </div>
)
