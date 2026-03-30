"use client";

import { motion, useReducedMotion } from "framer-motion";

const executionPaths = [
  {
    label: "Your AI pipeline",
    description: "Automated execution with evidence returned to governance",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h9a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0015.75 4.5h-9A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5z"
        />
      </svg>
    ),
  },
  {
    label: "A human operator",
    description: "Manual execution using the same portable contract",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
  {
    label: "A CI job or contractor",
    description: "External execution with the same completion protocol",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
];

const chainSteps = [
  { label: "Contract", sub: "Portable, human-readable" },
  { label: "Execute", sub: "Any compliant engine" },
  { label: "Evidence", sub: "Structured completion proof" },
  { label: "Govern", sub: "Human review + approval" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function GovernanceChainExpanded() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mt-14 space-y-16">
      {/* Governance chain loop */}
      <motion.div
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="flex flex-col items-center gap-0 sm:flex-row sm:justify-center sm:gap-0"
      >
        {chainSteps.map((step, i) => (
          <div
            key={step.label}
            className="flex flex-col items-center sm:flex-row"
          >
            <motion.div
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="flex h-24 w-40 flex-col items-center justify-center rounded-lg border border-biq-dark-border bg-biq-dark-surface-1 text-center"
            >
              <span className="text-sm font-bold text-white">{step.label}</span>
              <span className="mt-1 text-xs text-biq-dark-text-secondary">{step.sub}</span>
            </motion.div>
            {i < chainSteps.length - 1 && (
              <motion.div
                variants={shouldReduceMotion ? undefined : itemVariants}
                className="flex items-center justify-center"
                aria-hidden="true"
              >
                {/* Vertical arrow on mobile, horizontal on sm+ */}
                <svg
                  className="h-6 w-6 rotate-90 text-biq-dark-text-secondary sm:rotate-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
        {/* Loop-back arrow */}
        <motion.div
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="hidden items-center sm:flex"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Three execution paths */}
      <motion.div
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-6 md:grid-cols-3"
      >
        {executionPaths.map((path) => (
          <motion.div
            key={path.label}
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="rounded-xl border border-biq-dark-border bg-biq-dark-surface-1 p-6 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-biq-dark-surface-2 text-accent">
              {path.icon}
            </div>
            <h4 className="mt-4 text-sm font-bold text-white">{path.label}</h4>
            <p className="mt-2 text-xs leading-relaxed text-biq-dark-text-secondary">
              {path.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
