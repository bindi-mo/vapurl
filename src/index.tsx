/**
 * Vapurl: A personal URL shortener on Cloudflare Workers
 */

import { KVNamespace } from '@cloudflare/workers-types'
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import pkg from 'react-dom/server'
import { Link, ReactRefresh, Script, ViteClient } from 'vite-ssr-components/react'
import App from './client/app.tsx'
const { renderToString } = pkg

type Bindings = {
  URL_KV: KVNamespace
  API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Root page
app.get('/', (c) => {
  const html = renderToString(
    <html>
      <head>
        <ViteClient />
        <ReactRefresh />
        <Script src='/src/client/index.tsx' />
        <Link href='/src/style.css' rel='stylesheet' />
      </head>
      <body>
        <div id='root'><App /></div>
      </body>
    </html>
  )
  return c.html(html)
})

// Redirect logic
app.get('/:id', async (c) => {
  const id = c.req.param('id')

  // Get URL from KV
  const url = await c.env.URL_KV.get(id)

  if (!url) {
    return c.text('Vapurl: The specified link was not found.', 404)
  }

  // Perform 302 redirect (temporary redirect recommended considering statistics, etc.)
  return c.redirect(url, 302)
})

// API for creation (protected by Bearer Auth)
app.post(
  '/api/create',
  async (c, next) => {
    const token = c.env.API_KEY
    return bearerAuth({ token })(c, next)
  },
  async (c) => {
    try {
      const { id, url } = await c.req.json()

      if (!id || !url) {
        return c.json({ error: 'ID and URL are required' }, 400)
      }

      // Save to KV
      await c.env.URL_KV.put(id, url)

      return c.json({
        message: 'Vapurl was created successfully',
        short_url: `${new URL(c.req.url).origin}/${id}`,
        original_url: url
      })
    } catch (_e) {
      return c.json({ error: 'Invalid JSON request' }, 400)
    }
  }
)

export default app
