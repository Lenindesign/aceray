import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default {
  title: 'Atomic Design/Molecules/BreadcrumbNav',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    homeLabel: { control: 'text', description: 'Label for the home page link' },
    catalogLabel: { control: 'text', description: 'Label for the catalog link' },
    categoryLabel: { control: 'text', description: 'Label for the active category category link' },
    productLabel: { control: 'text', description: 'Active product name displaying on current page' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Navigation breadcrumb molecule for product detail, family collection, and catalog section hierarchies.',
      },
    },
  },
}

const Template = ({ homeLabel, catalogLabel, categoryLabel, productLabel }) => (
  <div className="p-6 bg-white rounded-xl border border-[#E5E3DD]">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{homeLabel}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/catalog">{catalogLabel}</BreadcrumbLink>
        </BreadcrumbItem>
        {categoryLabel && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/catalog?cat=${encodeURIComponent(categoryLabel.toLowerCase())}`}>{categoryLabel}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        {productLabel && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{productLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  </div>
)

export const CatalogBreadcrumb = Template.bind({})
CatalogBreadcrumb.args = {
  homeLabel: 'Home',
  catalogLabel: 'Catalog',
  categoryLabel: 'Armchairs',
  productLabel: 'Bistro Armchair',
}
