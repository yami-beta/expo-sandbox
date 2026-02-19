import type { ReactNode } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  type Theme,
} from "@react-navigation/native";
import Storage from "expo-sqlite/kv-store";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = {
  THEME_MODE: "theme-mode",
} as const;

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: Theme;
  isDark: boolean;
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

  const isDark = useMemo(() => {
    if (mode === "system") {
      return colorScheme === "dark";
    }
    return mode === "dark";
  }, [mode, colorScheme]);

  const theme = useMemo(() => {
    return isDark ? NavigationDarkTheme : NavigationDefaultTheme;
  }, [isDark]);

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode);
    Storage.setItemSync(STORAGE_KEY.THEME_MODE, newMode);
  };

  const value = useMemo(
    () => ({
      mode,
      setMode: handleSetMode,
      theme,
      isDark,
    }),
    [mode, theme, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
