import { Stack } from "expo-router";
import { useTheme } from "../../../theme/useTheme";
import { buildStackScreenOptions } from "../../../theme/navigationScreenOptions";

export default function SettingsLayout() {
  const { colorScheme, tokens } = useTheme();

  return <Stack screenOptions={buildStackScreenOptions(tokens.color, colorScheme)} />;
}
