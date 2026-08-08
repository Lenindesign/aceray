import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default {
  title: 'Atomic Design/Atoms/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Header title text' },
    description: { control: 'text', description: 'Header description text' },
    badge: { control: 'text', description: 'Eyebrow badge/label text' },
    className: { control: 'text', description: 'Custom CSS classes' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Universal UI Card Container enforcing Rule 7 (var(--radius-card) / 16px corner radius) and Rule 10 (generous internal padding buffers).',
      },
    },
  },
}

const Template = ({ title, description, badge, className, ...args }) => (
  <Card className={className || "max-w-md p-6 border-[#E5E3DD] bg-white rounded-[var(--radius-card)]"}>
    <CardHeader className="p-0 mb-4">
      {badge && <span className="text-xs uppercase tracking-widest text-[#718f80] font-sans font-semibold">{badge}</span>}
      <CardTitle className="text-2xl font-normal text-[#222] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </CardTitle>
      {description && <CardDescription className="text-sm text-[#555] mt-1">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="p-0 text-xs text-[#767676] space-y-2">
      <div className="flex justify-between py-1 border-b border-[#F3F2EE]">
        <span>Density:</span>
        <span className="font-semibold text-[#222]">2.8 lb/cu.ft</span>
      </div>
      <div className="flex justify-between py-1 border-b border-[#F3F2EE]">
        <span>Flame Rating:</span>
        <span className="font-semibold text-[#222]">CAL 117-2013</span>
      </div>
    </CardContent>
    <CardFooter className="p-0 mt-6 pt-4 border-t border-[#F3F2EE]">
      <Button className="btn-outline w-full">Download Spec PDF</Button>
    </CardFooter>
  </Card>
)

export const StandardCard = Template.bind({})
StandardCard.args = {
  badge: 'Specification',
  title: 'CONTRACT GRADE DENSITY',
  description: 'High-density polyurethane foam meets CA Bulletin 117-2013 standards for commercial seating.',
}

export const StatBoxCard = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl p-6 bg-[#FAF9F6] rounded-2xl border border-[#E5E3DD]">
    <div className="bg-white p-6 rounded-[var(--radius-card)] border border-[#E5E3DD] text-center space-y-2">
      <span className="text-3xl font-light text-[#718f80]" style={{ fontFamily: 'var(--font-heading)' }}>25+</span>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#222]">Years Craftsmanship</p>
    </div>
    <div className="bg-white p-6 rounded-[var(--radius-card)] border border-[#E5E3DD] text-center space-y-2">
      <span className="text-3xl font-light text-[#718f80]" style={{ fontFamily: 'var(--font-heading)' }}>100%</span>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#222]">European Sourced</p>
    </div>
    <div className="bg-white p-6 rounded-[var(--radius-card)] border border-[#E5E3DD] text-center space-y-2">
      <span className="text-3xl font-light text-[#718f80]" style={{ fontFamily: 'var(--font-heading)' }}>10yr</span>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#222]">Structural Warranty</p>
    </div>
  </div>
)
