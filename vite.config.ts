import { cloudflare } from '@cloudflare/vite-plugin'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'

export default defineConfig({
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
    tailwindcss(),
    devServer({
      adapter,
      entry: 'src/index.tsx',
    }),
  ],
})
