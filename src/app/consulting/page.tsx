import type { Metadata } from "next";
import Link from "next/link";
import PipelineSteps from "@/components/consulting/PipelineSteps";
import EngagementTiers from "@/components/consulting/EngagementTiers";
import BentoGrid from "@/components/consulting/BentoGrid";
import BentoCard from "@/components/consulting/BentoCard";
import FAQAccordion from "@/components/consulting/FAQAccordion";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Audit-First Analytics Consulting",
  description:
    "BayesIQ consulting: we find what's broken in your data, fix it, and hand you the infrastructure to keep it right. Methodology, engagement tiers, deliverables.",
  openGraph: {
    title: "Audit-First Analytics Consulting — BayesIQ",
    description:
      "We find what's broken, fix it, and hand you the infrastructure to keep it right.",
  },
};

const deliverables = [
  {
    title: "Scored Audit Report (0-100)",
    description:
      "A quantified evaluation of your pipeline across completeness, freshness, schema conformance, and metric consistency. Findings ranked by severity and business impact.",
    span: 2 as const,
  },
  {
    title: "Dataset Profile",
    description:
      "Schema scan covering column types, null rates, cardinality, and distributions across every table in your warehouse.",
    span: 1 as const,
  },
  {
    title: "Quality Checks Report",
    description:
      "Results from 40+ automated checks: uniqueness, referential integrity, accepted values, freshness, and near-duplicate detection.",
    span: 1 as const,
  },
  {
    title: "ASSUMPTIONS.md",
    description:
      "A plain-language document capturing every assumption the pipeline makes. Client sign-off before anything is built.",
    span: 1 as const,
  },
  {
    title: "METRICS.md",
    description:
      "One canonical definition per KPI with formulas, dimensions, and validation rules. Aligned across product, finance, and growth.",
    span: 1 as const,
  },
  {
    title: "dbt Project (40+ tests)",
    description:
      "Auto-generated staging-to-mart pipeline with deduplication, canonicalization, and mart models. 40+ schema tests covering nulls, uniqueness, range validation, and freshness.",
    span: 2 as const,
  },
  {
    title: "Streamlit Dashboard",
    description:
      "Interactive dashboards with sidebar filters, metric charts, and data quality views. Built on validated staging models.",
    span: 1 as const,
  },
  {
    title: "Canonicalization Mapping",
    description:
      "Maps raw column names and inconsistent values to clean, canonical forms. The translation layer between messy source data and governed metrics.",
    span: 1 as const,
  },
];

export default function ConsultingPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
            Audit-First Analytics Consulting
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
            We find what&apos;s broken, fix it, and hand you the infrastructure
            to keep it right.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Book a Diagnostic
            </Link>
            <Link
              href="/assessment"
              className="rounded-lg border border-bayesiq-300 px-6 py-3 text-sm font-medium text-bayesiq-900 transition-colors hover:bg-bayesiq-50"
            >
              Take the Self-Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-bayesiq-900">
            How We Work
          </h2>
          <p className="mt-4 text-base leading-relaxed text-bayesiq-600">
            A repeatable, six-stage pipeline. Every engagement follows the same
            sequence so nothing gets missed and every finding is traceable back
            to source data.
          </p>
          <div className="mt-10">
            <PipelineSteps />
          </div>
        </div>
      </section>

      {/* Engagement Tiers */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-bayesiq-900">
              Engagement Tiers
            </h2>
            <p className="mt-4 text-base text-bayesiq-600">
              Start with a one-week diagnostic. The sprint fee is{" "}
              <span className="font-mono">100%</span> credited toward a full
              engagement.
            </p>
          </div>
          <div className="mt-10">
            <EngagementTiers />
          </div>
        </div>
      </section>

      {/* Deliverables — Bento Grid */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-bayesiq-900">
            What You Get
          </h2>
          <p className="mt-4 text-base text-bayesiq-600">
            Concrete artifacts, not a slide deck. Every engagement produces
            working infrastructure your team can use from day one.
          </p>
          <div className="mt-10">
            <BentoGrid>
              {deliverables.map((d) => (
                <BentoCard
                  key={d.title}
                  title={d.title}
                  description={d.description}
                  span={d.span}
                />
              ))}
            </BentoGrid>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-bayesiq-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-8">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* What We Work With */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-bayesiq-500">
            <span className="font-medium text-bayesiq-700">
              Warehouses:
            </span>{" "}
            Snowflake, BigQuery, Redshift{" "}
            <span className="mx-2 text-bayesiq-300">|</span>
            <span className="font-medium text-bayesiq-700">
              Transform:
            </span>{" "}
            dbt preferred, any stack{" "}
            <span className="mx-2 text-bayesiq-300">|</span>
            <span className="font-medium text-bayesiq-700">
              Dashboards:
            </span>{" "}
            Looker, Tableau, Mode, Metabase{" "}
            <span className="mx-2 text-bayesiq-300">|</span>
            <span className="font-medium text-bayesiq-700">Access:</span>{" "}
            Read-only
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <CTA
        headline="Ready to see what's hiding in your data?"
        description="Book a one-week diagnostic to score your data pipeline and surface the issues that matter most."
        buttonText="Book a Diagnostic"
      />
    </>
  );
}
