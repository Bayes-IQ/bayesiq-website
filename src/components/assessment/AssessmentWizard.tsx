"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";
import { QUESTIONS, buildResult } from "./scoring";
import type { AssessmentResponse, AssessmentResult } from "./assessmentTypes";
import StepDots from "./StepDots";
import QuestionCard from "./QuestionCard";
import ScoreReveal from "./ScoreReveal";

/**
 * AssessmentWizard — progressive disclosure assessment flow.
 *
 * Shows one question at a time with framer-motion slide transitions.
 * Auto-advances on answer selection (400ms delay) except on the last question.
 * Uses StepDots for progress and ScoreReveal for the results animation.
 */
export default function AssessmentWizard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const startedRef = useRef(false);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const selectedIndex = responses[currentIndex] ?? null;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Focus management: move focus to the question area on transitions.
  const questionAreaRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    if (!result && questionAreaRef.current) {
      questionAreaRef.current.focus();
    }
  }, [currentIndex, result]);

  // Cleanup auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  const handleSelect = useCallback(
    (choiceIndex: number) => {
      // Emit assessment_started on first interaction
      if (!startedRef.current) {
        startedRef.current = true;
        track("assessment_started");
      }

      setResponses((prev) => ({ ...prev, [currentIndex]: choiceIndex }));

      // Clear any pending auto-advance
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }

      // Auto-advance after 400ms delay (except on last question)
      if (!isLastQuestion) {
        autoAdvanceRef.current = setTimeout(() => {
          setDirection(1);
          setCurrentIndex((prev) => prev + 1);
          autoAdvanceRef.current = null;
        }, 400);
      }
    },
    [currentIndex, isLastQuestion],
  );

  function handleSubmit() {
    if (selectedIndex === null) return;

    const responseArray: AssessmentResponse[] = QUESTIONS.map((q, idx) => ({
      questionId: q.id,
      choiceIndex: responses[idx] ?? 0,
      score: q.choices[responses[idx] ?? 0]?.score ?? 0,
    }));

    const computed = buildResult(responseArray);
    setResult(computed);
    track("assessment_completed", { tier: computed.tier });
  }

  function handleBack() {
    // Clear any pending auto-advance when going back
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }

  // Slide transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  // Results view with score reveal
  if (result) {
    return <ScoreReveal result={result} />;
  }

  // Question view with progressive disclosure
  return (
    <div className="flex w-full flex-col items-center">
      <StepDots current={currentIndex} total={totalQuestions} />

      {/* Visually hidden heading for screen readers */}
      <h2
        ref={questionAreaRef}
        tabIndex={-1}
        className="sr-only"
        aria-live="polite"
      >
        Question {currentIndex + 1} of {totalQuestions}
      </h2>

      {/* Question area with slide transitions */}
      <div className="relative mt-8 w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full"
          >
            {/* Full-viewport layout on mobile */}
            <div className="flex min-h-[50vh] flex-col justify-between md:min-h-0 md:py-4">
              <div>
                <QuestionCard
                  question={currentQuestion}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                  className="rounded-lg border border-biq-border px-4 py-2.5 text-sm font-medium text-biq-text-secondary transition-colors hover:border-biq-primary hover:text-biq-text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Back
                </button>

                {isLastQuestion ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={selectedIndex === null}
                    className="rounded-lg bg-biq-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-biq-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    See my results
                  </button>
                ) : (
                  <span className="text-xs text-biq-text-muted">
                    {selectedIndex !== null
                      ? "Advancing..."
                      : "Select an answer to continue"}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
