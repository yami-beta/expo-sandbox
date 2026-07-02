import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../theme/useTheme";
import { PressableCard } from "../../../components/card/PressableCard";
import { ScreenScrollView } from "../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../components/themed-text/ThemedText";
import { type LauncherPreview, type LauncherScope, PreviewThumbnail } from "./PreviewThumbnail";

export { type LauncherPreview, type LauncherScope } from "./PreviewThumbnail";

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
 * `ScreenScrollView` によりスクロールコンテナを兼ねる (ページ側で重ねない)。
 */
export function PresentationLauncherList({
  sections,
}: PresentationLauncherListProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <ScreenScrollView>
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
    </ScreenScrollView>
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
});
