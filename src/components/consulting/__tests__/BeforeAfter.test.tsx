import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import BeforeAfter from "../BeforeAfter";

describe("BeforeAfter", () => {
  it("renders before and after values with labels", () => {
    render(
      <BeforeAfter
        beforeLabel="Reported"
        beforeValue="$1.2M"
        afterLabel="Actual"
        afterValue="$960K"
      />
    );
    expect(screen.getByText("Reported")).toBeInTheDocument();
    expect(screen.getByText("$1.2M")).toBeInTheDocument();
    expect(screen.getByText("Actual")).toBeInTheDocument();
    expect(screen.getByText("$960K")).toBeInTheDocument();
  });

  it("renders annotation when provided", () => {
    render(
      <BeforeAfter
        beforeLabel="Before"
        beforeValue="100"
        afterLabel="After"
        afterValue="50"
        annotation="50% reduction found."
      />
    );
    expect(screen.getByText("50% reduction found.")).toBeInTheDocument();
  });

  it("does not render annotation when not provided", () => {
    const { container } = render(
      <BeforeAfter
        beforeLabel="Before"
        beforeValue="100"
        afterLabel="After"
        afterValue="50"
      />
    );
    // Only the grid and its children, no annotation paragraph
    const paragraphs = container.querySelectorAll("p");
    // 4 paragraphs: before label, before value, after label, after value
    expect(paragraphs).toHaveLength(4);
  });
});
