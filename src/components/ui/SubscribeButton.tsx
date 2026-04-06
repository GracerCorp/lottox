"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubscribeButtonProps {
  lotteryId: number;
  lotteryName: string;
}

export function SubscribeButton({ lotteryId, lotteryName }: SubscribeButtonProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "already"
  >("idle");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Auto-focus close button on mount
  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  function handleClose() {
    setIsOpen(false);
    if (status !== "sending") {
      setStatus("idle");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("sending");
    try {
      const cmsUrl = process.env.NEXT_PUBLIC_CMS_API_URL || "https://lotto-x-cms.vercel.app";
      const res = await fetch(`${cmsUrl}/api/v1/users/_/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lotteryId }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        setStatus("success");
        setEmail("");
      } else if (data.error?.toLowerCase().includes("already subscribed")) {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-white shadow-sm"
        data-testid="subscribe-trigger"
      >
        {/* Bell SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {t.subscribe.button}
      </button>

      {/* Dialog / Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t.subscribe.title}
          data-testid="subscribe-dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-sm mx-4 shadow-2xl"
          >
            {/* ── Sending State ── */}
            {status === "sending" && (
              <div className="flex flex-col items-center justify-center py-16 px-6" data-testid="subscribe-loading">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                </div>
                <p className="text-gray-900 dark:text-white font-semibold text-lg">
                  {t.subscribe.sending}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {lotteryName}
                </p>
              </div>
            )}

            {/* ── Success State ── */}
            {status === "success" && (
              <div className="flex flex-col items-center justify-center py-12 px-6" data-testid="subscribe-success">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className="h-8 w-8 text-emerald-500"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-gray-900 dark:text-white font-bold text-lg text-center">
                  {t.subscribe.success}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
                  {lotteryName}
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-colors"
                  data-testid="subscribe-done"
                >
                  {t.subscribe.done}
                </button>
              </div>
            )}

            {/* ── Error State ── */}
            {status === "error" && (
              <div className="flex flex-col items-center justify-center py-12 px-6" data-testid="subscribe-error">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className="h-8 w-8 text-red-500"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-gray-900 dark:text-white font-bold text-lg text-center">
                  {t.subscribe.errorTitle}
                </p>
                <p className="text-red-400 text-sm mt-2 text-center">
                  {t.subscribe.error}
                </p>
                <div className="flex gap-3 mt-6 w-full">
                  <button
                    onClick={() => setStatus("idle")}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors"
                    data-testid="subscribe-retry"
                  >
                    {t.subscribe.retry}
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    {t.subscribe.close}
                  </button>
                </div>
              </div>
            )}

            {/* ── Already Subscribed State ── */}
            {status === "already" && (
              <div className="flex flex-col items-center px-5 py-8">
                <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7 text-amber-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <p className="text-gray-900 dark:text-white font-bold text-lg text-center">
                  {t.subscribe.alreadyTitle || "Already Subscribed"}
                </p>
                <p className="text-amber-400 text-sm mt-2 text-center">
                  {t.subscribe.alreadyMessage || "You are already subscribed to this lottery. We'll notify you when results are available."}
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition-colors"
                >
                  {t.subscribe.close}
                </button>
              </div>
            )}

            {/* ── Idle / Form State ── */}
            {status === "idle" && (
              <>
                {/* Header */}
                <div className="flex items-start justify-between px-5 pt-5 pb-2">
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                      {t.subscribe.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {lotteryName}
                    </p>
                  </div>
                  <button
                    ref={closeRef}
                    onClick={handleClose}
                    aria-label={t.subscribe.close}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-2xl leading-none ml-3 shrink-0"
                    data-testid="subscribe-close"
                  >
                    &#x2297;
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-5 pb-5 pt-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.subscribe.placeholder}
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 outline-none transition-colors focus:border-blue-500/50 focus:bg-blue-50 dark:focus:bg-blue-500/5"
                    data-testid="subscribe-email"
                  />
                  <button
                    type="submit"
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:from-blue-500 hover:to-blue-400"
                    data-testid="subscribe-submit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    {t.subscribe.button}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
