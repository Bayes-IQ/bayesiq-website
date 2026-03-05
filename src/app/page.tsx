import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import CTA from "@/components/CTA";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
            Your analytics are lying to you.
            <br />
            <span className="text-bayesiq-500">We find out where.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
            BayesIQ audits telemetry, analytics pipelines, and business metrics
            using AI-assisted analysis — so you can trust your data and move
            faster with it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Book a Free Data Health Check
            </Link>
            <Link
              href="/approach"
              className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              See how it works &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            Bad data fails silently
          </h2>
          <p className="mt-4 text-base leading-relaxed text-bayesiq-600">
            Metrics drift from their definitions. Telemetry events stop firing
            or fire incorrectly. Pipelines break without anyone noticing. By the
            time a dashboard looks wrong, the underlying problem has been
            compounding for weeks.
          </p>
          <p className="mt-4 text-base leading-relaxed text-bayesiq-600">
            Traditional debugging is slow and expensive — teams spend days
            chasing issues across instrumentation, pipelines, and queries with
            no structured approach. BayesIQ fixes this.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            What we do
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <ServiceCard
              title="Data Quality Audit"
              description="Full evaluation of telemetry accuracy, metric reliability, and pipeline health. We find the specific broken metrics and tell you how to fix them."
            />
            <ServiceCard
              title="Telemetry Validation"
              description="Compare what your logging spec says vs. what actually fires. Field-level validation of every event, every required property."
            />
            <ServiceCard
              title="Pipeline Design"
              description="ETL architecture review or greenfield design. Metrics layer definition. Reliability improvements for data systems that need to scale."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-bayesiq-900">
            How it works
          </h2>
          <div className="mt-12 space-y-8">
            {[
              {
                step: "01",
                title: "Engage",
                desc: "We learn your data architecture, logging specs, and pain points. 1-2 days of collaborative discovery.",
              },
              {
                step: "02",
                title: "Audit",
                desc: "AI agents scan your telemetry, pipelines, and metrics. Data scientists review findings and eliminate false positives.",
              },
              {
                step: "03",
                title: "Fix",
                desc: "You get a severity-ranked report with root cause analysis and specific fix recommendations. Not vague suggestions — actionable steps.",
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

      {/* Social proof placeholder */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bayesiq-400">
            Results from recent engagements
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              { stat: "7", label: "broken metrics found in a single audit" },
              { stat: "80%", label: "reduction in metric debugging time" },
              { stat: "< 2 weeks", label: "from kickoff to actionable findings" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-3xl font-bold text-bayesiq-900">{item.stat}</p>
                <p className="mt-2 text-sm text-bayesiq-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        headline="Let's find out what your data is hiding."
        description="Book a free data health check. We'll tell you what we'd look at and what we'd expect to find."
        buttonText="Book a Free Data Health Check"
      />
    </>
  );
}
