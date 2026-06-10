import type { ReactElement, ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";
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

/**
 * タップ可能なカード。`Card` と同じ形 (`CardShape`) を描きつつ、押下中は背景を
 * `background.pressed` に切り替える。押下というジェスチャの解釈はここで行い、
 * shape には色の値だけを渡す。`PressableProps` を Pressable へ forward するため、
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
    <Pressable {...rest}>
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
