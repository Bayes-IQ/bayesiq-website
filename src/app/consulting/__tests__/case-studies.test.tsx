import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CaseStudiesPage from "../case-studies/page";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <div className={className}>{children}</div>,
  },
  useInView: vi.fn(() => true),
  animate: vi.fn((_from, _to, options) => {
    if (options?.onUpdate) options.onUpdate(_to);
    return { stop: vi.fn() };
  }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("CaseStudiesPage", () => {
  it("renders all 3 visible case study slugs", () => {
    const { container } = render(<CaseStudiesPage />);
    expect(container.querySelector("#saas")).toBeTruthy();
    expect(container.querySelector("#fintech")).toBeTruthy();
    expect(container.querySelector("#healthcare")).toBeTruthy();
  });

  it("does not render the hidden Shuk placeholder", () => {
    const { container } = render(<CaseStudiesPage />);
    expect(container.querySelector("#shuk")).toBeNull();
    expect(screen.queryByText("Real Estate")).toBeNull();
  });

  it("renders industry headings for all 3 studies", () => {
    render(<CaseStudiesPage />);
    expect(
      screen.getByText("SaaS — Product Analytics")
    ).toBeTruthy();
    expect(
      screen.getByText("Fintech — Transaction Pipeline")
    ).toBeTruthy();
    expect(
      screen.getByText("Healthcare — Clinical Analytics")
    ).toBeTruthy();
  });

  it("links to /consulting/sample-report (not /sample-report)", () => {
    const { container } = render(<CaseStudiesPage />);
    const sampleReportLinks = container.querySelectorAll(
      'a[href="/consulting/sample-report"]'
    );
    expect(sampleReportLinks.length).toBeGreaterThan(0);
    // Should NOT link to old route
    const oldLinks = container.querySelectorAll('a[href="/sample-report"]');
    expect(oldLinks.length).toBe(0);
  });

  it("links to /consulting/explore as tertiary CTA", () => {
    const { container } = render(<CaseStudiesPage />);
    const exploreLinks = container.querySelectorAll(
      'a[href="/consulting/explore"]'
    );
    expect(exploreLinks.length).toBeGreaterThan(0);
  });

  it("does not reference stale routes", () => {
    const { container } = render(<CaseStudiesPage />);
    const html = container.innerHTML;
    expect(html).not.toContain('href="/services"');
    expect(html).not.toContain('href="/case-studies"');
  });
});
