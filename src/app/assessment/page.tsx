import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import AssessmentContent from "@/components/assessment/AssessmentContent";
import AssessmentLoading from "@/components/assessment/AssessmentLoading";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Data Quality Self-Assessment",
  description:
    "Answer 6 questions and find out where your data infrastructure stands — with a score, tier assessment, and actionable recommendations.",
  openGraph: {
    title: "Data Quality Self-Assessment — BayesIQ",
    description:
      "Answer 6 questions and find out where your data infrastructure stands — with a score, tier assessment, and actionable recommendations.",
  },
};

// ---------------------------------------------------------------------------
// Page component (server component)
// ---------------------------------------------------------------------------

export default function AssessmentPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-bayesiq-400">
            ~2 minutes · 6 questions · Free
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
            Is your data actually reliable?
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
            Answer 6 questions and find out where your data infrastructure
            stands — and what to do about it.
          </p>
          <p className="mt-3 text-sm text-bayesiq-400">
            You&apos;ll get a score, a tier assessment (At Risk / Needs Work /
            Strong), and tailored recommendations.
          </p>
        </div>
      </section>

      {/* Assessment — client component with useSearchParams, requires Suspense */}
      <section className="border-t border-bayesiq-200 px-6 pb-24 pt-12">
        <Suspense fallback={<AssessmentLoading />}>
          <AssessmentContent />
        </Suspense>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-900 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Want a real answer, not a directional one?
          </h2>
          <p className="mt-4 text-base text-bayesiq-300">
            A BayesIQ audit examines your actual telemetry, pipelines, and
            metric definitions — and gives you a severity-ranked fix plan in
            under two weeks.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-bayesiq-900 transition-colors hover:bg-bayesiq-100"
          >
            Book a free data health check
          </Link>
        </div>
      </section>
    </>
  );
}
