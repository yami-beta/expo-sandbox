import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../theme/useTheme";

/** ミニチュアに描く提示スタイル。 */
export type LauncherPreview = "push" | "sheet" | "formSheet" | "fullScreen" | "transparent";

/** 提示範囲。root はタブバーごと覆い、tab はタブバーを残してその上に乗る。 */
export type LauncherScope = "root" | "tab";

// ミニチュアの寸法。意味を持つレイアウト値ではなく図のプロポーションなので
// theme token は使わず固定値で持つ (ICON_SLOT_WIDTH などと同じ扱い)。
// 構図はフレーム寸法に対する比率で定義し、FRAME_* の変更に図全体が追従する。
const FRAME_WIDTH = 40;
const FRAME_HEIGHT = 68;
const FRAME_RADIUS = 6;
const TAB_BAR_HEIGHT = Math.round(FRAME_HEIGHT * 0.15);
// sheet は上に隙間を残して下から覆い、formSheet は下半分に留まる
const SHEET_TOP = Math.round(FRAME_HEIGHT * 0.22);
const FORM_SHEET_TOP = Math.round(FRAME_HEIGHT * 0.52);
// push は右から入ってくるパネル
const PUSH_PANEL_WIDTH = Math.round(FRAME_WIDTH * 0.55);
// transparent は薄い幕の中央に浮かぶパネル
const FLOATING_PANEL_TOP = Math.round(FRAME_HEIGHT * 0.34);
const FLOATING_PANEL_HEIGHT = Math.round(FRAME_HEIGHT * 0.24);
const FLOATING_PANEL_INSET = Math.round(FRAME_WIDTH * 0.18);

export interface PreviewThumbnailProps {
  preview: LauncherPreview;
  scope: LauncherScope;
}

/**
 * 提示挙動のミニチュア。端末フレーム + タブバーの上に accent 矩形を重ねて
 * 「どの範囲がどう覆われるか」を図示する。scope=tab はタブバーの上端で
 * overlay が止まり、タブバーが残ることを示す。装飾図なので SR からは隠す。
 */
export function PreviewThumbnail({ preview, scope }: PreviewThumbnailProps): ReactElement {
  const { tokens } = useTheme();
  const accent = tokens.color.accent.solid;
  const overlayBottom = scope === "tab" ? TAB_BAR_HEIGHT : 0;

  return (
    <View
      style={[
        styles.frame,
        {
          borderColor: tokens.color.border.default,
          backgroundColor: tokens.color.background.canvas,
        },
      ]}
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
    >
      <View
        style={[
          styles.tabBar,
          {
            borderTopColor: tokens.color.border.subtle,
            backgroundColor: tokens.color.background.subtle,
          },
        ]}
      />
      {preview === "push" ? (
        <View
          style={[
            styles.overlay,
            styles.pushPanel,
            { bottom: overlayBottom, backgroundColor: accent },
          ]}
        />
      ) : null}
      {preview === "sheet" || preview === "formSheet" ? (
        <View
          style={[
            styles.overlay,
            styles.sheetPanel,
            {
              top: preview === "sheet" ? SHEET_TOP : FORM_SHEET_TOP,
              bottom: overlayBottom,
              backgroundColor: accent,
            },
          ]}
        />
      ) : null}
      {preview === "fullScreen" ? (
        <View
          style={[
            styles.overlay,
            styles.fullPanel,
            { bottom: overlayBottom, backgroundColor: accent },
          ]}
        />
      ) : null}
      {preview === "transparent" ? (
        <>
          <View
            style={[
              styles.overlay,
              styles.fullPanel,
              styles.dimLayer,
              { bottom: overlayBottom, backgroundColor: accent },
            ]}
          />
          <View style={[styles.overlay, styles.floatingPanel, { backgroundColor: accent }]} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    borderRadius: FRAME_RADIUS,
    borderWidth: 1,
    overflow: "hidden",
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  overlay: {
    position: "absolute",
  },
  pushPanel: {
    top: 0,
    right: 0,
    width: PUSH_PANEL_WIDTH,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  sheetPanel: {
    left: 0,
    right: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  fullPanel: {
    top: 0,
    left: 0,
    right: 0,
  },
  dimLayer: {
    opacity: 0.3,
  },
  floatingPanel: {
    top: FLOATING_PANEL_TOP,
    left: FLOATING_PANEL_INSET,
    right: FLOATING_PANEL_INSET,
    height: FLOATING_PANEL_HEIGHT,
    borderRadius: 3,
  },
});
