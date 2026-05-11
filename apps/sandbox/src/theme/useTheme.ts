import type { ColorScheme, ColorTokens } from "../constants/theme";
import { useThemeContextInternal } from "./ThemeContext";

export function useTheme(): { scheme: ColorScheme; colors: ColorTokens } {
  const { scheme, colors } = useThemeContextInternal();
  return { scheme, colors };
}
