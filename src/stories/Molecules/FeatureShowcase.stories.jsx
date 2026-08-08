import React from 'react'
import { FAMILY_HERO_IMAGES } from '@/lib/productFamilies'

export default {
  title: 'Atomic Design/Molecules/FeatureShowcase',
  tags: ['autodocs'],
  argTypes: {
    eyebrow: { control: 'text', description: 'Small uppercase eyebrow text above header' },
    title: { control: 'text', description: 'Futura Std main heading' },
    description: { control: 'text', description: 'Geist body summary text description' },
    imageUrl: { control: 'text', description: 'High resolution image source URL' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Universal Feature Showcase Module System enforcing Rule 11: .feature-showcase, uppercase Futura Std title, tag eyebrow, and Geist body copy with py-20 breathing buffers.',
      },
    },
  },
}

const Template = ({ eyebrow, title, description, imageUrl }) => (
  <div className="feature-showcase p-8 bg-[#FAF9F6] rounded-2xl border border-[#E5E3DD] max-w-5xl">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="feature-image overflow-hidden rounded-xl bg-slate-200 aspect-[4/3]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="feature-text space-y-4">
        <span className="tag">{eyebrow}</span>
        <h2 className="text-3xl font-medium uppercase tracking-wide text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
          {title}
        </h2>
        <p className="text-base text-[#555] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
          {description}
        </p>
      </div>
    </div>
  </div>
)

export const FeatureShowcaseModule = Template.bind({})
FeatureShowcaseModule.args = {
  eyebrow: 'HERITAGE & ARTISANRY',
  title: 'HANDCRAFTED IN ITALY',
  description: 'Every chair frame is crafted with sustainable beechwood and engineered to withstand demanding commercial hospitality environments while maintaining timeless aesthetic beauty.',
  imageUrl: FAMILY_HERO_IMAGES.riva,
}
