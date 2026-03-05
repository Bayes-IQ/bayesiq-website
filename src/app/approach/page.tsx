import type { Metadata } from "next";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "How BayesIQ combines AI-assisted analysis with expert data science to audit your data systems.",
  openGraph: {
    title: "Our Approach — BayesIQ",
    description:
      "How BayesIQ combines AI-assisted analysis with expert data science to audit your data systems.",
  },
};

const steps = [
  {
    step: "01",
    title: "Discovery",
    timeline: "Day 1–2",
    description:
      "We learn your data architecture, logging specs, known pain points, and what 'trustworthy data' means for your organization. We review your telemetry spec, pipeline architecture, and key metrics.",
    detail:
      "What we need: access to logging specs, pipeline code or documentation, key dashboards, and 1–2 hours with someone who knows the data architecture.",
  },
  {
    step: "02",
    title: "Automated Scan",
    timeline: "Day 3–5",
    description:
      "AI agents analyze your telemetry against the logging spec, validate pipeline transformations, and check metric definitions against underlying data. This surfaces issues that would take humans weeks to find manually.",
    detail:
      "Read-only access. No production changes. We run our analysis tools against your data systems.",
  },
  {
    step: "03",
    title: "Expert Review",
    timeline: "Day 5–7",
    description:
      "Data scientists review the automated findings, eliminate false positives, assess severity, and identify root causes. Not everything flagged is a real problem — human judgment separates signal from noise.",
    detail:
      "A list of 50 flagged items becomes a ranked set of 12 real issues with connected root causes.",
  },
  {
    step: "04",
    title: "Assumptions Sign-off",
    timeline: "Week 3–4",
    description:
      "We deliver a data assumptions document — what we believe to be true about your data based on the audit. Your team reviews and signs off before we build anything. This prevents rework and ensures alignment.",
    detail:
      "Includes confidence levels for each assumption, source findings, and a metric specification with formulas and dimensions.",
  },
  {
    step: "05",
    title: "Implementation & Dashboards",
    timeline: "Week 5–6",
    description:
      "We auto-generate a dbt project (staging models, mart models, 40+ tests), build interactive Streamlit dashboards with your validated metrics, and set up drift detection. Your team gets trustworthy numbers they can use immediately.",
    detail:
      "Full engagement delivers working dbt project, dashboards, and monitoring — not just a report.",
  },
  {
    step: "06",
    title: "Continuous Monitoring",
    timeline: "Optional",
    description:
      "Automated agents that catch drift, telemetry gaps, and metric inconsistencies on an ongoing basis. Think of it as a CI pipeline for your data quality.",
    detail:
      "Continuous checks, alerting rules, and a runbook for responding to issues. $2–5K/month.",
  },
];

export default function ApproachPage() {
  return (
    <>
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900">
            Our Approach
          </h1>
          <p className="mt-4 text-lg text-bayesiq-600">
            We treat data systems like code — they should be tested, validated,
            and continuously monitored. Our method combines AI-assisted analysis
            with expert data science to find problems faster than either could
            alone.
          </p>
        </div>
      </section>

      {/* What makes us different */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-bayesiq-900">
            Deeper than a tool. Faster than a consultancy.
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-bayesiq-900">AI-assisted speed</p>
              <p className="mt-1 text-sm text-bayesiq-600">
                Automated agents scan telemetry and pipelines in days, not
                weeks. They find the issues humans would miss or take months to
                uncover.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-bayesiq-900">Human judgment</p>
              <p className="mt-1 text-sm text-bayesiq-600">
                Data scientists interpret findings, eliminate false positives,
                and connect individual issues to systemic patterns. Automation
                finds — humans understand.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-bayesiq-900">Specific, not vague</p>
              <p className="mt-1 text-sm text-bayesiq-600">
                Every finding comes with a severity ranking, root cause, and a
                concrete fix recommendation. You get a plan, not a score.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-bayesiq-900">End-to-end delivery</p>
              <p className="mt-1 text-sm text-bayesiq-600">
                We go from your warehouse to validated dashboards. You get a
                working dbt project, interactive dashboards, and drift detection
                — not just a report. No ongoing contracts required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            How an engagement works
          </h2>
          <div className="mt-12 space-y-12">
            {steps.map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex shrink-0 flex-col items-center">
                  <span className="text-sm font-bold text-bayesiq-300">
                    {item.step}
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-lg font-semibold text-bayesiq-900">
                      {item.title}
                    </h3>
                    <span className="text-xs text-bayesiq-400">
                      {item.timeline}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                    {item.description}
                  </p>
                  <p className="mt-2 text-sm italic text-bayesiq-400">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        headline="Ready to find out what your data is hiding?"
        description="Most engagements go from kickoff to validated dashboards in 6 weeks. Start with a diagnostic sprint."
      />
    </>
  );
}
