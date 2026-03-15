import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CheckLotteryWidget } from "@/components/home/CheckLotteryWidget";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() }))
}));

describe("CheckLotteryWidget", () => {
  it("should render without crashing", () => {
    // Need to wrap in LanguageProvider because the component uses useLanguage
    render(
      <LanguageProvider>
        <CheckLotteryWidget />
      </LanguageProvider>
    );
    expect(screen.getAllByText(/ตรวจสลาก/i).length).toBeGreaterThan(0); 
  });
  
  it("should update input value and form state when typing", () => {
    render(
      <LanguageProvider>
        <CheckLotteryWidget />
      </LanguageProvider>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123456" } });
    
    expect((input as HTMLInputElement).value).toBe("123456");
  });
});
