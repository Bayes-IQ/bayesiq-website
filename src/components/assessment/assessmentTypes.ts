// Assessment types — derived from docs/product/assessment_tool.md
// All UI copy and scoring logic derives from that document.

export type Tier = "at_risk" | "needs_work" | "strong";

export interface Choice {
  /** Display text shown to the user. */
  text: string;
  /** Score contribution (0–3). */
  score: number;
}

export interface Question {
  /** Unique identifier for the question. */
  id: string;
  /** Question text shown to the user. */
  text: string;
  /** Ordered list of answer choices. */
  choices: Choice[];
}

/**
 * A single recorded answer: which question was answered and which choice index
 * was selected.
 */
export interface AssessmentResponse {
  questionId: string;
  /** Index into Question.choices[]. */
  choiceIndex: number;
  /** Score value of the selected choice, stored for convenience. */
  score: number;
}

export interface Recommendation {
  /** Short bold label (first sentence or heading). */
  heading: string;
  /** Full recommendation text. */
  body: string;
}

export interface AssessmentResult {
  /** Raw total score (0–maxPossible). */
  rawScore: number;
  /** Maximum possible raw score given the question set. */
  maxScore: number;
  /** Score as a 0–100 integer (rounded to nearest 5). */
  scorePercent: number;
  /** Tier classification. */
  tier: Tier;
  /** Human-readable tier label. */
  tierLabel: string;
  /** Short tagline for the tier. */
  tagline: string;
  /** Longer description for the results panel. */
  description: string;
  /** Actionable recommendations for this tier. */
  recommendations: Recommendation[];
  /** CTA subtext tailored to the tier. */
  ctaSubtext: string;
}
