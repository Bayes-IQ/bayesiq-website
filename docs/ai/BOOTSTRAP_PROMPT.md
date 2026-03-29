# BayesIQ Website — Bootstrap Prompt

You are picking up development on the BayesIQ website. This document reflects the current state of the codebase as of 2026-03-29.

---

## What This Repo Is

A Next.js 15 (App Router) website for BayesIQ. It does three things:

1. **Lead conversion** — consulting pages, case studies, contact/booking flows
2. **Platform showcase** — platform capabilities page
3. **Golden Flows commercial demo** — the core commercial experience: interactive pages that walk executives through real governed analytics engagements, showing scored audits, board reports, cascade drill-downs, and governance workflows across 5 industry verticals

---

## Route Structure

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/consulting` | Audit-first consulting |
| `/consulting/explore` | Golden flows hub |
| `/consulting/explore/[vertical]` | Golden flows vertical pages (fintech-gf, saas, hospital, retail, real-estate) |
| `/consulting/case-studies` | Case studies |
| `/consulting/industries` | Industry pages |
| `/consulting/sample-report` | Sample report |
| `/platform` | Platform page |
| `/assessment` | Self-assessment wizard |
| `/contact` | Contact + Calendly |
| `/privacy`, `/terms` | Legal |

Old routes (`/services`, `/approach`, `/golden-flows/*`, `/blog/*`, `/playground`, `/fintech`, `/healthcare`, `/audit-kit`, `/case-studies`, `/sample-report`) redirect via `next.config.mjs`.

**Nav:** Home | Consulting | Platform | Get in Touch

---

## Golden Flows Architecture

This is the main commercial surface. Understanding it is essential.

- **15 JSON schemas** (8 Contract B + 7 Contract C) in `schemas/golden-flows/`
- Contract freeze v1 since 2026-03-15
- TypeScript types auto-generated from schemas (`npm run generate:types`)
- **Data:** `public/golden-flows/{vertical}/` (5 verticals, all payload types) + `public/golden-flows/governance/`
- **Static data loader:** `src/lib/golden-flows.ts` with `public/` to `fixtures/` fallback
- **Governance normalization:** `src/lib/governance.ts` normalizes 6 Contract C payloads into indexed Maps
- **35+ components** in `src/components/golden-flows/`
- **E2E tests:** `golden-flows.spec.ts`, `governance-detail.spec.ts`
- **Analytics:** `src/lib/gf-analytics.ts`

### The Vertical Page Experience

Each vertical page (`/consulting/explore/[vertical]`) shows:

- Vertical selector cards (hook metrics: headline discrepancy + consequence + trust cue)
- Hero section (score trajectory, board report summary, narrative)
- Reality reveal (key metrics with reported vs audited values, top risks)
- Tabbed content (Dashboard / Report / Workflow)
- Governance decision log + progress bar
- Deliverables bar (dashboard link, audit report)
- Vertical-specific CTA

---

## Design System

- Centralized: `src/vendor/biq/tokens.css` + `src/vendor/biq/tailwind-v4-theme.css`
- Semantic tokens: `biq-primary`, `biq-text-primary/secondary/muted`, `biq-surface-1/2`, `biq-border`, `biq-status-*`
- Site-specific gray scale: `bayesiq-{50..900}` for dark sections

---

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript 5.7
- Tailwind CSS v4 with centralized design system
- framer-motion for animations
- Playwright (E2E) + Vitest (unit) + @axe-core/playwright (a11y)
- Vercel Analytics, Resend, Calendly

---

## Brand Voice

- Technical but accessible — write for senior data engineers
- Specific over vague — "7 broken metrics" not "improved quality"
- Clean, minimal design — Stripe/Linear/Vercel aesthetic

---

## File Layout

```
src/app/                     → Next.js routes
src/app/consulting/explore/  → Golden flows hub + [vertical] pages
src/components/              → Shared UI components
src/components/golden-flows/ → 35+ golden flows components
src/components/consulting/   → Consulting page components
src/components/platform/     → Platform page components
src/components/assessment/   → Assessment wizard components
src/lib/                     → Data loading, governance, analytics, flags
src/types/golden-flows/      → Auto-generated TypeScript types from schemas
src/vendor/biq/              → Design system tokens + Tailwind theme
schemas/golden-flows/        → JSON schemas (Contract B + C)
fixtures/golden-flows/       → Fixture/fallback data
public/golden-flows/         → Production golden flows data (5 verticals + governance)
docs/product/                → Source of truth for messaging
docs/ai/                     → ROADMAP, ARCH_STATE, plans, contracts
e2e/                         → Playwright E2E tests (7 spec files)
```

---

## Cross-Repo Dependencies

| Dependency | Direction | Status |
|-----------|-----------|--------|
| Contract B (data payloads) | data-audit-kit → website | Schemas frozen v1, demo data in use |
| Contract C (governance payloads) | bayesiq platform → website | Schemas frozen v1, demo data in use |
| Real data integration | Both → website | Pending (Issue #50) |

---

## How to Run

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # production build
npm run lint             # ESLint
npx tsc --noEmit         # typecheck
npm run generate:types   # regenerate golden flows types from schemas
npm run validate:schemas # validate JSON schemas
```

---

## Quality Gates

Every change must pass:

- `npm run build` + `npm run lint` + `npx tsc --noEmit`
- `npm test` — Playwright E2E (~80 tests)
- `npm run test:unit` — Vitest unit tests
- `npm run validate:schemas` — JSON schema validation

---

## What's Next

- Real data integration — replace demo data with production audit output (Issue #50)
- Visual QA retrofit (Issue #83)
- Brand assets: favicon + OG images (Issue #80)
- Formspree contact form backend (Issue #79)
- Design system dark section migration (Issues #77, #78)
