"use client";

import Link from "next/link";
import type { AssessmentResult } from "./assessmentTypes";
import EmailCaptureInline from "./EmailCaptureInline";

interface ResultsPanelProps {
  result: AssessmentResult;
}

const TIER_ACCENT: Record<string, string> = {
  at_risk: "text-biq-status-error bg-biq-status-error-subtle border-biq-status-error-subtle",
  needs_work: "text-biq-status-warning bg-biq-status-warning-subtle border-biq-status-warning-subtle",
  strong: "text-biq-status-success bg-emerald-50 border-emerald-200",
};

const TIER_SCORE_COLOR: Record<string, string> = {
  at_risk: "text-biq-status-error",
  needs_work: "text-biq-status-warning",
  strong: "text-biq-status-success",
};

/**
 * Displays the assessment result: tier, score band, description,
 * recommendations, CTA, and email capture.
 */
export default function ResultsPanel({ result }: ResultsPanelProps) {
  const accentClasses =
    TIER_ACCENT[result.tier] ?? "text-biq-text-primary bg-biq-surface-1 border-biq-border";
  const scoreColorClass = TIER_SCORE_COLOR[result.tier] ?? "text-biq-text-primary";

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
        <h2 className="text-lg font-bold text-biq-text-primary">
          What to do next
        </h2>
        <ol className="mt-4 space-y-4">
          {result.recommendations.map((rec, idx) => (
            <li key={idx} className="flex gap-4">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-biq-surface-2 text-xs font-bold text-biq-text-muted"
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-biq-text-primary">
                  {rec.heading}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-biq-text-secondary">
                  {rec.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Disclaimers */}
      <div className="rounded-lg border border-biq-border-subtle bg-biq-surface-1 px-4 py-4">
        <p className="text-xs leading-relaxed text-biq-text-muted">
          <strong className="font-medium text-biq-text-muted">Directional score:</strong>{" "}
          This score is based on your self-reported answers, not a technical audit of your
          actual systems. Use it as a starting point, not a definitive assessment.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-biq-text-muted">
          <strong className="font-medium text-biq-text-muted">Not a compliance audit:</strong>{" "}
          This assessment does not evaluate regulatory requirements (e.g., GDPR, CCPA, HIPAA).
        </p>
      </div>

      {/* Email capture */}
      <EmailCaptureInline
        source="assessment"
        tier={result.tier}
        scoreRange={`${result.scorePercent}%`}
      />

      {/* CTAs */}
      <div className="border-t border-biq-border pt-6">
        <p className="text-sm text-biq-text-secondary">{result.ctaSubtext}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-lg bg-biq-primary px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-biq-primary-hover"
            data-event="cta_click"
            data-location="assessment_results"
          >
            Talk to an expert
          </Link>
          <Link
            href="/consulting"
            className="rounded-lg border border-biq-border px-6 py-3 text-center text-sm font-medium text-biq-text-secondary transition-colors hover:border-biq-primary hover:text-biq-text-primary"
          >
            See how audits work
          </Link>
        </div>
      </div>
    </div>
  );
}
