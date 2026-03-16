import type { DiscoverInsights as DiscoverInsightsPayload } from "@/types/golden-flows/contract-b/discover_insights";

interface DiscoverInsightsProps {
  data: DiscoverInsightsPayload;
}

export default function DiscoverInsights({ data }: DiscoverInsightsProps) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold tracking-tight text-bayesiq-700">
        Discover more insights
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.insights.map((insight) => (
          <div
            key={insight.insight_id}
            className="rounded-lg border border-bayesiq-200 bg-white p-4"
          >
            <p className="text-sm font-medium text-bayesiq-800">
              {insight.question_text}
            </p>
            <span className="mt-2 inline-block text-xs text-bayesiq-300">
              Dashboard preview coming soon
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
