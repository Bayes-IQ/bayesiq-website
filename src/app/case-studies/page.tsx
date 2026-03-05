import type { Metadata } from "next";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Live Demo",
  description:
    "Interactive dashboards showing what a BayesIQ audit delivers — across SaaS, Fintech, IoT, and CRM.",
  openGraph: {
    title: "Live Demo — BayesIQ",
    description:
      "Interactive dashboards showing what a BayesIQ audit delivers — across SaaS, Fintech, IoT, and CRM.",
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900">
            Live Demo
          </h1>
          <p className="mt-4 text-lg text-bayesiq-600">
            This is what a BayesIQ engagement delivers. Pick an industry from
            the sidebar to explore validated metrics, data quality findings, and
            profiling — all generated automatically from raw data.
          </p>
          <p className="mt-2 text-sm text-bayesiq-400">
            Built with demo datasets. Your dashboard would use your actual warehouse data.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-bayesiq-200">
            <iframe
              src="https://bayesiq-dashboard-acme.streamlit.app/?embedded=true"
              width="100%"
              height="800"
              style={{ border: "none" }}
              title="BayesIQ Dashboard Demo"
              allow="clipboard-write"
            />
          </div>
        </div>
      </section>

      <CTA
        headline="What would your dashboard look like?"
        description="We go from your warehouse to validated dashboards in 6 weeks. Start with a diagnostic sprint to see what we find."
      />
    </>
  );
}
