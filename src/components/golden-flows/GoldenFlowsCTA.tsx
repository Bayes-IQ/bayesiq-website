"use client";

import Link from "next/link";
import { trackCtaClick } from "@/lib/gf-analytics";

interface GoldenFlowsCTAProps {
  ctaLabel?: string;
  vertical?: string;
}

export default function GoldenFlowsCTA({
  ctaLabel,
  vertical,
}: GoldenFlowsCTAProps) {
  const diagnosticHeadline = ctaLabel ?? "Book a Data Diagnostic";

  return (
    <div className="mt-16 space-y-0">
      {/* Section 1 — Diagnostic Entry Point */}
      <section className="rounded-t-xl bg-bayesiq-900 px-6 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {diagnosticHeadline}
          </h2>
          <p className="mt-4 text-lg text-bayesiq-300">
            A focused $7,500 engagement. We audit your{" "}
            {vertical ? vertical.toLowerCase() : ""} data, score your metrics,
            and deliver a remediation roadmap in 2 weeks.
          </p>
          <Link
            href="/contact"
            onClick={() => trackCtaClick("diagnostic", vertical || "unknown")}
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-bayesiq-900 transition-colors hover:bg-bayesiq-100"
          >
            Book a diagnostic
          </Link>
        </div>
      </section>

      {/* Section 2 — Monthly Reliability Program */}
      <section className="bg-bayesiq-50 px-6 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900 sm:text-3xl">
            Monthly Metric Reliability Program
          </h2>
          <p className="mt-4 text-lg text-bayesiq-600">
            Ongoing monitoring, governed corrections, and executive-ready
            reporting. Starting at $2,500/month.
          </p>
          <Link
            href="/services"
            onClick={() => trackCtaClick("reliability", vertical || "unknown")}
            className="mt-8 inline-block rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* Section 3 — Book a Session */}
      <section className="rounded-b-xl border border-bayesiq-200 bg-white px-6 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-bayesiq-900 sm:text-3xl">
            Not sure where to start?
          </h2>
          <p className="mt-4 text-lg text-bayesiq-600">
            Book 20&ndash;30 minutes. We&apos;ll tell you honestly what we see.
          </p>
          <a
            href="https://calendly.com/bayesiq/30min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick("book_session", vertical || "unknown")}
            className="mt-8 inline-block rounded-lg border border-bayesiq-900 bg-white px-6 py-3 text-sm font-medium text-bayesiq-900 transition-colors hover:bg-bayesiq-50"
          >
            Book a call
          </a>
        </div>
      </section>
    </div>
  );
}
