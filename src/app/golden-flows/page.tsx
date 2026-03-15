import type { Metadata } from "next";
import { getVerticals, getGoldenFlowsState, getAllHookMetrics } from "@/lib/golden-flows";
import VerticalSelector from "@/components/golden-flows/VerticalSelector";

export const metadata: Metadata = {
  title: "Golden Flows — BayesIQ",
  description:
    "See what BayesIQ finds in real data across five verticals. Governed audit results, executive-ready.",
};

export default function GoldenFlowsHub() {
  const verticals = getVerticals();
  const state = getGoldenFlowsState();
  const hookMetrics = getAllHookMetrics();

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

      <div className="mt-12">
        <VerticalSelector
          verticals={verticals}
          hookMetrics={hookMetrics}
        />
      </div>
    </main>
  );
}
