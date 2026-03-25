/**
 * Industry vertical content data for the consulting/industries page.
 *
 * Content sources:
 * - Fintech: migrated from /fintech/page.tsx (problems array, case study callout)
 * - Healthcare: migrated from /healthcare/page.tsx (failurePatterns array, case study callout)
 * - SaaS: new content derived from golden flow vertical_narrative.json + domain patterns
 * - Real Estate: new content derived from golden flow vertical_narrative.json + domain patterns
 */

export interface FailurePattern {
  title: string;
  description: string;
}

export interface Finding {
  beforeLabel: string;
  beforeValue: string;
  afterLabel: string;
  afterValue: string;
  annotation: string;
}

export interface VerticalResult {
  scoreBefore: number;
  scoreAfter: number;
  summary: string;
}

export interface VerticalData {
  id: string;
  displayName: string;
  headline: string;
  failurePatterns: FailurePattern[];
  finding: Finding;
  result: VerticalResult;
  ctaLabel: string;
}

export const verticals: VerticalData[] = [
  {
    id: "fintech",
    displayName: "Fintech",
    headline:
      "Revenue metrics built on transaction pipelines that nobody has audited end-to-end.",
    failurePatterns: [
      {
        title: "Revenue metrics that don't match finance",
        description:
          "Product analytics show one revenue number. Finance shows another. Metric validation recomputes KPIs from raw transaction data to show exactly where currency conversion logic, refund handling, or phantom events introduce the gap.",
      },
      {
        title: "Payment event telemetry with gaps",
        description:
          "Transaction events fire from multiple clients and payment processors. Required fields like currency, payment_method, or transaction_id are null 5-20% of the time. Schema profiling catches null spikes before they reach downstream aggregations.",
      },
      {
        title: "Compliance reporting on unaudited pipelines",
        description:
          "SAR filing counts, transaction monitoring volumes, and KYC completion rates are built from the same pipelines as product dashboards. A scored audit with severity-ranked findings shows exactly which pipeline issues affect compliance numbers.",
      },
    ],
    finding: {
      beforeLabel: "Reported Revenue",
      beforeValue: "$1.2M",
      afterLabel: "Actual Revenue",
      afterValue: "$960K",
      annotation:
        "$240K overstatement found. 1,200 dropped transaction records and a fee calculation error in the settlement pipeline.",
    },
    result: {
      scoreBefore: 52,
      scoreAfter: 84,
      summary:
        "A mid-market payments processor found a $340K annual revenue discrepancy and 1,200 silently dropped transaction records.",
    },
    ctaLabel: "Book a Fintech Diagnostic",
  },
  {
    id: "healthcare",
    displayName: "Healthcare",
    headline:
      "Clinical metrics are only as good as the data pipeline behind them.",
    failurePatterns: [
      {
        title: "Clinical metrics don't reconcile",
        description:
          "EMR data says one thing, the analytics dashboard says another. Readmission rates, patient volume, and outcome metrics diverge across systems. Metric validation compares source-system figures against downstream calculations to show exactly where numbers split.",
      },
      {
        title: "Regulatory reporting built on unvalidated data",
        description:
          "Quality measures for CMS, Joint Commission, or payer contracts are computed from pipelines nobody has audited. A scored audit catches data completeness issues, schema drift, and transformation errors before they reach a regulatory submission.",
      },
      {
        title: "Telemetry gaps in patient-facing tools",
        description:
          "Patient portals, scheduling apps, and telehealth platforms emit events, but required fields are missing, sessions are not stitched, and engagement metrics are unreliable. Schema profiling detects null rates, field coverage gaps, and type inconsistencies.",
      },
    ],
    finding: {
      beforeLabel: "Reported Readmission Rate",
      beforeValue: "14.2%",
      afterLabel: "Actual Readmission Rate",
      afterValue: "11.8%",
      annotation:
        "340 patients double-counted due to inconsistent patient ID formatting across clinics.",
    },
    result: {
      scoreBefore: 44,
      scoreAfter: 82,
      summary:
        "A regional health system found 340 patients double-counted in readmission metrics. The corrected rate changed resource allocation decisions.",
    },
    ctaLabel: "Book a Healthcare Diagnostic",
  },
  {
    id: "saas",
    displayName: "SaaS",
    headline:
      "Product analytics with schema drift, KPI reconciliation failures, and experiments on corrupted baselines.",
    failurePatterns: [
      {
        title: "Event definitions change without pipeline updates",
        description:
          "Product ships a new feature, the event schema changes, but the analytics pipeline still expects the old format. Metrics silently degrade as nulls accumulate in fields that used to be populated. Schema profiling catches these drift patterns within days, not months.",
      },
      {
        title: "KPI reconciliation failures across teams",
        description:
          "MRR computed differently by product, finance, and investor dashboards. Each team applies different filters, different date boundaries, different refund logic. Metric validation recomputes each KPI from source data against every downstream consumer.",
      },
      {
        title: "A/B test results on corrupted baselines",
        description:
          "Duplicate events, identity stitching gaps across web and mobile, and inconsistent funnel definitions mean experiment results are measured on baselines that do not represent reality. Quality checks catch near-duplicates and event inflation before they corrupt experiments.",
      },
    ],
    finding: {
      beforeLabel: "Reported Churn Rate",
      beforeValue: "8.4%",
      afterLabel: "Actual Churn Rate",
      afterValue: "6.5%",
      annotation:
        "22% churn overstatement caused by duplicate cancellation events and inconsistent subscription status logic.",
    },
    result: {
      scoreBefore: 38,
      scoreAfter: 87,
      summary:
        "A Series B SaaS company discovered their churn metric was overstated by 22%, changing the narrative for their next fundraise.",
    },
    ctaLabel: "Book a SaaS Diagnostic",
  },
  {
    id: "real_estate",
    displayName: "Real Estate",
    headline:
      "Portfolio metrics with inconsistent property classification and collection rate overstatement.",
    failurePatterns: [
      {
        title: "Collection rate overstatement masking uncollected rent",
        description:
          "Reported collection rates include pre-payments and exclude write-offs inconsistently. A 10%+ overstatement masks hundreds of thousands in uncollected rent, directly impacting LP distributions and investor confidence.",
      },
      {
        title: "Occupancy calculations with double-counted units",
        description:
          "Units classified differently across property management systems and reporting layers. Some units are counted as occupied in one system and vacant in another. Vacancy reporting gaps compound across large portfolios.",
      },
      {
        title: "Inconsistent property classification across systems",
        description:
          "The same property is categorized differently in the PMS, accounting system, and investor reports. NOI aggregations, cap rate calculations, and portfolio-level metrics inherit these inconsistencies silently.",
      },
    ],
    finding: {
      beforeLabel: "Reported Vacancy Loss",
      beforeValue: "5.1%",
      afterLabel: "Actual Vacancy Loss",
      afterValue: "0.0%",
      annotation:
        "100% discrepancy in vacancy loss calculation. Reported value was a phantom metric not grounded in raw lease data.",
    },
    result: {
      scoreBefore: 43,
      scoreAfter: 65,
      summary:
        "A real estate portfolio manager found 10%+ collection overstatement masking uncollected rent across 12 properties.",
    },
    ctaLabel: "Book a Real Estate Diagnostic",
  },
];

/** Look up a vertical by its ID. Returns undefined for unknown IDs. */
export function getVerticalById(id: string): VerticalData | undefined {
  return verticals.find((v) => v.id === id);
}

/** All valid vertical IDs. */
export const VERTICAL_IDS = verticals.map((v) => v.id);

/** Default vertical when no valid selection is provided. */
export const DEFAULT_VERTICAL_ID = "fintech";
