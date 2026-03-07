# BayesIQ Engagement Model

## Self-Serve: CSV Playground (Free)

Drop a CSV on bayesiq.com/playground. Get instant column profiling and a downloadable Streamlit dashboard app. No account, no data uploaded — everything runs in your browser.

**What you get:** Column types, null rates, cardinality, top values, auto-generated Streamlit app with filters and charts.

---

## Tier 1: Metric Reliability Diagnostic ($7.5K–$10K, 1 week)

**Prove where the problems are.** The automated pipeline runs against your data (CSV, Parquet, or Snowflake connection). An expert reviews findings, eliminates false positives, and delivers a scored readout.

**What we need from you:** Dataset export or warehouse read-only access. 1 hour for context.

**What you get:**
- Scorecard (0-100) with severity-weighted rubric
- Severity-ranked findings with root causes and fix recommendations
- Executive summary for leadership
- 30-minute readout call

**Economics:** ~4 hours manual work + automated pipeline. Near-pure margin.

---

## Tier 2: Audit + Plan (~$25K, 4 weeks)

**Define what correct should be.** Full diagnostic plus structured documentation and remediation planning.

**Week 1-2:** Discovery + automated scan + expert review
**Week 3-4:** Assumptions sign-off + metric specification + remediation roadmap

**What you get:**
- Everything in Tier 1
- ASSUMPTIONS.md — data contracts with team sign-off
- METRICS.md — metric definitions, formulas, dimensional cuts
- dbt project skeleton (staging models, source definitions)
- Phased remediation plan (Immediate / Short-term / Long-term)

---

## Tier 3: Full Implementation ($30K–$45K, 6 weeks)

**Ship the governed fix path.** Complete build from warehouse to validated dashboards.

**Week 1-2:** Discovery + automated scan + expert review
**Week 3-4:** Assumptions sign-off + metric specification
**Week 5-6:** dbt build + dashboards + training

**What you get:**
- Everything in Tier 2
- Production dbt project with 40+ automated tests
- Staging models with canonicalization and deduplication
- Mart models for each defined metric
- Interactive Streamlit dashboards with dimensional breakdowns
- Architecture documentation
- Team training on maintaining the governed metric layer

---

## Optional: Continuous Monitoring ($2–5K/month)

For teams that completed an implementation and want ongoing validation. Automated checks run continuously, alerting on drift, telemetry gaps, and metric inconsistencies.

**What you get:** Monitoring agent configuration, alerting rules, drift detection baselines, incident runbook.
