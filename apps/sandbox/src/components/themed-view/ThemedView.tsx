import type { ReactElement } from "react";
import { View, type ViewProps } from "react-native";
import type { ColorTokenName } from "../../constants/theme";
import { useTheme } from "../../theme/useTheme";

export type ThemedViewTone = "canvas" | "surface" | "surfaceElevated" | "subtle";

export interface ThemedViewProps extends ViewProps {
  tone?: ThemedViewTone;
  /** @deprecated tone を使うこと */
  type?: ColorTokenName;
}

export function ThemedView({ tone, type, style, ...rest }: ThemedViewProps): ReactElement {
  const { colors, tokens } = useTheme();
  const backgroundColor = tone ? tokens.color.background[tone] : colors[type ?? "background"];
  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
