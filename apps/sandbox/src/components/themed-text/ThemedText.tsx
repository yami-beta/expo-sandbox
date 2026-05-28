import type { ReactElement } from "react";
import { Text, type TextProps, type TextStyle } from "react-native";
import type { ColorTokenName } from "../../constants/theme";
import { useTheme } from "../../theme/useTheme";
import { Typography, type TypographyTokenName } from "../../theme/tokens/typography";

type LegacyThemedTextType = "default" | "subtitle" | "small" | "smallBold" | "link" | "linkPrimary";

export type ThemedTextType = TypographyTokenName | LegacyThemedTextType;

export type ThemedTextWeight = "regular" | "medium" | "semibold" | "bold";

export type ThemedTextTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled"
  | "accent"
  | "onAccent";

export interface ThemedTextProps extends TextProps {
  type?: ThemedTextType;
  weight?: ThemedTextWeight;
  tone?: ThemedTextTone;
  align?: TextStyle["textAlign"];
  /** @deprecated tone を使うこと */
  themeColor?: ColorTokenName;
}

const legacyTypeMap: Record<LegacyThemedTextType, TypographyTokenName> = {
  default: "body",
  subtitle: "headline",
  small: "caption",
  smallBold: "label",
  link: "body",
  linkPrimary: "bodyEmphasis",
};

const legacyDecoration: Partial<Record<LegacyThemedTextType, TextStyle>> = {
  link: { textDecorationLine: "underline" },
  linkPrimary: { textDecorationLine: "underline" },
};

const fontWeightMap: Record<ThemedTextWeight, NonNullable<TextStyle["fontWeight"]>> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

const isLegacy = (type: ThemedTextType): type is LegacyThemedTextType => type in legacyTypeMap;

const warnedLegacyTypes = new Set<string>();
const warnLegacyType = (type: LegacyThemedTextType, mapped: TypographyTokenName) => {
  if (__DEV__ && !warnedLegacyTypes.has(type)) {
    warnedLegacyTypes.add(type);
    console.warn(
      `[ThemedText] type="${type}" は deprecated。第2段で削除予定 (代替: type="${mapped}")`,
    );
  }
};

export function ThemedText({
  type = "body",
  weight,
  tone = "primary",
  align,
  themeColor,
  style,
  ...rest
}: ThemedTextProps): ReactElement {
  const { colors, tokens } = useTheme();

  const typographyName: TypographyTokenName = isLegacy(type) ? legacyTypeMap[type] : type;
  if (isLegacy(type)) {
    warnLegacyType(type, typographyName);
  }

  const color = themeColor
    ? colors[themeColor]
    : tone === "accent"
      ? tokens.color.accent.text
      : tokens.color.text[tone];

  return (
    <Text
      style={[
        Typography[typographyName],
        isLegacy(type) ? legacyDecoration[type] : undefined,
        { color },
        weight ? { fontWeight: fontWeightMap[weight] } : undefined,
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
