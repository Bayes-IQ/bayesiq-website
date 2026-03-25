import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PipelineSteps from "../PipelineSteps";

describe("PipelineSteps", () => {
  it("renders all 6 default steps", () => {
    render(<PipelineSteps />);
    const labels = ["Ingest", "Profile", "Check", "Validate", "Score", "Generate"];
    for (const label of labels) {
      expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders step numbers 01-06", () => {
    render(<PipelineSteps />);
    for (const num of ["01", "02", "03", "04", "05", "06"]) {
      expect(screen.getByText(num)).toBeInTheDocument();
    }
  });

  it("accepts custom steps", () => {
    render(
      <PipelineSteps
        steps={[
          { number: "01", label: "CustomStep", description: "A custom step" },
        ]}
      />
    );
    expect(screen.getAllByText("CustomStep").length).toBeGreaterThanOrEqual(1);
  });
});
