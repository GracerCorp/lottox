"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  Lock,
  Database,
  Settings,
  Cookie,
  Share2,
  Shield,
  UserCheck,
  RefreshCw,
} from "lucide-react";

const sectionIcons = [
  Database,
  Settings,
  Cookie,
  Share2,
  Shield,
  UserCheck,
  RefreshCw,
];

export default function PrivacyPage() {
  const { t } = useLanguage();
  const privacy = t.staticParams.privacy;

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{privacy.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {privacy.subtitle}
          </p>
          <p className="text-sm text-gray-500">{privacy.lastUpdated}</p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {privacy.sections.map(
            (section: { title: string; content: string }, index: number) => {
              const Icon = sectionIcons[index] || Shield;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-navy-900/50 border border-white/10 backdrop-blur-sm hover:border-emerald-500/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-emerald-400 mb-3">
                        {section.title}
                      </h2>
                      <p className="text-gray-300 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
