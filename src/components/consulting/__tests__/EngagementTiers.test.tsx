import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import EngagementTiers from "../EngagementTiers";

describe("EngagementTiers", () => {
  it("renders 3 tier cards", () => {
    render(<EngagementTiers />);
    expect(screen.getByText("Diagnostic Sprint")).toBeInTheDocument();
    expect(screen.getByText("Full Engagement")).toBeInTheDocument();
    expect(screen.getByText("Continuous Monitoring")).toBeInTheDocument();
  });

  it("renders timelines", () => {
    render(<EngagementTiers />);
    expect(screen.getByText("1 week")).toBeInTheDocument();
    expect(screen.getByText("4-6 weeks")).toBeInTheDocument();
    expect(screen.getByText("Ongoing")).toBeInTheDocument();
  });

  it("contains NO dollar amounts anywhere in the output", () => {
    const { container } = render(<EngagementTiers />);
    const text = container.textContent || "";
    expect(text).not.toMatch(/\$\d/);
    expect(text).not.toMatch(/K per/i);
    expect(text).not.toMatch(/\/month/i);
  });

  it("highlights the Full Engagement tier", () => {
    render(<EngagementTiers />);
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });
});
