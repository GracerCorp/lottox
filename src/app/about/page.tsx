"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  Info,
  Zap,
  Globe,
  ShieldCheck,
  BarChart3,
  Target,
  Eye,
  Lock,
} from "lucide-react";

const featureIcons = [Zap, Globe, ShieldCheck, BarChart3];
const valueIcons = [Target, Eye, Lock];

export default function AboutPage() {
  const { t } = useLanguage();
  const about = t.staticParams.about;

  return (
    <div className="container mx-auto px-4 py-12 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-gold-500/10 text-gold-400">
            <Info className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{about.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {about.subtitle}
          </p>
        </div>

        {/* Intro */}
        <div className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900/50 backdrop-blur-sm shadow-sm">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {about.intro}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl border border-gold-500/30 bg-white dark:bg-navy-900/50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gold-400">
                {about.missionTitle}
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {about.mission}
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-purple-500/30 bg-white dark:bg-navy-900/50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-purple-400">
                {about.visionTitle}
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {about.vision}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">
            {about.featuresTitle}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {about.features.map(
              (feature: { title: string; desc: string }, index: number) => {
                const Icon = featureIcons[index] || Zap;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900/50 hover:border-gold-500/50 dark:hover:border-gold-500/30 transition-colors group shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400 group-hover:bg-gold-500/20 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Values */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">
            {about.valuesTitle}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {about.values.map(
              (value: { title: string; desc: string }, index: number) => {
                const Icon = valueIcons[index] || Target;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900/50 text-center shadow-sm"
                  >
                    <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {value.desc}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
