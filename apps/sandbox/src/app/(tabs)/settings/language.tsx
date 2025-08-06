import { Feather } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  getCurrentLocale,
  changeLocale,
  locales,
  type Locale,
} from "../../../i18n";
import { useState } from "react";

interface LanguageItem {
  value: Locale;
  label: string;
}

export default function LanguageSettingsScreen() {
  const theme = useTheme();
  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale());

  const languages: LanguageItem[] = Object.entries(locales).map(
    ([value, label]) => ({
      value: value as Locale,
      label,
    }),
  );

  const handleLanguageSelect = (locale: Locale) => {
    changeLocale(locale);
    setCurrentLocale(locale);
  };

  const renderItem = ({ item }: { item: LanguageItem }) => {
    const isSelected = currentLocale === item.value;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.item,
          {
            backgroundColor: pressed ? theme.colors.border : theme.colors.card,
          },
        ]}
        onPress={() => handleLanguageSelect(item.value)}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {item.label}
        </Text>
        {isSelected && (
          <Feather name="check" size={20} color={theme.colors.primary} />
        )}
      </Pressable>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={languages}
        renderItem={renderItem}
        keyExtractor={(item) => item.value}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: theme.colors.border }]}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  label: {
    fontSize: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
});
