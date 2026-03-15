import type { VerticalNarrative } from "@/lib/golden-flows";

interface Props {
  narrative: VerticalNarrative;
}

export default function StatusQuoComparison({ narrative }: Props) {
  return (
    <section className="mt-8">
      <p className="text-lg font-semibold text-bayesiq-900 mb-4">
        {narrative.headline_finding}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Status Quo column */}
        <div className="rounded-xl bg-red-50 border border-red-200 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-red-700 mb-3">
            Without BayesIQ
          </h3>
          <p className="text-bayesiq-700 leading-relaxed">
            {narrative.status_quo}
          </p>
        </div>

        {/* With BayesIQ column */}
        <div className="rounded-xl bg-green-50 border border-green-200 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-green-700 mb-3">
            With BayesIQ
          </h3>
          <p className="text-bayesiq-700 leading-relaxed">
            {narrative.with_bayesiq}
          </p>
        </div>
      </div>
    </section>
  );
}
