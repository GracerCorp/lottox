import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardPagination } from "@/components/global-draws/BoardPagination";

describe("BoardPagination", () => {
  it("renders page indicator", () => {
    render(<BoardPagination page={2} totalPages={5} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByTestId("pagination-info").textContent).toBe("2 / 5");
  });

  it("calls onPrev when Prev button is clicked", async () => {
    const onPrev = vi.fn();
    render(<BoardPagination page={2} totalPages={5} onPrev={onPrev} onNext={vi.fn()} />);
    await userEvent.click(screen.getByTestId("pagination-prev"));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it("calls onNext when Next button is clicked", async () => {
    const onNext = vi.fn();
    render(<BoardPagination page={2} totalPages={5} onPrev={vi.fn()} onNext={onNext} />);
    await userEvent.click(screen.getByTestId("pagination-next"));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("disables Prev button on first page", () => {
    render(<BoardPagination page={1} totalPages={5} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByTestId("pagination-prev").hasAttribute("disabled")).toBe(true);
  });

  it("disables Next button on last page", () => {
    render(<BoardPagination page={5} totalPages={5} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByTestId("pagination-next").hasAttribute("disabled")).toBe(true);
  });

  it("has data-testid", () => {
    render(<BoardPagination page={1} totalPages={1} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByTestId("board-pagination")).toBeDefined();
  });
});
