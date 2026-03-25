import { describe, it, expect } from "vitest";
import {
  verticals,
  getVerticalById,
  VERTICAL_IDS,
  DEFAULT_VERTICAL_ID,
} from "../industry-data";

describe("industry-data", () => {
  it("exports exactly 4 verticals", () => {
    expect(verticals).toHaveLength(4);
  });

  it("has the correct vertical IDs", () => {
    expect(VERTICAL_IDS).toEqual(["fintech", "healthcare", "saas", "real_estate"]);
  });

  it("defaults to fintech", () => {
    expect(DEFAULT_VERTICAL_ID).toBe("fintech");
  });

  it("each vertical has at least 2 failure patterns", () => {
    for (const v of verticals) {
      expect(v.failurePatterns.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("each vertical has a finding with before/after values", () => {
    for (const v of verticals) {
      expect(v.finding.beforeLabel).toBeTruthy();
      expect(v.finding.beforeValue).toBeTruthy();
      expect(v.finding.afterLabel).toBeTruthy();
      expect(v.finding.afterValue).toBeTruthy();
    }
  });

  it("each vertical has a CTA label", () => {
    for (const v of verticals) {
      expect(v.ctaLabel).toBeTruthy();
    }
  });

  it("getVerticalById returns correct vertical", () => {
    const fintech = getVerticalById("fintech");
    expect(fintech?.displayName).toBe("Fintech");
  });

  it("getVerticalById returns undefined for unknown ID", () => {
    expect(getVerticalById("bogus")).toBeUndefined();
  });

  it("no vertical content contains engagement pricing patterns", () => {
    // Guards against accidentally adding engagement/tier pricing to industry data.
    // Dollar amounts that are *finding values* (e.g., "$340K revenue discrepancy") are fine.
    // What we block: pricing tiers like "$15K", "$25K", "$4,500", "/month", "K per".
    for (const v of verticals) {
      const allText = [
        v.headline,
        ...v.failurePatterns.map((fp) => fp.description),
      ].join(" ");
      expect(allText).not.toMatch(/\$[\d,]+K?\s*(per|\/month)/i);
      expect(allText).not.toMatch(/\/month/i);
    }
  });
});
