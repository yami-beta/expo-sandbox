import type { ReactElement } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import type { ShadowTokenName } from "../../theme/tokens/shadows";
import type { SpacingName } from "../../theme/tokens/spacing";
import { useTheme } from "../../theme/useTheme";

export interface CardShapeProps extends Omit<ViewProps, "style"> {
  /**
   * カード面の背景色。何色を塗るか (tone の解決・押下状態の解釈) は
   * `Card` / `PressableCard` の責務で、shape は受け取った色を描くだけ。
   * iOS の shadow は背景を持つ View 自身に載せる必要があるため、
   * 背景の描画自体は shape が担う。
   */
  backgroundColor: string;
  /** 内側 padding。`tokens.spacing` のキー。 @default "lg" */
  padding?: SpacingName;
  /** light での影の強さ。`tokens.shadow` のキー。 @default "sm" */
  elevation?: ShadowTokenName;
}

/**
 * Card ファミリー共通の「カードの形」: `radius.lg` + padding + elevation。
 * elevation は light では `tokens.shadow`、dark では shadow が沈むため
 * hairline border で階層を出す (`GroupedList` の島は flat な border ベースで対照的)。
 * card ディレクトリ内部の primitive で、利用側は `Card` (静的) /
 * `PressableCard` (タップ可能) を使う。
 */
export function CardShape({
  backgroundColor,
  padding = "lg",
  elevation = "sm",
  ...rest
}: CardShapeProps): ReactElement {
  const { colorScheme, tokens } = useTheme();

  const elevationStyle =
    colorScheme === "dark"
      ? { borderWidth: StyleSheet.hairlineWidth, borderColor: tokens.color.border.subtle }
      : tokens.shadow[elevation];

  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing[padding],
        },
        elevationStyle,
      ]}
      {...rest}
    />
  );
}
