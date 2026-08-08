import React from 'react'
import Footer from '@/components/Footer'

export default {
  title: 'Atomic Design/Organisms/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Primary site footer organism with brand blurb, category link columns, catalog search form, and smaller social icons.',
      },
    },
  },
}

export const FullFooter = () => <Footer />
