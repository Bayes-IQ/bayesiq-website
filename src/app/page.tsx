import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "BayesIQ — Find Broken Metrics. Get the Fix Path.",
  description:
    "BayesIQ finds broken metrics and broken data pipelines fast. Drop a CSV, get a 0-100 quality score, a dbt project, and a Streamlit dashboard.",
  openGraph: {
    title: "BayesIQ — Find Broken Metrics. Get the Fix Path.",
    description:
      "Drop a CSV, get a 0-100 quality score, a dbt project, and a Streamlit dashboard. 12+ automated quality checks with production-ready output.",
  },
};

const playgroundEnabled =
  process.env.NEXT_PUBLIC_ENABLE_PLAYGROUND === "true";

export default function HomePage() {
  redirect("/golden-flows/fintech-gf");
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
            Drop a CSV. Get a scored audit,
            <br />
            <span className="text-bayesiq-500">
              a dbt project, and a dashboard.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
            BayesIQ finds broken metrics and broken data pipelines fast, then
            gives you the fix path. Point the Audit Kit at any CSV, Parquet, or
            Snowflake dataset — get a 0-100 quality score, a dbt project, and
            an interactive Streamlit dashboard.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {playgroundEnabled ? (
              <Link
                href="/playground"
                className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
              >
                Try the Playground
              </Link>
            ) : (
              <Link
                href="/contact"
                className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
              >
                Book a Demo
              </Link>
            )}
            <Link
              href="/contact"
              className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              Talk to us &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* The Audit Kit */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            The Data Audit Kit
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bayesiq-600">
            Drop data in. We find what&apos;s broken. Then we help fix it.
          </p>
          <div className="mt-12">
            <div className="rounded-xl border border-bayesiq-200 bg-white p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-bold text-bayesiq-900">
                    What it checks
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-bayesiq-600">
                    <li className="flex gap-2">
                      <span className="text-bayesiq-400">&bull;</span>
                      Duplicates, naming chaos, schema drift, timestamp gaps,
                      null spikes, near-duplicates
                    </li>
                    <li className="flex gap-2">
                      <span className="text-bayesiq-400">&bull;</span>
                      Metric validation — recompute KPIs from raw data, flag
                      discrepancies
                    </li>
                    <li className="flex gap-2">
                      <span className="text-bayesiq-400">&bull;</span>
                      LLM-powered column interpretation via Claude API
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-bayesiq-900">
                    What you get
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-bayesiq-600">
                    <li className="flex gap-2">
                      <span className="text-bayesiq-400">&bull;</span>
                      Scored audit report on a 0-100 rubric
                    </li>
                    <li className="flex gap-2">
                      <span className="text-bayesiq-400">&bull;</span>
                      Generated dbt project — staging and mart models, 40+
                      schema tests
                    </li>
                    <li className="flex gap-2">
                      <span className="text-bayesiq-400">&bull;</span>
                      Generated Streamlit dashboard with interactive charts and
                      filters
                    </li>
                    <li className="flex gap-2">
                      <span className="text-bayesiq-400">&bull;</span>
                      ASSUMPTIONS.md and METRICS.md documentation
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-xs text-bayesiq-400">
                Tested on SaaS events, financial transactions, IoT sensor data,
                and CRM exports.
              </p>
            </div>
          </div>

          {/* Platform — subordinate */}
          <div className="mt-12 rounded-lg border border-bayesiq-100 bg-white/60 p-6">
            <div className="flex items-start gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-bayesiq-400">
                  Also from BayesIQ
                </p>
                <h3 className="mt-1 text-base font-bold text-bayesiq-900">
                  BayesIQ Platform
                </h3>
                <p className="mt-2 text-sm text-bayesiq-600">
                  The execution layer behind BayesIQ workflows — tool registry,
                  policy engine, approval gateway, and audit trails. Every
                  automated action is validated, gated, and logged.
                </p>
                <Link
                  href="/services"
                  className="mt-3 inline-block text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
                >
                  Learn more &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the Audit Kit Works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            How the Audit Kit works
          </h2>
          <div className="mt-12 space-y-8">
            {[
              {
                step: "01",
                title: "Drop CSV",
                desc: "Upload a CSV, point at a Parquet file, or connect to Snowflake. No SDK, no config file.",
              },
              {
                step: "02",
                title: "Profile & Check",
                desc: "The pipeline runs 12+ automated quality checks — duplicates, schema drift, null spikes, timestamp gaps, naming conventions, near-duplicates — and recomputes your KPIs from raw data.",
              },
              {
                step: "03",
                title: "Generate dbt + Dashboard",
                desc: "You get a scored audit report (0-100), a complete dbt project with staging models, mart models, and 40+ schema tests, plus a Streamlit dashboard with interactive charts and metric breakdowns.",
              },
              {
                step: "04",
                title: "Download & Deploy",
                desc: "Download the full output — dbt project, dashboard code, ASSUMPTIONS.md, METRICS.md. Run dbt build, launch the dashboard, ship to production.",
              },
            ].map((item) => (
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

      {/* Key Stats */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bayesiq-400">
            Results from recent engagements
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-5">
            {[
              { stat: "12+", label: "automated quality checks" },
              { stat: "168", label: "tests across 12 modules" },
              { stat: "7", label: "broken metrics found in a single audit" },
              { stat: "80%", label: "reduction in metric debugging time" },
              { stat: "< 2 weeks", label: "from kickoff to actionable findings" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-3xl font-bold text-bayesiq-900">
                  {item.stat}
                </p>
                <p className="mt-2 text-sm text-bayesiq-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Tiers */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            Engagement tiers
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <ServiceCard
              title="Diagnostic — $7.5K"
              description="Prove where the problems are. Automated audit of one dataset with scored report, quality checks, and a summary of every issue found. Delivered in days."
              href="/contact"
            />
            <ServiceCard
              title="Audit + Plan — $25K"
              description="Define what correct should be. Full audit across multiple sources, metric recomputation, assumptions document with team sign-off, and a prioritized remediation roadmap."
              href="/contact"
            />
            <ServiceCard
              title="Full Implementation — $30-45K"
              description="Ship the governed fix path. Everything in Audit + Plan, plus deployed dbt project, CI tests, monitoring, and a production pipeline your team owns."
              href="/contact"
            />
          </div>
        </div>
      </section>

      <CTA
        headline="Your data has problems. Let's find them."
        description="Try the playground with your own CSV, or book a call to scope a full audit."
        buttonText="Book an Audit"
      />
    </>
  );
}
