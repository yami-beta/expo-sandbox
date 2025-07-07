import { Ionicons } from "@expo/vector-icons";
import { Link, type LinkProps } from "expo-router";
import { FlatList, Pressable, Text } from "react-native";

const list = [
  {
    href: "/settings/theme",
    text: "テーマ",
  },
] as const satisfies ItemProps[];

export default function SettingsScreen() {
  return (
    <FlatList
      data={list}
      renderItem={({ item }) => <Item {...item} />}
      keyExtractor={(item) => item.href}
      contentContainerStyle={{
        padding: 16,
      }}
    />
  );
}

type ItemProps = {
  href: LinkProps["href"];
  text: string;
};

export function Item({ href, text }: ItemProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 20 }}>{text}</Text>
        <Ionicons name="chevron-forward" size={20} />
      </Pressable>
    </Link>
  );
}
