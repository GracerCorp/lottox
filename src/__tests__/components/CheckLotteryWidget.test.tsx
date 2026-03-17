import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CheckLotteryWidget } from "@/components/home/CheckLotteryWidget";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return <img {...rest} data-fill={fill ? "true" : undefined} data-priority={priority ? "true" : undefined} />;
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

function renderWidget(props = {}) {
  return render(
    <LanguageProvider>
      <CheckLotteryWidget lotteryGroups={mockGroups} {...props} />
    </LanguageProvider>
  );
}

describe("CheckLotteryWidget", () => {
  it("renders without crashing with default English text", () => {
    renderWidget();
    // Default language is now English — "Find By Number" is the heading
    expect(screen.getByText(/find by number/i)).toBeDefined();
  });

  it("renders with no lottery groups", () => {
    render(
      <LanguageProvider>
        <CheckLotteryWidget />
      </LanguageProvider>
    );
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("updates input value and strips non-numeric characters", () => {
    renderWidget();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "12ab34" } });
    expect((input as HTMLInputElement).value).toBe("1234");
  });

  it("limits input to 6 digits", () => {
    renderWidget();
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("maxLength")).toBe("6");
  });

  it("disables search button when input has fewer than 2 digits", () => {
    renderWidget();
    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeDisabled();

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1" } });
    expect(button).toBeDisabled();
  });

  it("enables search button when input has 2 or more digits", () => {
    renderWidget();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "12" } });

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).not.toBeDisabled();
  });

  it("opens dropdown when trigger is clicked", () => {
    const { container } = renderWidget();
    // The dropdown trigger is the first type="button" button in the form
    const dropdownTrigger = container.querySelector("button[type='button']");
    expect(dropdownTrigger).toBeDefined();

    fireEvent.click(dropdownTrigger!);
    // Dropdown should show country group headers
    expect(screen.getByText("THAILAND")).toBeDefined();
    expect(screen.getByText("LAOS")).toBeDefined();
  });

  it("selects a lottery from the dropdown", () => {
    const { container } = renderWidget();
    // Open dropdown
    const dropdownTrigger = container.querySelector("button[type='button']");
    fireEvent.click(dropdownTrigger!);

    // Click on Lao Lotto
    fireEvent.click(screen.getByText("Lao Lotto"));
    // Dropdown should close
    expect(screen.queryByText("LAOS")).toBeNull();
  });

  it("closes dropdown when clicking outside", () => {
    const { container } = renderWidget();
    // Open dropdown
    const dropdownTrigger = container.querySelector("button[type='button']");
    fireEvent.click(dropdownTrigger!);
    expect(screen.getByText("THAILAND")).toBeDefined();

    // Click outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("THAILAND")).toBeNull();
  });

  it("has correct light/dark theme classes on the form", () => {
    const { container } = renderWidget();
    const form = container.querySelector("form");
    expect(form?.className).toContain("dark:bg-navy-900/60");
    expect(form?.className).toContain("bg-white/80");
  });
});
