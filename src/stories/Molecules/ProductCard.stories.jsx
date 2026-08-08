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
  id: 'wp-product-12447',
  title: 'ALBA-1W',
  slug: 'alba-1w',
  familySlug: 'alba',
  categories: ['Side Chairs'],
  imageUrl: 'https://cdn.sanity.io/images/xm9au2qy/production/08b8aa606d30402a5f86ce8dd7cb700fd3985df6-1200x1200.jpg',
  mainImage: { asset: { url: 'https://cdn.sanity.io/images/xm9au2qy/production/08b8aa606d30402a5f86ce8dd7cb700fd3985df6-1200x1200.jpg' } },
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
    <ProductCard product={{
      id: 'wp-product-7982',
      title: 'BALLO-3',
      slug: 'ballo-3',
      familySlug: 'ballo',
      categories: ['Armchairs'],
      imageUrl: 'https://cdn.sanity.io/images/xm9au2qy/production/86bd4109b7263d53801bdd4eb63cc81791ea8dfe-1200x1200.jpg',
      mainImage: { asset: { url: 'https://cdn.sanity.io/images/xm9au2qy/production/86bd4109b7263d53801bdd4eb63cc81791ea8dfe-1200x1200.jpg' } },
      designer: 'Calesi/Tonelli'
    }} />
    <ProductCard product={{
      id: 'wp-product-277',
      title: 'MIRA-7',
      slug: 'mira-7',
      familySlug: 'mira',
      categories: ['Lounge Seating'],
      imageUrl: 'https://cdn.sanity.io/images/xm9au2qy/production/b2848f9bbf34a8e42b2c4be6aeae7def10c81e7a-1200x1200.jpg',
      mainImage: { asset: { url: 'https://cdn.sanity.io/images/xm9au2qy/production/b2848f9bbf34a8e42b2c4be6aeae7def10c81e7a-1200x1200.jpg' } },
      designer: 'Area 44'
    }} />
  </div>
)
