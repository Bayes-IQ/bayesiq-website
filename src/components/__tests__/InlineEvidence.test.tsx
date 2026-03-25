import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InlineEvidence from "../InlineEvidence";

describe("InlineEvidence", () => {
  it("renders children correctly", () => {
    render(<InlineEvidence>F-01</InlineEvidence>);
    expect(screen.getByText("F-01")).toBeTruthy();
  });

  it("applies font-mono class", () => {
    const { container } = render(
      <InlineEvidence>audit_report.md</InlineEvidence>
    );
    const code = container.querySelector("code");
    expect(code?.className).toContain("font-mono");
  });

  it("renders as a code element", () => {
    const { container } = render(
      <InlineEvidence>ASSUMPTIONS.md</InlineEvidence>
    );
    const code = container.querySelector("code");
    expect(code).toBeTruthy();
    expect(code?.textContent).toBe("ASSUMPTIONS.md");
  });

  it("applies custom className in addition to defaults", () => {
    const { container } = render(
      <InlineEvidence className="text-xl">test</InlineEvidence>
    );
    const code = container.querySelector("code");
    expect(code?.className).toContain("font-mono");
    expect(code?.className).toContain("text-xl");
  });
});
