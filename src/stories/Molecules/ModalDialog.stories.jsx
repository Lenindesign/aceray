import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default {
  title: 'Atomic Design/Molecules/ModalDialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Dialog header title text' },
    eyebrow: { control: 'text', description: 'Small uppercase eyebrow text above header' },
    description: { control: 'text', description: 'Detailed instruction/description text' },
    confirmText: { control: 'text', description: 'Label text of the primary dialog action button' },
    open: { control: 'boolean', description: 'Dynamic state showing if dialog is visible/hidden' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Modal dialog molecule enforcing Rule 4 & Rule 7 (generous container padding, 16px card radius, accessible close triggers).',
      },
    },
  },
}

const Template = ({ title, eyebrow, description, confirmText, open }) => (
  <div className="p-8 bg-[#FAF9F6] rounded-2xl flex justify-center">
    <Dialog open={open}>
      <DialogContent className="max-w-lg px-8 pt-10 pb-8 rounded-[var(--radius-card)] bg-white border border-[#E5E3DD]">
        <DialogHeader className="space-y-3">
          {eyebrow && <span className="text-xs uppercase tracking-widest text-[#718f80] font-semibold">{eyebrow}</span>}
          <DialogTitle className="text-2xl font-normal text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </DialogTitle>
          {description && <DialogDescription className="text-sm text-[#555]">{description}</DialogDescription>}
        </DialogHeader>

        <div className="my-6 space-y-4">
          <div className="p-4 bg-[#F3F2EE] rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#718f80]/20 border border-[#718f80]/40 flex items-center justify-center text-xs font-bold text-[#718f80]">
              G2
            </div>
            <div>
              <p className="text-sm font-semibold text-[#222]">Grade 2 Velvet - Sage</p>
              <p className="text-xs text-[#767676]">100,000 Double Rubs • Stain Resistant</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button className="btn-primary w-full">{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
)

export const SampleRequestDialog = Template.bind({})
SampleRequestDialog.args = {
  eyebrow: 'Material Sample',
  title: 'REQUEST FABRIC SWATCH',
  description: 'Select your preferred grade and colorway. Samples ship within 24 business hours to qualified design firms.',
  confirmText: 'Confirm Sample Request',
  open: true,
}
