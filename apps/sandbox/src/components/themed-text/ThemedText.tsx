import type { ReactElement } from "react";
import { StyleSheet, Text, type TextProps, type TextStyle } from "react-native";
import { Fonts, type ColorTokenName } from "../../constants/theme";
import { useTheme } from "../../theme/useTheme";

export type ThemedTextType =
  | "default"
  | "title"
  | "subtitle"
  | "small"
  | "smallBold"
  | "link"
  | "linkPrimary"
  | "code";

export interface ThemedTextProps extends TextProps {
  type?: ThemedTextType;
  themeColor?: ColorTokenName;
}

const typeStyles: Record<ThemedTextType, TextStyle> = StyleSheet.create({
  default: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  small: {
    fontSize: 14,
    fontWeight: "400",
  },
  smallBold: {
    fontSize: 14,
    fontWeight: "600",
  },
  link: {
    fontSize: 16,
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  linkPrimary: {
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  code: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: Fonts.mono,
  },
});

export function ThemedText({
  type = "default",
  themeColor = "text",
  style,
  ...rest
}: ThemedTextProps): ReactElement {
  const colors = useTheme();
  return <Text style={[{ color: colors[themeColor] }, typeStyles[type], style]} {...rest} />;
}
