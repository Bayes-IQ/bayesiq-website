/**
 * Fintech landing page.
 * Industry-specific messaging for fintech data teams.
 * Product focus: Audit Kit.
 */

import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Fintech Data Auditing — BayesIQ",
  description:
    "The BayesIQ Audit Kit helps fintech teams score transaction pipelines, validate revenue metrics, and surface the data quality issues that make financial reporting wrong.",
  openGraph: {
    title: "Fintech Data Auditing — BayesIQ",
    description:
      "The BayesIQ Audit Kit helps fintech teams score transaction pipelines, validate revenue metrics, and surface the data quality issues that make financial reporting wrong.",
  },
};

const problems = [
  {
    title: "Revenue metrics that don't match finance",
    description:
      "Your product analytics show one revenue number. Finance shows another. The Audit Kit's metric validation recomputes KPIs from raw transaction data — so you can see exactly where currency conversion logic, refund handling, or phantom events introduce the gap.",
  },
  {
    title: "Payment event telemetry with gaps",
    description:
      "Transaction events fire from multiple clients and payment processors. Required fields like currency, payment_method, or transaction_id are null more often than anyone realizes — 5%, 12%, sometimes 20% of rows. The Audit Kit's schema profiling catches null spikes before they reach downstream aggregations.",
  },
  {
    title: "Compliance reporting on unaudited pipelines",
    description:
      "Regulatory figures — SAR filing counts, transaction monitoring volumes, KYC completion rates — are built from the same pipelines as product dashboards. The Audit Kit produces a scored audit (0–100) with severity-ranked findings, so you know exactly which pipeline issues affect compliance numbers.",
  },
  {
    title: "A/B tests on corrupted baselines",
    description:
      "Duplicate checkout events, identity stitching gaps across web and mobile, and inconsistent funnel definitions mean experiment results are measured on baselines that don't represent reality. The Audit Kit's quality checks catch near-duplicates and event inflation before they corrupt your experiments.",
  },
  {
    title: "Risk scoring pipelines with unvalidated inputs",
    description:
      "Credit, fraud, and underwriting models consume features derived from transactional data. If the pipeline feeding those features has null-rate drift or schema changes, model performance degrades silently. The Audit Kit runs 12+ automated checks that flag data quality issues before they reach your models.",
  },
];

const deliverables = [
  {
    title: "Scored audit of transaction data pipelines",
    description:
      "Every pipeline gets a 0–100 quality score based on schema completeness, null rates, duplication, and freshness. Findings are severity-ranked so your team fixes P0 issues first — not the ones that happen to be loudest.",
  },
  {
    title: "dbt project with staging models",
    description:
      "Auto-generated dbt models handle the fintech-specific transformations most teams hand-roll: deduplication of retry events, currency normalization across payment processors, and settlement timing alignment between authorization and capture.",
  },
  {
    title: "Streamlit dashboard for revenue metric exploration",
    description:
      "An interactive dashboard your team can use immediately — explore revenue, refund rates, and transaction volumes with filters for currency, payment method, and time period. Built on the validated staging models, not raw event data.",
  },
  {
    title: "Metric validation: reported vs. actual KPIs",
    description:
      "Side-by-side comparison of the KPIs your dashboards currently report against values recomputed from raw data. Surfaces the exact transformation step where numbers diverge — whether it's a JOIN fanout, a timezone mismatch, or a filter that silently drops records.",
  },
];

const workingPrinciples = [
  {
    title: "Transaction-aware audit framework",
    description:
      "The Audit Kit understands payment event schemas, multi-currency pipelines, and the specific ways financial data drifts. Checks account for idempotency, settlement timing, and the gap between authorization and capture.",
  },
  {
    title: "Read-only, no PII or PAN required",
    description:
      "Schema profiling and null-rate analysis don't require access to cardholder data or PII. The Audit Kit evaluates the structure and completeness of events, not the content. We work behind your VPN or with anonymized and tokenized exports.",
  },
  {
    title: "Fast turnaround — P0 issues in 48 hours",
    description:
      "Severity-ranked findings are delivered within 1–2 weeks. P0 issues — metrics that are materially wrong right now — are typically surfaced within 48 hours so you can act before the next reporting cycle or board presentation.",
  },
];

const fintechJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "BayesIQ Fintech Data Auditing",
  description: "Automated data quality auditing for fintech transaction pipelines, settlement reconciliation, and regulatory compliance.",
  provider: { "@type": "Organization", name: "BayesIQ", url: "https://bayes-iq.com" },
};

export default function FintechPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fintechJsonLd) }}
      />
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
            most industries, but the data pipelines are just as fragile. The
            BayesIQ Audit Kit scores your transaction pipelines, validates
            revenue metrics against raw data, and surfaces the schema drift,
            null spikes, and duplication issues that make financial reporting
            quietly, confidently wrong.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Get an Audit Kit quote
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

      {/* Financial failure patterns */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            Why financial data pipelines fail
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            Fintech data pipelines break in ways that are hard to detect and
            expensive to discover late. These are the failure patterns the Audit
            Kit catches.
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

      {/* What the Audit Kit delivers */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            What the Audit Kit delivers for fintech
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            The Audit Kit is a structured product, not an open-ended engagement.
            Every fintech team gets the same four deliverables — tuned for
            payment event schemas, multi-currency pipelines, and compliance
            reporting requirements.
          </p>
          <div className="mt-10 space-y-8">
            {deliverables.map((item) => (
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

      {/* Working principles */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            How we work with fintech teams
          </h2>
          <div className="mt-10 space-y-8">
            {workingPrinciples.map((item) => (
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

      {/* Closing CTA */}
      <CTA
        headline="Audit your transaction pipeline"
        description="Start with a diagnostic sprint or drop a CSV in the playground."
      />
    </>
  );
}
