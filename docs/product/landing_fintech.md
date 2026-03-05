# Fintech Landing Page — Source of Truth

## Purpose

This document defines the authoritative messaging for the `/fintech` landing page. The page TSX implementation must be derived from this document. Any copy changes should originate here first.

---

## Target Persona

**Primary:** Head of Data / Director of Product Analytics at a fintech company (payments, lending, insurance, trading, crypto, neobank).

**Secondary:** Data Platform Lead, Analytics Engineering Manager, or VP of Engineering at a financial technology company where product metrics, revenue figures, and experiment results directly inform investment decisions and regulatory filings.

**Situation:** The persona manages pipelines where metric errors have material financial consequences — revenue discrepancies between product and finance, funnel conversion numbers that drive budget decisions, or experiment results that determine feature rollouts. They may also have compliance reporting obligations (transaction monitoring, SAR volumes, KYC rates) derived from the same pipelines as their product dashboards.

---

## Primary Pains

1. **Revenue metrics that don't match finance.** Product analytics shows one revenue number. Finance shows another. The difference is buried in currency conversion logic, refund handling, or events that count transactions the ledger doesn't recognize.

2. **Payment event telemetry with gaps.** Transaction events fire from multiple clients and payment processors. Required fields like `currency`, `payment_method`, or `transaction_id` are null more often than anyone realizes — 5%, 12%, sometimes 20% of rows — and nobody noticed because aggregations masked the gaps.

3. **Compliance reporting on unaudited pipelines.** Regulatory figures (SAR filing counts, transaction monitoring volumes, KYC completion rates) are built from the same pipelines as product dashboards. Schema drift in those pipelines means compliance numbers inherit the same errors as product metrics.

4. **A/B tests on corrupted baselines.** Duplicate checkout events, identity stitching gaps across web and mobile, and inconsistent funnel definitions mean experiment results are measured on baselines that don't represent reality.

5. **Risk scoring pipelines with unvalidated inputs.** Credit, fraud, or underwriting models consume features derived from transactional data. If the pipeline feeding those features has null-rate drift or schema changes, model performance degrades silently before the next monitoring cycle surfaces it.

---

## What BayesIQ Does (Mapped to Existing Services)

### Data Quality Audit — applied to fintech data systems
- Evaluate payment event pipelines, revenue metric definitions, and transaction data flows end-to-end.
- Identify schema drift in payment event schemas, currency handling, and settlement timing logic.
- Surface discrepancies between product analytics figures and finance/ledger totals.
- Deliver severity-ranked findings with root cause analysis — P0 issues (materially wrong metrics) typically surfaced within 48 hours.

### Telemetry & Logging Validation — applied to product event streams
- Compare logging specification for web, mobile, and payment processor events against what actually fires in production.
- Identify null fields on transaction records, duplicate events from retry logic, and identity stitching gaps across platforms.
- Validate that funnel and conversion metrics reflect real user behavior before A/B tests are run on top of them.

### Analytics Pipeline Design — applied to financial data infrastructure
- Review or redesign ETL pipelines for transaction data, revenue recognition logic, or risk model feature stores.
- Define reliable metric definitions with explicit business logic — especially for conversion funnels, cohort revenue, and compliance reporting tables.
- Recommend idempotency controls, settlement timing handling, and validation strategies appropriate for financial data.

---

## What "Success" Looks Like (Measurable Outcomes)

- Product revenue metrics reconcile to finance/ledger figures within an agreed tolerance — and the team can explain any remaining difference.
- Transaction event null rates are measured, baselined, and alerting when they exceed threshold.
- A/B test results are measured on validated, deduplicated baselines.
- Compliance reporting tables are traced back to audited source pipelines.
- Risk model feature pipelines have documented validation coverage and alerting on schema changes.

---

## How We Work with Fintech Teams

### Transaction-aware audit framework
We understand payment event schemas, multi-currency pipelines, and the specific ways financial data drifts. Our audits account for idempotency, settlement timing, and the gap between authorization and capture.

### Read-only, no PII or PAN required
Schema drift and null-rate analysis don't require access to cardholder data or PII. We audit the structure and completeness of events, not the content. Happy to work behind your VPN or with anonymized/tokenized exports.

### Fast turnaround for regulated environments
We deliver severity-ranked findings within 1–2 weeks. P0 issues — metrics that are materially wrong right now — are typically surfaced within 48 hours so teams can act before the next reporting cycle or board presentation.

### Compliance and risk support
Our work can improve the traceability and auditability of your financial reporting pipelines, helping reduce risk around regulatory reporting. We support your compliance posture — we do not provide legal, regulatory, or compliance guarantees.

---

## Trust and Proof Points

- BayesIQ lists fintech and crypto companies among its ideal client types (see company_overview.md).
- Our engagement model is designed for regulated environments: read-only access, async-first, no PII/PAN requirement.
- We deliver severity-ranked findings within 1–2 weeks with P0 escalation within 48 hours.
- Our approach is documented: structured auditing + AI-assisted analysis + expert interpretation (see approach page, engagement_model.md).

> Note: Do not invent specific client names, case study outcomes, or quantified results on this page. Use process and methodology as proof points until case studies are available.

---

## CTA Language and Routes

### Primary CTA
- **Label:** "Talk to us about your data"
- **Route:** `/contact`
- **Context:** Used in hero section and closing CTA block.

### Secondary CTA
- **Label:** "See a sample audit report"
- **Route:** `/sample-report`
- **Context:** Used in hero section alongside primary CTA. Route confirmed present.

### Tertiary CTA
- **Label:** "Take the self-assessment"
- **Route:** `/assessment`
- **Context:** Used in the closing section as a low-commitment entry point.

### Approach Link
- **Label:** "See how our engagements work"
- **Route:** `/approach`
- **Context:** Used in engagement model section to avoid duplicating the full approach content.

---

## Page Structure (Reference for TSX Implementation)

1. **Hero** — Industry label ("Fintech"), headline, subhead, primary + secondary CTAs.
2. **Problems section** — "Why financial data pipelines fail" — 4–5 specific pains.
3. **What we deliver section** — Mapped to existing services (Audit, Telemetry Validation, Pipeline Design).
4. **Engagement model mini-section** — Brief description + link to `/approach`.
5. **Compliance & risk section** — Careful language: support, reduce risk, improve auditability. No legal guarantees.
6. **Closing CTA block** — Primary CTA + optional tertiary CTA.

---

## Copy Constraints

- Use "support," "reduce risk," "improve auditability," and "help trace" — not "ensure compliance," "guarantee," or "certify."
- Do not name specific clients or fabricate quantified results.
- Do not introduce services not present in `docs/product/services.md`.
- Avoid copying Services page intros verbatim; use fintech-specific framing throughout.
- Carefully distinguish: we improve pipeline quality that can support compliance posture; we are not a compliance or regulatory advisory firm.
