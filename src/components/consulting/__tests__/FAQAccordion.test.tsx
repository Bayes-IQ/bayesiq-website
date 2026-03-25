import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import FAQAccordion from "../FAQAccordion";

describe("FAQAccordion", () => {
  it("renders all 6 default questions", () => {
    render(<FAQAccordion />);
    expect(
      screen.getByText("Can't our team do this ourselves?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("What data access do you need?")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "How is this different from Monte Carlo or Great Expectations?"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("We already use dbt tests.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Our numbers look fine.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("How long does it take?")
    ).toBeInTheDocument();
  });

  it("clicking a question expands its answer", async () => {
    const user = userEvent.setup();
    render(<FAQAccordion />);

    const button = screen.getByText("How long does it take?");
    await user.click(button);

    expect(button.closest("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking another question collapses the first", async () => {
    const user = userEvent.setup();
    render(<FAQAccordion />);

    const first = screen.getByText("Can't our team do this ourselves?");
    const second = screen.getByText("What data access do you need?");

    await user.click(first);
    expect(first.closest("button")).toHaveAttribute("aria-expanded", "true");

    await user.click(second);
    expect(first.closest("button")).toHaveAttribute("aria-expanded", "false");
    expect(second.closest("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("accepts custom items", () => {
    render(
      <FAQAccordion
        items={[{ question: "Custom Q?", answer: "Custom A." }]}
      />
    );
    expect(screen.getByText("Custom Q?")).toBeInTheDocument();
  });
});
