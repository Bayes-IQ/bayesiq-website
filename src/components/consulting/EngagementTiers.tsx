/**
 * Engagement tier cards.
 * NO PRICING. Scope and timeline only.
 * Server component.
 */

import Link from "next/link";

interface Tier {
  name: string;
  timeline: string;
  description: string;
  includes: string[];
  cta: string;
  highlighted?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Diagnostic Sprint",
    timeline: "1 week",
    description:
      "A fast, low-friction entry point. We connect to your warehouse, run our automated pipeline, and deliver a severity-ranked scorecard of the top issues in your data systems.",
    includes: [
      "Scored audit report (0-100)",
      "Top findings ranked by severity",
      "Remediation priorities",
      "Executive summary + technical detail",
    ],
    cta: "Book a Diagnostic",
  },
  {
    name: "Full Engagement",
    timeline: "4-6 weeks",
    description:
      "End-to-end: from warehouse connection to validated dashboards. We audit your data, formalize metric definitions, build the fix, and hand it off to your team.",
    includes: [
      "Everything in Diagnostic Sprint",
      "ASSUMPTIONS.md (data contracts)",
      "METRICS.md (canonical definitions)",
      "dbt project with 40+ tests",
      "Interactive Streamlit dashboards",
      "Drift detection and monitoring",
    ],
    cta: "Start a Full Engagement",
    highlighted: true,
  },
  {
    name: "Continuous Monitoring",
    timeline: "Ongoing",
    description:
      "After the engagement ends, automated monitoring keeps your metrics honest. Drift detection, freshness alerts, and quarterly reviews ensure regressions are caught early.",
    includes: [
      "Automated drift detection",
      "Freshness and volume alerting",
      "Quarterly audit reviews",
      "Priority support for new metrics",
    ],
    cta: "Learn About Monitoring",
  },
];

export default function EngagementTiers() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`flex flex-col rounded-xl border p-6 ${
            tier.highlighted
              ? "border-bayesiq-900 ring-1 ring-bayesiq-900"
              : "border-biq-border"
          }`}
        >
          {tier.highlighted && (
            <span className="mb-3 inline-block w-fit rounded-full bg-bayesiq-900 px-3 py-0.5 text-xs font-medium text-white">
              Most Popular
            </span>
          )}
          <h3 className="font-display text-xl font-semibold text-biq-text-primary">
            {tier.name}
          </h3>
          <p className="mt-1 font-mono text-sm text-biq-text-muted">
            {tier.timeline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-biq-text-secondary">
            {tier.description}
          </p>
          <ul className="mt-4 flex-1 space-y-2">
            {tier.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-biq-text-secondary"
              >
                <span className="mt-1 shrink-0 text-biq-text-muted" aria-hidden="true">
                  &bull;
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
              tier.highlighted
                ? "bg-bayesiq-900 text-white hover:bg-bayesiq-800"
                : "border border-biq-border text-biq-text-primary hover:bg-biq-surface-1"
            }`}
          >
            {tier.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
