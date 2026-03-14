# Copilot Instructions

## Project Overview

VAPURL is a URL shortening service running on Cloudflare Workers.
Backend uses Hono, frontend uses React + Tailwind CSS, and data is stored in Cloudflare KV.

## Tech Stack

- **Runtime:** Cloudflare Workers (Deno compatible)
- **Backend:** Hono v4
- **Frontend:** React 18 + Tailwind CSS 3
- **Build:** Vite + SSR via `vite-ssr-components`
- **Testing:** Deno test runner + `@testing-library/react`
- **Deploy:** Wrangler

## Coding Conventions

### TypeScript

- Assume `strict: true` is enabled
- Write JSX in `.tsx` files and include the `.tsx` extension in imports
- Use `globalThis` instead of `window` (for SSR compatibility)
- Prefix unused variables with `_` (e.g., `_mode`)
- Use `const` for variables that are never reassigned

### Backend (Hono)

- Use typed bindings with `Hono<{ Bindings: Bindings }>`
- Authenticate with the `bearerAuth` middleware
- Access KV via `c.env.VAPURL_KV` inside handlers
- Return error responses in JSON format

### Frontend (React)

- Use function components with Hooks
- Style with Tailwind CSS utility classes
- Prefix localStorage keys with `vapurl_`

### Testing

- Place test files alongside their targets as `*.test.ts(x)`
- Use `@std/expect` for assertions (import as a bare specifier)
- Test server routes directly with `app.request()`
- Set up a JSDOM environment for React component tests

### Imports

- Use bare specifiers defined in the Deno import map (`deno.jsonc` `imports`)
- Do not use `jsr:` or `npm:` protocols directly; import through the import map

## Commit Messages

- Follow the Conventional Commits format (`fix:`, `feat:`, `chore:`, etc.)
- Write the subject in English, keeping it concise (aim for under 50 characters)
- Summarize the intent or purpose of the change rather than listing every modification
- Add details in the body if needed (separated from the subject by a blank line)

## Commands

- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Test:** `deno task test`
- **Lint:** `deno task lint`
- **Deploy:** `npm run deploy`
- **Type generation:** `npm run cf-typegen`
