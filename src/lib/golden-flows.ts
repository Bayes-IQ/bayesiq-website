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
