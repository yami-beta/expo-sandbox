import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import Storage from "expo-sqlite/kv-store";
import { Colors, type ColorScheme, type ColorTokens } from "../constants/theme";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = {
  THEME_MODE: "theme-mode",
} as const;

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  scheme: ColorScheme;
  colors: ColorTokens;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isValidThemeMode = (value: unknown): value is ThemeMode => {
  return value === "system" || value === "light" || value === "dark";
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = Storage.getItemSync(STORAGE_KEY.THEME_MODE);
    return isValidThemeMode(stored) ? stored : "system";
  });
  const colorScheme = useColorScheme();

  const scheme: ColorScheme = useMemo(() => {
    if (mode === "system") {
      return colorScheme === "dark" ? "dark" : "light";
    }
    return mode;
  }, [mode, colorScheme]);

  const colors = Colors[scheme];

  const handleSetMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    Storage.setItemSync(STORAGE_KEY.THEME_MODE, newMode);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode: handleSetMode,
      scheme,
      colors,
    }),
    [mode, handleSetMode, scheme, colors],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContextInternal(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }
  return context;
}
