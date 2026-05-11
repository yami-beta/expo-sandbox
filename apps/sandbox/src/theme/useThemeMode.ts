import { useThemeContextInternal, type ThemeMode } from "./ThemeContext";

export function useThemeMode(): { mode: ThemeMode; setMode: (mode: ThemeMode) => void } {
  const { mode, setMode } = useThemeContextInternal();
  return { mode, setMode };
}
