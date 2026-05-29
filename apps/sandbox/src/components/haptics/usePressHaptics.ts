import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Platform } from "react-native";

export type HapticStyle =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

/**
 * 押下フィードバック用の触覚を発火するハンドラを返す hook。
 * Web は触覚 API が無いため no-op (Platform 分岐)。iOS / Android は `expo-haptics` を呼ぶ。
 * `Button` の `haptic` prop や任意の `Pressable` の `onPress` から利用する想定。
 */
export function usePressHaptics(style: HapticStyle = "light"): () => void {
  return useCallback(() => {
    if (Platform.OS === "web") {
      return;
    }
    // 失敗 (端末非対応など) しても UI を止めないよう握り潰す。
    switch (style) {
      case "light":
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        return;
      case "medium":
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        return;
      case "heavy":
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        return;
      case "selection":
        void Haptics.selectionAsync().catch(() => {});
        return;
      case "success":
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        return;
      case "warning":
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        return;
      case "error":
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        return;
    }
  }, [style]);
}
