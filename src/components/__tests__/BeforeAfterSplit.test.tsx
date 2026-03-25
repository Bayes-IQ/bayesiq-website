import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BeforeAfterSplit from "../BeforeAfterSplit";

const defaultProps = {
  before: {
    label: "Before Audit",
    score: 38,
    severity: "Critical",
    details: "Metrics were broken.",
  },
  after: {
    label: "After Remediation",
    score: 87,
    tier: "Audit + Plan",
    details: "Metrics are now reliable.",
  },
};

describe("BeforeAfterSplit", () => {
  it("renders both before and after content", () => {
    render(<BeforeAfterSplit {...defaultProps} />);
    expect(screen.getByText("Before Audit")).toBeTruthy();
    expect(screen.getByText("After Remediation")).toBeTruthy();
    expect(screen.getByText("Metrics were broken.")).toBeTruthy();
    expect(screen.getByText("Metrics are now reliable.")).toBeTruthy();
  });

  it("renders severity badge with correct text", () => {
    render(<BeforeAfterSplit {...defaultProps} />);
    expect(screen.getByText("Critical")).toBeTruthy();
  });

  it("renders tier badge in after column", () => {
    render(<BeforeAfterSplit {...defaultProps} />);
    expect(screen.getByText("Audit + Plan")).toBeTruthy();
  });

  it("renders scores", () => {
    const { container } = render(<BeforeAfterSplit {...defaultProps} />);
    // Both score values present (as text content within the font-mono spans)
    const monoElements = container.querySelectorAll(".font-mono");
    const textContent = Array.from(monoElements).map((el) => el.textContent);
    expect(textContent.some((t) => t?.includes("38"))).toBe(true);
    expect(textContent.some((t) => t?.includes("87"))).toBe(true);
  });

  it("applies correct severity color classes for Critical", () => {
    const { container } = render(<BeforeAfterSplit {...defaultProps} />);
    // The before card should have red-themed border
    const beforeCard = container.querySelector(".border-red-300");
    expect(beforeCard).toBeTruthy();
  });

  it("applies correct severity color classes for Needs Attention", () => {
    const props = {
      ...defaultProps,
      before: { ...defaultProps.before, severity: "Needs Attention" },
    };
    const { container } = render(<BeforeAfterSplit {...props} />);
    const beforeCard = container.querySelector(".border-orange-300");
    expect(beforeCard).toBeTruthy();
  });

  it("has green-themed after column", () => {
    const { container } = render(<BeforeAfterSplit {...defaultProps} />);
    const afterCard = container.querySelector(".border-green-300");
    expect(afterCard).toBeTruthy();
  });

  it("has mobile divider with AFTER BAYESIQ text", () => {
    render(<BeforeAfterSplit {...defaultProps} />);
    expect(screen.getByText("AFTER BAYESIQ")).toBeTruthy();
  });
});
