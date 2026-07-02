import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import Storage from "expo-sqlite/kv-store";
import { Colors, type ColorTokens } from "./legacyColors";
import { type ColorScheme, semanticColors, type SemanticColorTokens } from "./tokens/colors";
import { Radius } from "./tokens/radius";
import { shadowsByScheme, type ShadowTokens } from "./tokens/shadows";
import { Spacing } from "./tokens/spacing";
import { Typography } from "./tokens/typography";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = {
  THEME_MODE: "theme-mode",
} as const;

export interface ThemeTokens {
  color: SemanticColorTokens;
  spacing: typeof Spacing;
  radius: typeof Radius;
  shadow: ShadowTokens;
  typography: typeof Typography;
}

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colorScheme: ColorScheme;
  colors: ColorTokens;
  tokens: ThemeTokens;
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
  const systemColorScheme = useColorScheme();

  const colorScheme: ColorScheme = useMemo(() => {
    if (mode === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return mode;
  }, [mode, systemColorScheme]);

  const colors = Colors[colorScheme];

  const tokens = useMemo<ThemeTokens>(
    () => ({
      color: semanticColors[colorScheme],
      spacing: Spacing,
      radius: Radius,
      shadow: shadowsByScheme[colorScheme],
      typography: Typography,
    }),
    [colorScheme],
  );

  // iOS の overrideUserInterfaceStyle をアプリ設定に揃える。
  // これをやらないと NativeTabs などのネイティブ UI が OS 設定側を
  // 参照し続け、アプリ内でダーク強制してもタブ切替時にライト色が
  // ちらつく。"unspecified" を渡すと OS 設定に戻る。
  useEffect(() => {
    Appearance.setColorScheme(mode === "system" ? "unspecified" : mode);
  }, [mode]);

  const handleSetMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    Storage.setItemSync(STORAGE_KEY.THEME_MODE, newMode);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode: handleSetMode,
      colorScheme,
      colors,
      tokens,
    }),
    [mode, handleSetMode, colorScheme, colors, tokens],
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
