import React from 'react'
import { Separator } from '@/components/ui/separator'

export default {
  title: 'Atomic Design/Atoms/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Universal divider line component used to visually separate content sections, specs, or catalog layouts.',
      },
    },
  },
}

export const Horizontal = () => (
  <div className="w-full max-w-md p-6 bg-white border border-[#E5E3DD] rounded-xl space-y-4">
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-[#222]">Specifications</h3>
      <p className="text-xs text-[#555]">Technical details for contract furniture compliance.</p>
    </div>
    <Separator className="bg-[#E5E3DD]" />
    <div className="text-xs text-[#555] space-y-2">
      <div className="flex justify-between">
        <span>Frame Material</span>
        <span className="font-semibold text-[#222]">Solid Beechwood</span>
      </div>
      <div className="flex justify-between">
        <span>Compliance</span>
        <span className="font-semibold text-[#222]">CAL 117-2013</span>
      </div>
    </div>
  </div>
)

export const Vertical = () => (
  <div className="flex h-5 items-center space-x-4 p-6 bg-white border border-[#E5E3DD] rounded-xl text-sm max-w-sm">
    <div className="text-[#222]">Chairs</div>
    <Separator orientation="vertical" className="bg-[#E5E3DD]" />
    <div className="text-[#222]">Stools</div>
    <Separator orientation="vertical" className="bg-[#E5E3DD]" />
    <div className="text-[#222]">Tables</div>
  </div>
)
