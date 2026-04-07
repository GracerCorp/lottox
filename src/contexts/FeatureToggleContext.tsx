"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface FeatureToggleContextType {
  toggles: Record<string, boolean>;
  isFeatureEnabled: (key: string) => boolean;
}

const FeatureToggleContext = createContext<FeatureToggleContextType>({
  toggles: {},
  isFeatureEnabled: () => false,
});

interface FeatureToggleProviderProps {
  children: ReactNode;
  initialToggles: Record<string, boolean>;
}

export function FeatureToggleProvider({
  children,
  initialToggles,
}: FeatureToggleProviderProps) {
  const isFeatureEnabled = (key: string) => {
    return initialToggles[key] === true;
  };

  return (
    <FeatureToggleContext.Provider
      value={{ toggles: initialToggles, isFeatureEnabled }}
    >
      {children}
    </FeatureToggleContext.Provider>
  );
}

export function useFeatureToggles() {
  return useContext(FeatureToggleContext);
}
