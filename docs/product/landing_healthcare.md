# Healthcare Landing Page — Source of Truth

## Purpose

This document defines the authoritative messaging for the `/healthcare` landing page. The page TSX implementation must be derived from this document. Any copy changes should originate here first.

---

## Target Persona

**Primary:** Head of Data / Director of Analytics at a health system, hospital network, payer, or digital health company.

**Secondary:** Data Platform Lead, Product Analytics Manager, or Data Engineering Lead at a healthcare technology company (EHR, patient engagement, telehealth, care coordination).

**Situation:** The persona is responsible for analytics infrastructure that feeds both internal decision-making (clinical operations, utilization, outcomes) and external reporting obligations (CMS quality measures, payer contracts, accreditation bodies). They have limited trust in their own pipelines and limited time to investigate why the numbers don't reconcile.

---

## Primary Pains

1. **Clinical metrics that don't reconcile.** EMR data says one thing; the analytics dashboard says another. Patient volume, readmission rates, and outcome metrics diverge across systems — and nobody can explain why.

2. **Regulatory reporting built on unvalidated pipelines.** Quality measures for CMS, Joint Commission, or payer contracts are computed from pipelines that haven't been audited. If the source data has gaps, the reports inherit them.

3. **Telemetry gaps in patient-facing digital tools.** Patient portals, scheduling apps, and telehealth platforms emit events — but required fields are missing, sessions aren't stitched, and engagement metrics are unreliable.

4. **Pipeline failures discovered by stakeholders, not alerts.** A clinical operations lead notices a dashboard is stale or a report doesn't match last month's format. The data team finds out from a Slack message, not a monitoring alert.

5. **Compliance constraints on data access slow debugging.** PHI access controls create friction. Debugging a broken pipeline is harder when you can't freely query the underlying data to trace the problem.

---

## What BayesIQ Does (Mapped to Existing Services)

### Data Quality Audit — applied to healthcare data systems
- Evaluate clinical metric pipelines end-to-end: EMR extracts, warehouse transformations, dashboard queries.
- Identify schema drift in HL7/FHIR event structures and encounter-based data models.
- Surface discrepancies between source-system figures and downstream reporting.
- Deliver severity-ranked findings with root cause analysis for each confirmed issue.

### Telemetry & Logging Validation — applied to patient-facing digital products
- Compare logging specification for patient portal/telehealth apps against what actually fires in production.
- Identify missing fields, unsent events, broken session stitching.
- Validate that engagement and activation metrics reflect real patient behavior.

### Analytics Pipeline Design — applied to healthcare data infrastructure
- Review or redesign ETL pipelines for clinical data, payer data feeds, or operational reporting.
- Define reliable metric definitions with explicit business logic aligned to clinical context.
- Recommend testing and validation strategies appropriate for healthcare data sensitivity.

---

## What "Success" Looks Like (Measurable Outcomes)

- Regulatory reports reconcile to source-system figures within an acceptable margin — and the team can explain any remaining difference.
- Clinical dashboards reflect confirmed, validated metrics rather than unverified aggregations.
- Patient-facing product telemetry passes field-coverage validation before new features ship.
- Pipeline failures surface via automated alerts, not stakeholder complaints.
- The data team can trace any metric back to its source with confidence.

---

## How We Work with Healthcare Organizations

### No PHI access required
Most data quality issues are structural — schema drift, null fields, broken joins — not content problems. We audit the shape and completeness of data, not the clinical content. We don't need PHI access for the majority of our work.

### Read-only, async engagement
We work from read-only access to your warehouse or aggregated exports. No production changes, no standing access, no disruption to clinical workflows.

### Healthcare-aware audit framework
We understand HL7/FHIR event structures, EMR-to-warehouse pipelines, and the specific ways clinical data drifts. Our audit framework accounts for encounter-based data models, not just SaaS product event streams.

### Compliance and risk support
Our work can improve the auditability and traceability of your analytics pipelines, helping reduce risk around regulatory reporting. We support your compliance posture — we do not provide legal, regulatory, or compliance guarantees.

---

## Trust and Proof Points

- BayesIQ lists healthcare systems among its ideal client types (see company_overview.md).
- Our engagement model is designed for regulated environments: read-only access, async-first, no PHI requirement.
- We deliver severity-ranked findings within 1–2 weeks, enabling teams to act before the next reporting cycle.
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
- **Context:** Used in the closing section or compliance/risk section as a low-commitment entry point.

### Approach Link
- **Label:** "See how our engagements work"
- **Route:** `/approach`
- **Context:** Used in engagement model section to avoid duplicating the full approach content.

---

## Page Structure (Reference for TSX Implementation)

1. **Hero** — Industry label ("Healthcare"), headline, subhead, primary + secondary CTAs.
2. **Problems section** — "Why telemetry fails in healthcare" — 4–5 specific pains.
3. **What we deliver section** — Mapped to existing services (Audit, Telemetry Validation, Pipeline Design).
4. **Engagement model mini-section** — Brief description + link to `/approach`.
5. **Compliance & risk section** — Careful language: support, reduce risk, improve auditability. No legal guarantees.
6. **Closing CTA block** — Primary CTA + optional tertiary CTA.

---

## Copy Constraints

- Use "support," "reduce risk," "improve auditability," and "help trace" — not "ensure compliance," "guarantee," or "certify."
- Do not name specific clients or fabricate quantified results.
- Do not introduce services not present in `docs/product/services.md`.
- Avoid copying Services page intros verbatim; use healthcare-specific framing throughout.
