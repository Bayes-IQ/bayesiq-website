"use client";

import { motion, useReducedMotion } from "framer-motion";

const layers = [
  {
    label: "Layer 1",
    title: "Raw Truth",
    subtitle: "Immutable evidence",
    description:
      "No summaries, no interpretations. Just the record. Pipeline outputs, test results, call transcripts, emails -- the ground truth your decisions rest on.",
    color: "border-bayesiq-600",
    bg: "bg-bayesiq-900",
    accent: "text-bayesiq-400",
    glow: "shadow-[0_0_24px_rgba(59,130,246,0.08)]",
  },
  {
    label: "Layer 2",
    title: "Derived Interpretation",
    subtitle: "Structured output",
    description:
      "AI-generated proposals, extracted tasks, priority assessments, and summaries. Clearly labeled as interpretation, not fact. Never auto-promoted to operational state.",
    color: "border-bayesiq-500",
    bg: "bg-bayesiq-800",
    accent: "text-bayesiq-300",
    glow: "shadow-[0_0_24px_rgba(59,130,246,0.12)]",
  },
  {
    label: "Layer 3",
    title: "Governed State",
    subtitle: "Human-accepted truth",
    description:
      "The only layer that drives dashboards, deadlines, and work state. Nothing reaches this layer without explicit human acceptance. This is your single source of governed truth.",
    color: "border-accent",
    bg: "bg-bayesiq-800",
    accent: "text-[var(--dark-accent)]",
    glow: "shadow-[0_0_32px_rgba(96,165,250,0.15)]",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const flowVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function ThreeTruthLayers() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="mt-14 flex flex-col items-center gap-0"
    >
      {layers.map((layer, i) => (
        <div key={layer.label} className="flex w-full flex-col items-center">
          {/* Flow connector */}
          {i > 0 && (
            <motion.div
              variants={shouldReduceMotion ? undefined : flowVariants}
              className="h-10 w-px origin-top bg-gradient-to-b from-bayesiq-600 to-bayesiq-700"
              aria-hidden="true"
            />
          )}

          {/* Layer card */}
          <motion.div
            variants={shouldReduceMotion ? undefined : cardVariants}
            className={`w-full max-w-xl rounded-xl border ${layer.color} ${layer.bg} ${layer.glow} p-6 md:p-8`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wider ${layer.accent}`}
            >
              {layer.label}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-white md:text-2xl">
              {layer.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-bayesiq-300">
              {layer.subtitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-bayesiq-400">
              {layer.description}
            </p>
          </motion.div>
        </div>
      ))}

      {/* Cycle indicator */}
      <motion.div
        variants={shouldReduceMotion ? undefined : flowVariants}
        className="mt-1 flex flex-col items-center"
        aria-hidden="true"
      >
        <div className="h-8 w-px bg-gradient-to-b from-bayesiq-600 to-transparent" />
        <div className="mt-1 h-2 w-2 rounded-full bg-[var(--dark-accent)]" />
      </motion.div>
    </motion.div>
  );
}
