import type { Vertical, HookMetrics } from "@/lib/golden-flows";
import VerticalSelectorCard from "./VerticalSelectorCard";

interface Props {
  verticals: Vertical[];
  hookMetrics: Map<string, HookMetrics>;
  currentSlug?: string;
}

export default function VerticalSelector({
  verticals,
  hookMetrics,
  currentSlug,
}: Props) {
  return (
    <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm pb-4">
      <div className="flex flex-wrap gap-2">
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
            />
          );
        })}
      </div>
    </div>
  );
}
