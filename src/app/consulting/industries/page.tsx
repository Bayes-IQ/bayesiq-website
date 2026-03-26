import type { Metadata } from "next";
import Link from "next/link";
import IndustryTabs from "@/components/consulting/IndustryTabs";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "BayesIQ works across Fintech, Healthcare, SaaS, and Real Estate to audit data pipelines, validate metrics, and deliver governed analytics.",
  openGraph: {
    title: "Industries — BayesIQ Consulting",
    description:
      "Industry-specific data auditing for Fintech, Healthcare, SaaS, and Real Estate.",
  },
};

export default function IndustriesPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-biq-text-primary md:text-5xl">
            Industries We Serve
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-biq-text-secondary">
            Every industry has its own failure patterns. We know what breaks in
            each one because we have audited it.
          </p>
          <p className="mt-4 text-sm text-biq-text-muted">
            <Link
              href="/consulting"
              className="font-medium text-biq-text-secondary transition-colors hover:text-biq-text-primary"
            >
              &larr; Back to Consulting
            </Link>
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-t border-biq-border px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <IndustryTabs />
        </div>
      </section>

      {/* Bottom CTA */}
      <CTA
        headline="Every audit starts with a one-week diagnostic."
        description="Find out what's broken in your data before it reaches a board deck, a regulatory filing, or an investor pitch."
        buttonText="Book a Diagnostic"
      />
    </>
  );
}
