# BayesIQ Website — Architecture State

Last Updated: 2026-03-29 (Website rewrite complete; golden flows, consulting, assessment, platform pages live)

---

# System Status

The BayesIQ website has been fully rewritten to position BayesIQ as a consulting-led company with two main paths: **Consulting** (audit-first engagements with golden-flow demos) and **Platform** (governed data intelligence). The site features a self-assessment wizard, interactive golden-flow vertical demos with live governance visualization, and a consulting engagement pipeline.

The golden flows system uses a JSON schema contract layer (Contract B for data payloads, Contract C for governance state) with auto-generated TypeScript types and a static data loader that supports both `public/` and `fixtures/` sources.

---

# Pages

| Route | Page | Status | Purpose |
|-------|------|--------|---------|
| `/` | Homepage | live | Hero, governance chain, proof strip, path cards |
| `/consulting` | Consulting | live | Audit-first pipeline steps, engagement tiers, bento grid, FAQ |
| `/consulting/explore` | Golden Flows Hub | live | Redirects to `/consulting/explore/fintech-gf` |
| `/consulting/explore/[vertical]` | Golden Flow Vertical | live | SSG dynamic pages (5 verticals), interactive demo |
| `/consulting/case-studies` | Case Studies | live | Case study index |
| `/consulting/industries` | Industries | live | Healthcare + fintech combined via IndustryTabs |
| `/consulting/sample-report` | Sample Report | live | Sample audit report |
| `/platform` | Platform | live | GovernanceChainExpanded, ThreeTruthLayers, PlatformSection, PlatformCTA |
| `/assessment` | Assessment | live | Self-assessment scoring wizard |
| `/contact` | Contact | live | Contact form + Calendly embed |
| `/privacy` | Privacy Policy | live | Legal |
| `/terms` | Terms of Service | live | Legal |

### Redirects (next.config.mjs)

| Old Route | Target |
|-----------|--------|
| `/services` | `/platform` |
| `/approach` | `/consulting` |
| `/fintech` | `/consulting/industries` |
| `/healthcare` | `/consulting/industries` |
| `/audit-kit` | `/consulting` |
| `/golden-flows/*` | `/consulting/explore` |
| `/blog/*` | `/` |
| `/playground` | `/` |
| `/case-studies` | `/consulting/case-studies` |
| `/sample-report` | `/consulting/sample-report` |

---

# Navigation (Header.tsx)

- Home
- Consulting
- Platform
- "Get in Touch" CTA button

---

# Components

All components live in `src/components/`.

### Core

| Component | File | Purpose |
|-----------|------|---------|
| Header | `Header.tsx` | Sticky nav (client component) |
| Footer | `Footer.tsx` | Site footer with nav links |
| CTA | `CTA.tsx` | Reusable call-to-action section |
| ContactForm | `ContactForm.tsx` | Form with server action (client component) |
| CalendlyEmbed | `CalendlyEmbed.tsx` | Calendly inline embed |
| PathCard | `PathCard.tsx` | Navigation card for consulting/platform paths |
| ProofStrip | `ProofStrip.tsx` | Social proof metrics strip |
| GovernanceChain | `GovernanceChain.tsx` | Governance visualization chain |
| SectionReveal | `SectionReveal.tsx` | Scroll-triggered section animation |
| AnimatedCounter | `AnimatedCounter.tsx` | Animated number counter |
| StatCounter | `StatCounter.tsx` | Statistic display with counter |
| BeforeAfterSplit | `BeforeAfterSplit.tsx` | Before/after comparison layout |
| InlineEvidence | `InlineEvidence.tsx` | Inline evidence callout |
| ContactContextCTA | `ContactContextCTA.tsx` | Context-aware contact CTA |

### Consulting

| Component | File | Purpose |
|-----------|------|---------|
| PipelineSteps | `consulting/PipelineSteps.tsx` | Audit pipeline step visualization |
| EngagementTiers | `consulting/EngagementTiers.tsx` | Engagement tier cards |
| BentoGrid | `consulting/BentoGrid.tsx` | Capability bento grid layout |
| BentoCard | `consulting/BentoCard.tsx` | Individual bento card |
| FAQAccordion | `consulting/FAQAccordion.tsx` | Expandable FAQ section |
| BeforeAfter | `consulting/BeforeAfter.tsx` | Before/after comparison |
| IndustryTabs | `consulting/IndustryTabs.tsx` | Healthcare/fintech tab switcher |

### Platform

| Component | File | Purpose |
|-----------|------|---------|
| GovernanceChainExpanded | `platform/GovernanceChainExpanded.tsx` | Expanded governance chain visualization |
| ThreeTruthLayers | `platform/ThreeTruthLayers.tsx` | Three truth layers diagram |
| PlatformSection | `platform/PlatformSection.tsx` | Platform feature section |
| PlatformCTA | `platform/PlatformCTA.tsx` | Platform-specific CTA |

### Assessment

| Component | File | Purpose |
|-----------|------|---------|
| AssessmentWizard | `assessment/AssessmentWizard.tsx` | Multi-step scoring wizard |
| AssessmentContent | `assessment/AssessmentContent.tsx` | Assessment page content wrapper |
| AssessmentLoading | `assessment/AssessmentLoading.tsx` | Loading state for assessment |
| EmailCaptureInline | `assessment/EmailCaptureInline.tsx` | Inline email capture |
| Progress | `assessment/Progress.tsx` | Progress indicator |
| QuestionCard | `assessment/QuestionCard.tsx` | Individual question card |
| ResultsPanel | `assessment/ResultsPanel.tsx` | Results display panel |
| ScoreReveal | `assessment/ScoreReveal.tsx` | Animated score reveal |
| ShareResults | `assessment/ShareResults.tsx` | Share results functionality |
| StepDots | `assessment/StepDots.tsx` | Step indicator dots |

### Golden Flows (35+ components)

**Vertical navigation:**
VerticalSelector, VerticalSelectorCard, VerticalClickTracker, VerticalHero, VerticalLanding, VerticalTabs

**Data visualization:**
ScoreTrajectory, MetricCard, MetricCardsGrid

**Interactive:**
AskButtons, AskAndCascadeSection, CascadeCard, CascadeViewer

**Dashboard:**
DashboardGrid, DashboardScreenshot

**Content:**
DiscoverInsights, RealityReveal, StatusQuoComparison, BayesIQDifference, RemediationArc, ReportPreview

**Governance:**
GovernanceProgressBar, GovernanceTrustBadge, GovernanceDetailPanel, GovernanceDetailProvider, TrustBadge, TrustSummaryBar, WorkflowStatusBar, DecisionLog

**Feedback:**
FeedbackThread, FeedbackThreadList

**Business Events:**
BusinessEventPreview, BusinessEventList

**CTA:**
GoldenFlowsCTA

---

# Libs

| File | Purpose |
|------|---------|
| `src/lib/golden-flows.ts` | Static data loader with `public/` to `fixtures/` fallback, typed accessors for Contract B + C payloads |
| `src/lib/governance.ts` | Governance normalization layer with indexed Maps, coherence validation, client serialization helpers |
| `src/lib/gf-analytics.ts` | Golden flows analytics event helpers |
| `src/lib/golden-flows-ui.ts` | Golden flows UI helper utilities |
| `src/lib/flags.ts` | Feature flags (e.g., `SHOW_SOCIAL_PROOF`) |
| `src/lib/industry-data.ts` | Industry page data for healthcare + fintech |

---

# Data Layer

### Schemas

- **Contract B** (data payloads): `schemas/golden-flows/contract-b/` (8 schemas)
- **Contract C** (governance state): `schemas/golden-flows/contract-c/` (7 schemas)
- **Contract freeze**: `schemas/golden-flows/CONTRACT_FREEZE_v1.md`

### Types

- Auto-generated from schemas: `src/types/golden-flows/`
- Generation command: `npm run generate:types`

### Data

- Production data: `public/golden-flows/{vertical}/` (5 verticals, all payloads)
- Governance data: `public/golden-flows/governance/`
- Fixtures: `fixtures/golden-flows/` (hook-metrics, executive-questions, narratives, `verticals.json`)

---

# Design System

| File | Purpose |
|------|---------|
| `src/vendor/biq/tokens.css` | Design system token values |
| `src/vendor/biq/tailwind-v4-theme.css` | Token to Tailwind v4 theme mappings |
| `src/app/globals.css` | Site-specific gray scale (`bayesiq-{50..900}`) |

**Semantic tokens:** `biq-primary`, `biq-text-*`, `biq-surface-*`, `biq-border`, `biq-status-*`

**Exception:** Semantic error colors (red) used directly in error boundaries, documented as intentional deviation.

---

# Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 15 (App Router) | React 19, TypeScript 5.7 |
| Styling | Tailwind CSS v4 | Centralized design system with vendor tokens |
| Animation | framer-motion | Section reveals, counters, score animations |
| Hosting | Vercel | Analytics + Speed Insights |
| Forms | Resend server action | Contact form |
| Scheduling | Calendly embed | On contact page |
| Schema validation | ajv + ajv-formats | Golden flows contract validation |
| Type generation | json-schema-to-typescript | Schema to TS type generation |
| E2E testing | Playwright | + @axe-core/playwright for a11y |
| Unit testing | Vitest | Component + lib tests |

---

# Testing

### E2E (Playwright)

- `smoke.spec.ts` — page load smoke tests
- `links.spec.ts` — internal link validation
- `json-ld.spec.ts` — structured data validation
- `golden-flows.spec.ts` — golden flows page tests
- `governance-detail.spec.ts` — governance detail panel tests
- `visual-qa.spec.ts` — visual regression checks
- `a11y-check.spec.ts` — accessibility audit

### Unit (Vitest)

- `governance.spec.ts` — governance normalization logic
- 11+ component tests

### Scripts

- `validate:schemas` — JSON schema validation
- `generate:types` — schema to TypeScript generation
- `visual-qa` — visual QA checks
- `a11y-check` — accessibility checks
- `pixel-diff` — pixel-level diff comparison
- `design-debt` — design system debt tracking

**Total: ~80 tests passing.**

---

# Configuration

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js config, redirects, security headers |
| `tsconfig.json` | TypeScript strict mode |
| `package.json` | Dependencies and scripts |
| `tailwind.config.ts` | Tailwind v4 configuration |
| `playwright.config.ts` | Playwright test configuration |
| `vitest.config.ts` | Vitest test configuration |

---

# What's Next

- **Real data integration** — replace demo/fixture data with production audit kit output (Issue #50)
- **Visual QA retrofit** — systematic visual regression coverage (Issue #83)
- **Brand assets** — favicon and OG images (Issue #80)
- **Contact form endpoint** — Formspree endpoint setup (Issue #79)
- **Design system token migration** — dark section token coverage (Issues #77, #78)
- **Industry page fate decision** — redirect to golden-flows verticals or coexist
