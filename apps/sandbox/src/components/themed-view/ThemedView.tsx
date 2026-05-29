import type { ReactElement } from "react";
import { View, type ViewProps } from "react-native";
import { useTheme } from "../../theme/useTheme";

export type ThemedViewTone = "canvas" | "surface" | "surfaceElevated" | "subtle";

export interface ThemedViewProps extends ViewProps {
  tone?: ThemedViewTone;
}

export function ThemedView({ tone = "canvas", style, ...rest }: ThemedViewProps): ReactElement {
  const { tokens } = useTheme();
  return <View style={[{ backgroundColor: tokens.color.background[tone] }, style]} {...rest} />;
}
