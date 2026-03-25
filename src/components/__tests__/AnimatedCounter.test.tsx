import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AnimatedCounter from "../AnimatedCounter";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  useInView: vi.fn(() => false),
  animate: vi.fn(() => ({ stop: vi.fn() })),
}));

describe("AnimatedCounter", () => {
  it("renders the start value initially when not in view", () => {
    render(<AnimatedCounter from={38} to={87} />);
    expect(screen.getByText("38")).toBeTruthy();
  });

  it("renders with suffix when provided", () => {
    render(<AnimatedCounter from={38} to={87} suffix="/100" />);
    expect(screen.getByText("38/100")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AnimatedCounter from={0} to={100} className="font-mono text-xl" />
    );
    const span = container.querySelector("span");
    expect(span?.className).toContain("font-mono");
    expect(span?.className).toContain("text-xl");
  });

  it("animates to end value when in view", async () => {
    const { useInView, animate: mockAnimate } = await import("framer-motion");
    vi.mocked(useInView).mockReturnValue(true);

    // Capture the onUpdate callback
    vi.mocked(mockAnimate).mockImplementation((_from, _to, options) => {
      if (options?.onUpdate) {
        options.onUpdate(87);
      }
      return { stop: vi.fn() } as ReturnType<typeof mockAnimate>;
    });

    render(<AnimatedCounter from={38} to={87} />);
    expect(screen.getByText("87")).toBeTruthy();
  });
});
