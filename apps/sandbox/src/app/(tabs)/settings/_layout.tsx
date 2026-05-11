import { Stack } from "expo-router";
import { useTheme } from "../../../theme/useTheme";
import { buildStackScreenOptions } from "../../../theme/navigationScreenOptions";
import { useLingui } from "@lingui/react/macro";

export default function SettingsLayout() {
  const { colorScheme, colors } = useTheme();
  const { t } = useLingui();

  return (
    <Stack screenOptions={buildStackScreenOptions(colors, colorScheme)}>
      <Stack.Screen name="index" options={{ title: t`設定` }} />
      <Stack.Screen name="theme" options={{ title: t`テーマ` }} />
    </Stack>
  );
}
