"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface UserLocationData {
  countryCode: string;
  countryName: string;
  city: string;
  region: string;
}

interface UserLocationContextType {
  countryCode: string;
  countryName: string;
  city: string;
  region: string;
  isLoading: boolean;
}

const UserLocationContext = createContext<UserLocationContextType | undefined>(
  undefined,
);

const SESSION_STORAGE_KEY = "lottox_user_location";
const TRACKED_KEY = "lottox_location_tracked";

export function UserLocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocationData>({
    countryCode: "",
    countryName: "",
    city: "",
    region: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage first to avoid hitting the API on every navigation
    const cached = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (cached) {
      try {
        const parsed: UserLocationData = JSON.parse(cached);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocation(parsed);
         
        setIsLoading(false);
        return;
      } catch {
        // Corrupted cache, proceed to fetch
      }
    }

    // Fetch from ipapi
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const loc: UserLocationData = {
          countryCode: (data.country_code || "").toLowerCase(),
          countryName: data.country_name || "",
          city: data.city || "",
          region: data.region || "",
        };
        setLocation(loc);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(loc));

        // Track visit once per session
        if (!sessionStorage.getItem(TRACKED_KEY)) {
          fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              countryCode: loc.countryCode,
              countryName: loc.countryName,
              city: loc.city,
              region: loc.region,
            }),
          })
            .then(() => {
              sessionStorage.setItem(TRACKED_KEY, "true");
            })
            .catch(() => {
              // Silently fail — analytics tracking is non-critical
            });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user location:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const value: UserLocationContextType = {
    countryCode: location.countryCode,
    countryName: location.countryName,
    city: location.city,
    region: location.region,
    isLoading,
  };

  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
}

// Safe default for SSR — components render with empty location when
// context is unavailable (e.g. during server pre-render or tests).
const SSR_DEFAULTS: UserLocationContextType = {
  countryCode: "",
  countryName: "",
  city: "",
  region: "",
  isLoading: true,
};

export function useUserLocation() {
  const context = useContext(UserLocationContext);
  return context ?? SSR_DEFAULTS;
}
