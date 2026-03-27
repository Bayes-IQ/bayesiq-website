"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Tier } from "./assessmentTypes";
import AssessmentWizard from "./AssessmentWizard";

const VALID_TIERS: Tier[] = ["at_risk", "needs_work", "strong"];

const TIER_LABELS: Record<Tier, string> = {
  at_risk: "At Risk",
  needs_work: "Needs Work",
  strong: "Strong",
};

const TIER_ACCENT: Record<Tier, string> = {
  at_risk: "text-biq-status-error bg-biq-status-error-subtle border-biq-status-error-subtle",
  needs_work: "text-biq-status-warning bg-biq-status-warning-subtle border-biq-status-warning-subtle",
  strong: "text-biq-status-success bg-emerald-50 border-emerald-200",
};

const TIER_SCORE_COLOR: Record<Tier, string> = {
  at_risk: "text-biq-status-error",
  needs_work: "text-biq-status-warning",
  strong: "text-biq-status-success",
};

/**
 * Client component that reads ?score= and ?tier= search params.
 * If share params are present, renders a shared results view.
 * Otherwise, renders the assessment wizard.
 *
 * Must be wrapped in <Suspense> at the page level (Next.js App Router requirement).
 */
export default function AssessmentContent() {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const tierParam = searchParams.get("tier");

  // Check if we have valid share params
  const score = scoreParam ? parseInt(scoreParam, 10) : null;
  const tier = tierParam as Tier | null;
  const isSharedView =
    score !== null &&
    !isNaN(score) &&
    score >= 0 &&
    score <= 100 &&
    tier !== null &&
    VALID_TIERS.includes(tier);

  if (isSharedView && tier) {
    const accentClasses = TIER_ACCENT[tier];
    const scoreColor = TIER_SCORE_COLOR[tier];
    const tierLabel = TIER_LABELS[tier];

    return (
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-biq-text-muted">
            Shared Assessment Result
          </p>
          <div
            className={`mt-8 rounded-xl border px-8 py-10 ${accentClasses}`}
          >
            <span
              className={`text-6xl font-bold tabular-nums ${scoreColor}`}
              aria-label={`Score: ${score} percent`}
            >
              {score}%
            </span>
            <p className={`mt-3 text-xl font-semibold ${scoreColor}`}>
              {tierLabel}
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <p className="text-base text-biq-text-secondary">
              Someone shared their data quality assessment results with you.
              <br />
              Take the assessment to see how your data infrastructure compares.
            </p>
            <Link
              href="/assessment"
              className="inline-block rounded-lg bg-biq-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-biq-primary-hover"
            >
              Take the assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <AssessmentWizard />
    </div>
  );
}
