import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

describe("Design system integration", () => {
  const dsRoot = join(
    process.cwd(),
    "node_modules/@bayesiq/design-system/dist"
  );

  it("tokens.css is installed and contains --biq-color-primary", () => {
    const tokensPath = join(dsRoot, "tokens.css");
    expect(existsSync(tokensPath)).toBe(true);
    const css = readFileSync(tokensPath, "utf-8");
    expect(css).toContain("--biq-color-primary");
  });

  it("tokens.css contains font tokens", () => {
    const css = readFileSync(join(dsRoot, "tokens.css"), "utf-8");
    expect(css).toContain("--biq-font-sans");
    expect(css).toContain("--biq-font-mono");
  });

  it("Inter font file is installed", () => {
    expect(
      existsSync(join(dsRoot, "fonts/inter/Inter-Variable.woff2"))
    ).toBe(true);
  });

  it("JetBrains Mono font file is installed", () => {
    expect(
      existsSync(
        join(dsRoot, "fonts/jetbrains-mono/JetBrainsMono-Regular.woff2")
      )
    ).toBe(true);
  });
});
