import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import compression from 'vite-plugin-compression'

export default defineConfig({
  define: {
    __SERVER_FORWARD_CONSOLE__: false,
  },
  oxc: {
    target: 'es2022',
  },
  server: {
    proxy: {
      '/sanity-api': {
        target: 'https://xm9au2qy.api.sanity.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sanity-api/, ''),
      },
    },
  },
  build: {
    target: ['es2022', 'chrome100', 'safari15', 'edge100', 'firefox100'],
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (id.includes('sanity')) {
              return 'vendor-sanity'
            }
            if (id.includes('lucide-react') || id.includes('base-ui')) {
              return 'vendor-ui'
            }
            return 'vendor'
          }
        },
      },
    },
  },
  plugins: [
    react({
      babel: {
        compact: true,
      },
    }),
    tailwindcss(),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
})
