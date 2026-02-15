"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, AlertCircle } from "lucide-react";

export default function DisclaimerPage() {
  const { t } = useLanguage();
  const disclaimer = t.staticParams.disclaimer;

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-400">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{disclaimer.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {disclaimer.subtitle}
          </p>
          <p className="text-sm text-gray-500">{disclaimer.lastUpdated}</p>
        </div>

        {/* Important Notice */}
        <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 font-medium">
              {disclaimer.importantNotice}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {disclaimer.sections.map(
            (section: { title: string; content: string }, index: number) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-navy-900/50 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">
                      {section.title}
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
