"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionRevealProps {
  children: React.ReactNode;
  /** Additional class names for the wrapper */
  className?: string;
  /** Upward shift distance in pixels (default 20) */
  shift?: number;
  /** Animation duration in seconds (default 0.6) */
  duration?: number;
  /** Delay before animation starts in seconds (default 0) */
  delay?: number;
}

export default function SectionReveal({
  children,
  className,
  shift = 20,
  duration = 0.6,
  delay = 0,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shift }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shift }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
