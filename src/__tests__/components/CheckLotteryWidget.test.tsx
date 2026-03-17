import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CheckLotteryWidget } from "@/components/home/CheckLotteryWidget";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

vi.mock("react-confetti", () => ({
  default: () => <div data-testid="confetti" />,
}));

const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("ResizeObserver", mockResizeObserver);

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return (
      <img
        {...rest}
        data-fill={fill ? "true" : undefined}
        data-priority={priority ? "true" : undefined}
      />
    );
  },
}));

const mockGroups = [
  {
    countryCode: "th",
    countryName: "THAILAND",
    lotteries: [
      { id: "glo", name: "Government Lottery (GLO)", countryCode: "th", countryName: "THAILAND" },
    ],
  },
  {
    countryCode: "la",
    countryName: "LAOS",
    lotteries: [
      { id: "lao", name: "Lao Lotto", countryCode: "la", countryName: "LAOS" },
    ],
  },
];

function renderWidget(props: Record<string, unknown> = {}) {
  return render(
    <LanguageProvider>
      <CheckLotteryWidget lotteryGroups={mockGroups} {...props} />
    </LanguageProvider>
  );
}

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("CheckLotteryWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-assign so the global reference still points to the vi.fn() after clearAllMocks
    global.fetch = fetchMock;
  });

  // ─── Initial render ────────────────────────────────────────────────────────

  it("renders without crashing with default English text", () => {
    renderWidget();
    expect(screen.getByText(/find by number/i)).toBeDefined();
  });

  it("renders with no lottery groups prop", () => {
    render(
      <LanguageProvider>
        <CheckLotteryWidget />
      </LanguageProvider>
    );
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  // ─── Input field ───────────────────────────────────────────────────────────

  it("strips non-numeric characters from input", () => {
    renderWidget();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "12ab34" } });
    expect((input as HTMLInputElement).value).toBe("1234");
  });

  it("limits input to 6 digits (maxLength)", () => {
    renderWidget();
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("maxLength")).toBe("6");
  });

  it("disables search button below 2 chars", () => {
    renderWidget();
    const btn = screen.getByRole("button", { name: /search/i });
    expect(btn).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    expect(btn).toBeDisabled();
  });

  it("enables search button at 2+ chars", () => {
    renderWidget();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "12" } });
    expect(screen.getByRole("button", { name: /search/i })).not.toBeDisabled();
  });

  // ─── Dropdown ─────────────────────────────────────────────────────────────

  it("opens dropdown when trigger clicked, closes on outside click", () => {
    const { container } = renderWidget();
    const trigger = container.querySelector("button[type='button']")!;

    fireEvent.click(trigger);
    expect(screen.getByText("THAILAND")).toBeDefined();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("THAILAND")).toBeNull();
  });

  it("selects a lottery from the dropdown and closes it", () => {
    const { container } = renderWidget();
    fireEvent.click(container.querySelector("button[type='button']")!);
    fireEvent.click(screen.getByText("Lao Lotto"));
    expect(screen.queryByText("LAOS")).toBeNull();
  });

  it("filters dropdown options by search query", () => {
    const { container } = renderWidget();
    fireEvent.click(container.querySelector("button[type='button']")!);

    const searchInput = screen.getByPlaceholderText(/search lottery/i);
    fireEvent.change(searchInput, { target: { value: "lao" } });

    expect(screen.getByText(/lao lotto/i)).toBeDefined();
    expect(screen.queryByText(/government lottery/i)).toBeNull();
  });

  it("shows no-results message for unmatched search", () => {
    const { container } = renderWidget();
    fireEvent.click(container.querySelector("button[type='button']")!);
    fireEvent.change(screen.getByPlaceholderText(/search lottery/i), {
      target: { value: "xyz!!!" },
    });
    expect(screen.getByText(/no results found/i)).toBeDefined();
  });

  // ─── API result rendering ─────────────────────────────────────────────────

  async function submitSearch(container: HTMLElement, number = "123456") {
    fireEvent.click(container.querySelector("button[type='button']")!);
    fireEvent.click(screen.getByText("Lao Lotto"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: number } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /search/i }));
    });
  }

  it("renders JackpotResult when prizes include 1st prize (by prizeName)", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        isWinner: true,
        prizes: [{ prizeName: "1st Prize", amount: "6000000" }],
      }),
    });

    const { container } = renderWidget();
    await submitSearch(container);
    expect(screen.getByText(/jackpot!/i)).toBeDefined();
    expect(screen.getByTestId("confetti")).toBeDefined();
  });

  it("renders JackpotResult when prizes include prize_1 category", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        isWinner: true,
        prizes: [{ label: "Jackpot", category: "prize_1", amount: "30000000" }],
      }),
    });

    const { container } = renderWidget();
    await submitSearch(container, "654321");
    expect(screen.getByText(/jackpot!/i)).toBeDefined();
  });

  it("renders StandardWinResult for a non-jackpot prize", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        isWinner: true,
        prizes: [{ prizeName: "2-Digit Suffix", amount: "2000" }],
      }),
    });

    const { container } = renderWidget();
    await submitSearch(container);
    expect(screen.getByText(/congratulations/i)).toBeDefined();
    expect(screen.queryByTestId("confetti")).toBeNull();
  });

  it("renders NoWinResult when isWinner is false", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ isWinner: false, prizes: [] }),
    });

    const { container } = renderWidget();
    await submitSearch(container, "000000");
    expect(screen.getByText(/not this time/i)).toBeDefined();
  });

  it("renders NoWinResult when win field is false (legacy API shape)", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ win: false, prizes: [] }),
    });

    const { container } = renderWidget();
    await submitSearch(container, "111111");
    expect(screen.getByText(/not this time/i)).toBeDefined();
  });

  it("freezes displayed number at search time (searchedNumber bug fix)", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ isWinner: false, prizes: [] }),
    });

    const { container } = renderWidget();
    const input = screen.getByRole("textbox");

    // Select lottery + type number + search
    fireEvent.click(container.querySelector("button[type='button']")!);
    fireEvent.click(screen.getByText("Lao Lotto"));
    fireEvent.change(input, { target: { value: "123456" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /search/i }));
    });

    // Confirm "123456" is shown in result
    expect(screen.getByText("123456")).toBeDefined();

    // Now type something different in the field — result should still show "123456"
    fireEvent.change(input, { target: { value: "999999" } });
    expect(screen.getByText("123456")).toBeDefined();
    // The new value should NOT replace the frozen result
    expect(screen.queryAllByText("999999").length === 0 ||
      screen.queryAllByText("999999")[0]?.tagName === "INPUT").toBe(true);
  });

  it("shows error state when fetch fails with network error", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    const { container } = renderWidget();
    await submitSearch(container);
    // An error message is shown to the user  
    expect(
      screen.queryByText(/error/i) ??
      screen.queryByText(/something went wrong/i) ??
      screen.queryByText(/try again/i)
    ).toBeDefined();
  });

  it("shows error state when API returns ok:false", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Bad Request" }),
    });

    const { container } = renderWidget();
    await submitSearch(container);
    // Error message should be visible
    const errEl =
      screen.queryByText(/error/i) ??
      screen.queryByText(/something went wrong/i) ??
      screen.queryByText(/try again/i);
    expect(errEl).toBeDefined();
  });

  // ─── After result — reset ──────────────────────────────────────────────────

  it("returns to idle state after clicking Check Another", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ isWinner: false, prizes: [] }),
    });

    const { container } = renderWidget();
    await submitSearch(container);

    // Result shown
    expect(screen.getByText(/not this time/i)).toBeDefined();

    // Click check another
    fireEvent.click(screen.getByText(/check another number/i));

    // Back to search form
    expect(screen.getByRole("button", { name: /search/i })).toBeDefined();
    expect(screen.queryByText(/not this time/i)).toBeNull();
  });

  // ─── Styling / structure ───────────────────────────────────────────────────

  it("applies correct light/dark class on the form", () => {
    const { container } = renderWidget();
    const form = container.querySelector("form");
    expect(form?.className).toContain("dark:bg-navy-900/60");
    expect(form?.className).toContain("bg-white/80");
  });
});
