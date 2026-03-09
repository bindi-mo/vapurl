import { cloudflare } from '@cloudflare/vite-plugin'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'

export default defineConfig({
  plugins: [
    cloudflare(),
    ssrPlugin(),
    devServer({
      adapter,
      entry: 'src/index.ts',
    }),
  ],
})
