import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { SubscribeButton } from "@/components/ui/SubscribeButton";

// Mock useLanguage
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      subscribe: {
        button: "Subscribe for Results",
        title: "Get Lottery Alerts",
        placeholder: "Enter your email",
        success: "Subscribed! We will send results to your email.",
        error: "Something went wrong. Please try again.",
        errorTitle: "Subscription Failed",
        sending: "Sending...",
        done: "Done",
        retry: "Try Again",
        close: "Close",
      },
    },
  }),
}));

describe("SubscribeButton", () => {
  const defaultProps = {
    lotteryId: 42,
    lotteryName: "Mega Millions",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the trigger button", () => {
    render(<SubscribeButton {...defaultProps} />);
    expect(screen.getByTestId("subscribe-trigger")).toBeInTheDocument();
    expect(screen.getByText("Subscribe for Results")).toBeInTheDocument();
  });

  it("opens the dialog when trigger is clicked", () => {
    render(<SubscribeButton {...defaultProps} />);
    expect(screen.queryByTestId("subscribe-dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("subscribe-trigger"));
    expect(screen.getByTestId("subscribe-dialog")).toBeInTheDocument();
    expect(screen.getByText("Get Lottery Alerts")).toBeInTheDocument();
    expect(screen.getByText("Mega Millions")).toBeInTheDocument();
  });

  it("closes the dialog when close button is clicked", () => {
    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));
    expect(screen.getByTestId("subscribe-dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("subscribe-close"));
    expect(screen.queryByTestId("subscribe-dialog")).not.toBeInTheDocument();
  });

  it("closes the dialog on Escape key", () => {
    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));
    expect(screen.getByTestId("subscribe-dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByTestId("subscribe-dialog")).not.toBeInTheDocument();
  });

  it("closes the dialog when clicking backdrop", () => {
    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));
    const dialog = screen.getByTestId("subscribe-dialog");
    fireEvent.click(dialog);
    expect(screen.queryByTestId("subscribe-dialog")).not.toBeInTheDocument();
  });

  it("shows loading state while submitting", async () => {
    let resolvePromise: (value: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });
    vi.spyOn(global, "fetch").mockReturnValue(fetchPromise);

    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));

    const emailInput = screen.getByTestId("subscribe-email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByTestId("subscribe-submit"));

    expect(screen.getByTestId("subscribe-loading")).toBeInTheDocument();
    expect(screen.getByText("Sending...")).toBeInTheDocument();

    await act(async () => {
      resolvePromise!(new Response(null, { status: 200 }));
    });
  });

  it("shows success state after successful subscription", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));

    const emailInput = screen.getByTestId("subscribe-email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByTestId("subscribe-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("subscribe-success")).toBeInTheDocument();
    });

    expect(screen.getByText("Subscribed! We will send results to your email.")).toBeInTheDocument();
    expect(screen.getByTestId("subscribe-done")).toBeInTheDocument();
  });

  it("closes dialog from success state", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));

    fireEvent.change(screen.getByTestId("subscribe-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("subscribe-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("subscribe-done")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("subscribe-done"));
    expect(screen.queryByTestId("subscribe-dialog")).not.toBeInTheDocument();
  });

  it("shows error state on API failure (non-200)", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));

    fireEvent.change(screen.getByTestId("subscribe-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("subscribe-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("subscribe-error")).toBeInTheDocument();
    });

    expect(screen.getByText("Subscription Failed")).toBeInTheDocument();
    expect(screen.getByTestId("subscribe-retry")).toBeInTheDocument();
  });

  it("shows error state on network failure", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));

    fireEvent.change(screen.getByTestId("subscribe-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("subscribe-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("subscribe-error")).toBeInTheDocument();
    });
  });

  it("returns to form from error state on retry", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));

    fireEvent.change(screen.getByTestId("subscribe-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("subscribe-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("subscribe-retry")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("subscribe-retry"));
    expect(screen.getByTestId("subscribe-email")).toBeInTheDocument();
  });

  it("sends the correct lotteryId in the API call", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    render(<SubscribeButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId("subscribe-trigger"));

    fireEvent.change(screen.getByTestId("subscribe-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("subscribe-submit"));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com", lotteryId: 42 }),
      });
    });
  });
});
