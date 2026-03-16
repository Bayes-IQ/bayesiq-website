"use client";

import type { CascadeEntry } from "@/types/golden-flows/contract-b/cascade_data";
import type { ApprovalStatusValue } from "@/lib/governance";
import CascadeCard from "./CascadeCard";

interface CascadeViewerProps {
  /** All cascade entries for this vertical, keyed by question_id */
  cascades: Record<string, CascadeEntry>;
  /** When set, only show the cascade for this question */
  activeQuestionId?: string | null;
  /** Optional governance status lookup for cascade questions */
  getCascadeGovernanceStatus?: (questionId: string) => ApprovalStatusValue | null;
  /** Callback to open governance detail panel */
  onGovernanceDetail?: (objectId: string, objectType: "finding" | "question") => void;
}

export default function CascadeViewer({
  cascades,
  activeQuestionId,
  getCascadeGovernanceStatus,
  onGovernanceDetail,
}: CascadeViewerProps) {
  const entries = activeQuestionId
    ? cascades[activeQuestionId]
      ? [cascades[activeQuestionId]]
      : []
    : Object.values(cascades);

  if (entries.length === 0) {
    return null;
  }

  return (
    <section id="cascade-viewer" className="mt-10 scroll-mt-24">
      <h2 className="text-xl font-semibold tracking-tight text-bayesiq-900 mb-4">
        {activeQuestionId ? "Cascade detail" : "All cascades"}
      </h2>
      <div className="space-y-4">
        {entries.map((entry) => (
          <CascadeCard
            key={entry.question_id}
            entry={entry}
            governanceStatus={
              getCascadeGovernanceStatus
                ? getCascadeGovernanceStatus(entry.question_id)
                : undefined
            }
            questionId={entry.question_id}
            onGovernanceDetail={onGovernanceDetail}
          />
        ))}
      </div>
    </section>
  );
}
