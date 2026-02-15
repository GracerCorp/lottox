"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FileText } from "lucide-react";

export default function TermsPage() {
  const { t } = useLanguage();
  const terms = t.staticParams.terms;

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-purple-500/10 text-purple-400">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{terms.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {terms.subtitle}
          </p>
          <p className="text-sm text-gray-500">{terms.lastUpdated}</p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {terms.sections.map(
            (section: { title: string; content: string }, index: number) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-navy-900/50 border border-white/10 backdrop-blur-sm hover:border-purple-500/20 transition-colors"
              >
                <h2 className="text-xl font-semibold text-purple-400 mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
