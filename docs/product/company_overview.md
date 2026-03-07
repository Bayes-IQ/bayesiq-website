# BayesIQ — Company Overview

## What BayesIQ Does

BayesIQ builds **automated data audit tooling that finds broken metrics and broken pipelines fast, then delivers the fix path**.

We ship two products:

1. **BayesIQ Data Audit Kit** — an automated data quality audit pipeline that profiles any dataset, detects issues, validates metrics, and generates production-ready dbt projects and Streamlit dashboards.

2. **BayesIQ Platform** — a safe, extensible execution environment for automating real-world tasks. A tool registry with policy enforcement, approval gates, and audit trails — designed for teams that need deterministic, auditable automation.

Both products are built on the same principle: **data systems should be tested and validated like code**.

---

## The Problem

Most companies assume their data is correct.

In practice, analytics systems suffer from hidden issues:

* Metrics that drift from their intended definitions
* Telemetry events logged incorrectly or incompletely
* ETL pipelines that break silently or degrade over time
* Business dashboards built on inconsistent or incomplete data
* No structured way to detect or diagnose these failures

These problems remain invisible until a business decision fails or an analytics project breaks. Traditional approaches rely on manual debugging — slow, expensive, and impossible to scale.

---

## Products

### BayesIQ Data Audit Kit

An automated pipeline that takes any CSV, Parquet, or Snowflake connection and produces:

* **Column-level profiling** — types, nulls, cardinality, distributions, min/max, top values
* **12+ quality checks** — duplicates, naming inconsistencies, schema drift, timestamp gaps, null spikes, out-of-range values, near-duplicate rows
* **Metric validation** — recompute reported KPIs from raw data and flag discrepancies
* **Scored audit report** — 0-100 rubric with severity-ranked findings and remediation plan
* **dbt project** — staging models, mart models, 40+ schema tests, source definitions
* **Streamlit dashboard** — interactive charts, sidebar filters, dimensional breakdowns, data quality summary
* **Documentation** — ASSUMPTIONS.md (data contracts) and METRICS.md (metric definitions)
* **LLM-powered interpretation** — Claude API for resolving ambiguous columns

Tested on SaaS events, financial transactions, IoT sensor data, CRM exports, and healthcare records.

### BayesIQ Platform

A personal assistant operating system with built-in safety:

* **Tool Registry** — dynamically discovers tools from JSON manifests. Each tool defines its mode (read-only, draft, execute-gated), handler, and I/O schemas.
* **Policy Engine** — YAML-based role configuration. Tool-specific overrides, parameter caps, allowlists.
* **Approval Gateway** — single execution entry point. All actions flow through schema validation, policy check, and optional human approval before execution.
* **Audit Trail** — append-only event log, immutable tool run records, credential redaction.
* **Built-in Tools** — Google Calendar, GitHub (draft PRs), Sonos control, personal memory, notifications, data operations (SQL, ETL planning, QA checks), pipeline orchestration.

Designed for teams and individuals who need automation with deterministic boundaries — every action logged, every dangerous operation gated.

---

## Engagement Model

BayesIQ offers the Data Audit Kit through tiered engagements:

| Tier | Price | Duration | What You Get |
|------|-------|----------|-------------|
| Diagnostic Sprint | $7.5K–$10K | 1 week | Automated scorecard + expert readout |
| Audit + Plan | ~$25K | 4 weeks | Full findings + assumptions doc + remediation roadmap + dbt scaffolding |
| Full Implementation | $30K–$45K | 6 weeks | Everything above + dbt build + dashboards + training |

The Audit Kit also powers a **self-serve playground** where anyone can drop a CSV and get an instant profile + downloadable Streamlit app.

---

## Ideal Clients

* Mid-sized companies ($15M–$75M revenue) with 1-5 data engineers
* SaaS teams with telemetry distrust or KPI disputes
* Companies preparing for board meetings, fundraises, or M&A
* Healthcare organizations building clinical analytics
* Fintech teams with transaction pipeline complexity
* Anyone who just hired a VP/Head of Data and needs a baseline

---

## Long-Term Vision

BayesIQ is building toward continuous, automated data validation — where every metric is tested, every pipeline is monitored, and data reliability is infrastructure, not a project.

The Data Audit Kit is the diagnostic entry point. The Platform is the execution layer. Together, they compress expert data quality work from weeks of manual effort into hours of automated pipeline + human interpretation.
