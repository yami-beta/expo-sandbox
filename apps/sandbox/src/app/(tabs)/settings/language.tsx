import { Pressable, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import type { LocalePreference } from "../../../i18n";
import { useTheme } from "../../../theme/useTheme";
import { useLocale } from "../../../i18n/useLocale";
import { useLingui } from "@lingui/react/macro";

export default function LanguageScreen() {
  const { preference, setPreference } = useLocale();
  const { colors } = useTheme();
  const { t } = useLingui();

  // 言語名「日本語」「English」は翻訳対象外の固有表記（自言語表記が UX 上自然）
  const options: { value: LocalePreference; label: string }[] = [
    { value: "system", label: t`システム設定に従う` },
    { value: "ja", label: "日本語" },
    { value: "en", label: "English" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen.Title>{t`言語`}</Stack.Screen.Title>
      {/* iOS の戻るボタンのラベルは「現在画面の headerBackTitle」で、未指定だと
          前画面タイトルを既定参照する。だがその既定参照は言語切替時に表示中のボタンへ
          即座に反映されない（前画面の title 変更を UIKit がライブ更新しないため）。
          現在画面のオプションとして明示することで、タイトルと同様 reactive に更新させる。 */}
      <Stack.Screen.BackButton>{t`設定`}</Stack.Screen.BackButton>
      <View accessibilityRole="radiogroup">
        {options.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: preference === option.value }}
            style={[
              styles.option,
              {
                backgroundColor:
                  preference === option.value ? colors.primary : colors.backgroundHeader,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setPreference(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: preference === option.value ? colors.onPrimary : colors.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
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
