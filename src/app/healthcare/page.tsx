/**
 * Healthcare landing page.
 * Industry-specific messaging for the Audit Kit product applied to healthcare data teams.
 * Derived from: docs/product/landing_healthcare.md
 */

import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Healthcare Data Auditing — BayesIQ",
  description:
    "The BayesIQ Audit Kit helps healthcare organizations score clinical data pipelines, catch metric discrepancies, and validate reporting — without touching PHI.",
  openGraph: {
    title: "Healthcare Data Auditing — BayesIQ",
    description:
      "The BayesIQ Audit Kit helps healthcare organizations score clinical data pipelines, catch metric discrepancies, and validate reporting — without touching PHI.",
  },
};

const failurePatterns = [
  {
    title: "Clinical metrics don't reconcile",
    description:
      "Your EMR data says one thing, your analytics dashboard says another. Readmission rates, patient volume, and outcome metrics diverge across systems. The Audit Kit flags these discrepancies through metric validation — comparing source-system figures against downstream calculations so you can see exactly where numbers split.",
  },
  {
    title: "Regulatory reporting built on unvalidated data",
    description:
      "Quality measures for CMS, Joint Commission, or payer contracts are computed from pipelines nobody has audited. The Audit Kit produces a scored audit report (0-100) that catches data completeness issues, schema drift, and transformation errors before they reach a regulatory submission.",
  },
  {
    title: "Telemetry gaps in patient-facing digital tools",
    description:
      "Patient portals, scheduling apps, and telehealth platforms emit events — but required fields are missing, sessions aren't stitched, and engagement metrics are unreliable. The Audit Kit's schema profiling detects null rates, field coverage gaps, and type inconsistencies across your event stream.",
  },
  {
    title: "Pipeline failures discovered by stakeholders, not alerts",
    description:
      "A clinical operations lead notices a stale dashboard or a report that doesn't match last month's format. The Audit Kit ships a dbt project with 40+ tests — uniqueness, referential integrity, accepted values, recency — that catch regressions automatically before anyone opens a Slack thread.",
  },
];

const deliverables = [
  {
    title: "Scored audit of your clinical data pipeline",
    description:
      "A 0-100 score across completeness, freshness, schema conformance, and metric consistency. Not a vague maturity assessment — a quantified evaluation of your pipeline's current state with specific findings ranked by severity.",
  },
  {
    title: "dbt project with staging models, schema tests, and canonicalization",
    description:
      "Auto-generated dbt models that handle deduplication, type casting, and clinical data normalization for your warehouse. 40+ schema tests covering nulls, uniqueness, referential integrity, and accepted values — configured for your actual tables, not generic templates.",
  },
  {
    title: "Streamlit dashboard for clinical metric exploration",
    description:
      "An interactive dashboard your team can use to explore clinical, operational, and quality metrics. Filter by facility, time period, or encounter type. Drill into the specific rows behind any metric to verify what the numbers actually represent.",
  },
  {
    title: "ASSUMPTIONS.md documenting data contracts for compliance",
    description:
      "A plain-language document capturing every assumption the pipeline makes: which fields are required, what constitutes a valid encounter, how duplicates are resolved. Useful for compliance reviews, onboarding new analysts, and auditing your own metric definitions.",
  },
];

const workingPrinciples = [
  {
    title: "No PHI access required",
    description:
      "Most data quality issues are structural — schema drift, null fields, broken joins. The Audit Kit evaluates the shape and completeness of your data, not the clinical content. We don't need PHI access for the majority of our work.",
  },
  {
    title: "Read-only, async engagement",
    description:
      "We work from read-only access to your warehouse or aggregated exports. No production changes, no standing access, no disruption to clinical workflows.",
  },
  {
    title: "Healthcare-aware audit framework",
    description:
      "The Audit Kit understands HL7/FHIR event structures, EMR-to-warehouse pipelines, and the specific ways clinical data drifts. It accounts for encounter-based data models, not just SaaS event streams.",
  },
];

export default function HealthcarePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Healthcare
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-bayesiq-900">
            Your clinical metrics are only as good as your data pipeline.
          </h1>
          <p className="mt-6 text-lg text-bayesiq-600">
            Healthcare data teams face regulatory reporting deadlines, compliance
            constraints on data access, and analytics pipelines that span EMRs,
            data warehouses, and patient-facing applications. When those
            pipelines drift, the metrics drift with them — silently. The Audit
            Kit gives you a scored, reproducible evaluation of your clinical data
            pipeline so you can find the problems before they reach a report.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Get the Audit Kit
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

      {/* Failure patterns */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            Healthcare failure patterns the Audit Kit detects
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            Healthcare data pipelines break in predictable ways. These are the
            failure patterns we find most often — and how the Audit Kit surfaces
            each one.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {failurePatterns.map((pattern) => (
              <div key={pattern.title}>
                <h3 className="text-sm font-semibold text-bayesiq-900">
                  {pattern.title}
                </h3>
                <p className="mt-2 text-sm text-bayesiq-600">
                  {pattern.description}
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
            What the Audit Kit delivers for healthcare
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            Four concrete artifacts, configured for your clinical data pipeline
            and ready to use from day one.
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
            How we work with healthcare organizations
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
        headline="Audit your clinical data pipeline"
        description="Start with a diagnostic sprint or drop a CSV in the playground."
      />
    </>
  );
}
