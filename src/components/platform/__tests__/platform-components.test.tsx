import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PlatformSection from "../PlatformSection";
import ThreeTruthLayers from "../ThreeTruthLayers";
import GovernanceChainExpanded from "../GovernanceChainExpanded";

// Mock IntersectionObserver for framer-motion whileInView
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(
      private callback: IntersectionObserverCallback,
      _options?: IntersectionObserverInit
    ) {
      // Immediately invoke with all entries as intersecting
      setTimeout(() => {
        this.callback(
          [{ isIntersecting: true, intersectionRatio: 1 }] as IntersectionObserverEntry[],
          this as unknown as IntersectionObserver
        );
      }, 0);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
});
import PlatformCTA from "../PlatformCTA";

describe("PlatformSection", () => {
  it("renders children", () => {
    render(
      <PlatformSection>
        <p>Test content</p>
      </PlatformSection>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <PlatformSection className="bg-bayesiq-900">
        <p>Content</p>
      </PlatformSection>
    );
    const section = container.querySelector("section");
    expect(section?.className).toContain("bg-bayesiq-900");
  });

  it("applies id when provided", () => {
    const { container } = render(
      <PlatformSection id="test-section">
        <p>Content</p>
      </PlatformSection>
    );
    expect(container.querySelector("#test-section")).toBeInTheDocument();
  });
});

describe("ThreeTruthLayers", () => {
  it("renders all three layers", () => {
    render(<ThreeTruthLayers />);
    expect(screen.getByText("Raw Truth")).toBeInTheDocument();
    expect(screen.getByText("Derived Interpretation")).toBeInTheDocument();
    expect(screen.getByText("Governed State")).toBeInTheDocument();
  });

  it("renders layer labels", () => {
    render(<ThreeTruthLayers />);
    expect(screen.getByText("Layer 1")).toBeInTheDocument();
    expect(screen.getByText("Layer 2")).toBeInTheDocument();
    expect(screen.getByText("Layer 3")).toBeInTheDocument();
  });

  it("renders subtitles", () => {
    render(<ThreeTruthLayers />);
    expect(screen.getByText("Immutable evidence")).toBeInTheDocument();
    expect(screen.getByText("Structured output")).toBeInTheDocument();
    expect(screen.getByText("Human-accepted truth")).toBeInTheDocument();
  });
});

describe("GovernanceChainExpanded", () => {
  it("renders chain steps", () => {
    render(<GovernanceChainExpanded />);
    expect(screen.getByText("Contract")).toBeInTheDocument();
    expect(screen.getByText("Execute")).toBeInTheDocument();
    expect(screen.getByText("Evidence")).toBeInTheDocument();
    expect(screen.getByText("Govern")).toBeInTheDocument();
  });

  it("renders execution paths", () => {
    render(<GovernanceChainExpanded />);
    expect(screen.getByText("Your AI pipeline")).toBeInTheDocument();
    expect(screen.getByText("A human operator")).toBeInTheDocument();
    expect(screen.getByText("A CI job or contractor")).toBeInTheDocument();
  });
});

describe("PlatformCTA", () => {
  it("renders both CTA links", () => {
    render(<PlatformCTA />);
    const seeItLink = screen.getByRole("link", { name: "See it in action" });
    const talkLink = screen.getByRole("link", {
      name: "Talk to us about the platform",
    });
    expect(seeItLink).toHaveAttribute("href", "/consulting/explore");
    expect(talkLink).toHaveAttribute("href", "/contact");
  });
});
