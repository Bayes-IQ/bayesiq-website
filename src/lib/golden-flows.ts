/**
 * Golden Flows — Static Data Loader
 *
 * Loads Golden Flows payload data at build time (Next.js SSG).
 *
 * ## Path convention
 *
 * Contract B (per-vertical payloads):
 *   public/golden-flows/{vertical}/{payload_type}.json
 *   e.g. public/golden-flows/hospital/executive_questions.json
 *
 * Contract C (governance payloads, cross-vertical):
 *   public/golden-flows/governance/{payload_type}.json
 *   e.g. public/golden-flows/governance/approval_status.json
 *
 * ## Fallback
 *
 * If a public/ JSON file does not exist, the loader falls back to
 * fixtures/golden-flows/ so existing fixture data continues to work.
 * This makes the PR independently mergeable — public/ dirs can be
 * empty and the build still succeeds.
 *
 * ## Mapping between slug and fixture subdirectory
 *
 * The fixture directory uses kebab-case subdirectories keyed by payload
 * type (e.g. fixtures/golden-flows/hook-metrics/{slug}.json), while the
 * public/ directory uses underscore payload_type names keyed by vertical
 * (e.g. public/golden-flows/{slug}/hook_metrics.json).
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";

// ---------- Contract B typed imports ----------
import type {
  ArtifactLinks,
  CascadeData,
  DiscoverInsights,
  ExecutiveQuestions,
  HookMetrics as HookMetricsType,
  ScreenshotManifest,
  Trajectory,
  VerticalNarrative as VerticalNarrativeSchema,
} from "@/types/golden-flows";

// ---------- Contract C typed imports ----------
import type {
  ApprovalMetadata,
  BusinessEventGovernance,
  CascadeGovernance,
  FeedbackThreads,
  PublishedDocs,
  ReviewContext,
  TrustBadges,
} from "@/types/golden-flows";

// ============================================================
// Re-exported types used by existing components
// ============================================================

export type RolloutState = "off" | "hidden" | "live";

export interface Vertical {
  id: string;
  display_name: string;
  slug: string;
  status: "ready" | "stub";
}

interface VerticalManifest {
  verticals: Vertical[];
}

export type SeverityLevel = "critical" | "warning" | "moderate" | "healthy";

/**
 * Inline HookMetrics interface retained for backward compatibility with
 * existing components that import it from this module. The canonical
 * generated type is in @/types/golden-flows.
 */
export interface HookMetrics {
  schema_version: string;
  payload_type: string;
  vertical: string;
  discrepancy_headline: string;
  consequence: string;
  trust_cue: string;
  score: number;
  severity_level: SeverityLevel;
}

export interface ExecutiveQuestion {
  question_id: string;
  priority: "flagship" | "secondary";
  question_text: string;
  answer_summary: string;
  severity: "critical" | "high" | "medium" | "low";
}

export interface ExecutiveQuestionsPayload {
  schema_version: string;
  payload_type: string;
  vertical: string;
  questions: ExecutiveQuestion[];
}

export interface VerticalNarrativePayload {
  vertical_id: string;
  display_name: string;
  status_quo: string;
  with_bayesiq: string;
  headline_finding: string;
  cta_label: string;
  cta_variant: "diagnostic" | "reliability_program" | "book_session";
}

/** @deprecated Use VerticalNarrativePayload — kept for backward compat */
export type VerticalNarrative = VerticalNarrativePayload;

export type QuestionSeverity = "critical" | "high" | "medium" | "low";

// ============================================================
// Board Report types (from DAK board_report.json)
// ============================================================

export type BoardReportSeverity = "high" | "medium" | "low";

export interface BoardReportMetric {
  metric: string;
  period: string;
  reported: number;
  audited: number;
  delta_pct: number;
}

export interface BoardReportRisk {
  severity: BoardReportSeverity;
  title: string;
  business_impact: string;
  rows_affected: number;
}

export interface BoardReportAction {
  action: string;
  owner: string;
  effort: "S" | "M" | "L";
  severity: BoardReportSeverity;
}

export interface BoardReport {
  schema_version: number;
  payload_type: "board_report";
  score: number;
  interpretation: string;
  total_findings: number;
  findings_by_severity: Record<string, number>;
  key_metrics: BoardReportMetric[];
  top_risks: BoardReportRisk[];
  recommended_actions: BoardReportAction[];
  trend: string | null;
  executive_summary?: string;
}

// ============================================================
// Core loader helpers
// ============================================================

const ROOT = process.cwd();

/**
 * Try to read JSON from `public/golden-flows/{vertical}/{payloadType}.json`.
 * If it doesn't exist, return null so callers can fall back.
 */
function tryPublicJson<T>(vertical: string, payloadType: string): T | null {
  const publicPath = join(
    ROOT,
    "public",
    "golden-flows",
    vertical,
    `${payloadType}.json`
  );
  if (!existsSync(publicPath)) return null;
  return JSON.parse(readFileSync(publicPath, "utf-8")) as T;
}

/**
 * Try to read JSON from `fixtures/golden-flows/{subdir}/{slug}.json`.
 * Returns null on any error (file missing, bad JSON, etc.).
 */
function tryFixtureJson<T>(subdir: string, slug: string): T | null {
  try {
    const fixturePath = join(
      ROOT,
      "fixtures",
      "golden-flows",
      subdir,
      `${slug}.json`
    );
    return JSON.parse(readFileSync(fixturePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

/**
 * Load a Contract B payload for a vertical.
 *
 * Resolution order:
 *   1. public/golden-flows/{slug}/{payloadType}.json
 *   2. fixtures/golden-flows/{fixtureSubdir}/{slug}.json
 */
function loadContractB<T>(
  slug: string,
  payloadType: string,
  fixtureSubdir: string
): T | null {
  return tryPublicJson<T>(slug, payloadType) ?? tryFixtureJson<T>(fixtureSubdir, slug);
}

/**
 * Load a Contract C (governance) payload.
 *
 * Resolution order:
 *   1. public/golden-flows/governance/{payloadType}.json
 *   2. (no fixture fallback — Contract C is new)
 */
function loadContractC<T>(payloadType: string): T | null {
  return tryPublicJson<T>("governance", payloadType);
}

// ============================================================
// Manifest & rollout state (unchanged public API)
// ============================================================

function loadManifest(): VerticalManifest {
  // Try public/ first, then fixtures
  const publicPath = join(ROOT, "public", "golden-flows", "verticals.json");
  if (existsSync(publicPath)) {
    return JSON.parse(readFileSync(publicPath, "utf-8"));
  }
  const fixturePath = join(ROOT, "fixtures", "golden-flows", "verticals.json");
  return JSON.parse(readFileSync(fixturePath, "utf-8"));
}

export function getGoldenFlowsState(): RolloutState {
  const state = process.env.NEXT_PUBLIC_GOLDEN_FLOWS_STATE;
  if (state === "off" || state === "hidden") return state;
  return "live";
}

export function getVerticals(): Vertical[] {
  const state = getGoldenFlowsState();
  const all = loadManifest().verticals;
  if (state === "hidden") {
    return all.filter((v) => v.status === "ready");
  }
  return all;
}

export function getVerticalBySlug(slug: string): Vertical | null {
  const verticals = getVerticals();
  return verticals.find((v) => v.slug === slug) ?? null;
}

export function getAllVerticalSlugs(): string[] {
  return loadManifest().verticals.map((v) => v.slug);
}

// ============================================================
// Contract B accessors (existing + new)
// ============================================================

// --- Narrative ---

export function getNarrative(slug: string): VerticalNarrativePayload | null {
  return loadContractB<VerticalNarrativePayload>(
    slug,
    "vertical_narrative",
    "narratives"
  );
}

// --- Hook Metrics ---

export function getHookMetrics(slug: string): HookMetrics | null {
  return loadContractB<HookMetrics>(slug, "hook_metrics", "hook-metrics");
}

export function getAllHookMetrics(): Map<string, HookMetrics> {
  const map = new Map<string, HookMetrics>();
  for (const slug of getAllVerticalSlugs()) {
    const metrics = getHookMetrics(slug);
    if (metrics) map.set(slug, metrics);
  }
  return map;
}

// --- Executive Questions ---

export function getExecutiveQuestions(
  slug: string
): ExecutiveQuestionsPayload | null {
  return loadContractB<ExecutiveQuestionsPayload>(
    slug,
    "executive_questions",
    "executive-questions"
  );
}

// --- Cascade Data ---

export function getCascadeData(slug: string): CascadeData | null {
  return loadContractB<CascadeData>(slug, "cascade_data", "cascade-data");
}

// --- Artifact Links ---

export function getArtifactLinks(slug: string): ArtifactLinks | null {
  return loadContractB<ArtifactLinks>(slug, "artifact_links", "artifact-links");
}

// --- Screenshot Manifest ---

export function getScreenshotManifest(slug: string): ScreenshotManifest | null {
  return loadContractB<ScreenshotManifest>(
    slug,
    "screenshot_manifest",
    "screenshot-manifest"
  );
}

// --- Discover Insights ---

export function getDiscoverInsights(slug: string): DiscoverInsights | null {
  return loadContractB<DiscoverInsights>(
    slug,
    "discover_insights",
    "discover-insights"
  );
}

// --- Trajectory ---

export function getTrajectory(slug: string): Trajectory | null {
  return loadContractB<Trajectory>(slug, "trajectory", "trajectory");
}

// --- Board Report ---

export function getBoardReport(slug: string): BoardReport | null {
  return loadContractB<BoardReport>(slug, "board_report", "board-report");
}

// ============================================================
// Contract C accessors (governance payloads)
// ============================================================

export function getApprovalStatus(): ApprovalMetadata | null {
  return loadContractC<ApprovalMetadata>("approval_status");
}

export function getBusinessEvents(): BusinessEventGovernance | null {
  return loadContractC<BusinessEventGovernance>("business_events");
}

export function getCascadeGovernance(): CascadeGovernance | null {
  return loadContractC<CascadeGovernance>("cascade_governance");
}

export function getFeedbackThreads(): FeedbackThreads | null {
  return loadContractC<FeedbackThreads>("feedback_threads");
}

export function getPublishedDocs(): PublishedDocs | null {
  return loadContractC<PublishedDocs>("published_docs");
}

export function getReviewContext(): ReviewContext | null {
  return loadContractC<ReviewContext>("review_context");
}

export function getTrustBadges(): TrustBadges | null {
  return loadContractC<TrustBadges>("trust_badges");
}

// ============================================================
// Severity color helpers (unchanged public API)
// ============================================================

export function severityBorderColor(level: SeverityLevel): string {
  switch (level) {
    case "critical": return "border-red-600";
    case "warning": return "border-amber-500";
    case "moderate": return "border-yellow-400";
    case "healthy": return "border-green-500";
  }
}

export function severityTextColor(level: SeverityLevel): string {
  switch (level) {
    case "critical": return "text-red-600";
    case "warning": return "text-amber-500";
    case "moderate": return "text-yellow-500";
    case "healthy": return "text-green-500";
  }
}

export function severityBgColor(level: SeverityLevel): string {
  switch (level) {
    case "critical": return "bg-red-50";
    case "warning": return "bg-amber-50";
    case "moderate": return "bg-yellow-50";
    case "healthy": return "bg-green-50";
  }
}

export function questionSeverityBorderColor(level: QuestionSeverity): string {
  switch (level) {
    case "critical":
      return "border-red-600";
    case "high":
      return "border-amber-500";
    case "medium":
      return "border-yellow-400";
    case "low":
      return "border-green-500";
  }
}

export function questionSeverityBadgeColors(level: QuestionSeverity): string {
  switch (level) {
    case "critical":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-amber-100 text-amber-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
  }
}
