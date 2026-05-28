import type { ColorScheme, SemanticColorTokens } from "./tokens/colors";

interface StackScreenOptions {
  headerStyle: { backgroundColor: string };
  headerTintColor: string;
  headerShadowVisible: boolean;
}

export function buildStackScreenOptions(
  color: SemanticColorTokens,
  colorScheme: ColorScheme,
): StackScreenOptions {
  return {
    headerStyle: { backgroundColor: color.background.canvas },
    headerTintColor: color.text.primary,
    headerShadowVisible: colorScheme === "light",
  };
}
