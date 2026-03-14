# Vapurl

A personal URL shortener built on Cloudflare Workers using React, Hono, and Tailwind CSS.

## Features

- Shorten URLs with custom aliases
- Store shortened URLs in Cloudflare KV
- React-based frontend for easy interaction
- API endpoints for programmatic access
- Bearer token authentication for API

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Cloudflare account with Workers and KV enabled

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vapurl
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Setup

1. Create a Cloudflare KV namespace and note its ID.

2. Set up environment variables:
   - `VAPURL_KV_ID`: Your KV namespace ID
   - `VAPURL_API_KEY`: A secret API key for authentication

### Configuration

`wrangler.toml` is auto-generated from the template (`wrangler.template.toml`). Set the required environment variables before running any commands.

```bash
export VAPURL_KV_ID="your-kv-namespace-id"
export VAPURL_API_KEY="your-api-key"
```

> `wrangler.toml` is listed in `.gitignore` and will not be committed to the repository.

## Development

Start the development server:
```bash
npm run dev
```

This will start Vite's development server with Hono integration.

## Build

Build the project for production:
```bash
npm run build
```

## Deploy

### Local

Set the environment variables and run:

```bash
export VAPURL_KV_ID="your-kv-namespace-id"
export VAPURL_API_KEY="your-api-key"
npm run deploy
```

This uses `envsubst` to generate `wrangler.toml` from `wrangler.template.toml`, then builds and deploys.

### GitHub Actions

Pushes to the `main` branch trigger an automatic deployment.

Add the following secrets in your GitHub repository under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `VAPURL_KV_ID` | Cloudflare KV Namespace ID |
| `VAPURL_API_KEY` | API authentication key |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

## API Usage

### Shorten a URL
```bash
curl -X POST https://your-worker-url/shorten \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "alias": "example"}'
```

### Access Shortened URL
Visit `https://your-worker-url/example` to redirect to the original URL.

## Generating Types

To generate/synchronize types based on your Worker configuration:
```bash
npm run cf-typegen
```

Then use `CloudflareBindings` as generics when instantiating Hono:
```ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## License

[Add your license here]
