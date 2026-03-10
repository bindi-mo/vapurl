/**
 * Vapurl: A personal URL shortener on Cloudflare Workers
 * * [修正内容]
 * ローカル環境や Wrangler でのビルドを想定した Hono の標準的な構成です。
 * プレビュー環境でのエラーを回避するため、実際のデプロイ時には
 * `npm install hono` が必要であることを前提としています。
 */

import { KVNamespace } from '@cloudflare/workers-types'
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import pkg from 'react-dom/server'
import { Link, ReactRefresh, Script, ViteClient } from 'vite-ssr-components/react'
import App from './client/app'
const { renderToString } = pkg

type Bindings = {
  URL_KV: KVNamespace
  API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// ルートページ
app.get('/', (c) => {
  const html = renderToString(
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
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

// リダイレクトロジック
app.get('/:id', async (c) => {
  const id = c.req.param('id')

  // KVからURLを取得
  const url = await c.env.URL_KV.get(id)

  if (!url) {
    return c.text('Vapurl: 指定されたリンクは見つかりませんでした。', 404)
  }

  // 302 リダイレクトを実行（統計取得などを考慮し、一時的リダイレクトを推奨）
  return c.redirect(url, 302)
})

// 作成用 API (Bearer Auth で保護)
app.post(
  '/api/create',
  async (c, next) => {
    // Cloudflareコンソールで設定した API_KEY と照合
    const token = c.env.API_KEY
    return bearerAuth({ token })(c, next)
  },
  async (c) => {
    try {
      const { id, url } = await c.req.json()

      if (!id || !url) {
        return c.json({ error: 'IDとURLは必須です' }, 400)
      }

      // KVに保存
      await c.env.URL_KV.put(id, url)

      return c.json({
        message: 'Vapurlが正常に作成されました',
        short_url: `${new URL(c.req.url).origin}/${id}`,
        original_url: url
      })
    } catch (e) {
      return c.json({ error: '無効なJSONリクエストです' }, 400)
    }
  }
)

export default app
