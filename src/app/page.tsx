import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BayesIQ — Governed Analytics",
  description:
    "BayesIQ delivers governed analytics consulting and a platform for teams that need trustworthy metrics, auditable pipelines, and evidence-backed decisions.",
};

export default function HomePage() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
          BayesIQ — Governed Analytics
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
          We help teams find broken metrics, fix data pipelines, and build
          governed analytics infrastructure they can trust.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/consulting"
            className="rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
          >
            Consulting
          </Link>
          <Link
            href="/platform"
            className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
          >
            Platform &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
