import type { Metadata } from "next";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Products",
  description:
    "The BayesIQ Data Audit Kit finds broken metrics and generates deployable artifacts — dbt projects, Streamlit dashboards, and documentation.",
  openGraph: {
    title: "Products — BayesIQ",
    description:
      "The BayesIQ Data Audit Kit finds broken metrics and generates deployable artifacts — dbt projects, Streamlit dashboards, and documentation.",
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BayesIQ",
  url: "https://bayesiq.com",
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "BayesIQ Data Audit Kit",
        description:
          "An automated pipeline that audits any dataset and generates production-ready artifacts including dbt projects, Streamlit dashboards, and documentation.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "BayesIQ Platform",
        description:
          "Safe, extensible automation with policy gates, approval workflows, and audit trails.",
      },
    },
  ],
};

const auditKitFeatures = [
  {
    title: "Schema Profiling",
    description:
      "Types, nulls, cardinality, distributions, and column role detection. Understand the shape of your data before writing a single query.",
  },
  {
    title: "Quality Checks",
    description:
      "12+ automated checks: duplicates, naming chaos, schema drift, timestamp gaps, null spikes, near-duplicates, and out-of-range values.",
  },
  {
    title: "Metric Validation",
    description:
      "Recompute KPIs from raw data, compare to reported values, and flag discrepancies. Know which numbers to trust.",
  },
  {
    title: "dbt Project Generation",
    description:
      "Staging models, mart models, schema tests, source definitions, canonicalization, and deduplication — generated from your data, not a template.",
  },
  {
    title: "Dashboard Generation",
    description:
      "A Streamlit app with sidebar filters, metric charts, dimensional breakdowns, and a dedicated data quality tab.",
  },
  {
    title: "Documentation",
    description:
      "ASSUMPTIONS.md, METRICS.md, and LLM-powered column interpretation via the Claude API. Decisions are recorded, not guessed at later.",
  },
];

const platformFeatures = [
  {
    title: "Tool Registry",
    description:
      "JSON manifest discovery, handler purity enforcement, and I/O schema validation. Every tool declares what it does and what it needs.",
  },
  {
    title: "Policy Engine",
    description:
      "YAML role config with tool-specific overrides — volume caps, repo allowlists, execution modes. Constraints are explicit, not implicit.",
  },
  {
    title: "Approval Gateway",
    description:
      "Single entry point: schema validation, policy check, human approval, execution, logging. No action runs without a trace.",
  },
  {
    title: "Built-in Tools",
    description:
      "Calendar, GitHub, Sonos, memory, notifications, data ops, and pipeline orchestration. Useful out of the box, extensible by design.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Hero */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900">
            Find broken metrics. Get the fix path.
          </h1>
          <p className="mt-4 text-lg text-bayesiq-600">
            The Data Audit Kit is the core of everything we do. Drop data in,
            see what&apos;s wrong, get artifacts you can deploy.
          </p>
        </div>
      </section>

      {/* Data Audit Kit */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="border-t border-bayesiq-200 pt-12">
            <h2 className="text-3xl font-bold text-bayesiq-900">
              BayesIQ Data Audit Kit
            </h2>
            <p className="mt-4 text-lg text-bayesiq-600">
              An automated pipeline that audits any dataset and generates
              deployable artifacts — dbt projects, dashboards, and documentation.
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {auditKitFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border border-bayesiq-200 bg-bayesiq-50 p-6"
                >
                  <h3 className="text-base font-bold text-bayesiq-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">
                  Supported Inputs
                </p>
                <p className="mt-2 text-sm text-bayesiq-700">
                  CSV, Parquet, Snowflake. BigQuery and Redshift planned.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">
                  Tested On
                </p>
                <p className="mt-2 text-sm text-bayesiq-700">
                  SaaS events, financial transactions, IoT sensor data, CRM
                  exports, and healthcare records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BayesIQ Platform — subordinate */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="border-t border-bayesiq-100 pt-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-bayesiq-400">
              Also from BayesIQ
            </p>
            <h2 className="mt-2 text-2xl font-bold text-bayesiq-900">
              BayesIQ Platform
            </h2>
            <p className="mt-3 text-sm text-bayesiq-600">
              The execution layer behind BayesIQ workflows — safe, extensible
              automation with policy gates and audit trails. Powers the
              orchestration behind our audit engagements.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {platformFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border border-bayesiq-100 bg-bayesiq-50/50 p-5"
                >
                  <h3 className="text-sm font-bold text-bayesiq-900">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-bayesiq-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA
        headline="Try it yourself"
        description="Drop a CSV in the playground or book a diagnostic sprint."
      />
    </>
  );
}
