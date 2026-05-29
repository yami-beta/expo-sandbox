import { Fragment, type ReactElement, type ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";
import { ICON_GAP, ICON_SLOT_WIDTH, type LinkItem, LinkListItem } from "./LinkListItem";

export { type LinkItem } from "./LinkListItem";

export interface LinkSection {
  title?: ReactNode;
  footer?: ReactNode;
  /**
   * セクション内に leadingIcon を持つ項目が 1 つでもある場合は true を指定する。
   * 配下の全項目で text の開始位置が icon slot の右に揃い、separator のインセットも同じ位置から始まる。
   */
  iconSlotReserved?: boolean;
  data: readonly LinkItem[];
}

interface LinkListProps {
  sections: readonly LinkSection[];
}

export function LinkList({ sections }: LinkListProps): ReactElement {
  const { colorScheme, tokens } = useTheme();

  const islandSurface = {
    backgroundColor: tokens.color.background.surface,
    borderRadius: tokens.radius.lg,
    ...(colorScheme === "dark"
      ? {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: tokens.color.border.subtle,
        }
      : tokens.shadow.sm),
  };

  return (
    <ScrollView
      style={{ backgroundColor: tokens.color.background.canvas }}
      contentContainerStyle={[
        styles.container,
        { padding: tokens.spacing.xl, gap: tokens.spacing.xl },
      ]}
    >
      {sections.map((section, sectionIndex) => {
        const iconSlotReserved = section.iconSlotReserved ?? false;
        const separatorInset =
          tokens.spacing.lg + (iconSlotReserved ? ICON_SLOT_WIDTH + ICON_GAP : 0);
        return (
          <View key={sectionIndex}>
            {section.title ? (
              <ThemedText
                type="caption"
                tone="tertiary"
                style={[
                  styles.title,
                  { paddingHorizontal: tokens.spacing.lg, paddingBottom: tokens.spacing.sm },
                ]}
              >
                {section.title}
              </ThemedText>
            ) : null}

            <View style={[styles.island, islandSurface]}>
              {section.data.map((item, itemIndex) => (
                <Fragment key={getItemKey(item, itemIndex)}>
                  {itemIndex > 0 ? (
                    <View
                      style={{
                        height: StyleSheet.hairlineWidth,
                        marginLeft: separatorInset,
                        backgroundColor: tokens.color.border.subtle,
                      }}
                    />
                  ) : null}
                  <LinkListItem item={item} iconSlotReserved={iconSlotReserved} />
                </Fragment>
              ))}
            </View>

            {section.footer ? (
              <ThemedText
                type="caption"
                tone="tertiary"
                style={{ paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.sm }}
              >
                {section.footer}
              </ThemedText>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

// FlatList / SectionList の keyExtractor と同じ paradigm:
// item.href があれば href から、無ければ index にフォールバックする。
function getItemKey(item: LinkItem, index: number): string {
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
  island: {
    overflow: "hidden",
  },
});
