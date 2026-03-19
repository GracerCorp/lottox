import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DrawHistoryRow } from "@/components/global-draws/DrawHistoryRow";

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
        digits6="123456"
        digits3First="123"
        digits3Last="456"
        digits2Last="56"
        labels={defaultLabels}
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
        digits6=""
        digits3First=""
        digits3Last=""
        digits2Last=""
        labels={defaultLabels}
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
        digits6=""
        digits3First=""
        digits3Last=""
        digits2Last=""
        labels={defaultLabels}
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
        digits6="000000"
        digits3First="000"
        digits3Last="000"
        digits2Last="00"
        labels={defaultLabels}
      />,
    );
    expect(screen.getByTestId("draw-history-row")).toBeDefined();
  });
});
