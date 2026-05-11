import type { ColorScheme, ColorTokens } from "../constants/theme";

interface StackScreenOptions {
  headerStyle: { backgroundColor: string };
  headerTintColor: string;
  headerShadowVisible: boolean;
}

export function buildStackScreenOptions(
  colors: ColorTokens,
  scheme: ColorScheme,
): StackScreenOptions {
  return {
    headerStyle: { backgroundColor: colors.backgroundHeader },
    headerTintColor: colors.text,
    headerShadowVisible: scheme === "light",
  };
}
