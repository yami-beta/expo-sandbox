import { Ionicons } from "@expo/vector-icons";
import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";

export type LinkItem = {
  href: LinkProps["href"];
  text: ReactNode;
};

type LinkListProps = {
  data: readonly LinkItem[];
};

export function LinkList({ data }: LinkListProps): ReactElement {
  const { colors } = useTheme();

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <LinkListItem {...item} />}
      keyExtractor={(item) => (typeof item.href === "string" ? item.href : item.href.pathname)}
      contentContainerStyle={styles.container}
      style={{ backgroundColor: colors.background }}
    />
  );
}

function LinkListItem({ href, text }: LinkItem): ReactElement {
  const { colors } = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable style={styles.item}>
        <ThemedText type="subtitle">{text}</ThemedText>
        <Ionicons name="chevron-forward" size={20} color={colors.text} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
});
