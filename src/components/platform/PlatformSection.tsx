"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface PlatformSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function PlatformSection({
  children,
  className = "",
  id,
}: PlatformSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`px-6 py-20 md:py-28 ${className}`}
    >
      <div className="mx-auto max-w-4xl">{children}</div>
    </motion.section>
  );
}
