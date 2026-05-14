import { Pressable, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import type { ThemeMode } from "../../../theme/ThemeContext";
import { useTheme } from "../../../theme/useTheme";
import { useThemeMode } from "../../../theme/useThemeMode";
import { useLingui } from "@lingui/react/macro";

export default function ThemeScreen() {
  const { mode, setMode } = useThemeMode();
  const { colors } = useTheme();
  const { t } = useLingui();

  const options: { value: ThemeMode; label: string }[] = [
    { value: "system", label: t`システム設定に従う` },
    { value: "light", label: t`ライト` },
    { value: "dark", label: t`ダーク` },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen.Title>{t`テーマ`}</Stack.Screen.Title>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.option,
            {
              backgroundColor: mode === option.value ? colors.primary : colors.backgroundHeader,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setMode(option.value)}
        >
          <Text
            style={[
              styles.optionText,
              {
                color: mode === option.value ? colors.onPrimary : colors.text,
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
