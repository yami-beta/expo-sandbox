import { type ReactElement, type ReactNode } from "react";
import { SectionList, type SectionListData, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";
import { ICON_GAP, ICON_SLOT_WIDTH, type ListItem, ListItemRow } from "./ListItem";

export { type ListItem } from "./ListItem";

export interface ListSection {
  title?: ReactNode;
  footer?: ReactNode;
  /**
   * セクション内に leadingIcon を持つ項目が 1 つでもある場合は true を指定する。
   * 配下の全項目で text の開始位置が icon slot の右に揃い、separator のインセットも同じ位置から始まる。
   */
  iconSlotReserved?: boolean;
  data: readonly ListItem[];
}

interface GroupedListProps {
  sections: readonly ListSection[];
  /** SectionList の上部に固定で出すヘッダ (画面固有の見出し等)。 */
  ListHeaderComponent?: ReactElement | null;
}

/**
 * iOS Settings 風の grouped list。内部は RN 標準の `SectionList` で構成し、
 * 自身がスクロールコンテナを兼ねる (ページ側で ScrollView を重ねない)。
 */
export function GroupedList({ sections, ListHeaderComponent }: GroupedListProps): ReactElement {
  const { tokens } = useTheme();

  const firstSection = sections[0];

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<ListItem, ListSection>;
  }): ReactElement => {
    const isFirst = section === firstSection;
    return (
      <View
        style={{
          marginTop: isFirst ? 0 : tokens.spacing.xl,
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: section.title ? tokens.spacing.sm : 0,
        }}
      >
        {section.title ? (
          <ThemedText type="caption" tone="tertiary" style={styles.title}>
            {section.title}
          </ThemedText>
        ) : null}
      </View>
    );
  };

  const renderSectionFooter = ({
    section,
  }: {
    section: SectionListData<ListItem, ListSection>;
  }): ReactElement | null => {
    if (!section.footer) {
      return null;
    }
    return (
      <ThemedText
        type="caption"
        tone="tertiary"
        style={{
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.sm,
        }}
      >
        {section.footer}
      </ThemedText>
    );
  };

  return (
    <SectionList<ListItem, ListSection>
      sections={sections}
      keyExtractor={getItemKey}
      stickySectionHeadersEnabled={false}
      style={{ backgroundColor: tokens.color.background.canvas }}
      contentContainerStyle={[styles.container, { padding: tokens.spacing.xl }]}
      ListHeaderComponent={ListHeaderComponent}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      ItemSeparatorComponent={RowSeparator}
      renderItem={({ item, index, section }) => (
        <ListItemRow
          item={item}
          iconSlotReserved={section.iconSlotReserved ?? false}
          isFirst={index === 0}
          isLast={index === section.data.length - 1}
        />
      )}
    />
  );
}

interface SeparatorProps {
  section: SectionListData<ListItem, ListSection>;
}

/**
 * 島内の行間 separator。島は行レベルの border で組むため、separator 自身も
 * surface 背景 + 左右 border を持ち、内側に inset した hairline を描く。
 */
function RowSeparator({ section }: SeparatorProps): ReactElement {
  const { tokens } = useTheme();
  const iconSlotReserved = section.iconSlotReserved ?? false;
  const inset = tokens.spacing.lg + (iconSlotReserved ? ICON_SLOT_WIDTH + ICON_GAP : 0);
  return (
    <View
      style={{
        backgroundColor: tokens.color.background.surface,
        borderColor: tokens.color.border.subtle,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderRightWidth: StyleSheet.hairlineWidth,
      }}
    >
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          marginLeft: inset,
          backgroundColor: tokens.color.border.subtle,
        }}
      />
    </View>
  );
}

// FlatList / SectionList の keyExtractor と同じ paradigm:
// item.href があれば href から、無ければ index にフォールバックする。
function getItemKey(item: ListItem, index: number): string {
  if (item.disabled) {
    return `disabled:${index}`;
  }
  const path = typeof item.href === "string" ? item.href : item.href.pathname;
  return `href:${path}`;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  title: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
