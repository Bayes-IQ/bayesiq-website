import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SampleReportPage from "../sample-report/page";

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

describe("SampleReportPage", () => {
  it("renders all 8 artifacts", () => {
    render(<SampleReportPage />);
    const artifactFiles = [
      "audit_report.md",
      "dataset_profile.json",
      "quality_checks.json",
      "ASSUMPTIONS.md",
      "METRICS.md",
      "dbt project",
      "Streamlit dashboard",
      "canonicalization_mapping.json",
    ];
    for (const file of artifactFiles) {
      const matches = screen.getAllByText(file);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders all 6 findings", () => {
    render(<SampleReportPage />);
    for (const id of ["F-01", "F-02", "F-03", "F-04", "F-05", "F-06"]) {
      expect(screen.getByText(id)).toBeTruthy();
    }
  });

  it("renders scoring rubric table", () => {
    render(<SampleReportPage />);
    expect(screen.getByText("Strong")).toBeTruthy();
    expect(screen.getByText("Needs Work")).toBeTruthy();
    expect(screen.getByText("At Risk")).toBeTruthy();
  });

  it("renders severity definitions", () => {
    render(<SampleReportPage />);
    // Severity levels should appear in the definitions table
    const criticalElements = screen.getAllByText("Critical");
    expect(criticalElements.length).toBeGreaterThanOrEqual(2); // In findings + definitions
  });

  it("links to /consulting/case-studies (not /case-studies)", () => {
    const { container } = render(<SampleReportPage />);
    const caseStudyLinks = container.querySelectorAll(
      'a[href="/consulting/case-studies"]'
    );
    expect(caseStudyLinks.length).toBeGreaterThan(0);
  });

  it("links to /consulting/explore as tertiary CTA", () => {
    const { container } = render(<SampleReportPage />);
    const exploreLinks = container.querySelectorAll(
      'a[href="/consulting/explore"]'
    );
    expect(exploreLinks.length).toBeGreaterThan(0);
  });

  it("does not reference stale routes", () => {
    const { container } = render(<SampleReportPage />);
    const html = container.innerHTML;
    expect(html).not.toContain('href="/services"');
    expect(html).not.toContain('href="/platform"');
    // /sample-report without /consulting prefix should not be linked
    const oldLinks = container.querySelectorAll('a[href="/sample-report"]');
    expect(oldLinks.length).toBe(0);
  });

  it("uses InlineEvidence (font-mono code elements) for artifact file names", () => {
    const { container } = render(<SampleReportPage />);
    const codeElements = container.querySelectorAll("code.font-mono");
    // At minimum: 8 artifact names + 6 finding IDs + 1 in heading
    expect(codeElements.length).toBeGreaterThanOrEqual(15);
  });
});
