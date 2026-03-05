# BayesIQ Website

Marketing site for BayesIQ data auditing consultancy.

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Deployed on Vercel

## Structure
- `docs/product/` — canonical product definitions (source of truth for all messaging)
- `src/app/` — Next.js routes and layouts
- `src/components/` — shared UI components

## Content workflow
1. Product definitions in `docs/product/` are the source of truth
2. Page content in `src/app/` is derived from product definitions
3. Changes to messaging should start in `docs/product/`, then propagate to pages

## Brand voice
- Technical, specific, confident without hype
- Write for senior data engineers and analytics leads
- Use concrete numbers and examples over vague claims
- See `docs/product/brand.md` for full guidelines

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run linter

## When adding a page
1. Add entry to `site.config.yaml`
2. Create route in `src/app/[page-name]/page.tsx`
