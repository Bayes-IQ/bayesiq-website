import type { VerticalNarrative } from "@/lib/golden-flows";

interface Props {
  narrative: VerticalNarrative;
}

export default function StatusQuoComparison({ narrative }: Props) {
  return (
    <section className="mt-8">
      <p className="text-lg font-semibold text-biq-text-primary mb-4">
        {narrative.headline_finding}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Status Quo column */}
        <div className="rounded-xl bg-biq-status-error-subtle border border-biq-status-error-subtle p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-biq-status-error mb-3">
            Without BayesIQ
          </h3>
          <p className="text-biq-text-secondary leading-relaxed">
            {narrative.status_quo}
          </p>
        </div>

        {/* With BayesIQ column */}
        <div className="rounded-xl bg-biq-status-success-subtle border border-biq-status-success-subtle p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-biq-status-success mb-3">
            With BayesIQ
          </h3>
          <p className="text-biq-text-secondary leading-relaxed">
            {narrative.with_bayesiq}
          </p>
        </div>
      </div>
    </section>
  );
}
