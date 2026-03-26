import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

describe("Design system integration", () => {
  const globalsPath = join(process.cwd(), "src/app/globals.css");
  const fontsDir = join(process.cwd(), "public/fonts");

  it("globals.css contains --biq-color-primary token", () => {
    const css = readFileSync(globalsPath, "utf-8");
    expect(css).toContain("--biq-color-primary");
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
});
