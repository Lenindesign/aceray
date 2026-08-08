import React from 'react'
import SitePasswordGate from '@/components/SitePasswordGate'

export default {
  title: 'Atomic Design/Organisms/SitePasswordGate',
  component: SitePasswordGate,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Password gate modal organism protecting restricted catalog or project views.',
      },
    },
  },
}

export const PasswordGateModal = () => (
  <SitePasswordGate onAuthenticated={() => alert('Authenticated!')} />
)
