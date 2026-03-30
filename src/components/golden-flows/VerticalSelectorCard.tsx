import Link from "next/link";
import type { HookMetrics } from "@/lib/golden-flows";
import { VerticalClickTracker } from "./VerticalClickTracker";

interface Props {
  slug: string;
  displayName: string;
  metrics: HookMetrics;
  isSelected: boolean;
}

/**
 * Clean SVG icons per vertical — monochrome, minimal, professional.
 * Each icon is 24x24 viewBox, stroke-based for consistency.
 */
function VerticalIcon({ slug }: { slug: string }) {
  const cls = "h-6 w-6 flex-shrink-0";

  switch (slug) {
    case "hospital":
      // Medical cross
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2h8v6h6v8h-6v6H8v-6H2V8h6V2z" />
        </svg>
      );
    case "saas":
      // Cloud with bar chart
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 19a4.5 4.5 0 01-.42-8.98A7 7 0 0119.5 11a4.5 4.5 0 01-.08 9H6.5z" />
          <path d="M10 15v-2M14 15v-4" />
        </svg>
      );
    case "retail":
      // Shopping bag
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2l-2 5v13a1 1 0 001 1h14a1 1 0 001-1V7l-2-5H6z" />
          <path d="M4 7h16" />
          <path d="M9 10a3 3 0 006 0" />
        </svg>
      );
    case "fintech-gf":
    case "fintech":
      // Credit card
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
        </svg>
      );
    case "real-estate":
    case "real_estate":
      // Building
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-4h6v4" />
          <path d="M9 10h1M14 10h1M9 14h1M14 14h1" />
        </svg>
      );
    default:
      // Generic chart
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 2 5-6" />
        </svg>
      );
  }
}

export default function VerticalSelectorCard({
  slug,
  displayName,
  metrics,
  isSelected,
}: Props) {
  return (
    <VerticalClickTracker slug={slug}>
      <Link
        href={`/consulting/explore/${slug}`}
        className={`
          group flex items-center gap-3 rounded-xl px-4 py-3 transition-all
          ${
            isSelected
              ? "border border-biq-border bg-biq-surface-1 shadow-sm text-biq-text-primary"
              : "border border-biq-border bg-biq-surface-0 hover:border-biq-border hover:bg-biq-surface-1/50 text-biq-text-secondary hover:text-biq-text-primary"
          }
        `}
      >
        <span className={isSelected ? "text-biq-text-primary" : "text-biq-text-muted group-hover:text-biq-text-secondary"}>
          <VerticalIcon slug={slug} />
        </span>
        <span className={`text-sm ${isSelected ? "font-bold" : "font-medium"}`}>
          {displayName}
        </span>
      </Link>
    </VerticalClickTracker>
  );
}
