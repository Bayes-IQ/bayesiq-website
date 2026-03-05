import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Sample Audit Report",
  description:
    "See what a BayesIQ data quality audit delivers: severity-ranked findings, root-cause analysis, and a phased remediation plan — illustrated with an anonymized real-world example.",
  openGraph: {
    title: "Sample Audit Report — BayesIQ",
    description:
      "See what a BayesIQ data quality audit delivers: severity-ranked findings, root-cause analysis, and a phased remediation plan — illustrated with an anonymized real-world example.",
  },
};

// ---------------------------------------------------------------------------
// Data — sourced from docs/product/sample_report.md
// ---------------------------------------------------------------------------

const deliverables = [
  {
    title: "Severity-ranked findings report",
    description:
      "Every confirmed issue ranked Critical, High, Medium, or Low, with root cause analysis and a specific fix recommendation.",
  },
  {
    title: "Data assumptions document",
    description:
      "What we believe to be true about your data — schema assumptions, quality expectations, temporal patterns, and entity relationships. Your team signs off before we build anything.",
  },
  {
    title: "Metric specification",
    description:
      "Formal definitions for every business metric: formula, source events, dimensions, and period-by-period validation against reported numbers.",
  },
  {
    title: "Executive summary",
    description:
      "A one-page narrative for leadership: what we found, what it means for the business, and what to do first.",
  },
  {
    title: "dbt project with automated tests",
    description:
      "Auto-generated staging-to-mart dbt models with deduplication, canonicalization, and 40+ data quality tests. Ready to deploy to your warehouse.",
  },
  {
    title: "Interactive Streamlit dashboards",
    description:
      "Dashboards built on validated metrics with sidebar filters, time series charts, dimension breakdowns, and a data quality summary. Your team can use them from day one.",
  },
  {
    title: "Phased remediation plan",
    description:
      "Issues grouped into three fix phases (Immediate / Short-term / Long-term) with estimated effort and expected impact.",
  },
];

const severityRubric = [
  {
    level: "Critical",
    color: "text-red-700 bg-red-50 border-red-200",
    definition:
      "Metric or event is systematically wrong; decisions made on this data are likely incorrect.",
    action: "Fix before next reporting cycle.",
  },
  {
    level: "High",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    definition:
      "Significant inaccuracy or gap affecting a key metric; risk of misleading product or business decisions.",
    action: "Fix within 2–4 weeks.",
  },
  {
    level: "Medium",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    definition:
      "Partial data loss or inconsistency; metric is directionally correct but unreliable for precise decisions.",
    action: "Schedule in next sprint.",
  },
  {
    level: "Low",
    color: "text-bayesiq-600 bg-bayesiq-50 border-bayesiq-200",
    definition:
      "Minor discrepancy, edge-case gap, or spec drift; negligible business impact at current scale.",
    action: "Track and address opportunistically.",
  },
];

const findings = [
  {
    id: "F-01",
    severity: "Critical",
    severityColor: "text-red-700 bg-red-50",
    area: "Telemetry",
    finding:
      "checkout_completed fires on payment attempt, not on payment confirmation. Revenue metric double-counts abandoned checkouts.",
    rootCause:
      "Client-side event triggered before async confirmation callback resolves.",
    fix: "Move event dispatch into confirmation callback; backfill last 90 days using server-side order records.",
  },
  {
    id: "F-02",
    severity: "High",
    severityColor: "text-orange-700 bg-orange-50",
    area: "Telemetry",
    finding:
      "user_id is null for ~18% of page_view events in mobile web sessions.",
    rootCause:
      "Anonymous session handling does not wait for identity resolution before firing the event.",
    fix: "Delay event dispatch by 300 ms post-load or use a queue that flushes after identity resolves.",
  },
  {
    id: "F-03",
    severity: "High",
    severityColor: "text-orange-700 bg-orange-50",
    area: "Pipeline",
    finding:
      "revenue_daily table excludes refunds issued after the original transaction date. Net revenue overstated by ~4.2% month-over-month.",
    rootCause:
      "JOIN condition uses transaction_date instead of event_date for the refund table, silently dropping late refunds.",
    fix: "Update JOIN key to refund_issued_date; re-run historical aggregation for the trailing 12 months.",
  },
  {
    id: "F-04",
    severity: "Medium",
    severityColor: "text-yellow-700 bg-yellow-50",
    area: "Metrics",
    finding:
      "activation_rate metric counts any feature_used event, but the product definition requires three distinct features used within 7 days.",
    rootCause:
      "Metric query was written before the activation definition was finalized and was never updated.",
    fix: "Rewrite metric query to match current definition; add a test that checks the query against the spec document.",
  },
  {
    id: "F-05",
    severity: "Medium",
    severityColor: "text-yellow-700 bg-yellow-50",
    area: "Telemetry",
    finding:
      "experiment_viewed event fires once per session even when a user sees the experiment multiple times. Impression counts understated.",
    rootCause:
      "Deduplication logic uses session ID instead of a (session_id, timestamp) composite key.",
    fix: "Update deduplication key; note that historical impression data cannot be corrected.",
  },
  {
    id: "F-06",
    severity: "Low",
    severityColor: "text-bayesiq-600 bg-bayesiq-50",
    area: "Schema",
    finding:
      "device_type property sends raw user-agent strings on Android Chrome, enumerated values on all other clients.",
    rootCause: "Inconsistent client library versions across platforms.",
    fix: "Standardize on enumerated values; add schema validation rule to catch raw user-agent strings.",
  },
];

const remediationPhases = [
  {
    phase: "Phase 1",
    label: "Immediate",
    timeframe: "Fix within 2 weeks",
    steps: [
      "Fix checkout_completed event trigger timing and move dispatch to server-side confirmation callback (F-01).",
      "Backfill revenue metric using server-side order records for the trailing 90 days (F-01).",
      "Patch user_id identity resolution on mobile web sessions (F-02).",
    ],
  },
  {
    phase: "Phase 2",
    label: "Short-term",
    timeframe: "Fix within 4–6 weeks",
    steps: [
      "Correct the revenue_daily table JOIN condition and re-run trailing 12-month aggregation (F-03).",
      "Rewrite activation_rate metric query to match current product definition and add a spec-aligned test (F-04).",
    ],
  },
  {
    phase: "Phase 3",
    label: "Long-term",
    timeframe: "Schedule within one quarter",
    steps: [
      "Update experiment_viewed deduplication key and document the limitation on historical data (F-05).",
      "Standardize device_type property across platforms and add schema validation (F-06).",
    ],
  },
];

const timelineSteps = [
  {
    phase: "Discovery",
    timeline: "Week 1–2",
    description:
      "Kickoff call, architecture review, access setup, logging spec collection. AI agents scan telemetry, pipelines, and metric definitions.",
  },
  {
    phase: "Audit & Findings",
    timeline: "Week 2–3",
    description:
      "Data scientists review automated findings, eliminate false positives, assess severity, and identify root causes. Severity-ranked report delivered.",
  },
  {
    phase: "Assumptions Sign-off",
    timeline: "Week 3–4",
    description:
      "Data assumptions document and metric specification delivered. Your team reviews and signs off before we build — this is the alignment gate.",
  },
  {
    phase: "Implementation & Dashboards",
    timeline: "Week 5–6",
    description:
      "Auto-generated dbt project, interactive Streamlit dashboards, and drift detection setup delivered. Your team has trustworthy metrics from day one.",
  },
  {
    phase: "Continuous Monitoring",
    timeline: "Optional",
    description:
      "Automated drift detection, alerting rules, and ongoing validation. $2–5K/month retainer.",
  },
];

const faqs = [
  {
    question: "What access do you need?",
    answer:
      "Read-only access to your data warehouse or analytics environment, your logging specification (even an informal one), and documentation or code for the pipelines you want audited. We do not need production credentials or write access at any point.",
  },
  {
    question: "How do you handle sensitive data?",
    answer:
      "We work with anonymized or de-identified data wherever possible. When real user data is required for analysis, we operate under a signed NDA and follow your organization's data handling policies. We never retain client data after an engagement closes.",
  },
  {
    question: "What if we don't have a formal logging spec?",
    answer:
      "That's common. We can reconstruct an implied spec from your existing dashboards, queries, and event schemas — and the gap between the implied spec and reality is often where the most valuable findings are.",
  },
  {
    question: "How many findings should we expect?",
    answer:
      "It varies by system maturity, but most first-time audits surface 8–15 confirmed issues. The example above (6 findings) is on the lower end for a system that has received some prior attention. We've found over 30 distinct issues in systems with years of accumulated tech debt.",
  },
  {
    question: "Can you audit just one part of our data stack?",
    answer:
      "Yes. You can scope the engagement to a specific product area, a specific pipeline, or a specific set of metrics. Narrower scope means faster turnaround and lower cost.",
  },
  {
    question: "What do we get if you find nothing?",
    answer:
      "If we complete the audit and find no material issues, you receive a clean bill of health — a written summary confirming what we checked and what we found. That document is itself valuable for internal compliance and stakeholder confidence.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SampleReportPage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900 md:text-5xl">
            See what a BayesIQ audit looks like.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-bayesiq-600">
            Every engagement ends with a severity-ranked findings report, a
            root-cause analysis, and a phased remediation plan. Here&apos;s an
            anonymized example from a real-world data quality audit.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-bayesiq-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
            >
              Start Your Audit
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
            >
              See our services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* What's Included                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            What&apos;s included in every audit
          </h2>
          <p className="mt-3 text-base text-bayesiq-600">
            A full BayesIQ engagement delivers these components.
          </p>
          <ul className="mt-8 space-y-6">
            {deliverables.map((d) => (
              <li key={d.title} className="flex gap-4">
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full bg-bayesiq-400"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-bayesiq-900">
                    {d.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-bayesiq-600">
                    {d.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Severity Rubric                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            Severity rubric
          </h2>
          <p className="mt-3 text-base text-bayesiq-600">
            We rank every finding before it reaches you. Severity is determined
            by business impact and blast radius — how many downstream metrics or
            reports does this affect?
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-bayesiq-200">
                  <th
                    scope="col"
                    className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-bayesiq-400"
                  >
                    Severity
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-bayesiq-400"
                  >
                    Definition
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium uppercase tracking-wider text-bayesiq-400"
                  >
                    Typical action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bayesiq-100">
                {severityRubric.map((row) => (
                  <tr key={row.level}>
                    <td className="py-3 pr-6 align-top">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${row.color}`}
                      >
                        {row.level}
                      </span>
                    </td>
                    <td className="py-3 pr-6 align-top leading-relaxed text-bayesiq-700">
                      {row.definition}
                    </td>
                    <td className="py-3 align-top text-bayesiq-600">
                      {row.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Example Findings Table                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            Example findings
          </h2>
          <p className="mt-3 text-base text-bayesiq-600">
            Anonymized excerpt from a Data Quality Audit for a B2B SaaS product
            team (~50 M events/month). Finding IDs, event names, and property
            names have been changed.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-bayesiq-200">
                  <th
                    scope="col"
                    className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-bayesiq-400"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-bayesiq-400"
                  >
                    Severity
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-bayesiq-400"
                  >
                    Area
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-bayesiq-400"
                  >
                    Finding
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-bayesiq-400"
                  >
                    Root Cause
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium uppercase tracking-wider text-bayesiq-400"
                  >
                    Recommended Fix
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bayesiq-100">
                {findings.map((f) => (
                  <tr key={f.id} className="align-top">
                    <td className="py-3 pr-4 font-mono text-xs text-bayesiq-400">
                      {f.id}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${f.severityColor}`}
                      >
                        {f.severity}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-bayesiq-600">{f.area}</td>
                    <td className="py-3 pr-4 leading-relaxed text-bayesiq-700">
                      {f.finding}
                    </td>
                    <td className="py-3 pr-4 leading-relaxed text-bayesiq-600">
                      {f.rootCause}
                    </td>
                    <td className="py-3 leading-relaxed text-bayesiq-600">
                      {f.fix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Remediation Plan                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            Sample remediation plan
          </h2>
          <p className="mt-3 text-base text-bayesiq-600">
            Findings are grouped into three phases based on business impact and
            engineering effort.
          </p>
          <div className="mt-8 space-y-10">
            {remediationPhases.map((phase, phaseIndex) => (
              <div key={phase.phase}>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-lg font-semibold text-bayesiq-900">
                    {phase.phase} — {phase.label}
                  </h3>
                  <span className="text-xs text-bayesiq-400">
                    {phase.timeframe}
                  </span>
                </div>
                <ol className="mt-4 space-y-2">
                  {phase.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-3 text-sm">
                      <span className="shrink-0 font-medium text-bayesiq-300">
                        {phaseIndex * 10 + stepIndex + 1}.
                      </span>
                      <span className="leading-relaxed text-bayesiq-700">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Engagement Timeline                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-bayesiq-200 bg-bayesiq-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            Engagement timeline
          </h2>
          <p className="mt-3 text-base text-bayesiq-600">
            A full engagement runs 6 weeks from kickoff to validated dashboards.
            Diagnostic sprints deliver findings in 1 week.
          </p>
          <div className="mt-10 space-y-8">
            {timelineSteps.map((step, index) => (
              <div key={step.phase} className="flex gap-6">
                <div className="flex shrink-0 flex-col items-center">
                  <span className="text-sm font-bold text-bayesiq-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-base font-semibold text-bayesiq-900">
                      {step.phase}
                    </h3>
                    <span className="text-xs text-bayesiq-400">
                      {step.timeline}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-bayesiq-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FAQ                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-bayesiq-900">
            Frequently asked questions
          </h2>
          <dl className="mt-8 space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-base font-semibold text-bayesiq-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Closing CTA                                                         */}
      {/* ------------------------------------------------------------------ */}
      <CTA
        headline="Ready to see what's wrong with your data?"
        description="Most teams have at least a few Critical or High issues they don't know about. Book a free data health check and we'll tell you where to look."
        buttonText="Start Your Audit"
        href="/contact"
      />
    </>
  );
}
