import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Explore interactive golden flow demonstrations of BayesIQ audit capabilities across industries.",
};

export default function ExplorePage() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
          Explore
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
          Interactive demonstrations of BayesIQ audit capabilities. Coming soon.
        </p>
        <div className="mt-8">
          <Link
            href="/consulting"
            className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
          >
            &larr; Back to Consulting
          </Link>
        </div>
      </div>
    </section>
  );
}
