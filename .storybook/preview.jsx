import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import '../src/index.css'

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
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
