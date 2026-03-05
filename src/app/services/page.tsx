import type { Metadata } from "next";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Data quality audits, telemetry validation, and end-to-end pipeline delivery — from warehouse to dashboard.",
  openGraph: {
    title: "Services — BayesIQ",
    description:
      "Data quality audits, telemetry validation, and end-to-end pipeline delivery — from warehouse to dashboard.",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  provider: {
    "@type": "Organization",
    name: "BayesIQ",
    url: "https://bayesiq.com",
  },
  serviceType: "Data Quality Auditing",
  name: "BayesIQ Data Auditing Services",
  description:
    "AI-assisted data quality audits, telemetry validation, analytics pipeline design, and continuous monitoring for teams that need to trust their metrics.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Data Auditing Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Data Quality Audit",
          description:
            "Full evaluation of telemetry accuracy, metric reliability, pipeline health, and dashboard correctness.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Telemetry & Logging Validation",
          description:
            "Compare your logging specification against what actually fires in production. Field-level validation.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "End-to-End Pipeline: Warehouse to Dashboard",
          description:
            "From warehouse to validated dashboards in 6 weeks. Auto-generated dbt projects, interactive Streamlit dashboards, and drift detection.",
        },
      },
    ],
  },
};

const services = [
  {
    title: "Data Quality Audit",
    scope:
      "Full evaluation of telemetry accuracy, metric reliability, pipeline health, and dashboard correctness. We look at event schemas, transformation logic, metric definitions, and the queries that power your dashboards.",
    deliverables: [
      "Severity-ranked issue report with root cause analysis",
      "Data assumptions document — what we believe about your data, validated with your team",
      "Fix recommendations for each issue",
      "Executive summary for leadership",
      "Technical detail for engineering teams",
    ],
    format: "1–2 week engagement. Primarily async with 2–3 sync sessions.",
    audience:
      "Teams that suspect their metrics are wrong but can't pinpoint where. Common trigger: two dashboards show different numbers for the same thing.",
  },
  {
    title: "Telemetry & Logging Validation",
    scope:
      "Compare your logging specification against what actually fires in production. Field-level validation — not just 'did the event fire?' but 'did every required field populate correctly?'",
    deliverables: [
      "Validation report mapping spec to reality",
      "List of missing, malformed, or incorrectly-fired events",
      "Coverage gap analysis",
      "Recommended spec updates",
    ],
    format: "3–5 day sprint. Fast turnaround.",
    audience:
      "Product teams shipping telemetry who need to know it's correct before building metrics on top of it. Especially useful before launching A/B tests.",
  },
  {
    title: "End-to-End Pipeline: Warehouse to Dashboard",
    scope:
      "We connect to your warehouse, audit the data, align on assumptions and metric definitions with your team, then auto-generate the dbt project and interactive dashboards. From raw data to validated, trustworthy dashboards in 6 weeks.",
    deliverables: [
      "Data assumptions document with client sign-off checklist",
      "Metric specification with formulas, dimensions, and validation rules",
      "Auto-generated dbt project — staging models, mart models, 40+ tests",
      "Interactive Streamlit dashboards with filters, charts, and data quality views",
      "Drift detection queries and monitoring setup",
      "Architecture documentation with data flow diagrams",
    ],
    format: "6-week engagement. Assumptions sign-off at Week 3–4 before building.",
    audience:
      "Teams that need the full fix, not just the diagnosis. Common scenario: you know the metrics are wrong and need trustworthy numbers fast — for a board deck, fundraise, or operational decisions.",
  },
  {
    title: "Continuous Monitoring",
    scope:
      "Automated agents that validate telemetry and metrics on an ongoing basis. Catch drift, gaps, and inconsistencies before they reach dashboards.",
    deliverables: [
      "Monitoring agent setup and configuration",
      "Alerting rules tailored to your data systems",
      "Drift detection baselines",
      "Runbook for responding to alerts",
    ],
    format: "One-time setup + optional monthly retainer.",
    audience:
      "Teams that solved the initial problems and want to prevent regression. Insurance against the silent failures coming back.",
    comingSoon: true,
  },
];

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900">
            Services
          </h1>
          <p className="mt-4 text-lg text-bayesiq-600">
            Every engagement is structured to find specific problems and deliver
            actionable fixes — not vague recommendations.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-3xl space-y-16">
          {services.map((service) => (
            <div
              key={service.title}
              className="border-t border-bayesiq-200 pt-12"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-bayesiq-900">
                  {service.title}
                </h2>
                {service.comingSoon && (
                  <span className="shrink-0 rounded-full bg-bayesiq-100 px-3 py-1 text-xs font-medium text-bayesiq-500">
                    Coming Soon
                  </span>
                )}
              </div>

              <p className="mt-4 text-base leading-relaxed text-bayesiq-600">
                {service.scope}
              </p>

              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">
                  Deliverables
                </p>
                <ul className="mt-2 space-y-1">
                  {service.deliverables.map((d) => (
                    <li
                      key={d}
                      className="text-sm text-bayesiq-700 before:mr-2 before:text-bayesiq-300 before:content-['—']"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">
                    Format
                  </p>
                  <p className="mt-1 text-sm text-bayesiq-700">
                    {service.format}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">
                    Best for
                  </p>
                  <p className="mt-1 text-sm text-bayesiq-700">
                    {service.audience}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTA
        headline="Not sure which service you need?"
        description="Tell us what's going on with your data. We'll recommend the right engagement."
      />
    </>
  );
}
