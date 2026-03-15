import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Case Studies — BayesIQ",
  description:
    "Illustrative engagements showing how BayesIQ finds broken metrics, validates pipelines, and delivers scored audit reports — across SaaS, Fintech, and Healthcare.",
  openGraph: {
    title: "Case Studies — BayesIQ",
    description:
      "Illustrative engagements showing how BayesIQ finds broken metrics, validates pipelines, and delivers scored audit reports — across SaaS, Fintech, and Healthcare.",
  },
};

const caseStudies = [
  {
    industry: "SaaS — Product Analytics",
    context:
      "Series B SaaS company ($22M ARR, 3 data engineers). Product and growth teams disputed weekly KPI reports — churn numbers from the warehouse didn't match billing system exports. Leadership lost confidence in the analytics team.",
    brokenState:
      "Event telemetry had silent schema drift: a frontend deploy renamed two event properties without updating the warehouse ETL. Downstream churn and activation metrics used stale column references, producing numbers that looked plausible but were wrong by 15–30% depending on the week.",
    findings: [
      "5 metrics recomputed from raw events disagreed with reported dashboard values",
      "2 event properties renamed upstream but never updated in ETL (schema drift)",
      "~18% of session records had null user_id due to a race condition in the event logger",
      "3 near-duplicate event types (e.g., signup_complete vs sign_up_completed) feeding separate pipelines",
    ],
    impact:
      "The churn metric was overstated by 22% in Q3 board reporting. A planned pricing experiment was designed around incorrect activation numbers. Two analysts spent ~10 hours/week manually reconciling reports.",
    remediation:
      "BayesIQ mapped all event-to-metric lineage, flagged the stale column references, and delivered a dbt project with staging models that normalize event names and enforce not-null constraints on user_id. Schema tests now catch property renames before they reach production dashboards.",
    deliverables: [
      "Scored audit report (38/100 — Critical)",
      "dbt project: 6 staging models, 3 mart models, 42 schema tests",
      "Streamlit dashboard with corrected metrics and data quality summary",
      "ASSUMPTIONS.md documenting 11 data contracts",
      "METRICS.md with canonical definitions for 5 KPIs",
    ],
  },
  {
    industry: "Fintech — Transaction Pipeline",
    context:
      "Mid-market payments processor ($45M revenue, 2 data engineers, 1 analytics manager). Preparing for a SOC 2 audit and needed to demonstrate data pipeline reliability. Internal team suspected issues but lacked tooling to quantify them.",
    brokenState:
      "Transaction event pipeline had timestamp gaps during peak processing windows. Settlement reconciliation ran on a T+1 batch job that silently dropped records when the source schema changed — which happened twice in the prior quarter during API version upgrades.",
    findings: [
      "4 timestamp gaps > 15 minutes in the prior 90 days, each during peak settlement windows",
      "~1,200 transaction records dropped by the T+1 batch job due to unhandled schema changes",
      "Revenue metric definition used gross_amount in one pipeline and net_amount in another — $340K annual discrepancy",
      "Column naming inconsistencies: transaction_id vs txn_id vs trans_id across 3 source tables",
    ],
    impact:
      "Dropped records meant settlement reports underreported daily volume by 0.3–0.8%. The revenue metric discrepancy showed up in board materials as an unexplained variance. SOC 2 auditors flagged the timestamp gaps as a control weakness.",
    remediation:
      "BayesIQ delivered a canonical column mapping that unified naming across all source tables, added dbt tests for timestamp continuity and record completeness, and documented the revenue metric definition so both pipelines use net_amount consistently. The batch job was patched to handle schema evolution gracefully.",
    deliverables: [
      "Scored audit report (52/100 — Needs Attention)",
      "dbt project: 8 staging models, 4 mart models, 56 schema tests",
      "Streamlit dashboard with settlement reconciliation and gap detection",
      "ASSUMPTIONS.md documenting 14 data contracts",
      "METRICS.md with canonical revenue and volume definitions",
    ],
  },
  {
    industry: "Healthcare — Clinical Analytics",
    context:
      "Regional health system (12 clinics, 4-person data team). Building a clinical analytics platform to track patient outcomes and operational metrics. Data sourced from EHR exports, claims feeds, and manual spreadsheet uploads. No existing data quality framework.",
    brokenState:
      "Patient outcome metrics were computed from EHR exports that arrived in inconsistent formats across clinics. Some clinics exported dates as MM/DD/YYYY, others as YYYY-MM-DD. Readmission rate calculations double-counted patients who appeared in multiple clinic feeds with different patient ID formats.",
    findings: [
      "3 date format variations across clinic EHR exports, causing ~6% of records to parse incorrectly",
      "~340 patients double-counted in readmission metrics due to inconsistent patient ID formatting across clinics",
      "2 clinics submitted CSV exports with trailing whitespace in diagnosis codes, causing join failures with the claims feed",
      "Null rate on discharge_date was 12% — far above the expected <1% — due to a misconfigured EHR export filter",
    ],
    impact:
      "Readmission rate was reported as 14.2% when the actual rate was 11.8% after deduplication. Quality reporting to CMS was at risk of inaccuracy. The data team spent an estimated 20 hours/month on manual data cleaning that could have been automated.",
    remediation:
      "BayesIQ standardized date parsing and patient ID canonicalization across all clinic feeds, added null-rate monitoring on critical fields, and delivered dbt models with referential integrity tests between EHR and claims data. Whitespace trimming was added to the staging layer.",
    deliverables: [
      "Scored audit report (44/100 — Critical)",
      "dbt project: 10 staging models, 5 mart models, 48 schema tests",
      "Streamlit dashboard with patient metric reconciliation and clinic-level quality scores",
      "ASSUMPTIONS.md documenting 9 data contracts",
      "METRICS.md with canonical definitions for readmission rate, length of stay, and 3 operational KPIs",
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900">
            Case Studies
          </h1>
          <p className="mt-4 text-lg text-bayesiq-600">
            These illustrative engagements show what a BayesIQ audit finds and
            fixes — concrete metrics, real failure modes, and the deliverables
            you walk away with.
          </p>
          <p className="mt-2 text-sm text-bayesiq-400">
            Based on common patterns across the industries we serve. Details are
            illustrative — your audit would use your actual data.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl space-y-16">
          {caseStudies.map((study, i) => (
            <article
              key={i}
              className="rounded-2xl border border-bayesiq-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-bayesiq-900">
                {study.industry}
              </h2>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-500">
                    Client Context
                  </h3>
                  <p className="mt-1 text-bayesiq-700">{study.context}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-500">
                    What Was Broken
                  </h3>
                  <p className="mt-1 text-bayesiq-700">{study.brokenState}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-500">
                    What BayesIQ Found
                  </h3>
                  <ul className="mt-1 space-y-1">
                    {study.findings.map((finding, j) => (
                      <li key={j} className="flex items-start gap-2 text-bayesiq-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bayesiq-400" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-500">
                    Business Impact
                  </h3>
                  <p className="mt-1 text-bayesiq-700">{study.impact}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-500">
                    Remediation
                  </h3>
                  <p className="mt-1 text-bayesiq-700">{study.remediation}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-bayesiq-500">
                    Deliverables
                  </h3>
                  <ul className="mt-1 space-y-1">
                    {study.deliverables.map((d, j) => (
                      <li key={j} className="flex items-start gap-2 text-bayesiq-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bayesiq-400" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/sample-report"
                  className="rounded-lg border border-bayesiq-300 px-4 py-2 text-sm font-medium text-bayesiq-700 transition-colors hover:bg-bayesiq-50"
                >
                  See a Sample Report
                </Link>
                <Link
                  href="/audit-kit"
                  className="rounded-lg border border-bayesiq-300 px-4 py-2 text-sm font-medium text-bayesiq-700 transition-colors hover:bg-bayesiq-50"
                >
                  How the Audit Kit Works
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTA
        headline="What would your audit find?"
        description="Every dataset has hidden issues. A BayesIQ diagnostic sprint finds them in one week — scored report, dbt project, and remediation plan included."
        buttonText="Book a Diagnostic Sprint"
      />
    </>
  );
}
