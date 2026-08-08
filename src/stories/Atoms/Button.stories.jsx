import React from 'react'
import { Button } from '@/components/ui/button'

export default {
  title: 'Atomic Design/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
      description: 'The visual style variant of the button.',
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
      description: 'The sizing preset for the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is interactive or disabled.',
    },
    children: {
      control: 'text',
      description: 'The label or contents inside the button.',
    },
    className: {
      control: 'text',
      description: 'Custom CSS classes (e.g. btn-primary, btn-outline).',
    },
    onClick: { action: 'clicked' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Universal CTA & Button System enforcing AGENTS.md rule: `.btn-primary` (solid sage green, white text, uppercase) and `.btn-outline` (transparent green border).',
      },
    },
  },
}

const Template = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  className: 'btn-primary',
  children: 'Request a Quote',
  variant: 'default',
  size: 'default',
}

export const SecondaryOutline = Template.bind({})
SecondaryOutline.args = {
  className: 'btn-outline',
  children: 'View Specification Sheet',
  variant: 'outline',
  size: 'default',
}

export const Small = Template.bind({})
Small.args = {
  className: 'btn-primary text-xs px-3 py-1',
  children: 'Quick View',
  variant: 'default',
  size: 'sm',
}

export const LargeCTA = Template.bind({})
LargeCTA.args = {
  className: 'btn-primary px-8 py-4 text-base',
  children: 'Explore Full Collection',
  variant: 'default',
  size: 'lg',
}

export const InteractiveShowcase = (args) => (
  <div className="flex flex-wrap gap-4 items-center p-6 bg-[#FAF9F6] rounded-xl border border-[#E5E3DD]">
    <Button className="btn-primary" {...args}>{args.children || 'Primary Action'}</Button>
    <Button variant="outline" className="btn-outline">Outline CTA</Button>
    <Button variant="secondary" className="bg-[#718f80]/10 text-[#718f80] hover:bg-[#718f80]/20 font-medium">
      Subtle Green
    </Button>
  </div>
)
InteractiveShowcase.args = {
  children: 'Custom CTA',
}
