"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  /** Optional label rendered after the number */
  suffix?: string;
}

export default function AnimatedCounter({
  from,
  to,
  duration = 1.2,
  className = "",
  suffix,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate(value) {
        setDisplayValue(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
      {suffix}
    </span>
  );
}
