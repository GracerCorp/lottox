"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import { FeatureToggleProvider } from "@/contexts/FeatureToggleContext";
import type { ReactNode } from "react";

interface ClientProvidersProps {
  children: ReactNode;
  featureToggles: Record<string, boolean>;
}

export function ClientProviders({ children, featureToggles }: ClientProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LanguageProvider>
        <FeatureToggleProvider initialToggles={featureToggles}>
          {children}
        </FeatureToggleProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
