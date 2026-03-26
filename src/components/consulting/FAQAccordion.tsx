"use client";

/**
 * Expandable FAQ section.
 * Client component (needs expand/collapse state).
 * Uses native <details>/<summary> for zero-JS base with
 * controlled state for single-open behavior.
 */

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "Can't our team do this ourselves?",
    answer:
      "Most teams we work with have strong data engineers. The issue is not skill but time and focus. Internal teams are busy building pipelines and dashboards. They rarely get dedicated time to audit telemetry and metric correctness end-to-end. We compress months of ad-hoc debugging into a structured 1-2 week engagement. Your team keeps building while we find what is broken.",
  },
  {
    question: "What data access do you need?",
    answer:
      "Read-only access to your data warehouse. No write access, no production system access, no PII required. We run queries inside your environment and only export aggregated findings. We operate under NDA with time-limited access scoped to the engagement period. We need about 1-2 hours per week from your data team for context.",
  },
  {
    question:
      "How is this different from Monte Carlo or Great Expectations?",
    answer:
      "Those tools are observability platforms that detect anomalies in data freshness, volume, and schema. That is monitoring. We do something different: we audit whether the business metrics are correct. That means recomputing KPIs from source events, validating telemetry against logging specs at the field level, and tracing root causes through pipeline logic. Monitoring tells you something changed. We verify whether the number is correct.",
  },
  {
    question: "We already use dbt tests.",
    answer:
      "Good, that means you have infrastructure to build on. dbt tests catch surface-level issues: nulls, uniqueness, accepted values, freshness. They do not catch metric definition drift, telemetry gaps, or pipeline logic errors that silently produce wrong numbers. dbt tests verify schema. We verify that the business numbers are actually right.",
  },
  {
    question: "Our numbers look fine.",
    answer:
      "Most companies think that until a board question forces someone to reconcile numbers across dashboards. The issues we find do not look like obvious failures. The pipeline runs, the dashboard updates, nothing alerts. But the number is wrong because a join duplicates records, a filter excludes a subset of users, or two services log the same action differently. Typical engagements uncover 5-10 issues, with 1-3 materially affecting decision-making metrics.",
  },
  {
    question: "How long does it take?",
    answer:
      "A Diagnostic Sprint takes 1 week and delivers a severity-ranked scorecard of the top issues in your data systems. A Full Engagement takes 4-6 weeks and includes the audit, metric contracts, a dbt project with 40+ tests, interactive dashboards, and drift monitoring. The sprint fee is 100% credited toward a full engagement if you continue.",
  },
];

interface FAQAccordionProps {
  items?: FAQItem[];
}

export default function FAQAccordion({
  items = defaultFAQs,
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-biq-border border-t border-b border-biq-border">
      {items.map((item, index) => (
        <div key={index}>
          <button
            type="button"
            className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-biq-text-primary transition-colors hover:text-biq-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-panel-${index}`}
            id={`faq-button-${index}`}
          >
            <span>{item.question}</span>
            <span
              className={`ml-4 shrink-0 transition-transform duration-200 ${
                openIndex === index ? "rotate-45" : ""
              }`}
              aria-hidden="true"
            >
              +
            </span>
          </button>
          <div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-button-${index}`}
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === index ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <p className="text-sm leading-relaxed text-biq-text-secondary">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
