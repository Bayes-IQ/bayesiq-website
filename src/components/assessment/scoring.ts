// Deterministic scoring + tiering + recommendations
// Derives from docs/product/assessment_tool.md — do not add copy here that
// isn't sourced from that document.

import type {
  Question,
  AssessmentResponse,
  AssessmentResult,
  Recommendation,
  Tier,
} from "./assessmentTypes";

// ---------------------------------------------------------------------------
// Question definitions (source: docs/product/assessment_tool.md §Questions)
// ---------------------------------------------------------------------------

export const QUESTIONS: Question[] = [
  {
    id: "q1_metric_consistency",
    text: "When two dashboards show the same business metric, how often do they agree?",
    choices: [
      {
        text: "They frequently disagree \u2014 we've given up reconciling",
        score: 0,
      },
      {
        text: "They sometimes disagree and it takes real effort to explain why",
        score: 1,
      },
      {
        text: "They usually agree, with occasional unexplained gaps",
        score: 2,
      },
      {
        text: "They always agree \u2014 we can explain every difference",
        score: 3,
      },
    ],
  },
  {
    id: "q2_telemetry_coverage",
    text: "How confident are you that your key telemetry events are firing correctly in production?",
    choices: [
      {
        text: "Not confident \u2014 we've found missing or wrong events before",
        score: 0,
      },
      {
        text: "Somewhat confident \u2014 we do spot checks but no systematic validation",
        score: 1,
      },
      {
        text: "Fairly confident \u2014 we have some automated checks",
        score: 2,
      },
      {
        text: "Very confident \u2014 we validate against a spec with automated tests",
        score: 3,
      },
    ],
  },
  {
    id: "q3_pipeline_observability",
    text: "When a data pipeline fails or produces bad output, how quickly do you find out?",
    choices: [
      {
        text: "We find out from a downstream stakeholder or a broken dashboard",
        score: 0,
      },
      {
        text: "We have some alerting but gaps \u2014 issues slip through",
        score: 1,
      },
      {
        text: "We have alerting on most critical paths",
        score: 2,
      },
      {
        text: "We have end-to-end monitoring with SLOs and automated recovery",
        score: 3,
      },
    ],
  },
  {
    id: "q4_metric_definitions",
    text: "How well-defined are your core business metrics?",
    choices: [
      {
        text: "Different teams use different definitions for the same metric",
        score: 0,
      },
      {
        text: "Definitions exist in a wiki but aren\u2019t enforced in queries or dashboards",
        score: 1,
      },
      {
        text: "Definitions are documented and mostly consistent across teams",
        score: 2,
      },
      {
        text: "Definitions are codified in a metrics layer with version control",
        score: 3,
      },
    ],
  },
  {
    id: "q5_incident_history",
    text: "In the last 6 months, how many times did a data quality issue affect a decision, report, or external deliverable?",
    choices: [
      { text: "3 or more times", score: 0 },
      { text: "Twice", score: 1 },
      { text: "Once", score: 2 },
      { text: "Never (that we know of)", score: 3 },
    ],
  },
  {
    id: "q6_data_trust",
    text: "How much do your stakeholders trust the data they see in dashboards and reports?",
    choices: [
      {
        text: "Low trust \u2014 teams routinely question numbers and build their own shadow reports",
        score: 0,
      },
      {
        text: "Mixed \u2014 some dashboards are trusted, others are questioned",
        score: 1,
      },
      {
        text: "Generally trusted \u2014 isolated concerns only",
        score: 2,
      },
      {
        text: "High trust \u2014 data is used confidently to make decisions",
        score: 3,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Scoring (source: docs/product/assessment_tool.md §Scoring Rubric)
// ---------------------------------------------------------------------------

/** Maximum possible raw score across all questions. */
export const MAX_SCORE = QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.choices.map((c) => c.score)),
  0,
);

/**
 * Sum the scores from a set of responses.
 * Returns 0 for an empty response array.
 */
export function computeScore(responses: AssessmentResponse[]): number {
  return responses.reduce((sum, r) => sum + r.score, 0);
}

/**
 * Convert a raw score to a 0–100 integer, rounded to the nearest 5.
 */
export function rawToPercent(rawScore: number, maxScore: number = MAX_SCORE): number {
  if (maxScore <= 0) return 0;
  const exact = (rawScore / maxScore) * 100;
  return Math.round(exact / 5) * 5;
}

/**
 * Map a raw score to a tier.
 *
 * Thresholds (source: docs/product/assessment_tool.md §Scoring Rubric):
 *   0–6   → at_risk      (0–33%)
 *   7–12  → needs_work   (38–67%)
 *   13–18 → strong       (72–100%)
 */
export function scoreToTier(rawScore: number): Tier {
  if (rawScore <= 6) return "at_risk";
  if (rawScore <= 12) return "needs_work";
  return "strong";
}

// ---------------------------------------------------------------------------
// Recommendations (source: docs/product/assessment_tool.md §Recommendations)
// ---------------------------------------------------------------------------

const RECOMMENDATIONS: Record<Tier, Recommendation[]> = {
  at_risk: [
    {
      heading: "Audit your metric definitions first.",
      body: "If different teams run different queries for \u201cconversion rate\u201d or \u201cDAU,\u201d no amount of tooling will fix the disagreement. Start by documenting what each metric means and where it\u2019s computed.",
    },
    {
      heading: "Find one dashboard that everyone trusts and trace it backwards.",
      body: "Understand exactly how it\u2019s built. That becomes your baseline.",
    },
    {
      heading: "Run a telemetry audit against your logging spec.",
      body: "If you don\u2019t have a logging spec, write one \u2014 even a rough one \u2014 and compare it against what actually fires.",
    },
    {
      heading: "Set up alerting on your most critical pipeline steps.",
      body: "You shouldn\u2019t find out about pipeline failures from a broken dashboard.",
    },
    {
      heading: "Prioritize a professional audit.",
      body: "At this level of data risk, the return on investment from a systematic audit is high \u2014 both in direct cost savings and in restoring stakeholder trust.",
    },
  ],
  needs_work: [
    {
      heading: "Close the gap between documented definitions and enforced definitions.",
      body: "If your metrics layer doesn\u2019t reflect what\u2019s in the wiki, stakeholders will keep doing their own math.",
    },
    {
      heading: "Extend your telemetry validation to cover more events systematically.",
      body: "Spot checks catch the obvious; automated checks catch the subtle and the intermittent.",
    },
    {
      heading: "Review pipeline alerting coverage.",
      body: "Map every critical data path and check whether there\u2019s monitoring on each one. The gaps are usually obvious once you look.",
    },
    {
      heading: "Formalize one metrics review process.",
      body: "Even a quarterly review of your top 10 metrics catches drift before it compounds.",
    },
    {
      heading: "Consider a targeted audit.",
      body: "Focus on your highest-risk area \u2014 telemetry validation, pipeline observability, or metric definition consistency \u2014 rather than trying to improve everything at once.",
    },
  ],
  strong: [
    {
      heading: "Schedule a periodic external audit.",
      body: "Internal teams develop blind spots. An external review catches structural issues that are invisible from inside.",
    },
    {
      heading: "Check whether your monitoring has kept up with product growth.",
      body: "New features, new events, new teams \u2014 coverage degrades unless someone actively maintains it.",
    },
    {
      heading: "Validate that your metrics layer definitions match stakeholder mental models.",
      body: "Even a well-built metrics layer can have definition drift if product strategy has evolved.",
    },
    {
      heading: "Consider publishing an internal data quality standard.",
      body: "A written bar for what \u201cgood\u201d looks like in your organization, used during code review and incident retros.",
    },
    {
      heading: "Look at cross-team consistency.",
      body: "Strong central infrastructure doesn\u2019t guarantee teams are all using it the same way.",
    },
  ],
};

const TIER_META: Record<
  Tier,
  { label: string; tagline: string; description: string; ctaSubtext: string }
> = {
  at_risk: {
    label: "At Risk",
    tagline:
      "Your data has significant reliability gaps that are likely affecting decisions today.",
    description:
      "The signals across your answers suggest your data infrastructure has real, compounding problems \u2014 inconsistent metrics, gaps in telemetry validation, and low stakeholder trust. This isn\u2019t a failure of effort; it\u2019s a structural problem that gets harder to fix the longer it compounds. The good news: these issues are findable and fixable with a systematic audit.",
    ctaSubtext:
      "A BayesIQ audit will identify the exact issues and give you a prioritized fix plan \u2014 typically in under two weeks.",
  },
  needs_work: {
    label: "Needs Work",
    tagline: "Your data foundation is functional but has meaningful gaps worth addressing.",
    description:
      "You have the right instincts \u2014 you\u2019re doing some validation, you care about metric consistency \u2014 but there are gaps that create risk. Issues are slipping through, definitions aren\u2019t fully enforced, or trust is inconsistent across teams. Addressing the highest-risk gaps now prevents them from becoming serious problems.",
    ctaSubtext:
      "A targeted BayesIQ review will identify the highest-risk gaps and give you a concrete plan for closing them.",
  },
  strong: {
    label: "Strong",
    tagline: "Your data infrastructure shows real maturity. Protect what\u2019s working.",
    description:
      "Your answers indicate a data organization that treats data quality seriously \u2014 codified metrics, automated validation, proactive monitoring. The risk at this stage isn\u2019t foundational failure but drift: as your product and team grow, coverage gaps open. Periodic audits catch what daily operations miss.",
    ctaSubtext:
      "Even mature data organizations benefit from a periodic external review. We\u2019ll tell you what to watch for as you scale.",
  },
};

/**
 * Get the recommendations for a tier.
 * Always returns a non-empty array.
 */
export function getRecommendations(tier: Tier): Recommendation[] {
  return RECOMMENDATIONS[tier];
}

/**
 * Build the full AssessmentResult from a set of responses.
 */
export function buildResult(responses: AssessmentResponse[]): AssessmentResult {
  const rawScore = computeScore(responses);
  const scorePercent = rawToPercent(rawScore, MAX_SCORE);
  const tier = scoreToTier(rawScore);
  const meta = TIER_META[tier];
  const recommendations = getRecommendations(tier);

  return {
    rawScore,
    maxScore: MAX_SCORE,
    scorePercent,
    tier,
    tierLabel: meta.label,
    tagline: meta.tagline,
    description: meta.description,
    recommendations,
    ctaSubtext: meta.ctaSubtext,
  };
}

// Re-export types for consumers who only import from scoring.ts
export type { AssessmentResult, AssessmentResponse, Recommendation, Tier } from "./assessmentTypes";
