import { NativeTabs } from "expo-router/unstable-native-tabs";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { useLingui } from "@lingui/react/macro";
import { useTheme } from "../../theme/useTheme";

export default function TabLayout() {
  const { colors, colorScheme } = useTheme();
  const { t } = useLingui();

  // iOS 26 のダークモードで NativeTabs の liquid glass ヘッダーが
  // ちらつく問題への対処。React Navigation のテーマをカラースキームに揃える。
  // 参照: https://docs.expo.dev/router/advanced/native-tabs/#common-problems
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs
        backgroundColor={colors.background}
        tintColor={colors.text}
        iconColor={{ default: colors.textSecondary, selected: colors.text }}
        labelStyle={{
          default: { color: colors.textSecondary },
          selected: { color: colors.text, fontWeight: "600" },
        }}
        indicatorColor={colors.backgroundElement}
      >
        <NativeTabs.Trigger name="(home)">
          <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
          <NativeTabs.Trigger.Label>{t`ホーム`}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="tab-a">
          <NativeTabs.Trigger.Icon
            sf={{ default: "a.circle", selected: "a.circle.fill" }}
            md="looks_one"
          />
          <NativeTabs.Trigger.Label>{t`タブA`}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="tab-b">
          <NativeTabs.Trigger.Icon
            sf={{ default: "b.circle", selected: "b.circle.fill" }}
            md="looks_two"
          />
          <NativeTabs.Trigger.Label>{t`タブB`}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Icon
            sf={{ default: "gearshape", selected: "gearshape.fill" }}
            md="settings"
          />
          <NativeTabs.Trigger.Label>{t`設定`}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
