import type { ColorScheme, ColorTokens } from "../constants/theme";
import { useThemeContextInternal, type ThemeTokens } from "./ThemeContext";

export function useTheme(): {
  colorScheme: ColorScheme;
  colors: ColorTokens;
  tokens: ThemeTokens;
} {
  const { colorScheme, colors, tokens } = useThemeContextInternal();
  return { colorScheme, colors, tokens };
}
