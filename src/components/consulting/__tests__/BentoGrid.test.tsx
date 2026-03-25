import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import BentoGrid from "../BentoGrid";
import BentoCard from "../BentoCard";

describe("BentoGrid + BentoCard", () => {
  it("renders the correct number of cards", () => {
    render(
      <BentoGrid>
        <BentoCard title="Card A" description="Desc A" />
        <BentoCard title="Card B" description="Desc B" />
        <BentoCard title="Card C" description="Desc C" span={2} />
      </BentoGrid>
    );
    expect(screen.getByText("Card A")).toBeInTheDocument();
    expect(screen.getByText("Card B")).toBeInTheDocument();
    expect(screen.getByText("Card C")).toBeInTheDocument();
  });

  it("applies span-2 CSS class for large cards", () => {
    const { container } = render(
      <BentoGrid>
        <BentoCard title="Small" description="desc" span={1} />
        <BentoCard title="Large" description="desc" span={2} />
      </BentoGrid>
    );
    const largeCard = screen.getByText("Large").closest("div");
    expect(largeCard?.className).toContain("sm:col-span-2");

    const smallCard = screen.getByText("Small").closest("div");
    expect(smallCard?.className).not.toContain("sm:col-span-2");
  });
});
