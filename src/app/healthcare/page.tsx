/**
 * Healthcare landing page.
 * Industry-specific messaging for healthcare data teams.
 * Derived from: docs/product/landing_healthcare.md
 */

import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Healthcare Data Auditing — BayesIQ",
  description:
    "BayesIQ helps healthcare organizations audit clinical analytics, validate patient telemetry, and fix metric pipelines — without touching PHI.",
  openGraph: {
    title: "Healthcare Data Auditing — BayesIQ",
    description:
      "BayesIQ helps healthcare organizations audit clinical analytics, validate patient telemetry, and fix metric pipelines — without touching PHI.",
  },
};

const problems = [
  {
    title: "Clinical metrics that don't reconcile",
    description:
      "Your EMR data says one thing, your analytics dashboard says another. Patient volume, readmission rates, and outcome metrics diverge across systems — and nobody can explain why.",
  },
  {
    title: "Regulatory reporting built on unvalidated data",
    description:
      "Quality measures for CMS, Joint Commission, or payer contracts are computed from pipelines that haven't been audited. If the source data has gaps, the reports inherit them.",
  },
  {
    title: "Telemetry gaps in patient-facing digital tools",
    description:
      "Patient portals, scheduling apps, and telehealth platforms emit events — but required fields are missing, sessions aren't stitched, and engagement metrics are unreliable.",
  },
  {
    title: "Pipeline failures discovered by stakeholders, not alerts",
    description:
      "A clinical operations lead notices a dashboard is stale or a report doesn't match last month's format. The data team finds out from a Slack message, not a monitoring alert.",
  },
];

const services = [
  {
    title: "Data Quality Audit",
    description:
      "End-to-end evaluation of clinical metric pipelines: EMR extracts, warehouse transformations, and dashboard queries. We identify schema drift in HL7/FHIR event structures and surface discrepancies between source-system figures and downstream reporting.",
  },
  {
    title: "Telemetry & Logging Validation",
    description:
      "Compare your logging specification for patient portal or telehealth apps against what actually fires in production. We identify missing fields, unsent events, and broken session stitching so your engagement metrics reflect real patient behavior.",
  },
  {
    title: "Analytics Pipeline Design",
    description:
      "Review or redesign ETL pipelines for clinical data, payer data feeds, or operational reporting. We define reliable metric definitions aligned to clinical context and recommend testing strategies appropriate for healthcare data sensitivity.",
  },
];

const workingModel = [
  {
    title: "No PHI access required",
    description:
      "Most data quality issues are structural — schema drift, null fields, broken joins. We audit the shape and completeness of your data, not the clinical content. We don't need PHI access for the majority of our work.",
  },
  {
    title: "Read-only, async engagement",
    description:
      "We work from read-only access to your warehouse or aggregated exports. No production changes, no standing access, no disruption to clinical workflows.",
  },
  {
    title: "Healthcare-aware audit framework",
    description:
      "We understand HL7/FHIR event structures, EMR-to-warehouse pipelines, and the specific ways clinical data drifts. Our audit framework accounts for encounter-based data models, not just SaaS event streams.",
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
            Healthcare data teams face unique pressure: regulatory reporting
            deadlines, compliance constraints on data access, and analytics
            pipelines that span EMRs, data warehouses, and patient-facing
            applications. When those pipelines drift, the metrics drift with
            them — silently.
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
            Why telemetry fails in healthcare
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            Healthcare data pipelines break in predictable ways. These are the
            failure patterns we find most often.
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
            What we deliver for healthcare organizations
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            Our services map directly to the data quality problems healthcare
            teams face — applied with awareness of clinical data structures and
            compliance constraints.
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
            Most engagements run 1–2 weeks, primarily async. We start with a
            discovery session to understand your architecture, then run
            AI-assisted analysis to surface issues faster than manual review
            alone. Findings are delivered as a severity-ranked report with root
            cause analysis and specific fix recommendations.
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

      {/* How we work with healthcare organizations */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900">
            How we work with healthcare organizations
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
            Our work can improve the auditability and traceability of your
            analytics pipelines — helping reduce risk around regulatory
            reporting and supporting your compliance posture. We help you
            understand where your data comes from, whether it is complete, and
            where it could be misrepresenting reality.
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
        headline="Let's audit your healthcare data pipeline."
        description="Send us your data architecture overview or describe what's not adding up. We'll tell you where to look first."
        buttonText="Get in Touch"
        href="/contact"
      />
    </>
  );
}
