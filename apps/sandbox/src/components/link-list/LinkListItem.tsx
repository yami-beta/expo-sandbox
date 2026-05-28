import { Ionicons } from "@expo/vector-icons";
import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";

export const ICON_SLOT_WIDTH = 28;
export const ICON_GAP = 12;
const MIN_ROW_HEIGHT = 44;

export type LinkItem = {
  href: LinkProps["href"];
  text: ReactNode;
  description?: ReactNode;
  leadingIcon?: ReactNode;
  trailingBadge?: ReactNode;
  disabled?: boolean;
};

interface LinkListItemProps extends LinkItem {
  iconSlotReserved?: boolean;
}

export function LinkListItem({
  href,
  text,
  description,
  leadingIcon,
  trailingBadge,
  disabled,
  iconSlotReserved,
}: LinkListItemProps): ReactElement {
  const { tokens } = useTheme();

  const textTone = disabled ? "disabled" : "primary";
  const descriptionTone = disabled ? "disabled" : "secondary";

  return (
    <Link href={href} asChild>
      <Pressable disabled={disabled} accessibilityState={{ disabled: !!disabled }}>
        {({ pressed }) => (
          <View
            style={[
              styles.row,
              {
                minHeight: MIN_ROW_HEIGHT,
                paddingHorizontal: tokens.spacing.lg,
                paddingVertical: 10,
                backgroundColor:
                  pressed && !disabled ? tokens.color.background.pressed : "transparent",
              },
            ]}
          >
            {iconSlotReserved ? (
              <View style={[styles.iconSlot, { marginRight: ICON_GAP }]}>
                {leadingIcon ?? null}
              </View>
            ) : null}
            <View style={styles.textCol}>
              <ThemedText type="body" tone={textTone}>
                {text}
              </ThemedText>
              {description ? (
                <ThemedText type="caption" tone={descriptionTone} style={styles.description}>
                  {description}
                </ThemedText>
              ) : null}
            </View>
            {trailingBadge ? <View style={styles.trailingSlot}>{trailingBadge}</View> : null}
            {!disabled ? (
              <Ionicons
                name="chevron-forward"
                size={16}
                color={tokens.color.text.tertiary}
                style={styles.chevron}
              />
            ) : null}
          </View>
        )}
      </Pressable>
    </Link>
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
