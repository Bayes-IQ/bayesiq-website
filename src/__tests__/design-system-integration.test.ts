import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

describe("Design system integration", () => {
  const globalsPath = join(process.cwd(), "src/app/globals.css");
  const fontsDir = join(process.cwd(), "public/fonts");

  it("globals.css contains --biq-color-primary token", () => {
    const css = readFileSync(globalsPath, "utf-8");
    expect(css).toContain("--biq-color-primary");
  });

  it("tailwind-v4-theme.css contains semantic color tokens in @theme", () => {
    const themePath = join(process.cwd(), "src/vendor/biq/tailwind-v4-theme.css");
    const css = readFileSync(themePath, "utf-8");
    expect(css).toContain("--color-biq-text-primary");
    expect(css).toContain("--color-biq-surface-1");
    expect(css).toContain("--color-biq-border");
    expect(css).toContain("--color-biq-status-error");
    expect(css).toContain("--color-biq-status-success");
    expect(css).toContain("--color-biq-status-warning");
    expect(css).toContain("--color-biq-status-info");
  });

  it("globals.css contains font tokens", () => {
    const css = readFileSync(globalsPath, "utf-8");
    expect(css).toContain("--biq-font-sans");
    expect(css).toContain("--biq-font-mono");
  });

  it("Inter font file exists in public/fonts", () => {
    expect(
      existsSync(join(fontsDir, "inter/Inter-Variable.woff2"))
    ).toBe(true);
  });

  it("JetBrains Mono font file exists in public/fonts", () => {
    expect(
      existsSync(
        join(fontsDir, "jetbrains-mono/JetBrainsMono-Regular.woff2")
      )
    ).toBe(true);
  });

  it("no old text-bayesiq-* or bg-bayesiq-* classes in src/components/ (light context)", () => {
    // Scan all .tsx files in components for old numbered bayesiq classes
    // that should have been migrated to semantic tokens.
    // Dark-context classes (900, 800, 950 for bg; 50 for text on dark) are allowed.
    const lightPatterns = [
      /\btext-bayesiq-(?:600|700)\b/,
      /\bbg-bayesiq-(?:50|100|200)\b/,
      /\bborder-bayesiq-(?:100|200|300)\b/,
    ];

    function scanDir(dir: string): string[] {
      const violations: string[] = [];
      let entries: string[];
      try {
        entries = readdirSync(dir, { withFileTypes: true }) as unknown as string[];
      } catch {
        return violations;
      }
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== "__tests__" && entry.name !== "platform") {
          violations.push(...scanDir(fullPath));
        } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
          const content = readFileSync(fullPath, "utf-8");
          for (const pattern of lightPatterns) {
            if (pattern.test(content)) {
              violations.push(`${fullPath}: matches ${pattern}`);
            }
          }
        }
      }
      return violations;
    }

    const componentsDir = join(process.cwd(), "src/components");
    const violations = scanDir(componentsDir);
    expect(violations).toEqual([]);
  });
});
