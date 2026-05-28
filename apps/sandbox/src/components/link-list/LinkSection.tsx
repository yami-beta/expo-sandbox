import type { ReactElement, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";
import { type LinkItem, LinkListItem } from "./LinkListItem";

interface LinkSectionProps {
  title?: ReactNode;
  footer?: ReactNode;
  data: readonly LinkItem[];
}

export function LinkSection({ title, footer, data }: LinkSectionProps): ReactElement {
  const { colorScheme, tokens } = useTheme();

  const islandStyle = {
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
    <View>
      {title ? (
        <ThemedText
          type="caption"
          tone="tertiary"
          style={[
            styles.title,
            { paddingHorizontal: tokens.spacing.lg, paddingBottom: tokens.spacing.sm },
          ]}
        >
          {title}
        </ThemedText>
      ) : null}

      <View style={[styles.island, islandStyle]}>
        {data.map((item, index) => {
          const hrefKey = typeof item.href === "string" ? item.href : item.href.pathname;
          return (
            <LinkListItem key={`${index}-${hrefKey}`} {...item} showTopSeparator={index > 0} />
          );
        })}
      </View>

      {footer ? (
        <ThemedText
          type="caption"
          tone="tertiary"
          style={{ paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.sm }}
        >
          {footer}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  island: {
    overflow: "hidden",
  },
});
