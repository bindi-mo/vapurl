import { cloudflare } from '@cloudflare/vite-plugin'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import tailwindVite from '@tailwindcss/vite'
import tailwindPostcss from '@tailwindcss/postcss'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'

export default defineConfig(({ mode }) => ({
  plugins: [
    cloudflare(),
    ssrPlugin({
      entry: {
        target: ['src/index.tsx'],
      },
      hotReload: {
        ignore: ['./src/client/**/*.tsx'],
      },
    }),
    react(),
    ...(mode === 'development' ? [tailwindVite()] : []),
    devServer({
      adapter,
      entry: 'src/index.tsx',
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindPostcss, autoprefixer],
    },
  },
  resolve: {
    conditions: ['types'],
  },
}))
