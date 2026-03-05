"use client";

import { useState, useEffect, useRef } from "react";
import { track } from "@vercel/analytics";
import { QUESTIONS, buildResult } from "./scoring";
import type { AssessmentResponse, AssessmentResult } from "./assessmentTypes";
import Progress from "./Progress";
import QuestionCard from "./QuestionCard";
import ResultsPanel from "./ResultsPanel";

/**
 * AssessmentWizard orchestrates the full assessment flow:
 *   1. Steps through each question (with back/next navigation).
 *   2. Prevents progression without an answer selection.
 *   3. Computes the result on completion.
 *   4. Hands off to ResultsPanel.
 *   5. Emits analytics events for start and completion.
 */
export default function AssessmentWizard() {
  // currentIndex is 0-based index into QUESTIONS.
  const [currentIndex, setCurrentIndex] = useState(0);
  // responses is a sparse map: questionIndex → choiceIndex selected.
  const [responses, setResponses] = useState<Record<number, number>>({});
  // result is only set once the user completes the assessment.
  const [result, setResult] = useState<AssessmentResult | null>(null);
  // Track whether the "assessment_started" event has been emitted.
  const startedRef = useRef(false);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const selectedIndex = responses[currentIndex] ?? null;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Focus management: move focus to the card heading on question change.
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    if (!result && headingRef.current) {
      headingRef.current.focus();
    }
  }, [currentIndex, result]);

  function handleSelect(choiceIndex: number) {
    // Emit assessment_started on first interaction (first choice selection).
    if (!startedRef.current) {
      startedRef.current = true;
      track("assessment_started");
    }
    setResponses((prev) => ({ ...prev, [currentIndex]: choiceIndex }));
  }

  function handleNext() {
    if (selectedIndex === null) return; // guard: no selection

    if (isLastQuestion) {
      // Build the full response array in question order.
      const responseArray: AssessmentResponse[] = QUESTIONS.map((q, idx) => ({
        questionId: q.id,
        choiceIndex: responses[idx] ?? 0,
        score: q.choices[responses[idx] ?? 0]?.score ?? 0,
      }));

      const computed = buildResult(responseArray);
      setResult(computed);

      // Emit assessment_completed with tier.
      track("assessment_completed", { tier: computed.tier });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  // Results view
  if (result) {
    return (
      <div className="w-full">
        <ResultsPanel result={result} />
      </div>
    );
  }

  // Question view
  return (
    <div className="w-full space-y-8">
      <Progress current={currentIndex + 1} total={totalQuestions} />

      {/* Visually hidden heading for focus target on question transitions */}
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="sr-only"
        aria-live="polite"
      >
        Question {currentIndex + 1} of {totalQuestions}
      </h2>

      <QuestionCard
        question={currentQuestion}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="rounded-lg border border-bayesiq-300 px-4 py-2.5 text-sm font-medium text-bayesiq-700 transition-colors hover:border-bayesiq-500 hover:text-bayesiq-900 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedIndex === null}
          aria-describedby={selectedIndex === null ? "next-hint" : undefined}
          className="rounded-lg bg-bayesiq-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLastQuestion ? "See my results" : "Next"}
        </button>
      </div>

      {selectedIndex === null && (
        <p
          id="next-hint"
          className="text-center text-xs text-bayesiq-400"
          role="status"
        >
          Select an answer to continue.
        </p>
      )}
    </div>
  );
}
