import type { BoardReportRisk } from "@/lib/golden-flows";

interface Props {
  risks: BoardReportRisk[];
}

function SeverityIcon({ severity }: { severity: string }) {
  switch (severity) {
    case "high":
      return (
        <svg
          className="h-5 w-5 text-biq-status-error flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      );
    case "medium":
      return (
        <svg
          className="h-5 w-5 text-biq-status-warning flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="h-5 w-5 text-biq-status-success flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
}

function severityBadge(severity: string): string {
  switch (severity) {
    case "high":
      return "bg-biq-status-error-subtle text-biq-status-error";
    case "medium":
      return "bg-biq-status-warning-subtle text-biq-status-warning";
    default:
      return "bg-biq-status-success-subtle text-biq-status-success";
  }
}

export default function WhyThisMatters({ risks }: Props) {
  if (!risks || risks.length === 0) return null;

  const displayed = risks.slice(0, 3);

  return (
    <section className="mt-12" data-testid="why-this-matters">
      <h2 className="text-lg font-bold tracking-tight text-biq-text-primary mb-4">
        Why this matters
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((risk) => (
          <div
            key={risk.title}
            className="rounded-xl border border-biq-border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <SeverityIcon severity={risk.severity} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-biq-text-primary leading-snug">
                    {risk.title}
                  </h3>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severityBadge(risk.severity)}`}
                  >
                    {risk.severity}
                  </span>
                </div>
                <p className="text-xs text-biq-text-secondary leading-relaxed">
                  {risk.business_impact}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
