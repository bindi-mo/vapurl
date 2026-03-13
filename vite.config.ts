import { cloudflare } from '@cloudflare/vite-plugin'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
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
    devServer({
      adapter,
      entry: 'src/index.tsx',
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    conditions: ['workerd', 'browser', 'default'],
  },
}))
