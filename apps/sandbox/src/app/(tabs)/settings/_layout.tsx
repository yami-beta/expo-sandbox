import { Stack } from "expo-router";
import { useThemeContext } from "../../../theme/ThemeContext";
import { useLingui } from "@lingui/react/macro";

export default function SettingsLayout() {
  const { theme } = useThemeContext();
  const { t } = useLingui();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: !theme.dark,
      }}
    >
      <Stack.Screen name="index" options={{ title: t`設定` }} />
      <Stack.Screen name="theme" options={{ title: t`テーマ` }} />
    </Stack>
  );
}
