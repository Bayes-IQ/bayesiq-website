import { readFileSync } from "fs";
import { join } from "path";

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

function loadManifest(): VerticalManifest {
  const manifestPath = join(
    process.cwd(),
    "fixtures",
    "golden-flows",
    "verticals.json"
  );
  return JSON.parse(readFileSync(manifestPath, "utf-8"));
}

export function getGoldenFlowsState(): RolloutState {
  const state = process.env.NEXT_PUBLIC_GOLDEN_FLOWS_STATE;
  if (state === "hidden" || state === "live") return state;
  return "off";
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

// --- Narrative ---

export interface VerticalNarrative {
  vertical_id: string;
  display_name: string;
  status_quo: string;
  with_bayesiq: string;
  headline_finding: string;
  cta_label: string;
  cta_variant: "diagnostic" | "reliability_program" | "book_session";
}

export function getNarrative(slug: string): VerticalNarrative | null {
  try {
    const filePath = join(
      process.cwd(),
      "fixtures",
      "golden-flows",
      "narratives",
      `${slug}.json`
    );
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

// --- Hook Metrics ---

export type SeverityLevel = "critical" | "warning" | "moderate" | "healthy";

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

export function getHookMetrics(slug: string): HookMetrics | null {
  try {
    const filePath = join(
      process.cwd(),
      "fixtures",
      "golden-flows",
      "hook-metrics",
      `${slug}.json`
    );
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

export function getAllHookMetrics(): Map<string, HookMetrics> {
  const map = new Map<string, HookMetrics>();
  for (const slug of getAllVerticalSlugs()) {
    const metrics = getHookMetrics(slug);
    if (metrics) map.set(slug, metrics);
  }
  return map;
}

// --- Severity Colors (reusable across GF components) ---

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
