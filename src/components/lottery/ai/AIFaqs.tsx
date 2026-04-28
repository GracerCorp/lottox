import React from 'react';

export interface AIFaqsProps {
  faqs: { question: string; answer: string }[];
}

export default function AIFaqs({ faqs }: AIFaqsProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white">Frequently Asked Questions</h3>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 dark:text-white">
              <span>{faq.question}</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="p-5 pt-0 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-50 dark:border-gray-700/50 mt-1">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
