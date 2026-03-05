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
    title: "Findings & Fix Plan",
    timeline: "Day 7–10",
    description:
      "A severity-ranked report of every confirmed issue, with root cause analysis and specific fix recommendations. Two versions — an executive summary for leadership, and technical detail for the engineering team.",
    detail:
      "A document you can hand directly to your data team with clear next steps. Not vague recommendations — specific fixes with expected impact.",
  },
  {
    step: "05",
    title: "Implementation Support",
    timeline: "Optional",
    description:
      "We can help implement fixes, set up validation tests, or pair with your engineers on the hardest problems. Many teams take the report and execute independently.",
    detail: "Flexible format: hourly, weekly sprints, or fixed scope.",
  },
  {
    step: "06",
    title: "Monitoring Setup",
    timeline: "Optional",
    description:
      "Automated agents that catch drift, telemetry gaps, and metric inconsistencies on an ongoing basis. Think of it as a CI pipeline for your data quality.",
    detail:
      "Continuous checks, alerting rules, and a runbook for responding to issues.",
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
              <p className="text-sm font-medium text-bayesiq-900">No lock-in</p>
              <p className="mt-1 text-sm text-bayesiq-600">
                We audit, report, and help fix. We don&apos;t require you to adopt
                our platform or commit to ongoing contracts. Take the report and
                run.
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
        description="Most engagements go from kickoff to actionable findings in under two weeks."
      />
    </>
  );
}
