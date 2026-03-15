import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Audit Kit",
  description:
    "Drop a CSV, get a scored audit, a dbt project, and a Streamlit dashboard. 12+ automated quality checks, severity-weighted scoring, and production-ready artifacts.",
  openGraph: {
    title: "Audit Kit — BayesIQ",
    description:
      "Drop a CSV, get a scored audit, a dbt project, and a Streamlit dashboard. 12+ automated quality checks with production-ready output.",
  },
};

const auditKitJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "BayesIQ Data Audit Kit",
  description:
    "An automated data quality audit pipeline that scores any dataset on a 0–100 rubric and generates production-ready artifacts including dbt projects, Streamlit dashboards, and documentation.",
  brand: {
    "@type": "Organization",
    name: "BayesIQ",
    url: "https://bayes-iq.com",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0",
    highPrice: "45000",
    offerCount: "4",
  },
};

const pipelineStages = [
  {
    step: "01",
    title: "Schema Profiling",
    desc: "Column-level analysis — data types, null rates, cardinality, value distributions, min/max ranges, datetime spans. Auto-detects column roles: identifier, timestamp, category, measure, freetext.",
  },
  {
    step: "02",
    title: "Quality Checks",
    desc: "12+ automated checks run against your data — duplicates, schema drift, null spikes, naming conventions, timestamp gaps, near-duplicates, negative values, and more. Every finding is severity-ranked.",
  },
  {
    step: "03",
    title: "Metric Validation",
    desc: "Recomputes your reported KPI values from raw event data. Supports count, ratio, and sum formulas. Flags discrepancies between what's reported and what the data actually shows.",
  },
  {
    step: "04",
    title: "Report Generation",
    desc: "Severity-weighted scoring on a 0–100 rubric. Executive scorecard, remediation plan with effort estimates, business impact descriptions. Findings ranked Critical, High, Medium, or Low.",
  },
  {
    step: "05",
    title: "dbt Project Generation",
    desc: "A complete dbt project — staging models with type casting and deduplication, mart models for each metric, 40+ schema tests (uniqueness, not_null, accepted_values), and source definitions.",
  },
  {
    step: "06",
    title: "Dashboard & Documentation",
    desc: "A self-contained Streamlit app with sidebar filters, metric charts, and a data quality tab. Plus ASSUMPTIONS.md and METRICS.md documenting every decision and known discrepancy.",
  },
];

const qualityChecks = [
  {
    name: "Duplicate Rows",
    description: "Exact duplicate row detection across all columns.",
  },
  {
    name: "Near-Duplicate Rows",
    description:
      "Rows identical on all fields except key columns — catches copy-paste and merge artifacts.",
  },
  {
    name: "Null Key",
    description:
      "Null values in key/identifier columns that should never be empty.",
  },
  {
    name: "Duplicate Key",
    description:
      "Duplicate values in columns that should be unique identifiers.",
  },
  {
    name: "Missing Key Column",
    description: "Expected key columns not present in the dataset.",
  },
  {
    name: "Inconsistent Naming",
    description:
      "Mixed casing and formats in categorical columns — User_Login vs user_login vs USER_LOGIN.",
  },
  {
    name: "Future Timestamps",
    description:
      "Timestamps dated in the future — catches clock skew, test data leaks, and timezone errors.",
  },
  {
    name: "Timestamp Gaps",
    description:
      "Large gaps between consecutive events — flags missing data, pipeline outages, or ingestion failures.",
  },
  {
    name: "Negative Values",
    description:
      "Unexpected negatives in columns that should be non-negative — revenue, counts, durations.",
  },
  {
    name: "Schema Drift — Missing Columns",
    description:
      "Expected columns missing from the dataset compared to the contract specification.",
  },
  {
    name: "Schema Drift — Unexpected Values",
    description: "Values that don't match the contract's allowed set.",
  },
  {
    name: "Schema Drift — Required Nulls",
    description: "Required fields with null values that violate the contract.",
  },
];

const deliverables = [
  {
    title: "Scored Audit Report",
    description:
      "0–100 quality score with severity-weighted deductions. Executive summary, finding details, and remediation priorities.",
  },
  {
    title: "dbt Project",
    description:
      "Staging models, mart models, 40+ schema tests, and source definitions. Ready to run dbt build.",
  },
  {
    title: "Streamlit Dashboard",
    description:
      "Interactive charts, sidebar filters, metric breakdowns, data quality summary, and raw data explorer.",
  },
  {
    title: "ASSUMPTIONS.md",
    description:
      "Schema, quality, temporal, and entity assumptions — documented for team sign-off before any fix work begins.",
  },
  {
    title: "METRICS.md",
    description:
      "Metric definitions, known discrepancies, dimensional cuts, and recomputation methodology.",
  },
];

const newCapabilities = [
  {
    title: "LLM-Powered Column Interpretation",
    description:
      "Claude API analyzes ambiguous columns — infers business meaning, suggests canonical names, and flags likely misuse.",
  },
  {
    title: "Contract-Based Schema Validation",
    description:
      "Define expected schemas as contracts. The pipeline validates incoming data against the contract and flags every drift.",
  },
  {
    title: "Multi-Format Ingestion",
    description:
      "CSV, Parquet, or Snowflake connection. No SDK, no config file — just point at data and go.",
  },
];

const playgroundEnabled =
  process.env.NEXT_PUBLIC_ENABLE_PLAYGROUND === "true";

export default function AuditKitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(auditKitJsonLd) }}
      />

      {/* Hero */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
            Drop a CSV. Get proof.
            <br />
            <span className="text-bayesiq-500">
              Scored audit, dbt project, dashboard.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
            The BayesIQ Audit Kit is the fastest path from raw data to
            actionable findings. 12+ automated quality checks, a 0–100
            reliability score, and production-ready artifacts — no contracts, no
            setup, no waiting.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {playgroundEnabled ? (
              <Link
                href="/playground"
                className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
              >
                Try It on a CSV
              </Link>
            ) : (
              <Link
                href="/contact"
                className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
              >
                Book a Demo
              </Link>
            )}
            <Link
              href="/contact"
              className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              Book a guided walkthrough &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6-Stage Pipeline */}
      <section
        id="pipeline"
        className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Six-stage audit pipeline
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Every audit follows the same path: raw data in, scored findings and
            production artifacts out.
          </p>
          <div className="mt-12 space-y-8">
            {pipelineStages.map((item) => (
              <div key={item.step} className="flex gap-6">
                <span className="text-2xl font-bold text-bayesiq-300">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-bayesiq-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-bayesiq-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 Quality Checks */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            12+ automated quality checks
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Every check produces severity-ranked findings. Critical issues
            deduct the most from your score — low-severity items are flagged but
            won&apos;t tank your rating.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qualityChecks.map((check) => (
              <div
                key={check.name}
                className="rounded-lg border border-bayesiq-200 bg-bayesiq-50 p-5"
              >
                <h3 className="text-sm font-bold text-bayesiq-900">
                  {check.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-bayesiq-600">
                  {check.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            What you get
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Every audit produces five artifacts. Download the bundle, run dbt
            build, launch the dashboard, ship to production.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-bayesiq-200 bg-white p-6"
              >
                <h3 className="text-base font-bold text-bayesiq-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Capabilities */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            New capabilities
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Recent additions to the Audit Kit pipeline.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {newCapabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-bayesiq-200 bg-bayesiq-50 p-6"
              >
                <h3 className="text-base font-bold text-bayesiq-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Reliability Score */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            The 0–100 reliability score
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-bayesiq-600">
            Every audit produces a single number that summarizes data health.
            The score starts at 100 and deducts points based on finding severity
            and volume.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-bayesiq-200 bg-white p-6">
              <h3 className="text-base font-bold text-bayesiq-900">
                What lowers the score
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-bayesiq-600">
                <li className="flex gap-2">
                  <span className="font-semibold text-red-600">Critical</span>
                  — Duplicate keys, missing key columns, required nulls
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-orange-500">High</span>
                  — Schema drift, metric discrepancies, future timestamps
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-yellow-600">Medium</span>
                  — Inconsistent naming, timestamp gaps, near-duplicates
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-bayesiq-400">Low</span>
                  — Minor formatting issues, optional field nulls
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">
              <h3 className="text-base font-bold text-bayesiq-900">
                What the score means
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-bayesiq-600">
                <li>
                  <span className="font-semibold text-bayesiq-900">
                    90–100:
                  </span>{" "}
                  Production-ready. Minor issues only.
                </li>
                <li>
                  <span className="font-semibold text-bayesiq-900">
                    70–89:
                  </span>{" "}
                  Usable with known caveats. Fix high-severity items first.
                </li>
                <li>
                  <span className="font-semibold text-bayesiq-900">
                    50–69:
                  </span>{" "}
                  Significant issues. Remediation required before production use.
                </li>
                <li>
                  <span className="font-semibold text-bayesiq-900">
                    Below 50:
                  </span>{" "}
                  Serious structural problems. Schema and key issues need
                  immediate attention.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Try It CTA */}
      <CTA
        headline="Your data has a score. Find out what it is."
        description={
          playgroundEnabled
            ? "Drop a CSV in the playground — free, instant, no account required. Or book a call to scope a full audit."
            : "Book a call to scope a full audit, or request a sample report to see what the Audit Kit produces."
        }
        buttonText={playgroundEnabled ? "Try the Playground" : "Book an Audit"}
        href={playgroundEnabled ? "/playground" : "/contact"}
      />
    </>
  );
}
