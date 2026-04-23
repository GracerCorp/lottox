"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserLocationProvider } from "@/contexts/UserLocationContext";
import { ThemeProvider } from "next-themes";
import { FeatureToggleProvider } from "@/contexts/FeatureToggleContext";
import type { ReactNode } from "react";

interface ClientProvidersProps {
  children: ReactNode;
  featureToggles: Record<string, boolean>;
}

export function ClientProviders({ children, featureToggles }: ClientProvidersProps) {
  const isThemeToggleEnabled = featureToggles["theme_toggle"] !== false;

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={isThemeToggleEnabled}
      forcedTheme={isThemeToggleEnabled ? undefined : "dark"}
    >
      <LanguageProvider>
        <UserLocationProvider>
          <FeatureToggleProvider initialToggles={featureToggles}>
            {children}
          </FeatureToggleProvider>
        </UserLocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

