# BayesIQ Products & Services

## Product 1: BayesIQ Data Audit Kit

**What it is:** An automated, domain-agnostic data quality audit pipeline.

**Input:** Any CSV, Parquet file, or Snowflake connection.

**What it does:**

### Schema Profiling
Column-level analysis: data types, null rates, cardinality, value distributions, min/max ranges, top values, datetime ranges. Auto-detects column roles (identifier, timestamp, category, measure, freetext).

### Quality Checks (12+)
- Exact and near-duplicate row detection
- Key column nullness and uniqueness validation
- Inconsistent naming conventions (mixed casing → canonical form)
- Future timestamps and timestamp gap detection
- Negative value detection in non-negative fields
- Schema drift (missing columns, unexpected values, unexpected nulls)
- Out-of-range value detection

### Metric Validation
Recomputes reported KPI values from raw event data. Supports count, ratio, and sum formulas. Flags discrepancies between what's reported and what the data actually shows.

### Report Generation
Severity-weighted scoring (0-100) with rubric-based deductions. Executive scorecard, remediation plan with effort estimates, business impact descriptions. Findings ranked Critical/High/Medium/Low.

### dbt Project Generation
Generated dbt project:
- Staging models with type casting, canonicalization, deduplication
- Mart models for each metric definition
- Schema tests (uniqueness, not_null, accepted_values)
- Source definitions from contract

### Dashboard Generation
Self-contained Streamlit app:
- Loads raw data with canonicalization and dedup applied
- Sidebar filters for all categorical columns + date range
- One chart section per metric with dimensional breakdowns
- Data quality summary tab
- Raw data explorer

### Documentation Generation
- ASSUMPTIONS.md — schema, quality, temporal, and entity assumptions
- METRICS.md — metric definitions, known discrepancies, dimensional cuts
- LLM-powered interpretation of ambiguous columns (Claude API)

---

## Product 2: BayesIQ Platform

**What it is:** A safe, extensible execution environment for automating real-world tasks.

**Architecture:** Three-layer model — Tool Registry → Policy Engine → Gateway.

### Tool Registry
- Dynamic discovery from JSON manifests
- Each tool: name, execution mode, handler function, I/O JSON schemas
- Handler purity enforced (no backdoor imports, deterministic boundaries)

### Policy Engine
- YAML-based role configuration (admin/user profiles)
- Tool-specific overrides (volume caps, allowed rooms, repo allowlists)
- Execution modes: read_only, draft, execute_gated

### Approval Gateway
- Single entry point for all tool execution
- Flow: Registry → Schema Validation → Policy → Approval Check → Execution → Output Validation → Logging
- Resumable execution for gated operations

### Built-in Tools
- Google Calendar (read-only agenda)
- GitHub (draft PRs, issue/PR listing, repo info)
- Sonos (volume, playback — approval gated with volume caps)
- Personal Memory (read/write knowledge base)
- Notifications (email/webhook — gated)
- Data Operations (SQL queries, logging validation, ETL planning, QA checks)
- Pipeline Orchestration (code generation task pipelines)

### Safety & Observability
- Append-only event log for full audit trail
- Credential isolation with log redaction
- Immutable tool run records
- Structured logging with per-tool latency metrics

---

## Engagement Tiers (Data Audit Kit)

### Metric Reliability Diagnostic — $7.5K–$10K, 1 week
Run the automated pipeline on your data. Expert reviews findings, eliminates false positives, delivers scored readout. Near-pure margin with pipeline automation.

**You get:** Scorecard (0-100), severity-ranked findings, executive summary, 30-minute readout call.

### Audit + Plan — ~$25K, 4 weeks
Full diagnostic plus data assumptions document, metric specification, remediation roadmap, and dbt scaffolding.

**You get:** Everything in Diagnostic + ASSUMPTIONS.md sign-off + METRICS.md + dbt project skeleton + phased fix plan.

### Full Implementation — $30K–$45K, 6 weeks
Complete build from warehouse to validated dashboards.

**You get:** Everything in Audit + Plan + production dbt project (40+ tests) + Streamlit dashboards + architecture documentation + team training.

### Self-Serve Playground — Free
Drop a CSV on the website. Instant profiling + downloadable Streamlit app. No account required.
