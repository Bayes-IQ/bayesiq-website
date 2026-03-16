import { describe, it, expect } from "vitest";
import { createElement } from "react";
import TrustBadge, { STATUS_CONFIG } from "../TrustBadge";

describe("TrustBadge", () => {
  it("returns null when status is null", () => {
    const result = TrustBadge({ status: null });
    expect(result).toBeNull();
  });

  it("returns a JSX element for each valid status", () => {
    const statuses = ["approved", "pending", "rejected", "deferred"] as const;
    for (const status of statuses) {
      const result = TrustBadge({ status });
      expect(result).not.toBeNull();
    }
  });

  it("renders correct aria-label for each status", () => {
    const statuses = ["approved", "pending", "rejected", "deferred"] as const;
    for (const status of statuses) {
      const result = TrustBadge({ status });
      expect(result).not.toBeNull();
      expect(result!.props["aria-label"]).toBe(STATUS_CONFIG[status].label);
    }
  });

  it("uses text-[10px] class for size sm", () => {
    const result = TrustBadge({ status: "approved", size: "sm" });
    expect(result).not.toBeNull();
    expect(result!.props.className).toContain("text-[10px]");
    expect(result!.props.className).not.toContain("text-xs");
  });

  it("uses text-xs class for size md (default)", () => {
    const result = TrustBadge({ status: "approved", size: "md" });
    expect(result).not.toBeNull();
    expect(result!.props.className).toContain("text-xs");
  });

  it("hides label text when showLabel is false", () => {
    const result = TrustBadge({ status: "approved", showLabel: false });
    expect(result).not.toBeNull();
    // Children: [svg, false] when showLabel=false
    const children = result!.props.children;
    // Second child should be falsy (no label span)
    expect(children[1]).toBeFalsy();
  });

  it("shows label text when showLabel is true (default)", () => {
    const result = TrustBadge({ status: "approved" });
    expect(result).not.toBeNull();
    const children = result!.props.children;
    // Second child should be a span with the label
    expect(children[1]).toBeTruthy();
  });

  it("each status has a distinct icon path (colorblind safety)", () => {
    const paths = new Set(
      Object.values(STATUS_CONFIG).map((c) => c.iconPath)
    );
    expect(paths.size).toBe(4);
  });

  it("applies correct color classes per status", () => {
    const statuses = ["approved", "pending", "rejected", "deferred"] as const;
    for (const status of statuses) {
      const result = TrustBadge({ status });
      const config = STATUS_CONFIG[status];
      expect(result!.props.className).toContain(config.bg);
      expect(result!.props.className).toContain(config.text);
    }
  });
});
