# gcoman.com

Marketing site + lead-capture platform for **Global Chemicals LLC** (Oman / GCC chemical supplier).

Vite 7 · React 18 · TypeScript · Tailwind · shadcn/ui · react-router-dom v7 · Supabase (Postgres, auth, edge functions) · i18next (English + Arabic) · Puppeteer prerendering for SEO · client-side legacy-URL redirects.

Beyond the public catalogue (275 products across 22 categories) the app includes an admin dashboard (analytics, contact/job/newsletter tables, resume preview, Excel export), Supabase auth with roles, AI-powered product search, download-gated lead capture synced to Zoho CRM, and a three.js 3D chemistry hero.

## Quick start

```sh
npm i
npm run dev        # dev server on http://localhost:8080
```

```sh
npm run lint       # eslint
npx tsc -b         # typecheck
npm run test:e2e   # Playwright smoke suite
npm run build      # full production build with prerender (~5–10 min, 300+ routes)
```

## Documentation

**[CLAUDE.md](CLAUDE.md) is the canonical developer guide** — architecture, the prerender/SEO pipeline (and the three ways to silently break it), deploy chain, branch workflow, and verification commands. Read it before making changes.

Additional references live in `docs/` (deployment guides, SEO/security audits).

## Branches & deploys

Work lands on `Develop`; `main` is production and is promoted manually after QA. A push to `main` triggers the Lovable build, which publishes `dist/` to Lovable's CDN. Details in CLAUDE.md → "Deploy chain".

This project was originally scaffolded with [Lovable](https://lovable.dev/projects/88275aec-3e28-4007-bd65-43d79fa41e87), which still runs the production build pipeline.
