"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Terminal } from "lucide-react";

export default function APIDocsPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-orange-500/10 text-orange-400">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold">{t.staticParams.api.title}</h1>
        </div>

        <div className="p-8 rounded-2xl bg-white/50 dark:bg-navy-900/50 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            {t.staticParams.api.desc}
          </p>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded bg-green-500/20 text-green-600 dark:text-green-400 font-mono text-sm">
                  GET
                </span>
                <code className="text-gray-800 dark:text-gray-200 font-mono">
                  /api/check?number=123456&type=THAI
                </code>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Check a number against the latest Thai Government Lottery draw.
              </p>

              <div className="bg-gray-100 dark:bg-navy-950 p-4 rounded-lg font-mono text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
                {`{
  "win": true,
  "prize": "prize1",
  "amount": "6,000,000",
  "drawDate": "2026-02-19",
  "drawNo": "#40/2569"
}`}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-sm">
                  POST
                </span>
                <code className="text-gray-800 dark:text-gray-200 font-mono">
                  /api/subscribe
                </code>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Subscribe a user email to receive notifications.
              </p>

              <div className="bg-gray-100 dark:bg-navy-950 p-4 rounded-lg font-mono text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
                {`{
  "email": "user@example.com",
  "type": "ALL"
}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
