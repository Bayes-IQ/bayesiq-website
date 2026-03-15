import Link from "next/link";
import type { HookMetrics, SeverityLevel } from "@/lib/golden-flows";
import {
  severityBorderColor,
  severityTextColor,
} from "@/lib/golden-flows";
import { VerticalClickTracker } from "./VerticalClickTracker";

interface Props {
  slug: string;
  displayName: string;
  metrics: HookMetrics;
  isSelected: boolean;
}

function ScoreGauge({
  score,
  severity,
}: {
  score: number;
  severity: SeverityLevel;
}) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const colorClass = severityTextColor(severity);

  return (
    <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center">
      <svg
        className="h-12 w-12 -rotate-90"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-bayesiq-100"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      <span
        className={`absolute text-sm font-bold ${colorClass}`}
        aria-label={`Score: ${score} out of 100`}
      >
        {score}
      </span>
    </div>
  );
}

export default function VerticalSelectorCard({
  slug,
  displayName,
  metrics,
  isSelected,
}: Props) {
  const borderColor = severityBorderColor(metrics.severity_level);

  return (
    <VerticalClickTracker slug={slug}>
    <Link
      href={`/golden-flows/${slug}`}
      className={`
        group flex gap-4 rounded-xl border-l-[3px] p-4 transition-all
        ${borderColor}
        ${
          isSelected
            ? "border border-l-[3px] border-bayesiq-300 bg-bayesiq-50 shadow-sm"
            : "border border-l-[3px] border-bayesiq-200 bg-white hover:border-bayesiq-300 hover:bg-bayesiq-50/50"
        }
      `}
    >
      <ScoreGauge score={metrics.score} severity={metrics.severity_level} />

      <div className="min-w-0 flex-1">
        <h3
          className={`text-sm leading-tight ${
            isSelected
              ? "font-bold text-bayesiq-900"
              : "font-semibold text-bayesiq-800"
          }`}
        >
          {displayName}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-bayesiq-700 line-clamp-1">
          {metrics.discrepancy_headline}
        </p>
        <p className="mt-0.5 text-xs text-bayesiq-500 line-clamp-2">
          {metrics.consequence}
        </p>
        <p className="mt-1 text-[10px] text-bayesiq-400">
          {metrics.trust_cue}
        </p>
      </div>
    </Link>
    </VerticalClickTracker>
  );
}
