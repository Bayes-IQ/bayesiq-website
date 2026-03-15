# BayesIQ Website — Development Roadmap

Last Updated: 2026-03-15 (Website Revamp complete, Golden Flows active)

---

# Guiding Principle

**BayesIQ Website exists to generate qualified client demand for BayesIQ consulting and BayesIQ Data Audit Kit engagements.** The site should establish trust, demonstrate capability, and convert technical buyers into booked conversations.

The Audit Kit is not a separate competing identity — it is the most concrete, demonstrable expression of BayesIQ. The site sells services first, demonstrates the Audit Kit second, and only later evolves into deeper self-serve software.

```
Positioning → Trust → Proof → Conversion → Audit Preview → Client Qualification
```

### Positioning Model

| Brand | Role on Site | What It Communicates |
|-------|-------------|---------------------|
| **BayesIQ** | Service/engagement brand | Governed data delivery, audit/remediation engagements, telemetry advisory, custom implementation |
| **BayesIQ Data Audit Kit** | Flagship proof asset | Upload a CSV → see what BayesIQ finds → understand what an engagement delivers → proof that methods are real |

The homepage hierarchy should answer, fast: (1) What do you do? (2) Who is it for? (3) Why should I trust you? (4) What do I get? (5) What is the next step?

### Cross-Repo Alignment

This website intersects three repos. Each phase below maps to where the audit kit (`bayesiq-data-audit-kit`) and platform (`bayesiq`) are in their own roadmaps:

| Website Phase | Audit Kit Phase | Platform Phase | Integration Point |
|---------------|-----------------|----------------|-------------------|
| Phase 4 (done) | 3.7 (done) | — | Client-side CSV profiler mirrors audit kit's schema_profiler |
| Phase 5A (deferred) | 3.8 (done) | — | Server-side audit pipeline, findings + score on website |
| Phase 5B (deferred) | 3.8 (done) | — | Artifact downloads, rate limiting, free/paid entitlements |
| Phase 6 (deferred) | 4 (next) | Active | Chat UI powered by platform orchestration layer |
| Phase 7 (deferred) | 5 (hosted) | Active | Hosted dashboards, multi-tenant, self-service |

Phases 5–7 are deferred until the site has proven client acquisition value. They remain in the roadmap as future direction but are not near-term priorities.

### Content Derivation

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
- **Testing:** Playwright (E2E smoke tests, link integrity, JSON-LD validation) — PR#23

---

# Quality Gates

Every PR must pass before merge:

- `npm run build` succeeds (no build errors)
- `npm run lint` passes
- `npm test` passes (Playwright smoke tests + link integrity — PR#23)
- Lighthouse scores: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90
- No broken internal links (enforced by automated test suite)
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

# Phase 4 — Audit Preview & Playground ✅

Goal: expand the site with buyer evidence — playground, engagement tiers, and Audit Kit positioning.

Key outcomes:

- **CSV Playground** (`/playground`) — drag-and-drop CSV, client-side profiling, downloadable Streamlit app
- **Homepage rewrite** — BayesIQ + Audit Kit positioning, engagement tiers, pipeline flow
- **Services page** (`/services`) — BayesIQ service capabilities and Audit Kit bridge
- **Updated approach page** — automated pipeline architecture, engagement tiers, differentiators
- **Updated sample report** — shows actual Audit Kit artifacts, scoring rubric, severity definitions
- **Updated industry pages** — healthcare and fintech reframed around Audit Kit capabilities
- **Updated product docs** — company_overview, services, problems, engagement_model, tagline all rewritten
- **Updated nav** — Platform, Audit Kit, Approach, Case Studies, Blog

### Completed Work

| # | Title | Status |
|---|-------|--------|
| — | CSV Playground (`/playground`) with client-side profiling + Streamlit generation | ✅ done |
| — | Homepage rewrite (BayesIQ + Audit Kit positioning) | ✅ done |
| — | Services page rewrite (BayesIQ capabilities + Audit Kit bridge) | ✅ done |
| — | Approach page rewrite (pipeline architecture + engagement tiers) | ✅ done |
| — | Sample report rewrite (Audit Kit artifacts + scoring rubric) | ✅ done |
| — | Healthcare landing page rewrite | ✅ done |
| — | Fintech landing page rewrite | ✅ done |
| — | Header/Footer/nav updates | ✅ done |
| — | Product docs (source of truth) rewrite | ✅ done |

---

# Website Revamp — Client Acquisition Repositioning ✅

Goal: reposition the site to **generate qualified client demand**. Every page change should make the site better at answering: What do you do? Who is it for? Why trust you? What do I get? What's the next step?

### Priority Tiers (per roadmap feedback)

**Tier 1 — Must-have for client acquisition:** ✅ Complete
- Homepage positioning (PR#19 ✅)
- Dedicated Audit Kit page (PR#22 ✅)
- E2E smoke tests (PR#23 ✅)
- Case studies revamp (PR#24 ✅)
- Contact/booking flow (already functional)
- Sample deliverable page (already exists)

**Tier 2 — Strong leverage:** ✅ Complete
- Industry landing pages for likely buyers (PR#26 ✅)
- Metadata/SEO for core pages (PR#25 ✅)
- Targeted blog posts tied to buyer search intent (existing blog)
- Lightweight playground connected to lead capture (existing playground)

**Tier 3 — Defer until client acquisition is proven:**
- Server-side audit pipeline (Phase 5A)
- Entitlement packaging (Phase 5B)
- Conversational UX (Phase 6)
- Hosted dashboards/accounts/subscriptions (Phase 7)
- Newsletter expansion (unless traffic justifies it)

> **Interpretation note:** Phases 1–4 below reflect how the site evolved historically. The active roadmap from this point forward is governed by the client-acquisition objective above. Where older phase language conflicts in emphasis, the client-acquisition positioning is the source of truth.

### Success Metrics

**Primary conversion metrics:**
- Contact form submit rate
- Calendly booking rate
- Qualified lead rate — a lead counts as qualified when: (1) real company with a data quality, telemetry, or analytics problem, (2) relevant use case for BayesIQ or the Audit Kit, (3) has budget authority or decision-making influence, (4) wants a conversation within 30 days

**Proof engagement metrics:**
- Sample report page views
- Audit Kit page CTA click-through
- Case study expansion / dwell time

**Channel metrics:**
- Organic search impressions to core service pages
- Blog-to-contact conversion rate
- Industry page conversion rate

### Page Hierarchy

**Core conversion pages** (highest priority for quality, speed, and CTA clarity):
- `/` — homepage
- `/audit-kit` — flagship proof asset
- `/sample-report` — deliverable preview
- `/case-studies` — trust/evidence
- `/contact` — conversion endpoint

**Support pages** (important but secondary):
- `/services` — BayesIQ engagement capabilities (what we do, how we deliver, governance depth)
- `/approach` — process credibility
- `/healthcare`, `/fintech` — industry targeting
- `/blog/*` — SEO / buyer intent content

### PR Queue

| # | Title | Dependencies | Status |
|---|-------|-------------|--------|
| #19 | Homepage reframe (governance-first positioning) | — | ✅ done |
| #20 | Navigation update (Header + Footer) with Audit Kit primary link | #19 | ✅ done |
| #21 | Services page rewrite (/services) | #20 | ✅ done |
| #22 | Add dedicated Audit Kit page (/audit-kit) | #20, #21 | ✅ done |
| #23 | E2E smoke tests + link integrity (Playwright) | #22 | ✅ done |
| #24 | Case studies revamp | #20 | ✅ done |
| #25 | Supporting metadata + approach page alignment | #19, #21, #22, #24 | ✅ done |
| #26 | Industry pages update (Fintech + Healthcare) | #24, #25 | ✅ done |

### PR#23 — E2E Smoke Tests + Link Integrity

**Why now:** Every PR in the revamp adds or rewires pages and links. Manual verification doesn't scale and has already produced test plans full of checkbox items that nobody runs. Automated tests catch broken routes, dead links, and invalid JSON-LD before merge — not after.

**Scope:**
- Install Playwright as dev dependency
- Smoke test every route (15 static + blog dynamic): assert 200 status, page title, no console errors
- Link integrity: crawl all internal `<a>`/`<Link>` hrefs, assert each resolves to a real route
- JSON-LD validation: every page with `application/ld+json` has valid JSON with `@context` and `@type`
- `npm test` script wired to Playwright
- No new production code, no changes to pages

**Exit criteria:**
- `npm test` passes locally and catches a deliberately broken link
- Every existing route is covered by a smoke test
- JSON-LD validation runs on pages that have structured data
- Test suite runs in < 30 seconds

### PR#24 — Case Studies Quality Bar

Case studies are one of the most commercially important pages. Each case study must include:

- **Client type / context** — industry, team size, data maturity level
- **Broken state** — what was wrong before BayesIQ (specific, not generic)
- **What BayesIQ found** — concrete findings with numbers (e.g., "7 broken metrics, 3 schema drift violations")
- **Business risk / impact** — what the broken state was costing or risking
- **Remediation path** — what was fixed and how
- **Deliverables produced** — scored report, dbt project, dashboard, etc.
- **CTA** — "What would your audit find?"

Generic "illustrative case studies" help a little. Concrete, credible ones become major conversion assets.

---

# Phase 5A — Server-Side Audit Pipeline (Deferred)

> **De-prioritized per roadmap feedback.** This is valuable but not the fastest path to signed work. Focus on client acquisition pages first. Revisit when the revamp is complete and the site is generating qualified leads.

Goal: run the real audit kit pipeline on the website. Users drop a CSV and get a scored report with real quality checks — without installing anything.

**Depends on:** Audit Kit Phase 3.8 (module interface manifests, return envelope standardization) — **dependency satisfied** (Phase 3.8 complete: 29 PRs merged, 238 tests, 14 modules, standard return envelope, module manifests, vertical config packs all shipped).

### Key Outcomes

- **API route** (`/api/audit`) — accepts CSV upload (≤5MB), runs audit pipeline server-side, returns JSON
- **Full playground upgrade** — replace client-side profiler with real audit kit output:
  - 12+ quality checks (not just column profiling)
  - Scored report (0-100 rubric)
  - Severity-ranked findings with root causes and fix recommendations
  - Canonicalization mapping
  - Ambiguous column detection
  - LLM-powered column interpretation (via `llm_advisor.py`)
  - Metric intent capture (via `--metrics` flag)
- **Results page** — interactive display of findings, score gauge, severity breakdown (rendered in Next.js, not just Streamlit)

### Technical Approach

Option A: **Python serverless function on Vercel** — install audit kit as dependency, run pipeline in API route. Fast to ship but limited by Vercel function timeout (60s on Pro).

Option B: **Separate Python API** — Flask/FastAPI service deployed alongside. Upload CSV → queue audit → poll for results. More robust, supports larger files.

Option C: **WASM/Pyodide** — run audit kit in browser via Pyodide. No server needed. Limited by browser memory but eliminates hosting costs.

Recommendation: Start with Option A (Vercel serverless) for files under 5MB. Fall back to "download and run locally" for larger files. Migrate to Option B when usage justifies it.

### PR Queue

| # | Title | Dependencies | Status |
|---|-------|-------------|--------|
| — | Install audit kit as Python dependency (or git submodule) | Audit Kit 3.8 manifests (done) | Planned |
| — | `/api/audit` serverless route (upload CSV → run pipeline → return JSON) | Above | Planned |
| — | Playground: replace client profiler with server audit results | Above | Planned |
| — | Findings display component (severity cards, score gauge, evidence) | Above | Planned |

### Exit Criteria

- User can drop a CSV on the website and see a scored audit report (0-100) with findings
- Quality checks match what `run_audit.py` produces locally
- Response time < 30s for files under 5MB

---

# Phase 5B — Downloads, Limits, and Polish (Deferred)

> **De-prioritized per roadmap feedback.** Depends on 5A and is not on the client acquisition critical path.

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

# Phase 6 — Conversational Audit (Deferred)

> **De-prioritized per roadmap feedback.** Conversational UX is not the fastest path to signed work. Revisit after client acquisition is proven.

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

# Phase 7 — Hosted Dashboards & Self-Service (Deferred)

> **De-prioritized per roadmap feedback.** Self-serve SaaS should not be a near-term website priority until services revenue justifies it.

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
│   │   ├── company_overview.md   # BayesIQ service brand + Audit Kit flagship capability
│   │   ├── company_tagline.md
│   │   ├── brand.md
│   │   ├── services.md           # BayesIQ engagements + Audit Kit delivery
│   │   ├── problems.md           # problems mapped to product solutions
│   │   └── engagement_model.md   # tiered engagement model
│   └── ai/                        # pipeline docs
│       ├── ROADMAP.md             # this file
│       ├── ARCH_STATE.md
│       └── pr_markdown_plans/
├── src/
│   ├── app/                       # Next.js routes
│   │   ├── layout.tsx
│   │   ├── page.tsx               # homepage (client acquisition)
│   │   ├── audit-kit/page.tsx     # flagship proof asset (PR#22)
│   │   ├── services/page.tsx      # BayesIQ engagement capabilities
│   │   ├── approach/page.tsx      # pipeline + engagement tiers
│   │   ├── case-studies/page.tsx   # trust / evidence narratives
│   │   ├── playground/page.tsx    # CSV drop + profiler
│   │   ├── sample-report/page.tsx # Audit Kit deliverable preview
│   │   ├── healthcare/page.tsx    # industry landing
│   │   ├── fintech/page.tsx       # industry landing
│   │   └── contact/page.tsx       # conversion endpoint
│   └── components/                # shared UI
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── ServiceCard.tsx
│       ├── CTA.tsx
│       ├── ContactForm.tsx
│       └── playground/
│           └── CsvPlayground.tsx  # CSV profiler + Streamlit generator
├── e2e/                            # Playwright tests (PR#23)
│   ├── smoke.spec.ts              # route smoke tests
│   ├── links.spec.ts             # internal link integrity
│   └── json-ld.spec.ts           # structured data validation
├── playwright.config.ts           # Playwright configuration
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

---

# Phase 5 — Golden Flows Commercial Surface (Active)

**Cross-repo ref prefix:** `WEB-GF-5.x`
**Master initiative:** `bayesiq/docs/ai/pr_markdown_plans/standing_up_demos.md`
**Decomposition doc:** `bayesiq/docs/ai/pr_markdown_plans/decomposing_demos.md`

Build the executive-facing `/golden-flows` page — the commercial demo shell for the five-vertical golden flows initiative. Consumes build-time static JSON from `bayesiq-data-audit-kit` (Contract B) and `bayesiq` platform (Contract C). **No runtime dependencies** on audit-kit execution or platform APIs.

## Premise

Golden Flows is the real purpose of the website. The current roadmap sequences it last — blocked on upstream repos that haven't started their golden flows work. This reordering:

1. Website **proposes** consumer-facing JSON schemas; upstream co-ratifies before freeze
2. Builds all UI against fixture data now, swaps in real data later
3. Defers brochure polish (case studies, metadata, industry pages) until Golden Flows ships
4. Makes the website **ready to light up** the moment upstream delivers, instead of starting a 10–12 week build at that point

---

## Decisions (Resolved)

### Routing: `/golden-flows/[vertical]` (hybrid per-vertical routes)

Each vertical gets its own URL: `/golden-flows/hospital`, `/golden-flows/real-estate`, etc.

`/golden-flows` is a **lightweight hub/index page** — it shows the vertical selector cards and links to each vertical. It does **not** auto-redirect.

**Why hub, not redirect:**
- Cleaner analytics — hub page views are distinct from vertical page views
- Easier manual QA — you can verify the selector without being bounced
- More obvious hub behavior — users see all verticals at a glance
- No ambiguous page ownership — the hub is the hub, verticals are verticals

**Why per-vertical routes:**
- Better sharing — "forward this to Head of Data" lands on a distinct vertical page
- Better OG previews — per-vertical title, description, image
- Better instrumentation — page-level analytics without query-param parsing
- Better direct sales usage — hand someone a URL, not a URL + instructions
- Future SEO flexibility — each vertical can rank independently

**Implications:**
- Fixture data organized per vertical directory
- OG image generation is per-vertical
- Analytics events include vertical from the route, not from client state
- Canonical URLs set per vertical page once live
- Golden-flows config is one section in `site.config.yaml` with verticals derived from a route map or local metadata file — not one manually maintained config entry per vertical (avoids duplicated bookkeeping as verticals are added/removed)

### Rollout States

Three distinct states, each with clear boundaries:

| State | Route exists | In nav | Shareable | Use case |
|-------|-------------|--------|-----------|----------|
| **Local only** | Dev server only | No | No | Building, iterating |
| **Production hidden** | Deployed on Vercel | No | Yes, by direct URL | Stakeholder review, prospect previews, QA on real infra |
| **Production linked** | Deployed | Yes | Yes | Public launch |

Controlled by `NEXT_PUBLIC_GOLDEN_FLOWS_STATE`: `"off"` | `"hidden"` | `"live"`.

- `off`: route returns **404** (not redirect — unambiguous, clean for QA, no accidental homepage traffic attribution)
- `hidden`: route renders, nav does not link to it, `noindex` meta tag
- `live`: route renders, nav links to it, indexed

**Vertical availability:** Which verticals appear on the hub and are routable is controlled by a **data-driven allowlist** — a `verticals.json` manifest in `fixtures/golden-flows/` (dev) or `public/golden-flows/` (prod). The manifest lists each vertical's ID, display name, and readiness status (`ready` | `stub`).

The rollout state env var controls route/nav/indexing behavior. The manifest controls which verticals are visible. This separation avoids overloading one env var with too many concerns and makes vertical availability a data change, not a code change.

| Context | Vertical visibility | Source |
|---------|-------------------|--------|
| Local/dev | All 5 visible, stubs allowed | Manifest shows all |
| Hidden (prospect preview) | Only `ready` verticals visible on hub | Manifest filtered by status |
| Live (public) | All 5 visible, only when all 5 are `ready` | Manifest shows all as `ready` |

**Hidden-mode prospect-sharing policy:** In hidden mode, the hub page only shows verticals marked `ready` in the manifest (Hospital and Real Estate initially). Unfinished verticals are not rendered on the hub — not "Coming soon," not minimal stubs, just absent. This is an execution rule, not a suggestion.

### Chart Library

Decide during GF-5 implementation. Candidates: lightweight SVG (preferred if feasible), Recharts (if interactivity needed). No D3 — too heavy for this design system.

---

## Sequencing Overview

```
Tier 0  Merge #22 + ship #23 (tests)                  ← done
Tier 1  Schema proposal → contract freeze artifact →   ← start immediately
        route + core UI + status-quo comparison
        (fixture-backed)
Tier 2  Interactive UI (cascade, discover) +            ← parallel with upstream
        hierarchy lock + instrumentation
Tier 3  Real data integration + semantic validation +   ← when upstream delivers
        drift reconciliation + governance UI
Tier 4  Brochure polish (case studies, etc.)            ← backlog
```

---

## Tier 0 — Close Out Revamp Blockers ✅

All shipped. Tests pass (35 Playwright tests, < 17s).

| Roadmap PR | Title | GitHub PR | Status |
|-----------|-------|----------|--------|
| #22 | Dedicated Audit Kit page (`/audit-kit`) | #7 | ✅ merged |
| #23 | E2E smoke tests + link integrity (Playwright) | #3, #6, #8 | ✅ merged |

**Exit criteria met:** `npm test` passes, every route covered, JSON-LD validated.

---

## Tier 1 — Golden Flows Foundation (Unblocked)

No upstream data-delivery dependency after schema freeze. Start immediately.

### PR#GF-1: Contract B + C Schema Proposal

**Why this is first:** The website is the experience-defining consumer. It should propose the shapes it needs — the rendering constraints, required fields, and information hierarchy that make executive scan mode work. Upstream then reviews for production-fit before schemas freeze.

**Scope:**
- Author JSON schema proposals for all Contract B payloads:
  - `executive_questions.schema.json` — per vertical, keyed by `question_id`
  - `discover_insights.schema.json` — per vertical
  - `cascade_data.schema.json` — per vertical, keyed by `question_id`
  - `trajectory.schema.json` — per vertical, monthly score + finding counts
  - `screenshot_manifest.schema.json` — per vertical per month
  - `artifact_links.schema.json` — per vertical per month
  - `hook_metrics.schema.json` — per vertical (selector card content)
  - `vertical_narrative.schema.json` — per vertical
- Author JSON schema proposals for all Contract C payloads:
  - `approval_status.schema.json` — per finding (aligned with platform PR #316)
  - `feedback_threads.schema.json` — feedback items + linked approvals (aligned with platform PR #317)
  - `business_events.schema.json` — governance state (aligned with platform PR #318)
  - `trust_badges.schema.json` — pre-compiled badge data + summary (aligned with platform PR #323)
  - `review_context.schema.json` — typed review context blocks (aligned with platform PR #325)
  - `cascade_governance.schema.json` — per-question governance overlay (aligned with platform PR #329)
  - `published_docs.schema.json` — GDoc/GDrive URLs (website-proposed)
- All schemas include `schema_version` and `payload_type` in root
- All IDs follow the stable identity model: include vertical + snapshot context (e.g., `hospital_month_1_QC_017`)
- Generate TypeScript types from schemas (e.g., `json-schema-to-typescript`)
- Place schemas in `schemas/golden-flows/` and types in `src/types/golden-flows/`

**Exit criteria:**
- Every Contract B and C payload has a versioned JSON schema proposal
- TypeScript types generate cleanly from schemas
- Schema proposals shared with DAK and platform repos for review

**Deliverable to upstream repos:** schema files + a one-page contract summary for each repo.

**What this PR does NOT do:** freeze the schemas. That happens after upstream review (see GF-1.5).

---

### GF-1.5: Contract Freeze Gate — COMPLETE (frozen 2026-03-15)

**A coordination checkpoint that produces a durable artifact.**

After GF-1 delivers schema proposals:

1. DAK reviews Contract B schemas for production-fit (normalization boundaries, field naming, export feasibility)
2. Platform reviews Contract C schemas for governance-payload semantics (approval meaning, record structure, ID coherence)
3. Disagreements resolved per these escalation heuristics (in priority order):
   - Prefer derived fields over reshaping canonical exports
   - Prefer stable IDs over nested convenience structures
   - Prefer export simplicity unless it materially harms executive scan mode
   - Website adjusts schemas where upstream has legitimate structural constraints; upstream adjusts exports where website has legitimate rendering requirements
4. **Schemas freeze as v1** — committed in all three repos

**Freeze artifact:** `schemas/golden-flows/CONTRACT_FREEZE_v1.md`, committed in this repo. Records:

- Which schemas were frozen (with SHA or version tag)
- Effective date
- Unresolved compromises and why they were accepted
- Per-field ownership: which fields are consumer-required (website owns shape) vs. upstream-owned (upstream owns naming/semantics)
- Process for v2: any schema change after freeze requires version bump + cross-repo review

This artifact is the source of truth for "what did we agree to." Without it, the freeze is too informal and people will later argue about what exactly was ratified.

**Timebox:** 1 week from schema delivery to freeze. If disagreements aren't resolved in a week, escalate — don't let this become an indefinite block.

**Gate rule:** Schema-consuming component work (anything that reads Contract B/C fields and renders them) begins only after the freeze artifact is committed. Route shell, hub page structure, rollout state logic, selector card scaffolding, and fixture builder plumbing may proceed in parallel with the freeze review — they do not depend on final field shapes.

---

### PR#GF-2: Fixture Data (Schema-Valid, Factory-Built)

**Scope:**
- Create fixture JSON for Hospital vertical (priority #1) across 3 months
- Create fixture JSON for Real Estate vertical (priority #2) across 3 months
- Remaining 3 verticals (SaaS, Retail, Fintech) get minimal stubs
- Fixtures must validate against frozen v1 schemas from GF-1.5
- Place in `fixtures/golden-flows/` (git-tracked, not in `public/`)
- Build-time loader reads from fixtures in dev, from `public/golden-flows/` in prod
- Organized per vertical directory to match the `/golden-flows/[vertical]` routing decision

**Fixture discipline:**
- All fixtures generated through **typed builder functions or schema-aware factories** — not hand-assembled ad hoc JSON blobs
- One canonical fixture source per vertical that derives all payload views
- No component-specific fixture fragments outside the canonical fixture set
- Fixture builders live in `fixtures/golden-flows/builders/` and are themselves tested (builder output validates against schema)
- Builders are the **only** way to create fixture data — if a component test needs specific data, it calls the builder with overrides, not a separate JSON file

**Fixture fidelity:** Derive Hospital fixtures from actual audit kit output if possible (run audit kit on a representative hospital dataset, shape the output into the contract format). If not possible, hand-author realistic seed data but still run it through the typed builders.

**Exit criteria:**
- Hospital and Real Estate have complete fixture data for all Contract B payloads
- Contract C fixtures exist (approval states, feedback threads, trust badges)
- All fixtures pass schema validation
- Fixtures generated via builders, not hand-assembled
- Data loader can serve fixtures in development mode

---

### PR#GF-3: `/golden-flows/[vertical]` Route + Layout Shell

**Ownership boundary with GF-4:** GF-3 owns the selector **container and placement** (where it appears, how it persists across routes). GF-4 owns the selector **card rendering and interaction** (what each card displays, selection behavior, navigation).

**Scope:**
- Create `/golden-flows/[vertical]/page.tsx` dynamic route
- Create `/golden-flows/page.tsx` as hub/index page (selector container, links to each vertical — no redirect)
- Static data loader that reads fixture JSON (dev) or real JSON (prod) per vertical
- Page layout: selector container (persistent on vertical pages) → selected vertical content area
- Mobile-first responsive shell
- Golden-flows section in `site.config.yaml`; verticals derived from route map
- Per-vertical OG metadata + JSON-LD; canonical URL per vertical page
- Rollout state: `NEXT_PUBLIC_GOLDEN_FLOWS_STATE` controls visibility
- When `off`: route returns 404
- When `hidden`: route renders, `noindex` meta tag, not in nav; hub shows only production-ready verticals
- When `live`: route renders, nav links to it, indexed

**Exit criteria:**
- Hub page exists and links to each vertical
- Route exists for each vertical, loads fixture data, renders a skeleton
- Per-vertical OG tags render for Slack/email sharing
- Rollout state controls work correctly in all three modes (404 / hidden / live)
- Hidden mode hub only shows production-ready verticals
- Navigation conditionally includes golden-flows link based on rollout state

---

### PR#GF-4: Vertical Selector Cards

**Scope:**
- 5 cards rendered from `hook_metrics` fixture data
- Each card: hook metric (discrepancy) + consequence + trust cue
- Selected state highlights card; card links to `/golden-flows/[vertical]`
- Hospital and Real Estate fully styled; others styled but only visible per rollout-state visibility rules
- Cards render on both hub page and as persistent nav on vertical pages

**Design constraint:** Cards must communicate the vertical's core problem in under 5 seconds of reading. One number, one consequence, one trust signal.

**Exit criteria:**
- 5 cards render from fixture data in local/dev mode
- Hub respects rollout-state visibility rules (hidden mode hides unfinished verticals)
- Card selection navigates to the vertical route
- Mobile: cards stack vertically, tap to navigate
- Desktop: horizontal row, click to navigate

---

### PR#GF-5: Default Vertical Landing State + Inline Trajectory

**Scope:**
- Selected vertical shows above the fold:
  - Current score (0–100 gauge)
  - Score trajectory inline (Month 1 → Month 3)
  - Most devastating finding (one sentence + severity badge)
  - Business consequence (plain language, grounded in data)
  - Trust badge (reviewer name + approval status)
  - Artifact preview thumbnails (dashboard + report screenshots)
  - Primary CTA ("Book a diagnostic" / "See the full audit") — a minimal CTA must be present in this PR, not deferred to GF-7
- All data from fixtures

**CTA note:** GF-5 includes a basic, functional CTA. GF-7 later finalizes vertical-specific packaging, offer framing, and Calendly integration. The page must be conversion-ready from GF-5 onward, not only after GF-7.

**Why trajectory is inline here:** The score and trajectory are part of the same "above the fold proof" experience. A score without motion is a snapshot; with trajectory, it tells a story. They should ship together.

**Minimum viable trajectory (what GF-5 requires):**
- Static 3-point visual (Month 1, Month 2, Month 3 scores connected)
- No hover interactivity
- No animation
- No heavy chart library dependency — SVG or CSS is sufficient
- Score values and direction legible at a glance

Advanced trajectory polish (hover tooltips, animated transitions, finding-count annotations) is deferred to a follow-up PR if needed.

**Design constraint:** Executive converts on the scroll, not on exploration. Above-the-fold has one primary message, one proof point, one trust cue, one CTA. No multi-click dependency.

**Exit criteria:**
- Hospital and Real Estate render complete landing states with inline trajectory
- Page works at 375px width
- CTA is visible without scrolling on mobile
- Score gauge + trajectory readable together
- Trajectory is a static 3-point visual — no hover, no animation, no chart library

---

### PR#GF-6: Status Quo vs. BayesIQ Comparison (Fixture-Backed)

**Scope:**
- One compact comparison block per vertical: what happens without BayesIQ vs. with
- Initial content derived from `standing_up_demos.md` vertical narratives and fixture data
- Per-vertical content, not generic claims
- Positioned below the landing state, above CTAs — part of the scroll-to-convert flow
- Limit to one short, focused comparison section — this is not a sales-page content sprint

**Why pulled forward:** This is persuasion copy, not governance UI. It depends on vertical narratives (which exist in `standing_up_demos.md` already) not on real governance payloads. Ship a fixture-backed version now; refine with real narrative content from DAK-GF-5.3 later in Tier 3.

**Exit criteria:**
- Comparison renders for Hospital and Real Estate
- Content is specific, not boilerplate
- Grounded in fixture data where possible (e.g., "Month 1 score: 34 → Month 3 score: 91")
- Scoped to one comparison block per vertical — no deep copy exploration

---

### PR#GF-7: CTA Sections

**Scope:**
- Three CTA variants:
  1. Monthly metric reliability program (recurring engagement)
  2. Diagnostic entry point ($7.5K engagement)
  3. Book a session (Calendly)
- Vertical-specific CTA copy (from fixture narratives)
- Each vertical ends in a clear CTA mapped to a recurring offer
- Reuse existing `CTA.tsx` and `CalendlyEmbed.tsx` components

**Exit criteria:**
- CTAs render at bottom of each vertical's content
- Copy is vertical-specific, not generic
- Calendly integration works

---

## Tier 2 — Interactive UI (Parallel With Upstream)

Build these against fixture data. No upstream data-delivery dependency after schema freeze.

### Hierarchy Rule

The page must preserve the information hierarchy at all times:

```
default landing state > flagship question > collapsed cascade > discover > deep artifact inspection
```

No component built in Tier 2 may visually outweigh a component above it in this hierarchy. This is enforced at GF-12 with concrete review criteria (see below).

---

### PR#GF-8: Ask Buttons Component

**Scope:**
- 1 flagship + 4 secondary question buttons per vertical
- Rendered from `executive_questions` fixture data
- Flagship question is visually prominent
- Button click loads cascade viewer (PR#GF-9)

**Exit criteria:**
- 10 question buttons render (5 per priority vertical)
- Flagship question visually differentiated
- Click triggers cascade load

---

### PR#GF-9: Cascade Viewer — Collapsed Default

**Scope:**
- Answer-first collapsed view for each question
- Shows: reported value, audited value, delta, root cause, consequence, reviewer micro-badge
- Rendered from `cascade_data` fixture

**Exit criteria:**
- Collapsed cascade renders for all fixture questions
- Information hierarchy: answer first, detail on demand
- Reviewer badge visible in collapsed state

---

### PR#GF-10: Cascade Viewer — Expandable Timeline

**Scope:**
- Expand collapsed cascade to show full timeline:
  1. Finding (what was wrong)
  2. Correction (what changed)
  3. Dashboard (updated visualization)
  4. Report (updated report excerpt)
  5. Presentation artifact (if present — omit step when absent)
  6. Governance (approval status + reviewer)
- Each step links to artifact preview
- Accordion or vertical timeline on mobile

**Exit criteria:**
- Expanded view shows up to 6 steps
- Steps with missing artifacts gracefully omit
- Each step links to artifact preview (screenshot or placeholder)
- Mobile-friendly (accordion pattern)

---

### PR#GF-11: Artifact Diff Cards

**Scope:**
- Before/after comparison for affected surfaces (dashboard, report, metric)
- Side-by-side on desktop, stacked on mobile
- Uses screenshot manifest fixture data

**Exit criteria:**
- Before/after renders for at least 2 artifacts per vertical
- Visual diff is immediately legible

---

### PR#GF-12: Discover Panel + Hierarchy Lock

**Scope:**
- 3–5 insight cards per vertical from `discover_insights` fixture
- Question-framed insights (not statements)
- Each links to relevant dashboard view with context
- Visual weight lower than cascade — these are supplementary

**Hierarchy lock — concrete review criteria:**

At this point all Tier 2 components are built. Before merging GF-12, the reviewer must verify:

1. Discover cards do not appear above the first collapsed cascade in default render
2. Flagship question is visually dominant over secondary questions (larger text, more contrast, or more prominent placement)
3. Artifact diff cards do not render above the collapsed answer area
4. No Tier 2 component displaces the primary CTA below the second screen-height on mobile (375px viewport)
5. On default page load (no interactions), the visual weight sequence top-to-bottom is: landing state → questions → cascade area → discover → artifact detail

**Review artifact:** The PR must include one annotated screenshot for mobile (375px) and one for desktop showing the full page with hierarchy zones labeled. Reviewers sign off against these screenshots, not subjective impressions.

If any criteria fail, fix before merge.

**Exit criteria:**
- Insights render from fixture data
- Each links to a dashboard preview
- Visual hierarchy: cascade > discover
- **All 5 hierarchy lock criteria pass** on both mobile (375px) and desktop viewports
- Annotated screenshots included in PR for review sign-off

---

### PR#GF-13: Analytics Instrumentation

**Scope:**
- Track conversion signals:
  - `gf_vertical_click` — which vertical selected
  - `gf_question_click` — which executive question
  - `gf_cascade_expand` — how deep users go
  - `gf_artifact_click` — which artifacts viewed
  - `gf_discover_click` — which insights explored
  - `gf_share_link` — forward/share as primary conversion signal
  - `gf_cta_click` — which CTA, which vertical
  - `gf_return_visit` — repeat engagement
- Follow existing analytics event spec conventions (Vercel Analytics, snake_case)

**Exit criteria:**
- All golden-flows interactions tracked
- Events fire in development with fixture data
- Event spec updated in `docs/ops/analytics_events.md`

---

### PR#GF-14: Share/Forward Optimization

**Scope:**
- Per-vertical Open Graph tags (title, description, image) — leverages `/golden-flows/[vertical]` routing
- Preview image generation (OG image with vertical score + headline finding)
- Summary text optimized for Slack/email forwarding
- Copy-link button on page
- Canonical URLs set per vertical page

**Exit criteria:**
- Sharing `/golden-flows/hospital` to Slack shows Hospital-specific preview
- OG image includes score and headline finding
- Copy-link tracked as conversion signal

---

## Tier 3 — Real Data Integration + Governance UI

**Blocked on upstream.** These PRs swap fixtures for real data, validate semantic coherence, reconcile drift, and build governance-dependent components.

### Fixture/Schema Drift Policy

When real data arrives and mismatches fixture assumptions, follow these rules:

- **Schema mismatch** (real data doesn't validate against frozen v1 schema): requires a **contract version review** — update the freeze artifact to v2 with cross-repo sign-off. No silent schema mutation.
- **Semantic mismatch without schema break** (data validates but UI assumptions were wrong — e.g., fixture assumed 7 findings but real data has 4): requires **fixture correction** to match real data, and review of any UI copy or layout that depended on the old assumption.
- **No silent mutation of fixture shapes** once real integration begins. Every fixture change in Tier 3 must trace to either a contract version bump or a documented semantic correction.

This prevents Tier 3 from becoming a quiet renegotiation phase.

---

### Contract C Normalization

Contract C arrives as multiple governance payload files (approval status, reviewer attribution, feedback threads, published docs, trust badges, business events). The website **normalizes these into a single internal governance data layer** before components consume them.

**Why:** Too many separate governance files creates brittle per-component joining logic. A normalized layer means:
- Components import from one governance interface, not six
- Cross-payload coherence (finding IDs, reviewer attribution) is validated once at ingestion, not scattered across components
- Adding a new governance payload type doesn't require touching every component

**Implementation:** A `src/lib/governance.ts` module that ingests all Contract C payloads, validates cross-references, and exposes a unified typed API. Components never import raw governance JSON directly.

**Normalization boundary:** The governance module may reshape and join data for typed consumption. It may **not** introduce new governance semantics beyond what the contract explicitly defines. For example:
- Joining approval records with reviewer attribution into a single lookup by `finding_id` — allowed (reshaping)
- Converting an ambiguous approval status (e.g., `"reviewed"`) into a friendlier label (e.g., `"verified"`) — not allowed unless the mapping is explicitly defined in the contract freeze artifact
- Inferring approval state from the absence of a record — not allowed (e.g., "no approval record" does not mean "approved" or "pending")
- Deriving a trust badge from absence of approval data — not allowed

If a governance field's meaning is unclear, surface the ambiguity as a contract question (back to GF-1.5 process), don't resolve it silently in code.

---

### Governance Component Prototyping

GF-17, GF-18, GF-19, and GF-20 depend on real Contract C data for final merge. However, **fixture-backed prototypes are encouraged earlier**:

- The `governance.ts` normalization API shape is defined during GF-16, but the interface can be designed earlier based on frozen schemas
- Components may be prototyped against fixture Contract C data through the same normalization API
- Prototypes help de-risk component design before real payloads arrive
- **Final merge** of GF-17/18/19/20 depends on real normalized Contract C — prototypes are not shippable
- **Prospect-visibility guardrail:** Fixture-backed governance prototypes must not be visible in hidden or live rollout states. Governance components may only render in production (hidden or live) once backed by real normalized Contract C data. This prevents fixture-driven governance UI from accidentally becoming prospect-visible.

This keeps the implementation path flexible without breaking the dependency chain.

---

### PR#GF-15: Ingest Contract B Payloads + Semantic Validation

**Depends on:** DAK-GF-5.6 (payload export from data-audit-kit)

**Scope:**
- Replace fixture loader with real Contract B JSON in `public/golden-flows/`
- Validate payloads against frozen schemas
- Reconcile any drift per the drift policy above
- Build-time schema validation in CI
- **Semantic integration review** (not just schema validation)

**Semantic validation checklist:**

Some checks reference data that is not a formal website-ingested payload (e.g., the audit kit's raw quality checks output). These are **auxiliary validation inputs** — used during the ingestion/build pipeline to verify coherence, but never served to the browser runtime or consumed by components. The website repo is not expected to ingest raw audit outputs; auxiliary inputs are build-time tooling only.

- [ ] Cross-payload ID coherence: every `finding_id` in `cascade_data.json` exists in the Contract B finding index (auxiliary: cross-reference against audit kit `quality_checks` output to verify completeness)
- [ ] Snapshot/date coherence: trajectory months match snapshot `as_of_date` values
- [ ] Hook metric coherence: selector card hook metrics are grounded in the same findings shown in cascades
- [ ] Artifact link coherence: every `artifact_id` in cascade steps maps to a real screenshot in the manifest and a real deployed dashboard/doc
- [ ] Question-to-cascade coherence: every `question_id` in `executive_questions.json` has a matching cascade in `cascade_data.json`
- [ ] Narrative coherence: vertical narrative claims match the data (e.g., if narrative says "7 broken metrics," there should be 7 findings)

**Exit criteria:**
- All Contract B payloads load from real data
- Schema validation passes in CI
- Semantic validation checklist passes for Hospital and Real Estate
- Any drift reconciled per policy (version bump or fixture correction, not silent mutation)
- No fixture data in production build

---

### PR#GF-16: Ingest Contract C Payloads + Governance Normalization + Semantic Validation

**Depends on:** PLAT-GF-22.2 (governance payload exposure from platform)

**Scope:**
- Ingest real Contract C JSON into `public/golden-flows/governance/`
- Validate against frozen schemas
- Reconcile any drift per the drift policy
- Build the `src/lib/governance.ts` normalization layer (respecting normalization boundary rules above)
- Components consume governance through the normalized API, not raw JSON

**Semantic validation checklist:**
- [ ] Governance-to-finding coherence: every `finding_id` with an approval status maps to a real finding in Contract B data
- [ ] Approval semantics are clear: "approved" means approved for publication/demo (not just reviewed) — confirm against contract freeze artifact field-ownership notes
- [ ] Feedback thread `finding_id` references match Contract B finding IDs
- [ ] Trust badge `finding_id` references match Contract B finding IDs
- [ ] Published doc URLs are stable and accessible
- [ ] Business-event `finding_id` references are coherent with Contract B cascade data
- [ ] Reviewer attribution is consistent across approval records and feedback threads

**Exit criteria:**
- All Contract C payloads load from real data
- Governance normalization layer provides unified typed API
- Normalization does not introduce semantics beyond explicit contract definitions
- Schema validation passes in CI
- Semantic validation checklist passes for Hospital and Real Estate
- Components consume governance through `src/lib/governance.ts`, not raw JSON

---

### PR#GF-17: Feedback Thread Component

**Depends on:** PR#GF-16 (governance normalization layer with real data). Fixture-backed prototype encouraged earlier.

**Scope:**
- GDoc-style comment bubbles showing feedback conversations
- Comment → review → resolution chain
- Reviewer attribution (name, role, timestamp)
- Consumes data from governance normalization layer

**Exit criteria:**
- Feedback threads render as conversations, not audit logs
- Reviewer names and roles visible

---

### PR#GF-18: Trust Micro-Badges

**Depends on:** PR#GF-16 (governance normalization layer with real data). Fixture-backed prototype encouraged earlier.

**Scope:**
- Approval status badges on: selector cards, collapsed cascades, artifact previews, feedback threads
- States: pending, approved, rejected
- Colorblind-safe, readable at arm's length
- Consumes data from governance normalization layer

**Exit criteria:**
- Trust badges appear on all relevant surfaces
- Governance detail expandable on hover/tap
- Accessible (colorblind-safe, sufficient contrast)

---

### PR#GF-19: Governance Detail Panel

**Depends on:** PR#GF-18. Fixture-backed prototype encouraged earlier.

**Scope:**
- Expandable panel showing full governance chain
- Approval history, reviewer comments, timestamps
- Links to published GDocs

**Exit criteria:**
- Full governance detail available on expand
- Published doc links work

---

### PR#GF-20: Business-Event Preview Panel

**Depends on:** PR#GF-16 (governance normalization layer with real data). Fixture-backed prototype encouraged earlier.

**Scope:**
- Each vertical has at least one business-event preview
- Preview vs. approved state visually distinct
- Shows what happens when a business event (metric redefinition, restatement) flows through the system

**Exit criteria:**
- Business events render for each vertical
- Preview vs. approved visually differentiated

---

### PR#GF-21: Status Quo Comparison Refinement (Real Narrative Data)

**Depends on:** Vertical narratives from DAK-GF-5.3 (content authoring)

**Scope:**
- Replace fixture-derived status-quo copy with real vertical narratives from DAK content authoring
- Ensure claims are grounded in real audit data, not fixture assumptions
- Update any numbers that changed between fixture and real data
- Reconcile per drift policy

**Exit criteria:**
- Status-quo comparison uses real narrative content for Hospital and Real Estate
- All claims traceable to real audit findings

---

## Tier 4 — Brochure Polish (Backlog)

Deferred until Golden Flows ships. These improve the existing site but don't contribute to the commercial demo.

| PR | Title | Original # | Notes |
|----|-------|-----------|-------|
| Case studies revamp | Concrete findings, business risk, deliverables | #24 | Revisit after Golden Flows proves the conversion model |
| Metadata + approach alignment | SEO, structured data consistency | #25 | Low urgency if Golden Flows is primary traffic driver |
| Industry pages update | Fintech + Healthcare refresh | #26 | Golden Flows vertical pages may supersede these |

**Decision point:** After Golden Flows launches, evaluate whether `/healthcare` and `/fintech` landing pages should redirect to `/golden-flows/hospital` and `/golden-flows/fintech`, coexist as separate SEO surfaces, or merge.

---

## Cross-Repo Coordination

### Contract Governance Model

The website proposes consumer-facing schemas. Upstream co-ratifies. The contract is jointly owned.

```
biq_website (proposes schemas)
    ↓
bayesiq-data-audit-kit (reviews Contract B for production-fit)
bayesiq platform (reviews Contract C for governance semantics)
    ↓
Joint freeze → v1 committed in all three repos
    → freeze artifact: schemas/golden-flows/CONTRACT_FREEZE_v1.md
    ↓
Upstream validates exports against schemas in their CI
Website validates ingested payloads against schemas at build time
    ↓
Post-freeze changes require version bump + cross-repo review
```

**What the website owns:** consumer-facing shape, required fields, rendering constraints, information hierarchy requirements.

**What upstream owns:** normalization boundaries, record semantics, export feasibility, field naming where it reflects real domain structure.

**Disagreement resolution:** If the website needs a field shaped one way for rendering and upstream needs it shaped another way for export, prefer adding a derived field to the schema over forcing either side into an awkward abstraction.

### Cross-Repo Contracts This Repo Consumes

#### Contract B: `data-audit-kit` → `biq_website` (build-time static)

| Payload | Format | Purpose |
|---------|--------|---------|
| `executive_questions.json` | Per vertical | Question buttons + answer summaries |
| `discover_insights.json` | Per vertical | Discover panel cards |
| `cascade_data.json` | One file per vertical, keyed by `question_id` | Cascade viewer data |
| Trajectory summary | Per vertical | Score per month, finding counts, delta summaries |
| Screenshot manifest | Per vertical, per month | Dashboard + report preview images |
| Artifact links | Per vertical, per month | URLs to deployed dashboards + published GDocs |
| Hook metrics | Per vertical | Selector card content |
| Vertical narrative | `narrative.md` per vertical | Commercial copy source |

#### Contract C: `bayesiq` → `biq_website` (build-time static)

| Payload | Platform PR | Schema | Status |
|---------|-------------|--------|--------|
| Approval metadata | #316 | `approval_status.schema.json` | Aligned |
| Feedback threads | #317 | `feedback_threads.schema.json` | Aligned |
| Business-event governance | #318 | `business_events.schema.json` | Aligned |
| Trust badge summaries | #323 | `trust_badges.schema.json` | Aligned |
| Review context blocks | #325 | `review_context.schema.json` | Aligned (new) |
| Cascade governance overlay | #329 | `cascade_governance.schema.json` | Aligned (new) |
| Published doc URLs | — | `published_docs.schema.json` | Website-proposed |

All payloads use `schema_version` (integer const), `payload_type` (`contract_c.*` format), and `generated_at` (UTC ISO 8601). TypeScript types are generated from versioned JSON schemas. See `docs/ai/contract-summaries/contract-c-summary.md` for full field documentation.

### Parallel Execution Windows

```
Week 1–2:   Tier 0 (#22 merge, #23 tests)              ← done
Week 2–3:   GF-1 (schema proposals)
            GF-3 route shell can start in parallel (not schema-dependent)
Week 3–4:   GF-1.5 (contract freeze gate — upstream review + freeze artifact)
Week 4–6:   GF-2 (fixtures) + GF-3 completion + GF-4 (selector cards)
Week 6–10:  GF-5 through GF-7 (Tier 1 UI)        ← parallel with DAK-GF-5.0–5.1
Week 10–14: GF-8 through GF-14 (Tier 2 UI)        ← parallel with DAK-GF-5.2–5.5
            GF-17/18/19/20 prototypes (fixture-backed, not merged)
Week 14+:   GF-15 through GF-21 (Tier 3 integration) ← when upstream delivers
```

---

## Exit Criteria (Full Phase 5)

Golden Flows is done when:

**Product criteria:**
- `/golden-flows/[vertical]` renders 5 verticals with real data (not fixtures)
- Executive scan mode works: card → score → finding → consequence → CTA in one scroll
- 25 executive questions render with cascade drill-down
- Cascade expands to show full correction timeline with artifact links
- Discover panel shows supplementary insights per vertical
- Trust badges and governance detail visible on all relevant surfaces
- Feedback threads render as conversations
- Business-event previews show system response to metric changes
- Status quo comparison grounded in real vertical data

**Technical criteria:**
- Analytics instrumentation tracking all conversion signals
- Share/forward produces compelling per-vertical preview in Slack/email
- Page loads in < 3 seconds; Lighthouse performance >= 90 (target, not hard gate — Lighthouse can be noisy without stable CI measurement)
- All E2E tests pass including golden-flows routes
- Semantic validation passes for all verticals
- Governance normalization layer in use (no raw JSON consumption by components)

**Intermediate launch milestone (hidden-mode prospect readiness):**
- Hospital and Real Estate render with real data, real governance, and share-ready OG previews
- Hub shows only Hospital and Real Estate (per manifest)
- Pages can be privately shared with a prospect and stand on their own — no explanation-heavy caveats, no "this part isn't working yet"

**Full completion criteria (all 5 verticals):**
- All 5 verticals render with real data (not fixtures)
- Hub does not expose unfinished verticals to prospects in hidden mode
- All verticals marked `ready` in the manifest before `live` rollout state is set

---

## Open Questions

1. **Chart library for trajectory:** Decide during GF-5 implementation. Lightweight SVG preferred; Recharts if interactivity justifies it.
2. **Industry page fate:** Do `/healthcare` and `/fintech` merge into golden-flows verticals, coexist, or redirect? Decide after Golden Flows launches.
