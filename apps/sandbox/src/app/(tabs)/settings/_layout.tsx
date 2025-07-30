import { Stack } from "expo-router";
import { useThemeContext } from "../../../theme/ThemeContext";

export default function SettingsLayout() {
  const { theme } = useThemeContext();

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
      <Stack.Screen name="index" options={{ title: "設定" }} />
      <Stack.Screen name="theme" options={{ title: "テーマ" }} />
    </Stack>
  );
}
