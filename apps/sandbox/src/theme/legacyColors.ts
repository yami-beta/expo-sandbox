// 旧 API。新規コードは ./tokens/<name> から直接 import すること。
// 既存呼び出し箇所は第2段以降で順次置換する。
import { semanticColors } from "./tokens/colors";

export const Colors = {
  light: {
    text: semanticColors.light.text.primary,
    textSecondary: semanticColors.light.text.secondary,
    background: semanticColors.light.background.canvas,
    backgroundElement: semanticColors.light.background.surface,
    backgroundSelected: semanticColors.light.background.pressed,
    backgroundHeader: semanticColors.light.background.canvas,
    border: semanticColors.light.border.subtle,
    primary: semanticColors.light.accent.solid,
    onPrimary: semanticColors.light.text.onAccent,
  },
  dark: {
    text: semanticColors.dark.text.primary,
    textSecondary: semanticColors.dark.text.secondary,
    background: semanticColors.dark.background.canvas,
    backgroundElement: semanticColors.dark.background.surface,
    backgroundSelected: semanticColors.dark.background.pressed,
    backgroundHeader: semanticColors.dark.background.canvas,
    border: semanticColors.dark.border.subtle,
    primary: semanticColors.dark.accent.solid,
    onPrimary: semanticColors.dark.text.onAccent,
  },
} as const;

export type ColorTokenName = keyof (typeof Colors)["light"];
export type ColorTokens = Readonly<Record<ColorTokenName, string>>;
