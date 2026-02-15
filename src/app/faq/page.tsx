"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function FAQPage() {
  const { t } = useLanguage();
  const faq = t.staticParams.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-blue-500/10 text-blue-400">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{faq.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {faq.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faq.items.map((item: { q: string; a: string }, index: number) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl border backdrop-blur-sm overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "bg-navy-900/70 border-gold-500/30"
                    : "bg-navy-900/50 border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors"
                >
                  <span className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gold-500/10 text-gold-400 text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-lg font-semibold pr-4">{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-gold-400" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 pl-[4.5rem]">
                    <p className="text-gray-300 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
