# BayesIQ Website — Bootstrap Prompt

You are picking up development on the BayesIQ website (`biq_website`). This document gives you everything you need to contribute effectively.

---

## What This Repo Is

A Next.js 15 (App Router) website that serves as the product surface for the BayesIQ ecosystem. It does two things:

1. **Lead conversion** — marketing pages that drive consulting engagement bookings
2. **Self-serve product experience** — CSV playground where users drop a file, get instant profiling, and download a ready-to-run Streamlit dashboard

The site is deployed on Vercel at bayesiq.com.

---

## The Two Products

### BayesIQ Data Audit Kit (`bayesiq-data-audit-kit` repo)
Automated data quality audit pipeline. Takes any CSV/Parquet/Excel/Snowflake, runs 12+ quality checks, validates metrics, generates a scored report (0-100), a dbt project, a Streamlit dashboard, and documentation. 185 tests, domain-agnostic, production-ready. Currently at Phase 3.7 (guided intake with interactive mode).

### BayesIQ Platform (`bayesiq` repo)
Personal assistant operating system with tool registry, policy engine, approval gateway, and audit trails. Built-in tools for Calendar, GitHub, Sonos, memory, notifications, and data operations. Safety-first architecture: every dangerous action gated.

---

## Current State (Phase 4 Complete)

The website was fully rewritten to position BayesIQ as a product company (not a consulting firm). All pages reference the two products by name.

**What's live:**
- Product-first homepage with Audit Kit + Platform cards and engagement tiers
- Products page (`/services`) with feature grids for both products
- CSV Playground (`/playground`) — drag-and-drop CSV, client-side profiling, downloadable self-extracting `.sh` installer that bundles app.py + requirements.txt + data.csv, creates venv, installs deps, launches Streamlit
- Approach page with pipeline architecture (6-step flow) and engagement tiers
- Sample report page showing actual Audit Kit artifacts and scoring rubric
- Healthcare and Fintech industry landing pages
- Blog (3 posts), assessment tool, contact form (Resend), Calendly embed
- Full SEO (structured data, sitemap, robots.txt)

**Nav:** Products | Approach | Playground | Live Demo | Blog | Get in Touch

---

## What's Next (Phase 5 — Server-Side Audit Pipeline)

Run the real audit kit on the website server-side. User drops CSV, gets full quality checks + scored report + dbt project — no local install needed. See ROADMAP.md Phase 5 for details.

**After that:**
- Phase 6: Conversational audit (chat UI for column approval, metric intent, finding drill-down)
- Phase 7: Hosted dashboards, user accounts, subscriptions

---

## Key Architecture Decisions

1. **Source of truth chain:** `docs/product/*` → `src/app/*` ← `site.config.yaml`. Never write page copy that doesn't trace to a product doc.
2. **Client-side CSV processing:** The playground parses and profiles CSVs entirely in the browser. No data is uploaded. The generated installer embeds the CSV as a heredoc.
3. **Self-extracting installer:** Download is a single `.sh` file (not a ZIP). Contains app.py, requirements.txt, and data.csv as heredocs. Creates `~/bayesiq-dashboard/`, sets up venv, installs deps, launches Streamlit.
4. **No heavy dependencies in the website:** The playground profiler is a TypeScript reimplementation of the audit kit's schema_profiler. Server-side audit kit integration is Phase 5.

---

## Tech Stack

- Next.js 15 (App Router) + TypeScript + React 19
- Tailwind CSS v4 with custom `bayesiq-{50..900}` color scale
- Vercel hosting
- Resend for contact form + newsletter
- Vercel Analytics
- MDX blog via `next-mdx-remote/rsc` + `gray-matter`

---

## Brand Voice (from docs/product/brand.md)

- Technical but accessible — write for senior data engineers
- Specific over vague — "7 broken metrics" not "improved quality"
- Say "audit" not "solution", "broken" not "suboptimal"
- Never use: revolutionary, game-changing, leverage, synergy, unlock
- Clean, minimal design — Stripe/Linear/Vercel aesthetic

---

## File Layout

```
src/app/           → Next.js routes (each page.tsx is a route)
src/components/    → Shared UI (Header, Footer, CTA, ServiceCard, etc.)
src/components/playground/  → CSV profiler + Streamlit generator
docs/product/      → Source of truth for all messaging
docs/ai/           → ROADMAP.md, ARCH_STATE.md, this file
docs/ops/          → Deploy checklist, analytics events
site.config.yaml   → Page definitions, nav config, SEO metadata
```

---

## Cross-Repo Dependencies

| This Website Needs | From Repo | When |
|-------------------|-----------|------|
| Module interface manifests | `bayesiq-data-audit-kit` Phase 3.8 | Phase 5 |
| Audit pipeline as importable package | `bayesiq-data-audit-kit` | Phase 5 |
| Orchestration layer for multi-turn workflows | `bayesiq` Phase 4 | Phase 6 |
| Multi-tenant infrastructure | `bayesiq` Phase 5 | Phase 7 |

---

## How to Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (must pass before merge)
npm run lint         # ESLint
npx tsc --noEmit     # typecheck
```

---

## Quality Gates

Every change must pass: `npm run build` + `npm run lint` + `npx tsc --noEmit`. Lighthouse targets: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90.
