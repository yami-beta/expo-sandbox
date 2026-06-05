import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";

export const ICON_SLOT_WIDTH = 28;
export const ICON_GAP = 12;
// iOS 44pt / Android 48dp のうち厳しい 48 に全 OS 統一 (Button の MIN_TOUCH_TARGET と揃える)
const MIN_ROW_HEIGHT = 48;

interface CommonItemFields {
  text: ReactNode;
  description?: ReactNode;
  leadingIcon?: ReactNode;
  trailingBadge?: ReactNode;
}

export type ListItem =
  | (CommonItemFields & {
      href: LinkProps["href"];
      disabled?: false;
    })
  | (CommonItemFields & {
      disabled: true;
    });

interface ListItemRowProps {
  item: ListItem;
  iconSlotReserved: boolean;
  /** セクション内で先頭の行か (上角丸 + 上辺 border を付ける) */
  isFirst: boolean;
  /** セクション内で末尾の行か (下角丸 + 下辺 border を付ける) */
  isLast: boolean;
}

/**
 * grouped list の 1 行。SectionList の renderItem から呼ばれる。
 * SectionList はセクション全体を 1 枚の View で包めないため、島 (角丸 + border) は
 * 行レベルで組む: 全行に左右 border + surface、先頭行に上角丸/上辺、末尾行に下角丸/下辺。
 * (公開型 `ListItem` と値の名前衝突を避けるため、コンポーネントは `ListItemRow` とする)
 */
export function ListItemRow({
  item,
  iconSlotReserved,
  isFirst,
  isLast,
}: ListItemRowProps): ReactElement {
  const { tokens } = useTheme();
  const islandStyle = useIslandRowStyle(isFirst, isLast);

  if (item.disabled) {
    return (
      // disabled 行は Pressable を介さない素の View。accessible を付けて行を 1 要素に
      // 束ね (iOS: isAccessibilityElement / Android: focusable = RN 標準のグルーピング手段)、
      // 子の text / description (+ badge) を連結読み上げさせ、無効状態を SR に伝える。
      // Touchable は既定で accessible のためリンク行では不要で、ここも accessible のネストは起きない。
      <View
        accessible={true}
        accessibilityState={{ disabled: true }}
        style={[
          styles.row,
          islandStyle,
          { backgroundColor: tokens.color.background.surface, ...rowPadding(tokens.spacing.lg) },
        ]}
      >
        <RowContent item={item} iconSlotReserved={iconSlotReserved} disabled />
      </View>
    );
  }

  // 行のグルーピングと role は明示指定しない:
  // - Pressable は accessible 既定 true で子の Text を 1 要素に自動連結する。
  // - expo-router の Link が role="link" を Slot 経由で Pressable に付与する
  //   (TextLink の冗長 role 削除と同じ理屈)。明示すると二重指定になる。
  return (
    <Link href={item.href} asChild>
      <Pressable>
        {({ pressed }) => (
          <View
            style={[
              styles.row,
              islandStyle,
              {
                backgroundColor: pressed
                  ? tokens.color.background.pressed
                  : tokens.color.background.surface,
                ...rowPadding(tokens.spacing.lg),
              },
            ]}
          >
            <RowContent item={item} iconSlotReserved={iconSlotReserved} disabled={false} />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={tokens.color.text.tertiary}
              style={styles.chevron}
              // chevron は装飾。グリフ名の二重読み上げを防ぐため SR から隠す。
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

/**
 * 行を島に見せるための border / 角丸スタイル。
 * light/dark とも hairline border + surface に統一し shadow は使わない
 * (SectionList ではセクション全体に 1 枚の shadow を出せないため)。
 */
function useIslandRowStyle(isFirst: boolean, isLast: boolean): ViewStyle {
  const { tokens } = useTheme();
  const borderColor = tokens.color.border.subtle;
  return {
    borderColor,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    ...(isFirst
      ? {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopLeftRadius: tokens.radius.lg,
          borderTopRightRadius: tokens.radius.lg,
        }
      : null),
    ...(isLast
      ? {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomLeftRadius: tokens.radius.lg,
          borderBottomRightRadius: tokens.radius.lg,
        }
      : null),
  };
}

const rowPadding = (horizontal: number): ViewStyle => ({
  minHeight: MIN_ROW_HEIGHT,
  paddingHorizontal: horizontal,
  paddingVertical: 10,
});

interface RowContentProps {
  item: CommonItemFields;
  iconSlotReserved: boolean;
  disabled: boolean;
}

function RowContent({ item, iconSlotReserved, disabled }: RowContentProps): ReactElement {
  const textTone = disabled ? "disabled" : "primary";
  const descriptionTone = disabled ? "disabled" : "secondary";

  return (
    <>
      {iconSlotReserved ? (
        <View style={[styles.iconSlot, { marginRight: ICON_GAP }]}>{item.leadingIcon ?? null}</View>
      ) : null}
      <View style={styles.textCol}>
        <ThemedText type="body" tone={textTone}>
          {item.text}
        </ThemedText>
        {item.description ? (
          <ThemedText type="caption" tone={descriptionTone}>
            {item.description}
          </ThemedText>
        ) : null}
      </View>
      {item.trailingBadge ? <View style={styles.trailingSlot}>{item.trailingBadge}</View> : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSlot: {
    width: ICON_SLOT_WIDTH,
    height: ICON_SLOT_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  trailingSlot: {
    marginLeft: 12,
  },
  chevron: {
    marginLeft: 8,
  },
});
