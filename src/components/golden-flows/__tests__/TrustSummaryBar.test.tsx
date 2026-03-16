import { describe, it, expect } from "vitest";
import TrustSummaryBar from "../TrustSummaryBar";
import type { TrustBadgeSummary } from "@/lib/governance";

function makeSummary(overrides?: Partial<TrustBadgeSummary>): TrustBadgeSummary {
  return {
    total_objects: 10,
    by_status: { approved: 7, pending: 2, rejected: 1 },
    by_object_type: {
      finding: { total: 5, by_status: { approved: 4, pending: 1 } },
      correction: { total: 5, by_status: { approved: 3, pending: 1, rejected: 1 } },
    },
    ...overrides,
  };
}

describe("TrustSummaryBar", () => {
  it("returns null when summary is null", () => {
    const result = TrustSummaryBar({ summary: null });
    expect(result).toBeNull();
  });

  it("renders when summary is provided", () => {
    const result = TrustSummaryBar({ summary: makeSummary() });
    expect(result).not.toBeNull();
    expect(result!.props["data-testid"]).toBe("trust-summary-bar");
  });

  it("renders per-object-type rollup rows", () => {
    const result = TrustSummaryBar({ summary: makeSummary() });
    expect(result).not.toBeNull();
    // Find the rollup div by checking children
    const children = result!.props.children;
    // Second child is the rollup div (when by_object_type is non-empty)
    const rollupDiv = children[1];
    expect(rollupDiv).not.toBeFalsy();
    expect(rollupDiv.props["data-testid"]).toBe("trust-summary-rollups");
  });

  it("omits rollup row when by_object_type is empty", () => {
    const summary = makeSummary({ by_object_type: {} });
    const result = TrustSummaryBar({ summary });
    expect(result).not.toBeNull();
    const children = result!.props.children;
    // Second child should be false/null when empty
    expect(children[1]).toBeFalsy();
  });

  it("displays total_objects count", () => {
    const result = TrustSummaryBar({ summary: makeSummary({ total_objects: 42 }) });
    expect(result).not.toBeNull();
    // The overall counts row (first child) should contain the total
    const overviewRow = result!.props.children[0];
    const lastChild = overviewRow.props.children[overviewRow.props.children.length - 1];
    // "of 42 objects"
    expect(lastChild.props.children).toContain(42);
  });
});
