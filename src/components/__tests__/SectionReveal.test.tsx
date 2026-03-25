import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SectionReveal from "../SectionReveal";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  useInView: vi.fn(() => true),
}));

describe("SectionReveal", () => {
  it("renders children", () => {
    render(
      <SectionReveal>
        <p>Hello World</p>
      </SectionReveal>
    );
    expect(screen.getByText("Hello World")).toBeTruthy();
  });

  it("applies custom className", () => {
    render(
      <SectionReveal className="mt-8">
        <p>Content</p>
      </SectionReveal>
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("mt-8");
  });
});
