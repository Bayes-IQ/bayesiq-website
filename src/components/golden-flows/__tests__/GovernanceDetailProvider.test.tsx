import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import GovernanceDetailProvider, { useGovernanceDetail } from "../GovernanceDetailProvider";

// Mock the GovernanceDetailPanel to avoid dialog complexity
vi.mock("../GovernanceDetailPanel", () => ({
  default: ({ objectId, objectType, onClose }: {
    objectId: string | null;
    objectType: string;
    onClose: () => void;
  }) => (
    <div data-testid="mock-panel">
      <span data-testid="panel-objectid">{objectId ?? "null"}</span>
      <span data-testid="panel-objecttype">{objectType}</span>
      <button data-testid="panel-close" onClick={onClose}>Close</button>
    </div>
  ),
}));

function TestConsumer() {
  const { openGovernanceDetail } = useGovernanceDetail();
  return (
    <div>
      <button
        data-testid="open-finding"
        onClick={() => openGovernanceDetail("obj-123", "finding")}
      >
        Open Finding
      </button>
      <button
        data-testid="open-question"
        onClick={() => openGovernanceDetail("q-456", "question")}
      >
        Open Question
      </button>
    </div>
  );
}

describe("GovernanceDetailProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("openGovernanceDetail opens panel with correct objectId and objectType", async () => {
    render(
      <GovernanceDetailProvider data={null}>
        <TestConsumer />
      </GovernanceDetailProvider>
    );

    expect(screen.getByTestId("panel-objectid")).toHaveTextContent("null");

    await userEvent.click(screen.getByTestId("open-finding"));

    expect(screen.getByTestId("panel-objectid")).toHaveTextContent("obj-123");
    expect(screen.getByTestId("panel-objecttype")).toHaveTextContent("finding");
  });

  it("multiple opens update panel content", async () => {
    render(
      <GovernanceDetailProvider data={null}>
        <TestConsumer />
      </GovernanceDetailProvider>
    );

    await userEvent.click(screen.getByTestId("open-finding"));
    expect(screen.getByTestId("panel-objectid")).toHaveTextContent("obj-123");

    await userEvent.click(screen.getByTestId("open-question"));
    expect(screen.getByTestId("panel-objectid")).toHaveTextContent("q-456");
    expect(screen.getByTestId("panel-objecttype")).toHaveTextContent("question");
  });

  it("onClose clears active object", async () => {
    render(
      <GovernanceDetailProvider data={null}>
        <TestConsumer />
      </GovernanceDetailProvider>
    );

    await userEvent.click(screen.getByTestId("open-finding"));
    expect(screen.getByTestId("panel-objectid")).toHaveTextContent("obj-123");

    await userEvent.click(screen.getByTestId("panel-close"));
    expect(screen.getByTestId("panel-objectid")).toHaveTextContent("null");
  });
});
