import type { DiscoverInsights as DiscoverInsightsPayload } from "@/types/golden-flows/contract-b/discover_insights";

interface DiscoverInsightsProps {
  data: DiscoverInsightsPayload;
}

export default function DiscoverInsights({ data }: DiscoverInsightsProps) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold tracking-tight text-biq-text-secondary">
        Discover more insights
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.insights.map((insight) => (
          <a
            key={insight.insight_id}
            href={insight.dashboard_link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-biq-border bg-biq-surface-0 p-4 transition-colors hover:border-biq-text-muted"
          >
            <p className="text-sm font-medium text-biq-text-primary">
              {insight.question_text}
            </p>
            <span className="mt-2 inline-block text-xs font-medium text-biq-text-muted">
              View in Dashboard &rarr;
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
