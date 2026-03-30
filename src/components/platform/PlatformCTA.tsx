"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function PlatformCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center"
    >
      <Link
        href="/consulting/explore"
        className="inline-block rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-biq-text-primary transition-colors hover:bg-biq-surface-2"
      >
        See it in action
      </Link>
      <Link
        href="/contact"
        className="inline-block rounded-lg border border-biq-dark-text-secondary px-8 py-3.5 text-sm font-semibold text-biq-dark-text-primary transition-colors hover:border-biq-dark-text-primary hover:text-white"
      >
        Talk to us about the platform
      </Link>
    </motion.div>
  );
}
