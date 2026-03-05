# Sample Report — BayesIQ Audit Deliverable

**Related docs:** [services.md](./services.md) · [engagement_model.md](./engagement_model.md)

---

## Purpose & Positioning

This page shows prospects exactly what they receive at the end of a BayesIQ engagement. The goal is to convert high-intent visitors by demonstrating the specificity and depth of the deliverable — before they commit to a conversation.

Target audience: data leads, analytics engineers, and engineering managers who want to evaluate BayesIQ based on output quality, not just brand claims.

Positioning hook: "See what you get before you sign anything."

---

## Page Sections

### 1. Hero

**Headline:** See what a BayesIQ audit looks like.

**Subhead:** Every engagement ends with a severity-ranked findings report, a root-cause analysis, and a phased remediation plan. Here's an anonymized example from a real-world data quality audit.

**Primary CTA:** Start Your Audit → `/contact`

**Secondary CTA:** See our services → `/services`

---

### 2. What's Included (Deliverables)

Every BayesIQ Data Quality Audit delivers:

- **Severity-ranked findings report** — Every confirmed issue ranked Critical, High, Medium, or Low, with root cause analysis and a specific fix recommendation.
- **Executive summary** — A one-page narrative for leadership: what we found, what it means for the business, and what to do first.
- **Technical findings detail** — Full field-level evidence for the engineering team: event names, property names, transformation steps, and SQL/code pointers where applicable.
- **Phased remediation plan** — Issues grouped into three fix phases (Immediate / Short-term / Long-term) with estimated effort and expected impact.
- **Engagement timeline summary** — A record of what we did, when, and what access was used — useful for internal postmortems and compliance.

---

### 3. Severity Rubric

We rank every finding before it reaches you. Severity is determined by business impact (how much does this mislead decisions?) and blast radius (how many downstream metrics or reports does this affect?).

| Severity | Definition | Typical action |
|----------|-----------|----------------|
| **Critical** | Metric or event is systematically wrong; decisions made on this data are likely incorrect. | Fix before next reporting cycle. |
| **High** | Significant inaccuracy or gap affecting a key metric; risk of misleading product or business decisions. | Fix within 2–4 weeks. |
| **Medium** | Partial data loss or inconsistency; metric is directionally correct but unreliable for precise decisions. | Schedule in next sprint. |
| **Low** | Minor discrepancy, edge-case gap, or spec drift; negligible business impact at current scale. | Track and address opportunistically. |

---

### 4. Example Findings Table

The following table is an anonymized excerpt from a Data Quality Audit for a B2B SaaS product team (approximately 50 M events/month). Finding IDs, event names, and property names have been changed.

| ID | Severity | Area | Finding | Root Cause | Recommended Fix |
|----|----------|------|---------|-----------|-----------------|
| F-01 | Critical | Telemetry | `checkout_completed` fires on payment attempt, not on payment confirmation. Revenue metric double-counts abandoned checkouts. | Client-side event triggered before async confirmation callback resolves. | Move event dispatch into confirmation callback; backfill last 90 days using server-side order records. |
| F-02 | High | Telemetry | `user_id` is null for ~18% of `page_view` events in mobile web sessions. | Anonymous session handling does not wait for identity resolution before firing the event. | Delay event dispatch by 300 ms post-load or use a queue that flushes after identity resolves. |
| F-03 | High | Pipeline | `revenue_daily` table excludes refunds issued after the original transaction date. Net revenue is overstated by an average of 4.2% month-over-month. | JOIN condition uses `transaction_date` instead of `event_date` for the refund table, silently dropping late refunds. | Update JOIN key to `refund_issued_date`; re-run historical aggregation for the trailing 12 months. |
| F-04 | Medium | Metrics | `activation_rate` metric definition counts any `feature_used` event, but the product definition requires three distinct features used within the first 7 days. | Metric query was written before the activation definition was finalized and was never updated. | Rewrite metric query to match current definition; add a test that checks the query against the spec document. |
| F-05 | Medium | Telemetry | `experiment_viewed` event fires once per session even when a user sees the experiment multiple times. Impression counts are understated. | Deduplication logic uses session ID instead of a (session_id, timestamp) composite key. | Update deduplication key; note that historical impression data cannot be corrected. |
| F-06 | Low | Schema | `device_type` property sends raw user-agent strings on Android Chrome, enumerated values on all other clients. | Inconsistent client library versions across platforms. | Standardize on enumerated values; add schema validation rule to catch raw user-agent strings. |

---

### 5. Sample Remediation Plan

Findings are grouped into three phases based on business impact and engineering effort.

**Phase 1 — Immediate (fix within 2 weeks)**

1. Fix `checkout_completed` event trigger timing and move dispatch to server-side confirmation callback (F-01).
2. Backfill revenue metric using server-side order records for the trailing 90 days (F-01).
3. Patch `user_id` identity resolution on mobile web sessions (F-02).

**Phase 2 — Short-term (fix within 4–6 weeks)**

4. Correct the `revenue_daily` table JOIN condition and re-run trailing 12-month aggregation (F-03).
5. Rewrite `activation_rate` metric query to match current product definition and add a spec-aligned test (F-04).

**Phase 3 — Long-term (schedule within one quarter)**

6. Update `experiment_viewed` deduplication key and document the limitation on historical data (F-05).
7. Standardize `device_type` property across platforms and add schema validation (F-06).

---

### 6. Engagement Timeline

A standard Data Quality Audit runs 7–10 business days from kickoff to final report delivery.

| Phase | Timeline | What happens |
|-------|----------|-------------|
| Discovery | Day 1–2 | Kickoff call, architecture review, access setup, logging spec collection. |
| Automated Scan | Day 3–5 | AI agents scan telemetry, pipelines, and metric definitions. Read-only access. No production changes. |
| Expert Review | Day 5–7 | Data scientists interpret findings, eliminate false positives, assess severity, and identify root causes. |
| Report Delivery | Day 7–10 | Severity-ranked findings report, remediation plan, and executive summary delivered. Findings review call included. |
| Implementation Support | Optional | Pair with your engineers to implement fixes, set up validation tests, or handle the hardest root causes. |

---

### 7. FAQ

**What access do you need?**
Read-only access to your data warehouse or analytics environment, your logging specification (even an informal one), and documentation or code for the pipelines you want audited. We do not need production credentials or write access at any point.

**How do you handle sensitive data?**
We work with anonymized or de-identified data wherever possible. When real user data is required for analysis, we operate under a signed NDA and follow your organization's data handling policies. We never retain client data after an engagement closes.

**What if we don't have a formal logging spec?**
That's common. We can reconstruct an implied spec from your existing dashboards, queries, and event schemas — and the gap between the implied spec and reality is often where the most valuable findings are.

**How many findings should we expect?**
It varies by system maturity, but most first-time audits surface 8–15 confirmed issues. The example above (6 findings) is on the lower end for a system that has received some prior attention. We've found over 30 distinct issues in systems with years of accumulated tech debt.

**Can you audit just one part of our data stack?**
Yes. You can scope the engagement to a specific product area, a specific pipeline, or a specific set of metrics. Narrower scope means faster turnaround and lower cost.

**What do we get if we find nothing?**
If we complete the audit and find no material issues, you receive a clean bill of health — a written summary confirming what we checked and what we found. That document is itself valuable for internal compliance and stakeholder confidence.

---

### 8. Closing CTA

**Headline:** Ready to see what's wrong with your data?

**Body:** Most teams have at least a few Critical or High issues they don't know about. Book a free data health check and we'll tell you where to look.

**CTA button:** Start Your Audit → `/contact`

---

## Alignment Notes

- Severity definitions are consistent with the deliverables described in [services.md](./services.md) ("severity-ranked issue report with root cause analysis").
- Engagement timeline phases match the six-step model in [engagement_model.md](./engagement_model.md) exactly (Discovery → Automated Scan → Expert Review → Findings & Fix Plan → Implementation Support → Monitoring Setup).
- "1–2 week" timeframe cited on this page matches services.md format description ("1–2 week engagement").
- Example findings are fully anonymized — no real client names, company names, or identifying details.
