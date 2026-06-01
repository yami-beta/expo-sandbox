import type { ReactElement } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import type { ShadowTokenName } from "../../theme/tokens/shadows";
import type { SpacingName } from "../../theme/tokens/spacing";
import { useTheme } from "../../theme/useTheme";

export interface CardProps extends Omit<ViewProps, "style"> {
  /** surface (既定) か surfaceElevated。背景の階層を選ぶ。 */
  tone?: "surface" | "surfaceElevated";
  /** 内側 padding。`tokens.spacing` のキー。 @default "lg" */
  padding?: SpacingName;
  /** light での影の強さ。`tokens.shadow` のキー。 @default "sm" */
  elevation?: ShadowTokenName;
}

/**
 * surface elevation + padding 規約を持つ汎用カード。
 * `GroupedList` の島と同じく `radius.lg` + surface tone を土台にしつつ、
 * Card は elevation (浮き) を表現する: light は `shadow`、dark は shadow が沈むため
 * hairline border で階層を出す (`GroupedList` の島は flat な border ベースで対照的)。
 */
export function Card({
  tone = "surface",
  padding = "lg",
  elevation = "sm",
  ...rest
}: CardProps): ReactElement {
  const { colorScheme, tokens } = useTheme();

  const elevationStyle =
    colorScheme === "dark"
      ? { borderWidth: StyleSheet.hairlineWidth, borderColor: tokens.color.border.subtle }
      : tokens.shadow[elevation];

  return (
    <View
      style={[
        {
          backgroundColor: tokens.color.background[tone],
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing[padding],
        },
        elevationStyle,
      ]}
      {...rest}
    />
  );
}
