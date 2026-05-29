import { BlurView, type BlurTint } from "expo-blur";
import type { ReactElement, ReactNode } from "react";
import { Platform, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../../theme/useTheme";

export interface BlurOverlayProps {
  /** ブラーの強さ (1-100)。 @default 40 */
  intensity?: number;
  /** tint を明示する場合。未指定なら colorScheme に連動。 */
  tint?: BlurTint;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * `expo-blur` の `BlurView` を semantic に包んだ半透明ブラー。ヘッダ / overlay 用途。
 * `tint` は未指定なら colorScheme に連動 (light→systemMaterialLight / dark→systemMaterialDark)。
 * Android は既定の blurMethod が `'none'` (半透明のみ) なので実ブラーを有効化する。
 * Web は backdrop-filter ベースで動作する (ブラウザ対応に留意)。
 */
export function BlurOverlay({
  intensity = 40,
  tint,
  style,
  children,
}: BlurOverlayProps): ReactElement {
  const { colorScheme } = useTheme();
  const resolvedTint: BlurTint =
    tint ?? (colorScheme === "dark" ? "systemMaterialDark" : "systemMaterialLight");

  return (
    <BlurView
      intensity={intensity}
      tint={resolvedTint}
      style={style}
      {...(Platform.OS === "android" ? { blurMethod: "dimezisBlurViewSdk31Plus" } : null)}
    >
      {children}
    </BlurView>
  );
}
