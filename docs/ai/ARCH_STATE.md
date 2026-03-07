# BayesIQ Website — Architecture State

Last Updated: 2026-03-07 (Phase 4 complete)

---

# System Status

The BayesIQ website has completed **Phase 4 (Product Landing & Playground)**. The site has been fully rewritten to position BayesIQ as a product company with two products: the Data Audit Kit and the Platform. A self-serve CSV playground lets users drop a file, get instant profiling, and download a ready-to-run Streamlit dashboard as a single self-extracting shell script.

**Phase 5A (Server-Side Audit Pipeline)** is next — running the real audit kit on the server so users get full quality checks without installing anything. **Phase 5B (Downloads, Limits, Polish)** follows with artifact bundles, rate limiting, and free/paid entitlements.

---

# Pages

| Route | Page | Status | Derives from |
|-------|------|--------|-------------|
| `/` | Homepage | ✅ live | `company_overview.md`, `company_tagline.md`, `problems.md` |
| `/services` | Products | ✅ live | `services.md` (Audit Kit + Platform feature grids) |
| `/approach` | Approach | ✅ live | `engagement_model.md` (pipeline architecture + tiers) |
| `/playground` | CSV Playground | ✅ live | Client-side profiler + Streamlit generator |
| `/case-studies` | Live Demo | ✅ live | Embedded Streamlit dashboard |
| `/sample-report` | Sample Report | ✅ live | Audit Kit artifacts + scoring rubric |
| `/healthcare` | Healthcare Landing | ✅ live | Industry-specific Audit Kit positioning |
| `/fintech` | Fintech Landing | ✅ live | Industry-specific Audit Kit positioning |
| `/assessment` | Self-Assessment | ✅ live | 6-question scoring wizard |
| `/contact` | Contact | ✅ live | Resend form + Calendly embed |
| `/blog` | Blog Index | ✅ live | MDX posts from `content/blog/` |
| `/blog/[slug]` | Blog Post | ✅ live | 3 posts live |
| `/privacy` | Privacy Policy | ✅ live | Standalone |
| `/terms` | Terms of Service | ✅ live | Standalone |

---

# Components

| Component | Path | Purpose |
|-----------|------|---------|
| Header | `src/components/Header.tsx` | Sticky nav: Products, Approach, Playground, Live Demo, Blog |
| Footer | `src/components/Footer.tsx` | Tagline, nav links, newsletter signup |
| CsvPlayground | `src/components/playground/CsvPlayground.tsx` | CSV drag-drop, profiler, Streamlit app generator, self-extracting installer |
| ServiceCard | `src/components/ServiceCard.tsx` | Linked card with title + description |
| CTA | `src/components/CTA.tsx` | Reusable call-to-action section (requires `headline` prop) |
| ContactForm | `src/components/ContactForm.tsx` | Form with Resend server action |
| CalendlyEmbed | `src/components/CalendlyEmbed.tsx` | Calendly inline embed |
| NewsletterSignup | `src/components/NewsletterSignup.tsx` | Email capture with Resend |
| AssessmentWizard | `src/components/assessment/AssessmentWizard.tsx` | 6-question scoring wizard |

---

# Product Definitions (Source of Truth)

| File | Purpose | Status |
|------|---------|--------|
| `docs/product/company_overview.md` | Two-product positioning, engagement tiers, ideal clients | ✅ updated |
| `docs/product/company_tagline.md` | Product-specific taglines + one-liner | ✅ updated |
| `docs/product/brand.md` | Tone, language rules, visual identity | ✅ |
| `docs/product/services.md` | Audit Kit features (6) + Platform features (4) + engagement tiers | ✅ updated |
| `docs/product/problems.md` | 6 problems mapped to specific product solutions | ✅ updated |
| `docs/product/engagement_model.md` | Self-serve → Diagnostic → Audit+Plan → Full Implementation | ✅ updated |

---

# Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 15 (App Router) | React 19, TypeScript 5.7 |
| Styling | Tailwind CSS v4 | Custom `bayesiq-*` color scale + `accent` |
| Hosting | Vercel | |
| Forms | Resend server action | Contact form + newsletter |
| Analytics | Vercel Analytics | Event spec in `docs/ops/analytics_events.md` |
| Content | TSX pages + MDX blog | `next-mdx-remote/rsc` + `gray-matter` |
| Scheduling | Calendly embed | On contact page |

---

# Playground Architecture

The CSV playground processes everything client-side:

```
User drops CSV
    → FileReader.readAsText()
    → parseCsv() (custom parser, no dependencies)
    → profileDataset() (type inference, null counts, cardinality, top values)
    → Display profile table + detected dimensions
    → User clicks "Download & Run"
    → generateStreamlitApp() (builds app.py as string)
    → generateInstaller() (embeds app.py + requirements.txt + data.csv as heredocs)
    → downloadFile() (single .sh file download)
    → Post-download card with copy-paste terminal command
```

The installer (`bayesiq-dashboard.sh`) is self-extracting:
- Creates `~/bayesiq-dashboard/`
- Writes `app.py`, `requirements.txt`, `data.csv` from embedded heredocs
- Creates Python venv, installs deps (one-time)
- Launches Streamlit

No data leaves the browser. No server-side processing (yet — that's Phase 5).

---

# Analytics Events

| Event | Properties | Notes |
|-------|-----------|-------|
| `playground_csv_uploaded` | — | User dropped a CSV |
| `playground_profile_complete` | `rows`, `columns` | Profiling finished |
| `playground_download` | — | User downloaded the installer |
| `assessment_started` | — | First answer selected |
| `assessment_completed` | `tier` | Results generated |
| `contact_submit_started` | — | Form engagement |
| `contact_submit_success` | — | Lead captured |

---

# Configuration

| File | Purpose |
|------|---------|
| `site.config.yaml` | Page definitions, nav items, CTA config |
| `next.config.mjs` | Next.js configuration |
| `tsconfig.json` | TypeScript strict mode |
| `package.json` | Dependencies and scripts |

---

# What's Next

## Phase 5A — Server-Side Audit Pipeline
- API route (`/api/audit`) accepting CSV upload, returning scored findings
- Full quality checks (12+) on the website, not just profiling
- Scored report display (0-100 with findings) rendered in Next.js
- Depends on `bayesiq-data-audit-kit` Phase 3.8 module manifests

## Phase 5B — Downloads, Limits, Polish
- Artifact download bundles (dbt project, dashboard, docs)
- Rate limiting (1 audit/day free, 5MB max)
- Free vs paid entitlement boundary
- Error handling for timeouts, oversized files, malformed CSVs
