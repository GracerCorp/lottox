import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DrawHistoryRow } from "@/components/global-results/DrawHistoryRow";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultLabels = {
  digits6: "6-Digit",
  digits3First: "Front 3",
  digits3Last: "Back 3",
  digits2Last: "Last 2",
};

describe("DrawHistoryRow", () => {
  it("renders all four prize columns", () => {
    render(
      <DrawHistoryRow
        drawTime="09:00"
        drawDate="01 Jan 25"
        results={[
          { label: "6-Digit", value: "123456", main: true },
          { label: "Front 3", value: "123" },
          { label: "Back 3", value: "456" },
          { label: "Last 2", value: "56" }
        ]}
      />,
    );
    expect(screen.getByText("6-Digit")).toBeDefined();
    expect(screen.getByText("123456")).toBeDefined();
    expect(screen.getByText("123")).toBeDefined();
    expect(screen.getByText("456")).toBeDefined();
    expect(screen.getByText("56")).toBeDefined();
  });

  it("renders draw time and date", () => {
    render(
      <DrawHistoryRow
        drawTime="09:00"
        drawDate="01 Jan 25"
        results={[]}
      />,
    );
    expect(screen.getByText(/09:00/)).toBeDefined();
    expect(screen.getByText(/01 Jan 25/)).toBeDefined();
  });

  it("renders dash when digit is missing", () => {
    render(
      <DrawHistoryRow
        drawTime="09:00"
        drawDate="01 Jan 25"
        results={[
          { label: "6-Digit", value: "" }
        ]}
      />,
    );
    const dashes = screen.getAllByText("–");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("has data-testid", () => {
    render(
      <DrawHistoryRow
        drawTime=""
        drawDate="01 Jan 25"
        results={[
          { label: "6-Digit", value: "000000" }
        ]}
      />,
    );
    expect(screen.getByTestId("draw-history-row")).toBeDefined();
  });
});
