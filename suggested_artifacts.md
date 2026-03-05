# BayesIQ Website — Artifact Plan

This defines every artifact needed for the website, organized by purpose. Each artifact has a clear owner (human vs. AI-generatable), current status, and what "done" looks like.

---

## Layer 1: Product Definition (Source of Truth)

These are the canonical docs that all website copy derives from. Edit these first — everything else follows.

| Artifact | Path | Status | Owner | Notes |
|---|---|---|---|---|
| Company Overview | `docs/product/company_overview.md` | Done | Human | Core positioning, services, ideal clients, vision. This is the seed doc. |
| Tagline & Positioning | `docs/product/company_tagline.md` | Done | Human | Primary tagline + alternatives for testing. |
| Problems We Solve | `docs/product/problems.md` | To create | Human | The pain points that drive consulting conversions. See spec below. |
| Services Detail | `docs/product/services.md` | To create | Human | Expand each service into a full brief: scope, deliverables, timeline. |
| Engagement Model | `docs/product/engagement_model.md` | To create | Human | How a client engagement works end-to-end. Powers the Approach page. |
| Brand Voice | `docs/product/brand.md` | To create | Human | See spec below. |

### `docs/product/services.md` — What "done" looks like

Each service needs enough detail that a page can be generated from it:

**Data Quality Audit**
- Scope: telemetry accuracy, metric reliability, pipeline health, dashboard correctness
- Deliverables: severity-ranked issue report, fix recommendations, executive summary
- Format: 1-2 week engagement, async + 2-3 syncs
- Who it's for: teams that suspect their metrics are wrong but can't pinpoint where

**Telemetry & Logging Validation**
- Scope: compare logging spec vs. actual fired events, field-level validation, coverage gaps
- Deliverables: validation report mapping spec to reality, list of missing/malformed events
- Format: 3-5 day sprint
- Who it's for: product teams shipping telemetry who need to know it's correct

**Analytics Pipeline Design**
- Scope: ETL architecture review/design, metrics layer definition, reliability improvements
- Deliverables: architecture doc, implementation plan, metric definitions
- Format: 2-4 week engagement
- Who it's for: teams building or rebuilding their data platform

**Continuous Monitoring** (future)
- Scope: automated agents that validate telemetry and metrics on an ongoing basis
- Deliverables: monitoring setup, alerting rules, drift detection
- Format: monthly retainer or one-time setup
- Who it's for: teams that solved the initial problems and want to prevent regression

### `docs/product/brand.md` — What "done" looks like

```markdown
# BayesIQ Brand Voice

## Tone
- Technical but accessible — write for a senior data engineer, not a boardroom
- Confident without hype — state what we do and what it achieves, skip superlatives
- Specific over vague — numbers, examples, named technologies, concrete deliverables
- Slightly opinionated — we have a point of view on how data quality should work

## Language rules
- Say "audit" not "solution"
- Say "we found 7 broken metrics" not "we improved data quality"
- Say "telemetry validation" not "data governance"
- Never use: revolutionary, game-changing, cutting-edge, leverage, synergy
- Avoid: "AI-powered" as a lead adjective (we use AI, but it's the method, not the brand)

## Visual identity
- Clean, minimal, typographic — think Stripe/Linear, not enterprise SaaS
- Monochrome with one accent color
- Data visualizations should clarify, not decorate
- No stock photos of people looking at screens

## Reference sites (for design inspiration, not copying)
- stripe.com — clarity, typography, developer trust
- linear.app — clean product marketing, technical audience
- vercel.com — minimalism, speed, developer-first
```

### `docs/product/problems.md` — What "done" looks like

Consulting sites convert on problems, not services. This doc defines the pain points visitors recognize in themselves.

```markdown
# Problems BayesIQ Solves

## Metrics drift
Your dashboards show numbers, but do they reflect reality? Over time, metric definitions shift,
data sources change, and nobody validates that the number still means what it used to.

## Telemetry gaps
Events that should fire don't. Fields that should be populated are null. Your logging spec says
one thing; your data says another. You won't know until a stakeholder asks a question you can't answer.

## Pipeline fragility
ETL jobs break silently. A schema change upstream cascades into wrong aggregations downstream.
By the time anyone notices, weeks of data are compromised.

## Debugging paralysis
Something is wrong with the numbers. Is it the instrumentation? The pipeline? The metric definition?
The dashboard query? Teams spend days or weeks chasing data issues across systems.

## False confidence
The most dangerous data problem: everything looks fine. Dashboards are green. Reports go out.
Decisions get made. But the underlying data has been wrong for months.
```

### `docs/product/engagement_model.md` — What "done" looks like

This powers the Approach page and answers "what happens if I hire you?"

```markdown
# BayesIQ Engagement Model

## Step 1 — Discovery (Day 1-2)
Understand your data architecture, logging specs, known pain points, and what "trustworthy data"
means for your organization. We review your telemetry spec, pipeline architecture, and key metrics.

## Step 2 — Automated Scan (Day 3-5)
AI agents analyze your telemetry against the logging spec, validate pipeline transformations,
and check metric definitions against underlying data. This surfaces issues humans would take weeks to find.

## Step 3 — Expert Review (Day 5-7)
Data scientists review the automated findings, eliminate false positives, assess severity, and
identify root causes. Not everything flagged is a real problem — human judgment separates signal from noise.

## Step 4 — Findings & Fix Plan (Day 7-10)
Deliverable: a severity-ranked report of every issue found, with root cause analysis and specific
fix recommendations. Executive summary for leadership, technical detail for engineers.

## Step 5 — Implementation Support (Optional)
We can help implement fixes, set up validation tests, or configure ongoing monitoring.
This is optional — many teams take the report and fix things themselves.

## Step 6 — Monitoring Setup (Optional)
For teams that want continuous validation, we set up automated agents that catch drift,
telemetry gaps, and metric inconsistencies before they reach dashboards.
```

---

## Layer 2: Website Content

These are the actual page content files. They should be written in MDX so they can include components (CTAs, cards, diagrams) alongside prose.

| Artifact | Path | Status | Owner | Generates from |
|---|---|---|---|---|
| Homepage | `content/home.mdx` | To create | AI (human review) | company_overview.md, tagline.md, problems.md |
| Services | `content/services.mdx` | To create | AI (human review) | services.md |
| Approach | `content/approach.mdx` | To create | AI (human review) | engagement_model.md |
| Case Studies | `content/case-studies.mdx` | To create | AI (human review) | See below |
| Contact | `content/contact.mdx` | To create | Mixed | Standalone |
| Blog posts | `content/blog/*.mdx` | Phase 2 | AI (human review) | Original content |

### Case studies — bootstrapping without real clients

Create 2-3 "illustrative case studies" based on common data quality patterns. Be honest about what they are — label them as "Based on common engagement patterns" rather than pretending they're real clients.

**Case Study 1: Fintech Event Tracking Gap**
- Problem: Payment events missing from analytics, revenue metrics underreporting by ~12%
- Found: 3 event types not firing on mobile web, 2 fields consistently null
- Fix: Updated event instrumentation, added validation tests
- Result: Revenue metric accuracy restored, discrepancy eliminated

**Case Study 2: Healthcare Metric Double-Counting**
- Problem: Patient engagement metric inflated, driving wrong resource allocation
- Found: Duplicate events from retry logic, no deduplication in pipeline
- Fix: Added idempotency keys, deduplicated at ingestion
- Result: Metric corrected downward 34%, resource allocation re-prioritized

**Case Study 3: E-commerce A/B Test Bias**
- Problem: A/B test results inconsistent with revenue data
- Found: Assignment event firing after page load, excluding fast bouncers from control
- Fix: Moved assignment to server-side, before render
- Result: Test framework now matches revenue data within 2% tolerance

---

## Layer 3: Site Structure

| Artifact | Path | Status | Notes |
|---|---|---|---|
| Site config | `site.config.yaml` | To create | Pages, routes, content mappings, nav, and SEO metadata |

### `site.config.yaml`

```yaml
pages:
  - path: /
    type: page
    content: content/home.mdx
    title: BayesIQ — AI-Powered Data Auditing
    description: "BayesIQ audits telemetry, analytics pipelines, and business metrics so you can trust your data."

  - path: /services
    type: page
    content: content/services.mdx
    title: Services — BayesIQ
    description: "Data quality audits, telemetry validation, and analytics pipeline design."

  - path: /approach
    type: page
    content: content/approach.mdx
    title: Our Approach — BayesIQ
    description: "How BayesIQ combines AI-assisted analysis with expert data science to audit your data systems."

  - path: /case-studies
    type: page
    content: content/case-studies.mdx
    title: Case Studies — BayesIQ
    description: "Examples of how BayesIQ finds and fixes hidden data quality issues."

  - path: /contact
    type: page
    content: content/contact.mdx
    title: Contact — BayesIQ
    description: "Talk to us about your data challenges."

  # Phase 2 examples:
  # - path: /healthcare
  #   type: landing
  #   content: content/landing/healthcare.mdx
  # - path: /blog/telemetry-audit-guide
  #   type: blog
  #   content: content/blog/telemetry-audit-guide.mdx

nav:
  items:
    - label: Services
      path: /services
    - label: Approach
      path: /approach
    - label: Case Studies
      path: /case-studies
  cta:
    label: Get in Touch
    path: /contact
```

---

## Layer 4: Engineering

| Artifact | Path | Status | Notes |
|---|---|---|---|
| Package config | `package.json` | To create | Next.js, Tailwind, MDX dependencies |
| Next.js config | `next.config.js` | To create | MDX plugin, image optimization |
| Tailwind config | `tailwind.config.js` | To create | Custom theme (fonts, colors, spacing) |
| Vercel config | `vercel.json` | To create | Redirects, headers, region |
| TypeScript config | `tsconfig.json` | To create | Strict mode |
| README | `README.md` | To create | Setup instructions, architecture overview |

### Key engineering decisions

- **App Router** (not Pages Router) — simpler, future-proof
- **MDX** for content pages — mix markdown with React components
- **Static generation** for all pages — fast, cheap, SEO-friendly
- **No CMS** — content lives in the repo, changes via PRs
- **Resend + Next.js server action** for contact form — native to the stack, no third-party form dependency
- **Plausible or Vercel Analytics** — privacy-friendly, no cookie banner needed

---

## Layer 5: AI Maintenance

Instead of separate `BOOTSTRAP_PROMPT.md` and `TASKS.md` files, use `CLAUDE.md` at the repo root. This is the standard convention for Claude Code and works automatically.

### `CLAUDE.md`

```markdown
# BayesIQ Website

Marketing site for BayesIQ data auditing consultancy.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- MDX for content
- Deployed on Vercel

## Structure
- `docs/product/` — canonical product definitions (source of truth)
- `content/` — page content in MDX
- `src/app/` — Next.js routes and layouts
- `src/components/` — shared UI components

## Content workflow
1. Product definitions in `docs/product/` are the source of truth
2. Page content in `content/` is derived from product definitions
3. Changes to messaging should start in `docs/product/`, then propagate to `content/`

## Brand voice
- Technical, specific, confident without hype
- Write for senior data engineers and analytics leads
- Use concrete numbers and examples over vague claims
- See `docs/product/brand.md` for full guidelines

## When adding a page
1. Add entry to `site.config.yaml`
2. Create content file in `content/`
3. Create route in `src/app/`
```

---

## Creation Order

This is the order to build things in — each step unlocks the next:

1. **Product definitions** — `problems.md`, `services.md`, `engagement_model.md`, `brand.md` (complete the source of truth)
2. **Engineering scaffold** — `package.json`, configs, basic Next.js app with Tailwind
3. **Site structure** — `site.config.yaml`, layout component with nav
4. **Homepage** — `content/home.mdx` + route (draws from problems.md + tagline)
5. **Services page** — `content/services.mdx` + route
6. **Approach page** — `content/approach.mdx` + route (draws from engagement_model.md)
7. **Contact page** — `content/contact.mdx` + route + Resend server action
8. **Case studies** — `content/case-studies.mdx` + route
9. **SEO** — meta tags, structured data, sitemap.xml
10. **Deploy** — Vercel setup, custom domain, production checks
11. **Blog** (Phase 2) — MDX blog infrastructure + first 3 posts
12. **Landing pages** (Phase 2) — industry-specific pages (healthcare, fintech) using `type: landing`
