import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Content audit: verify that no internal implementation details
 * have leaked into the platform page or its components.
 */

const EXCLUDED_TERMS = [
  "role_runner",
  "model_config",
  "pipeline_models",
  "POST /gates",
  "POST /runs",
  "POST /artifacts",
  "POST /approvals",
  "task.pipeline",
  "retry.py",
  "subprocess",
  ".venv",
  "governed_object",
  "Pack",
];

const PLATFORM_DIR = join(__dirname, "..");
const PLATFORM_PAGE = join(__dirname, "..", "..", "..", "app", "platform", "page.tsx");

function getAllPlatformFiles(): string[] {
  const files: string[] = [PLATFORM_PAGE];
  const componentFiles = readdirSync(PLATFORM_DIR).filter(
    (f) => f.endsWith(".tsx") || f.endsWith(".ts")
  );
  for (const f of componentFiles) {
    files.push(join(PLATFORM_DIR, f));
  }
  return files;
}

describe("Content audit: no internal implementation details", () => {
  const files = getAllPlatformFiles();

  for (const filePath of files) {
    const fileName = filePath.split("/").pop()!;
    const content = readFileSync(filePath, "utf-8");

    for (const term of EXCLUDED_TERMS) {
      it(`${fileName} does not contain "${term}"`, () => {
        expect(content).not.toContain(term);
      });
    }
  }
});
