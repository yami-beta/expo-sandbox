import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { PressableCard } from "../card/PressableCard";
import { ThemedText } from "../themed-text/ThemedText";

/** ミニチュアに描く提示スタイル。 */
export type LauncherPreview = "push" | "sheet" | "formSheet" | "fullScreen" | "transparent";

/** 提示範囲。root はタブバーごと覆い、tab はタブバーを残してその上に乗る。 */
export type LauncherScope = "root" | "tab";

export interface LauncherItem {
  href: LinkProps["href"];
  text: ReactNode;
  description?: ReactNode;
  preview: LauncherPreview;
  scope: LauncherScope;
}

export interface LauncherSection {
  title?: ReactNode;
  footer?: ReactNode;
  data: readonly LauncherItem[];
}

interface PresentationLauncherListProps {
  sections: readonly LauncherSection[];
}

/**
 * presentation サンプルの遷移元ランチャー。リンク先がモーダル/シート表示で
 * スタック push ではないため、push を暗示する chevron 行 (`GroupedList`) ではなく、
 * 提示挙動のミニチュア (`PreviewThumbnail`) を添えたタップ可能カードで表現する。
 * 自身がスクロールコンテナを兼ねる (ページ側で ScrollView を重ねない)。
 */
export function PresentationLauncherList({
  sections,
}: PresentationLauncherListProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: tokens.color.background.canvas }}
      contentContainerStyle={{ padding: tokens.spacing.xl, gap: tokens.spacing.xl }}
    >
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={{ gap: tokens.spacing.sm }}>
          {section.title ? (
            <ThemedText type="overline" tone="tertiary">
              {section.title}
            </ThemedText>
          ) : null}
          <View style={{ gap: tokens.spacing.md }}>
            {section.data.map((item) => (
              <LauncherCard key={getItemKey(item.href)} item={item} />
            ))}
          </View>
          {section.footer ? (
            <ThemedText type="caption" tone="tertiary">
              {section.footer}
            </ThemedText>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

interface LauncherCardProps {
  item: LauncherItem;
}

// a11y のグルーピングと role は明示指定しない:
// - PressableCard 内の Pressable は accessible が既定 true のため、SR ではカード全体が
//   1 つのフォーカス対象になり、配下の Text の文言が (間に View を挟んでいても)
//   まとめて読み上げられる。
// - expo-router の Link が role="link" を Slot 経由で PressableCard (の Pressable) に
//   付与する (ListItemRow と同じ理屈)。
function LauncherCard({ item }: LauncherCardProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <Link href={item.href} asChild>
      <PressableCard>
        <View style={[styles.row, { gap: tokens.spacing.md }]}>
          <View style={[styles.textCol, { gap: tokens.spacing.xs }]}>
            <ThemedText type="bodyEmphasis">{item.text}</ThemedText>
            {item.description ? (
              <ThemedText type="caption" tone="secondary">
                {item.description}
              </ThemedText>
            ) : null}
          </View>
          <PreviewThumbnail preview={item.preview} scope={item.scope} />
        </View>
      </PressableCard>
    </Link>
  );
}

// ミニチュアの寸法。意味を持つレイアウト値ではなく図のプロポーションなので
// theme token は使わず固定値で持つ (ICON_SLOT_WIDTH などと同じ扱い)。
const FRAME_WIDTH = 40;
const FRAME_HEIGHT = 68;
const FRAME_RADIUS = 6;
const TAB_BAR_HEIGHT = 10;

interface PreviewThumbnailProps {
  preview: LauncherPreview;
  scope: LauncherScope;
}

/**
 * 提示挙動のミニチュア。端末フレーム + タブバーの上に accent 矩形を重ねて
 * 「どの範囲がどう覆われるか」を図示する。scope=tab はタブバーの上端で
 * overlay が止まり、タブバーが残ることを示す。装飾図なので SR からは隠す。
 */
function PreviewThumbnail({ preview, scope }: PreviewThumbnailProps): ReactElement {
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
      {preview === "sheet" ? (
        <View
          style={[
            styles.overlay,
            styles.sheetPanel,
            { top: "22%", bottom: overlayBottom, backgroundColor: accent },
          ]}
        />
      ) : null}
      {preview === "formSheet" ? (
        <View
          style={[
            styles.overlay,
            styles.sheetPanel,
            { top: "52%", bottom: overlayBottom, backgroundColor: accent },
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

// GroupedList の getItemKey と同じ href ベースのキー。
function getItemKey(href: LinkProps["href"]): string {
  return typeof href === "string" ? href : href.pathname;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
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
    width: "55%",
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
    top: "34%",
    left: "18%",
    right: "18%",
    height: "24%",
    borderRadius: 3,
  },
});
