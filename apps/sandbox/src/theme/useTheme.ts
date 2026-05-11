import type { ColorScheme, ColorTokens } from "../constants/theme";
import { useThemeContextInternal } from "./ThemeContext";

export function useTheme(): { colorScheme: ColorScheme; colors: ColorTokens } {
  const { colorScheme, colors } = useThemeContextInternal();
  return { colorScheme, colors };
}
