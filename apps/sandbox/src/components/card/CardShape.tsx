import type { ReactElement } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import type { ShadowTokenName } from "../../theme/tokens/shadows";
import type { SpacingName } from "../../theme/tokens/spacing";
import { useTheme } from "../../theme/useTheme";

export interface CardShapeProps extends Omit<ViewProps, "style"> {
  /**
   * カード面の背景色。何色を塗るか (tone の解決・押下状態の解釈) は
   * `Card` / `PressableCard` の責務で、shape は受け取った色を描くだけ。
   * 描画自体を shape の外へ分離できない理由はコンポーネントの JSDoc を参照。
   */
  backgroundColor: string;
  /** 内側 padding。`tokens.spacing` のキー。 @default "lg" */
  padding?: SpacingName;
  /** light での影の強さ。`tokens.shadow` のキー。 @default "sm" */
  elevation?: ShadowTokenName;
  /**
   * 面の最小高さ。タップ可能な利用 (`PressableCard`) がタッチターゲットの
   * 下限を保証するために渡す。静的な `Card` では指定しない。
   */
  minHeight?: number;
}

/**
 * Card ファミリー共通の「カードの形」: `radius.lg` + padding + elevation。
 * elevation は light では `tokens.shadow`、dark では shadow が沈むため
 * hairline border で階層を出す (`GroupedList` の島は flat な border ベースで対照的)。
 * card ディレクトリ内部の primitive で、利用側は `Card` (静的) /
 * `PressableCard` (タップ可能) を使う。
 *
 * 背景色は値を受け取って shape 自身が塗る。背景色・borderRadius・
 * shadow / elevation は同一 View に同居させる必要があり、背景の描画だけを
 * 外側のラッパーや内側の子 View へ分離できないため:
 *
 * - iOS: `shadow*` props は CALayer にマップされ、影の形は不透明な背景が
 *   あれば「背景の角丸矩形」として安価に計算される。背景が透明な View に
 *   影を載せると、レイヤーと子レイヤーのアルファ合成から影を導出するため、
 *   影が子要素のシルエットに沿って出る・オフスクリーン描画で重い・RN が
 *   "cannot calculate shadow efficiently" 警告を出す、の三重苦になる。
 * - Android: `elevation` の影は View の Outline から計算され、Outline は
 *   背景 drawable (背景色 + borderRadius) から導出されるため、背景のない
 *   View では影がそもそも描かれない。
 * - 背景を内側の子 View に移す案は、子の四角い角が親の角丸からはみ出すため
 *   radius の複製か親への `overflow: "hidden"` が必要になるが、overflow
 *   hidden は bounds 外に描かれる影ごと切り落とす。
 *
 * このため「色の決定は Card / PressableCard、描画は shape」という分離に
 * している。なお RN 0.76+ の `boxShadow` スタイルは border box から影を
 * 計算するため背景に依存せず、shadow トークンを boxShadow ベースへ移行
 * すればこの同居制約は緩む。
 */
export function CardShape({
  backgroundColor,
  padding = "lg",
  elevation = "sm",
  minHeight,
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
          ...(minHeight != null ? { minHeight } : null),
        },
        elevationStyle,
      ]}
      {...rest}
    />
  );
}
