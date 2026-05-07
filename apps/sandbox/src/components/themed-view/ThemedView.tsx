import type { ReactElement } from "react";
import { View, type ViewProps } from "react-native";
import type { ColorTokenName } from "../../constants/theme";
import { useTheme } from "../../theme/useTheme";

export interface ThemedViewProps extends ViewProps {
  type?: ColorTokenName;
}

export function ThemedView({ type = "background", style, ...rest }: ThemedViewProps): ReactElement {
  const colors = useTheme();
  return <View style={[{ backgroundColor: colors[type] }, style]} {...rest} />;
}
