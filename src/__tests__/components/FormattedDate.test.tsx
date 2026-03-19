import React from "react";
import { render, screen } from "@testing-library/react";
import { FormattedDate } from "@/components/ui/FormattedDate";

describe("FormattedDate", () => {
  it("renders a <time> element with datetime attribute", () => {
    render(<FormattedDate date="2025-03-16" />);
    const time = screen.getByTestId("formatted-date");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("datetime", "2025-03-16");
  });

  it("displays ISO format by default", () => {
    render(<FormattedDate date="2025-03-16" />);
    expect(screen.getByText("2025-03-16")).toBeInTheDocument();
  });

  it("displays long format when specified", () => {
    render(<FormattedDate date="2025-03-16" format="long" />);
    const time = screen.getByTestId("formatted-date");
    expect(time.textContent).toContain("March");
    expect(time.textContent).toContain("16");
    expect(time.textContent).toContain("2025");
  });

  it("preserves datetime attribute in long format", () => {
    render(<FormattedDate date="2025-03-16" format="long" />);
    const time = screen.getByTestId("formatted-date");
    expect(time).toHaveAttribute("datetime", "2025-03-16");
  });

  it("accepts additional className", () => {
    render(<FormattedDate date="2025-01-01" className="text-sm text-gray-500" />);
    const time = screen.getByTestId("formatted-date");
    expect(time.className).toContain("text-sm");
  });
});
