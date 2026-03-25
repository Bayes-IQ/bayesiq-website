import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock framer-motion to avoid animation complexities in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...rest
    }: {
      children: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => {
      // Filter out framer-motion-specific props
      const htmlProps: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(rest)) {
        if (
          ![
            "initial",
            "animate",
            "transition",
            "whileInView",
            "viewport",
          ].includes(key)
        ) {
          htmlProps[key] = value;
        }
      }
      return (
        <div className={className} {...htmlProps}>
          {children}
        </div>
      );
    },
  },
  useInView: () => true,
  useMotionValue: (initial: number) => ({
    get: () => initial,
    set: () => {},
    on: () => () => {},
  }),
  useTransform: (_mv: unknown, fn: (v: number) => number) => ({
    get: () => fn(0),
    set: () => {},
    on: () => () => {},
  }),
  useMotionValueEvent: () => {
    // No-op in tests -- StatCounter renders with initial useState(0)
  },
  animate: () => ({ stop: () => {} }),
}));

describe("SectionReveal", () => {
  it("renders children", async () => {
    const { default: SectionReveal } = await import(
      "@/components/SectionReveal"
    );
    render(
      <SectionReveal>
        <p>Hello world</p>
      </SectionReveal>
    );
    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  it("applies custom className", async () => {
    const { default: SectionReveal } = await import(
      "@/components/SectionReveal"
    );
    const { container } = render(
      <SectionReveal className="my-custom-class">
        <p>Content</p>
      </SectionReveal>
    );
    expect(container.firstElementChild?.className).toContain("my-custom-class");
  });
});

describe("StatCounter", () => {
  it("renders with monospace font and tabular-nums classes", async () => {
    const { default: StatCounter } = await import("@/components/StatCounter");
    const { container } = render(
      <StatCounter value={42} prefix="$" suffix="K" />
    );
    const span = container.querySelector(".font-mono");
    expect(span).toBeTruthy();
    expect(span?.className).toContain("tabular-nums");
    // Prefix and suffix are rendered as text content alongside the number
    expect(span?.textContent).toContain("$");
    expect(span?.textContent).toContain("K");
  });

  it("renders a span element with min-width for layout stability", async () => {
    const { default: StatCounter } = await import("@/components/StatCounter");
    const { container } = render(<StatCounter value={100} suffix="+" />);
    const span = container.querySelector(".font-mono");
    expect(span).toBeTruthy();
    // Should have inline style for min-width
    expect(span?.getAttribute("style")).toContain("min-width");
  });
});

describe("GovernanceChain", () => {
  it("renders correct number of nodes from default props", async () => {
    const { default: GovernanceChain } = await import(
      "@/components/GovernanceChain"
    );
    render(<GovernanceChain />);
    const chain = screen.getByTestId("governance-chain");
    expect(chain).toBeTruthy();
    // Desktop SVG should have aria-label mentioning all three nodes
    const svg = chain.querySelector('svg[role="img"]');
    expect(svg?.getAttribute("aria-label")).toContain("Raw Data");
    expect(svg?.getAttribute("aria-label")).toContain("Reviewed");
    expect(svg?.getAttribute("aria-label")).toContain("Approved");
  });

  it("renders custom nodes", async () => {
    const { default: GovernanceChain } = await import(
      "@/components/GovernanceChain"
    );
    render(
      <GovernanceChain
        nodes={[{ label: "Step A" }, { label: "Step B" }]}
      />
    );
    const chain = screen.getByTestId("governance-chain");
    const svg = chain.querySelector('svg[role="img"]');
    expect(svg?.getAttribute("aria-label")).toContain("Step A");
    expect(svg?.getAttribute("aria-label")).toContain("Step B");
  });

  it("renders 3 circle elements per SVG for default nodes", async () => {
    const { default: GovernanceChain } = await import(
      "@/components/GovernanceChain"
    );
    const { container } = render(<GovernanceChain />);
    // Each SVG (desktop and mobile) should have 3 circles
    const svgs = container.querySelectorAll("svg");
    for (const svg of svgs) {
      const circles = svg.querySelectorAll("circle");
      expect(circles.length).toBe(3);
    }
  });
});

describe("PathCard", () => {
  it("renders headline, description, audience, and link", async () => {
    const { default: PathCard } = await import("@/components/PathCard");
    render(
      <PathCard
        headline="Fix Your Metrics"
        description="We fix broken analytics."
        audience="For data leads"
        href="/consulting"
        cta="Learn More"
      />
    );
    expect(screen.getByText("Fix Your Metrics")).toBeTruthy();
    expect(screen.getByText("We fix broken analytics.")).toBeTruthy();
    expect(screen.getByText("For data leads")).toBeTruthy();
    const link = screen.getByText("Learn More");
    expect(link.closest("a")?.getAttribute("href")).toBe("/consulting");
  });

  it("links to /consulting or /platform only", async () => {
    const { default: PathCard } = await import("@/components/PathCard");
    const { rerender } = render(
      <PathCard
        headline="Test"
        description="Test"
        audience="Test"
        href="/consulting"
        cta="Go"
      />
    );
    expect(screen.getByText("Go").closest("a")?.getAttribute("href")).toBe(
      "/consulting"
    );

    rerender(
      <PathCard
        headline="Test"
        description="Test"
        audience="Test"
        href="/platform"
        cta="Go"
      />
    );
    expect(screen.getByText("Go").closest("a")?.getAttribute("href")).toBe(
      "/platform"
    );
  });
});

describe("ProofStrip", () => {
  it("renders at least 3 stat items", async () => {
    const { default: ProofStrip } = await import("@/components/ProofStrip");
    render(<ProofStrip />);
    const strip = screen.getByTestId("proof-strip");
    expect(strip).toBeTruthy();
    const statItems = screen.getAllByTestId("stat-item");
    expect(statItems.length).toBeGreaterThanOrEqual(3);
  });
});

describe("flags", () => {
  it("exports SHOW_SOCIAL_PROOF as false", async () => {
    const { SHOW_SOCIAL_PROOF } = await import("@/lib/flags");
    expect(SHOW_SOCIAL_PROOF).toBe(false);
  });
});
