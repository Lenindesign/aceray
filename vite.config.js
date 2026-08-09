import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

function nonRenderBlockingCssPlugin() {
  return {
    name: 'non-render-blocking-css',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" (.*?)href="(.*?\.css)"(.*?)>/g,
        '<link rel="preload" $1href="$2" as="style"$3><link rel="stylesheet" $1href="$2" media="print" onload="this.media=\'all\'"$3><noscript><link rel="stylesheet" $1href="$2"$3></noscript>'
      )
    },
  }
}

export default defineConfig({
  define: {
    __SERVER_FORWARD_CONSOLE__: false,
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
    target: 'es2022',
    cssCodeSplit: true,
    modulePreload: false,
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
    react(),
    tailwindcss(),
    nonRenderBlockingCssPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
})
