import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";
import ServiceCard from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "Audit Kit",
  description:
    "Drop a CSV, get a scored audit, a dbt project, and a Streamlit dashboard. 12+ automated quality checks, severity-weighted scoring, and production-ready artifacts.",
  openGraph: {
    title: "Audit Kit — BayesIQ",
    description:
      "Drop a CSV, get a scored audit, a dbt project, and a Streamlit dashboard. 12+ automated quality checks with production-ready output.",
  },
};

const auditKitJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "BayesIQ Data Audit Kit",
  description:
    "An automated data quality audit pipeline that scores any dataset on a 0–100 rubric and generates production-ready artifacts including dbt projects, Streamlit dashboards, and documentation.",
  brand: {
    "@type": "Organization",
    name: "BayesIQ",
    url: "https://bayes-iq.com",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0",
    highPrice: "45000",
    offerCount: "4",
  },
};

const pipelineStages = [
  { step: "01", title: "Schema Profiling", desc: "Column-level analysis — data types, null rates, cardinality, value distributions. Auto-detects column roles." },
  { step: "02", title: "Quality Checks", desc: "12+ automated checks — duplicates, schema drift, null spikes, naming conventions, timestamp gaps. Every finding severity-ranked." },
  { step: "03", title: "Metric Validation", desc: "Recomputes your reported KPIs from raw data. Flags discrepancies between what's reported and what the data shows." },
  { step: "04", title: "Report Generation", desc: "Severity-weighted 0–100 score. Executive scorecard, remediation plan with effort estimates, findings ranked by severity." },
  { step: "05", title: "dbt Project", desc: "Staging models, mart models, 40+ schema tests, and source definitions. Ready to run dbt build." },
  { step: "06", title: "Dashboard & Docs", desc: "Streamlit app with filters and charts, plus ASSUMPTIONS.md and METRICS.md documenting every decision." },
];

const topChecks = [
  { name: "Duplicate Keys", description: "Duplicate values in columns that should be unique identifiers." },
  { name: "Schema Drift", description: "Missing columns, unexpected values, or required nulls vs. contract." },
  { name: "Metric Discrepancies", description: "Reported KPIs diverge from recomputed values." },
  { name: "Null Key", description: "Null values in key/identifier columns." },
];

const remainingChecks = [
  { name: "Duplicate Rows", description: "Exact duplicate row detection." },
  { name: "Near-Duplicate Rows", description: "Rows identical on all fields except key columns." },
  { name: "Missing Key Column", description: "Expected key columns not present." },
  { name: "Inconsistent Naming", description: "Mixed casing and formats." },
  { name: "Future Timestamps", description: "Timestamps dated in the future." },
  { name: "Timestamp Gaps", description: "Large gaps between consecutive events." },
  { name: "Negative Values", description: "Unexpected negatives in non-negative columns." },
  { name: "Out-of-Range Values", description: "Values outside expected bounds." },
];

const deliverables = [
  { outcome: "A score your exec team understands", artifact: "Scored Audit Report", description: "0\u2013100 quality score, executive summary, remediation priorities." },
  { outcome: "A production dbt project, not a prototype", artifact: "dbt Project", description: "Staging models, mart models, 40+ schema tests, source defs." },
  { outcome: "A dashboard your team can use on day one", artifact: "Streamlit Dashboard", description: "Interactive charts, sidebar filters, metric breakdowns." },
  { outcome: "Documented assumptions your team can sign off on", artifact: "ASSUMPTIONS.md", description: "Schema, quality, temporal, entity assumptions." },
  { outcome: "Metric definitions everyone agrees on", artifact: "METRICS.md", description: "Definitions, known discrepancies, dimensional cuts." },
];

const personas = [
  { title: "Data Team Leads", description: "You need a baseline before you can prioritize. The audit gives your team a scored starting point and a ranked remediation plan.", href: "/services" },
  { title: "Engineering Managers", description: "You inherited a pipeline and don\u2019t know what\u2019s broken. The audit finds every issue and quantifies the risk.", href: "/approach" },
  { title: "Analytics Engineers", description: "You\u2019re planning a migration and need to know what\u2019s wrong before you move. The audit documents every assumption.", href: "/case-studies" },
];

const scoreBands = [
  { range: "90\u2013100", label: "Production-ready", color: "bg-green-500", description: "Minor issues only." },
  { range: "70\u201389", label: "Usable with caveats", color: "bg-yellow-400", description: "Fix high-severity items first." },
  { range: "50\u201369", label: "Remediation required", color: "bg-orange-500", description: "Significant issues before production use." },
  { range: "Below 50", label: "Serious problems", color: "bg-red-500", description: "Schema and key issues need immediate attention." },
];

const playgroundEnabled =
  process.env.NEXT_PUBLIC_ENABLE_PLAYGROUND === "true";

export default function AuditKitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(auditKitJsonLd) }}
      />

      {/* 1. Hero — Pain-first messaging */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
            Your data pipeline isn&apos;t broken.
            <br />
            <span className="text-bayesiq-500">Your data is.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
            Dashboards lie when the data underneath them is wrong. The BayesIQ
            Audit Kit finds every issue, scores the damage, and hands you
            production-ready fixes — before bad data becomes a bad decision.
          </p>
          <p className="mt-4 text-sm font-medium text-bayesiq-400">
            12+ automated checks &middot; 0&ndash;100 reliability score &middot;
            Production artifacts in minutes
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sample-report"
              className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              See a Sample Report
            </Link>
            {playgroundEnabled ? (
              <Link
                href="/playground"
                className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
              >
                Try the Playground &rarr;
              </Link>
            ) : (
              <Link
                href="/contact"
                className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
              >
                Book an Audit &rarr;
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 2. Score Preview — 0-100 rubric */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            The 0&ndash;100 reliability score
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Every audit produces a single number that summarizes data health.
            Starts at 100, deducts based on finding severity and volume.
          </p>

          {/* CSS-only score gauge */}
          <div className="mx-auto mt-10 max-w-md">
            <div className="h-4 overflow-hidden rounded-full bg-bayesiq-200">
              <div
                className="flex h-full"
                role="img"
                aria-label="Score gauge showing severity bands from red (below 50) through orange, yellow, to green (90-100)"
              >
                <div className="h-full w-[50%] bg-gradient-to-r from-red-500 to-orange-500" />
                <div className="h-full w-[20%] bg-gradient-to-r from-orange-500 to-yellow-400" />
                <div className="h-full w-[20%] bg-gradient-to-r from-yellow-400 to-green-400" />
                <div className="h-full w-[10%] bg-green-500" />
              </div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-bayesiq-400">
              <span>0</span>
              <span>50</span>
              <span>70</span>
              <span>90</span>
              <span>100</span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {scoreBands.map((band) => (
              <div
                key={band.range}
                className="flex items-start gap-3 rounded-xl border border-bayesiq-200 bg-white p-4"
              >
                <span
                  className={`mt-0.5 inline-block h-3 w-3 shrink-0 rounded-full ${band.color}`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-bayesiq-900">
                    {band.range}: {band.label}
                  </p>
                  <p className="text-xs text-bayesiq-600">{band.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Who This Is For — persona cards */}
      <section className="border-t border-bayesiq-200 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Who this is for
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            The Audit Kit is built for teams that need to understand their data
            before they can fix it.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {personas.map((persona) => (
              <ServiceCard
                key={persona.title}
                title={persona.title}
                description={persona.description}
                href={persona.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. What You Walk Away With — deliverables */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            What you walk away with
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Five artifacts. Each one leads with a business outcome, not a file
            name.
          </p>
          <div className="mt-12 space-y-4">
            {deliverables.map((item) => (
              <div
                key={item.artifact}
                className="rounded-xl border border-bayesiq-200 bg-white p-6"
              >
                <p className="text-sm font-medium text-bayesiq-400">
                  {item.outcome}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-bayesiq-900">
                  {item.artifact}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-bayesiq-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/sample-report"
              className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              See what the output looks like &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 5. How It Works — 6-stage pipeline */}
      <section
        id="pipeline"
        className="border-t border-bayesiq-200 px-6 py-20"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Six stages. Raw data in, scored findings and production artifacts
            out.
          </p>
          <div className="mt-12 space-y-8">
            {pipelineStages.map((item) => (
              <div key={item.step} className="flex gap-6">
                <span className="text-2xl font-bold text-bayesiq-300">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-bayesiq-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-bayesiq-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Quality Checks — top 4 prominent, rest collapsible */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            12+ automated quality checks
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Every check produces severity-ranked findings. These four catch the
            issues that cost the most money.
          </p>

          {/* Top 4 money checks */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {topChecks.map((check) => (
              <div
                key={check.name}
                className="rounded-xl border border-bayesiq-200 bg-white p-6"
              >
                <h3 className="text-base font-bold text-bayesiq-900">
                  {check.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                  {check.description}
                </p>
              </div>
            ))}
          </div>

          {/* Remaining 8 checks — native details/summary */}
          <details className="mt-8">
            <summary className="cursor-pointer text-center text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900">
              Show all 8 additional checks
            </summary>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {remainingChecks.map((check) => (
                <div
                  key={check.name}
                  className="rounded-lg border border-bayesiq-200 bg-white p-4"
                >
                  <h3 className="text-sm font-bold text-bayesiq-900">
                    {check.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-bayesiq-600">
                    {check.description}
                  </p>
                </div>
              ))}
            </div>
          </details>

          <div className="mt-8 text-center">
            <Link
              href="/assessment"
              className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              Not sure if you need an audit? Take the 2-minute assessment &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Social Proof — stats bar */}
      <section className="border-t border-bayesiq-200 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { stat: "12+", label: "Automated checks" },
            { stat: "168", label: "Tests per audit" },
            { stat: "7", label: "Broken metrics found in a single audit" },
            { stat: "80%", label: "Reduction in metric debugging time" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-3xl font-bold text-bayesiq-900">{item.stat}</p>
              <p className="mt-1 text-sm text-bayesiq-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Engagement Tiers */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Engagement tiers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Start with a diagnostic to see if there&apos;s a problem. Scale up
            when you&apos;re ready to fix it.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-bayesiq-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-bayesiq-400">
                Diagnostic
              </p>
              <p className="mt-2 text-2xl font-bold text-bayesiq-900">$7.5K</p>
              <p className="mt-3 text-sm leading-relaxed text-bayesiq-600">
                Scored audit report, executive summary, and ranked remediation
                plan. Know what&apos;s broken and how bad it is.
              </p>
            </div>
            <div className="rounded-xl border-2 border-bayesiq-900 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-bayesiq-400">
                Audit + Plan
              </p>
              <p className="mt-2 text-2xl font-bold text-bayesiq-900">$25K</p>
              <p className="mt-3 text-sm leading-relaxed text-bayesiq-600">
                Full audit plus dbt project, Streamlit dashboard, and
                documentation artifacts. Everything you need to start fixing.
              </p>
            </div>
            <div className="rounded-xl border border-bayesiq-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-bayesiq-400">
                Full Implementation
              </p>
              <p className="mt-2 text-2xl font-bold text-bayesiq-900">
                $30&ndash;45K
              </p>
              <p className="mt-3 text-sm leading-relaxed text-bayesiq-600">
                Audit, plan, and hands-on remediation. We fix the issues, deploy
                the models, and hand you a clean pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA */}
      <CTA
        headline="Your data has a score. Find out what it is."
        description={
          playgroundEnabled
            ? "Drop a CSV in the playground — free, instant, no account required. Or book a call to scope a full audit."
            : "Book a call to scope a full audit, or request a sample report to see what the Audit Kit produces."
        }
        buttonText={playgroundEnabled ? "Try the Playground" : "Book an Audit"}
        href={playgroundEnabled ? "/playground" : "/contact"}
      />
    </>
  );
}
