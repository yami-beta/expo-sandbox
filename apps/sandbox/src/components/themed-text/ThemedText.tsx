import type { ReactElement } from "react";
import { Text, type TextProps, type TextStyle } from "react-native";
import { Typography, type TypographyTokenName } from "../../theme/tokens/typography";
import { useTheme } from "../../theme/useTheme";

export type ThemedTextType = TypographyTokenName;

export type ThemedTextWeight = "regular" | "medium" | "semibold" | "bold";

export type ThemedTextTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled"
  | "accent"
  | "onAccent";

export interface ThemedTextProps extends Omit<TextProps, "style"> {
  type?: ThemedTextType | undefined;
  weight?: ThemedTextWeight | undefined;
  tone?: ThemedTextTone | undefined;
  align?: TextStyle["textAlign"] | undefined;
  underline?: boolean | undefined;
}

const fontWeightMap: Record<ThemedTextWeight, NonNullable<TextStyle["fontWeight"]>> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export function ThemedText({
  type = "body",
  weight,
  tone = "primary",
  align,
  underline,
  ...rest
}: ThemedTextProps): ReactElement {
  const { tokens } = useTheme();

  const color = tone === "accent" ? tokens.color.accent.text : tokens.color.text[tone];

  return (
    <Text
      style={[
        Typography[type],
        { color },
        weight ? { fontWeight: fontWeightMap[weight] } : undefined,
        align ? { textAlign: align } : undefined,
        underline ? { textDecorationLine: "underline" } : undefined,
      ]}
      {...rest}
    />
  );
}
