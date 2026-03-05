# BayesIQ Website — Architecture State

Last Updated: 2026-03-04 (Phase 1 complete)

---

# System Status

The BayesIQ website has completed **Phase 1 (MVP Launch)**. All 5 core pages are live and deployed on Vercel. Product definition docs in `docs/product/` serve as the canonical source of truth for all messaging. The site is built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4.

**Phase 2 (Content & Credibility)** is next — contact form backend, SEO, analytics, and blog infrastructure.

---

# Pages

| Route | Page | Status | Derives from |
|-------|------|--------|-------------|
| `/` | Homepage | ✅ live | `company_overview.md`, `company_tagline.md`, `problems.md` |
| `/services` | Services | ✅ live | `services.md` |
| `/approach` | Approach | ✅ live | `engagement_model.md` |
| `/case-studies` | Case Studies | ✅ live | Illustrative examples (3) |
| `/contact` | Contact | ✅ live | Standalone |

---

# Components

| Component | Path | Purpose |
|-----------|------|---------|
| Header | `src/components/Header.tsx` | Sticky nav, mobile hamburger, CTA button |
| Footer | `src/components/Footer.tsx` | Logo, nav links, copyright |
| ServiceCard | `src/components/ServiceCard.tsx` | Card for homepage service display |
| CaseStudyCard | `src/components/CaseStudyCard.tsx` | Problem/Found/Fix/Result card |
| CTA | `src/components/CTA.tsx` | Reusable call-to-action section |
| ContactForm | `src/components/ContactForm.tsx` | Form with name/email/company/message (TODO: Resend backend) |

---

# Product Definitions (Source of Truth)

| File | Purpose | Status |
|------|---------|--------|
| `docs/product/company_overview.md` | Core positioning, services, ideal clients, vision | ✅ |
| `docs/product/company_tagline.md` | Primary tagline + alternatives | ✅ |
| `docs/product/brand.md` | Tone, language rules, visual identity, reference sites | ✅ |
| `docs/product/services.md` | 4 services with scope, deliverables, format, audience | ✅ |
| `docs/product/problems.md` | 5 core pain points | ✅ |
| `docs/product/engagement_model.md` | 6-step engagement process | ✅ |

---

# Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 15 (App Router) | React 19, TypeScript 5.7 |
| Styling | Tailwind CSS v4 | Custom `bayesiq-*` color scale + `accent` |
| Hosting | Vercel | |
| Forms | ContactForm component | TODO: Resend server action |
| Analytics | None yet | TODO: Vercel Analytics or Plausible |
| Content | Direct TSX | Blog will use MDX (Phase 2) |

---

# Configuration

| File | Purpose |
|------|---------|
| `site.config.yaml` | Page definitions (path, type, title, description), nav items, CTA |
| `next.config.mjs` | Next.js configuration |
| `postcss.config.mjs` | PostCSS for Tailwind |
| `tsconfig.json` | TypeScript strict mode |
| `package.json` | Dependencies and scripts |
| `config/project.yaml` | Pipeline kernel for bayesiq controller repo |

---

# What's Missing (Phase 2 Scope)

- **Contact form backend** — form renders but doesn't send email
- **SEO** — no structured data, no sitemap.xml, no robots.txt
- **Analytics** — no tracking at all
- **Blog** — no blog infrastructure or posts
- **OG images** — no Open Graph images for social sharing

---

# Key Stats (Homepage)

- "7 broken metrics found in a single audit"
- "80% reduction in metric debugging time"
- "< 2 weeks from kickoff to actionable findings"
