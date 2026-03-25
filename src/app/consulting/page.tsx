import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Consulting",
  description:
    "BayesIQ consulting services: data audits, metric validation, pipeline remediation, and governed analytics delivery across industries.",
};

export default function ConsultingPage() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
          Consulting
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
          Data audits, metric validation, and pipeline remediation for teams
          that need trustworthy analytics.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/consulting/case-studies"
            className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
          >
            Case Studies &rarr;
          </Link>
          <Link
            href="/consulting/sample-report"
            className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
          >
            Sample Report &rarr;
          </Link>
          <Link
            href="/contact"
            className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
