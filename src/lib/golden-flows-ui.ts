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
      return "border-red-600";
    case "high":
      return "border-amber-500";
    case "medium":
      return "border-yellow-400";
    case "low":
      return "border-green-500";
  }
}

export function questionSeverityBadgeColors(level: QuestionSeverity): string {
  switch (level) {
    case "critical":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-amber-100 text-amber-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
  }
}
