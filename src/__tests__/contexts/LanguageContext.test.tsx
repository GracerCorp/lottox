import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

// Test component that uses the context
function LanguageConsumer() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="hero-title">{t.hero.title}</span>
      <span data-testid="hero-subtitle">{t.hero.subtitle}</span>
      <button onClick={() => setLanguage("th")}>Switch to Thai</button>
      <button onClick={() => setLanguage("en")}>Switch to English</button>
    </div>
  );
}

describe("LanguageContext", () => {
  it("defaults to English language", () => {
    render(
      <LanguageProvider>
        <LanguageConsumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId("language").textContent).toBe("en");
  });

  it("provides English translations by default", () => {
    render(
      <LanguageProvider>
        <LanguageConsumer />
      </LanguageProvider>
    );
    // English hero title
    const title = screen.getByTestId("hero-title").textContent;
    expect(title?.toLowerCase()).toContain("worldwide");
  });

  it("switches to Thai when setLanguage('th') is called", async () => {
    render(
      <LanguageProvider>
        <LanguageConsumer />
      </LanguageProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Switch to Thai"));
    });

    // Wait for async dictionary load
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByTestId("language").textContent).toBe("th");
  });

  it("switches back to English", async () => {
    render(
      <LanguageProvider>
        <LanguageConsumer />
      </LanguageProvider>
    );

    // Switch to Thai first
    await act(async () => {
      fireEvent.click(screen.getByText("Switch to Thai"));
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    // Switch back to English
    await act(async () => {
      fireEvent.click(screen.getByText("Switch to English"));
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.getByTestId("language").textContent).toBe("en");
  });

  it("persists language to localStorage", async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <LanguageProvider>
        <LanguageConsumer />
      </LanguageProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Switch to Thai"));
    });

    expect(setItemSpy).toHaveBeenCalledWith("language", "th");
    setItemSpy.mockRestore();
  });

  it("reads language from localStorage on mount", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("th");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});

    render(
      <LanguageProvider>
        <LanguageConsumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId("language").textContent).toBe("th");
    vi.restoreAllMocks();
  });
});
