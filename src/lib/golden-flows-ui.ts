/**
 * Golden Flows — Client-safe UI utilities
 *
 * Pure types and helper functions that can be imported by "use client"
 * components without pulling in Node.js `fs` dependencies.
 *
 * Server-only loaders remain in golden-flows.ts.
 */

// ============================================================
// Types (re-exported for convenience)
// ============================================================

export type QuestionSeverity = "critical" | "high" | "medium" | "low";

export interface ExecutiveQuestion {
  question_id: string;
  priority: "flagship" | "secondary";
  question_text: string;
  answer_summary: string;
  severity: QuestionSeverity;
}

// ============================================================
// Severity color helpers
// ============================================================

export function questionSeverityBorderColor(level: QuestionSeverity): string {
  switch (level) {
    case "critical":
      return "border-biq-status-error";
    case "high":
      return "border-biq-status-warning";
    case "medium":
      return "border-yellow-400";
    case "low":
      return "border-biq-status-success";
  }
}

export function questionSeverityBadgeColors(level: QuestionSeverity): string {
  switch (level) {
    case "critical":
      return "bg-biq-status-error-subtle text-biq-status-error";
    case "high":
      return "bg-biq-status-warning-subtle text-biq-status-warning";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-biq-status-success-subtle text-biq-status-success";
  }
}
