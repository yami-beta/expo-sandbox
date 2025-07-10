import { Ionicons } from "@expo/vector-icons";
import { Link, type LinkProps } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { useThemeContext } from "../../../theme/ThemeContext";

const list = [
  {
    href: "/settings/theme",
    text: "テーマ",
  },
] as const satisfies ItemProps[];

export default function SettingsScreen() {
  const { theme } = useThemeContext();

  return (
    <FlatList
      data={list}
      renderItem={({ item }) => <Item {...item} />}
      keyExtractor={(item) => item.href}
      contentContainerStyle={styles.container}
      style={{ backgroundColor: theme.colors.background }}
    />
  );
}

type ItemProps = {
  href: LinkProps["href"];
  text: string;
};

export function Item({ href, text }: ItemProps) {
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
    padding: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 20,
  },
});
