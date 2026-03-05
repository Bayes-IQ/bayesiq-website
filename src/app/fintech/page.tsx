/**
 * Fintech landing page.
 * Industry-specific messaging for fintech data teams.
 * Derived from: docs/product/landing_fintech.md
 */

import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Fintech Data Auditing — BayesIQ",
  description:
    "BayesIQ helps fintech teams audit transaction analytics, validate payment telemetry, and fix the pipeline issues that make revenue metrics wrong.",
  openGraph: {
    title: "Fintech Data Auditing — BayesIQ",
    description:
      "BayesIQ helps fintech teams audit transaction analytics, validate payment telemetry, and fix the pipeline issues that make revenue metrics wrong.",
  },
};

const problems = [
  {
    title: "Revenue metrics that don't match finance",
    description:
      "Your product analytics show one revenue number. Finance shows another. The difference is buried in currency conversion logic, refund handling, or events that count transactions the ledger doesn't recognize.",
  },
  {
    title: "Payment event telemetry with gaps",
    description:
      "Transaction events fire from multiple clients and payment processors. Required fields like currency, payment_method, or transaction_id are null more often than anyone realizes — 5%, 12%, sometimes 20% of rows — and aggregations mask the gaps.",
  },
  {
    title: "Compliance reporting on unaudited pipelines",
    description:
      "Regulatory figures — SAR filing counts, transaction monitoring volumes, KYC completion rates — are built from the same pipelines as product dashboards. Schema drift in those pipelines means compliance numbers inherit the same errors as product metrics.",
  },
  {
    title: "A/B tests on corrupted baselines",
    description:
      "Duplicate checkout events, identity stitching gaps across web and mobile, and inconsistent funnel definitions mean experiment results are measured on baselines that don't represent reality.",
  },
  {
    title: "Risk scoring pipelines with unvalidated inputs",
    description:
      "Credit, fraud, and underwriting models consume features derived from transactional data. If the pipeline feeding those features has null-rate drift or schema changes, model performance degrades silently before the next monitoring cycle surfaces it.",
  },
];

const services = [
  {
    title: "Data Quality Audit",
    description:
      "End-to-end evaluation of payment event pipelines, revenue metric definitions, and transaction data flows. We identify schema drift in payment event schemas, surface discrepancies between product analytics and finance figures, and deliver severity-ranked findings — P0 issues typically surfaced within 48 hours.",
  },
  {
    title: "Telemetry & Logging Validation",
    description:
      "Compare your logging specification for web, mobile, and payment processor events against what actually fires in production. We identify null fields on transaction records, duplicate events from retry logic, and identity stitching gaps — so your funnel metrics are validated before you run experiments on top of them.",
  },
  {
    title: "End-to-End Pipeline & Dashboards",
    description:
      "We go from your warehouse to validated dashboards in 6 weeks. Auto-generated dbt models handle deduplication, currency normalization, and settlement timing. Interactive Streamlit dashboards give your team trustworthy revenue, fraud, and compliance metrics — with drift detection built in.",
  },
];

const workingModel = [
  {
    title: "Transaction-aware audit framework",
    description:
      "We understand payment event schemas, multi-currency pipelines, and the specific ways financial data drifts. Our audits account for idempotency, settlement timing, and the gap between authorization and capture.",
  },
  {
    title: "Read-only, no PII or PAN required",
    description:
      "Schema drift and null-rate analysis don't require access to cardholder data or PII. We audit the structure and completeness of events, not the content. We're happy to work behind your VPN or with anonymized and tokenized exports.",
  },
  {
    title: "Fast turnaround for regulated environments",
    description:
      "We deliver severity-ranked findings within 1–2 weeks. P0 issues — metrics that are materially wrong right now — are typically surfaced within 48 hours so you can act before the next reporting cycle or board presentation.",
  },
];

export default function FintechPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Fintech
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-bayesiq-900">
            When your transaction data is wrong, everything downstream is wrong.
          </h1>
          <p className="mt-6 text-lg text-bayesiq-600">
            Fintech teams build products on top of financial data — payments,
            lending, insurance, trading. The tolerance for error is lower than
            most industries, but the data pipelines are just as fragile. Schema
            drift in payment events, null fields on transaction records, and
            identity stitching gaps across platforms compound into metrics that
            are quietly, confidently wrong.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Talk to us about your data
            </Link>
            <Link
              href="/sample-report"
              className="rounded-lg border border-bayesiq-300 px-6 py-3 text-sm font-medium text-bayesiq-900 transition-colors hover:bg-bayesiq-50"
            >
              See a sample audit report
            </Link>
          </div>
        </div>
      </section>

      {/* Problems section */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            Why financial data pipelines fail
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            Fintech data pipelines break in ways that are hard to detect and
            expensive to discover late. These are the failure patterns we find
            most often.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {problems.map((problem) => (
              <div key={problem.title}>
                <h3 className="text-sm font-semibold text-bayesiq-900">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm text-bayesiq-600">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we deliver */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            What we deliver for fintech teams
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            Our services map directly to the data quality problems fintech teams
            face — applied with awareness of financial data structures,
            multi-currency pipelines, and compliance reporting requirements.
          </p>
          <div className="mt-10 space-y-8">
            {services.map((service) => (
              <div key={service.title}>
                <h3 className="text-sm font-semibold text-bayesiq-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-bayesiq-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/services"
              className="text-sm font-medium text-bayesiq-900 underline underline-offset-4 hover:text-bayesiq-600"
            >
              View full service descriptions
            </Link>
          </div>
        </div>
      </section>

      {/* Engagement model */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            How an engagement works
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            A diagnostic sprint runs 1 week and surfaces P0 issues within 48 hours.
            A full engagement runs 6 weeks — from warehouse connection to validated
            dashboards. We audit your data, align on assumptions and metric definitions
            with your team, then auto-generate the dbt project and interactive dashboards.
            Your team gets trustworthy numbers they can use for board decks, compliance
            reporting, and operational decisions.
          </p>
          <div className="mt-6">
            <Link
              href="/approach"
              className="text-sm font-medium text-bayesiq-900 underline underline-offset-4 hover:text-bayesiq-600"
            >
              See how our engagements work
            </Link>
          </div>
        </div>
      </section>

      {/* How we work with fintech teams */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            How we work with fintech teams
          </h2>
          <div className="mt-10 space-y-8">
            {workingModel.map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-semibold text-bayesiq-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-bayesiq-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & risk */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            Compliance and risk
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            Our work can improve the traceability and auditability of your
            financial reporting pipelines — helping reduce risk around regulatory
            reporting and supporting your compliance posture. We help you
            understand where your data comes from, whether it is complete, and
            where pipeline errors could be affecting figures that matter to
            regulators or auditors.
          </p>
          <p className="mt-4 text-sm text-bayesiq-500">
            We provide data quality analysis and pipeline auditing. We do not
            provide legal, regulatory, or compliance advisory services, and our
            work does not constitute a compliance certification or guarantee.
          </p>
          <div className="mt-6">
            <Link
              href="/assessment"
              className="text-sm font-medium text-bayesiq-900 underline underline-offset-4 hover:text-bayesiq-600"
            >
              Take the data quality self-assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <CTA
        headline="Let's audit your financial data pipeline."
        description="Send us your event schema or describe the metric discrepancy. We'll tell you what's likely broken and how long it takes to fix."
        buttonText="Get in Touch"
        href="/contact"
      />
    </>
  );
}
