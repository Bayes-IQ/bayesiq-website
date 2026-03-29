# BayesIQ Website — Development Roadmap

Last Updated: 2026-03-29 (Phase 5 near-complete, all tiers built with fixture/demo data)

---

# Guiding Principle

**BayesIQ Website exists to generate qualified client demand for BayesIQ consulting and BayesIQ Data Audit Kit engagements.** The site should establish trust, demonstrate capability, and convert technical buyers into booked conversations.

The Audit Kit is not a separate competing identity — it is the most concrete, demonstrable expression of BayesIQ. The site sells services first, demonstrates the Audit Kit second, and only later evolves into deeper self-serve software.

```
Positioning -> Trust -> Proof -> Conversion -> Audit Preview -> Client Qualification
```

### Positioning Model

| Brand | Role on Site | What It Communicates |
|-------|-------------|---------------------|
| **BayesIQ** | Service/engagement brand | Governed data delivery, audit/remediation engagements, telemetry advisory, custom implementation |
| **BayesIQ Data Audit Kit** | Flagship proof asset | Upload a CSV -> see what BayesIQ finds -> understand what an engagement delivers -> proof that methods are real |

The homepage hierarchy should answer, fast: (1) What do you do? (2) Who is it for? (3) Why should I trust you? (4) What do I get? (5) What is the next step?

### Cross-Repo Alignment

This website intersects three repos. Each phase below maps to where the audit kit (`bayesiq-data-audit-kit`) and platform (`bayesiq`) are in their own roadmaps:

| Website Phase | Audit Kit Phase | Platform Phase | Integration Point |
|---------------|-----------------|----------------|-------------------|
| Phase 5 (active) | GF-5.x | GF-22.x | Golden flows data via Contract B + C schemas |
| Phase 5A (deferred) | 3.8 (done) | -- | Server-side audit pipeline, findings + score on website |
| Phase 5B (deferred) | 3.8 (done) | -- | Artifact downloads, rate limiting, free/paid entitlements |
| Phase 6 (deferred) | 4 (next) | Active | Chat UI powered by platform orchestration layer |
| Phase 7 (deferred) | 5 (hosted) | Active | Hosted dashboards, multi-tenant, self-service |

Phases 5A-7 are deferred until the site has proven client acquisition value. They remain in the roadmap as future direction but are not near-term priorities.

### Content Derivation

```
docs/product/* (truth) -> src/app/* (derived copy + layout)
```

`docs/product/*` is the sole source of truth for messaging. Pages in `src/app/*` are direct TSX. Never skip the source-of-truth step. Page copy that doesn't trace back to a product definition doc will drift.

---

# Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript 5.7
- **Styling:** Tailwind CSS v4
- **Hosting:** Vercel
- **Forms:** Resend + Next.js server action
- **Analytics:** Vercel Analytics (`@vercel/analytics`) + Speed Insights (`@vercel/speed-insights`)
- **Animations:** framer-motion
- **Content:** Direct TSX for all pages
- **Testing:** Playwright (E2E: smoke, links, JSON-LD, golden-flows, governance, a11y, visual-qa) + Vitest (unit/component)
- **Scheduling:** Calendly embed on contact page

---

# Quality Gates

Every PR must pass before merge:

- `npm run build` succeeds (no build errors)
- `npm run lint` passes
- `npm test` passes (Playwright E2E + Vitest unit tests)
- Lighthouse scores: Performance >= 90, Accessibility >= 90, SEO >= 90
- No broken internal links (enforced by automated test suite)
- Typecheck passes (`npx tsc --noEmit`)

---

# Route Structure (Current)

The site has been restructured from its original flat layout into a consulting-focused hierarchy. Old routes redirect to new locations.

### Active Routes

| Route | Purpose | Type |
|-------|---------|------|
| `/` | Homepage -- hero, positioning, conversion | Server |
| `/consulting` | Audit-first consulting page | Server |
| `/consulting/explore` | Golden flows hub (redirects to `/consulting/explore/fintech-gf`) | Server (redirect) |
| `/consulting/explore/[vertical]` | Per-vertical golden flows pages (SSG, 5 verticals) | Static (generateStaticParams) |
| `/consulting/case-studies` | Case studies | Server |
| `/consulting/industries` | Industry pages (healthcare + fintech) | Server |
| `/consulting/sample-report` | Sample audit report preview | Server |
| `/platform` | Platform capabilities page | Server |
| `/assessment` | Data quality self-assessment questionnaire | Server |
| `/contact` | Contact form + Calendly embed | Client |
| `/privacy` | Privacy policy | Server |
| `/terms` | Terms of service | Server |

### Golden Flows Verticals (SSG)

Five verticals rendered via `generateStaticParams()`:

| Slug | Vertical |
|------|----------|
| `fintech-gf` | Fintech |
| `saas` | SaaS |
| `hospital` | Hospital/Healthcare |
| `retail` | Retail |
| `real-estate` | Real Estate |

### Redirects (Legacy Routes)

All configured in `next.config.mjs` as permanent (301) redirects:

| Old Route | Redirects To |
|-----------|-------------|
| `/services` | `/platform` |
| `/approach` | `/consulting` |
| `/audit-kit` | `/consulting` |
| `/fintech` | `/consulting/industries` |
| `/healthcare` | `/consulting/industries` |
| `/golden-flows` | `/consulting/explore` |
| `/golden-flows/*` | `/consulting/explore` |
| `/blog`, `/blog/*` | `/` |
| `/playground` | `/` |
| `/case-studies` | `/consulting/case-studies` |
| `/sample-report` | `/consulting/sample-report` |

---

# Phases 1-4 -- Complete

Phases 1 through 4 built the site from scratch through multiple iterations: MVP launch, SEO/analytics/content, growth features, and audit kit positioning. All complete.

### Phase 1 -- MVP Launch

Established credibility with homepage, services, approach, case studies, contact page, navigation, and product definition docs.

### Phase 2 -- Content & Credibility

SEO metadata, sitemap, robots.txt, analytics (Vercel Analytics), Resend contact form, privacy/terms pages, blog infrastructure with 3 posts. Blog was later dropped from scope and routes now redirect to `/`.

### Phase 3 -- Growth & Interactivity

Calendly embed, email capture, sample report page, data quality self-assessment tool, industry landing pages (healthcare + fintech).

### Phase 4 -- Audit Preview & Playground

CSV playground with client-side profiling, homepage rewrite for BayesIQ + Audit Kit positioning, services/approach/sample-report/industry page rewrites, product docs rewrite.

### Website Revamp -- Client Acquisition Repositioning

Full site repositioning for client acquisition. Completed Tier 1 (homepage, audit kit page, E2E tests, case studies, contact flow, sample deliverables) and Tier 2 (industry pages, metadata/SEO, blog, playground).

---

# Success Metrics

**Primary conversion metrics:**
- Contact form submit rate
- Calendly booking rate
- Qualified lead rate -- a lead counts as qualified when: (1) real company with a data quality, telemetry, or analytics problem, (2) relevant use case for BayesIQ or the Audit Kit, (3) has budget authority or decision-making influence, (4) wants a conversation within 30 days

**Proof engagement metrics:**
- Sample report page views
- Golden flows vertical page engagement
- Case study expansion / dwell time

**Channel metrics:**
- Organic search impressions to core service pages
- Golden flows share/forward rate
- Industry page conversion rate

---

# Phase 5 -- Golden Flows Commercial Surface (Active)

**Cross-repo ref prefix:** `WEB-GF-5.x`
**Master initiative:** `bayesiq/docs/ai/pr_markdown_plans/standing_up_demos.md`
**Decomposition doc:** `bayesiq/docs/ai/pr_markdown_plans/decomposing_demos.md`

Build the executive-facing golden flows pages -- the commercial demo shell for the five-vertical golden flows initiative. Consumes build-time static JSON from `bayesiq-data-audit-kit` (Contract B) and `bayesiq` platform (Contract C). **No runtime dependencies** on audit-kit execution or platform APIs.

## Premise

Golden Flows is the real purpose of the website. The website proposes consumer-facing JSON schemas; upstream co-ratifies before freeze. All UI is built against fixture/demo data now, to be swapped for real data when upstream delivers. The site is **ready to light up** the moment upstream delivers production data.

---

## Decisions (Resolved)

### Routing: `/consulting/explore/[vertical]` (hybrid per-vertical routes)

Each vertical gets its own URL: `/consulting/explore/fintech-gf`, `/consulting/explore/hospital`, etc. The hub page at `/consulting/explore` currently redirects to `/consulting/explore/fintech-gf` (the default vertical).

**Why per-vertical routes:**
- Better sharing -- "forward this to Head of Data" lands on a distinct vertical page
- Better OG previews -- per-vertical title, description, image
- Better instrumentation -- page-level analytics without query-param parsing
- Better direct sales usage -- hand someone a URL, not a URL + instructions
- Future SEO flexibility -- each vertical can rank independently

**Implications:**
- Fixture/demo data organized per vertical directory in `public/golden-flows/`
- OG image generation is per-vertical (metadata implemented via `generateMetadata()`)
- Analytics events include vertical from the route, not from client state
- Canonical URLs set per vertical page once live

### Rollout States

Three distinct states controlled by `NEXT_PUBLIC_GOLDEN_FLOWS_STATE`: `"off"` | `"hidden"` | `"live"`.

| State | Route exists | In nav | Shareable | Use case |
|-------|-------------|--------|-----------|----------|
| **Local only** | Dev server only | No | No | Building, iterating |
| **Production hidden** | Deployed on Vercel | No | Yes, by direct URL | Stakeholder review, prospect previews |
| **Production linked** | Deployed | Yes | Yes | Public launch |

### Chart Library: SVG (Decided)

Lightweight SVG chosen for the score trajectory visualization. No external chart library needed. The `ScoreTrajectory` component renders a static 3-point SVG path connecting Month 1, Month 2, and Month 3 scores. No D3, no Recharts.

---

## Sequencing Overview (Actual)

```
Tier 0  Close out revamp blockers                        -- DONE
Tier 1  Schema proposal -> contract freeze ->            -- DONE (GF-1 through GF-7)
        route + core UI + status-quo comparison
        (fixture-backed)
Tier 2  Interactive UI (cascade, discover) +             -- DONE (GF-8 through GF-14)
        analytics instrumentation + share/forward
Tier 3  Governance normalization + governance UI          -- DONE (fixture-backed: GF-16 through GF-20)
        Real data integration                            -- REMAINING (GF-15, GF-21)
Tier 4  Brochure polish                                  -- Backlog
```

---

## Tier 0 -- Close Out Revamp Blockers -- DONE

All shipped. Tests pass.

| Roadmap PR | Title | Status |
|-----------|-------|--------|
| #22 | Dedicated Audit Kit page | ✅ done |
| #23 | E2E smoke tests + link integrity (Playwright) | ✅ done |

---

## Tier 1 -- Golden Flows Foundation -- DONE

### GF-1: Contract B + C Schema Proposal -- DONE

15 JSON schemas authored and committed:

**Contract B (8 schemas in `schemas/golden-flows/contract-b/`):**
- `artifact_links.schema.json`
- `cascade_data.schema.json`
- `discover_insights.schema.json`
- `executive_questions.schema.json`
- `hook_metrics.schema.json`
- `screenshot_manifest.schema.json`
- `trajectory.schema.json`
- `vertical_narrative.schema.json`

**Contract C (7 schemas in `schemas/golden-flows/contract-c/`):**
- `approval_status.schema.json`
- `business_events.schema.json`
- `cascade_governance.schema.json`
- `feedback_threads.schema.json`
- `published_docs.schema.json`
- `review_context.schema.json`
- `trust_badges.schema.json`

TypeScript types generated from schemas in `src/types/golden-flows/` (separate `contract-b/` and `contract-c/` directories plus an `index.ts` barrel export).

---

### GF-1.5: Contract Freeze Gate -- DONE (frozen 2026-03-15)

Freeze artifact committed at `docs/ai/CONTRACT_FREEZE_v1.md`. Records frozen schemas, effective date, field ownership, and v2 change process.

---

### GF-2: Fixture Data -- DONE

All 5 verticals have complete data in `public/golden-flows/`:

| Vertical | Directory | Payloads |
|----------|-----------|----------|
| Fintech | `fintech-gf/` | All Contract B payloads + board_report + audit_report + dashboard-preview |
| SaaS | `saas/` | All Contract B payloads + board_report + audit_report + dashboard-preview |
| Hospital | `hospital/` | All Contract B payloads + board_report + audit_report + dashboard-preview |
| Retail | `retail/` | All Contract B payloads + board_report + audit_report + dashboard-preview |
| Real Estate | `real-estate/` | All Contract B payloads + board_report + audit_report + dashboard-preview |

Each vertical directory contains: `trajectory.json`, `cascade_data.json`, `discover_insights.json`, `executive_questions.json`, `hook_metrics.json`, `artifact_links.json`, `screenshot_manifest.json`, `vertical_narrative.json`, `board_report.json`, `audit_report.md`, `dashboard-preview.png`.

Governance data in `public/golden-flows/governance/`: `approval_status.json`, `business_events.json`, `cascade_governance.json`, `feedback_threads.json`, `review_context.json`, `trust_badges.json`.

**Note:** Legacy directories `fintech/` and `real_estate/` also exist in `public/golden-flows/` (older naming convention, untracked).

---

### GF-3: Route + Layout Shell -- DONE

- Hub at `/consulting/explore` (currently redirects to `/consulting/explore/fintech-gf`)
- Dynamic route at `/consulting/explore/[vertical]/page.tsx` with `generateStaticParams()` for 5 verticals
- Per-vertical OG metadata via `generateMetadata()`
- Explore layout at `/consulting/explore/layout.tsx`
- Rollout state env var support via `src/lib/flags.ts`
- Static data loader in `src/lib/golden-flows.ts` with `public/` -> `fixtures/` fallback

---

### GF-4: Vertical Selector Cards -- DONE

- `VerticalSelector` component renders all 5 vertical cards
- `VerticalSelectorCard` displays hook metric, consequence, and trust cue per vertical
- Cards rendered from `hook_metrics.json` data
- Selection navigates to `/consulting/explore/[vertical]`
- Responsive layout (horizontal row desktop, stacked mobile)

---

### GF-5: Vertical Landing + Inline Trajectory -- DONE

- `VerticalHero` component with score trajectory, board report integration, narrative data
- `ScoreTrajectory` renders a static 3-point SVG trajectory (Month 1 -> Month 2 -> Month 3)
- Board report data integrated into hero section
- Vertical narrative content displayed
- Hook metrics shown via `MetricCard` / `MetricCardsGrid`
- Functional CTA present from this tier onward

---

### GF-6: Status Quo vs. BayesIQ Comparison -- DONE

- `RealityReveal` component shows key metrics + top risks from board report data
- `StatusQuoComparison` and `BayesIQDifference` components provide before/after framing
- `RemediationArc` shows the remediation journey
- Per-vertical content, grounded in fixture data

---

### GF-7: CTA Sections -- DONE

- `GoldenFlowsCTA` component with vertical-specific copy
- Reuses existing CTA patterns
- Renders at the bottom of each vertical's content

---

## Tier 2 -- Interactive UI -- DONE

All built against fixture data.

### GF-8: Ask Buttons -- DONE

- `AskButtons` component renders executive questions per vertical from `executive_questions.json`
- `AskAndCascadeSection` integrates questions with cascade viewer
- Flagship question visually differentiated

---

### GF-9/10: Cascade Viewer (Collapsed + Expandable Timeline) -- DONE

- `CascadeViewer` renders collapsed answer-first view for each question
- `CascadeCard` with expandable timeline showing correction chain
- Information hierarchy: answer first, detail on demand
- Mobile-friendly accordion pattern

---

### GF-11: Artifact Diff Cards -- DONE

- `DashboardScreenshot` component for artifact preview images
- `DashboardGrid` with screenshot previews and board report data
- Side-by-side layout on desktop, stacked on mobile

---

### GF-12: Discover Panel -- DONE

- `DiscoverInsights` component renders insight cards per vertical from `discover_insights.json`
- Question-framed insights linking to relevant context
- Visual weight subordinate to cascade viewer (hierarchy preserved)

---

### GF-13: Analytics Instrumentation -- DONE

- `src/lib/gf-analytics.ts` defines golden flows analytics events
- `VerticalClickTracker` component tracks vertical selection
- Events: `gf_vertical_click`, `gf_question_click`, `gf_cascade_expand`, `gf_artifact_click`, `gf_discover_click`, `gf_share_link`, `gf_cta_click`
- Integrated with Vercel Analytics

---

### GF-14: Share/Forward Optimization -- DONE (partial)

- Per-vertical OG metadata implemented via `generateMetadata()` in the dynamic route
- Summary text optimized for Slack/email forwarding
- Canonical URLs set per vertical page

**Remaining:** Per-vertical OG image generation (programmatic images not yet implemented).

---

## Tier 3 -- Governance UI + Real Data Integration

Governance UI components are **built and tested** using fixture/demo data. Real data integration from upstream repos is the remaining work.

### Contract C Normalization -- DONE

`src/lib/governance.ts` implements the full normalization layer:

- Ingests all 6 Contract C payload types (approval status, feedback threads, trust badges, cascade governance, review context, business events)
- Indexed Maps for fast lookup by finding ID
- Coherence validation across payloads
- Memoized for performance
- Client serialization helpers for React Server Components -> Client Components boundary
- Decision log serialization for the workflow tab

Components consume governance through this normalized API, never through raw JSON.

---

### GF-16: Governance Normalization Layer -- DONE (fixture-backed)

- `src/lib/governance.ts` fully implemented with typed API
- Normalization respects contract boundary rules (no new semantics beyond contract definitions)
- Coherence validation catches cross-payload ID mismatches

---

### GF-17: Feedback Thread Component -- DONE (fixture-backed)

- `FeedbackThread` + `FeedbackThreadList` components
- Renders feedback as conversations with reviewer attribution
- Unit tests in `src/components/golden-flows/__tests__/FeedbackThread.test.tsx` and `FeedbackThreadList.test.tsx`

---

### GF-18: Trust Micro-Badges -- DONE (fixture-backed)

- `TrustBadge` component with approval status (pending/approved/rejected)
- `TrustSummaryBar` aggregates trust status across findings
- `GovernanceTrustBadge` integrates with governance detail panel
- Unit tests in `src/components/golden-flows/__tests__/TrustBadge.test.tsx` and `TrustSummaryBar.test.tsx`

---

### GF-19: Governance Detail Panel -- DONE (fixture-backed)

- `GovernanceDetailPanel` shows full governance chain (approval history, reviewer comments, timestamps)
- `GovernanceDetailProvider` provides React context for governance state
- Serialization for client components (server -> client data boundary)
- Unit tests in `src/components/golden-flows/__tests__/GovernanceDetailPanel.test.tsx` and `GovernanceDetailProvider.test.tsx`

---

### GF-20: Business-Event Preview Panel -- DONE (fixture-backed)

- `BusinessEventPreview` + `BusinessEventList` components
- Shows business events (metric redefinition, restatement) flowing through the system
- Preview vs. approved state visually differentiated
- Unit tests in `src/components/golden-flows/__tests__/BusinessEventPreview.test.tsx` and `BusinessEventList.test.tsx`

---

### Additional Governance Components Built

Beyond the planned GF-16 through GF-20 scope:

- `DecisionLog` -- renders decision history in the workflow tab
- `GovernanceProgressBar` -- visualizes governance completion status
- `WorkflowStatusBar` -- shows workflow stage
- `ReportPreview` -- renders board report data in the report tab

---

### Vertical Page Layout (As Built)

The `/consulting/explore/[vertical]` page assembles all tiers into a complete experience:

1. **Framing copy** + vertical selector (VerticalSelector)
2. **VerticalHero** -- score trajectory, board report, narrative, hook metrics
3. **RealityReveal** -- key metrics + top risks
4. **Tabbed interface** via `VerticalTabs`:
   - **Dashboard tab:** `DashboardGrid` with board report, snapshots, screenshots
   - **Report tab:** `ReportPreview` with board report data
   - **Workflow tab:** Governance with `DecisionLog` + `GovernanceProgressBar`
5. **Deliverables bar** -- live dashboard link + audit report
6. **GoldenFlowsCTA** -- vertical-specific conversion CTA

---

### PR#GF-15: Ingest Real Contract B Payloads + Semantic Validation -- NOT STARTED

**Depends on:** DAK-GF-5.6 (payload export from data-audit-kit)

**Scope:**
- Replace demo data with production Contract B JSON
- Validate payloads against frozen schemas
- Reconcile any drift per the drift policy
- Build-time schema validation in CI
- Semantic integration review

**Semantic validation checklist:**
- [ ] Cross-payload ID coherence: every `finding_id` in `cascade_data.json` exists in the Contract B finding index
- [ ] Snapshot/date coherence: trajectory months match snapshot `as_of_date` values
- [ ] Hook metric coherence: selector card hook metrics are grounded in the same findings shown in cascades
- [ ] Artifact link coherence: every `artifact_id` in cascade steps maps to a real screenshot in the manifest
- [ ] Question-to-cascade coherence: every `question_id` in `executive_questions.json` has a matching cascade in `cascade_data.json`
- [ ] Narrative coherence: vertical narrative claims match the data

**Exit criteria:**
- All Contract B payloads load from real data
- Schema validation passes in CI
- Semantic validation passes for all 5 verticals
- Any drift reconciled per policy
- No fixture data in production build

---

### PR#GF-21: Status Quo Comparison Refinement (Real Narrative Data) -- NOT STARTED

**Depends on:** Vertical narratives from DAK-GF-5.3 (content authoring)

**Scope:**
- Replace fixture-derived status-quo copy with real vertical narratives
- Ensure claims are grounded in real audit data
- Update any numbers that changed between fixture and real data
- Reconcile per drift policy

**Exit criteria:**
- Status-quo comparison uses real narrative content
- All claims traceable to real audit findings

---

### Fixture/Schema Drift Policy

When real data arrives and mismatches fixture assumptions:

- **Schema mismatch** (real data doesn't validate against frozen v1 schema): requires a **contract version review** -- update the freeze artifact to v2 with cross-repo sign-off. No silent schema mutation.
- **Semantic mismatch without schema break** (data validates but UI assumptions were wrong): requires **fixture correction** and UI review.
- **No silent mutation of fixture shapes** once real integration begins.

---

## Tier 4 -- Brochure Polish (Backlog)

Deferred until Golden Flows ships with real data. These improve the existing site but don't contribute to the commercial demo.

| Item | Notes |
|------|-------|
| Case studies quality refresh | Revisit after Golden Flows proves the conversion model |
| Metadata / SEO alignment | Low urgency if Golden Flows is primary traffic driver |
| Industry pages decision | Currently at `/consulting/industries` -- evaluate whether to redirect to golden-flows verticals, coexist, or merge |

---

## Cross-Repo Coordination

### Contract Governance Model

The website proposes consumer-facing schemas. Upstream co-ratifies. The contract is jointly owned.

```
biq_website (proposes schemas)
    |
bayesiq-data-audit-kit (reviews Contract B for production-fit)
bayesiq platform (reviews Contract C for governance semantics)
    |
Joint freeze -> v1 committed in all three repos
    -> freeze artifact: docs/ai/CONTRACT_FREEZE_v1.md
    |
Upstream validates exports against schemas in their CI
Website validates ingested payloads against schemas at build time
    |
Post-freeze changes require version bump + cross-repo review
```

### Cross-Repo Contracts This Repo Consumes

#### Contract B: `data-audit-kit` -> `biq_website` (build-time static)

| Payload | Format | Status |
|---------|--------|--------|
| `executive_questions.json` | Per vertical | Schema frozen, fixture data in place |
| `discover_insights.json` | Per vertical | Schema frozen, fixture data in place |
| `cascade_data.json` | Per vertical, keyed by `question_id` | Schema frozen, fixture data in place |
| `trajectory.json` | Per vertical, monthly scores | Schema frozen, fixture data in place |
| `screenshot_manifest.json` | Per vertical | Schema frozen, fixture data in place |
| `artifact_links.json` | Per vertical | Schema frozen, fixture data in place |
| `hook_metrics.json` | Per vertical | Schema frozen, fixture data in place |
| `vertical_narrative.json` | Per vertical | Schema frozen, fixture data in place |

**Additional payloads** (not in original Contract B schema set but present in vertical data):
- `board_report.json` -- per vertical, board-level report data
- `audit_report.md` -- per vertical, full audit report markdown
- `dashboard-preview.png` -- per vertical, dashboard screenshot

#### Contract C: `bayesiq` -> `biq_website` (build-time static)

| Payload | Schema | Status |
|---------|--------|--------|
| Approval metadata | `approval_status.schema.json` | Schema frozen, governance.ts ingests |
| Feedback threads | `feedback_threads.schema.json` | Schema frozen, governance.ts ingests |
| Business-event governance | `business_events.schema.json` | Schema frozen, governance.ts ingests |
| Trust badge summaries | `trust_badges.schema.json` | Schema frozen, governance.ts ingests |
| Review context blocks | `review_context.schema.json` | Schema frozen, governance.ts ingests |
| Cascade governance overlay | `cascade_governance.schema.json` | Schema frozen, governance.ts ingests |

All payloads use `schema_version`, `payload_type`, and `generated_at`. TypeScript types generated from versioned JSON schemas.

### Execution Timeline (Actual)

```
Weeks 1-2:   Tier 0 (revamp blockers)                     -- DONE
Weeks 2-4:   GF-1 (schema proposals) + GF-1.5 (freeze)   -- DONE (frozen 2026-03-15)
Weeks 4-6:   GF-2 (fixtures) + GF-3 (route shell)        -- DONE
Weeks 6-8:   GF-4 through GF-7 (Tier 1 core UI)          -- DONE
Weeks 8-10:  GF-8 through GF-14 (Tier 2 interactive UI)   -- DONE
Weeks 10-12: GF-16 through GF-20 (Tier 3 governance UI)   -- DONE (fixture-backed)
Ongoing:     GF-15, GF-21 (real data integration)          -- WAITING on upstream
```

---

## Exit Criteria (Full Phase 5)

Golden Flows is done when:

**Product criteria:**
- [x] `/consulting/explore/[vertical]` renders 5 verticals (currently fixture-backed)
- [x] Executive scan mode works: card -> score -> finding -> consequence -> CTA in one scroll
- [x] Executive questions render with cascade drill-down
- [x] Cascade expands to show correction timeline with artifact links
- [x] Discover panel shows supplementary insights per vertical
- [x] Trust badges and governance detail visible on relevant surfaces
- [x] Feedback threads render as conversations
- [x] Business-event previews show system response to metric changes
- [x] Status quo comparison rendered per vertical
- [ ] All verticals backed by real production data (not fixtures)
- [ ] Status quo comparison grounded in real narrative data

**Technical criteria:**
- [x] Analytics instrumentation tracking all conversion signals
- [x] Per-vertical OG metadata for share/forward in Slack/email
- [x] All E2E tests pass including golden-flows routes
- [x] Governance normalization layer in use (no raw JSON consumption)
- [x] Component unit tests for governance UI (8 test files)
- [ ] Per-vertical OG image generation (programmatic images)
- [ ] Semantic validation passes for all verticals with real data
- [ ] Page performance: Lighthouse >= 90

**Intermediate launch milestone (hidden-mode prospect readiness):**
- [x] All 5 verticals render with fixture data
- [x] Pages can be shared via direct URL
- [ ] Backed by real data (not fixtures) for prospect-facing credibility

**Full completion criteria:**
- [ ] All 5 verticals backed by real production data
- [ ] All verticals marked `ready` in manifest before `live` rollout state

---

## Open Questions

1. **Hub page behavior:** Currently `/consulting/explore` redirects to `/consulting/explore/fintech-gf`. Should this become a proper hub/index page showing all vertical selector cards instead?
2. **Industry page fate:** Do `/consulting/industries` (healthcare + fintech combined) merge into golden-flows verticals, coexist for SEO, or redirect? Decide after Golden Flows has real data.
3. **Per-vertical OG images:** Programmatic OG image generation is not yet implemented. Decide priority based on share/forward usage patterns.
4. **Real data timeline:** GF-15 (Contract B real data) and GF-21 (real narrative data) depend on upstream repos. No ETA yet.

---

# Phase 5A -- Server-Side Audit Pipeline (Deferred)

> **De-prioritized per roadmap feedback.** This is valuable but not the fastest path to signed work. Focus on client acquisition pages first. Revisit when the site is generating qualified leads.

Goal: run the real audit kit pipeline on the website. Users drop a CSV and get a scored report with real quality checks -- without installing anything.

**Depends on:** Audit Kit Phase 3.8 (module interface manifests, return envelope standardization) -- **dependency satisfied** (Phase 3.8 complete).

### Key Outcomes

- **API route** (`/api/audit`) -- accepts CSV upload (<=5MB), runs audit pipeline server-side, returns JSON
- **Full playground upgrade** -- replace client-side profiler with real audit kit output:
  - 12+ quality checks (not just column profiling)
  - Scored report (0-100 rubric)
  - Severity-ranked findings with root causes and fix recommendations
- **Results page** -- interactive display of findings, score gauge, severity breakdown

### Technical Approach

Option A: **Python serverless function on Vercel** -- fast to ship but limited by function timeout.
Option B: **Separate Python API** -- more robust, supports larger files.
Option C: **WASM/Pyodide** -- run audit kit in browser. Limited by browser memory.

Recommendation: Start with Option A for files under 5MB.

### Exit Criteria

- User can drop a CSV on the website and see a scored audit report (0-100) with findings
- Quality checks match what `run_audit.py` produces locally
- Response time < 30s for files under 5MB

---

# Phase 5B -- Downloads, Limits, and Polish (Deferred)

> **De-prioritized per roadmap feedback.** Depends on 5A and is not on the client acquisition critical path.

Goal: complete the server-side audit experience with downloadable artifact bundles, rate limiting, and packaging.

**Depends on:** Phase 5A complete.

### Key Outcomes

- Artifact download (audit_report.md, dbt_project, dashboard, ASSUMPTIONS.md, METRICS.md)
- Rate limiting (free tier: 1 audit/day, 5MB max; engagement clients: unlimited via API key)
- Error handling for timeouts, oversized files, malformed CSVs
- Free vs paid entitlement gating

### Exit Criteria

- Download includes dbt project and Streamlit dashboard
- Rate limiting prevents abuse
- Clear error messaging for edge cases
- Free/paid boundary is explicit and tested

---

# Phase 6 -- Conversational Audit (Deferred)

> **De-prioritized per roadmap feedback.** Conversational UX is not the fastest path to signed work.

Goal: add chat-based interaction to the audit experience. Users ask questions about their data, approve column interpretations, refine metric definitions.

**Depends on:** Phase 5 (server-side pipeline), Audit Kit Phase 4, Platform orchestration layer.

### Key Outcomes

- Chat interface on the site (Next.js, not Streamlit)
- Context-aware conversations with full audit profile
- Column role approval, metric intent capture, finding drill-down
- Assumption sign-off, session persistence, streaming responses

### Exit Criteria

- Multi-turn conversation about uploaded data
- Column role decisions reflected in generated dashboard
- Metric intent changes dashboard layout and finding priority
- Session persists across page reloads

---

# Phase 7 -- Hosted Dashboards & Self-Service (Deferred)

> **De-prioritized per roadmap feedback.** Self-serve SaaS should not be a near-term website priority until services revenue justifies it.

Goal: hosted, shareable dashboard URLs. Full self-service product experience.

**Depends on:** Phase 6, Audit Kit Phase 5, Platform multi-tenant support.

### Key Outcomes

- Hosted Streamlit dashboards at shareable URLs
- User accounts, subscription tiers
- Team sharing, continuous monitoring
- Warehouse connections (Snowflake/BigQuery)

### Exit Criteria

- User can sign up, upload CSV, share dashboard URL
- Dashboards persist beyond session
- At least one paying subscriber on self-service tier

---

# Architecture Snapshot

```
bayesiq-website/
├── docs/
│   ├── product/                    # source of truth (human-owned)
│   │   ├── company_overview.md
│   │   ├── company_tagline.md
│   │   ├── brand.md
│   │   ├── services.md
│   │   ├── problems.md
│   │   └── engagement_model.md
│   └── ai/                         # pipeline docs
│       ├── ROADMAP.md              # this file
│       ├── ARCH_STATE.md
│       ├── CONTRACT_FREEZE_v1.md   # contract freeze artifact (2026-03-15)
│       └── pr_markdown_plans/
├── schemas/
│   └── golden-flows/
│       ├── contract-b/             # 8 Contract B JSON schemas
│       ├── contract-c/             # 7 Contract C JSON schemas
│       └── README.md
├── src/
│   ├── app/                        # Next.js routes
│   │   ├── layout.tsx              # root layout (analytics, fonts, metadata)
│   │   ├── page.tsx                # homepage
│   │   ├── opengraph-image.tsx     # default OG image
│   │   ├── globals.css             # global styles + bayesiq color scale
│   │   ├── consulting/
│   │   │   ├── page.tsx            # audit-first consulting
│   │   │   ├── case-studies/page.tsx
│   │   │   ├── industries/page.tsx # healthcare + fintech
│   │   │   ├── sample-report/page.tsx
│   │   │   └── explore/
│   │   │       ├── layout.tsx      # golden flows layout
│   │   │       ├── page.tsx        # hub (redirects to fintech-gf)
│   │   │       └── [vertical]/page.tsx  # per-vertical SSG
│   │   ├── platform/page.tsx
│   │   ├── assessment/page.tsx     # data quality self-assessment
│   │   ├── contact/page.tsx        # contact form + Calendly
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── Header.tsx              # client component, sticky nav
│   │   ├── Footer.tsx
│   │   ├── CTA.tsx
│   │   ├── ContactForm.tsx         # client component
│   │   ├── CalendlyEmbed.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── BeforeAfterSplit.tsx
│   │   ├── ContactContextCTA.tsx
│   │   ├── GovernanceChain.tsx
│   │   ├── InlineEvidence.tsx
│   │   ├── PathCard.tsx
│   │   ├── ProofStrip.tsx
│   │   ├── SectionReveal.tsx
│   │   ├── StatCounter.tsx
│   │   ├── assessment/             # assessment tool components
│   │   ├── consulting/             # consulting page components
│   │   ├── platform/               # platform page components
│   │   └── golden-flows/           # 34 golden-flows components
│   │       ├── VerticalSelector.tsx
│   │       ├── VerticalSelectorCard.tsx
│   │       ├── VerticalClickTracker.tsx
│   │       ├── VerticalHero.tsx
│   │       ├── VerticalLanding.tsx
│   │       ├── VerticalTabs.tsx
│   │       ├── ScoreTrajectory.tsx
│   │       ├── MetricCard.tsx
│   │       ├── MetricCardsGrid.tsx
│   │       ├── AskButtons.tsx
│   │       ├── AskAndCascadeSection.tsx
│   │       ├── CascadeCard.tsx
│   │       ├── CascadeViewer.tsx
│   │       ├── DashboardGrid.tsx
│   │       ├── DashboardScreenshot.tsx
│   │       ├── DiscoverInsights.tsx
│   │       ├── RealityReveal.tsx
│   │       ├── StatusQuoComparison.tsx
│   │       ├── BayesIQDifference.tsx
│   │       ├── RemediationArc.tsx
│   │       ├── ReportPreview.tsx
│   │       ├── DecisionLog.tsx
│   │       ├── GovernanceProgressBar.tsx
│   │       ├── GovernanceTrustBadge.tsx
│   │       ├── GovernanceDetailPanel.tsx
│   │       ├── GovernanceDetailProvider.tsx
│   │       ├── TrustBadge.tsx
│   │       ├── TrustSummaryBar.tsx
│   │       ├── WorkflowStatusBar.tsx
│   │       ├── FeedbackThread.tsx
│   │       ├── FeedbackThreadList.tsx
│   │       ├── BusinessEventPreview.tsx
│   │       ├── BusinessEventList.tsx
│   │       ├── GoldenFlowsCTA.tsx
│   │       └── __tests__/          # 8 component test files
│   ├── lib/
│   │   ├── golden-flows.ts         # static data loader (public/ -> fixtures/ fallback)
│   │   ├── governance.ts           # Contract C normalization layer
│   │   ├── gf-analytics.ts         # golden flows analytics events
│   │   ├── golden-flows-ui.ts      # UI helper utilities
│   │   ├── flags.ts                # feature flags / rollout state
│   │   ├── industry-data.ts        # industry page data
│   │   └── __tests__/
│   │       └── governance.spec.ts  # governance normalization tests
│   ├── types/
│   │   └── golden-flows/
│   │       ├── contract-b/         # TS types from Contract B schemas
│   │       ├── contract-c/         # TS types from Contract C schemas
│   │       └── index.ts            # barrel export
│   └── vendor/
│       └── biq/
│           ├── tokens.css          # design system tokens
│           └── tailwind-v4-theme.css  # Tailwind v4 theme integration
├── public/
│   └── golden-flows/
│       ├── fintech-gf/             # all Contract B payloads + board report
│       ├── saas/
│       ├── hospital/
│       ├── retail/
│       ├── real-estate/
│       └── governance/             # Contract C payloads (shared across verticals)
├── e2e/                             # Playwright E2E tests
│   ├── smoke.spec.ts
│   ├── links.spec.ts
│   ├── json-ld.spec.ts
│   ├── golden-flows.spec.ts
│   ├── governance-detail.spec.ts
│   ├── visual-qa.spec.ts
│   ├── a11y-check.spec.ts
│   └── fixtures/
├── next.config.mjs                  # redirects + security headers
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

### Design System

- **Vendor tokens:** `src/vendor/biq/tokens.css` + `src/vendor/biq/tailwind-v4-theme.css`
- **Site-specific color scale:** `bayesiq-{50..900}` grays in `globals.css` for dark sections
- **Semantic tokens:** `biq-primary`, `biq-text-primary/secondary/muted`, `biq-surface-1/2`, `biq-border`, `biq-status-{error,warning,success}`
- Clean, minimal -- Stripe/Linear/Vercel aesthetic
- Mobile-first responsive
- No stock photos

### Test Coverage

| Suite | Type | Files | Notes |
|-------|------|-------|-------|
| `e2e/smoke.spec.ts` | E2E | Playwright | All routes return 200, titles present |
| `e2e/links.spec.ts` | E2E | Playwright | Internal link integrity |
| `e2e/json-ld.spec.ts` | E2E | Playwright | Structured data validation |
| `e2e/golden-flows.spec.ts` | E2E | Playwright | Golden flows page rendering |
| `e2e/governance-detail.spec.ts` | E2E | Playwright | Governance panel interaction |
| `e2e/visual-qa.spec.ts` | E2E | Playwright | Visual regression checks |
| `e2e/a11y-check.spec.ts` | E2E | Playwright | Accessibility validation |
| `src/lib/__tests__/governance.spec.ts` | Unit | Vitest | Governance normalization logic |
| `src/components/golden-flows/__tests__/*.test.tsx` | Unit | Vitest | 8 component test files (GovernanceDetailPanel, GovernanceDetailProvider, TrustBadge, TrustSummaryBar, FeedbackThread, FeedbackThreadList, BusinessEventPreview, BusinessEventList) |

80 tests passing. 3 known failures are contact page timeouts (unrelated to golden flows).

---

# Open GitHub Issues

| Issue | Title | Status |
|-------|-------|--------|
| #83 | Visual-QA retrofit | Open (cross-repo) |
| #80 | Replace placeholder favicon + OG image | Open |
| #79 | Connect contact form to Formspree | Open |
| #78 | EngagementTiers badge uses bayesiq-900 accent | Open |
| #77 | Migrate dark CTA sections to DS dark surface tokens | Open |
| #50 | Golden Flows governance data | Open (cross-repo, depends on DAK) |
