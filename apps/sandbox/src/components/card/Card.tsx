import type { ReactElement } from "react";
import type { ViewProps } from "react-native";
import type { ShadowTokenName } from "../../theme/tokens/shadows";
import type { SpacingName } from "../../theme/tokens/spacing";
import { useTheme } from "../../theme/useTheme";
import { CardShape } from "./CardShape";

/** カード背景の階層。`Card` / `PressableCard` 共通の語彙。 */
export type CardTone = "surface" | "surfaceElevated";

export interface CardProps extends Omit<ViewProps, "style"> {
  /** surface (既定) か surfaceElevated。背景の階層を選ぶ。 */
  tone?: CardTone;
  /** 内側 padding。`tokens.spacing` のキー。 @default "lg" */
  padding?: SpacingName;
  /** light での影の強さ。`tokens.shadow` のキー。 @default "sm" */
  elevation?: ShadowTokenName;
}

/**
 * surface elevation + padding 規約を持つ汎用カード (静的コンテナ)。
 * `GroupedList` の島と同じく `radius.lg` + surface tone を土台にする。
 * 形の実体は `CardShape` で、Card は tone を背景色に解決して渡すだけ。
 * タップ可能なカードが必要な場合は `PressableCard` を使う。
 */
export function Card({ tone = "surface", ...rest }: CardProps): ReactElement {
  const { tokens } = useTheme();
  return <CardShape backgroundColor={tokens.color.background[tone]} {...rest} />;
}
