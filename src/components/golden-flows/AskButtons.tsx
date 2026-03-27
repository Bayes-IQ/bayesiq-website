"use client";

import type { ExecutiveQuestion } from "@/lib/golden-flows-ui";
import {
  questionSeverityBorderColor,
  questionSeverityBadgeColors,
} from "@/lib/golden-flows-ui";

interface AskButtonsProps {
  questions: ExecutiveQuestion[];
  activeQuestionId?: string | null;
  onQuestionClick?: (questionId: string) => void;
}

export default function AskButtons({
  questions,
  activeQuestionId,
  onQuestionClick,
}: AskButtonsProps) {
  const flagship = questions.find((q) => q.priority === "flagship");
  const secondary = questions.filter((q) => q.priority === "secondary");

  function handleClick(questionId: string) {
    if (!onQuestionClick) return;
    onQuestionClick(questionId);

    // Scroll to the cascade viewer section
    const el = document.getElementById("cascade-viewer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-biq-text-primary">
        Questions executives are asking
      </h2>

      {/* Flagship question — full-width, prominent */}
      {flagship && (
        <button
          type="button"
          onClick={() => handleClick(flagship.question_id)}
          className={`mt-4 w-full text-left rounded-xl border bg-white p-6 border-l-[3px] transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-biq-primary ${questionSeverityBorderColor(flagship.severity)} ${
            activeQuestionId === flagship.question_id
              ? "ring-2 ring-biq-primary shadow-md"
              : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-lg font-bold text-biq-text-primary">
              {flagship.question_text}
            </p>
            <SeverityBadge severity={flagship.severity} />
          </div>
          <p className="mt-2 text-sm text-biq-text-muted line-clamp-2">
            {flagship.answer_summary}
          </p>
        </button>
      )}

      {/* Secondary questions — 2-column grid */}
      {secondary.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {secondary.map((q) => (
            <button
              key={q.question_id}
              type="button"
              onClick={() => handleClick(q.question_id)}
              className={`rounded-lg border border-biq-border bg-white p-4 text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-biq-primary ${
                activeQuestionId === q.question_id
                  ? "ring-2 ring-biq-primary shadow-md"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-biq-text-primary">
                  {q.question_text}
                </p>
                <SeverityBadge severity={q.severity} />
              </div>
              <p className="mt-1.5 text-xs text-biq-text-muted line-clamp-2">
                {q.answer_summary}
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function SeverityBadge({ severity }: { severity: ExecutiveQuestion["severity"] }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${questionSeverityBadgeColors(severity)}`}
    >
      {severity}
    </span>
  );
}
