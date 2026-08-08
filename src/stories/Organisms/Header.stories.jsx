import React from 'react'
import Header from '@/components/Header'

export default {
  title: 'Atomic Design/Organisms/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Primary site navigation header organism with responsive menu, dropdowns, search trigger, and brand logo.',
      },
    },
  },
}

export const FullHeader = () => <Header />
