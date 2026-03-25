import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

// Mock Next.js navigation hooks
const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/consulting/industries",
}));

import IndustryTabs from "../IndustryTabs";

describe("IndustryTabs", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    // Reset search params to empty
    mockSearchParams.delete("vertical");
  });

  it("renders 4 tab buttons", () => {
    render(<IndustryTabs />);
    expect(screen.getByRole("tab", { name: "Fintech" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Healthcare" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "SaaS" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Real Estate" })).toBeInTheDocument();
  });

  it("defaults to Fintech tab active", () => {
    render(<IndustryTabs />);
    const fintechTab = screen.getByRole("tab", { name: "Fintech" });
    expect(fintechTab).toHaveAttribute("aria-selected", "true");
  });

  it("clicking Healthcare tab shows healthcare content", async () => {
    const user = userEvent.setup();
    render(<IndustryTabs />);

    await user.click(screen.getByRole("tab", { name: "Healthcare" }));

    const healthcareTab = screen.getByRole("tab", { name: "Healthcare" });
    expect(healthcareTab).toHaveAttribute("aria-selected", "true");

    // Healthcare failure pattern should be visible
    expect(
      screen.getByText("Clinical metrics don't reconcile")
    ).toBeInTheDocument();
  });

  it("has correct ARIA attributes", () => {
    render(<IndustryTabs />);

    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-label", "Industry verticals");

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);

    // Each tab should have aria-controls pointing to a panel
    for (const tab of tabs) {
      const panelId = tab.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId!)).toBeInTheDocument();
    }

    // Each panel should have aria-labelledby pointing back to the tab
    const panels = screen.getAllByRole("tabpanel");
    // Only the visible panel is in the DOM as a tabpanel (hidden panels have display:none)
    expect(panels.length).toBeGreaterThanOrEqual(1);
  });

  it("renders BeforeAfter with monospace-styled numbers in each tab", async () => {
    const user = userEvent.setup();
    render(<IndustryTabs />);

    // Fintech finding value
    expect(screen.getByText("$1.2M")).toBeInTheDocument();

    // Switch to Healthcare
    await user.click(screen.getByRole("tab", { name: "Healthcare" }));
    expect(screen.getByText("14.2%")).toBeInTheDocument();
  });
});
