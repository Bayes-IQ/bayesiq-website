"use client";

import Link from "next/link";
import type { AssessmentResult } from "./assessmentTypes";
import type { Tier } from "./assessmentTypes";
import EmailCaptureInline from "./EmailCaptureInline";
import ShareResults from "./ShareResults";

interface ResultsPanelProps {
  result: AssessmentResult;
}

const TIER_ACCENT: Record<string, string> = {
  at_risk: "text-red-600 bg-red-50 border-red-200",
  needs_work: "text-amber-700 bg-amber-50 border-amber-200",
  strong: "text-emerald-700 bg-emerald-50 border-emerald-200",
};

const TIER_SCORE_COLOR: Record<string, string> = {
  at_risk: "text-red-600",
  needs_work: "text-amber-700",
  strong: "text-emerald-700",
};

/** Tier-specific CTA copy and link targets (D-004). */
const TIER_CTA: Record<
  Tier,
  { primary: string; primaryHref: string; secondary: string; secondaryHref: string }
> = {
  at_risk: {
    primary: "Book a diagnostic call",
    primaryHref: "/contact",
    secondary: "See how audits work",
    secondaryHref: "/consulting",
  },
  needs_work: {
    primary: "See what a targeted review finds",
    primaryHref: "/contact",
    secondary: "Explore our approach",
    secondaryHref: "/consulting",
  },
  strong: {
    primary: "See what we find even in strong systems",
    primaryHref: "/consulting/case-studies",
    secondary: "Learn about our process",
    secondaryHref: "/consulting",
  },
};

/**
 * Displays the assessment result: tier, score band, description,
 * recommendations, contextual CTA, share button, and email capture.
 */
export default function ResultsPanel({ result }: ResultsPanelProps) {
  const accentClasses =
    TIER_ACCENT[result.tier] ?? "text-bayesiq-900 bg-bayesiq-50 border-bayesiq-200";
  const scoreColorClass = TIER_SCORE_COLOR[result.tier] ?? "text-bayesiq-900";
  const cta = TIER_CTA[result.tier];

  return (
    <div className="w-full space-y-8">
      {/* Score + Tier */}
      <div
        className={`rounded-xl border px-6 py-6 ${accentClasses}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:gap-4">
          <span
            className={`text-5xl font-bold tabular-nums ${scoreColorClass}`}
            aria-label={`Score: ${result.scorePercent} percent`}
          >
            {result.scorePercent}%
          </span>
          <span className="text-xl font-semibold">{result.tierLabel}</span>
        </div>
        <p className="mt-2 text-sm font-medium">{result.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed opacity-80">{result.description}</p>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-lg font-bold text-bayesiq-900">
          What to do next
        </h2>
        <ol className="mt-4 space-y-4">
          {result.recommendations.map((rec, idx) => (
            <li key={idx} className="flex gap-4">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bayesiq-100 text-xs font-bold text-bayesiq-500"
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-bayesiq-900">
                  {rec.heading}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-bayesiq-600">
                  {rec.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Disclaimers — collapsible */}
      <details className="rounded-lg border border-bayesiq-100 bg-bayesiq-50 px-4 py-3">
        <summary className="cursor-pointer text-xs font-medium text-bayesiq-500">
          About this score
        </summary>
        <div className="mt-2 space-y-2">
          <p className="text-xs leading-relaxed text-bayesiq-400">
            <strong className="font-medium text-bayesiq-500">Directional score:</strong>{" "}
            This score is based on your self-reported answers, not a technical audit of your
            actual systems. Use it as a starting point, not a definitive assessment.
          </p>
          <p className="text-xs leading-relaxed text-bayesiq-400">
            <strong className="font-medium text-bayesiq-500">Not a compliance audit:</strong>{" "}
            This assessment does not evaluate regulatory requirements (e.g., GDPR, CCPA, HIPAA).
          </p>
        </div>
      </details>

      {/* Email capture */}
      <EmailCaptureInline
        source="assessment"
        tier={result.tier}
        scoreRange={`${result.scorePercent}%`}
      />

      {/* CTAs */}
      <div className="border-t border-bayesiq-200 pt-6">
        <p className="text-sm text-bayesiq-600">{result.ctaSubtext}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={cta.primaryHref}
            className="rounded-lg bg-bayesiq-900 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            data-event="cta_click"
            data-location="assessment_results"
          >
            {cta.primary}
          </Link>
          <Link
            href={cta.secondaryHref}
            className="rounded-lg border border-bayesiq-300 px-6 py-3 text-center text-sm font-medium text-bayesiq-700 transition-colors hover:border-bayesiq-500 hover:text-bayesiq-900"
          >
            {cta.secondary}
          </Link>
          <ShareResults
            scorePercent={result.scorePercent}
            tier={result.tier}
          />
        </div>
      </div>
    </div>
  );
}
