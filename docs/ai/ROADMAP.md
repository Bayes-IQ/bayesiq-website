# BayesIQ Website — Development Roadmap

Last Updated: 2026-03-04 (Phases 1–3 complete, Phase 4 next)

---

# Guiding Principle

**BayesIQ Website is a lead-conversion engine** — every page moves a technical buyer closer to booking a conversation. Development proceeds in phases that build credibility incrementally:

```
MVP Launch → Content & Credibility → Growth & Interactivity
```

Content follows a strict derivation chain:

```
docs/product/* (truth) → src/app/* (derived copy + layout) ← site.config.yaml (routing/nav/SEO config)
```

`site.config.yaml` is configuration input (routes, nav, SEO metadata), not a derivation output. `docs/product/*` is the sole source of truth for messaging. Pages in `src/app/*` are direct TSX (Phase 1–2); MDX is introduced only when blog starts.

Never skip the source-of-truth step. Page copy that doesn't trace back to a product definition doc will drift.

---

# Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Hosting:** Vercel
- **Forms:** Resend + Next.js server action
- **Analytics:** Vercel Analytics (`@vercel/analytics`)
- **Content:** Direct TSX for pages; MDX blog via `next-mdx-remote/rsc` + `gray-matter`

---

# Quality Gates

Every PR must pass before merge:

- `npm run build` succeeds (no build errors)
- `npm run lint` passes
- Lighthouse scores: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90
- No broken internal links
- OG images render (once added)
- Typecheck passes (`npx tsc --noEmit`)

---

# Phase 1 — MVP Launch ✅

Goal: live site that establishes credibility and captures leads.

Key outcomes:

- **Homepage** with hero, problem statement, service cards, how-it-works, social proof stats, CTA
- **Services page** with 4 service breakdowns (Data Quality Audit, Telemetry Validation, Pipeline Design, Continuous Validation as "Coming Soon")
- **Approach page** with 6-step engagement model
- **Case Studies page** with 3 illustrative case studies (Fintech, Healthcare, E-commerce)
- **Contact page** with form (name, email, company, message) + value props
- **Navigation** with sticky header, mobile hamburger menu, footer
- **Product definitions** as source of truth in `docs/product/` (company overview, tagline, brand voice, services, problems, engagement model)
- **Deployed** on Vercel

### Completed Work

| # | Title | Status |
|---|-------|--------|
| — | Product definition docs (`docs/product/`) | ✅ done |
| — | Engineering scaffold (Next.js + Tailwind + TS) | ✅ done |
| — | Site config (`site.config.yaml`) | ✅ done |
| — | Homepage (`/`) | ✅ done |
| — | Services page (`/services`) | ✅ done |
| — | Approach page (`/approach`) | ✅ done |
| — | Case Studies page (`/case-studies`) | ✅ done |
| — | Contact page (`/contact`) | ✅ done |
| — | Header + Footer + shared components | ✅ done |

---

# Phase 2 — Content & Credibility

Goal: make the site findable (SEO), trustworthy (blog content), and functional (working contact form + analytics). This is the revenue-unlock phase — without it the site is a brochure nobody discovers.

Key outcomes:

- **SEO foundation** — unique meta titles/descriptions per page, structured data (Organization + Service JSON-LD), `sitemap.xml`, `robots.txt`, Google Search Console setup
- **Analytics with event spec** — Vercel Analytics or Plausible, with a defined event taxonomy (not just "we installed it")
- **Contact form backend** — Resend server action so form submissions actually deliver
- **Trust pages** — `/privacy` and `/terms` (lightweight, but technical buyers expect them; also helps email deliverability)
- **Blog infrastructure** — MDX-based blog with index page (`/blog`) and individual post routes (`/blog/[slug]`)
- **Initial blog posts** — 3-5 posts targeting high-intent keywords (see content plan below)

### Analytics Event Spec

Defined in `docs/ops/analytics_events.md` — created as part of PR#12. Events:

| Event | Properties | Notes |
|-------|-----------|-------|
| `page_view` | `path` | automatic via analytics provider |
| `cta_click` | `location` (header, hero, services, footer) | tracks which CTAs convert |
| `service_card_click` | `service_name` | which services get attention |
| `case_study_expand` | `case_study_id` | engagement depth |
| `contact_submit_started` | — | form engagement |
| `contact_submit_success` | — | actual leads |
| `contact_submit_error` | `error_type` | debug form issues |
| `blog_post_view` | `slug` | content performance |

### Content Plan

Blog posts (priority order — each targets a problem BayesIQ solves):

1. "How to audit your product telemetry in a week" — positions BayesIQ method, high search intent
2. "The 5 telemetry failures every product team makes" — list post, high shareability
3. "Schema drift: why your metrics degrade over time" — targets data engineers specifically
4. "Your A/B test is wrong: common metric definition errors" — targets product/growth teams
5. "ETL pipeline health checks: what to monitor and why" — targets data platform teams

**Content quality bar** — every post must include:
- A concrete example with specific numbers (e.g., "2 fields consistently null across 3 event types")
- At least one checklist, table, or code snippet
- A CTA at end ("book an audit" / "send us your logging spec")

### Near-Term PR Queue

Order optimized for fastest feedback loop: SEO + analytics first (visibility), then form backend (conversion), then trust pages, then blog. PR numbers continue from Phase 1 (pipeline-assigned #10–#18).

| # | Title | Phase | Layers affected | Status |
|---|-------|-------|-----------------|--------|
| #10 | SEO metadata + structured data | 2 | `src/app/layout.tsx`, `src/app/*/page.tsx` | ✅ done |
| #11 | Sitemap + robots.txt | 2 | `src/app/sitemap.ts`, `src/app/robots.ts` | ✅ done |
| #12 | Analytics integration + event spec | 2 | `src/app/layout.tsx`, `package.json`, `docs/ops/analytics_events.md` | ✅ done |
| #13 | Resend contact form server action | 2 | `src/app/contact/actions.ts`, `src/components/ContactForm.tsx` | ✅ done |
| #14 | Privacy + Terms pages | 2 | `src/app/privacy/`, `src/app/terms/`, `src/components/Footer.tsx` | ✅ done |
| #15 | Blog infrastructure (MDX + index + post routes) | 2 | `src/app/blog/`, `src/lib/blog.ts`, `content/blog/`, `package.json` | ✅ done |
| #16 | Blog post: telemetry audit guide | 2 | `content/blog/telemetry-audit-in-a-week.mdx` | ✅ done |
| #17 | Blog post: 5 telemetry failures | 2 | `content/blog/5-telemetry-failures.mdx` | ✅ done |
| #18 | Blog post: schema drift | 2 | `content/blog/schema-drift-why-your-metrics-degrade-over-time.mdx` | ✅ done |

### PR Dependencies

```
#10 (SEO metadata) — no dependencies, start here
#11 (Sitemap) — depends on #10 (sitemap must reflect final route metadata + canonical URLs)
#12 (Analytics) — no dependencies, can parallel with #10
#13 (Resend) — no dependencies, can parallel with #10
#14 (Privacy/Terms) — no dependencies, can parallel with #10
#15 (Blog infra) — no dependencies, can parallel with #10–#14
#16, #17, #18 (Blog posts) — depend on #15 (need blog infrastructure)
```

### Exit Criteria

Phase 2 is done when:
- Every page has unique meta title, description, and OG tags
- Organization + Service structured data validates in Google Rich Results Test
- `sitemap.xml` includes canonical URLs for all public routes and references `site.config.yaml` domain (no localhost/placeholders)
- `robots.txt` is live and references the sitemap URL
- Google Search Console is configured and sitemap submitted
- Analytics provider is active in production; page_view tracking verified via provider dashboard (not just local)
- Analytics event spec committed to `docs/ops/analytics_events.md`
- Contact form delivers emails via Resend; verified on Vercel preview deployment with real API key
- `/privacy` and `/terms` pages are live and linked from footer
- `/blog` index page lists posts with title, date, excerpt
- At least 3 blog posts are published, each meeting the content quality bar
- At least one post shows impressions in Search Console

---

# Phase 3 — Growth & Interactivity

Goal: convert passive visitors into qualified leads through interactive tools and direct booking.

Key outcomes:

- **Calendly integration** — embed on contact page for direct booking
- **Email capture** — newsletter signup (footer or dedicated component) with Resend list
- **Sample deliverable preview** — static page (`/sample-report`) showing what an audit report looks like: severity table, example findings, sample remediation plan. Answers the #1 technical buyer question: "what do I get if I pay you?"
- **Data quality self-assessment** — interactive questionnaire (5-7 questions → score + recommendations → email capture)
- **Landing pages** — industry-specific pages (healthcare, fintech, e-commerce) using `type: landing` in site config

### Near-Term PR Queue

| # | Title | Phase | Layers affected | Status |
|---|-------|-------|-----------------|--------|
| #19 | Calendly embed on contact page | 3 | `src/app/contact/`, `src/components/CalendlyEmbed.tsx` | ✅ done |
| #20 | Email capture / newsletter signup | 3 | `src/components/NewsletterSignup.tsx`, `src/app/actions/newsletter.ts`, `src/components/Footer.tsx` | ✅ done |
| #21 | Sample deliverable preview page | 3 | `src/app/sample-report/`, `site.config.yaml` | ✅ done |
| #22 | Data quality self-assessment tool | 3 | `src/app/assessment/`, `src/components/assessment/` | ✅ done |
| #23 | Industry landing pages (Healthcare + Fintech) | 3 | `src/app/healthcare/`, `src/app/fintech/`, `site.config.yaml` | ✅ done |

### PR Dependencies

```
#19 (Calendly) — depends on #12 (analytics)
#20 (Email capture) — depends on #13 (Resend), #14 (privacy), #12 (analytics)
#21 (Sample report) — depends on #14 (privacy/terms)
#22 (Self-assessment) — depends on #20 (email capture), #12 (analytics), #14 (privacy)
#23 (Landing pages) — depends on #21 (sample report), #19 (Calendly), #20 (email capture)
```

### Exit Criteria

Phase 3 is done when:
- Visitors can book a call directly from the site (Calendly embed)
- Email capture is live and collecting subscribers (Resend-backed)
- Sample report page is live and linked from at least one high-intent page
- Self-assessment tool generates a score and captures email
- At least 2 industry landing pages are live

---

# Phase 4 — Live Demo & Showcase (Future)

Goal: let prospects experience BayesIQ's value before talking to a human.

Key outcomes:

- **Playground** — upload a sample logging spec, see example validation output
- **Interactive case studies** — before/after data visualizations
- **Client portal** (if needed) — secure area for audit report delivery

This phase is speculative. Scope will be defined after Phase 3 based on conversion data.

---

# Architecture Snapshot

```
biq_website/
├── config/
│   └── project.yaml              # pipeline kernel
├── docs/
│   ├── product/                   # source of truth (human-owned)
│   │   ├── company_overview.md
│   │   ├── company_tagline.md
│   │   ├── brand.md
│   │   ├── services.md
│   │   ├── problems.md
│   │   └── engagement_model.md
│   └── ai/                        # pipeline docs
│       ├── ROADMAP.md             # this file
│       ├── ARCH_STATE.md
│       └── pr_markdown_plans/
├── src/
│   ├── app/                       # Next.js routes
│   │   ├── layout.tsx
│   │   ├── page.tsx               # homepage
│   │   ├── services/page.tsx
│   │   ├── approach/page.tsx
│   │   ├── case-studies/page.tsx
│   │   └── contact/page.tsx
│   └── components/                # shared UI
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── ServiceCard.tsx
│       ├── CaseStudyCard.tsx
│       ├── CTA.tsx
│       └── ContactForm.tsx
├── site.config.yaml               # pages, nav, SEO metadata
├── next.config.mjs
├── package.json
└── tsconfig.json
```

### Design System

- Custom Tailwind color scale: `bayesiq-{50..900}` + `accent`
- Clean, minimal — Stripe/Linear/Vercel aesthetic
- Mobile-first responsive
- No stock photos
