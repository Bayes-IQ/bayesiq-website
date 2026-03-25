"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
} from "framer-motion";

interface StatCounterProps {
  /** Target number to count up to */
  value: number;
  /** Text before the number (e.g. "$") */
  prefix?: string;
  /** Text after the number (e.g. "%", "+", "K") */
  suffix?: string;
  /** Animation duration in seconds (default 1.5) */
  duration?: number;
}

export default function StatCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.5,
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useMotionValueEvent(rounded, "change", (latest) => {
    setDisplayValue(latest);
  });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration, ease: "easeOut" });
    }
  }, [isInView, motionValue, value, duration]);

  // Calculate min-width based on target value character count (monospace makes ch reliable)
  const charCount = value.toString().length + prefix.length + suffix.length;

  return (
    <span
      ref={ref}
      className="inline-block font-mono tabular-nums"
      style={{ minWidth: `${charCount}ch` }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
