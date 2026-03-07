import type { Metadata } from "next";
import Link from "next/link";
import CsvPlayground from "@/components/playground/CsvPlayground";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "CSV Playground",
  description:
    "Drop a CSV file and instantly get a profiled Streamlit dashboard app you can download and run locally.",
  openGraph: {
    title: "CSV Playground — BayesIQ",
    description:
      "Drop a CSV file and instantly get a profiled Streamlit dashboard app you can download and run locally.",
  },
};

const playgroundEnabled =
  process.env.NEXT_PUBLIC_ENABLE_PLAYGROUND === "true";

export default function PlaygroundPage() {
  if (!playgroundEnabled) {
    return (
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-bayesiq-900 md:text-4xl">
            CSV Playground
          </h1>
          <p className="mt-4 text-lg text-bayesiq-600">
            The playground is coming soon. Get notified when it launches, or
            book a call to see a live demo.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-bayesiq-900 md:text-4xl">
            CSV Playground
          </h1>
          <p className="mt-4 text-lg text-bayesiq-600">
            Drop a CSV file below. We&apos;ll profile every column and generate a
            ready-to-run Streamlit dashboard you can download and launch locally.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <CsvPlayground />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-xl font-semibold text-bayesiq-900">
            How it works
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Drop your CSV",
                desc: "Everything stays in your browser. No data is uploaded to any server.",
              },
              {
                step: "2",
                title: "Instant profiling",
                desc: "Column types, nulls, cardinality, and top values are detected automatically.",
              },
              {
                step: "3",
                title: "Download your app",
                desc: "Get a Streamlit app.py + requirements.txt tailored to your data.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-lg border border-bayesiq-200 p-6 text-center"
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-bayesiq-900 text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-3 font-semibold text-bayesiq-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-bayesiq-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Paid bridge */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-xl font-semibold text-bayesiq-900">
            Free playground vs. paid audit
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-bayesiq-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-bayesiq-400">
                Playground (free)
              </p>
              <p className="mt-3 text-sm text-bayesiq-600">
                Profile and explore. Column types, nulls, cardinality, top values. Quick look at your data shape.
              </p>
            </div>
            <div className="rounded-lg border border-bayesiq-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-bayesiq-400">
                Diagnostic ($7.5K)
              </p>
              <p className="mt-3 text-sm text-bayesiq-600">
                Real quality checks, metric validation, scored findings with severity rankings, and expert-reviewed remediation readout.
              </p>
            </div>
            <div className="rounded-lg border border-bayesiq-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-bayesiq-400">
                Implementation ($30-45K)
              </p>
              <p className="mt-3 text-sm text-bayesiq-600">
                Governed fix path — dbt project, CI tests, dashboards, monitoring, and a pipeline your team owns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA
        headline="Want a deeper audit?"
        description="The playground profiles your data. A paid engagement validates your metrics, scores your findings, and delivers the fix path."
      />
    </>
  );
}
