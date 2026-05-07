import type { ColorTokens } from "../constants/theme";
import { useThemeContext } from "./ThemeContext";

export function useTheme(): ColorTokens {
  return useThemeContext().colors;
}
