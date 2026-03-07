# BayesIQ Website — Development Roadmap

Last Updated: 2026-03-07 (Phases 1–4 complete, Phase 5 next)

---

# Guiding Principle

**BayesIQ Website is the product surface for the BayesIQ ecosystem.** It serves two roles: lead-conversion for consulting engagements, and self-serve product experience for the Data Audit Kit.

```
MVP Launch → Content → Interactivity → Product Landing → Audit Kit Integration (5A: pipeline, 5B: packaging) → Conversational Product
```

### Cross-Repo Alignment

This website intersects three repos. Each phase below maps to where the audit kit (`bayesiq-data-audit-kit`) and platform (`bayesiq`) are in their own roadmaps:

| Website Phase | Audit Kit Phase | Platform Phase | Integration Point |
|---------------|-----------------|----------------|-------------------|
| Phase 4 (done) | 3.7 (done) | — | Client-side CSV profiler mirrors audit kit's schema_profiler |
| Phase 5A (next) | 3.8 (next) | — | Server-side audit pipeline, findings + score on website |
| Phase 5B | 3.8 | — | Artifact downloads, rate limiting, free/paid entitlements |
| Phase 6 | 4 (extract) | Active | Chat UI powered by platform orchestration layer |
| Phase 7 | 5 (hosted) | Active | Hosted dashboards, multi-tenant, self-service |

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

# Phase 4 — Product Landing & Playground ✅

Goal: reposition site as a product landing page for both BayesIQ products, with self-serve playground.

Key outcomes:

- **CSV Playground** (`/playground`) — drag-and-drop CSV, client-side profiling, downloadable Streamlit app
- **Product-first homepage** — two product cards (Audit Kit + Platform), engagement tiers, pipeline flow
- **Products page** (`/services`) — full feature grids for both products
- **Updated approach page** — automated pipeline architecture, engagement tiers, differentiators
- **Updated sample report** — shows actual Audit Kit artifacts, scoring rubric, severity definitions
- **Updated industry pages** — healthcare and fintech reframed around Audit Kit capabilities
- **Updated product docs** — company_overview, services, problems, engagement_model, tagline all rewritten
- **Updated nav** — Products, Approach, Playground, Live Demo, Blog

### Completed Work

| # | Title | Status |
|---|-------|--------|
| — | CSV Playground (`/playground`) with client-side profiling + Streamlit generation | ✅ done |
| — | Homepage rewrite (product-first positioning) | ✅ done |
| — | Products page rewrite (Audit Kit + Platform features) | ✅ done |
| — | Approach page rewrite (pipeline architecture + engagement tiers) | ✅ done |
| — | Sample report rewrite (Audit Kit artifacts + scoring rubric) | ✅ done |
| — | Healthcare landing page rewrite | ✅ done |
| — | Fintech landing page rewrite | ✅ done |
| — | Header/Footer/nav updates | ✅ done |
| — | Product docs (source of truth) rewrite | ✅ done |

---

# Phase 5A — Server-Side Audit Pipeline (Next)

Goal: run the real audit kit pipeline on the website. Users drop a CSV and get a scored report with real quality checks — without installing anything.

**Depends on:** Audit Kit Phase 3.8 (module interface manifests, return envelope standardization).

This is a product launch, not a backend task. The first server-side audit experience is the real product moment.

### Key Outcomes

- **API route** (`/api/audit`) — accepts CSV upload (≤5MB), runs audit pipeline server-side, returns JSON
- **Full playground upgrade** — replace client-side profiler with real audit kit output:
  - 12+ quality checks (not just column profiling)
  - Scored report (0-100 rubric)
  - Severity-ranked findings with root causes and fix recommendations
  - Canonicalization mapping
  - Ambiguous column detection
- **Results page** — interactive display of findings, score gauge, severity breakdown (rendered in Next.js, not just Streamlit)

### Technical Approach

Option A: **Python serverless function on Vercel** — install audit kit as dependency, run pipeline in API route. Fast to ship but limited by Vercel function timeout (60s on Pro).

Option B: **Separate Python API** — Flask/FastAPI service deployed alongside. Upload CSV → queue audit → poll for results. More robust, supports larger files.

Option C: **WASM/Pyodide** — run audit kit in browser via Pyodide. No server needed. Limited by browser memory but eliminates hosting costs.

Recommendation: Start with Option A (Vercel serverless) for files under 5MB. Fall back to "download and run locally" for larger files. Migrate to Option B when usage justifies it.

### PR Queue

| # | Title | Dependencies | Status |
|---|-------|-------------|--------|
| — | Install audit kit as Python dependency (or git submodule) | Audit Kit 3.8 manifests | Planned |
| — | `/api/audit` serverless route (upload CSV → run pipeline → return JSON) | Above | Planned |
| — | Playground: replace client profiler with server audit results | Above | Planned |
| — | Findings display component (severity cards, score gauge, evidence) | Above | Planned |

### Exit Criteria

- User can drop a CSV on the website and see a scored audit report (0-100) with findings
- Quality checks match what `run_audit.py` produces locally
- Response time < 30s for files under 5MB

---

# Phase 5B — Downloads, Limits, and Polish

Goal: complete the server-side audit experience with downloadable artifact bundles, rate limiting, and packaging.

**Depends on:** Phase 5A complete.

### Key Outcomes

- **Artifact download** — single installer script now includes `audit_report.md`, `dbt_project/`, `dashboard/`, `ASSUMPTIONS.md`, `METRICS.md`
- **Rate limiting** — free tier: 1 audit/day, 5MB max. Engagement clients: unlimited via API key.
- **Error handling** — clear messaging for timeouts, oversized files, malformed CSVs
- **Free vs paid entitlements** — free gets findings + score; paid gets full artifact bundle
- **Blog post:** "Audit any CSV in 30 seconds — no install required"

### PR Queue

| # | Title | Dependencies | Status |
|---|-------|-------------|--------|
| — | Enhanced installer: embed full audit artifacts in `.sh` download | Phase 5A | Planned |
| — | Rate limiting + file size enforcement | Phase 5A | Planned |
| — | Error states and timeout handling | Phase 5A | Planned |
| — | Free vs paid entitlement gating | Above | Planned |
| — | Blog post: "Audit any CSV in 30 seconds — no install required" | Above | Planned |

### Exit Criteria

- Download includes dbt project and Streamlit dashboard
- Rate limiting prevents abuse
- Clear error messaging for edge cases
- Free/paid boundary is explicit and tested

---

# Phase 6 — Conversational Audit (Future)

Goal: add chat-based interaction to the audit experience. Users ask questions about their data, approve column interpretations, refine metric definitions, and get recommendations — all in a conversational interface.

**Depends on:** Phase 5 (server-side pipeline), Audit Kit Phase 4 (platform extraction), Platform orchestration layer.

### Key Outcomes

- **Chat interface** on `/playground` — `st.chat_input` / `st.chat_message` style UX, but in Next.js
- **Context-aware conversations** — LLM has full audit profile, findings, and column metadata as context
- **Column role approval** — "I see `pack_size` has values like '5 Pack', '12 Pack'. Should I treat this as a filter, an ordinal axis, or extract the number as a multiplier?" User approves/overrides in chat.
- **Metric intent capture** — "What metrics matter most to you?" → pipeline re-prioritizes findings and dashboard layout
- **Finding drill-down** — "Tell me more about the duplicate rows" → shows evidence, explains root cause, suggests fix
- **Assumption sign-off** — present data assumptions one at a time, user approves/modifies in conversation
- **Session persistence** — conversation state saved, user can return later
- **Streaming responses** — LLM reasoning displayed in real-time

### Technical Approach

- Chat UI component in Next.js (not Streamlit — keeps everything on the website)
- API route proxies to Claude with audit context as system prompt
- Audit kit's `llm_advisor.py` patterns reused for column interpretation
- Interactive mode signoff gates (from `run_audit.py --interactive`) become chat-based approval steps
- Session stored in Vercel KV or similar

### Integration with Audit Kit

The audit kit's interactive mode (Phase 3.7) proved the interaction patterns in CLI:

| CLI Pattern | Website Equivalent |
|-------------|-------------------|
| `--interactive` approval gates | Chat-based "approve this assumption?" |
| `--metrics "revenue,churn"` | "What metrics matter most to you?" in chat |
| Ambiguous column wizard (Streamlit) | "How should I interpret this column?" in chat |
| `column_roles_resolved.json` | Persisted user decisions in session |
| `llm_advisor.py` Claude calls | Same Claude calls, streamed to chat UI |

### PR Queue

| # | Title | Dependencies | Status |
|---|-------|-------------|--------|
| — | Chat UI component (message list, input, streaming) | Phase 5 complete | Planned |
| — | `/api/chat` route (Claude proxy with audit context) | Above | Planned |
| — | Column role approval flow in chat | Above + llm_advisor patterns | Planned |
| — | Metric intent capture in chat | Above | Planned |
| — | Finding drill-down in chat | Above | Planned |
| — | Assumption sign-off flow in chat | Above | Planned |
| — | Session persistence (Vercel KV) | Above | Planned |

### Exit Criteria

- User can have a multi-turn conversation about their data after uploading a CSV
- Column role decisions made in chat are reflected in the generated dashboard
- Metric intent expressed in chat changes dashboard layout and finding priority
- Session persists across page reloads

---

# Phase 7 — Hosted Dashboards & Self-Service (Horizon)

Goal: users get a hosted, shareable dashboard URL — not just a downloadable script. Full self-service product experience.

**Depends on:** Phase 6 (conversational audit), Audit Kit Phase 5 (hosted infrastructure), Platform multi-tenant support.

### Key Outcomes

- **Hosted Streamlit dashboards** — after audit, deploy dashboard to a shareable URL (e.g., `dashboards.bayesiq.com/<id>`)
- **User accounts** — sign up, manage audits, view history
- **Subscription tiers** — free (1 audit, 7-day dashboard), pro ($X/month, unlimited audits, persistent dashboards)
- **Team sharing** — share dashboards with teammates, comment on findings
- **Continuous monitoring** — re-run audit on schedule, alert on drift (connects to the $2-5K/month monitoring offering)
- **Warehouse connections** — connect Snowflake/BigQuery directly from the website, not just CSV upload

### Exit Criteria

- User can sign up, upload a CSV, and share a dashboard URL with a teammate
- Dashboards persist beyond session
- At least one paying subscriber on self-service tier

---

# Architecture Snapshot

```
biq_website/
├── config/
│   └── project.yaml              # pipeline kernel
├── docs/
│   ├── product/                   # source of truth (human-owned)
│   │   ├── company_overview.md   # two-product positioning
│   │   ├── company_tagline.md
│   │   ├── brand.md
│   │   ├── services.md           # Audit Kit + Platform features
│   │   ├── problems.md           # problems mapped to product solutions
│   │   └── engagement_model.md   # tiered engagement model
│   └── ai/                        # pipeline docs
│       ├── ROADMAP.md             # this file
│       ├── ARCH_STATE.md
│       └── pr_markdown_plans/
├── src/
│   ├── app/                       # Next.js routes
│   │   ├── layout.tsx
│   │   ├── page.tsx               # homepage (product-first)
│   │   ├── services/page.tsx      # Products page
│   │   ├── approach/page.tsx      # pipeline + engagement tiers
│   │   ├── case-studies/page.tsx   # live demo embed
│   │   ├── playground/page.tsx    # CSV drop + profiler
│   │   ├── sample-report/page.tsx # Audit Kit artifacts
│   │   ├── healthcare/page.tsx    # industry landing
│   │   ├── fintech/page.tsx       # industry landing
│   │   └── contact/page.tsx
│   └── components/                # shared UI
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── ServiceCard.tsx
│       ├── CTA.tsx
│       ├── ContactForm.tsx
│       └── playground/
│           └── CsvPlayground.tsx  # CSV profiler + Streamlit generator
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
