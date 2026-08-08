import React from 'react'
import { Badge } from '@/components/ui/badge'

export default {
  title: 'Atomic Design/Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive'],
      description: 'The visual style variant of the badge.',
    },
    className: {
      control: 'text',
      description: 'Custom CSS classes applied to the badge.',
    },
    children: {
      control: 'text',
      description: 'The text label displayed inside the badge.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Universal Tag & Badge system adhering to minimum padding (8px 16px for pills/badges) and upper tracking rules.',
      },
    },
  },
}

const Template = (args) => <Badge {...args} />

export const FeatureTag = Template.bind({})
FeatureTag.args = {
  className: 'bg-[#718f80] text-white px-4 py-2 uppercase tracking-widest text-xs font-semibold',
  children: 'New Release',
}

export const OutlineBadge = Template.bind({})
OutlineBadge.args = {
  variant: 'outline',
  className: 'border-[#718f80] text-[#718f80] px-4 py-2 uppercase tracking-wider text-xs',
  children: 'In Stock',
}

export const CategoryTag = (args) => (
  <span className={args.className || 'tag'}>{args.children || 'Armchairs'}</span>
)
CategoryTag.argTypes = {
  className: { control: 'text' },
  children: { control: 'text' },
}
CategoryTag.args = {
  className: 'tag',
  children: 'Armchairs',
}

export const CategoryPill = (args) => (
  <span className={args.className || 'cat-pill cursor-pointer'}>{args.children || 'Side Chairs'}</span>
)
CategoryPill.argTypes = {
  className: { control: 'text' },
  children: { control: 'text' },
}
CategoryPill.args = {
  className: 'cat-pill cursor-pointer',
  children: 'Side Chairs',
}

export const BadgeGallery = () => (
  <div className="flex flex-wrap gap-3 items-center p-6 bg-white rounded-xl border border-[#E5E3DD]">
    <span className="tag">Collection</span>
    <Badge className="bg-[#718f80] text-white px-3 py-1 uppercase tracking-widest text-xs">Ready to Ship</Badge>
    <Badge variant="outline" className="border-[#718f80] text-[#718f80] px-3 py-1 uppercase tracking-widest text-xs">Contract Grade</Badge>
    <span className="cat-pill cursor-pointer">Grande</span>
    <Badge className="bg-[#2C3E35] text-white px-3 py-1 uppercase tracking-widest text-xs">Italian Craft</Badge>
  </div>
)
