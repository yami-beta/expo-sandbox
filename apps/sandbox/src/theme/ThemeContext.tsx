import type { ReactNode } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  type Theme,
} from "@react-navigation/native";

export type ThemeMode = "system" | "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("system");
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

  const value = useMemo(
    () => ({
      mode,
      setMode,
      theme,
      isDark,
    }),
    [mode, theme, isDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
