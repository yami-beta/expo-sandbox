import { Stack } from "expo-router";
import { useThemeContext } from "../../../theme/ThemeContext";

export default function HomeLayout() {
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
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="navigation-patterns"
        options={{ title: "Navigation Patterns" }}
      />
    </Stack>
  );
}
