"use client";

import { useState } from "react";
import type { ExecutiveQuestion } from "@/lib/golden-flows-ui";
import type { CascadeEntry } from "@/types/golden-flows/contract-b/cascade_data";
import AskButtons from "./AskButtons";
import CascadeViewer from "./CascadeViewer";

interface AskAndCascadeSectionProps {
  questions: ExecutiveQuestion[];
  cascades: Record<string, CascadeEntry>;
}

export default function AskAndCascadeSection({
  questions,
  cascades,
}: AskAndCascadeSectionProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  function handleQuestionClick(questionId: string) {
    // Toggle: click the same question again to clear filter
    setActiveQuestionId((prev) => (prev === questionId ? null : questionId));
  }

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
      />
    </>
  );
}
