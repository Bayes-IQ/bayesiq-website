import type { Metadata } from "next";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "How the BayesIQ Audit Kit pipeline compresses weeks of manual data quality work into hours of automation plus expert judgment.",
  openGraph: {
    title: "Our Approach — BayesIQ",
    description:
      "How the BayesIQ Audit Kit pipeline compresses weeks of manual data quality work into hours of automation plus expert judgment.",
  },
};

const pipelineSteps = [
  {
    step: "01",
    label: "Ingest",
    description:
      "CSV, Parquet, or Snowflake. Multi-file support with shared column detection across datasets.",
  },
  {
    step: "02",
    label: "Profile",
    description:
      "Column types, nulls, cardinality, distributions. Auto-detect column roles — identifier, timestamp, category, measure, freetext.",
  },
  {
    step: "03",
    label: "Check",
    description:
      "12+ quality checks: duplicates, naming chaos, schema drift, timestamp gaps, null spikes, near-duplicates, negative values, out-of-range, and more.",
  },
  {
    step: "04",
    label: "Validate",
    description:
      "Recompute reported KPIs from raw data. Count, ratio, and sum formulas. Flag discrepancies between what dashboards say and what the data shows.",
  },
  {
    step: "05",
    label: "Score",
    description:
      "0–100 rubric with severity-weighted deductions. Every finding ranked Critical, High, Medium, or Low.",
  },
  {
    step: "06",
    label: "Generate",
    description:
      "dbt project (staging + mart models, tests), Streamlit dashboard, ASSUMPTIONS.md, and METRICS.md — ready to use, not just to read.",
  },
];

const tiers = [
  {
    name: "Diagnostic Sprint",
    subtitle: "Prove where the problems are",
    price: "$7.5K–$10K",
    timeline: "1 week",
    details: [
      "Automated scorecard across all datasets",
      "Severity-ranked findings with root causes",
      "Expert readout — ~4 hours of manual review",
      "Go/no-go recommendation for deeper engagement",
    ],
  },
  {
    name: "Audit + Plan",
    subtitle: "Define what correct should be",
    price: "~$25K",
    timeline: "4 weeks",
    details: [
      "Full automated findings + expert analysis",
      "Assumptions document with team sign-off",
      "Metric specification with formulas and dimensions",
      "dbt scaffolding (staging models, initial tests)",
      "Prioritized remediation roadmap",
    ],
  },
  {
    name: "Full Implementation",
    subtitle: "Ship the governed fix path",
    price: "$30K–$45K",
    timeline: "6 weeks",
    details: [
      "Production dbt project with 40+ tests",
      "Streamlit dashboards with validated metrics",
      "Architecture documentation and data dictionary",
      "Team training on dbt workflow and monitoring",
    ],
  },
];

const differentiators = [
  {
    title: "Pipeline-first",
    description:
      "Automated analysis in minutes, not weeks of manual work. The pipeline runs the same checks every time — no analyst variance, no missed tables.",
  },
  {
    title: "Domain-agnostic",
    description:
      "Same pipeline works on SaaS events, financial transactions, IoT sensor data, and CRM exports. Column role detection adapts to your schema.",
  },
  {
    title: "Artifacts, not reports",
    description:
      "You get a dbt project and interactive dashboards, not a PDF that sits in a drawer. Every deliverable is code you can version, extend, and run.",
  },
  {
    title: "Expert layer",
    description:
      "Data scientists review automated findings, eliminate false positives, and connect patterns across datasets. Automation finds — humans understand.",
  },
];

export default function ApproachPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900">
            Automated audit pipeline. Expert interpretation.
          </h1>
          <p className="mt-4 text-lg text-bayesiq-600">
            We compress weeks of manual data quality work into hours of
            automated pipeline + human judgment. The pipeline profiles, checks,
            scores, and generates artifacts. Our data scientists interpret the
            results and deliver a plan you can act on.
          </p>
        </div>
      </section>

      {/* Pipeline Architecture */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            Pipeline Architecture
          </h2>
          <p className="mt-2 text-sm text-bayesiq-600">
            Six stages from raw data to production-ready artifacts. Every step
            is deterministic and repeatable.
          </p>

          <div className="mt-12 space-y-0">
            {pipelineSteps.map((item, idx) => (
              <div key={item.step} className="relative flex gap-6 pb-10">
                {/* Connector line */}
                {idx < pipelineSteps.length - 1 && (
                  <div className="absolute left-[15px] top-[36px] h-full w-px bg-bayesiq-200" />
                )}
                {/* Step number */}
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bayesiq-900 text-xs font-bold text-white">
                  {item.step}
                </div>
                {/* Content */}
                <div className="pt-0.5">
                  <h3 className="text-lg font-semibold text-bayesiq-900">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-bayesiq-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Tiers */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            Engagement Tiers
          </h2>
          <p className="mt-2 text-sm text-bayesiq-600">
            Start small and expand if the findings warrant it. Every tier
            delivers concrete artifacts.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-lg border border-bayesiq-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-bayesiq-900">
                  {tier.name}
                </h3>
                <p className="text-sm font-medium text-bayesiq-500">
                  {tier.subtitle}
                </p>
                <p className="mt-1 text-sm font-medium text-bayesiq-700">
                  {tier.price}
                </p>
                <p className="text-xs text-bayesiq-400">{tier.timeline}</p>
                <ul className="mt-4 space-y-2">
                  {tier.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 text-sm text-bayesiq-600"
                    >
                      <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-bayesiq-300" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes this different */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-bayesiq-900">
            What makes this different
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {differentiators.map((item) => (
              <div key={item.title}>
                <p className="text-sm font-medium text-bayesiq-900">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-bayesiq-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA
        headline="Start with the playground"
        description="Drop a CSV and see the profiler in action. No account needed."
      />
    </>
  );
}
