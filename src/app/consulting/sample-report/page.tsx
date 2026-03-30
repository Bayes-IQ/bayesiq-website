import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Sample Audit Report",
  description:
    "See what the BayesIQ Audit Kit actually produces: scored findings, dataset profiles, dbt projects, Streamlit dashboards, and machine-readable quality checks.",
  openGraph: {
    title: "Sample Audit Report — BayesIQ",
    description:
      "See what the BayesIQ Audit Kit actually produces: scored findings, dataset profiles, dbt projects, Streamlit dashboards, and machine-readable quality checks.",
  },
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const artifacts = [
  {
    file: "audit_report.md",
    description:
      "Scored findings with severity, root cause, evidence, and fix recommendations. Every issue is tied to a specific event, column, or query.",
  },
  {
    file: "dataset_profile.json",
    description:
      "Column-level profiling for every table: data types, null rates, cardinality, top values, and distribution summaries.",
  },
  {
    file: "quality_checks.json",
    description:
      "Machine-readable findings for integration into CI pipelines, alerting systems, or internal dashboards.",
  },
  {
    file: "ASSUMPTIONS.md",
    description:
      "Data contracts documenting schema assumptions, quality expectations, temporal patterns, and entity relationships. Your team signs off before we build.",
  },
  {
    file: "METRICS.md",
    description:
      "Metric definitions with exact formulas, source events, dimensions, granularity, and validation rules.",
  },
  {
    file: "dbt project",
    description:
      "Complete dbt project with staging models, mart models, schema tests, and source definitions. Ready to deploy to your warehouse.",
  },
  {
    file: "Streamlit dashboard",
    description:
      "Interactive app with sidebar filters, time series charts, dimension breakdowns, and a data quality summary. Usable from day one.",
  },
  {
    file: "canonicalization_mapping.json",
    description:
      "Naming inconsistencies across platforms and pipelines mapped to canonical forms. Feed it into your dbt project or ETL layer.",
  },
];

const findings = [
  {
    id: "F-01",
    severity: "Critical",
    severityColor: "text-biq-status-error bg-biq-status-error-subtle",
    finding:
      "checkout_completed fires on payment attempt, not payment confirmation — 23% funnel inflation.",
    rootCause:
      "Client-side event triggered before async confirmation callback resolves.",
    fix: "Move event dispatch into confirmation callback; backfill last 90 days using server-side order records.",
  },
  {
    id: "F-02",
    severity: "High",
    severityColor: "text-orange-700 bg-orange-50",
    finding:
      "user_id null in 18% of mobile web page_view events.",
    rootCause:
      "Anonymous session handling does not wait for identity resolution before firing the event.",
    fix: "Delay event dispatch by 300 ms post-load or use a queue that flushes after identity resolves.",
  },
  {
    id: "F-03",
    severity: "High",
    severityColor: "text-orange-700 bg-orange-50",
    finding:
      "revenue_daily excludes late refunds processed after midnight UTC. Net revenue overstated by ~4.2% month-over-month.",
    rootCause:
      "JOIN condition uses transaction_date instead of event_date for the refund table, silently dropping late refunds.",
    fix: "Update JOIN key to refund_issued_date; re-run historical aggregation for the trailing 12 months.",
  },
  {
    id: "F-04",
    severity: "Medium",
    severityColor: "text-yellow-700 bg-yellow-50",
    finding:
      "activation_rate query doesn\u2019t match current definition — stale WHERE clause counts any feature_used event instead of three distinct features within 7 days.",
    rootCause:
      "Metric query was written before the activation definition was finalized and was never updated.",
    fix: "Rewrite metric query to match current definition; add a test that checks the query against the spec document.",
  },
  {
    id: "F-05",
    severity: "Medium",
    severityColor: "text-yellow-700 bg-yellow-50",
    finding:
      "experiment_viewed deduplicates by session instead of timestamp. Impression counts understated.",
    rootCause:
      "Deduplication logic uses session ID instead of a (session_id, timestamp) composite key.",
    fix: "Update deduplication key; note that historical impression data cannot be corrected.",
  },
  {
    id: "F-06",
    severity: "Low",
    severityColor: "text-biq-text-secondary bg-biq-surface-1",
    finding:
      "device_type inconsistent across platforms — iOS sends \"iPhone\", Android sends \"ios\", web sends \"iOS\".",
    rootCause: "Inconsistent client library versions across platforms.",
    fix: "Standardize on enumerated values; add schema validation rule to catch raw user-agent strings.",
  },
];

const scoringRubric = [
  {
    range: "90\u2013100",
    label: "Strong",
    color: "text-biq-status-success bg-biq-status-success-subtle border-biq-status-success-subtle",
    description: "Minor issues only. Data infrastructure is well-maintained and trustworthy.",
  },
  {
    range: "70\u201389",
    label: "Needs Work",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    description:
      "Significant issues requiring attention. Key metrics may be directionally correct but unreliable for precise decisions.",
  },
  {
    range: "0\u201369",
    label: "At Risk",
    color: "text-biq-status-error bg-biq-status-error-subtle border-biq-status-error-subtle",
    description:
      "Critical issues affecting key metrics. Decisions based on this data are likely incorrect.",
  },
];

const severityDefinitions = [
  {
    level: "Critical",
    color: "text-biq-status-error bg-biq-status-error-subtle border-biq-status-error-subtle",
    definition:
      "Metric is systematically wrong. Decisions made on this data are likely incorrect.",
    action: "Fix before next reporting cycle.",
  },
  {
    level: "High",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    definition:
      "Significant inaccuracy in a key metric. Risk of misleading product or business decisions.",
    action: "Fix in 2\u20134 weeks.",
  },
  {
    level: "Medium",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    definition:
      "Partial data loss or inconsistency. Metric is directionally correct but unreliable for precise decisions.",
    action: "Schedule in next sprint.",
  },
  {
    level: "Low",
    color: "text-biq-text-secondary bg-biq-surface-1 border-biq-border",
    definition:
      "Minor discrepancy or edge-case gap. Negligible business impact at current scale.",
    action: "Address opportunistically.",
  },
];

const timelineSteps = [
  {
    phase: "Ingest + Automated Pipeline + Expert Review",
    timeline: "Week 1\u20132",
    description:
      "Architecture review, access setup, logging spec collection. Automated pipeline profiles every table and column, flags anomalies, and generates scored findings. Data scientists review results, eliminate false positives, and assess root causes.",
  },
  {
    phase: "Assumptions Sign-off + Metric Specification",
    timeline: "Week 3\u20134",
    description:
      "ASSUMPTIONS.md and METRICS.md delivered. Your team reviews data contracts and metric definitions \u2014 this is the alignment gate. Nothing gets built until both sides agree on what the data should look like.",
  },
  {
    phase: "dbt Build + Dashboards + Training",
    timeline: "Week 5\u20136",
    description:
      "Auto-generated dbt project with staging/mart models and schema tests. Interactive Streamlit dashboards built on validated metrics. Handoff session with your team covering the dbt project, dashboard usage, and ongoing monitoring.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const sampleReportJsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "BayesIQ Sample Audit Report",
  description: "Example scored audit report showing findings, severity rankings, and remediation plan from the BayesIQ Audit Kit.",
  publisher: { "@type": "Organization", name: "BayesIQ", url: "https://bayes-iq.com" },
};

export default function SampleReportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sampleReportJsonLd) }}
      />
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-biq-text-primary md:text-5xl">
            What you get from a BayesIQ audit
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-biq-text-secondary">
            Real artifacts from a real audit &mdash; not a PDF of
            recommendations. The Audit Kit produces scored findings,
            column-level profiles, data contracts, metric specs, a deployable
            dbt project, and interactive dashboards.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-biq-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-biq-primary-hover"
            >
              Start Your Audit
            </Link>
            <Link
              href="/consulting/explore"
              className="text-sm font-medium text-biq-text-secondary transition-colors hover:text-biq-text-primary"
            >
              Explore a live engagement &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Artifacts Overview                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-biq-border bg-biq-surface-1 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-biq-text-primary">
            Pipeline artifacts
          </h2>
          <p className="mt-3 text-base text-biq-text-secondary">
            Every audit produces these files. They land in your repo or shared
            drive &mdash; no proprietary portal required.
          </p>
          <ul className="mt-8 space-y-6">
            {artifacts.map((a) => (
              <li key={a.file} className="flex gap-4">
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full bg-biq-text-muted"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-biq-text-primary">
                    <code className="rounded bg-biq-surface-2 px-1.5 py-0.5 font-mono text-xs">
                      {a.file}
                    </code>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-biq-text-secondary">
                    {a.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Example Findings                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-biq-text-primary">
            Example findings from{" "}
            <code className="rounded bg-biq-surface-2 px-1.5 py-0.5 font-mono text-xl">
              audit_report.md
            </code>
          </h2>
          <p className="mt-3 text-base text-biq-text-secondary">
            Anonymized excerpt from an Audit Kit run on a B2B SaaS product
            (~50 M events/month). Finding IDs, event names, and property names
            have been changed.
          </p>
          <div className="mt-8 space-y-6">
            {findings.map((f) => (
              <div
                key={f.id}
                className="rounded-lg border border-biq-border bg-biq-surface-0 p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-biq-text-muted">
                    {f.id}
                  </span>
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${f.severityColor}`}
                  >
                    {f.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium leading-relaxed text-biq-text-primary">
                  {f.finding}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-biq-text-muted">
                      Root Cause
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-biq-text-secondary">
                      {f.rootCause}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-biq-text-muted">
                      Recommended Fix
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-biq-text-secondary">
                      {f.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Scoring Rubric                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-biq-border bg-biq-surface-1 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-biq-text-primary">
            Scoring rubric (0&ndash;100)
          </h2>
          <p className="mt-3 text-base text-biq-text-secondary">
            Every audit produces an overall health score. The score reflects the
            count, severity, and blast radius of confirmed issues.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-biq-border">
                  <th
                    scope="col"
                    className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-biq-text-muted"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-biq-text-muted"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium uppercase tracking-wider text-biq-text-muted"
                  >
                    What it means
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-biq-border-subtle">
                {scoringRubric.map((row) => (
                  <tr key={row.label}>
                    <td className="py-3 pr-6 align-top font-mono text-sm text-biq-text-secondary">
                      {row.range}
                    </td>
                    <td className="py-3 pr-6 align-top">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${row.color}`}
                      >
                        {row.label}
                      </span>
                    </td>
                    <td className="py-3 align-top leading-relaxed text-biq-text-secondary">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Severity Definitions                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-biq-text-primary">
            Severity definitions
          </h2>
          <p className="mt-3 text-base text-biq-text-secondary">
            Every finding is ranked by business impact and blast radius &mdash;
            how many downstream metrics or reports does this affect?
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-biq-border">
                  <th
                    scope="col"
                    className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-biq-text-muted"
                  >
                    Severity
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-biq-text-muted"
                  >
                    Definition
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium uppercase tracking-wider text-biq-text-muted"
                  >
                    Typical action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-biq-border-subtle">
                {severityDefinitions.map((row) => (
                  <tr key={row.level}>
                    <td className="py-3 pr-6 align-top">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${row.color}`}
                      >
                        {row.level}
                      </span>
                    </td>
                    <td className="py-3 pr-6 align-top leading-relaxed text-biq-text-secondary">
                      {row.definition}
                    </td>
                    <td className="py-3 align-top text-biq-text-secondary">
                      {row.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Engagement Timeline                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-biq-border bg-biq-surface-1 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-biq-text-primary">
            Engagement timeline &mdash; 6 weeks
          </h2>
          <p className="mt-3 text-base text-biq-text-secondary">
            A full engagement runs 6 weeks from kickoff to validated dashboards.
            Diagnostic sprints deliver findings in 1 week.
          </p>
          <div className="mt-10 space-y-8">
            {timelineSteps.map((step, index) => (
              <div key={step.phase} className="flex gap-6">
                <div className="flex shrink-0 flex-col items-center">
                  <span className="text-sm font-bold text-biq-text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-base font-semibold text-biq-text-primary">
                      {step.phase}
                    </h3>
                    <span className="text-xs text-biq-text-muted">
                      {step.timeline}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-biq-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                               */}
      {/* ---------------------------------------------------------------- */}
      <CTA
        headline="See it on your data"
        description="Drop a CSV in the playground for instant profiling, or book a diagnostic sprint."
      />
    </>
  );
}
