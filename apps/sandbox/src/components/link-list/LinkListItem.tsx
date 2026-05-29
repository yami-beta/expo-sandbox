import { Ionicons } from "@expo/vector-icons";
import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";

export const ICON_SLOT_WIDTH = 28;
export const ICON_GAP = 12;
const MIN_ROW_HEIGHT = 44;

interface CommonItemFields {
  text: ReactNode;
  description?: ReactNode;
  leadingIcon?: ReactNode;
  trailingBadge?: ReactNode;
}

export type LinkItem =
  | (CommonItemFields & {
      href: LinkProps["href"];
      disabled?: false;
    })
  | (CommonItemFields & {
      disabled: true;
    });

interface LinkListItemProps {
  item: LinkItem;
  iconSlotReserved: boolean;
}

export function LinkListItem({ item, iconSlotReserved }: LinkListItemProps): ReactElement {
  if (item.disabled) {
    return <DisabledRow item={item} iconSlotReserved={iconSlotReserved} />;
  }
  return <LinkRow item={item} iconSlotReserved={iconSlotReserved} />;
}

interface LinkRowProps {
  item: CommonItemFields & { href: LinkProps["href"] };
  iconSlotReserved: boolean;
}

function LinkRow({ item, iconSlotReserved }: LinkRowProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <Link href={item.href} asChild>
      <Pressable>
        {({ pressed }) => (
          <View
            style={[
              styles.row,
              {
                minHeight: MIN_ROW_HEIGHT,
                paddingHorizontal: tokens.spacing.lg,
                paddingVertical: 10,
                backgroundColor: pressed ? tokens.color.background.pressed : "transparent",
              },
            ]}
          >
            <RowContent item={item} iconSlotReserved={iconSlotReserved} disabled={false} />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={tokens.color.text.tertiary}
              style={styles.chevron}
            />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

interface DisabledRowProps {
  item: CommonItemFields;
  iconSlotReserved: boolean;
}

function DisabledRow({ item, iconSlotReserved }: DisabledRowProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          minHeight: MIN_ROW_HEIGHT,
          paddingHorizontal: tokens.spacing.lg,
          paddingVertical: 10,
        },
      ]}
    >
      <RowContent item={item} iconSlotReserved={iconSlotReserved} disabled />
    </View>
  );
}

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
          <ThemedText type="caption" tone={descriptionTone} style={styles.description}>
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
  },
  description: {
    marginTop: 2,
  },
  trailingSlot: {
    marginLeft: 12,
  },
  chevron: {
    marginLeft: 8,
  },
});
