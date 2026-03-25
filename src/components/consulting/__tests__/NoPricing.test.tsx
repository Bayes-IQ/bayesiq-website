import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import EngagementTiers from "../EngagementTiers";
import FAQAccordion from "../FAQAccordion";

describe("No-pricing assertion", () => {
  it("EngagementTiers contains no dollar amounts", () => {
    const { container } = render(<EngagementTiers />);
    const text = container.textContent || "";
    expect(text).not.toMatch(/\$\d/);
  });

  it("FAQAccordion contains no dollar amounts in questions", () => {
    const { container } = render(<FAQAccordion />);
    // Get all button text (the questions)
    const buttons = container.querySelectorAll("button");
    for (const button of buttons) {
      expect(button.textContent).not.toMatch(/\$\d/);
    }
  });

  it("EngagementTiers contains no price-like patterns", () => {
    const { container } = render(<EngagementTiers />);
    const text = container.textContent || "";
    expect(text).not.toMatch(/K per/i);
    expect(text).not.toMatch(/\/month/i);
    expect(text).not.toMatch(/\$[\d,]+/);
  });
});
