import { Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeContext, type ThemeMode } from "../../../theme/ThemeContext";
import { useLingui } from "@lingui/react/macro";

export default function ThemeScreen() {
  const { mode, setMode, theme } = useThemeContext();
  const { t } = useLingui();

  const options: { value: ThemeMode; label: string }[] = [
    { value: "system", label: t`システム設定に従う` },
    { value: "light", label: t`ライト` },
    { value: "dark", label: t`ダーク` },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.option,
            {
              backgroundColor: mode === option.value ? theme.colors.primary : theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => setMode(option.value)}
        >
          <Text
            style={[
              styles.optionText,
              {
                color: mode === option.value ? (theme.dark ? "#000" : "#fff") : theme.colors.text,
              },
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  option: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
