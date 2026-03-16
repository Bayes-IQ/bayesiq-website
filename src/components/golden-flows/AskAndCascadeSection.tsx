"use client";

import { useState } from "react";
import type { ExecutiveQuestion } from "@/lib/golden-flows-ui";
import type { CascadeEntry } from "@/types/golden-flows/contract-b/cascade_data";
import type { ApprovalStatusValue } from "@/lib/governance";
import AskButtons from "./AskButtons";
import CascadeViewer from "./CascadeViewer";
import { useGovernanceDetail } from "./GovernanceDetailProvider";

interface AskAndCascadeSectionProps {
  questions: ExecutiveQuestion[];
  cascades: Record<string, CascadeEntry>;
  /** Pre-computed governance statuses keyed by question_id */
  cascadeGovernanceStatuses?: Record<string, ApprovalStatusValue>;
}

export default function AskAndCascadeSection({
  questions,
  cascades,
  cascadeGovernanceStatuses,
}: AskAndCascadeSectionProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const { openGovernanceDetail } = useGovernanceDetail();

  function handleQuestionClick(questionId: string) {
    // Toggle: click the same question again to clear filter
    setActiveQuestionId((prev) => (prev === questionId ? null : questionId));
  }

  const getCascadeGovernanceStatus = cascadeGovernanceStatuses
    ? (qid: string) => cascadeGovernanceStatuses[qid] ?? null
    : undefined;

  return (
    <>
      <AskButtons
        questions={questions}
        activeQuestionId={activeQuestionId}
        onQuestionClick={handleQuestionClick}
      />
      <CascadeViewer
        cascades={cascades}
        activeQuestionId={activeQuestionId}
        getCascadeGovernanceStatus={getCascadeGovernanceStatus}
        onGovernanceDetail={openGovernanceDetail}
      />
    </>
  );
}
