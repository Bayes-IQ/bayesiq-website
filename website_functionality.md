# BayesIQ Website — Functionality Spec

## Purpose

A marketing site that converts visitors into consulting leads. The site must establish BayesIQ as a credible, technically rigorous data quality consultancy — not another generic "AI company." Every page should move a visitor closer to booking a conversation.

---

## Pages & Their Jobs

### 1. Homepage (`/`)

**Job:** Hook the visitor in 5 seconds, route them to the right next step.

Sections:
- **Hero:** One clear statement of what BayesIQ does + who it's for. No jargon walls. Something like: *"Your analytics are lying to you. We find out where."*
- **Problem statement:** 2-3 sentences on why data quality fails silently. Use a concrete stat or example.
- **What we do:** Three cards — Data Quality Audits, Telemetry Validation, Pipeline Design. Each links to `/services`.
- **How it works:** Simple 3-step flow (Engage > Audit > Fix). Visual, not text-heavy.
- **Social proof / credibility:** Logos, testimonials, or a mini case study result (e.g., "7 broken metrics found in 2 weeks"). Even placeholder structure matters — build for this from day one.
- **CTA:** "Book a free data health check" — links to `/contact`.

### 2. Services (`/services`)

**Job:** Explain what BayesIQ actually delivers so a technical buyer can justify the engagement internally.

For each service:
- What it is (1-2 sentences)
- What we look at (specific: event schemas, ETL DAGs, metric definitions)
- What you get (deliverables: audit report, validation dashboard, pipeline architecture doc)
- Typical timeline and engagement format
- CTA per service

Services:
1. **Data Quality Audit** — Full evaluation of telemetry accuracy, metric reliability, and pipeline health.
2. **Telemetry & Logging Validation** — Compare what your logging spec says vs. what actually fires. Field-level validation.
3. **Analytics Pipeline Design** — ETL architecture, metrics layer definition, and reliability improvements.
4. **Continuous Monitoring Setup** (future/beta) — Automated agents that catch drift before it reaches dashboards.

### 3. Approach (`/approach`)

**Job:** Differentiate BayesIQ from generic consultancies. Show the method.

Sections:
- **Philosophy:** "We treat data systems like code — they should be tested, validated, and continuously monitored."
- **The BayesIQ method:** Step-by-step breakdown of how an engagement works:
  1. Intake — understand your data architecture, logging specs, and pain points
  2. Automated scan — AI agents analyze telemetry, schemas, and pipelines
  3. Expert review — data scientists interpret findings, prioritize issues
  4. Deliverables — actionable report with severity-ranked issues and fix recommendations
  5. Follow-up — optional implementation support or monitoring setup
- **What makes us different:** AI-assisted analysis (speed) + human expertise (judgment). Not fully automated, not fully manual.
- **Tools & techniques:** Brief mention of what's under the hood without giving away IP. Enough to signal technical depth.

### 4. Case Studies (`/case-studies`)

**Job:** Prove that this works with real (or realistic) examples.

Structure per case study:
- Industry / company type (anonymized is fine)
- The problem they came to us with
- What we found (specific numbers: X broken metrics, Y missing events, Z% pipeline failures)
- What we recommended
- Outcome / impact

Start with 2-3 case studies. Even semi-hypothetical ones based on real patterns are better than an empty page. Label them appropriately.

### 5. Blog / Insights (`/blog`) — Phase 2

**Job:** SEO + thought leadership. Establish expertise in data quality.

Topics:
- "The 5 most common telemetry failures"
- "How to audit your analytics pipeline in a week"
- "Why your A/B test metrics might be wrong"
- "Schema drift: the silent killer of analytics"

Markdown-driven. Easy to add posts via PR.

### 6. Contact (`/contact`)

**Job:** Capture leads with minimal friction.

- Short form: name, email, company, brief description of data challenge
- Option to book a call directly (Calendly embed or similar)
- No aggressive sales copy. Tone: "Let's talk about your data."

---

## Cross-Cutting Functionality

### Navigation
- Clean top nav: Home | Services | Approach | Case Studies | Contact
- Sticky header on scroll
- Mobile hamburger menu

### CTAs
- Primary CTA on every page: "Book a free data health check" or "Talk to us"
- Secondary CTA where relevant: "See how it works" (links to `/approach`)

### SEO
- Unique meta title + description per page
- Structured data (Organization, Service)
- Fast load times (static generation where possible)
- Blog posts for long-tail search traffic (Phase 2)

### Analytics
- Basic event tracking (page views, CTA clicks, form submissions)
- Ironic but necessary: track our own telemetry properly

### Design Principles
- Clean, minimal, professional. Think: Stripe, Linear, Vercel — not enterprise bloatware.
- Dark/light scheme — default to light, dark mode optional.
- Typography-forward. Data visualizations or diagrams where they clarify, not decorate.
- Mobile-first responsive.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Content:** MDX for blog posts, structured data in markdown for services/case studies
- **Hosting:** Vercel
- **Forms:** Resend + Next.js server action (native to the stack, no third-party form dependency)
- **Scheduling:** Calendly embed for booking calls
- **Analytics:** Vercel Analytics or Plausible (privacy-friendly)

---

## Phases

### Phase 1 — Launch
- Homepage, Services, Approach, Contact
- Clean design, mobile responsive
- Contact form working
- Deployed on Vercel with custom domain

### Phase 2 — Content & Credibility
- Case Studies page with 2-3 entries
- Blog with 3-5 initial posts
- SEO metadata and structured data
- Social proof section on homepage

### Phase 3 — Growth
- Calendly integration for direct booking
- Email capture / newsletter
- Interactive data quality self-assessment tool
- Analytics dashboard for internal tracking
