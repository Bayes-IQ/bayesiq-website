import type { Vertical, HookMetrics } from "@/lib/golden-flows";
import type { ApprovalStatusValue } from "@/lib/governance";
import VerticalSelectorCard from "./VerticalSelectorCard";

interface Props {
  verticals: Vertical[];
  hookMetrics: Map<string, HookMetrics>;
  currentSlug?: string;
  /** Pre-computed trust statuses keyed by vertical slug */
  trustStatuses?: Record<string, ApprovalStatusValue>;
  /** Pre-computed governance object IDs keyed by vertical slug */
  trustBadgeObjectIds?: Record<string, string>;
}

export default function VerticalSelector({
  verticals,
  hookMetrics,
  currentSlug,
  trustStatuses,
  trustBadgeObjectIds,
}: Props) {
  return (
    <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm pb-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {verticals.map((vertical) => {
          const metrics = hookMetrics.get(vertical.slug);
          if (!metrics) return null;

          return (
            <VerticalSelectorCard
              key={vertical.id}
              slug={vertical.slug}
              displayName={vertical.display_name}
              metrics={metrics}
              isSelected={vertical.slug === currentSlug}
              trustStatus={trustStatuses?.[vertical.slug] ?? null}
              trustBadgeObjectId={trustBadgeObjectIds?.[vertical.slug]}
            />
          );
        })}
      </div>
    </div>
  );
}
