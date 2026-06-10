import type { ReactElement, ReactNode } from "react";
import { Pressable, type PressableProps, StyleSheet } from "react-native";
import type { ShadowTokenName } from "../../theme/tokens/shadows";
import type { SpacingName } from "../../theme/tokens/spacing";
import { useTheme } from "../../theme/useTheme";
import type { CardTone } from "./Card";
import { CardShape } from "./CardShape";

export interface PressableCardProps extends Omit<PressableProps, "children" | "style"> {
  children: ReactNode;
  /** surface (既定) か surfaceElevated。背景の階層を選ぶ。 */
  tone?: CardTone;
  /** 内側 padding。`tokens.spacing` のキー。 @default "lg" */
  padding?: SpacingName;
  /** light での影の強さ。`tokens.shadow` のキー。 @default "sm" */
  elevation?: ShadowTokenName;
}

// iOS 44pt / Android 48dp のうち厳しい 48 に全 OS 統一
// (Button の minSize / ListItem の MIN_ROW_HEIGHT と揃える)
const MIN_TOUCH_TARGET = 48;

/**
 * タップ可能なカード。`Card` と同じ形 (`CardShape`) を描きつつ、押下中は背景を
 * `background.pressed` に切り替える。押下というジェスチャの解釈はここで行い、
 * shape には色の値だけを渡す。タッチターゲットの下限 (48) も Pressable の
 * ヒット領域で保証する。`PressableProps` を Pressable へ forward するため、
 * `Link asChild` の子としてそのまま使える。
 */
export function PressableCard({
  children,
  tone = "surface",
  padding,
  elevation,
  ...rest
}: PressableCardProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <Pressable {...rest} style={styles.touchTarget}>
      {({ pressed }) => (
        <CardShape
          backgroundColor={
            pressed ? tokens.color.background.pressed : tokens.color.background[tone]
          }
          {...(padding ? { padding } : null)}
          {...(elevation ? { elevation } : null)}
        >
          {children}
        </CardShape>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // タッチターゲットは視覚 (CardShape) ではなくヒット領域の要件なので、
  // Pressable のボックス自体で下限を保証する。内容が小さい場合はカードが
  // ヒット領域の中央に浮き、周囲の余白もタップに反応する
  // (視覚より広い当たり判定は HIG / Material 標準の手法)。
  touchTarget: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: "center",
  },
});
