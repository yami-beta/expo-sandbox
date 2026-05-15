import { Stack } from "expo-router";
import { useTheme } from "../../../theme/useTheme";
import { buildStackScreenOptions } from "../../../theme/navigationScreenOptions";

export default function HomeLayout() {
  const { colorScheme, colors } = useTheme();

  return <Stack screenOptions={buildStackScreenOptions(colors, colorScheme)} />;
}
