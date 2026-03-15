import type { Metadata } from "next";
import Link from "next/link";
import { getVerticals, getGoldenFlowsState } from "@/lib/golden-flows";

export const metadata: Metadata = {
  title: "Golden Flows — BayesIQ",
  description:
    "See what BayesIQ finds in real data across five verticals. Governed audit results, executive-ready.",
};

export default function GoldenFlowsHub() {
  const verticals = getVerticals();
  const state = getGoldenFlowsState();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-bayesiq-900 sm:text-4xl">
        Golden Flows
      </h1>
      <p className="mt-4 text-lg text-bayesiq-600">
        Real audit results across five verticals. Pick one to see what BayesIQ finds.
      </p>

      {state === "hidden" && (
        <p className="mt-2 text-sm text-bayesiq-400">
          Preview mode — not publicly listed.
        </p>
      )}

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {verticals.map((vertical) => (
          <Link
            key={vertical.id}
            href={`/golden-flows/${vertical.slug}`}
            className="rounded-xl border border-bayesiq-200 p-6 transition-colors hover:border-bayesiq-400 hover:bg-bayesiq-50"
          >
            <h2 className="text-lg font-semibold text-bayesiq-900">
              {vertical.display_name}
            </h2>
            <p className="mt-1 text-sm text-bayesiq-500">
              {vertical.status === "ready"
                ? "Audit results available"
                : "Coming soon"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
