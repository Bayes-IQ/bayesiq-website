import type { ExecutiveQuestion } from "@/lib/golden-flows";
import {
  questionSeverityBorderColor,
  questionSeverityBadgeColors,
} from "@/lib/golden-flows";

interface AskButtonsProps {
  questions: ExecutiveQuestion[];
}

export default function AskButtons({ questions }: AskButtonsProps) {
  const flagship = questions.find((q) => q.priority === "flagship");
  const secondary = questions.filter((q) => q.priority === "secondary");

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-bayesiq-900">
        Questions executives are asking
      </h2>

      {/* Flagship question — full-width, prominent */}
      {flagship && (
        <div
          className={`mt-4 rounded-xl border bg-white p-6 border-l-[3px] ${questionSeverityBorderColor(flagship.severity)}`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-lg font-bold text-bayesiq-900">
              {flagship.question_text}
            </p>
            <SeverityBadge severity={flagship.severity} />
          </div>
          <p className="mt-2 text-sm text-bayesiq-500 line-clamp-2">
            {flagship.answer_summary}
          </p>
        </div>
      )}

      {/* Secondary questions — 2-column grid */}
      {secondary.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {secondary.map((q) => (
            <div
              key={q.question_id}
              className="rounded-lg border border-bayesiq-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-bayesiq-900">
                  {q.question_text}
                </p>
                <SeverityBadge severity={q.severity} />
              </div>
              <p className="mt-1.5 text-xs text-bayesiq-400 line-clamp-2">
                {q.answer_summary}
              </p>
            </div>
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
