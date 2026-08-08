import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public', '../assets'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': resolve(process.cwd(), 'src'),
    }
    config.plugins = [
      ...(config.plugins || []),
      tailwindcss(),
    ]

    return config
  },
}

export default config
