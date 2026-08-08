import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import '../src/index.css'
import './storybook-fallback.css'

import theme from './theme'

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    docs: {
      theme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story, context) => {
      const initialEntries = context.parameters?.reactRouter?.initialEntries || ['/']

      return (
        <MemoryRouter initialEntries={initialEntries}>
          <Story />
        </MemoryRouter>
      )
    },
  ],
}

export default preview
