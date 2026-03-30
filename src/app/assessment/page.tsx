import type { Metadata } from "next";
import Link from "next/link";
import AssessmentWizard from "@/components/assessment/AssessmentWizard";

// ---------------------------------------------------------------------------
// Metadata — derives from site.config.yaml /assessment entry
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Data Quality Self-Assessment",
  description:
    "Answer 6 questions and find out where your data infrastructure stands — with a score, tier assessment, and actionable recommendations.",
  openGraph: {
    title: "Data Quality Self-Assessment — BayesIQ",
    description:
      "Answer 6 questions and find out where your data infrastructure stands — with a score, tier assessment, and actionable recommendations.",
  },
};

// ---------------------------------------------------------------------------
// FAQ copy (source: docs/product/assessment_tool.md §FAQ)
// ---------------------------------------------------------------------------

const FAQ_ITEMS = [
  {
    q: "Is this a real audit?",
    a: "No — it's a self-assessment based on your answers to 6 questions. Think of it as a structured way to identify the highest-risk areas in your data infrastructure. A real audit involves examining your actual telemetry, pipelines, and metric definitions.",
  },
  {
    q: "Who is this for?",
    a: "Data leads, analytics engineers, and product leaders who are responsible for the reliability of business metrics and analytics pipelines. If you're not sure whether your data is trustworthy, this is a good place to start.",
  },
  {
    q: "How is the score calculated?",
    a: "Each answer is scored on a 0–3 scale based on data quality maturity. The total is converted to a percentage and mapped to one of three tiers: At Risk, Needs Work, or Strong.",
  },
  {
    q: "What happens after I complete the assessment?",
    a: "You'll see your score, tier, and up to 5 specific recommendations. You can optionally enter your email to receive the complete Data Quality Checklist that BayesIQ uses when starting new engagements.",
  },
];

// ---------------------------------------------------------------------------
// Credibility block copy (source: docs/product/assessment_tool.md §Credibility)
// ---------------------------------------------------------------------------

const AUDIT_DIMENSIONS = [
  {
    label: "Metric consistency",
    desc: "Do all your tools and queries agree on what a metric means and how to compute it?",
  },
  {
    label: "Telemetry accuracy",
    desc: "Do your events fire correctly, with the right properties, in all conditions?",
  },
  {
    label: "Pipeline observability",
    desc: "Do you know when something breaks, or do you find out from a broken dashboard?",
  },
  {
    label: "Definition enforcement",
    desc: "Are your metric definitions written down and actually used, or just aspirational?",
  },
  {
    label: "Incident history",
    desc: "How often has a data quality issue caused a visible problem?",
  },
  {
    label: "Stakeholder trust",
    desc: "Do the people using your data trust it enough to make decisions from it?",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function AssessmentPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-biq-text-muted">
            ~2 minutes · 6 questions · Free
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-biq-text-primary md:text-5xl">
            Is your data actually reliable?
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-biq-text-secondary">
            Answer 6 questions and find out where your data infrastructure
            stands — and what to do about it.
          </p>
          <p className="mt-3 text-sm text-biq-text-muted">
            You&apos;ll get a score, a tier assessment (At Risk / Needs Work /
            Strong), and tailored recommendations.
          </p>
        </div>
      </section>

      {/* Assessment wizard */}
      <section className="border-t border-biq-border px-6 pb-24 pt-12">
        <div className="mx-auto max-w-2xl">
          <AssessmentWizard />
        </div>
      </section>

      {/* Credibility block: what BayesIQ looks for */}
      <section className="border-t border-biq-border bg-biq-surface-1 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-biq-text-primary">
            What BayesIQ looks for in a real audit
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-biq-text-secondary">
            When we begin a data quality engagement, we evaluate six dimensions
            — the same dimensions this assessment measures. The self-assessment
            gives you a directional view; an audit gives you the specifics.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {AUDIT_DIMENSIONS.map((dim) => (
              <div key={dim.label} className="flex gap-4">
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full bg-biq-dark-surface-1"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-biq-text-primary">
                    {dim.label}
                  </p>
                  <p className="mt-0.5 text-sm text-biq-text-secondary">{dim.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/consulting"
              className="text-sm font-medium text-biq-text-secondary underline-offset-2 transition-colors hover:text-biq-text-primary hover:underline"
            >
              See how a BayesIQ engagement works &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-biq-text-primary">
            Common questions
          </h2>
          <dl className="mt-8 space-y-8">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q}>
                <dt className="text-sm font-semibold text-biq-text-primary">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-biq-text-secondary">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-biq-border bg-biq-dark-surface-1 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Want a real answer, not a directional one?
          </h2>
          <p className="mt-4 text-base text-biq-dark-text-primary">
            A BayesIQ audit examines your actual telemetry, pipelines, and
            metric definitions — and gives you a severity-ranked fix plan in
            under two weeks.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-biq-surface-0 px-6 py-3 text-sm font-medium text-biq-text-primary transition-colors hover:bg-biq-surface-2"
          >
            Book a free data health check
          </Link>
        </div>
      </section>
    </>
  );
}
