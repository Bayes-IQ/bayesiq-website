"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AssessmentResult } from "./assessmentTypes";
import ResultsPanel from "./ResultsPanel";

interface ScoreRevealProps {
  result: AssessmentResult;
}

/**
 * Animated score reveal sequence:
 * 1. "Calculating..." state (800ms)
 * 2. Score number counts up from 0 to actual score
 * 3. Tier badge and label fade in
 * 4. Full results panel slides up
 */
export default function ScoreReveal({ result }: ScoreRevealProps) {
  const [phase, setPhase] = useState<"calculating" | "counting" | "reveal">(
    "calculating",
  );
  const [displayScore, setDisplayScore] = useState(0);

  // Phase 1: show "Calculating..." for 800ms
  useEffect(() => {
    const timer = setTimeout(() => setPhase("counting"), 800);
    return () => clearTimeout(timer);
  }, []);

  // Phase 2: count up from 0 to actual score
  useEffect(() => {
    if (phase !== "counting") return;

    const target = result.scorePercent;
    const duration = 700; // ms
    const steps = Math.max(target, 1);
    const interval = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        // Brief pause then show full results
        setTimeout(() => setPhase("reveal"), 400);
      }
      setDisplayScore(current);
    }, interval);

    return () => clearInterval(timer);
  }, [phase, result.scorePercent]);

  const TIER_COLOR: Record<string, string> = {
    at_risk: "text-red-600",
    needs_work: "text-amber-700",
    strong: "text-emerald-700",
  };

  const TIER_BG: Record<string, string> = {
    at_risk: "bg-red-50 border-red-200",
    needs_work: "bg-amber-50 border-amber-200",
    strong: "bg-emerald-50 border-emerald-200",
  };

  const scoreColor = TIER_COLOR[result.tier] ?? "text-bayesiq-900";
  const tierBg = TIER_BG[result.tier] ?? "bg-bayesiq-50 border-bayesiq-200";

  return (
    <div className="w-full" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait">
        {phase === "calculating" && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-bayesiq-200 border-t-bayesiq-900" />
            <p className="mt-4 text-sm font-medium text-bayesiq-500">
              Calculating your score...
            </p>
          </motion.div>
        )}

        {phase === "counting" && (
          <motion.div
            key="counting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <span
              className={`text-7xl font-bold tabular-nums ${scoreColor}`}
              aria-label={`Score: ${result.scorePercent} percent`}
            >
              {displayScore}%
            </span>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className={`mt-4 rounded-full border px-4 py-1.5 text-sm font-semibold ${tierBg} ${scoreColor}`}
            >
              {result.tierLabel}
            </motion.div>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ResultsPanel result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
