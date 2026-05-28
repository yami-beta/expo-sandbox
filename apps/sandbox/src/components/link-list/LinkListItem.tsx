import { Ionicons } from "@expo/vector-icons";
import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";

export type LinkItem = {
  href: LinkProps["href"];
  text: ReactNode;
  description?: ReactNode;
  leadingIcon?: ReactNode;
  trailingBadge?: ReactNode;
  disabled?: boolean;
};

interface LinkListItemProps extends LinkItem {
  showTopSeparator?: boolean;
}

export function LinkListItem({
  href,
  text,
  description,
  leadingIcon,
  trailingBadge,
  disabled,
  showTopSeparator,
}: LinkListItemProps): ReactElement {
  const { tokens } = useTheme();

  const textTone = disabled ? "disabled" : "primary";
  const descriptionTone = disabled ? "disabled" : "secondary";

  return (
    <Link href={href} asChild>
      <Pressable
        disabled={disabled}
        accessibilityState={{ disabled: !!disabled }}
        style={({ pressed }) => [
          styles.row,
          {
            paddingHorizontal: tokens.spacing.lg,
            backgroundColor: pressed && !disabled ? tokens.color.background.pressed : "transparent",
          },
        ]}
      >
        {leadingIcon ? (
          <View
            style={[
              styles.iconSlot,
              { marginRight: tokens.spacing.md, paddingVertical: tokens.spacing.md },
            ]}
          >
            {leadingIcon}
          </View>
        ) : null}
        <View
          style={[
            styles.contentArea,
            { paddingVertical: tokens.spacing.md },
            showTopSeparator && {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: tokens.color.border.subtle,
            },
          ]}
        >
          <View style={styles.textCol}>
            <ThemedText type="headline" tone={textTone}>
              {text}
            </ThemedText>
            {description ? (
              <ThemedText type="caption" tone={descriptionTone}>
                {description}
              </ThemedText>
            ) : null}
          </View>
          {trailingBadge ? <View style={styles.trailingSlot}>{trailingBadge}</View> : null}
          {!disabled ? (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={tokens.color.text.tertiary}
              style={styles.chevron}
            />
          ) : null}
        </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  contentArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  trailingSlot: {
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 8,
  },
});
