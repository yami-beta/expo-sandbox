import type { ReactElement } from "react";
import { Text, type TextProps, type TextStyle, useWindowDimensions } from "react-native";
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
  // RN の <Text> は allowFontScaling 既定で fontSize を端末のフォント倍率に追従させるが、
  // px 指定の lineHeight は追従しない。トークンの lineHeight を倍率 1.0 時の基準値とみなし
  // 同じ倍率を掛けることで、行間比率を保ったままフォント拡大時の行重なり / クリップを防ぐ。
  // useWindowDimensions は設定のフォントサイズ変更にリアクティブに追従する。
  const { fontScale } = useWindowDimensions();
  const typography = Typography[type];
  const scaledLineHeight =
    typography.lineHeight !== undefined ? typography.lineHeight * fontScale : undefined;

  const color = tone === "accent" ? tokens.color.accent.text : tokens.color.text[tone];

  return (
    <Text
      style={[
        typography,
        scaledLineHeight !== undefined ? { lineHeight: scaledLineHeight } : undefined,
        { color },
        weight ? { fontWeight: fontWeightMap[weight] } : undefined,
        align ? { textAlign: align } : undefined,
        underline ? { textDecorationLine: "underline" } : undefined,
      ]}
      {...rest}
    />
  );
}
