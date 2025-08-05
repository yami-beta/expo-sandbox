import { Ionicons } from "@expo/vector-icons";
import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { useThemeContext } from "../../theme/ThemeContext";

export type LinkItem = {
  href: LinkProps["href"];
  text: ReactNode;
};

type LinkListProps = {
  data: readonly LinkItem[];
};

export function LinkList({ data }: LinkListProps): ReactElement {
  const { theme } = useThemeContext();

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <LinkListItem {...item} />}
      keyExtractor={(item) => item.href.toString()}
      contentContainerStyle={styles.container}
      style={{ backgroundColor: theme.colors.background }}
    />
  );
}

function LinkListItem({ href, text }: LinkItem): ReactElement {
  const { theme } = useThemeContext();

  return (
    <Link href={href} asChild>
      <Pressable style={styles.item}>
        <Text style={[styles.itemText, { color: theme.colors.text }]}>
          {text}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
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
  itemText: {
    fontSize: 20,
  },
});
